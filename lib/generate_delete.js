"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFiles = void 0;
const path_1 = __importDefault(require("path"));
const shelljs_1 = __importDefault(require("shelljs"));
const constants_1 = require("./constants");
const utils_1 = require("./utils");
// 常量定义
const CLEANUP_TIMEOUT = 1000;
// 辅助函数
const generateDeletePaths = (controller, action, dictionary) => {
    const basePath = dictionary || process.cwd();
    return {
        destPagesController: path_1.default.join(basePath, "pages", controller),
        destClientReduxController: path_1.default.join(basePath, "client", "redux", controller),
        destClientServiceController: path_1.default.join(basePath, "client", "service", controller),
        destClientStyledController: path_1.default.join(basePath, "client", "styled", controller),
        destServerModulesController: path_1.default.join(basePath, "server", "modules", controller),
        destServerApisController: path_1.default.join(basePath, "server", "apis", `${controller}.js`),
        destServerSqlController: path_1.default.join(basePath, "server", "sql", `${controller}.sql`),
        // 配置文件路径
        destClientReduxReducersAllPath: path_1.default.join(basePath, "client", "redux", "reducers.ts"),
        destClientUtilsMenuPath: path_1.default.join(basePath, "client", "utils", "menu.tsx"),
        destServerRestPath: path_1.default.join(basePath, "server", "rest.js"),
        // 多语言文件路径
        destI18nZhCN: path_1.default.join(basePath, "public", "locales", "zh-CN", `${controller}.json`),
        destI18nEnUS: path_1.default.join(basePath, "public", "locales", "en-US", `${controller}.json`),
        destI18nJaJP: path_1.default.join(basePath, "public", "locales", "ja-JP", `${controller}.json`),
        ...(action && {
            destPagesAction: path_1.default.join(basePath, "pages", controller, `${action}.tsx`),
            destClientReduxControllerAction: path_1.default.join(basePath, "client", "redux", controller, action),
            destClientAction: path_1.default.join(basePath, "client", "components", controller, action),
            destClientStyledAction: path_1.default.join(basePath, "client", "styled", controller, `${action}.js`),
        }),
    };
};
const deleteAllControllerFiles = (paths) => {
    const directoriesToDelete = [
        paths.destPagesController,
        paths.destClientReduxController,
        paths.destClientServiceController,
        paths.destClientStyledController,
        paths.destServerModulesController,
    ];
    const filesToDelete = [paths.destServerApisController, paths.destServerSqlController];
    directoriesToDelete.forEach((dir) => (0, utils_1.rmdirSync)(dir));
    filesToDelete.forEach((file) => (0, utils_1.rmFileSync)(file));
};
const deleteSpecificActionFiles = (paths) => {
    if (paths.destPagesAction) {
        (0, utils_1.rmFileSync)(paths.destPagesAction);
    }
    if (paths.destClientReduxControllerAction) {
        (0, utils_1.rmdirSync)(paths.destClientReduxControllerAction);
    }
    if (paths.destClientAction) {
        (0, utils_1.rmFileSync)(paths.destClientAction);
    }
    if (paths.destClientStyledAction) {
        (0, utils_1.rmFileSync)(paths.destClientStyledAction);
    }
};
const deleteI18nFiles = (paths) => {
    console.log("Deleting i18n files...");
    const i18nFilesToDelete = [paths.destI18nZhCN, paths.destI18nEnUS, paths.destI18nJaJP];
    i18nFilesToDelete.forEach((filePath) => {
        (0, utils_1.rmFileSync)(filePath);
        console.log(`✅ 删除多语言文件: ${filePath}`);
    });
};
const cleanupConfigurationFiles = (controller, action, paths) => {
    if (action === "all") {
        // 清理所有控制器相关的配置
        // 1. 删除 import 语句
        shelljs_1.default.sed("-i", new RegExp(`^.*import.*${controller}.*Reducer.*from.*$`, "gm"), "", paths.destClientReduxReducersAllPath);
        // 2. 删除 export 对象中的属性行
        shelljs_1.default.sed("-i", new RegExp(`^\\s*${controller}[^:]*:\\s*${controller}.*Reducer,?\\s*$`, "gm"), "", paths.destClientReduxReducersAllPath);
        // 3. 修复可能出现的语法问题
        // 移除空行
        shelljs_1.default.sed("-i", /^\s*$/g, "", paths.destClientReduxReducersAllPath);
        shelljs_1.default.sed("-i", /\n\n\n/g, "\n\n", paths.destClientReduxReducersAllPath);
        // 4. 修复对象末尾的逗号问题
        // 如果对象只剩一个属性，移除末尾逗号
        shelljs_1.default.sed("-i", /,(\s*\n\s*\})/, "$1", paths.destClientReduxReducersAllPath);
        // 5. 清理服务器端配置
        shelljs_1.default.sed("-i", new RegExp(`.*${controller}.*`, "g"), "", paths.destServerRestPath);
    }
    else {
        // 清理特定动作的配置
        shelljs_1.default.sed("-i", new RegExp(`^.*import.*${controller}${(0, utils_1.firstUpperCase)(action)}Reducer.*from.*$`, "gm"), "", paths.destClientReduxReducersAllPath);
        shelljs_1.default.sed("-i", new RegExp(`^\\s*${controller}${(0, utils_1.firstUpperCase)(action)}[^:]*:\\s*${controller}${(0, utils_1.firstUpperCase)(action)}.*Reducer,?\\s*$`, "gm"), "", paths.destClientReduxReducersAllPath);
        // 修复语法问题
        shelljs_1.default.sed("-i", /^\s*$/g, "", paths.destClientReduxReducersAllPath);
        shelljs_1.default.sed("-i", /,(\s*\n\s*\})/, "$1", paths.destClientReduxReducersAllPath);
    }
};
const performDatabaseCleanup = (controller, paths) => {
    try {
        shelljs_1.default.sed("-i", new RegExp(`${constants_1.mysqlDatabase};`, "g"), `${constants_1.mysqlDatabase};\nDROP TABLE \`${controller}\`;\n/*`, paths.destServerSqlController);
        shelljs_1.default.sed("-i", /utf8mb4;/g, "utf8mb4;\n*/", paths.destServerSqlController);
        const mysqlCommand = `mysql -u${constants_1.mysqlUser} -p${constants_1.mysqlPassword} -h${constants_1.mysqlHost} -P${constants_1.mysqlPort} < ${paths.destServerSqlController}`;
        shelljs_1.default.exec(mysqlCommand);
        console.log("Database cleanup completed");
    }
    catch (error) {
        console.error("Failed to execute database cleanup:", error);
    }
};
const performAdvancedCleanup = (controller, action, paths) => {
    const cleanupRules = [
        // 标准化空行
        {
            from: /\n\s*\n\s*\n/g,
            to: "\n\n",
            files: [paths.destClientReduxReducersAllPath],
        },
        // 修复 reducers.ts 中可能的语法问题
        {
            from: /(\w+Reducer),?\s*\n\s*\}/g,
            to: "$1,\n}",
            files: [paths.destClientReduxReducersAllPath],
        },
    ];
    if (action === "all") {
        cleanupRules.push(
        // 服务器端 REST 文件清理
        {
            from: /'(.\/apis\/template.*?)'\)\s*\n/,
            to: "'./apis/template')\n\n",
            files: [paths.destServerRestPath],
        }, {
            from: /template\)\s*\n/,
            to: "template)\n\n",
            files: [paths.destServerRestPath],
        }, 
        // 菜单清理 - 改进版本，保持正确的缩进和逗号
        {
            from: new RegExp(`,?\\s*\\{\\s*//\\s*${controller}_.*_start[\\s\\S]*?//\\s*${controller}_.*_end\\s*\\}\\s*,?`, "gm"),
            to: ",", // 保留逗号，确保数组语法正确
            files: [paths.destClientUtilsMenuPath],
        });
    }
    setTimeout(() => {
        (0, utils_1.replaceInFileAll)(cleanupRules, 0, () => {
            console.log("Advanced cleanup completed");
            // 执行额外的清理步骤
            performFinalCleanup(paths);
            // 如果是删除整个控制器，还需要清理菜单缩进
            if (action === "all") {
                cleanupMenuIndentation(paths);
            }
        });
    }, CLEANUP_TIMEOUT);
};
// 新增：智能菜单清理函数
const cleanupMenuIndentation = (paths) => {
    // 读取菜单文件内容
    const menuFile = paths.destClientUtilsMenuPath;
    // 使用更智能的方式处理菜单清理，保持正确的缩进
    setTimeout(() => {
        // 清理可能出现的缩进问题，确保注释代码块有正确的缩进
        shelljs_1.default.sed("-i", /^[ ]{0,2}\/\*\{/gm, "    /*{", menuFile);
        shelljs_1.default.sed("-i", /^[ ]{0,4}key:/gm, "      key:", menuFile);
        shelljs_1.default.sed("-i", /^[ ]{0,4}text:/gm, "      text:", menuFile);
        shelljs_1.default.sed("-i", /^[ ]{0,4}url:/gm, "      url:", menuFile);
        shelljs_1.default.sed("-i", /^[ ]{0,4}icon:/gm, "      icon:", menuFile);
        shelljs_1.default.sed("-i", /^[ ]{0,4}subMenus:/gm, "      subMenus:", menuFile);
        shelljs_1.default.sed("-i", /^[ ]{0,2}\}\*\//gm, "    }*/", menuFile);
        // 修复可能出现的连续逗号问题
        shelljs_1.default.sed("-i", /,,+/g, ",", menuFile);
        // 修复数组末尾多余的逗号（在注释前）
        shelljs_1.default.sed("-i", /,(\s*\/\*)/g, "$1", menuFile);
        // 确保数组项之间有正确的逗号
        shelljs_1.default.sed("-i", /(\})(\s*\/\*)/g, "$1,$2", menuFile);
        console.log("Menu indentation cleanup completed");
    }, 1500);
};
// 新增：最终清理函数
const performFinalCleanup = (paths) => {
    // 修复 reducers.ts 的最终格式
    setTimeout(() => {
        // 确保最后一个属性有逗号（如果不是空对象）
        shelljs_1.default.sed("-i", /(\w+Reducer)(\s*\n\s*\})/, "$1,$2", paths.destClientReduxReducersAllPath);
        // 移除空对象中的逗号
        shelljs_1.default.sed("-i", /\{\s*,\s*\}/, "{}", paths.destClientReduxReducersAllPath);
        // 标准化缩进
        shelljs_1.default.sed("-i", /^[ ]{2}/gm, "  ", paths.destClientReduxReducersAllPath);
        console.log("Final cleanup completed");
    }, 500);
};
/**
 * 删除控制器相关的文件
 * @param controller 控制器名称
 * @param action 动作名称，传入 'all' 删除整个控制器
 * @param deleteDBFlag 是否删除数据库表
 * @param dictionary 目标目录路径（可选，默认为当前目录）
 */
const deleteFiles = (controller, action, deleteDBFlag = false, dictionary) => {
    console.log("deleteFiles", constants_1.sourceFolder, constants_1.destFolder, constants_1.isLocal, controller, action, deleteDBFlag, dictionary);
    try {
        // 1. 生成删除路径
        const paths = generateDeletePaths(controller, action, dictionary);
        // 2. 删除文件和目录
        if (action === "all") {
            console.log("Deleting all controller files...");
            deleteAllControllerFiles(paths);
            // 删除多语言文件
            deleteI18nFiles(paths);
        }
        else {
            console.log(`Deleting specific action files for ${action}...`);
            deleteSpecificActionFiles(paths);
        }
        // 3. 清理配置文件
        cleanupConfigurationFiles(controller, action, paths);
        console.log("Configuration files cleaned up");
        // 4. 处理数据库清理（仅在删除整个控制器且设置了标志时）
        if (action === "all" && deleteDBFlag) {
            performDatabaseCleanup(controller, paths);
        }
        // 5. 执行高级清理
        performAdvancedCleanup(controller, action, paths);
        console.log("deleteFiles completed successfully");
    }
    catch (error) {
        console.error("Failed to delete files:", error);
        throw error;
    }
};
exports.deleteFiles = deleteFiles;
