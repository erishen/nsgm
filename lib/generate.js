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
exports.deleteFiles = exports.createFiles = exports.initFiles = void 0;
const path_1 = __importStar(require("path"));
const shelljs_1 = __importDefault(require("shelljs"));
const db_1 = __importDefault(require("./server/db"));
const utils_1 = require("./utils");
const { getMysqlConfig } = db_1.default;
const { mysqlOptions } = getMysqlConfig();
const { user: mysqlUser, password: mysqlPassword, host: mysqlHost, port: mysqlPort, database: mysqlDatabase } = mysqlOptions;
const sourceFolder = __dirname;
const destFolder = process.cwd();
const isLocal = sourceFolder === (0, path_1.resolve)(`${destFolder}/lib`);
const generationPath = '../generation';
const clientPathSource = '../client';
const clientPath = './client';
const serverPathSource = '../server';
const serverPath = './server';
const pagesPathSource = '../pages';
const pagesPath = './pages';
const publicPathSource = '../public';
const publicPath = './public';
const scriptsPathSource = '../scripts';
const scriptsPath = './scripts';
const reduxPath = '/redux';
const servicePath = '/service';
const styledPath = '/styled';
const styledLayoutPath = '/layout';
const utilsPath = '/utils';
const layoutPath = '/layout';
const modulesPath = '/modules';
const apisPath = '/apis';
const sqlPath = '/sql';
const utilsMenuPath = '/menu.tsx';
const reduxReducersPath = '/reducers.ts';
const slbHealthCheckPath = '/slbhealthcheck.html';
const packagePath = '/package.json';
const restPath = '/rest.js';
const sourceGenerationPath = path_1.default.join(sourceFolder, generationPath);
const sourceClientPath = path_1.default.join(sourceFolder, clientPathSource);
const sourceClientPathGeneration = path_1.default.join(sourceGenerationPath, clientPath);
const sourceServerPath = path_1.default.join(sourceFolder, serverPathSource);
const sourceServerPathGeneration = path_1.default.join(sourceGenerationPath, serverPath);
const sourcePagesPath = path_1.default.join(sourceFolder, pagesPathSource);
const sourcePublicPath = path_1.default.join(sourceFolder, publicPathSource);
const sourceScriptsPath = path_1.default.join(sourceFolder, scriptsPathSource);
const destClientPath = path_1.default.join(destFolder, clientPath);
const destClientReduxPath = (0, path_1.resolve)(destClientPath + reduxPath);
const destClientServicePath = (0, path_1.resolve)(destClientPath + servicePath);
const destClientStyledPath = (0, path_1.resolve)(destClientPath + styledPath);
const destClientStyledLayoutPath = (0, path_1.resolve)(destClientStyledPath + styledLayoutPath);
const destClientUtilsPath = (0, path_1.resolve)(destClientPath + utilsPath);
const destClientLayoutPath = (0, path_1.resolve)(destClientPath + layoutPath);
const destServerPath = path_1.default.join(destFolder, serverPath);
const destServerModulesPath = (0, path_1.resolve)(destServerPath + modulesPath);
const destServerApisPath = (0, path_1.resolve)(destServerPath + apisPath);
const destServerSqlPath = (0, path_1.resolve)(destServerPath + sqlPath);
const destServerUtilsPath = (0, path_1.resolve)(destServerPath + utilsPath);
const destPagesPath = path_1.default.join(destFolder, pagesPath);
const destPublicPath = path_1.default.join(destFolder, publicPath);
const destScriptsPath = path_1.default.join(destFolder, scriptsPath);
let destClientUtilsMenuPath = (0, path_1.resolve)(destClientUtilsPath + utilsMenuPath);
let destClientReduxReducersAllPath = (0, path_1.resolve)(destClientReduxPath + reduxReducersPath);
let destPublicHealthCheckPath = (0, path_1.resolve)(destPublicPath + slbHealthCheckPath);
let destPackagePath = (0, path_1.resolve)(destFolder + packagePath);
let destServerRestPath = (0, path_1.resolve)(destServerPath + restPath);
const initFiles = (dictionary, upgradeFlag = false) => {
    if (isLocal) {
        upgradeFlag = false;
    }
    // 禁止绝对路径，强制所有生成目录都在 cwd 下
    if (!dictionary || dictionary === '/') {
        dictionary = '.';
    }
    let newDestFolder = destFolder;
    if (dictionary !== '') {
        newDestFolder = path_1.default.join(destFolder, dictionary);
        (0, utils_1.mkdirSync)(newDestFolder);
    }
    console.log('initFiles', dictionary === '' ? '.' : dictionary, upgradeFlag);
    const initClientFiles = () => {
        const clientReduxPath = reduxPath;
        const clientReduxReducersPath = reduxReducersPath;
        const clientReduxStorePath = '/store.ts';
        const clientStyledPath = styledPath;
        const clientStyledCommonPath = '/common.ts';
        const clientStyledLayoutPath = styledLayoutPath;
        const clientStyledLayoutIndexPath = '/index.ts';
        const clientUtilsPath = utilsPath;
        const clientUtilsCommonPath = '/common.ts';
        const clientUtilsFetchPath = '/fetch.ts';
        const clientUtilsCookiePath = '/cookie.ts';
        const clientUtilsSsoPath = '/sso.ts';
        const clientUtilsMenuPath = utilsMenuPath;
        const clientLayoutPath = layoutPath;
        const clientLayoutIndexPath = '/index.tsx';
        const sourceClientReduxReducersAllPath = (0, path_1.resolve)(sourceClientPathGeneration + clientReduxPath + clientReduxReducersPath);
        const sourceClientReduxStorePath = (0, path_1.resolve)(sourceClientPath + clientReduxPath + clientReduxStorePath);
        const sourceClientLayoutIndexPath = (0, path_1.resolve)(sourceClientPath + clientLayoutPath + clientLayoutIndexPath);
        const sourceClientStyledLayoutIndexPath = (0, path_1.resolve)(sourceClientPath + clientStyledPath + clientStyledLayoutPath + clientStyledLayoutIndexPath);
        const sourceClientStyledCommonPath = (0, path_1.resolve)(sourceClientPath + clientStyledPath + clientStyledCommonPath);
        const sourceClientUtilsCommonPath = (0, path_1.resolve)(sourceClientPath + clientUtilsPath + clientUtilsCommonPath);
        const sourceClientUtilsFetchPath = (0, path_1.resolve)(sourceClientPath + clientUtilsPath + clientUtilsFetchPath);
        const sourceClientUtilsCookiePath = (0, path_1.resolve)(sourceClientPath + clientUtilsPath + clientUtilsCookiePath);
        const sourceClientUtilsSsoPath = (0, path_1.resolve)(sourceClientPath + clientUtilsPath + clientUtilsSsoPath);
        const sourceClientUtilsMenuPath = (0, path_1.resolve)(sourceClientPathGeneration + clientUtilsPath + clientUtilsMenuPath);
        let destClientReduxStorePath = (0, path_1.resolve)(destClientReduxPath + clientReduxStorePath);
        let destClientLayoutIndexPath = (0, path_1.resolve)(destClientLayoutPath + clientLayoutIndexPath);
        let destClientStyledLayoutIndexPath = (0, path_1.resolve)(destClientStyledLayoutPath + clientStyledLayoutIndexPath);
        let destClientStyledCommonPath = (0, path_1.resolve)(destClientStyledPath + clientStyledCommonPath);
        let destClientUtilsCommonPath = (0, path_1.resolve)(destClientUtilsPath + clientUtilsCommonPath);
        let destClientUtilsFetchPath = (0, path_1.resolve)(destClientUtilsPath + clientUtilsFetchPath);
        let destClientUtilsCookiePath = (0, path_1.resolve)(destClientUtilsPath + clientUtilsCookiePath);
        let destClientUtilsSsoPath = (0, path_1.resolve)(destClientUtilsPath + clientUtilsSsoPath);
        if (dictionary === '') {
            (0, utils_1.mkdirSync)(destClientPath);
            (0, utils_1.mkdirSync)(destClientReduxPath);
            (0, utils_1.mkdirSync)(destClientStyledPath);
            (0, utils_1.mkdirSync)(destClientStyledLayoutPath);
            (0, utils_1.mkdirSync)(destClientUtilsPath);
            (0, utils_1.mkdirSync)(destClientLayoutPath);
        }
        else {
            const newDestClientPath = path_1.default.join(newDestFolder, clientPath);
            const newDestClientReduxPath = (0, path_1.resolve)(newDestClientPath + clientReduxPath);
            const newDestClientStyledPath = (0, path_1.resolve)(newDestClientPath + clientStyledPath);
            const newDestClientStyledLayoutPath = (0, path_1.resolve)(newDestClientStyledPath + clientStyledLayoutPath);
            const newDestClientUtilsPath = (0, path_1.resolve)(newDestClientPath + clientUtilsPath);
            const newDestClientLayoutPath = (0, path_1.resolve)(newDestClientPath + clientLayoutPath);
            (0, utils_1.mkdirSync)(newDestClientPath);
            (0, utils_1.mkdirSync)(newDestClientReduxPath);
            (0, utils_1.mkdirSync)(newDestClientStyledPath);
            (0, utils_1.mkdirSync)(newDestClientUtilsPath);
            (0, utils_1.mkdirSync)(newDestClientLayoutPath);
            (0, utils_1.mkdirSync)(newDestClientStyledLayoutPath);
            destClientReduxReducersAllPath = (0, path_1.resolve)(newDestClientReduxPath + clientReduxReducersPath);
            destClientReduxStorePath = (0, path_1.resolve)(newDestClientReduxPath + clientReduxStorePath);
            destClientLayoutIndexPath = (0, path_1.resolve)(newDestClientLayoutPath + clientLayoutIndexPath);
            destClientStyledLayoutIndexPath = (0, path_1.resolve)(newDestClientStyledLayoutPath + clientStyledLayoutIndexPath);
            destClientStyledCommonPath = (0, path_1.resolve)(newDestClientStyledPath + clientStyledCommonPath);
            destClientUtilsCommonPath = (0, path_1.resolve)(newDestClientUtilsPath + clientUtilsCommonPath);
            destClientUtilsFetchPath = (0, path_1.resolve)(newDestClientUtilsPath + clientUtilsFetchPath);
            destClientUtilsCookiePath = (0, path_1.resolve)(newDestClientUtilsPath + clientUtilsCookiePath);
            destClientUtilsSsoPath = (0, path_1.resolve)(newDestClientUtilsPath + clientUtilsSsoPath);
            destClientUtilsMenuPath = (0, path_1.resolve)(newDestClientUtilsPath + clientUtilsMenuPath);
        }
        (0, utils_1.copyFileSync)(sourceClientReduxStorePath, destClientReduxStorePath, upgradeFlag);
        (0, utils_1.copyFileSync)(sourceClientStyledCommonPath, destClientStyledCommonPath, upgradeFlag);
        (0, utils_1.copyFileSync)(sourceClientStyledLayoutIndexPath, destClientStyledLayoutIndexPath, upgradeFlag);
        (0, utils_1.copyFileSync)(sourceClientUtilsCookiePath, destClientUtilsCookiePath, upgradeFlag);
        (0, utils_1.copyFileSync)(sourceClientUtilsSsoPath, destClientUtilsSsoPath, upgradeFlag);
        (0, utils_1.copyFileSync)(sourceClientUtilsCommonPath, destClientUtilsCommonPath, upgradeFlag);
        (0, utils_1.copyFileSync)(sourceClientUtilsFetchPath, destClientUtilsFetchPath, upgradeFlag);
        (0, utils_1.copyFileSync)(sourceClientLayoutIndexPath, destClientLayoutIndexPath, upgradeFlag);
        (0, utils_1.copyFileSync)(sourceClientReduxReducersAllPath, destClientReduxReducersAllPath);
        (0, utils_1.copyFileSync)(sourceClientUtilsMenuPath, destClientUtilsMenuPath);
    };
    const initPagesFiles = () => {
        const pageIndexPath = '/index.tsx';
        const pageAppPath = '/_app.tsx';
        const pageDocumentPath = '/_document.tsx';
        const pageLoginPath = '/login.tsx';
        const sourcePagesIndexPath = (0, path_1.resolve)(sourcePagesPath + pageIndexPath);
        const sourcePagesAppPath = (0, path_1.resolve)(sourcePagesPath + pageAppPath);
        const sourcePagesDocumentPath = (0, path_1.resolve)(sourcePagesPath + pageDocumentPath);
        const sourcePagesLoginPath = (0, path_1.resolve)(sourcePagesPath + pageLoginPath);
        let destPagesIndexPath = (0, path_1.resolve)(destPagesPath + pageIndexPath);
        let destPagesAppPath = (0, path_1.resolve)(destPagesPath + pageAppPath);
        let destPagesDocumentPath = (0, path_1.resolve)(destPagesPath + pageDocumentPath);
        let destPagesLoginPath = (0, path_1.resolve)(destPagesPath + pageLoginPath);
        if (dictionary === '') {
            (0, utils_1.mkdirSync)(destPagesPath);
        }
        else {
            const newDestPagesPath = path_1.default.join(newDestFolder, pagesPath);
            (0, utils_1.mkdirSync)(newDestPagesPath);
            destPagesIndexPath = (0, path_1.resolve)(newDestPagesPath + pageIndexPath);
            destPagesAppPath = (0, path_1.resolve)(newDestPagesPath + pageAppPath);
            destPagesDocumentPath = (0, path_1.resolve)(newDestPagesPath + pageDocumentPath);
            destPagesLoginPath = (0, path_1.resolve)(newDestPagesPath + pageLoginPath);
        }
        (0, utils_1.copyFileSync)(sourcePagesIndexPath, destPagesIndexPath, upgradeFlag);
        (0, utils_1.copyFileSync)(sourcePagesAppPath, destPagesAppPath, upgradeFlag);
        (0, utils_1.copyFileSync)(sourcePagesDocumentPath, destPagesDocumentPath, upgradeFlag);
        (0, utils_1.copyFileSync)(sourcePagesLoginPath, destPagesLoginPath, upgradeFlag);
    };
    const initServerFiles = () => {
        const serverRestPath = restPath;
        const serverApisPath = apisPath;
        const serverApisSsoPath = '/sso.js';
        const serverUtilsPath = utilsPath;
        const serverUtilsCommonPath = '/common.js';
        const serverUtilsDBPoolManagerPath = '/db-pool-manager.js';
        const sourceServerRestPath = (0, path_1.resolve)(sourceServerPathGeneration + serverRestPath);
        const sourceServerUtilsCommonPath = (0, path_1.resolve)(sourceServerPathGeneration + serverUtilsPath + serverUtilsCommonPath);
        const sourceServerUtilsDBPoolManagerPath = (0, path_1.resolve)(sourceServerPathGeneration + serverUtilsPath + serverUtilsDBPoolManagerPath);
        const sourceServerApisSsoPath = (0, path_1.resolve)(sourceServerPath + serverApisPath + serverApisSsoPath);
        let destServerApisSsoPath = (0, path_1.resolve)(destServerApisPath + serverApisSsoPath);
        let destServerUtilsCommonPath = (0, path_1.resolve)(destServerUtilsPath + serverUtilsCommonPath);
        let destServerUtilsDBPoolManagerPath = (0, path_1.resolve)(destServerUtilsPath + serverUtilsDBPoolManagerPath);
        if (dictionary === '') {
            (0, utils_1.mkdirSync)(destServerPath);
            (0, utils_1.mkdirSync)(destServerApisPath);
            (0, utils_1.mkdirSync)(destServerUtilsPath);
        }
        else {
            const newDestServerPath = path_1.default.join(newDestFolder, serverPath);
            const newDestServerApisPath = (0, path_1.resolve)(newDestServerPath + serverApisPath);
            const newDestServerUtilsPath = (0, path_1.resolve)(newDestServerPath + serverUtilsPath);
            (0, utils_1.mkdirSync)(newDestServerPath);
            (0, utils_1.mkdirSync)(newDestServerApisPath);
            (0, utils_1.mkdirSync)(newDestServerUtilsPath);
            destServerRestPath = (0, path_1.resolve)(newDestServerPath + serverRestPath);
            destServerApisSsoPath = (0, path_1.resolve)(newDestServerApisPath + serverApisSsoPath);
            destServerUtilsCommonPath = (0, path_1.resolve)(newDestServerUtilsPath + serverUtilsCommonPath);
            destServerUtilsDBPoolManagerPath = (0, path_1.resolve)(newDestServerUtilsPath + serverUtilsDBPoolManagerPath);
        }
        (0, utils_1.copyFileSync)(sourceServerApisSsoPath, destServerApisSsoPath, upgradeFlag);
        (0, utils_1.copyFileSync)(sourceServerUtilsCommonPath, destServerUtilsCommonPath, upgradeFlag);
        (0, utils_1.copyFileSync)(sourceServerUtilsDBPoolManagerPath, destServerUtilsDBPoolManagerPath, upgradeFlag);
        (0, utils_1.copyFileSync)(sourceServerRestPath, destServerRestPath);
    };
    const initPublicFiles = () => {
        const publicImagesPath = '/images';
        const publicImagesZhizuotuPath = '/zhizuotu_1.png';
        const publicSlbHealthcheckPath = slbHealthCheckPath;
        const destPublicImagesPath = (0, path_1.resolve)(destPublicPath + publicImagesPath);
        const sourcePublicImages1Path = (0, path_1.resolve)(sourcePublicPath + publicImagesPath + publicImagesZhizuotuPath);
        const sourcePublicHealthCheckPath = (0, path_1.resolve)(sourcePublicPath + publicSlbHealthcheckPath);
        let destPublicImages1Path = (0, path_1.resolve)(destPublicImagesPath + publicImagesZhizuotuPath);
        if (dictionary === '') {
            (0, utils_1.mkdirSync)(destPublicPath);
            (0, utils_1.mkdirSync)(destPublicImagesPath);
        }
        else {
            const newDestPublicPath = path_1.default.join(newDestFolder, publicPath);
            const newDestPublicImagesPath = (0, path_1.resolve)(newDestPublicPath + publicImagesPath);
            (0, utils_1.mkdirSync)(newDestPublicPath);
            (0, utils_1.mkdirSync)(newDestPublicImagesPath);
            destPublicHealthCheckPath = (0, path_1.resolve)(newDestPublicPath + publicSlbHealthcheckPath);
            destPublicImages1Path = (0, path_1.resolve)(newDestPublicImagesPath + publicImagesZhizuotuPath);
        }
        (0, utils_1.copyFileSync)(sourcePublicHealthCheckPath, destPublicHealthCheckPath, upgradeFlag);
        (0, utils_1.copyFileSync)(sourcePublicImages1Path, destPublicImages1Path, upgradeFlag);
    };
    const initScriptsFiles = () => {
        const scriptsStartupPath = '/startup.sh';
        const scriptsShutdownPath = '/shutdown.sh';
        const sourceScriptsStartupPath = (0, path_1.resolve)(sourceScriptsPath + scriptsStartupPath);
        const sourceScriptsShutdownPath = (0, path_1.resolve)(sourceScriptsPath + scriptsShutdownPath);
        let destScriptsStartupPath = (0, path_1.resolve)(destScriptsPath + scriptsStartupPath);
        let destScriptsShutdownPath = (0, path_1.resolve)(destScriptsPath + scriptsShutdownPath);
        if (dictionary === '') {
            (0, utils_1.mkdirSync)(destScriptsPath);
        }
        else {
            const newDestScriptsPath = path_1.default.join(newDestFolder, scriptsPath);
            (0, utils_1.mkdirSync)(newDestScriptsPath);
            destScriptsStartupPath = (0, path_1.resolve)(newDestScriptsPath + scriptsStartupPath);
            destScriptsShutdownPath = (0, path_1.resolve)(newDestScriptsPath + scriptsShutdownPath);
        }
        (0, utils_1.copyFileSync)(sourceScriptsStartupPath, destScriptsStartupPath);
        (0, utils_1.copyFileSync)(sourceScriptsShutdownPath, destScriptsShutdownPath);
    };
    const initRootFiles = () => {
        const rootNextConfigPath = '/next.config.js';
        const rootMysqlConfigPath = '/mysql.config.js';
        const rootProjectConfigPath = '/project.config.js';
        const rootPackagePath = packagePath;
        const rootTsconfigPath = '/tsconfig.json';
        const rootGitignorePathSource = '/gitignore';
        const rootGitignorePath = '/.gitignore';
        const rootEslintrcPathSource = '/eslintrc.js';
        const rootEslintrcPath = '/.eslintrc.js';
        const rootNextEnvPathSource = '../next-env.d.ts';
        const rootNextEnvPath = '/next-env.d.ts';
        const rootReadmePath = '/README.md';
        const rootAppConfigPathSource = '../app.config.js';
        const rootAppConfigPath = '/app.config.js';
        const rootAppPath = '/app.js';
        const sourceNextConfigPath = (0, path_1.resolve)(sourceGenerationPath + rootNextConfigPath);
        const sourceMysqlConfigPath = (0, path_1.resolve)(sourceGenerationPath + rootMysqlConfigPath);
        const sourceProjectConfigPath = (0, path_1.resolve)(sourceGenerationPath + rootProjectConfigPath);
        const sourceTsConfigPath = (0, path_1.resolve)(sourceGenerationPath + rootTsconfigPath);
        const sourceGitignorePath = (0, path_1.resolve)(sourceGenerationPath + rootGitignorePathSource);
        const sourceEslintrcPath = (0, path_1.resolve)(sourceGenerationPath + rootEslintrcPathSource);
        const sourceNextEnvPath = path_1.default.join(sourceFolder, rootNextEnvPathSource);
        const sourceReadmePath = (0, path_1.resolve)(sourceGenerationPath + rootReadmePath);
        const sourceAppConfigPath = path_1.default.join(sourceFolder, rootAppConfigPathSource);
        const sourceAppath = (0, path_1.resolve)(sourceGenerationPath + rootAppPath);
        const sourcePackagePath = (0, path_1.resolve)(sourceGenerationPath + rootPackagePath);
        let destNextConfigPath = (0, path_1.resolve)(destFolder + rootNextConfigPath);
        let destMysqlConfigPath = (0, path_1.resolve)(destFolder + rootMysqlConfigPath);
        let destProjectConfigPath = (0, path_1.resolve)(destFolder + rootProjectConfigPath);
        let destTsConfigPath = (0, path_1.resolve)(destFolder + rootTsconfigPath);
        let destGitignorePath = (0, path_1.resolve)(destFolder + rootGitignorePath);
        let destEslintrcPath = (0, path_1.resolve)(destFolder + rootEslintrcPath);
        let destNextEnvPath = (0, path_1.resolve)(destFolder + rootNextEnvPath);
        let destReadmePath = (0, path_1.resolve)(destFolder + rootReadmePath);
        let destAppConfigPath = (0, path_1.resolve)(destFolder + rootAppConfigPath);
        let destAppath = (0, path_1.resolve)(destFolder + rootAppPath);
        if (dictionary !== '') {
            destNextConfigPath = (0, path_1.resolve)(newDestFolder + rootNextConfigPath);
            destMysqlConfigPath = (0, path_1.resolve)(newDestFolder + rootMysqlConfigPath);
            destProjectConfigPath = (0, path_1.resolve)(newDestFolder + rootProjectConfigPath);
            destTsConfigPath = (0, path_1.resolve)(newDestFolder + rootTsconfigPath);
            destGitignorePath = (0, path_1.resolve)(newDestFolder + rootGitignorePath);
            destEslintrcPath = (0, path_1.resolve)(newDestFolder + rootEslintrcPath);
            destNextEnvPath = (0, path_1.resolve)(newDestFolder + rootNextEnvPath);
            destReadmePath = (0, path_1.resolve)(newDestFolder + rootReadmePath);
            destAppConfigPath = (0, path_1.resolve)(newDestFolder + rootAppConfigPath);
            destAppath = (0, path_1.resolve)(newDestFolder + rootAppPath);
            destPackagePath = (0, path_1.resolve)(newDestFolder + rootPackagePath);
        }
        (0, utils_1.copyFileSync)(sourceNextConfigPath, destNextConfigPath);
        (0, utils_1.copyFileSync)(sourceMysqlConfigPath, destMysqlConfigPath);
        (0, utils_1.copyFileSync)(sourceProjectConfigPath, destProjectConfigPath);
        (0, utils_1.copyFileSync)(sourcePackagePath, destPackagePath);
        (0, utils_1.copyFileSync)(sourceTsConfigPath, destTsConfigPath);
        (0, utils_1.copyFileSync)(sourceGitignorePath, destGitignorePath);
        (0, utils_1.copyFileSync)(sourceEslintrcPath, destEslintrcPath);
        (0, utils_1.copyFileSync)(sourceNextEnvPath, destNextEnvPath);
        (0, utils_1.copyFileSync)(sourceReadmePath, destReadmePath);
        (0, utils_1.copyFileSync)(sourceAppConfigPath, destAppConfigPath);
        (0, utils_1.copyFileSync)(sourceAppath, destAppath);
    };
    initClientFiles();
    initPagesFiles();
    initServerFiles();
    initPublicFiles();
    initScriptsFiles();
    initRootFiles();
    if (!isLocal && !upgradeFlag) {
        if (dictionary !== '') {
            shelljs_1.default.sed('-i', eval('/nsgm-cli-project/'), `${dictionary}-project`, destPackagePath);
            shelljs_1.default.sed('-i', eval('/NSGM-CLI/'), dictionary, destPublicHealthCheckPath);
            shelljs_1.default.exec(`cd ${dictionary} && npm install --save nsgm-cli --legacy-peer-deps`);
            shelljs_1.default.exec(`cd ${dictionary} && npm install --save-dev @types/node@^20 @types/react@^18 @types/lodash@^4 typescript@^5 --legacy-peer-deps`);
        }
        else {
            shelljs_1.default.sed('-i', eval('/nsgm-cli-project/'), `${path_1.default.basename(destFolder)}-project`, destPackagePath);
            shelljs_1.default.sed('-i', eval('/NSGM-CLI/'), path_1.default.basename(destFolder), destPublicHealthCheckPath);
            shelljs_1.default.exec('npm install --save nsgm-cli --legacy-peer-deps');
            shelljs_1.default.exec('npm install --save-dev @types/node@^20 @types/react@^18 @types/lodash@^4 typescript@^5 --legacy-peer-deps');
        }
    }
    console.log('initFiles finished');
};
exports.initFiles = initFiles;
const createFiles = (controller, action) => {
    console.log('createFiles', sourceFolder, destFolder, isLocal, controller, action);
    (0, utils_1.mkdirSync)(destClientPath);
    (0, utils_1.mkdirSync)(destServerPath);
    (0, utils_1.mkdirSync)(destPagesPath);
    // pages
    const sourcePagesActionPath = (0, path_1.resolve)(`${sourcePagesPath}/template/manage.tsx`);
    const destPagesControllerPath = (0, path_1.resolve)(`${destPagesPath}/${controller}`);
    const destPagesActionPath = (0, path_1.resolve)(`${destPagesControllerPath}/${action}.tsx`);
    (0, utils_1.mkdirSync)(destPagesControllerPath);
    (0, utils_1.copyFileSync)(sourcePagesActionPath, destPagesActionPath);
    console.log('pages finished');
    // client redux
    const destClientReduxControllerPath = (0, path_1.resolve)(`${destClientReduxPath}/${controller}`);
    const destClientReduxControllerActionPath = (0, path_1.resolve)(`${destClientReduxControllerPath}/${action}`);
    (0, utils_1.mkdirSync)(destClientReduxPath);
    (0, utils_1.mkdirSync)(destClientReduxControllerPath);
    (0, utils_1.mkdirSync)(destClientReduxControllerActionPath);
    const sourceClientReduxActionsPath = (0, path_1.resolve)(`${sourceClientPath}/redux/template/manage/actions.ts`);
    const sourceClientReduxReducersPath = (0, path_1.resolve)(`${sourceClientPath}/redux/template/manage/reducers.ts`);
    const sourceClientReduxTypesPath = (0, path_1.resolve)(`${sourceClientPath}/redux/template/manage/types.ts`);
    const destClientReduxActionsPath = (0, path_1.resolve)(`${destClientReduxControllerActionPath}/actions.ts`);
    const destClientReduxReducersPath = (0, path_1.resolve)(`${destClientReduxControllerActionPath}/reducers.ts`);
    const destClientReduxTypesPath = (0, path_1.resolve)(`${destClientReduxControllerActionPath}/types.ts`);
    (0, utils_1.copyFileSync)(sourceClientReduxActionsPath, destClientReduxActionsPath);
    (0, utils_1.copyFileSync)(sourceClientReduxReducersPath, destClientReduxReducersPath);
    (0, utils_1.copyFileSync)(sourceClientReduxTypesPath, destClientReduxTypesPath);
    console.log('client redux finished');
    // client service
    const sourceClientActionPath = (0, path_1.resolve)(`${sourceClientPath}/service/template/manage.ts`);
    const destClientServiceControllerPath = (0, path_1.resolve)(`${destClientServicePath}/${controller}`);
    const destClientActionPath = (0, path_1.resolve)(`${destClientServiceControllerPath}/${action}.ts`);
    (0, utils_1.mkdirSync)(destClientServicePath);
    (0, utils_1.mkdirSync)(destClientServiceControllerPath);
    (0, utils_1.copyFileSync)(sourceClientActionPath, destClientActionPath);
    console.log('client service finished');
    // client styled
    const sourceClientStyledActionPath = (0, path_1.resolve)(`${sourceClientPath}/styled/template/manage.ts`);
    const destClientStyledControllerPath = (0, path_1.resolve)(`${destClientStyledPath}/${controller}`);
    (0, utils_1.mkdirSync)(destClientStyledPath);
    (0, utils_1.mkdirSync)(destClientStyledControllerPath);
    const destClientStyledActionPath = (0, path_1.resolve)(`${destClientStyledControllerPath}/${action}.ts`);
    (0, utils_1.copyFileSync)(sourceClientStyledActionPath, destClientStyledActionPath);
    console.log('client styled finished');
    // server modules
    const sourceServerModulesResolverPath = (0, path_1.resolve)(`${sourceServerPath}/modules/template/resolver.js`);
    const sourceServerModulesSchemaPath = (0, path_1.resolve)(`${sourceServerPath}/modules/template/schema.js`);
    const destServerModulesControllerPath = (0, path_1.resolve)(`${destServerModulesPath}/${controller}`);
    (0, utils_1.mkdirSync)(destServerModulesPath);
    (0, utils_1.mkdirSync)(destServerModulesControllerPath);
    const destServerModulesResolverPath = (0, path_1.resolve)(`${destServerModulesControllerPath}/resolver.js`);
    const destServerModulesSchemaPath = (0, path_1.resolve)(`${destServerModulesControllerPath}/schema.js`);
    (0, utils_1.copyFileSync)(sourceServerModulesResolverPath, destServerModulesResolverPath);
    (0, utils_1.copyFileSync)(sourceServerModulesSchemaPath, destServerModulesSchemaPath);
    console.log('server modules finished');
    // server apis
    const sourceServerApisControllerPath = (0, path_1.resolve)(`${sourceServerPath}/apis/template.js`);
    (0, utils_1.mkdirSync)(destServerApisPath);
    const destServerApisControllerPath = (0, path_1.resolve)(`${destServerApisPath}/${controller}.js`);
    (0, utils_1.copyFileSync)(sourceServerApisControllerPath, destServerApisControllerPath);
    console.log('server apis finished');
    // server sql
    const sourceServerSqlControllerPath = (0, path_1.resolve)(`${sourceServerPath}/sql/template.sql`);
    (0, utils_1.mkdirSync)(destServerSqlPath);
    const destServerSqlControllerPath = (0, path_1.resolve)(`${destServerSqlPath}/${controller}.sql`);
    (0, utils_1.copyFileSync)(sourceServerSqlControllerPath, destServerSqlControllerPath);
    console.log('server sql finished');
    // replace dest files
    (0, utils_1.handleReplace)({
        regex: 'template',
        replacement: controller,
        paths: [
            destPagesActionPath,
            destClientActionPath,
            destClientReduxActionsPath,
            destClientReduxReducersPath,
            destServerModulesResolverPath,
            destServerModulesSchemaPath,
            destServerApisControllerPath
        ]
    });
    (0, utils_1.handleReplace)({
        regex: 'Template',
        replacement: (0, utils_1.firstUpperCase)(controller),
        paths: [
            destPagesActionPath,
            destClientActionPath,
            destClientReduxActionsPath,
            destServerModulesSchemaPath,
            destServerApisControllerPath
        ]
    });
    (0, utils_1.handleReplace)({
        regex: 'TEMPLATE',
        replacement: controller.toUpperCase(),
        paths: [destClientReduxActionsPath, destClientReduxReducersPath, destClientReduxTypesPath]
    });
    (0, utils_1.handleReplace)({
        regex: 'manage',
        replacement: action,
        paths: [destPagesActionPath, destClientReduxActionsPath]
    });
    (0, utils_1.handleReplace)({
        regex: 'Manage',
        replacement: (0, utils_1.firstUpperCase)(action),
        paths: [destPagesActionPath, destClientReduxReducersPath]
    });
    console.log('replace dest files finished');
    // special replace dest files
    const optionsArr = [
        {
            from: /\n\s*\n/,
            to: `\nimport { ${controller}${(0, utils_1.firstUpperCase)(action)}Reducer } from './${controller}/${action}/reducers'\n\n`,
            files: [destClientReduxReducersAllPath]
        },
        {
            from: /Reducer,\s*\n/,
            to: `Reducer,\n  ${controller}${(0, utils_1.firstUpperCase)(action)}: ${controller}${(0, utils_1.firstUpperCase)(action)}Reducer,\n`,
            files: [destClientReduxReducersAllPath]
        },
        {
            from: /'(.\/apis\/template.*?)'\)\s*\n/,
            to: `'./apis/template')\nconst ${controller} = require('./apis/${controller}')\n`,
            files: [destServerRestPath]
        },
        {
            from: /template\)\s*\n/,
            to: `template)\nrouter.use('/${controller}', ${controller})\n`,
            files: [destServerRestPath]
        },
        {
            from: /null\s*\n/,
            to: `null\n  },\n  {\n    // ${controller}_${action}_start\n    key: (++key).toString(),\n    text: '${controller}',\n    url: '/${controller}/${action}',\n    icon: <SolutionOutlined rev={undefined} />,\n    ` +
                `subMenus: [\n      {\n        key: key + '_1',\n        text: '${action}',\n        url: '/${controller}/${action}'\n      }\n    ]\n    // ${controller}_${action}_end\n`,
            files: [destClientUtilsMenuPath]
        }
    ];
    if (isLocal) {
        optionsArr.push({
            from: /'nsgm-cli'\)/,
            to: "'../../../index')",
            files: [destServerModulesResolverPath]
        });
    }
    shelljs_1.default.sed('-i', eval(`/.*${controller}${(0, utils_1.firstUpperCase)(action)}Reducer.*/`), '', destClientReduxReducersAllPath);
    shelljs_1.default.sed('-i', eval(`/.*${controller}.*/`), '', destServerRestPath);
    shelljs_1.default.sed('-i', eval('/template/'), controller, destServerSqlControllerPath);
    shelljs_1.default.sed('-i', eval('/crm_demo/'), mysqlDatabase, destServerSqlControllerPath);
    shelljs_1.default.exec(`mysql -u${mysqlUser} -p${mysqlPassword} -h${mysqlHost} -P${mysqlPort} < ${destServerSqlControllerPath}`);
    setTimeout(() => {
        (0, utils_1.replaceInFileAll)(optionsArr, 0, () => {
            console.log('special replace dest files finished');
        });
    }, 1000);
};
exports.createFiles = createFiles;
const deleteFiles = (controller, action, deleteDBFlag = false) => {
    console.log('deleteFiles', sourceFolder, destFolder, isLocal, controller, action, deleteDBFlag);
    // pages
    const destPagesControllerPath = (0, path_1.resolve)(`${destPagesPath}/${controller}`);
    // client redux
    const destClientReduxControllerPath = (0, path_1.resolve)(`${destClientReduxPath}/${controller}`);
    // client service
    const destClientServiceControllerPath = (0, path_1.resolve)(`${destClientServicePath}/${controller}`);
    // client styled
    const destClientStyledControllerPath = (0, path_1.resolve)(`${destClientStyledPath}/${controller}`);
    // server modules
    const destServerModulesControllerPath = (0, path_1.resolve)(`${destServerModulesPath}/${controller}`);
    // server apis
    const destServerApisControllerPath = (0, path_1.resolve)(`${destServerApisPath}/${controller}.js`);
    // server sql
    const destServerSqlControllerPath = (0, path_1.resolve)(`${destServerSqlPath}/${controller}.sql`);
    if (action === 'all') {
        (0, utils_1.rmdirSync)(destPagesControllerPath);
        (0, utils_1.rmdirSync)(destClientReduxControllerPath);
        (0, utils_1.rmdirSync)(destClientServiceControllerPath);
        (0, utils_1.rmdirSync)(destClientStyledControllerPath);
        (0, utils_1.rmdirSync)(destServerModulesControllerPath);
        (0, utils_1.rmFileSync)(destServerApisControllerPath);
        shelljs_1.default.sed('-i', eval(`/.*${controller}.*` + `Reducer.*/`), '', destClientReduxReducersAllPath);
        shelljs_1.default.sed('-i', eval(`/.*${controller}.*/`), '', destServerRestPath);
        shelljs_1.default.sed('-i', eval(`/.*${controller}_.*_start.*/`), '    /*', destClientUtilsMenuPath);
        shelljs_1.default.sed('-i', eval(`/.*${controller}_.*_end.*/`), '    */', destClientUtilsMenuPath);
        if (deleteDBFlag) {
            shelljs_1.default.sed('-i', eval(`/${mysqlDatabase};/`), `${mysqlDatabase};\nDROP TABLE \`${controller}\`;\n/*`, destServerSqlControllerPath);
            shelljs_1.default.sed('-i', eval('/utf8mb4;/'), 'utf8mb4;\n*/', destServerSqlControllerPath);
            shelljs_1.default.exec(`mysql -u${mysqlUser} -p${mysqlPassword} -h${mysqlHost} -P${mysqlPort} < ${destServerSqlControllerPath}`);
        }
        (0, utils_1.rmFileSync)(destServerSqlControllerPath);
        const optionsArr = [
            {
                from: /\n\s*\n/,
                to: '\n\n',
                files: [destClientReduxReducersAllPath]
            },
            {
                from: /Reducer,\s*\n/,
                to: 'Reducer,\n',
                files: [destClientReduxReducersAllPath]
            },
            {
                from: /'(.\/apis\/template.*?)'\)\s*\n/,
                to: "'./apis/template')\n\n",
                files: [destServerRestPath]
            },
            {
                from: /template\)\s*\n/,
                to: 'template)\n\n',
                files: [destServerRestPath]
            }
        ];
        setTimeout(() => {
            (0, utils_1.replaceInFileAll)(optionsArr, 0, () => {
                console.log('special replace dest files finished');
            });
        }, 1000);
    }
    else {
        // pages
        const destPagesActionPath = (0, path_1.resolve)(`${destPagesControllerPath}/${action}.tsx`);
        // client redux
        const destClientReduxControllerActionPath = (0, path_1.resolve)(`${destClientReduxControllerPath}/${action}`);
        // client service
        const destClientActionPath = (0, path_1.resolve)(`${destClientServiceControllerPath}/${action}.ts`);
        // client styled
        const destClientStyledActionPath = (0, path_1.resolve)(`${destClientStyledControllerPath}/${action}.ts`);
        (0, utils_1.rmFileSync)(destPagesActionPath);
        (0, utils_1.rmdirSync)(destClientReduxControllerActionPath);
        (0, utils_1.rmFileSync)(destClientActionPath);
        (0, utils_1.rmFileSync)(destClientStyledActionPath);
        shelljs_1.default.sed('-i', eval(`/.*${controller}${(0, utils_1.firstUpperCase)(action)}Reducer.*/`), '', destClientReduxReducersAllPath);
        const optionsArr = [
            {
                from: /\n\s*\n/,
                to: '\n\n',
                files: [destClientReduxReducersAllPath]
            },
            {
                from: /Reducer,\s*\n/,
                to: 'Reducer,\n',
                files: [destClientReduxReducersAllPath]
            }
        ];
        setTimeout(() => {
            (0, utils_1.replaceInFileAll)(optionsArr, 0, () => {
                console.log('special replace dest files finished');
            });
        }, 1000);
    }
    console.log('delFiles finished');
};
exports.deleteFiles = deleteFiles;
