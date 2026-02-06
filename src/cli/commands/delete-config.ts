import { Command, CommandOptions } from "../types";
import { Console, Prompt } from "../utils";
import { deleteFiles } from "../../generate";
import fs from "fs";

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

          // 调用核心删除函数
          deleteFiles(module.controller, module.action || "manage", options.db === true, module.dictionary || ".");

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
