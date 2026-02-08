import { BaseGenerator } from "./base-generator";
/**
 * DataLoader生成器
 * 自动生成对应的 DataLoader JavaScript 文件
 */
export declare class DataLoaderGenerator extends BaseGenerator {
    /**
     * 可能的 JSON 字段名（需要自动解析）
     */
    private jsonFieldNames;
    /**
     * 获取可能是 JSON 的字段
     */
    private getJsonFields;
    generate(): string;
    /**
     * 生成外键 DataLoader
     */
    private generateForeignKeyLoaders;
}
