"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteConfigCommand = void 0;
const utils_1 = require("../utils");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const shelljs_1 = __importDefault(require("shelljs"));
const utils_2 = require("../../utils");
const constants_1 = require("../../constants");
/**
 * 生成删除路径
 */
const generateDeletePaths = (controller, dictionary) => {
    const basePath = dictionary || process.cwd();
    return {
        destPagesController: path_1.default.join(basePath, "pages", controller),
        destClientReduxController: path_1.default.join(basePath, "client", "redux", controller),
        destClientServiceController: path_1.default.join(basePath, "client", "service", controller),
        destClientStyledController: path_1.default.join(basePath, "client", "styled", controller),
        destServerModulesController: path_1.default.join(basePath, "server", "modules", controller),
        destServerApisController: path_1.default.join(basePath, "server", "apis", `${controller}.js`),
        destServerSqlController: path_1.default.join(basePath, "server", "sql", `${controller}.sql`),
        destServerDataLoader: path_1.default.join(basePath, "server", "dataloaders", `${controller}-dataloader.ts`),
        destClientReduxReducersAllPath: path_1.default.join(basePath, "client", "redux", "reducers.ts"),
        destServerRestPath: path_1.default.join(basePath, "server", "rest.js"),
        destClientUtilsMenuPath: path_1.default.join(basePath, "client", "utils", "menu.tsx"),
        destI18nZhCN: path_1.default.join(basePath, "public", "locales", "zh-CN", `${controller}.json`),
        destI18nEnUS: path_1.default.join(basePath, "public", "locales", "en-US", `${controller}.json`),
        destI18nJaJP: path_1.default.join(basePath, "public", "locales", "ja-JP", `${controller}.json`),
    };
};
/**
 * 删除文件和目录
 */
const deleteModuleFiles = (paths) => {
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
    directoriesToDelete.forEach((dir) => (0, utils_2.rmdirSync)(dir));
    filesToDelete.forEach((file) => (0, utils_2.rmFileSync)(file));
    console.log(`✅ 已删除 ${directoriesToDelete.length} 个目录和 ${filesToDelete.length} 个文件`);
};
/**
 * 清理 reducers 配置
 */
const cleanupReducers = (controller, reducersPath) => {
    // 删除 import 语句
    shelljs_1.default.sed("-i", new RegExp(`^.*import.*from.*['"].*\\/${controller}\\/.*['"].*$`, "gm"), "", reducersPath);
    // 删除 export 对象中的属性行
    shelljs_1.default.sed("-i", new RegExp(`^\\s*${controller}\\w*:\\s*${controller}\\w*Reducer,?\\s*$`, "gm"), "", reducersPath);
    // 修复连续逗号
    shelljs_1.default.sed("-i", /,,+/g, ",", reducersPath);
    // 修复对象末尾的逗号
    shelljs_1.default.sed("-i", /,(\s*\n\s*\})/, "$1", reducersPath);
    // 移除空对象中的逗号
    shelljs_1.default.sed("-i", /\{\s*,\s*\}/, "{}", reducersPath);
    // 标准化空行
    shelljs_1.default.sed("-i", /\n\s*\n\s*\n/g, "\n\n", reducersPath);
    console.log(`✅ 已清理 reducers 配置: ${controller}`);
};
/**
 * 清理菜单配置
 */
const cleanupMenu = (controller, menuPath) => {
    // 读取文件内容
    let content = fs_1.default.readFileSync(menuPath, "utf8");
    // 删除所有匹配的菜单项（使用与 generate_delete.ts 相同的正则，替换为逗号）
    content = content.replace(new RegExp(`,?\\s*\\{\\s*//\\s*${controller}_.*_start[\\s\\S]*?//\\s*${controller}_.*_end\\s*\\}\\s*,?`, "gm"), ",");
    // 修复连续逗号（删除可能留下 ,,）
    content = content.replace(/,,+/g, ",");
    // 修复数组开头多余的逗号 ([, { -> [ {)
    content = content.replace(/\[\s*,\s*\{/gm, "[\n  {");
    // 修复对象前多余的逗号（, { -> {）
    content = content.replace(/\n\s*,\s*\{/gm, "\n  {");
    // 清理缩进问题
    content = content.replace(/^[ ]{0,2}\/\*\{/gm, "    /*{");
    content = content.replace(/^[ ]{0,4}key:/gm, "      key:");
    content = content.replace(/^[ ]{0,4}text:/gm, "      text:");
    content = content.replace(/^[ ]{0,4}url:/gm, "      url:");
    content = content.replace(/^[ ]{0,4}icon:/gm, "      icon:");
    content = content.replace(/^[ ]{0,4}subMenus:/gm, "      subMenus:");
    content = content.replace(/^[ ]{0,2}\}\*\//gm, "    }*/");
    // 写回文件
    fs_1.default.writeFileSync(menuPath, content, "utf8");
    console.log(`✅ 已清理菜单配置: ${controller}`);
};
/**
 * 清理 REST API 配置
 */
const cleanupRestApi = (controller, restPath) => {
    // 删除 require 语句
    shelljs_1.default.sed("-i", new RegExp(`^const\\s+${controller}\\s*=\\s*require.*${controller}['"].*$`, "gm"), "", restPath);
    // 删除 router.use 语句
    shelljs_1.default.sed("-i", new RegExp(`^router\\.use\\(['"]\\/${controller}['"]\\s*,\\s*${controller}\\)\\s*$`, "gm"), "", restPath);
    console.log(`✅ 已清理 REST API 配置: ${controller}`);
};
/**
 * 删除数据库表
 */
const dropDatabaseTable = (controller) => {
    try {
        // 创建临时的 DROP TABLE SQL
        const dropSql = `DROP TABLE IF EXISTS \`${controller}\`;`;
        const mysqlCommand = `mysql -u${constants_1.mysqlUser} -p${constants_1.mysqlPassword} -h${constants_1.mysqlHost} -P${constants_1.mysqlPort} -e "${dropSql}"`;
        shelljs_1.default.exec(mysqlCommand);
        utils_1.Console.info(`已删除数据库表: ${controller}`);
    }
    catch (error) {
        utils_1.Console.error(`删除数据库表失败: ${error}`);
    }
};
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
                utils_1.Console.newLine();
                try {
                    // 生成删除路径
                    const paths = generateDeletePaths(module.controller, module.dictionary);
                    // 1. 删除文件和目录
                    utils_1.Console.info("📁 正在删除文件和目录...");
                    deleteModuleFiles(paths);
                    // 2. 清理配置文件
                    utils_1.Console.info("🔧 正在清理配置文件...");
                    cleanupReducers(module.controller, paths.destClientReduxReducersAllPath);
                    cleanupRestApi(module.controller, paths.destServerRestPath);
                    cleanupMenu(module.controller, paths.destClientUtilsMenuPath);
                    // 3. 删除数据库表（如果指定）
                    if (options.db) {
                        utils_1.Console.info("💾 正在删除数据库表...");
                        dropDatabaseTable(module.controller);
                    }
                    utils_1.Console.success(`✅ ${module.controller} 删除完成!`);
                    utils_1.Console.newLine();
                    successCount++;
                }
                catch (error) {
                    const errorMessage = error instanceof Error ? error.message : String(error);
                    utils_1.Console.error(`❌ 错误: ${errorMessage}`);
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
