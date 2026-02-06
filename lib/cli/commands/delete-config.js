"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteConfigCommand = void 0;
const utils_1 = require("../utils");
const generate_1 = require("../../generate");
const fs_1 = __importDefault(require("fs"));
/**
 * 从配置文件删除命令
 */
exports.deleteConfigCommand = {
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
    execute: async (options) => {
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
                utils_1.Console.error("请指定配置文件路径");
                utils_1.Console.info("使用方法:");
                utils_1.Console.info("  nsgm delete-config <config-file> [--module <name>]");
                utils_1.Console.info("  nsgm delete-config <config-file> [--all] [--db]");
                utils_1.Console.info("");
                utils_1.Console.info("示例:");
                utils_1.Console.info("  nsgm delete-config config/modules.json");
                utils_1.Console.info("  nsgm delete-config config/modules.json --module category");
                utils_1.Console.info("  nsgm delete-config config/modules.json --all --db");
                process.exit(1);
            }
            const configPath = args[configPathIndex];
            // 检查配置文件是否存在
            if (!fs_1.default.existsSync(configPath)) {
                utils_1.Console.error(`配置文件不存在: ${configPath}`);
                process.exit(1);
            }
            // 读取配置文件
            const configContent = fs_1.default.readFileSync(configPath, "utf8");
            const config = JSON.parse(configContent);
            // 验证配置格式
            if (!Array.isArray(config)) {
                utils_1.Console.error("配置文件格式错误：必须是一个数组");
                process.exit(1);
            }
            // 解析目标模块
            let targetModules = [];
            if (options.module && typeof options.module === "string") {
                // 删除指定模块
                const targetModule = config.find((m) => m.controller === options.module);
                if (!targetModule) {
                    utils_1.Console.error(`未找到模块: ${options.module}`);
                    utils_1.Console.info(`可用的模块: ${config.map((m) => m.controller).join(", ")}`);
                    process.exit(1);
                }
                targetModules = [targetModule];
            }
            else {
                // 删除所有模块
                targetModules = config;
            }
            // 预览模式
            if (options.dryRun) {
                utils_1.Console.title("📋 预览模式");
                utils_1.Console.newLine();
                utils_1.Console.info("将要删除的模块:");
                utils_1.Console.newLine();
                targetModules.forEach((module, index) => {
                    utils_1.Console.highlight(`${index + 1}. ${module.controller}`);
                    utils_1.Console.info(`   操作: ${module.action || "manage"}`);
                    utils_1.Console.info(`   目录: ${module.dictionary || "./"}`);
                    utils_1.Console.info(`   删除数据库: ${options.db ? "是" : "否"}`);
                    utils_1.Console.newLine();
                });
                utils_1.Console.separator();
                utils_1.Console.info(`总计: ${targetModules.length} 个模块`);
                utils_1.Console.newLine();
                utils_1.Console.info("移除 --dry-run 参数以实际删除模块");
                return;
            }
            // 确认删除
            utils_1.Console.title(`🗑️ 准备删除 ${targetModules.length} 个模块`);
            utils_1.Console.newLine();
            targetModules.forEach((module, index) => {
                utils_1.Console.info(`${index + 1}. ${module.controller}${options.db ? " (含数据库表)" : ""}`);
            });
            utils_1.Console.newLine();
            if (!options.force) {
                const confirmed = await utils_1.Prompt.confirm("⚠️ 确认删除这些模块？此操作不可恢复！", false);
                if (!confirmed) {
                    utils_1.Console.warning("删除已取消");
                    process.exit(0);
                }
            }
            // 逐个删除模块
            let successCount = 0;
            let failureCount = 0;
            const failures = [];
            for (const module of targetModules) {
                utils_1.Console.separator();
                utils_1.Console.highlight(`🗑️ 删除模块 ${successCount + failureCount + 1}/${targetModules.length}: ${module.controller}`);
                try {
                    const spinner = utils_1.Console.spinner("正在删除文件...", "red");
                    spinner.start();
                    // 调用核心删除函数
                    (0, generate_1.deleteFiles)(module.controller, module.action || "manage", options.db === true, module.dictionary || ".");
                    spinner.succeed("删除完成!");
                    successCount++;
                    utils_1.Console.newLine();
                }
                catch (error) {
                    const errorMessage = error instanceof Error ? error.message : String(error);
                    utils_1.Console.error(`错误: ${errorMessage}`);
                    failures.push({ module: module.controller, error: errorMessage });
                    failureCount++;
                    utils_1.Console.newLine();
                }
            }
            // 显示总结
            utils_1.Console.separator();
            utils_1.Console.title("🎉 删除完成");
            utils_1.Console.newLine();
            utils_1.Console.highlight(`✅ 成功: ${successCount} 个`);
            utils_1.Console.highlight(`❌ 失败: ${failureCount} 个`);
            if (failures.length > 0) {
                utils_1.Console.newLine();
                utils_1.Console.error("失败的模块:");
                failures.forEach(({ module, error }) => {
                    utils_1.Console.error(`  - ${module}: ${error}`);
                });
            }
            utils_1.Console.newLine();
            if (options.db) {
                utils_1.Console.box("删除已完成，代码和数据库表已清理！", "success");
            }
            else {
                utils_1.Console.box("删除已完成，代码文件已清理！\n\n如需删除数据库表，请使用 --db 参数", "success");
            }
        }
        catch (error) {
            utils_1.Console.error(`执行失败: ${error}`);
            process.exit(1);
        }
    },
};
