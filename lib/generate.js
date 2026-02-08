"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFiles = exports.createFiles = exports.initFiles = void 0;
const path_1 = __importDefault(require("path"));
const shelljs_1 = __importDefault(require("shelljs"));
const utils_1 = require("./utils");
const constants_1 = require("./constants");
const project_config_1 = require("./utils/project-config");
const generate_init_1 = require("./generate_init");
const generate_create_1 = require("./generate_create");
const generate_delete_1 = require("./generate_delete");
// 常量提取
const PNPM_INSTALL_FLAGS = "--strict-peer-dependencies false";
// 辅助函数
const normalizeDirectory = (dictionary) => {
    // 禁止绝对路径，强制所有生成目录都在 cwd 下
    if (!dictionary || dictionary === "/" || dictionary.trim() === "") {
        return ".";
    }
    return dictionary.trim();
};
const installNpmPackages = (targetDir) => {
    try {
        const prefix = targetDir ? `cd ${targetDir} && ` : "";
        console.log("Installing all dependencies from package.json...");
        const installResult = shelljs_1.default.exec(`${prefix}pnpm install ${PNPM_INSTALL_FLAGS}`);
        return installResult.code === 0;
    }
    catch (error) {
        console.error("Failed to install pnpm packages:", error);
        return false;
    }
};
const updateProjectFiles = (projectName, destPackagePath, destPublicHealthCheckPath, skipPackageUpdate = false) => {
    try {
        const cleanProjectName = path_1.default.basename(projectName);
        if (!skipPackageUpdate) {
            console.log(`Updating project name to: ${cleanProjectName}`);
            shelljs_1.default.sed("-i", /nsgm-cli-project/g, `${cleanProjectName}-project`, destPackagePath);
        }
        shelljs_1.default.sed("-i", /NSGM-CLI/g, cleanProjectName, destPublicHealthCheckPath);
        return true;
    }
    catch (error) {
        console.error("Failed to update project files:", error);
        return false;
    }
};
/**
 * 初始化项目文件和目录结构
 * @param dictionary 目标目录名称，空字符串表示当前目录
 * @param upgradeFlag 是否为升级模式，升级模式下不会安装依赖
 * @param projectConfig 项目配置信息（可选）
 */
const initFiles = (dictionary, upgradeFlag = false, projectConfig) => {
    if (constants_1.isLocal) {
        upgradeFlag = false;
    }
    const normalizedDictionary = normalizeDirectory(dictionary);
    let newDestFolder = constants_1.destFolder;
    if (normalizedDictionary !== ".") {
        newDestFolder = path_1.default.join(constants_1.destFolder, normalizedDictionary);
        (0, utils_1.mkdirSync)(newDestFolder);
    }
    console.log("initFiles", normalizedDictionary === "." ? "." : normalizedDictionary, upgradeFlag);
    (0, generate_init_1.initClientFiles)(normalizedDictionary, newDestFolder, upgradeFlag);
    (0, generate_init_1.initPagesFiles)(normalizedDictionary, newDestFolder, upgradeFlag);
    (0, generate_init_1.initServerFiles)(normalizedDictionary, newDestFolder, upgradeFlag);
    const { destPublicHealthCheckPath } = (0, generate_init_1.initPublicFiles)(normalizedDictionary, newDestFolder, upgradeFlag);
    (0, generate_init_1.initScriptsFiles)(normalizedDictionary, newDestFolder);
    const { destPackagePath } = (0, generate_init_1.initRootFiles)(normalizedDictionary, newDestFolder);
    (0, generate_init_1.initTestFiles)(normalizedDictionary, newDestFolder);
    (0, generate_init_1.initTypesFiles)(normalizedDictionary, newDestFolder);
    (0, generate_init_1.initConfigFiles)(normalizedDictionary, newDestFolder);
    // 如果提供了项目配置，应用到生成的文件中
    if (projectConfig) {
        console.log("应用项目配置...");
        (0, project_config_1.applyProjectConfig)(newDestFolder, projectConfig);
    }
    const installFlag = !upgradeFlag && (!constants_1.isLocal || dictionary.indexOf("..") !== -1);
    if (installFlag) {
        const projectName = normalizedDictionary !== "." ? normalizedDictionary : path_1.default.basename(constants_1.destFolder);
        // 如果有项目配置，跳过 package.json 的默认更新，因为 applyProjectConfig 已经处理了
        const skipPackageUpdate = !!projectConfig;
        const updateSuccess = updateProjectFiles(projectName, destPackagePath, destPublicHealthCheckPath, skipPackageUpdate);
        const installSuccess = installNpmPackages(normalizedDictionary !== "." ? normalizedDictionary : undefined);
        if (!updateSuccess || !installSuccess) {
            console.warn("Some operations failed during project initialization");
        }
    }
    console.log("initFiles finished");
};
exports.initFiles = initFiles;
/**
 * 创建控制器相关文件
 * @param controller 控制器名称
 * @param action 动作名称
 * @param dictionary 目标目录名称，空字符串表示当前目录
 * @param fields 字段定义数组
 */
const createFiles = (controller, action, dictionary = "", fields) => {
    const normalizedDictionary = normalizeDirectory(dictionary);
    (0, generate_create_1.createFiles)(controller, action, normalizedDictionary, fields);
};
exports.createFiles = createFiles;
/**
 * 删除控制器相关文件
 * @param controller 控制器名称
 * @param action 动作名称
 * @param deleteDBFlag 是否删除数据库相关文件
 * @param dictionary 目标目录名称，空字符串表示当前目录
 */
const deleteFiles = (controller, action, deleteDBFlag = false, dictionary = "") => {
    const normalizedDictionary = normalizeDirectory(dictionary);
    (0, generate_delete_1.deleteFiles)(controller, action, deleteDBFlag, normalizedDictionary);
};
exports.deleteFiles = deleteFiles;
