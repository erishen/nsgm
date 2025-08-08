"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CliApp = void 0;
exports.runCli = runCli;
const parser_1 = require("./parser");
const registry_1 = require("./registry");
const utils_1 = require("./utils");
/**
 * CLI 应用程序主类
 */
class CliApp {
    constructor() {
        this.registry = new registry_1.CommandRegistry();
    }
    /**
     * 运行 CLI 应用
     */
    async run(args = process.argv.slice(2)) {
        try {
            const { command, options } = parser_1.ArgumentParser.parse(args);
            // 查找命令
            const cmd = this.registry.get(command);
            if (!cmd) {
                utils_1.Console.error(`未知命令: ${command}`);
                utils_1.Console.info('使用 "nsgm help" 查看可用命令');
                utils_1.Console.newLine();
                // 提供建议的命令
                const availableCommands = this.registry.getAllCommands().map((c) => c.name);
                const suggestions = this.findSimilarCommands(command, availableCommands);
                if (suggestions.length > 0) {
                    utils_1.Console.subtitle('你是否想要运行:');
                    suggestions.forEach((suggestion) => {
                        console.log(`   nsgm ${suggestion}`);
                    });
                }
                process.exit(1);
            }
            // 应用命令选项的默认值
            const finalOptions = this.applyCommandDefaults(cmd, options);
            // 执行命令
            await cmd.execute(finalOptions);
        }
        catch (error) {
            utils_1.Console.error(`执行命令时发生错误: ${error}`);
            utils_1.Console.debug('使用 "nsgm help" 查看帮助信息');
            process.exit(1);
        }
    }
    /**
     * 查找相似的命令（简单的字符串匹配）
     */
    findSimilarCommands(input, commands) {
        const suggestions = [];
        // 查找包含输入字符的命令
        for (const cmd of commands) {
            if (cmd.includes(input) || input.includes(cmd)) {
                suggestions.push(cmd);
            }
        }
        // 如果没有找到，查找第一个字符相同的
        if (suggestions.length === 0) {
            for (const cmd of commands) {
                if (cmd[0] === input[0]) {
                    suggestions.push(cmd);
                }
            }
        }
        return suggestions.slice(0, 3); // 最多返回3个建议
    }
    /**
     * 应用命令默认值
     */
    applyCommandDefaults(cmd, options) {
        const result = { ...options };
        // 应用命令选项中定义的默认值
        if (cmd.options) {
            for (const option of cmd.options) {
                if (option.default !== undefined && (result[option.name] === undefined || result[option.name] === '')) {
                    result[option.name] = option.default;
                }
            }
        }
        return result;
    }
    /**
     * 获取命令注册表（用于测试）
     */
    getRegistry() {
        return this.registry;
    }
}
exports.CliApp = CliApp;
/**
 * 创建并运行 CLI 应用的便捷函数
 */
async function runCli(args) {
    const app = new CliApp();
    await app.run(args);
}
