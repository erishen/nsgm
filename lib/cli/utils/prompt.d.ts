export interface FieldDefinition {
    name: string;
    type: 'varchar' | 'text' | 'integer' | 'decimal' | 'boolean' | 'date' | 'datetime' | 'timestamp';
    length?: string | number;
    required?: boolean;
    comment?: string;
    isPrimaryKey?: boolean;
    isAutoIncrement?: boolean;
    isSystemField?: boolean;
    showInList?: boolean;
    showInForm?: boolean;
    searchable?: boolean;
}
/**
 * 交互式提示工具类
 */
export declare class Prompt {
    /**
     * 确认提示
     */
    static confirm(message: string, defaultValue?: boolean): Promise<boolean>;
    /**
     * 输入提示
     */
    static input(message: string, defaultValue?: string, validate?: (input: string) => boolean | string): Promise<string>;
    /**
     * 密码输入
     */
    static password(message: string, validate?: (input: string) => boolean | string): Promise<string>;
    /**
     * 单选提示
     */
    static select(message: string, choices: string[] | Array<{
        name: string;
        value: any;
    }>): Promise<any>;
    /**
     * 多选提示
     */
    static multiSelect(message: string, choices: string[] | Array<{
        name: string;
        value: any;
        checked?: boolean;
    }>): Promise<any[]>;
    /**
     * 自定义提示
     */
    static custom(questions: any): Promise<any>;
    /**
     * 项目初始化向导
     */
    static initWizard(): Promise<{
        projectName: string;
        description: string;
        author: string;
        database: boolean;
        features: string[];
    }>;
    /**
     * 控制器创建向导
     */
    static createControllerWizard(): Promise<{
        controller: string;
        action: string;
        description: string;
        dictionary: string;
        includeDatabase: boolean;
        fields: FieldDefinition[];
    }>;
    /**
     * 收集字段定义
     */
    static collectFieldDefinitions(): Promise<FieldDefinition[]>;
    /**
     * 控制器删除向导
     */
    static deleteControllerWizard(): Promise<{
        controller: string;
        action: string;
        dictionary: string;
        deleteDatabase: boolean;
    }>;
}
