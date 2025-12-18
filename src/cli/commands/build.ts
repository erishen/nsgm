import { Command, CommandOptions } from "../types";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export const buildCommand: Command = {
  name: "build",
  aliases: [],
  description: "构建生产版本",
  usage: "nsgm build",
  examples: ["nsgm build"],
  execute: async (_options: CommandOptions) => {
    try {
      console.log("🔨 开始构建生产版本...");
      const { stdout, stderr } = await execAsync("next build");

      if (stderr) {
        console.error("构建警告:", stderr);
      }

      console.log("✅ 构建完成!");
      console.log(stdout);
      process.exit(0);
    } catch (error) {
      console.error("❌ 构建失败:", error);
      process.exit(1);
    }
  },
};
