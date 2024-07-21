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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFiles = exports.createFiles = exports.initFiles = void 0;
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var shelljs_1 = __importDefault(require("shelljs"));
var db_1 = __importDefault(require("./server/db"));
var replace_1 = __importDefault(require("replace"));
var resolve = path_1.default.resolve;
var getMysqlConfig = db_1.default.getMysqlConfig;
var mysqlOptions = getMysqlConfig().mysqlOptions;
var mysqlUser = mysqlOptions.user, mysqlPassword = mysqlOptions.password, mysqlHost = mysqlOptions.host, mysqlPort = mysqlOptions.port, mysqlDatabase = mysqlOptions.database;
var mkdirFlag = true;
var copyFileFlag = true;
var replaceFlag = true;
var replaceInFileFlag = true;
var rmdirFlag = true;
var rmfileFlag = true;
var firstUpperCase = function (word) {
    return word.substring(0, 1).toUpperCase() + word.substring(1);
};
var mkdirSync = function (dirPath) {
    if (mkdirFlag) {
        if (!fs_1.default.existsSync(dirPath)) {
            fs_1.default.mkdirSync(dirPath);
        }
    }
};
var rmFileSync = function (filePath) {
    if (rmfileFlag) {
        if (fs_1.default.existsSync(filePath)) {
            fs_1.default.unlinkSync(filePath);
        }
    }
};
var rmdirSync = function (dirPath) {
    if (rmdirFlag) {
        if (fs_1.default.existsSync(dirPath)) {
            var list = fs_1.default.readdirSync(dirPath);
            list.forEach(function (item) {
                var resolverPath = resolve(dirPath + '/' + item);
                var stat = fs_1.default.statSync(resolverPath);
                var isDir = stat.isDirectory();
                var isFile = stat.isFile();
                if (isDir) {
                    rmdirSync(resolverPath);
                }
                else if (isFile) {
                    rmFileSync(resolverPath);
                }
            });
            fs_1.default.rmdirSync(dirPath);
        }
    }
};
var copyFileSync = function (source, dest, upgradeFlag) {
    if (upgradeFlag === void 0) { upgradeFlag = false; }
    if (copyFileFlag) {
        if (!upgradeFlag) {
            if (!fs_1.default.existsSync(dest) && fs_1.default.existsSync(source)) {
                fs_1.default.copyFileSync(source, dest);
            }
        }
        else {
            if (fs_1.default.existsSync(source)) {
                fs_1.default.copyFileSync(source, dest);
            }
        }
    }
};
var handleReplace = function (_a) {
    var regex = _a.regex, replacement = _a.replacement, paths = _a.paths;
    if (replaceFlag) {
        (0, replace_1.default)({
            regex: regex,
            replacement: replacement,
            paths: paths,
            recursive: true,
            silent: true
        });
    }
};
var replaceInFileAll = function (array_1) {
    var args_1 = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args_1[_i - 1] = arguments[_i];
    }
    return __awaiter(void 0, __spreadArray([array_1], args_1, true), void 0, function (array, index, callback) {
        var replaceInFile, arrayLen, item;
        if (index === void 0) { index = 0; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Promise.resolve().then(function () { return __importStar(require('replace-in-file')); })];
                case 1:
                    replaceInFile = (_a.sent()).replaceInFile;
                    if (replaceInFileFlag) {
                        console.log('replaceInFileAll', index);
                        arrayLen = array.length;
                        if (index < arrayLen) {
                            item = array[index];
                            replaceInFile(item).then(function (changedFiles) {
                                console.log('Modified files:', changedFiles);
                                replaceInFileAll(array, ++index, callback);
                            }).catch(function (error) {
                                if (error) {
                                    console.error('Error occurred:', error);
                                }
                            });
                            // replaceInFile(item, (error, changedFiles) => {
                            //   if (error) {
                            //     console.error('Error occurred:', error)
                            //   }
                            //   console.log('Modified files:', changedFiles)
                            //   replaceInFileAll(array, ++index, callback)
                            // })
                        }
                        else {
                            return [2 /*return*/, callback && callback()];
                        }
                    }
                    else {
                        return [2 /*return*/, callback && callback()];
                    }
                    return [2 /*return*/];
            }
        });
    });
};
var sourceFolder = __dirname;
var destFolder = process.cwd();
var isLocal = sourceFolder === resolve(destFolder + '/lib');
var generationPath = '../generation';
var clientPathSource = '../client';
var clientPath = './client';
var serverPathSource = '../server';
var serverPath = './server';
var pagesPathSource = '../pages';
var pagesPath = './pages';
var publicPathSource = '../public';
var publicPath = './public';
var scriptsPathSource = '../scripts';
var scriptsPath = './scripts';
var reduxPath = '/redux';
var servicePath = '/service';
var styledPath = '/styled';
var styledLayoutPath = '/layout';
var utilsPath = '/utils';
var layoutPath = '/layout';
var modulesPath = '/modules';
var apisPath = '/apis';
var sqlPath = '/sql';
var utilsMenuPath = '/menu.tsx';
var reduxReducersPath = '/reducers.ts';
var slbHealthCheckPath = '/slbhealthcheck.html';
var packagePath = '/package.json';
var restPath = '/rest.js';
var sourceGenerationPath = path_1.default.join(sourceFolder, generationPath);
var sourceClientPath = path_1.default.join(sourceFolder, clientPathSource);
var sourceClientPathGeneration = path_1.default.join(sourceGenerationPath, clientPath);
var sourceServerPath = path_1.default.join(sourceFolder, serverPathSource);
var sourceServerPathGeneration = path_1.default.join(sourceGenerationPath, serverPath);
var sourcePagesPath = path_1.default.join(sourceFolder, pagesPathSource);
var sourcePublicPath = path_1.default.join(sourceFolder, publicPathSource);
var sourceScriptsPath = path_1.default.join(sourceFolder, scriptsPathSource);
var destClientPath = path_1.default.join(destFolder, clientPath);
var destClientReduxPath = resolve(destClientPath + reduxPath);
var destClientServicePath = resolve(destClientPath + servicePath);
var destClientStyledPath = resolve(destClientPath + styledPath);
var destClientStyledLayoutPath = resolve(destClientStyledPath + styledLayoutPath);
var destClientUtilsPath = resolve(destClientPath + utilsPath);
var destClientLayoutPath = resolve(destClientPath + layoutPath);
var destServerPath = path_1.default.join(destFolder, serverPath);
var destServerModulesPath = resolve(destServerPath + modulesPath);
var destServerApisPath = resolve(destServerPath + apisPath);
var destServerSqlPath = resolve(destServerPath + sqlPath);
var destServerUtilsPath = resolve(destServerPath + utilsPath);
var destPagesPath = path_1.default.join(destFolder, pagesPath);
var destPublicPath = path_1.default.join(destFolder, publicPath);
var destScriptsPath = path_1.default.join(destFolder, scriptsPath);
var destClientUtilsMenuPath = resolve(destClientUtilsPath + utilsMenuPath);
var destClientReduxReducersAllPath = resolve(destClientReduxPath + reduxReducersPath);
var destPublicHealthCheckPath = resolve(destPublicPath + slbHealthCheckPath);
var destPackagePath = resolve(destFolder + packagePath);
var destServerRestPath = resolve(destServerPath + restPath);
var initFiles = function (dictionary, upgradeFlag) {
    if (upgradeFlag === void 0) { upgradeFlag = false; }
    if (isLocal) {
        upgradeFlag = false;
    }
    var newDestFolder = '';
    if (dictionary !== '') {
        newDestFolder = resolve(destFolder + '/' + dictionary);
        mkdirSync(newDestFolder);
    }
    console.log('initFiles', dictionary === '' ? '.' : dictionary, upgradeFlag);
    var initClientFiles = function () {
        var clientReduxPath = reduxPath;
        var clientReduxReducersPath = reduxReducersPath;
        var clientReduxStorePath = '/store.ts';
        var clientStyledPath = styledPath;
        var clientStyledCommonPath = '/common.ts';
        var clientStyledLayoutPath = styledLayoutPath;
        var clientStyledLayoutIndexPath = '/index.ts';
        var clientUtilsPath = utilsPath;
        var clientUtilsCommonPath = '/common.ts';
        var clientUtilsFetchPath = '/fetch.ts';
        var clientUtilsCookiePath = '/cookie.ts';
        var clientUtilsSsoPath = '/sso.ts';
        var clientUtilsMenuPath = utilsMenuPath;
        var clientLayoutPath = layoutPath;
        var clientLayoutIndexPath = '/index.tsx';
        // 仍旧使用 generation/client/redux/reducers.ts
        var sourceClientReduxReducersAllPath = resolve(sourceClientPathGeneration + clientReduxPath + clientReduxReducersPath);
        var sourceClientReduxStorePath = resolve(sourceClientPath + clientReduxPath + clientReduxStorePath);
        var sourceClientLayoutIndexPath = resolve(sourceClientPath + clientLayoutPath + clientLayoutIndexPath);
        var sourceClientStyledLayoutIndexPath = resolve(sourceClientPath + clientStyledPath + clientStyledLayoutPath + clientStyledLayoutIndexPath);
        var sourceClientStyledCommonPath = resolve(sourceClientPath + clientStyledPath + clientStyledCommonPath);
        var sourceClientUtilsCommonPath = resolve(sourceClientPath + clientUtilsPath + clientUtilsCommonPath);
        var sourceClientUtilsFetchPath = resolve(sourceClientPath + clientUtilsPath + clientUtilsFetchPath);
        var sourceClientUtilsCookiePath = resolve(sourceClientPath + clientUtilsPath + clientUtilsCookiePath);
        var sourceClientUtilsSsoPath = resolve(sourceClientPath + clientUtilsPath + clientUtilsSsoPath);
        // 仍旧使用 generation/client/utils/menu.tsx
        var sourceClientUtilsMenuPath = resolve(sourceClientPathGeneration + clientUtilsPath + clientUtilsMenuPath);
        var destClientReduxStorePath = resolve(destClientReduxPath + clientReduxStorePath);
        var destClientLayoutIndexPath = resolve(destClientLayoutPath + clientLayoutIndexPath);
        var destClientStyledLayoutIndexPath = resolve(destClientStyledLayoutPath + clientStyledLayoutIndexPath);
        var destClientStyledCommonPath = resolve(destClientStyledPath + clientStyledCommonPath);
        var destClientUtilsCommonPath = resolve(destClientUtilsPath + clientUtilsCommonPath);
        var destClientUtilsFetchPath = resolve(destClientUtilsPath + clientUtilsFetchPath);
        var destClientUtilsCookiePath = resolve(destClientUtilsPath + clientUtilsCookiePath);
        var destClientUtilsSsoPath = resolve(destClientUtilsPath + clientUtilsSsoPath);
        if (dictionary === '') {
            mkdirSync(destClientPath);
            mkdirSync(destClientReduxPath);
            mkdirSync(destClientStyledPath);
            mkdirSync(destClientStyledLayoutPath);
            mkdirSync(destClientUtilsPath);
            mkdirSync(destClientLayoutPath);
        }
        else {
            var newDestClientPath = path_1.default.join(newDestFolder, clientPath);
            var newDestClientReduxPath = resolve(newDestClientPath + clientReduxPath);
            var newDestClientStyledPath = resolve(newDestClientPath + clientStyledPath);
            var newDestClientStyledLayoutPath = resolve(newDestClientStyledPath + clientStyledLayoutPath);
            var newDestClientUtilsPath = resolve(newDestClientPath + clientUtilsPath);
            var newDestClientLayoutPath = resolve(newDestClientPath + clientLayoutPath);
            mkdirSync(newDestClientPath);
            mkdirSync(newDestClientReduxPath);
            mkdirSync(newDestClientStyledPath);
            mkdirSync(newDestClientUtilsPath);
            mkdirSync(newDestClientLayoutPath);
            mkdirSync(newDestClientStyledLayoutPath);
            destClientReduxReducersAllPath = resolve(newDestClientReduxPath + clientReduxReducersPath);
            destClientReduxStorePath = resolve(newDestClientReduxPath + clientReduxStorePath);
            destClientLayoutIndexPath = resolve(newDestClientLayoutPath + clientLayoutIndexPath);
            destClientStyledLayoutIndexPath = resolve(newDestClientStyledLayoutPath + clientStyledLayoutIndexPath);
            destClientStyledCommonPath = resolve(newDestClientStyledPath + clientStyledCommonPath);
            destClientUtilsCommonPath = resolve(newDestClientUtilsPath + clientUtilsCommonPath);
            destClientUtilsFetchPath = resolve(newDestClientUtilsPath + clientUtilsFetchPath);
            destClientUtilsCookiePath = resolve(newDestClientUtilsPath + clientUtilsCookiePath);
            destClientUtilsSsoPath = resolve(newDestClientUtilsPath + clientUtilsSsoPath);
            destClientUtilsMenuPath = resolve(newDestClientUtilsPath + clientUtilsMenuPath);
        }
        copyFileSync(sourceClientReduxStorePath, destClientReduxStorePath, upgradeFlag);
        copyFileSync(sourceClientStyledCommonPath, destClientStyledCommonPath, upgradeFlag);
        copyFileSync(sourceClientStyledLayoutIndexPath, destClientStyledLayoutIndexPath, upgradeFlag);
        copyFileSync(sourceClientUtilsCookiePath, destClientUtilsCookiePath, upgradeFlag);
        copyFileSync(sourceClientUtilsSsoPath, destClientUtilsSsoPath, upgradeFlag);
        copyFileSync(sourceClientUtilsCommonPath, destClientUtilsCommonPath, upgradeFlag);
        copyFileSync(sourceClientUtilsFetchPath, destClientUtilsFetchPath, upgradeFlag);
        copyFileSync(sourceClientLayoutIndexPath, destClientLayoutIndexPath, upgradeFlag);
        copyFileSync(sourceClientReduxReducersAllPath, destClientReduxReducersAllPath);
        copyFileSync(sourceClientUtilsMenuPath, destClientUtilsMenuPath);
    };
    var initPagesFiles = function () {
        var pageIndexPath = '/index.tsx';
        var pageAppPath = '/_app.tsx';
        var pageDocumentPath = '/_document.tsx';
        var pageLoginPath = '/login.tsx';
        var sourcePagesIndexPath = resolve(sourcePagesPath + pageIndexPath);
        var sourcePagesAppPath = resolve(sourcePagesPath + pageAppPath);
        var sourcePagesDocumentPath = resolve(sourcePagesPath + pageDocumentPath);
        var sourcePagesLoginPath = resolve(sourcePagesPath + pageLoginPath);
        var destPagesIndexPath = resolve(destPagesPath + pageIndexPath);
        var destPagesAppPath = resolve(destPagesPath + pageAppPath);
        var destPagesDocumentPath = resolve(destPagesPath + pageDocumentPath);
        var destPagesLoginPath = resolve(destPagesPath + pageLoginPath);
        if (dictionary === '') {
            mkdirSync(destPagesPath);
        }
        else {
            var newDestPagesPath = path_1.default.join(newDestFolder, pagesPath);
            mkdirSync(newDestPagesPath);
            destPagesIndexPath = resolve(newDestPagesPath + pageIndexPath);
            destPagesAppPath = resolve(newDestPagesPath + pageAppPath);
            destPagesDocumentPath = resolve(newDestPagesPath + pageDocumentPath);
            destPagesLoginPath = resolve(newDestPagesPath + pageLoginPath);
        }
        copyFileSync(sourcePagesIndexPath, destPagesIndexPath, upgradeFlag);
        copyFileSync(sourcePagesAppPath, destPagesAppPath, upgradeFlag);
        copyFileSync(sourcePagesDocumentPath, destPagesDocumentPath, upgradeFlag);
        copyFileSync(sourcePagesLoginPath, destPagesLoginPath, upgradeFlag);
    };
    var initServerFiles = function () {
        var serverRestPath = restPath;
        var serverApisPath = apisPath;
        var serverApisSsoPath = '/sso.js';
        var serverUtilsPath = utilsPath;
        var serverUtilsCommonPath = '/common.js';
        // 仍旧使用 generation/server/rest.js
        var sourceServerRestPath = resolve(sourceServerPathGeneration + serverRestPath);
        // 仍旧使用 generation/server/utils/common.js
        var sourceServerUtilsCommonPath = resolve(sourceServerPathGeneration + serverUtilsPath + serverUtilsCommonPath);
        var sourceServerApisSsoPath = resolve(sourceServerPath + serverApisPath + serverApisSsoPath);
        var destServerApisSsoPath = resolve(destServerApisPath + serverApisSsoPath);
        var destServerUtilsCommonPath = resolve(destServerUtilsPath + serverUtilsCommonPath);
        if (dictionary === '') {
            mkdirSync(destServerPath);
            mkdirSync(destServerApisPath);
            mkdirSync(destServerUtilsPath);
        }
        else {
            var newDestServerPath = path_1.default.join(newDestFolder, serverPath);
            var newDestServerApisPath = resolve(newDestServerPath + serverApisPath);
            var newDestServerUtilsPath = resolve(newDestServerPath + serverUtilsPath);
            mkdirSync(newDestServerPath);
            mkdirSync(newDestServerApisPath);
            mkdirSync(newDestServerUtilsPath);
            destServerRestPath = resolve(newDestServerPath + serverRestPath);
            destServerApisSsoPath = resolve(newDestServerApisPath + serverApisSsoPath);
            destServerUtilsCommonPath = resolve(newDestServerUtilsPath + serverUtilsCommonPath);
        }
        copyFileSync(sourceServerApisSsoPath, destServerApisSsoPath, upgradeFlag);
        copyFileSync(sourceServerUtilsCommonPath, destServerUtilsCommonPath, upgradeFlag);
        copyFileSync(sourceServerRestPath, destServerRestPath);
    };
    var initPublicFiles = function () {
        var publicImagesPath = '/images';
        var publicImagesZhizuotuPath = '/zhizuotu_1.png';
        var publicSlbHealthcheckPath = slbHealthCheckPath;
        var destPublicImagesPath = resolve(destPublicPath + publicImagesPath);
        var sourcePublicImages1Path = resolve(sourcePublicPath + publicImagesPath + publicImagesZhizuotuPath);
        var sourcePublicHealthCheckPath = resolve(sourcePublicPath + publicSlbHealthcheckPath);
        var destPublicImages1Path = resolve(destPublicImagesPath + publicImagesZhizuotuPath);
        if (dictionary === '') {
            mkdirSync(destPublicPath);
            mkdirSync(destPublicImagesPath);
        }
        else {
            var newDestPublicPath = path_1.default.join(newDestFolder, publicPath);
            var newDestPublicImagesPath = resolve(newDestPublicPath + publicImagesPath);
            mkdirSync(newDestPublicPath);
            mkdirSync(newDestPublicImagesPath);
            destPublicHealthCheckPath = resolve(newDestPublicPath + publicSlbHealthcheckPath);
            destPublicImages1Path = resolve(newDestPublicImagesPath + publicImagesZhizuotuPath);
        }
        copyFileSync(sourcePublicHealthCheckPath, destPublicHealthCheckPath, upgradeFlag);
        copyFileSync(sourcePublicImages1Path, destPublicImages1Path, upgradeFlag);
    };
    var initScriptsFiles = function () {
        var scriptsStartupPath = '/startup.sh';
        var scriptsShutdownPath = '/shutdown.sh';
        var sourceScriptsStartupPath = resolve(sourceScriptsPath + scriptsStartupPath);
        var sourceScriptsShutdownPath = resolve(sourceScriptsPath + scriptsShutdownPath);
        var destScriptsStartupPath = resolve(destScriptsPath + scriptsStartupPath);
        var destScriptsShutdownPath = resolve(destScriptsPath + scriptsShutdownPath);
        if (dictionary === '') {
            mkdirSync(destScriptsPath);
        }
        else {
            var newDestScriptsPath = path_1.default.join(newDestFolder, scriptsPath);
            mkdirSync(newDestScriptsPath);
            destScriptsStartupPath = resolve(newDestScriptsPath + scriptsStartupPath);
            destScriptsShutdownPath = resolve(newDestScriptsPath + scriptsShutdownPath);
        }
        copyFileSync(sourceScriptsStartupPath, destScriptsStartupPath);
        copyFileSync(sourceScriptsShutdownPath, destScriptsShutdownPath);
    };
    var initRootFiles = function () {
        var rootNextConfigPath = '/next.config.js';
        var rootMysqlConfigPath = '/mysql.config.js';
        var rootProjectConfigPath = '/project.config.js';
        var rootPackagePath = packagePath;
        var rootTsconfigPath = '/tsconfig.json';
        var rootBabelrcPath = '/.babelrc';
        var rootGitignorePathSource = '/gitignore';
        var rootGitignorePath = '/.gitignore';
        var rootNextEnvPathSource = '../next-env.d.ts';
        var rootNextEnvPath = '/next-env.d.ts';
        var rootReadmePath = '/README.md';
        var rootAppConfigPathSource = '../app.config.js';
        var rootAppConfigPath = '/app.config.js';
        var rootAppPath = '/app.js';
        var sourceNextConfigPath = resolve(sourceGenerationPath + rootNextConfigPath);
        var sourceMysqlConfigPath = resolve(sourceGenerationPath + rootMysqlConfigPath);
        var sourceProjectConfigPath = resolve(sourceGenerationPath + rootProjectConfigPath);
        var sourceTsConfigPath = resolve(sourceGenerationPath + rootTsconfigPath);
        var sourceBabelrcPath = path_1.default.join(sourceGenerationPath, rootBabelrcPath);
        var sourceGitignorePath = resolve(sourceGenerationPath + rootGitignorePathSource);
        var sourceNextEnvPath = path_1.default.join(sourceFolder, rootNextEnvPathSource);
        var sourceReadmePath = resolve(sourceGenerationPath + rootReadmePath);
        var sourceAppConfigPath = path_1.default.join(sourceFolder, rootAppConfigPathSource);
        var sourceAppath = resolve(sourceGenerationPath + rootAppPath);
        var sourcePackagePath = resolve(sourceGenerationPath + rootPackagePath);
        var destNextConfigPath = resolve(destFolder + rootNextConfigPath);
        var destMysqlConfigPath = resolve(destFolder + rootMysqlConfigPath);
        var destProjectConfigPath = resolve(destFolder + rootProjectConfigPath);
        var destTsConfigPath = resolve(destFolder + rootTsconfigPath);
        var destBabelrcPath = resolve(destFolder + rootBabelrcPath);
        var destGitignorePath = resolve(destFolder + rootGitignorePath);
        var destNextEnvPath = resolve(destFolder + rootNextEnvPath);
        var destReadmePath = resolve(destFolder + rootReadmePath);
        var destAppConfigPath = resolve(destFolder + rootAppConfigPath);
        var destAppath = resolve(destFolder + rootAppPath);
        if (dictionary !== '') {
            destNextConfigPath = resolve(newDestFolder + rootNextConfigPath);
            destMysqlConfigPath = resolve(newDestFolder + rootMysqlConfigPath);
            destProjectConfigPath = resolve(newDestFolder + rootProjectConfigPath);
            destTsConfigPath = resolve(newDestFolder + rootTsconfigPath);
            destBabelrcPath = resolve(newDestFolder + rootBabelrcPath);
            destGitignorePath = resolve(newDestFolder + rootGitignorePath);
            destNextEnvPath = resolve(newDestFolder + rootNextEnvPath);
            destReadmePath = resolve(newDestFolder + rootReadmePath);
            destAppConfigPath = resolve(newDestFolder + rootAppConfigPath);
            destAppath = resolve(newDestFolder + rootAppPath);
            destPackagePath = resolve(newDestFolder + rootPackagePath);
        }
        copyFileSync(sourceNextConfigPath, destNextConfigPath);
        copyFileSync(sourceMysqlConfigPath, destMysqlConfigPath);
        copyFileSync(sourceProjectConfigPath, destProjectConfigPath);
        copyFileSync(sourcePackagePath, destPackagePath);
        copyFileSync(sourceTsConfigPath, destTsConfigPath);
        copyFileSync(sourceBabelrcPath, destBabelrcPath);
        copyFileSync(sourceGitignorePath, destGitignorePath);
        copyFileSync(sourceNextEnvPath, destNextEnvPath);
        copyFileSync(sourceReadmePath, destReadmePath);
        copyFileSync(sourceAppConfigPath, destAppConfigPath);
        copyFileSync(sourceAppath, destAppath);
    };
    initClientFiles();
    initPagesFiles();
    initServerFiles();
    initPublicFiles();
    initScriptsFiles();
    initRootFiles();
    if (!isLocal && !upgradeFlag) {
        if (dictionary !== '') {
            shelljs_1.default.sed('-i', eval('/nsgm-cli-project/'), dictionary + '-project', destPackagePath);
            shelljs_1.default.sed('-i', eval('/NSGM-CLI/'), dictionary, destPublicHealthCheckPath);
            shelljs_1.default.exec('cd ' + dictionary + ' && npm install --save nsgm-cli');
            shelljs_1.default.exec('cd ' + dictionary + ' && npm install --save-dev @types/node');
            shelljs_1.default.exec('cd ' + dictionary + ' && npm install --save-dev @types/react');
            shelljs_1.default.exec('cd ' + dictionary + ' && npm install --save-dev @types/lodash');
        }
        else {
            shelljs_1.default.sed('-i', eval('/nsgm-cli-project/'), path_1.default.basename(destFolder) + '-project', destPackagePath);
            shelljs_1.default.sed('-i', eval('/NSGM-CLI/'), path_1.default.basename(destFolder), destPublicHealthCheckPath);
            shelljs_1.default.exec('npm install --save nsgm-cli');
            shelljs_1.default.exec('npm install --save-dev @types/node');
            shelljs_1.default.exec('npm install --save-dev @types/react');
            shelljs_1.default.exec('npm install --save-dev @types/lodash');
        }
    }
    console.log('initFiles finished');
};
exports.initFiles = initFiles;
var createFiles = function (controller, action) {
    console.log('createFiles', sourceFolder, destFolder, isLocal, controller, action);
    mkdirSync(destClientPath);
    mkdirSync(destServerPath);
    mkdirSync(destPagesPath);
    // pages
    var sourcePagesActionPath = resolve(sourcePagesPath + '/template/manage.tsx');
    var destPagesControllerPath = resolve(destPagesPath + '/' + controller);
    var destPagesActionPath = resolve(destPagesControllerPath + '/' + action + '.tsx');
    mkdirSync(destPagesControllerPath);
    copyFileSync(sourcePagesActionPath, destPagesActionPath);
    console.log('pages finished');
    // client redux
    var destClientReduxControllerPath = resolve(destClientReduxPath + '/' + controller);
    var destClientReduxControllerActionPath = resolve(destClientReduxControllerPath + '/' + action);
    mkdirSync(destClientReduxPath);
    mkdirSync(destClientReduxControllerPath);
    mkdirSync(destClientReduxControllerActionPath);
    var sourceClientReduxActionsPath = resolve(sourceClientPath + '/redux/template/manage/actions.ts');
    var sourceClientReduxReducersPath = resolve(sourceClientPath + '/redux/template/manage/reducers.ts');
    var sourceClientReduxTypesPath = resolve(sourceClientPath + '/redux/template/manage/types.ts');
    var destClientReduxActionsPath = resolve(destClientReduxControllerActionPath + '/actions.ts');
    var destClientReduxReducersPath = resolve(destClientReduxControllerActionPath + '/reducers.ts');
    var destClientReduxTypesPath = resolve(destClientReduxControllerActionPath + '/types.ts');
    copyFileSync(sourceClientReduxActionsPath, destClientReduxActionsPath);
    copyFileSync(sourceClientReduxReducersPath, destClientReduxReducersPath);
    copyFileSync(sourceClientReduxTypesPath, destClientReduxTypesPath);
    console.log('client redux finished');
    // client service
    var sourceClientActionPath = resolve(sourceClientPath + '/service/template/manage.ts');
    var destClientServiceControllerPath = resolve(destClientServicePath + '/' + controller);
    var destClientActionPath = resolve(destClientServiceControllerPath + '/' + action + '.ts');
    mkdirSync(destClientServicePath);
    mkdirSync(destClientServiceControllerPath);
    copyFileSync(sourceClientActionPath, destClientActionPath);
    console.log('client service finished');
    // client styled
    var sourceClientStyledActionPath = resolve(sourceClientPath + '/styled/template/manage.ts');
    var destClientStyledControllerPath = resolve(destClientStyledPath + '/' + controller);
    mkdirSync(destClientStyledPath);
    mkdirSync(destClientStyledControllerPath);
    var destClientStyledActionPath = resolve(destClientStyledControllerPath + '/' + action + '.ts');
    copyFileSync(sourceClientStyledActionPath, destClientStyledActionPath);
    console.log('client styled finished');
    // server modules
    var sourceServerModulesResolverPath = resolve(sourceServerPath + '/modules/template/resolver.js');
    var sourceServerModulesSchemaPath = resolve(sourceServerPath + '/modules/template/schema.js');
    var destServerModulesControllerPath = resolve(destServerModulesPath + '/' + controller);
    mkdirSync(destServerModulesPath);
    mkdirSync(destServerModulesControllerPath);
    var destServerModulesResolverPath = resolve(destServerModulesControllerPath + '/resolver.js');
    var destServerModulesSchemaPath = resolve(destServerModulesControllerPath + '/schema.js');
    copyFileSync(sourceServerModulesResolverPath, destServerModulesResolverPath);
    copyFileSync(sourceServerModulesSchemaPath, destServerModulesSchemaPath);
    console.log('server modules finished');
    // server apis
    var sourceServerApisControllerPath = resolve(sourceServerPath + '/apis/template.js');
    mkdirSync(destServerApisPath);
    var destServerApisControllerPath = resolve(destServerApisPath + '/' + controller + '.js');
    copyFileSync(sourceServerApisControllerPath, destServerApisControllerPath);
    console.log('server apis finished');
    // server sql
    var sourceServerSqlControllerPath = resolve(sourceServerPath + '/sql/template.sql');
    mkdirSync(destServerSqlPath);
    var destServerSqlControllerPath = resolve(destServerSqlPath + '/' + controller + '.sql');
    copyFileSync(sourceServerSqlControllerPath, destServerSqlControllerPath);
    console.log('server sql finished');
    // replace dest files
    handleReplace({
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
    handleReplace({
        regex: 'Template',
        replacement: firstUpperCase(controller),
        paths: [
            destPagesActionPath,
            destClientActionPath,
            destClientReduxActionsPath,
            destServerModulesSchemaPath,
            destServerApisControllerPath
        ]
    });
    handleReplace({
        regex: 'TEMPLATE',
        replacement: controller.toUpperCase(),
        paths: [destClientReduxActionsPath, destClientReduxReducersPath, destClientReduxTypesPath]
    });
    handleReplace({
        regex: 'manage',
        replacement: action,
        paths: [destPagesActionPath, destClientReduxActionsPath]
    });
    handleReplace({
        regex: 'Manage',
        replacement: firstUpperCase(action),
        paths: [destPagesActionPath, destClientReduxReducersPath]
    });
    console.log('replace dest files finished');
    // special replace dest files
    var optionsArr = [
        {
            from: /\n\s*\n/,
            to: '\nimport { ' +
                controller +
                firstUpperCase(action) +
                "Reducer } from './" +
                controller +
                '/' +
                action +
                "/reducers'\n\n",
            files: [destClientReduxReducersAllPath]
        },
        {
            from: /Reducer,\s*\n/,
            to: 'Reducer,\n  ' +
                controller +
                firstUpperCase(action) +
                ': ' +
                controller +
                firstUpperCase(action) +
                'Reducer,\n',
            files: [destClientReduxReducersAllPath]
        },
        {
            from: /'(.\/apis\/template.*?)'\)\s*\n/,
            to: "'./apis/template')\nconst " + controller + " = require('./apis/" + controller + "')\n",
            files: [destServerRestPath]
        },
        {
            from: /template\)\s*\n/,
            to: "template)\nrouter.use('/" + controller + "', " + controller + ')\n',
            files: [destServerRestPath]
        },
        {
            from: /null\s*\n/,
            to: 'null\n  },\n  {\n    // ' +
                controller +
                '_' +
                action +
                "_start\n    key: (++key).toString(),\n    text: '" +
                controller +
                "',\n    url: '/" +
                controller +
                '/' +
                action +
                "',\n    icon: <SolutionOutlined rev={undefined} />,\n    " +
                "subMenus: [\n      {\n        key: key + '_1',\n        text: '" +
                action +
                "',\n        url: '/" +
                controller +
                '/' +
                action +
                "'\n      }\n    ]\n    // " +
                controller +
                '_' +
                action +
                '_end\n',
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
    shelljs_1.default.sed('-i', eval('/.*' + controller + firstUpperCase(action) + 'Reducer.*/'), '', destClientReduxReducersAllPath);
    shelljs_1.default.sed('-i', eval('/.*' + controller + '.*/'), '', destServerRestPath);
    shelljs_1.default.sed('-i', eval('/template/'), controller, destServerSqlControllerPath);
    shelljs_1.default.sed('-i', eval('/crm_demo/'), mysqlDatabase, destServerSqlControllerPath);
    shelljs_1.default.exec('mysql -u' +
        mysqlUser +
        ' -p' +
        mysqlPassword +
        ' -h' +
        mysqlHost +
        ' -P' +
        mysqlPort +
        ' < ' +
        destServerSqlControllerPath);
    setTimeout(function () {
        replaceInFileAll(optionsArr, 0, function () {
            console.log('special replace dest files finished');
        });
    }, 1000);
};
exports.createFiles = createFiles;
var deleteFiles = function (controller, action, deleteDBFlag) {
    if (deleteDBFlag === void 0) { deleteDBFlag = false; }
    console.log('deleteFiles', sourceFolder, destFolder, isLocal, controller, action, deleteDBFlag);
    // pages
    var destPagesControllerPath = resolve(destPagesPath + '/' + controller);
    // client redux
    var destClientReduxControllerPath = resolve(destClientReduxPath + '/' + controller);
    // client service
    var destClientServiceControllerPath = resolve(destClientServicePath + '/' + controller);
    // client styled
    var destClientStyledControllerPath = resolve(destClientStyledPath + '/' + controller);
    // server modules
    var destServerModulesControllerPath = resolve(destServerModulesPath + '/' + controller);
    // server apis
    var destServerApisControllerPath = resolve(destServerApisPath + '/' + controller + '.js');
    // server sql
    var destServerSqlControllerPath = resolve(destServerSqlPath + '/' + controller + '.sql');
    if (action === 'all') {
        rmdirSync(destPagesControllerPath);
        rmdirSync(destClientReduxControllerPath);
        rmdirSync(destClientServiceControllerPath);
        rmdirSync(destClientStyledControllerPath);
        rmdirSync(destServerModulesControllerPath);
        rmFileSync(destServerApisControllerPath);
        shelljs_1.default.sed('-i', eval('/.*' + controller + '.*' + 'Reducer.*/'), '', destClientReduxReducersAllPath);
        shelljs_1.default.sed('-i', eval('/.*' + controller + '.*/'), '', destServerRestPath);
        shelljs_1.default.sed('-i', eval('/.*' + controller + '_.*_start.*/'), '    /*', destClientUtilsMenuPath);
        shelljs_1.default.sed('-i', eval('/.*' + controller + '_.*_end.*/'), '    */', destClientUtilsMenuPath);
        if (deleteDBFlag) {
            shelljs_1.default.sed('-i', eval('/' + mysqlDatabase + ';/'), mysqlDatabase + ';\nDROP TABLE `' + controller + '`;\n/*', destServerSqlControllerPath);
            shelljs_1.default.sed('-i', eval('/utf8mb4;/'), 'utf8mb4;\n*/', destServerSqlControllerPath);
            shelljs_1.default.exec('mysql -u' +
                mysqlUser +
                ' -p' +
                mysqlPassword +
                ' -h' +
                mysqlHost +
                ' -P' +
                mysqlPort +
                ' < ' +
                destServerSqlControllerPath);
        }
        rmFileSync(destServerSqlControllerPath);
        var optionsArr_1 = [
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
        setTimeout(function () {
            replaceInFileAll(optionsArr_1, 0, function () {
                console.log('special replace dest files finished');
            });
        }, 1000);
    }
    else {
        // pages
        var destPagesActionPath = resolve(destPagesControllerPath + '/' + action + '.tsx');
        // client redux
        var destClientReduxControllerActionPath = resolve(destClientReduxControllerPath + '/' + action);
        // client service
        var destClientActionPath = resolve(destClientServiceControllerPath + '/' + action + '.ts');
        // client styled
        var destClientStyledActionPath = resolve(destClientStyledControllerPath + '/' + action + '.ts');
        rmFileSync(destPagesActionPath);
        rmdirSync(destClientReduxControllerActionPath);
        rmFileSync(destClientActionPath);
        rmFileSync(destClientStyledActionPath);
        shelljs_1.default.sed('-i', eval('/.*' + controller + firstUpperCase(action) + 'Reducer.*/'), '', destClientReduxReducersAllPath);
        var optionsArr_2 = [
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
        setTimeout(function () {
            replaceInFileAll(optionsArr_2, 0, function () {
                console.log('special replace dest files finished');
            });
        }, 1000);
    }
    console.log('delFiles finished');
};
exports.deleteFiles = deleteFiles;
