"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProcessArgvs = void 0;
const lodash_1 = __importDefault(require("lodash"));
const getProcessArgvs = (removeItems = 2) => {
    const args = process.argv.slice(removeItems);
    const result = {
        command: "", // dev, start, build, export, create, delete, init, help
        dictionary: "", // export/init dictionary=${dictionary}
        controller: "",
        action: "", // create/delete controller=${controller} action=${action}
    };
    lodash_1.default.each(args, (item, index) => {
        if (item.indexOf("=") !== -1) {
            const itemArr = item.split("=");
            const key = itemArr[0].toLowerCase();
            result[key] = itemArr[1];
        }
        else {
            const { command } = result;
            switch (index) {
                case 0:
                    result.command = item;
                    break;
                case 1:
                    if (command === "create" ||
                        command === "-c" ||
                        command.indexOf("delete") !== -1 ||
                        command.indexOf("-d") !== -1) {
                        result.controller = item;
                    }
                    if (command === "export" || command === "init" || command === "-i") {
                        result.dictionary = item;
                    }
                    break;
                case 2:
                    if (command === "create" ||
                        command === "-c" ||
                        command.indexOf("delete") !== -1 ||
                        command.indexOf("-d") !== -1) {
                        result.action = item;
                    }
                    break;
                case 3:
                    if (command === "create" ||
                        command === "-c" ||
                        command.indexOf("delete") !== -1 ||
                        command.indexOf("-d") !== -1) {
                        result.dictionary = item;
                    }
                    break;
            }
        }
    });
    return result;
};
exports.getProcessArgvs = getProcessArgvs;
