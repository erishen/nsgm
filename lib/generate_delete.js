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
        destPagesController: path_1.default.join(basePath, 'pages', controller),
        destClientReduxController: path_1.default.join(basePath, 'client', 'redux', controller),
        destClientServiceController: path_1.default.join(basePath, 'client', 'service', controller),
        destClientStyledController: path_1.default.join(basePath, 'client', 'styled', controller),
        destServerModulesController: path_1.default.join(basePath, 'server', 'modules', controller),
        destServerApisController: path_1.default.join(basePath, 'server', 'apis', `${controller}.js`),
        destServerSqlController: path_1.default.join(basePath, 'server', 'sql', `${controller}.sql`),
        // 配置文件路径
        destClientReduxReducersAllPath: path_1.default.join(basePath, 'client', 'redux', 'reducers.ts'),
        destClientUtilsMenuPath: path_1.default.join(basePath, 'client', 'utils', 'menu.tsx'),
        destServerRestPath: path_1.default.join(basePath, 'server', 'rest.js'),
        ...(action && {
            destPagesAction: path_1.default.join(basePath, 'pages', controller, `${action}.tsx`),
            destClientReduxControllerAction: path_1.default.join(basePath, 'client', 'redux', controller, action),
            destClientAction: path_1.default.join(basePath, 'client', 'components', controller, action),
            destClientStyledAction: path_1.default.join(basePath, 'client', 'styled', controller, `${action}.js`)
        })
    };
};
const deleteAllControllerFiles = (paths) => {
    const directoriesToDelete = [
        paths.destPagesController,
        paths.destClientReduxController,
        paths.destClientServiceController,
        paths.destClientStyledController,
        paths.destServerModulesController
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
const cleanupConfigurationFiles = (controller, action, paths) => {
    if (action === 'all') {
        // 清理所有控制器相关的配置
        shelljs_1.default.sed('-i', new RegExp(`.*${controller}.*Reducer.*`, 'g'), '', paths.destClientReduxReducersAllPath);
        shelljs_1.default.sed('-i', new RegExp(`.*${controller}.*`, 'g'), '', paths.destServerRestPath);
    }
    else {
        // 清理特定动作的配置
        shelljs_1.default.sed('-i', new RegExp(`.*${controller}${(0, utils_1.firstUpperCase)(action)}Reducer.*`, 'g'), '', paths.destClientReduxReducersAllPath);
    }
};
const performDatabaseCleanup = (controller, paths) => {
    try {
        shelljs_1.default.sed('-i', new RegExp(`${constants_1.mysqlDatabase};`, 'g'), `${constants_1.mysqlDatabase};\nDROP TABLE \`${controller}\`;\n/*`, paths.destServerSqlController);
        shelljs_1.default.sed('-i', /utf8mb4;/g, 'utf8mb4;\n*/', paths.destServerSqlController);
        const mysqlCommand = `mysql -u${constants_1.mysqlUser} -p${constants_1.mysqlPassword} -h${constants_1.mysqlHost} -P${constants_1.mysqlPort} < ${paths.destServerSqlController}`;
        shelljs_1.default.exec(mysqlCommand);
        console.log('Database cleanup completed');
    }
    catch (error) {
        console.error('Failed to execute database cleanup:', error);
    }
};
const performAdvancedCleanup = (controller, action, paths) => {
    const cleanupRules = [
        {
            from: /\n\s*\n/,
            to: '\n\n',
            files: [paths.destClientReduxReducersAllPath]
        },
        {
            from: /Reducer,?\s*\n/,
            to: 'Reducer\n',
            files: [paths.destClientReduxReducersAllPath]
        }
    ];
    if (action === 'all') {
        cleanupRules.push({
            from: /'(.\/apis\/template.*?)'\)\s*\n/,
            to: "'./apis/template')\n\n",
            files: [paths.destServerRestPath]
        }, {
            from: /template\)\s*\n/,
            to: 'template)\n\n',
            files: [paths.destServerRestPath]
        }, {
            from: new RegExp(`,?\\s*{\\s*//\\s*${controller}_.*_start[\\s\\S]*?//\\s*${controller}_.*_end\\s*}\\s*,?`, 'gm'),
            to: ',',
            files: [paths.destClientUtilsMenuPath]
        });
    }
    setTimeout(() => {
        (0, utils_1.replaceInFileAll)(cleanupRules, 0, () => {
            console.log('Advanced cleanup completed');
        });
    }, CLEANUP_TIMEOUT);
};
/**
 * 删除控制器相关的文件
 * @param controller 控制器名称
 * @param action 动作名称，传入 'all' 删除整个控制器
 * @param deleteDBFlag 是否删除数据库表
 * @param dictionary 目标目录路径（可选，默认为当前目录）
 */
const deleteFiles = (controller, action, deleteDBFlag = false, dictionary) => {
    console.log('deleteFiles', constants_1.sourceFolder, constants_1.destFolder, constants_1.isLocal, controller, action, deleteDBFlag, dictionary);
    try {
        // 1. 生成删除路径
        const paths = generateDeletePaths(controller, action, dictionary);
        // 2. 删除文件和目录
        if (action === 'all') {
            console.log('Deleting all controller files...');
            deleteAllControllerFiles(paths);
        }
        else {
            console.log(`Deleting specific action files for ${action}...`);
            deleteSpecificActionFiles(paths);
        }
        // 3. 清理配置文件
        cleanupConfigurationFiles(controller, action, paths);
        console.log('Configuration files cleaned up');
        // 4. 处理数据库清理（仅在删除整个控制器且设置了标志时）
        if (action === 'all' && deleteDBFlag) {
            performDatabaseCleanup(controller, paths);
        }
        // 5. 执行高级清理
        performAdvancedCleanup(controller, action, paths);
        console.log('deleteFiles completed successfully');
    }
    catch (error) {
        console.error('Failed to delete files:', error);
        throw error;
    }
};
exports.deleteFiles = deleteFiles;
