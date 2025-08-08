"use strict";
/**
 * CLI 模块入口
 */
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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./types"), exports);
__exportStar(require("./parser"), exports);
__exportStar(require("./registry"), exports);
__exportStar(require("./app"), exports);
// 命令导出
__exportStar(require("./commands/build"), exports);
__exportStar(require("./commands/create"), exports);
__exportStar(require("./commands/delete"), exports);
__exportStar(require("./commands/export"), exports);
__exportStar(require("./commands/help"), exports);
__exportStar(require("./commands/init"), exports);
__exportStar(require("./commands/server"), exports);
__exportStar(require("./commands/upgrade"), exports);
__exportStar(require("./commands/version"), exports);
