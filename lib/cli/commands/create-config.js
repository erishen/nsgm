"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createConfigCommand = void 0;
const utils_1 = require("../utils");
const generate_1 = require("../../generate");
const fs_1 = __importDefault(require("fs"));
/**
 * 从配置文件创建命令
 */
exports.createConfigCommand = {
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
    execute: async (options) => {
        try {
            // 获取配置文件路径
            const args = process.argv.slice(2);
            // 跳过命令名和别名
            let configPathIndex = 0;
            const commandNames = ["create-config", "-cc", "--create-config"];
            while (configPathIndex < args.length && commandNames.includes(args[configPathIndex])) {
                configPathIndex++;
            }
            if (configPathIndex >= args.length || args[configPathIndex].startsWith("-")) {
                utils_1.Console.error("请指定配置文件路径");
                utils_1.Console.info("使用方法:");
                utils_1.Console.info("  nsgm create-config <config-file> [--module <name>]");
                utils_1.Console.info("  nsgm create-config <config-file> [--all]");
                utils_1.Console.info("");
                utils_1.Console.info("示例:");
                utils_1.Console.info("  nsgm create-config config/modules.json");
                utils_1.Console.info("  nsgm create-config config/modules.json --module category");
                utils_1.Console.info("  nsgm create-config config/modules.json --all");
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
                // 创建指定模块
                const targetModule = config.find((m) => m.controller === options.module);
                if (!targetModule) {
                    utils_1.Console.error(`未找到模块: ${options.module}`);
                    utils_1.Console.info(`可用的模块: ${config.map((m) => m.controller).join(", ")}`);
                    process.exit(1);
                }
                targetModules = [targetModule];
            }
            else {
                // 创建所有模块
                targetModules = config;
            }
            // 预览模式
            if (options.dryRun) {
                utils_1.Console.title("📋 预览模式");
                utils_1.Console.newLine();
                utils_1.Console.info("将要创建的模块:");
                utils_1.Console.newLine();
                targetModules.forEach((module, index) => {
                    utils_1.Console.highlight(`${index + 1}. ${module.controller}`);
                    utils_1.Console.info(`   操作: ${module.action || "manage"}`);
                    utils_1.Console.info(`   目录: ${module.dictionary || "./"}`);
                    utils_1.Console.info(`   字段数: ${module.fields.length}`);
                    utils_1.Console.info(`   字段: ${module.fields.map((f) => f.name).join(", ")}`);
                    utils_1.Console.newLine();
                });
                utils_1.Console.separator();
                utils_1.Console.info(`总计: ${targetModules.length} 个模块`);
                utils_1.Console.newLine();
                utils_1.Console.info("移除 --dry-run 参数以实际创建模块");
                return;
            }
            // 确认创建
            utils_1.Console.title(`📦 准备创建 ${targetModules.length} 个模块`);
            utils_1.Console.newLine();
            targetModules.forEach((module, index) => {
                utils_1.Console.info(`${index + 1}. ${module.controller}`);
            });
            utils_1.Console.newLine();
            const confirmed = await utils_1.Prompt.confirm("确认创建这些模块？", true);
            if (!confirmed) {
                utils_1.Console.warning("创建已取消");
                process.exit(0);
            }
            // 逐个创建模块
            let successCount = 0;
            let failureCount = 0;
            const failures = [];
            for (const module of targetModules) {
                utils_1.Console.separator();
                utils_1.Console.highlight(`📦 创建模块 ${successCount + failureCount + 1}/${targetModules.length}: ${module.controller}`);
                try {
                    const spinner = utils_1.Console.spinner("正在创建文件...", "green");
                    spinner.start();
                    // 调用核心创建函数
                    (0, generate_1.createFiles)(module.controller, module.action || "manage", module.dictionary || ".", module.fields);
                    spinner.succeed("控制器创建完成!");
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
            utils_1.Console.title("🎉 创建完成");
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
            utils_1.Console.box("创建已完成，请检查生成的文件！", "success");
        }
        catch (error) {
            utils_1.Console.error(`执行失败: ${error}`);
            process.exit(1);
        }
    },
};
