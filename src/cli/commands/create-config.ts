import { Command, CommandOptions } from "../types";
import { Console, Prompt } from "../utils";
import { createFiles } from "../../generate";
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
 * 从配置文件创建命令
 */
export const createConfigCommand: Command = {
  name: "create-config",
  aliases: ["-cc", "--create-config"],
  description: "从配置文件创建模块",
  usage: "nsgm create-config <config-file> [options]",
  examples: [
    "nsgm create-config config/modules.json",
    "nsgm create-config config/modules.json --module product",
    "nsgm create-config config/modules.json --all",
  ],
  options: [
    {
      name: "module",
      description: "指定要创建的模块名称（如果不指定则创建所有）",
      required: false,
      type: "string",
    },
    {
      name: "all",
      description: "创建配置文件中的所有模块",
      required: false,
      type: "boolean",
    },
    {
      name: "dry-run",
      description: "预览模式，只显示将要创建的模块而不实际创建",
      required: false,
      type: "boolean",
    },
  ],
  execute: async (options: CommandOptions) => {
    try {
      // 获取配置文件路径
      const args = process.argv.slice(2);
      if (args.length === 0 || args[0].startsWith("-")) {
        Console.error("请指定配置文件路径");
        Console.info("使用方法:");
        Console.info("  nsgm create-config <config-file> [--module <name>]");
        Console.info("  nsgm create-config <config-file> [--all]");
        Console.info("");
        Console.info("示例:");
        Console.info("  nsgm create-config config/modules.json");
        Console.info("  nsgm create-config config/modules.json --module category");
        Console.info("  nsgm create-config config/modules.json --all");
        process.exit(1);
      }

      const configPath = args[0];

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
        // 创建指定模块
        const targetModule = config.find((m: ModuleConfig) => m.controller === options.module);
        if (!targetModule) {
          Console.error(`未找到模块: ${options.module}`);
          Console.info(`可用的模块: ${config.map((m: ModuleConfig) => m.controller).join(", ")}`);
          process.exit(1);
        }
        targetModules = [targetModule];
      } else {
        // 创建所有模块
        targetModules = config;
      }

      // 预览模式
      if (options.dryRun) {
        Console.title("📋 预览模式");
        Console.newLine();
        Console.info("将要创建的模块:");
        Console.newLine();

        targetModules.forEach((module, index) => {
          Console.highlight(`${index + 1}. ${module.controller}`);
          Console.info(`   操作: ${module.action || "manage"}`);
          Console.info(`   目录: ${module.dictionary || "./"}`);
          Console.info(`   字段数: ${module.fields.length}`);
          Console.info(`   字段: ${module.fields.map((f: any) => f.name).join(", ")}`);
          Console.newLine();
        });

        Console.separator();
        Console.info(`总计: ${targetModules.length} 个模块`);
        Console.newLine();
        Console.info("移除 --dry-run 参数以实际创建模块");
        return;
      }

      // 确认创建
      Console.title(`📦 准备创建 ${targetModules.length} 个模块`);
      Console.newLine();
      targetModules.forEach((module, index) => {
        Console.info(`${index + 1}. ${module.controller}`);
      });
      Console.newLine();

      const confirmed = await Prompt.confirm("确认创建这些模块？", true);
      if (!confirmed) {
        Console.warning("创建已取消");
        process.exit(0);
      }

      // 逐个创建模块
      let successCount = 0;
      let failureCount = 0;
      const failures: Array<{ module: string; error: string }> = [];

      for (const module of targetModules) {
        Console.separator();
        Console.highlight(
          `📦 创建模块 ${successCount + failureCount + 1}/${targetModules.length}: ${module.controller}`
        );

        try {
          const spinner = Console.spinner("正在创建文件...", "green");
          spinner.start();

          // 调用核心创建函数
          createFiles(module.controller, module.action || "manage", module.dictionary || ".", module.fields);

          spinner.succeed("控制器创建完成!");
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
      Console.title("🎉 创建完成");
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
      Console.box("创建已完成，请检查生成的文件！", "success");
    } catch (error) {
      Console.error(`执行失败: ${error}`);
      process.exit(1);
    }
  },
};
