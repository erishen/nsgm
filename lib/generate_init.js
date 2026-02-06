"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initConfigFiles = exports.initTestFiles = exports.initTypesFiles = exports.initRootFiles = exports.initScriptsFiles = exports.initPublicFiles = exports.initServerFiles = exports.initPagesFiles = exports.initClientFiles = void 0;
const path_1 = __importStar(require("path"));
const shelljs_1 = __importDefault(require("shelljs"));
const constants_1 = require("./constants");
const utils_1 = require("./utils");
const fs_1 = require("fs");
// 常量定义
const CLIENT_FILES = {
    reduxStore: "/store.ts",
    styledCommon: "/common.ts",
    styledLayoutIndex: "/index.ts",
    utilsCommon: "/common.ts",
    utilsFetch: "/fetch.ts",
    utilsCookie: "/cookie.ts",
    utilsSso: "/sso.ts",
    utilsI18n: "/i18n.ts",
    utilsNavigation: "/navigation.ts",
    utilsSuppressWarnings: "/suppressWarnings.ts",
    layoutIndex: "/index.tsx",
    languageSwitcher: "/LanguageSwitcher.tsx",
    clientProviders: "/ClientProviders.tsx",
    ssrSafeAntdProvider: "/SSRSafeAntdProvider.tsx",
    suppressHydrationWarnings: "/SuppressHydrationWarnings.tsx",
};
const PAGES_FILES = {
    index: "/index.tsx",
    app: "/_app.tsx",
    document: "/_document.tsx",
    login: "/login.tsx",
};
const SERVER_FILES = {
    apisSso: "/sso.js",
    utilsCommon: "/common.js",
    utilsDBPoolManager: "/db-pool-manager.js",
    utilsValidation: "/validation.js",
};
const PUBLIC_FILES = {
    images: "/images",
    fonts: "/fonts",
    favicon: "/favicon.ico",
    locales: "/locales",
};
const SCRIPTS_FILES = {
    startup: "/startup.sh",
    shutdown: "/shutdown.sh",
    password: "/generate-password-hash.js",
};
const ROOT_FILES = {
    nextConfig: "/next.config.js",
    nextI18nConfig: "/next-i18next.config.js",
    mysqlConfig: "/mysql.config.js",
    projectConfig: "/project.config.js",
    tsconfig: "/tsconfig.json",
    gitignoreSource: "/gitignore",
    gitignore: "/.gitignore",
    eslintrc: "/eslint.config.js",
    prettierrcSource: "/prettierrc",
    prettierrc: "/.prettierrc",
    nextEnvSource: "../next-env.d.ts",
    nextEnv: "/next-env.d.ts",
    readme: "/README.md",
    appConfigSource: "../app.config.js",
    appConfig: "/app.config.js",
    app: "/app.js",
    envExampleSource: "/env.example",
    envExample: "/.env.example",
    envSource: "/env",
    env: "/.env",
    jestConfig: "/jest.config.js",
    jestSetup: "/jest.setup.js",
    jestSetupGlobals: "/jest.setup-globals.js",
};
// 辅助函数
const createDirectoryStructure = (directories) => {
    directories.forEach((dir) => (0, utils_1.mkdirSync)(dir));
};
const copyMultipleFiles = (fileMappings) => {
    fileMappings.forEach(({ source, dest, upgradeFlag }) => {
        (0, utils_1.copyFileSync)(source, dest, upgradeFlag);
    });
};
/**
 * 初始化客户端文件
 * @param dictionary 目标目录名称
 * @param newDestFolder 新的目标文件夹路径
 * @param upgradeFlag 是否为升级模式
 */
const initClientFiles = (dictionary, newDestFolder, upgradeFlag) => {
    console.log("Initializing client files...");
    try {
        // 1. 确定目标路径
        const baseDestPath = dictionary === "" ? constants_1.destClientPath : path_1.default.join(newDestFolder, constants_1.clientPath);
        const destPaths = {
            client: baseDestPath,
            redux: (0, path_1.resolve)(baseDestPath + constants_1.reduxPath),
            styled: (0, path_1.resolve)(baseDestPath + constants_1.styledPath),
            styledLayout: (0, path_1.resolve)(baseDestPath + constants_1.styledPath + constants_1.styledLayoutPath),
            utils: (0, path_1.resolve)(baseDestPath + constants_1.utilsPath),
            layout: (0, path_1.resolve)(baseDestPath + constants_1.layoutPath),
        };
        // 2. 创建目录结构
        const directoriesToCreate = [
            destPaths.client,
            destPaths.redux,
            destPaths.styled,
            destPaths.styledLayout,
            destPaths.utils,
            destPaths.layout,
            (0, path_1.resolve)(baseDestPath + constants_1.componentsPath),
        ];
        createDirectoryStructure(directoriesToCreate);
        // 3. 定义文件映射
        const fileMappings = [
            {
                source: (0, path_1.resolve)(constants_1.sourceClientPath + constants_1.reduxPath + CLIENT_FILES.reduxStore),
                dest: (0, path_1.resolve)(destPaths.redux + CLIENT_FILES.reduxStore),
                upgradeFlag,
            },
            {
                source: (0, path_1.resolve)(constants_1.sourceClientPath + constants_1.styledPath + CLIENT_FILES.styledCommon),
                dest: (0, path_1.resolve)(destPaths.styled + CLIENT_FILES.styledCommon),
                upgradeFlag,
            },
            {
                source: (0, path_1.resolve)(constants_1.sourceClientPath + constants_1.styledPath + constants_1.styledLayoutPath + CLIENT_FILES.styledLayoutIndex),
                dest: (0, path_1.resolve)(destPaths.styledLayout + CLIENT_FILES.styledLayoutIndex),
                upgradeFlag,
            },
            {
                source: (0, path_1.resolve)(constants_1.sourceClientPath + constants_1.utilsPath + CLIENT_FILES.utilsCookie),
                dest: (0, path_1.resolve)(destPaths.utils + CLIENT_FILES.utilsCookie),
                upgradeFlag,
            },
            {
                source: (0, path_1.resolve)(constants_1.sourceClientPath + constants_1.utilsPath + CLIENT_FILES.utilsSso),
                dest: (0, path_1.resolve)(destPaths.utils + CLIENT_FILES.utilsSso),
                upgradeFlag,
            },
            {
                source: (0, path_1.resolve)(constants_1.sourceClientPath + constants_1.utilsPath + CLIENT_FILES.utilsCommon),
                dest: (0, path_1.resolve)(destPaths.utils + CLIENT_FILES.utilsCommon),
                upgradeFlag,
            },
            {
                source: (0, path_1.resolve)(constants_1.sourceClientPath + constants_1.utilsPath + CLIENT_FILES.utilsFetch),
                dest: (0, path_1.resolve)(destPaths.utils + CLIENT_FILES.utilsFetch),
                upgradeFlag,
            },
            {
                source: (0, path_1.resolve)(constants_1.sourceClientPath + constants_1.layoutPath + CLIENT_FILES.layoutIndex),
                dest: (0, path_1.resolve)(destPaths.layout + CLIENT_FILES.layoutIndex),
                upgradeFlag,
            },
            {
                source: (0, path_1.resolve)(constants_1.sourceClientPath + constants_1.utilsPath + CLIENT_FILES.utilsI18n),
                dest: (0, path_1.resolve)(destPaths.utils + CLIENT_FILES.utilsI18n),
                upgradeFlag,
            },
            {
                source: (0, path_1.resolve)(constants_1.sourceClientPath + constants_1.utilsPath + CLIENT_FILES.utilsNavigation),
                dest: (0, path_1.resolve)(destPaths.utils + CLIENT_FILES.utilsNavigation),
                upgradeFlag,
            },
            {
                source: (0, path_1.resolve)(constants_1.sourceClientPath + constants_1.componentsPath + CLIENT_FILES.languageSwitcher),
                dest: (0, path_1.resolve)(baseDestPath + constants_1.componentsPath + CLIENT_FILES.languageSwitcher),
                upgradeFlag,
            },
            {
                source: (0, path_1.resolve)(constants_1.sourceClientPath + constants_1.componentsPath + CLIENT_FILES.clientProviders),
                dest: (0, path_1.resolve)(baseDestPath + constants_1.componentsPath + CLIENT_FILES.clientProviders),
                upgradeFlag,
            },
            {
                source: (0, path_1.resolve)(constants_1.sourceClientPath + constants_1.componentsPath + CLIENT_FILES.ssrSafeAntdProvider),
                dest: (0, path_1.resolve)(baseDestPath + constants_1.componentsPath + CLIENT_FILES.ssrSafeAntdProvider),
                upgradeFlag,
            },
            {
                source: (0, path_1.resolve)(constants_1.sourceClientPath + constants_1.componentsPath + CLIENT_FILES.suppressHydrationWarnings),
                dest: (0, path_1.resolve)(baseDestPath + constants_1.componentsPath + CLIENT_FILES.suppressHydrationWarnings),
                upgradeFlag,
            },
            {
                source: (0, path_1.resolve)(constants_1.sourceClientPath + constants_1.utilsPath + CLIENT_FILES.utilsSuppressWarnings),
                dest: (0, path_1.resolve)(baseDestPath + constants_1.utilsPath + CLIENT_FILES.utilsSuppressWarnings),
                upgradeFlag,
            },
            // 这些文件不使用 upgradeFlag
            {
                source: (0, path_1.resolve)(constants_1.sourceClientPathGeneration + constants_1.reduxPath + constants_1.reduxReducersPath),
                dest: (0, path_1.resolve)(destPaths.redux + constants_1.reduxReducersPath),
            },
            {
                source: (0, path_1.resolve)(constants_1.sourceClientPathGeneration + constants_1.utilsPath + constants_1.utilsMenuPath),
                dest: (0, path_1.resolve)(destPaths.utils + constants_1.utilsMenuPath),
            },
        ];
        // 4. 复制文件
        copyMultipleFiles(fileMappings);
        console.log("Client files initialization completed");
        return {
            destClientUtilsMenuPath: (0, path_1.resolve)(destPaths.utils + constants_1.utilsMenuPath),
            destClientReduxReducersAllPath: (0, path_1.resolve)(destPaths.redux + constants_1.reduxReducersPath),
        };
    }
    catch (error) {
        console.error("Failed to initialize client files:", error);
        throw error;
    }
};
exports.initClientFiles = initClientFiles;
/**
 * 初始化页面文件
 * @param dictionary 目标目录名称
 * @param newDestFolder 新的目标文件夹路径
 * @param upgradeFlag 是否为升级模式
 */
const initPagesFiles = (dictionary, newDestFolder, upgradeFlag) => {
    console.log("Initializing pages files...");
    try {
        // 1. 确定目标路径
        const baseDestPath = dictionary === "" ? constants_1.destPagesPath : path_1.default.join(newDestFolder, constants_1.pagesPath);
        // 2. 创建目录
        createDirectoryStructure([baseDestPath]);
        // 3. 定义文件映射
        const fileMappings = [
            {
                source: (0, path_1.resolve)(constants_1.sourcePagesPath + PAGES_FILES.index),
                dest: (0, path_1.resolve)(baseDestPath + PAGES_FILES.index),
                upgradeFlag,
            },
            {
                source: (0, path_1.resolve)(constants_1.sourcePagesPath + PAGES_FILES.app),
                dest: (0, path_1.resolve)(baseDestPath + PAGES_FILES.app),
                upgradeFlag,
            },
            {
                source: (0, path_1.resolve)(constants_1.sourcePagesPath + PAGES_FILES.document),
                dest: (0, path_1.resolve)(baseDestPath + PAGES_FILES.document),
                upgradeFlag,
            },
            {
                source: (0, path_1.resolve)(constants_1.sourcePagesPath + PAGES_FILES.login),
                dest: (0, path_1.resolve)(baseDestPath + PAGES_FILES.login),
                upgradeFlag,
            },
        ];
        // 4. 复制文件
        copyMultipleFiles(fileMappings);
        console.log("Pages files initialization completed");
    }
    catch (error) {
        console.error("Failed to initialize pages files:", error);
        throw error;
    }
};
exports.initPagesFiles = initPagesFiles;
/**
 * 初始化服务器文件
 * @param dictionary 目标目录名称
 * @param newDestFolder 新的目标文件夹路径
 * @param upgradeFlag 是否为升级模式
 */
const initServerFiles = (dictionary, newDestFolder, upgradeFlag) => {
    console.log("Initializing server files...");
    try {
        // 1. 确定目标路径
        const baseDestPath = dictionary === "" ? constants_1.destServerPath : path_1.default.join(newDestFolder, constants_1.serverPath);
        const destPaths = {
            server: baseDestPath,
            apis: (0, path_1.resolve)(baseDestPath + constants_1.apisPath),
            utils: (0, path_1.resolve)(baseDestPath + constants_1.utilsPath),
        };
        // 2. 创建目录结构
        const directoriesToCreate = [destPaths.server, destPaths.apis, destPaths.utils];
        createDirectoryStructure(directoriesToCreate);
        // 3. 定义文件映射
        const fileMappings = [
            {
                source: (0, path_1.resolve)(constants_1.sourceServerPath + constants_1.apisPath + SERVER_FILES.apisSso),
                dest: (0, path_1.resolve)(destPaths.apis + SERVER_FILES.apisSso),
                upgradeFlag,
            },
            {
                source: (0, path_1.resolve)(constants_1.sourceServerPathGeneration + constants_1.utilsPath + SERVER_FILES.utilsCommon),
                dest: (0, path_1.resolve)(destPaths.utils + SERVER_FILES.utilsCommon),
                upgradeFlag,
            },
            {
                source: (0, path_1.resolve)(constants_1.sourceServerPathGeneration + constants_1.utilsPath + SERVER_FILES.utilsDBPoolManager),
                dest: (0, path_1.resolve)(destPaths.utils + SERVER_FILES.utilsDBPoolManager),
                upgradeFlag,
            },
            {
                source: (0, path_1.resolve)(constants_1.sourceServerPath + constants_1.utilsPath + SERVER_FILES.utilsValidation),
                dest: (0, path_1.resolve)(destPaths.utils + SERVER_FILES.utilsValidation),
                upgradeFlag,
            },
            // REST 文件不使用 upgradeFlag
            {
                source: (0, path_1.resolve)(constants_1.sourceServerPathGeneration + constants_1.restPath),
                dest: (0, path_1.resolve)(destPaths.server + constants_1.restPath),
            },
        ];
        // 4. 复制文件
        copyMultipleFiles(fileMappings);
        console.log("Server files initialization completed");
        return {
            destServerRestPath: (0, path_1.resolve)(destPaths.server + constants_1.restPath),
        };
    }
    catch (error) {
        console.error("Failed to initialize server files:", error);
        throw error;
    }
};
exports.initServerFiles = initServerFiles;
/**
 * 初始化公共文件
 * @param dictionary 目标目录名称
 * @param newDestFolder 新的目标文件夹路径
 * @param upgradeFlag 是否为升级模式
 */
const initPublicFiles = (dictionary, newDestFolder, upgradeFlag) => {
    console.log("Initializing public files...");
    try {
        // 1. 确定目标路径
        const baseDestPath = dictionary === "" ? constants_1.destPublicPath : path_1.default.join(newDestFolder, constants_1.publicPath);
        const destPaths = {
            public: baseDestPath,
            images: (0, path_1.resolve)(baseDestPath + PUBLIC_FILES.images),
            fonts: (0, path_1.resolve)(baseDestPath + PUBLIC_FILES.fonts),
            locales: (0, path_1.resolve)(baseDestPath + PUBLIC_FILES.locales),
        };
        // 2. 创建目录结构
        const directoriesToCreate = [destPaths.public, destPaths.images, destPaths.fonts, destPaths.locales];
        createDirectoryStructure(directoriesToCreate);
        // 3. 定义文件映射
        const fileMappings = [
            {
                source: (0, path_1.resolve)(constants_1.sourcePublicPath + constants_1.slbHealthCheckPath),
                dest: (0, path_1.resolve)(destPaths.public + constants_1.slbHealthCheckPath),
                upgradeFlag,
            },
            {
                source: (0, path_1.resolve)(constants_1.sourcePublicPath + PUBLIC_FILES.favicon),
                dest: (0, path_1.resolve)(destPaths.public + PUBLIC_FILES.favicon),
                upgradeFlag,
            },
        ];
        // 4. 复制文件
        copyMultipleFiles(fileMappings);
        // 5. 复制 fonts 目录下的所有文件
        const sourceFontsDir = (0, path_1.resolve)(constants_1.sourcePublicPath + PUBLIC_FILES.fonts);
        if ((0, fs_1.existsSync)(sourceFontsDir)) {
            const fontFiles = (0, fs_1.readdirSync)(sourceFontsDir);
            fontFiles.forEach((file) => {
                const sourceFile = (0, path_1.resolve)(sourceFontsDir, file);
                const destFile = (0, path_1.resolve)(destPaths.fonts, file);
                (0, utils_1.copyFileSync)(sourceFile, destFile, upgradeFlag);
            });
        }
        // 6. 复制 locales 目录下的所有文件（递归复制）
        const sourceLocalesDir = (0, path_1.resolve)(constants_1.sourcePublicPath + PUBLIC_FILES.locales);
        if ((0, fs_1.existsSync)(sourceLocalesDir)) {
            const copyLocalesRecursive = (sourceDir, destDir) => {
                const items = (0, fs_1.readdirSync)(sourceDir, { withFileTypes: true });
                items.forEach((item) => {
                    const sourcePath = (0, path_1.resolve)(sourceDir, item.name);
                    const destPath = (0, path_1.resolve)(destDir, item.name);
                    if (item.isDirectory()) {
                        (0, utils_1.mkdirSync)(destPath);
                        copyLocalesRecursive(sourcePath, destPath);
                    }
                    else {
                        (0, utils_1.copyFileSync)(sourcePath, destPath, upgradeFlag);
                    }
                });
            };
            copyLocalesRecursive(sourceLocalesDir, destPaths.locales);
        }
        console.log("Public files initialization completed");
        return {
            destPublicHealthCheckPath: (0, path_1.resolve)(destPaths.public + constants_1.slbHealthCheckPath),
        };
    }
    catch (error) {
        console.error("Failed to initialize public files:", error);
        throw error;
    }
};
exports.initPublicFiles = initPublicFiles;
/**
 * 初始化脚本文件
 * @param dictionary 目标目录名称
 * @param newDestFolder 新的目标文件夹路径
 */
const initScriptsFiles = (dictionary, newDestFolder) => {
    console.log("Initializing scripts files...");
    try {
        // 1. 确定目标路径
        const baseDestPath = dictionary === "" ? constants_1.destScriptsPath : path_1.default.join(newDestFolder, constants_1.scriptsPath);
        // 2. 创建目录
        createDirectoryStructure([baseDestPath]);
        // 3. 定义文件映射（脚本文件通常不使用 upgradeFlag）
        const fileMappings = [
            {
                source: (0, path_1.resolve)(constants_1.sourceScriptsPath + SCRIPTS_FILES.startup),
                dest: (0, path_1.resolve)(baseDestPath + SCRIPTS_FILES.startup),
            },
            {
                source: (0, path_1.resolve)(constants_1.sourceScriptsPath + SCRIPTS_FILES.shutdown),
                dest: (0, path_1.resolve)(baseDestPath + SCRIPTS_FILES.shutdown),
            },
            {
                source: (0, path_1.resolve)(constants_1.sourceScriptsPath + SCRIPTS_FILES.password),
                dest: (0, path_1.resolve)(baseDestPath + SCRIPTS_FILES.password),
            },
        ];
        // 4. 复制文件
        copyMultipleFiles(fileMappings);
        console.log("Scripts files initialization completed");
    }
    catch (error) {
        console.error("Failed to initialize scripts files:", error);
        throw error;
    }
};
exports.initScriptsFiles = initScriptsFiles;
/**
 * 初始化根目录文件
 * @param dictionary 目标目录名称
 * @param newDestFolder 新的目标文件夹路径
 */
const initRootFiles = (dictionary, newDestFolder) => {
    console.log("Initializing root files...");
    try {
        // 1. 确定目标路径
        const baseDestPath = dictionary === "" ? constants_1.destFolder : newDestFolder;
        // 2. 定义文件映射（根文件通常不使用 upgradeFlag）
        const fileMappings = [
            {
                source: (0, path_1.resolve)(constants_1.sourceGenerationPath + ROOT_FILES.nextConfig),
                dest: (0, path_1.resolve)(baseDestPath + ROOT_FILES.nextConfig),
            },
            {
                source: (0, path_1.resolve)(path_1.default.join(constants_1.sourceFolder, "..", ROOT_FILES.nextI18nConfig)),
                dest: (0, path_1.resolve)(baseDestPath + ROOT_FILES.nextI18nConfig),
            },
            {
                source: (0, path_1.resolve)(constants_1.sourceGenerationPath + ROOT_FILES.mysqlConfig),
                dest: (0, path_1.resolve)(baseDestPath + ROOT_FILES.mysqlConfig),
            },
            {
                source: (0, path_1.resolve)(constants_1.sourceGenerationPath + ROOT_FILES.projectConfig),
                dest: (0, path_1.resolve)(baseDestPath + ROOT_FILES.projectConfig),
            },
            {
                source: (0, path_1.resolve)(constants_1.sourceGenerationPath + constants_1.packagePath),
                dest: (0, path_1.resolve)(baseDestPath + constants_1.packagePath),
            },
            {
                source: (0, path_1.resolve)(constants_1.sourceGenerationPath + ROOT_FILES.tsconfig),
                dest: (0, path_1.resolve)(baseDestPath + ROOT_FILES.tsconfig),
            },
            {
                source: (0, path_1.resolve)(constants_1.sourceGenerationPath + ROOT_FILES.gitignoreSource),
                dest: (0, path_1.resolve)(baseDestPath + ROOT_FILES.gitignore),
            },
            {
                source: (0, path_1.resolve)(constants_1.sourceGenerationPath + ROOT_FILES.eslintrc),
                dest: (0, path_1.resolve)(baseDestPath + ROOT_FILES.eslintrc),
            },
            {
                source: (0, path_1.resolve)(constants_1.sourceGenerationPath + ROOT_FILES.prettierrcSource),
                dest: (0, path_1.resolve)(baseDestPath + ROOT_FILES.prettierrc),
            },
            {
                source: path_1.default.join(constants_1.sourceFolder, ROOT_FILES.nextEnvSource),
                dest: (0, path_1.resolve)(baseDestPath + ROOT_FILES.nextEnv),
            },
            {
                source: (0, path_1.resolve)(constants_1.sourceGenerationPath + ROOT_FILES.readme),
                dest: (0, path_1.resolve)(baseDestPath + ROOT_FILES.readme),
            },
            {
                source: path_1.default.join(constants_1.sourceFolder, ROOT_FILES.appConfigSource),
                dest: (0, path_1.resolve)(baseDestPath + ROOT_FILES.appConfig),
            },
            {
                source: (0, path_1.resolve)(constants_1.sourceGenerationPath + ROOT_FILES.app),
                dest: (0, path_1.resolve)(baseDestPath + ROOT_FILES.app),
            },
            {
                source: (0, path_1.resolve)(constants_1.sourceGenerationPath + ROOT_FILES.envExampleSource),
                dest: (0, path_1.resolve)(baseDestPath + ROOT_FILES.envExample),
            },
            {
                source: (0, path_1.resolve)(constants_1.sourceGenerationPath + ROOT_FILES.envSource),
                dest: (0, path_1.resolve)(baseDestPath + ROOT_FILES.env),
            },
            {
                source: (0, path_1.resolve)(constants_1.sourceGenerationPath + ROOT_FILES.jestConfig),
                dest: (0, path_1.resolve)(baseDestPath + ROOT_FILES.jestConfig),
            },
            {
                source: (0, path_1.resolve)(path_1.default.join(constants_1.sourceFolder, "..", ROOT_FILES.jestSetup)),
                dest: (0, path_1.resolve)(baseDestPath + ROOT_FILES.jestSetup),
            },
            {
                source: (0, path_1.resolve)(path_1.default.join(constants_1.sourceFolder, "..", ROOT_FILES.jestSetupGlobals)),
                dest: (0, path_1.resolve)(baseDestPath + ROOT_FILES.jestSetupGlobals),
            },
        ];
        // 3. 复制文件
        copyMultipleFiles(fileMappings);
        // 4. 替换 mysql.config.js 中的数据库名称为项目名称（中横线替换为下划线）
        const destMysqlConfigPath = (0, path_1.resolve)(baseDestPath + ROOT_FILES.mysqlConfig);
        if ((0, fs_1.existsSync)(destMysqlConfigPath)) {
            const projectName = path_1.default.basename(baseDestPath);
            // 将中横线替换为下划线，生成数据库名称
            const databaseName = projectName.replace(/-/g, "_").toLowerCase();
            shelljs_1.default.sed("-i", /database: 'crm_demo'/, `database: '${databaseName}'`, destMysqlConfigPath);
            console.log(`Database name set to: ${databaseName}`);
        }
        console.log("Root files initialization completed");
        return {
            destPackagePath: (0, path_1.resolve)(baseDestPath + constants_1.packagePath),
        };
    }
    catch (error) {
        console.error("Failed to initialize root files:", error);
        throw error;
    }
};
exports.initRootFiles = initRootFiles;
/**
 * 初始化类型定义文件
 * @param dictionary 目标目录名称
 * @param newDestFolder 新的目标文件夹路径
 */
const initTypesFiles = (dictionary, newDestFolder) => {
    console.log("Initializing types files...");
    try {
        // 1. 确定目标路径
        const baseDestPath = dictionary === "" ? constants_1.destTypesPath : path_1.default.join(newDestFolder, constants_1.typesPath);
        // 2. 创建目录
        createDirectoryStructure([baseDestPath]);
        // 3. 复制 i18next.d.ts 文件
        const sourceI18nextFile = (0, path_1.resolve)(constants_1.destFolder, "types", "i18next.d.ts");
        const destI18nextFile = (0, path_1.resolve)(baseDestPath, "i18next.d.ts");
        if ((0, fs_1.existsSync)(sourceI18nextFile)) {
            (0, utils_1.copyFileSync)(sourceI18nextFile, destI18nextFile);
        }
        console.log("Types files initialization completed");
    }
    catch (error) {
        console.error("Failed to initialize types files:", error);
        throw error;
    }
};
exports.initTypesFiles = initTypesFiles;
/**
 * 初始化测试文件和目录
 * @param dictionary 目标目录名称
 * @param newDestFolder 新的目标文件夹路径
 */
const initTestFiles = (dictionary, newDestFolder) => {
    console.log("Initializing test files...");
    try {
        // 1. 确定目标路径
        const baseDestPath = dictionary === "" ? constants_1.destFolder : newDestFolder;
        const testDestPath = path_1.default.join(baseDestPath, "__tests__");
        // 2. 创建测试目录
        createDirectoryStructure([testDestPath]);
        // 3. 定义文件映射
        const fileMappings = [
            {
                source: path_1.default.join(constants_1.sourceGenerationPath, "__tests__", "example.test.js"),
                dest: path_1.default.join(testDestPath, "example.test.js"),
            },
        ];
        // 4. 复制文件
        copyMultipleFiles(fileMappings);
        console.log("Test files initialization completed");
    }
    catch (error) {
        console.error("Failed to initialize test files:", error);
        throw error;
    }
};
exports.initTestFiles = initTestFiles;
/**
 * 初始化配置文件和目录
 * @param dictionary 目标目录名称
 * @param newDestFolder 新的目标文件夹路径
 */
const initConfigFiles = (dictionary, newDestFolder) => {
    console.log("Initializing config files...");
    try {
        // 1. 确定目标路径
        const baseDestPath = dictionary === "" ? constants_1.destFolder : newDestFolder;
        const configDestPath = path_1.default.join(baseDestPath, constants_1.configPath);
        // 2. 创建配置目录
        createDirectoryStructure([configDestPath]);
        // 3. 复制 config 目录下的所有文件
        const sourceConfigDir = (0, path_1.resolve)(constants_1.sourceConfigPath);
        if ((0, fs_1.existsSync)(sourceConfigDir)) {
            const copyConfigRecursive = (sourceDir, destDir) => {
                const items = (0, fs_1.readdirSync)(sourceDir, { withFileTypes: true });
                items.forEach((item) => {
                    const sourcePath = (0, path_1.resolve)(sourceDir, item.name);
                    const destPath = (0, path_1.resolve)(destDir, item.name);
                    if (item.isDirectory()) {
                        (0, utils_1.mkdirSync)(destPath);
                        copyConfigRecursive(sourcePath, destPath);
                    }
                    else {
                        (0, utils_1.copyFileSync)(sourcePath, destPath, false);
                    }
                });
            };
            copyConfigRecursive(sourceConfigDir, configDestPath);
        }
        console.log("Config files initialization completed");
    }
    catch (error) {
        console.error("Failed to initialize config files:", error);
        throw error;
    }
};
exports.initConfigFiles = initConfigFiles;
