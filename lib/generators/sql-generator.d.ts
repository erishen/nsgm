import { BaseGenerator } from "./base-generator";
/**
 * SQL生成器
 * 专门负责生成数据库表结构
 */
export declare class SQLGenerator extends BaseGenerator {
    /**
     * 从目标项目的 mysql.config.js 读取数据库名称
     */
    private getDatabaseName;
    generate(): string;
}
