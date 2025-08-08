import { FieldDefinition } from '../cli/utils/prompt';
/**
 * 基础生成器抽象类
 * 定义所有代码生成器的通用接口
 */
export declare abstract class BaseGenerator {
    protected controller: string;
    protected action: string;
    protected fields: FieldDefinition[];
    constructor(controller: string, action: string, fields: FieldDefinition[]);
    /**
     * 生成代码的主方法
     */
    abstract generate(): string;
    /**
     * 获取首字母大写的控制器名
     */
    protected getCapitalizedController(): string;
    /**
     * 获取首字母大写的动作名
     */
    protected getCapitalizedAction(): string;
    /**
     * 获取显示字段
     */
    protected getDisplayFields(): FieldDefinition[];
    /**
     * 获取表单字段
     */
    protected getFormFields(): FieldDefinition[];
    /**
     * 获取可搜索字段
     */
    protected getSearchableFields(): FieldDefinition[];
    /**
     * 获取非系统字段
     */
    protected getNonSystemFields(): FieldDefinition[];
    /**
     * 将字段类型转换为GraphQL类型
     */
    protected getGraphQLType(fieldType: string): string;
    /**
     * 将字段类型转换为SQL类型
     */
    protected getSQLType(field: FieldDefinition): string;
}
