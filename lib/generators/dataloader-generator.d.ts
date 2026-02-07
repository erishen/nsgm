import { BaseGenerator } from "./base-generator";
/**
 * DataLoader生成器
 * 自动生成对应的 DataLoader JavaScript 文件
 */
export declare class DataLoaderGenerator extends BaseGenerator {
    generate(): string;
    /**
     * 生成外键 DataLoader
     */
    private generateForeignKeyLoaders;
}
