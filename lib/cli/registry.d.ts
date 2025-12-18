import { Command } from "./types";
/**
 * CLI 命令注册表
 */
export declare class CommandRegistry {
    private commands;
    private aliases;
    constructor();
    /**
     * 注册默认命令
     */
    private registerDefaultCommands;
    /**
     * 注册命令
     */
    register(command: Command): void;
    /**
     * 获取命令
     */
    get(name: string): Command | undefined;
    /**
     * 获取所有命令
     */
    getAll(): Command[];
    /**
     * 获取所有命令（别名方法）
     */
    getAllCommands(): Command[];
    /**
     * 检查命令是否存在
     */
    has(name: string): boolean;
}
