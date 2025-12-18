import { Command, CommandOptions } from "../types";
import { ArgumentParser } from "../parser";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export const exportCommand: Command = {
  name: "export",
  aliases: [],
  description: "导出静态网站",
  usage: "nsgm export [dictionary]",
  examples: ["nsgm export", "nsgm export webapp", "nsgm export --dictionary=myapp"],
  options: [
    {
      name: "dictionary",
      description: "输出目录名称",
      default: "webapp",
      type: "string",
    },
  ],
  execute: async (options: CommandOptions) => {
    try {
      const finalOptions = ArgumentParser.applyDefaults(options, {
        dictionary: "webapp",
      });

      console.log(`📦 开始导出到目录: ${finalOptions.dictionary}`);

      const shellCommand = `next export -o ${finalOptions.dictionary}`;
      const { stdout, stderr } = await execAsync(shellCommand);

      if (stderr) {
        console.error("导出警告:", stderr);
      }

      console.log("✅ 导出完成!");
      console.log(stdout);
      process.exit(0);
    } catch (error) {
      console.error("❌ 导出失败:", error);
      process.exit(1);
    }
  },
};
