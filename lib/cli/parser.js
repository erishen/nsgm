"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArgumentParser = void 0;
/**
 * 改进的命令行参数解析器
 */
class ArgumentParser {
    /**
     * 解析命令行参数
     */
    static parse(args = process.argv.slice(2)) {
        if (args.length === 0) {
            return { command: "help", options: {} };
        }
        const command = args[0];
        const options = {};
        // 解析参数
        for (let i = 1; i < args.length; i++) {
            const arg = args[i];
            if (arg.includes("=")) {
                // 处理 key=value 格式
                const [key, value] = arg.split("=", 2);
                options[key.toLowerCase()] = value;
            }
            else if (arg.startsWith("--")) {
                // 处理 --key value 格式
                const key = arg.slice(2).toLowerCase();
                const nextArg = args[i + 1];
                if (nextArg && !nextArg.startsWith("-")) {
                    options[key] = nextArg;
                    i++; // 跳过下一个参数
                }
                else {
                    options[key] = true;
                }
            }
            else if (arg.startsWith("-")) {
                // 处理 -k value 格式
                const key = arg.slice(1).toLowerCase();
                const nextArg = args[i + 1];
                if (nextArg && !nextArg.startsWith("-")) {
                    options[key] = nextArg;
                    i++; // 跳过下一个参数
                }
                else {
                    options[key] = true;
                }
            }
            else {
                // 处理位置参数
                this.parsePositionalArgs(command, args.slice(1), options);
                break;
            }
        }
        return { command, options };
    }
    /**
     * 解析位置参数（保持向后兼容）
     */
    static parsePositionalArgs(command, args, options) {
        const createCommands = ["create", "-c", "delete", "-d", "deletedb", "-db"];
        const initCommands = ["init", "-i", "export"];
        args.forEach((arg, index) => {
            if (arg.includes("=") || arg.startsWith("-")) {
                return; // 跳过已处理的参数
            }
            if (createCommands.includes(command)) {
                switch (index) {
                    case 0:
                        if (!options.controller)
                            options.controller = arg;
                        break;
                    case 1:
                        if (!options.action)
                            options.action = arg;
                        break;
                    case 2:
                        if (!options.dictionary)
                            options.dictionary = arg;
                        break;
                }
            }
            else if (initCommands.includes(command)) {
                if (index === 0 && !options.dictionary) {
                    options.dictionary = arg;
                }
            }
        });
    }
    /**
     * 验证必需参数
     */
    static validateRequired(options, required) {
        const missing = [];
        for (const key of required) {
            if (!options[key] || options[key] === "") {
                missing.push(key);
            }
        }
        return missing;
    }
    /**
     * 应用默认值
     */
    static applyDefaults(options, defaults) {
        const result = { ...options };
        for (const [key, value] of Object.entries(defaults)) {
            if (result[key] === undefined || result[key] === "") {
                result[key] = value;
            }
        }
        return result;
    }
}
exports.ArgumentParser = ArgumentParser;
