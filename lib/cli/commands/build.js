"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildCommand = void 0;
const child_process_1 = require("child_process");
const util_1 = require("util");
const execAsync = (0, util_1.promisify)(child_process_1.exec);
exports.buildCommand = {
    name: "build",
    aliases: [],
    description: "构建生产版本",
    usage: "nsgm build",
    examples: ["nsgm build"],
    execute: async (_options) => {
        try {
            console.log("🔨 开始构建生产版本...");
            const { stdout, stderr } = await execAsync("next build");
            if (stderr) {
                console.error("构建警告:", stderr);
            }
            console.log("✅ 构建完成!");
            console.log(stdout);
            process.exit(0);
        }
        catch (error) {
            console.error("❌ 构建失败:", error);
            process.exit(1);
        }
    },
};
