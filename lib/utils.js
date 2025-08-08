"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.replaceInFileAll = exports.handleReplace = exports.copyFileSync = exports.rmdirSync = exports.rmFileSync = exports.mkdirSync = exports.firstUpperCase = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = require("path");
const replace_1 = __importDefault(require("replace"));
const replace_in_file_1 = require("replace-in-file");
const mkdirFlag = true;
const copyFileFlag = true;
const replaceFlag = true;
const replaceInFileFlag = true;
const rmdirFlag = true;
const rmfileFlag = true;
const firstUpperCase = (word) => {
    return word.substring(0, 1).toUpperCase() + word.substring(1);
};
exports.firstUpperCase = firstUpperCase;
const mkdirSync = (dirPath) => {
    if (mkdirFlag) {
        if (!fs_1.default.existsSync(dirPath)) {
            fs_1.default.mkdirSync(dirPath);
        }
    }
};
exports.mkdirSync = mkdirSync;
const rmFileSync = (filePath) => {
    if (rmfileFlag) {
        if (fs_1.default.existsSync(filePath)) {
            fs_1.default.unlinkSync(filePath);
        }
    }
};
exports.rmFileSync = rmFileSync;
const rmdirSync = (dirPath) => {
    if (rmdirFlag) {
        if (fs_1.default.existsSync(dirPath)) {
            const list = fs_1.default.readdirSync(dirPath);
            list.forEach((item) => {
                const resolverPath = (0, path_1.resolve)(`${dirPath}/${item}`);
                const stat = fs_1.default.statSync(resolverPath);
                const isDir = stat.isDirectory();
                const isFile = stat.isFile();
                if (isDir) {
                    (0, exports.rmdirSync)(resolverPath);
                }
                else if (isFile) {
                    (0, exports.rmFileSync)(resolverPath);
                }
            });
            fs_1.default.rmdirSync(dirPath);
        }
    }
};
exports.rmdirSync = rmdirSync;
const copyFileSync = (source, dest, upgradeFlag = false) => {
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
exports.copyFileSync = copyFileSync;
const handleReplace = ({ regex, replacement, paths }) => {
    if (replaceFlag) {
        (0, replace_1.default)({
            regex,
            replacement,
            paths,
            recursive: true,
            silent: true,
        });
    }
};
exports.handleReplace = handleReplace;
const replaceInFileAll = async (array, index = 0, callback) => {
    if (replaceInFileFlag) {
        console.log('replaceInFileAll', index);
        const arrayLen = array.length;
        if (index < arrayLen) {
            const item = array[index];
            (0, replace_in_file_1.replaceInFile)(item)
                .then((changedFiles) => {
                console.log('Modified files:', changedFiles);
                (0, exports.replaceInFileAll)(array, ++index, callback);
            })
                .catch((error) => {
                if (error) {
                    console.error('Error occurred:', error);
                }
            });
        }
        else {
            return callback?.();
        }
    }
    else {
        return callback?.();
    }
};
exports.replaceInFileAll = replaceInFileAll;
