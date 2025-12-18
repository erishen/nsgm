import { CommandOptions, ParsedArgs } from "./types";
/**
 * 改进的命令行参数解析器
 */
export declare class ArgumentParser {
    /**
     * 解析命令行参数
     */
    static parse(args?: string[]): ParsedArgs;
    /**
     * 解析位置参数（保持向后兼容）
     */
    private static parsePositionalArgs;
    /**
     * 验证必需参数
     */
    static validateRequired(options: CommandOptions, required: string[]): string[];
    /**
     * 应用默认值
     */
    static applyDefaults(options: CommandOptions, defaults: Record<string, any>): CommandOptions;
}
