/**
 * 控制台输出工具类
 */
export declare class Console {
    /**
     * 成功消息
     */
    static success(message: string): void;
    /**
     * 错误消息
     */
    static error(message: string): void;
    /**
     * 警告消息
     */
    static warning(message: string): void;
    /**
     * 信息消息
     */
    static info(message: string): void;
    /**
     * 调试消息
     */
    static debug(message: string): void;
    /**
     * 标题
     */
    static title(message: string): void;
    /**
     * 副标题
     */
    static subtitle(message: string): void;
    /**
     * 突出显示
     */
    static highlight(message: string): void;
    /**
     * 分隔线
     */
    static separator(): void;
    /**
     * 空行
     */
    static newLine(count?: number): void;
    /**
     * 简单的加载动画
     */
    static spinner(text: string, color?: "red" | "green" | "yellow" | "blue" | "magenta" | "cyan" | "white"): {
        start(): void;
        stop(): void;
        succeed(message?: string): void;
        fail(message?: string): void;
    };
    /**
     * 带边框的消息
     */
    static box(message: string, type?: "success" | "error" | "warning" | "info"): void;
    /**
     * 进度条（简单版本）
     */
    static progress(current: number, total: number, description?: string): void;
}
