import { BaseGenerator } from './base-generator';
/**
 * 页面生成器
 * 基于现有的 pages/template/manage.tsx 模板生成页面组件
 */
export declare class PageGenerator extends BaseGenerator {
    generate(): string;
    /**
     * 生成翻译键值标题映射
     */
    private generateTranslationKeyTitles;
    /**
     * 生成模态框状态变量
     */
    private generateModalStates;
    /**
     * 生成记录解构
     */
    private generateRecordDestructuring;
    /**
     * 生成模态框重置状态
     */
    private generateModalResetStates;
    /**
     * 生成模态框设置状态
     */
    private generateModalSetStates;
    /**
     * 生成模态框对象
     */
    private generateModalObj;
    /**
     * 生成模态框字段
     */
    private generateModalFields;
    /**
     * 生成Excel列配置
     */
    private generateExcelColumns;
    private generateTableColumns;
    /**
     * 生成客户端验证逻辑
     */
    private generateClientValidation;
}
