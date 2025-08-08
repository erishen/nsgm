import { CommandRegistry } from './registry';
/**
 * CLI 应用程序主类
 */
export declare class CliApp {
    private registry;
    constructor();
    /**
     * 运行 CLI 应用
     */
    run(args?: string[]): Promise<void>;
    /**
     * 查找相似的命令（简单的字符串匹配）
     */
    private findSimilarCommands;
    /**
     * 应用命令默认值
     */
    private applyCommandDefaults;
    /**
     * 获取命令注册表（用于测试）
     */
    getRegistry(): CommandRegistry;
}
/**
 * 创建并运行 CLI 应用的便捷函数
 */
export declare function runCli(args?: string[]): Promise<void>;
