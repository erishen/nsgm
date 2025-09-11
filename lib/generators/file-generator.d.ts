/**
 * 文件生成器
 * 负责将生成的内容写入到文件系统
 */
export declare class FileGenerator {
    private projectPath;
    constructor(projectPath?: string);
    /**
     * 生成多语言文件
     */
    generateI18nFiles(controller: string, action: string, fields: any[]): void;
    /**
     * 生成页面组件文件
     */
    generatePageFile(controller: string, action: string, _fields: any[], content: string): void;
    /**
     * 生成样式文件
     */
    generateStyleFile(controller: string, action: string): void;
    /**
     * 生成Redux相关文件
     */
    generateReduxFiles(controller: string, action: string, _fields: any[]): void;
    /**
     * 生成服务文件
     */
    generateServiceFile(controller: string, action: string): void;
    /**
     * 确保目录存在
     */
    private ensureDirectoryExists;
    /**
     * 生成样式组件内容
     */
    private generateStyledComponentsContent;
    /**
     * 生成Actions内容
     */
    private generateActionsContent;
    /**
     * 生成Reducer内容
     */
    private generateReducerContent;
    /**
     * 生成Service内容
     */
    private generateServiceContent;
}
