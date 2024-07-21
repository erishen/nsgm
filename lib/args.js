"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProcessArgvs = void 0;
var lodash_1 = __importDefault(require("lodash"));
var getProcessArgvs = function (removeItems) {
    if (removeItems === void 0) { removeItems = 2; }
    var args = process.argv.slice(removeItems);
    var result = {
        command: '', // dev, start, build, export, create, delete, init, help
        dictionary: '', // export/init dictionary=${dictionary}
        controller: '',
        action: '' // create/delete controller=${controller} action=${action}
    };
    lodash_1.default.each(args, function (item, index) {
        if (item.indexOf('=') !== -1) {
            var itemArr = item.split('=');
            var key = itemArr[0].toLowerCase();
            result[key] = itemArr[1];
        }
        else {
            var command = result.command;
            switch (index) {
                case 0:
                    result.command = item;
                    break;
                case 1:
                    if (command === 'create' ||
                        command === '-c' ||
                        command.indexOf('delete') !== -1 ||
                        command.indexOf('-d') !== -1) {
                        result.controller = item;
                    }
                    if (command === 'export' || command === 'init' || command === '-i') {
                        result.dictionary = item;
                    }
                    break;
                case 2:
                    if (command === 'create' ||
                        command === '-c' ||
                        command.indexOf('delete') !== -1 ||
                        command.indexOf('-d') !== -1) {
                        result.action = item;
                    }
                    break;
            }
        }
    });
    return result;
};
exports.getProcessArgvs = getProcessArgvs;
