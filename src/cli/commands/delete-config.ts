import { Command, CommandOptions } from "../types";
import { Console, Prompt } from "../utils";
import fs from "fs";
import path from "path";
import shell from "shelljs";
import { rmdirSync, rmFileSync } from "../../utils";
import { mysqlUser, mysqlPassword, mysqlHost, mysqlPort } from "../../constants";

/**
 * 模块配置接口
 */
interface ModuleConfig {
  controller: string;
  action?: string;
  dictionary?: string;
  fields: any[];
}

/**
 * 删除路径接口
 */
interface DeletePaths {
  destPagesController: string;
  destClientReduxController: string;
  destClientServiceController: string;
  destClientStyledController: string;
  destServerModulesController: string;
  destServerApisController: string;
  destServerSqlController: string;
  destServerDataLoader: string;
  destClientReduxReducersAllPath: string;
  destServerRestPath: string;
  destClientUtilsMenuPath: string;
  destI18nZhCN: string;
  destI18nEnUS: string;
  destI18nJaJP: string;
}

/**
 * 生成删除路径
 */
const generateDeletePaths = (controller: string, dictionary?: string): DeletePaths => {
  const basePath = dictionary || process.cwd();

  return {
    destPagesController: path.join(basePath, "pages", controller),
    destClientReduxController: path.join(basePath, "client", "redux", controller),
    destClientServiceController: path.join(basePath, "client", "service", controller),
    destClientStyledController: path.join(basePath, "client", "styled", controller),
    destServerModulesController: path.join(basePath, "server", "modules", controller),
    destServerApisController: path.join(basePath, "server", "apis", `${controller}.js`),
    destServerSqlController: path.join(basePath, "server", "sql", `${controller}.sql`),
    destServerDataLoader: path.join(basePath, "server", "dataloaders", `${controller}-dataloader.ts`),
    destClientReduxReducersAllPath: path.join(basePath, "client", "redux", "reducers.ts"),
    destServerRestPath: path.join(basePath, "server", "rest.js"),
    destClientUtilsMenuPath: path.join(basePath, "client", "utils", "menu.tsx"),
    destI18nZhCN: path.join(basePath, "public", "locales", "zh-CN", `${controller}.json`),
    destI18nEnUS: path.join(basePath, "public", "locales", "en-US", `${controller}.json`),
    destI18nJaJP: path.join(basePath, "public", "locales", "ja-JP", `${controller}.json`),
  };
};

/**
 * 删除文件和目录
 */
const deleteModuleFiles = (paths: DeletePaths): void => {
  const directoriesToDelete = [
    paths.destPagesController,
    paths.destClientReduxController,
    paths.destClientServiceController,
    paths.destClientStyledController,
    paths.destServerModulesController,
  ];

  const filesToDelete = [
    paths.destServerApisController,
    paths.destServerSqlController,
    paths.destServerDataLoader,
    paths.destI18nZhCN,
    paths.destI18nEnUS,
    paths.destI18nJaJP,
  ];

  directoriesToDelete.forEach((dir) => rmdirSync(dir));
  filesToDelete.forEach((file) => rmFileSync(file));
};

/**
 * 清理 reducers 配置
 */
const cleanupReducers = (controller: string, reducersPath: string): void => {
  // 删除 import 语句
  shell.sed("-i", new RegExp(`^.*import.*from.*['"].*\\/${controller}\\/.*['"].*$`, "gm"), "", reducersPath);

  // 删除 export 对象中的属性行
  shell.sed("-i", new RegExp(`^\\s*${controller}\\w*:\\s*${controller}\\w*Reducer,?\\s*$`, "gm"), "", reducersPath);

  // 修复连续逗号
  shell.sed("-i", /,,+/g, ",", reducersPath);

  // 修复对象末尾的逗号
  shell.sed("-i", /,(\s*\n\s*\})/, "$1", reducersPath);

  // 移除空对象中的逗号
  shell.sed("-i", /\{\s*,\s*\}/, "{}", reducersPath);

  // 标准化空行
  shell.sed("-i", /\n\s*\n\s*\n/g, "\n\n", reducersPath);
};

/**
 * 清理菜单配置
 */
const cleanupMenu = (controller: string, menuPath: string): void => {
  // 删除所有匹配的菜单项
  shell.sed(
    "-i",
    new RegExp(
      `,?\\s*\\{\\s*//\\s*${controller}_\\w+_start[\\s\\S]*?//\\s*${controller}_\\w+_end\\s*\\n\\s*\\}\\s*,?`,
      "gm"
    ),
    "",
    menuPath
  );

  // 修复连续逗号
  shell.sed("-i", /,,+/g, ",", menuPath);

  // 修复对象前多余的逗号
  shell.sed("-i", /\n\s*,\s*\{/gm, "\n  {", menuPath);

  // 修复数组中缺失的逗号
  shell.sed("-i", /(\})\s*(\{)/gm, "$1,\n  $2", menuPath);

  // 清理缩进问题
  shell.sed("-i", /^[ ]{0,2}\/\*\{/gm, "    /*{", menuPath);
  shell.sed("-i", /^[ ]{0,4}key:/gm, "      key:", menuPath);
  shell.sed("-i", /^[ ]{0,4}text:/gm, "      text:", menuPath);
  shell.sed("-i", /^[ ]{0,4}url:/gm, "      url:", menuPath);
  shell.sed("-i", /^[ ]{0,4}icon:/gm, "      icon:", menuPath);
  shell.sed("-i", /^[ ]{0,4}subMenus:/gm, "      subMenus:", menuPath);
  shell.sed("-i", /^[ ]{0,2}\}\*\//gm, "    }*/", menuPath);
};

/**
 * 清理 REST API 配置
 */
const cleanupRestApi = (controller: string, restPath: string): void => {
  // 删除 require 语句
  shell.sed("-i", new RegExp(`^const\\s+${controller}\\s*=\\s*require.*${controller}['"].*$`, "gm"), "", restPath);

  // 删除 router.use 语句
  shell.sed(
    "-i",
    new RegExp(`^router\\.use\\(['"]\\/${controller}['"]\\s*,\\s*${controller}\\)\\s*$`, "gm"),
    "",
    restPath
  );
};

/**
 * 删除数据库表
 */
const dropDatabaseTable = (controller: string): void => {
  try {
    // 创建临时的 DROP TABLE SQL
    const dropSql = `DROP TABLE IF EXISTS \`${controller}\`;`;
    const mysqlCommand = `mysql -u${mysqlUser} -p${mysqlPassword} -h${mysqlHost} -P${mysqlPort} -e "${dropSql}"`;
    shell.exec(mysqlCommand);
    Console.info(`已删除数据库表: ${controller}`);
  } catch (error) {
    Console.error(`删除数据库表失败: ${error}`);
  }
};

/**
 * 从配置文件删除命令
 */
export const deleteConfigCommand: Command = {
  name: "delete-config",
  aliases: ["-dc", "--delete-config"],
  description: "从配置文件批量删除模块",
  usage: "nsgm delete-config <config-file> [options]",
  examples: [
    "nsgm delete-config config/modules.json",
    "nsgm delete-config config/modules.json --module product",
    "nsgm delete-config config/modules.json --all",
  ],
  options: [
    {
      name: "module",
      description: "指定要删除的模块名称（如果不指定则删除所有）",
      required: false,
      type: "string",
    },
    {
      name: "all",
      description: "删除配置文件中的所有模块",
      required: false,
      type: "boolean",
    },
    {
      name: "db",
      description: "同时删除数据库表",
      required: false,
      type: "boolean",
    },
    {
      name: "dry-run",
      description: "预览模式，只显示将要删除的模块而不实际删除",
      required: false,
      type: "boolean",
    },
    {
      name: "force",
      description: "强制删除，不提示确认",
      required: false,
      type: "boolean",
    },
  ],
  execute: async (options: CommandOptions) => {
    try {
      // 获取配置文件路径
      const args = process.argv.slice(2);

      // 跳过命令名和别名
      let configPathIndex = 0;
      const commandNames = ["delete-config", "-dc", "--delete-config"];

      while (configPathIndex < args.length && commandNames.includes(args[configPathIndex])) {
        configPathIndex++;
      }

      if (configPathIndex >= args.length || args[configPathIndex].startsWith("-")) {
        Console.error("请指定配置文件路径");
        Console.info("使用方法:");
        Console.info("  nsgm delete-config <config-file> [--module <name>]");
        Console.info("  nsgm delete-config <config-file> [--all] [--db]");
        Console.info("");
        Console.info("示例:");
        Console.info("  nsgm delete-config config/modules.json");
        Console.info("  nsgm delete-config config/modules.json --module category");
        Console.info("  nsgm delete-config config/modules.json --all --db");
        process.exit(1);
      }

      const configPath = args[configPathIndex];

      // 检查配置文件是否存在
      if (!fs.existsSync(configPath)) {
        Console.error(`配置文件不存在: ${configPath}`);
        process.exit(1);
      }

      // 读取配置文件
      const configContent = fs.readFileSync(configPath, "utf8");
      const config = JSON.parse(configContent);

      // 验证配置格式
      if (!Array.isArray(config)) {
        Console.error("配置文件格式错误：必须是一个数组");
        process.exit(1);
      }

      // 解析目标模块
      let targetModules: ModuleConfig[] = [];

      if (options.module && typeof options.module === "string") {
        // 删除指定模块
        const targetModule = config.find((m: ModuleConfig) => m.controller === options.module);
        if (!targetModule) {
          Console.error(`未找到模块: ${options.module}`);
          Console.info(`可用的模块: ${config.map((m: ModuleConfig) => m.controller).join(", ")}`);
          process.exit(1);
        }
        targetModules = [targetModule];
      } else {
        // 删除所有模块
        targetModules = config;
      }

      // 预览模式
      if (options.dryRun) {
        Console.title("📋 预览模式");
        Console.newLine();
        Console.info("将要删除的模块:");
        Console.newLine();

        targetModules.forEach((module, index) => {
          Console.highlight(`${index + 1}. ${module.controller}`);
          Console.info(`   操作: ${module.action || "manage"}`);
          Console.info(`   目录: ${module.dictionary || "./"}`);
          Console.info(`   删除数据库: ${options.db ? "是" : "否"}`);
          Console.newLine();
        });

        Console.separator();
        Console.info(`总计: ${targetModules.length} 个模块`);
        Console.newLine();
        Console.info("移除 --dry-run 参数以实际删除模块");
        return;
      }

      // 确认删除
      Console.title(`🗑️ 准备删除 ${targetModules.length} 个模块`);
      Console.newLine();
      targetModules.forEach((module, index) => {
        Console.info(`${index + 1}. ${module.controller}${options.db ? " (含数据库表)" : ""}`);
      });
      Console.newLine();

      if (!options.force) {
        const confirmed = await Prompt.confirm("⚠️ 确认删除这些模块？此操作不可恢复！", false);
        if (!confirmed) {
          Console.warning("删除已取消");
          process.exit(0);
        }
      }

      // 逐个删除模块
      let successCount = 0;
      let failureCount = 0;
      const failures: Array<{ module: string; error: string }> = [];

      for (const module of targetModules) {
        Console.separator();
        Console.highlight(
          `🗑️ 删除模块 ${successCount + failureCount + 1}/${targetModules.length}: ${module.controller}`
        );

        try {
          const spinner = Console.spinner("正在删除文件...", "red");
          spinner.start();

          // 生成删除路径
          const paths = generateDeletePaths(module.controller, module.dictionary);

          // 1. 删除文件和目录
          deleteModuleFiles(paths);

          // 2. 清理配置文件
          cleanupReducers(module.controller, paths.destClientReduxReducersAllPath);
          cleanupRestApi(module.controller, paths.destServerRestPath);
          cleanupMenu(module.controller, paths.destClientUtilsMenuPath);

          // 3. 删除数据库表（如果指定）
          if (options.db) {
            dropDatabaseTable(module.controller);
          }

          spinner.succeed("删除完成!");
          successCount++;
          Console.newLine();
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          Console.error(`错误: ${errorMessage}`);
          failures.push({ module: module.controller, error: errorMessage });
          failureCount++;
          Console.newLine();
        }
      }

      // 显示总结
      Console.separator();
      Console.title("🎉 删除完成");
      Console.newLine();
      Console.highlight(`✅ 成功: ${successCount} 个`);
      Console.highlight(`❌ 失败: ${failureCount} 个`);

      if (failures.length > 0) {
        Console.newLine();
        Console.error("失败的模块:");
        failures.forEach(({ module, error }) => {
          Console.error(`  - ${module}: ${error}`);
        });
      }

      Console.newLine();
      if (options.db) {
        Console.box("删除已完成，代码和数据库表已清理！", "success");
      } else {
        Console.box("删除已完成，代码文件已清理！\n\n如需删除数据库表，请使用 --db 参数", "success");
      }
    } catch (error) {
      Console.error(`执行失败: ${error}`);
      process.exit(1);
    }
  },
};
