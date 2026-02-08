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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProcessArgvs = void 0;
const _ = __importStar(require("lodash"));
const getProcessArgvs = (removeItems = 2) => {
    const args = process.argv.slice(removeItems);
    const result = {
        command: "", // dev, start, build, export, create, delete, init, help
        dictionary: "", // export/init dictionary=${dictionary}
        controller: "",
        action: "", // create/delete controller=${controller} action=${action}
    };
    _.each(args, (item, index) => {
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
