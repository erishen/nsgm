import { BaseGenerator } from "./base-generator";
/**
 * 国际化文件生成器
 * 生成控制器对应的多语言文件
 */
export declare class I18nGenerator extends BaseGenerator {
    /**
     * 生成中文翻译文件
     */
    generateChineseTranslation(): string;
    /**
     * 生成英文翻译文件
     */
    generateEnglishTranslation(): string;
    /**
     * 生成日文翻译文件
     */
    generateJapaneseTranslation(): string;
    /**
     * 生成字段翻译
     */
    private generateFieldTranslations;
    /**
     * 生成占位符翻译
     */
    private generatePlaceholderTranslations;
    /**
     * 获取字段翻译
     */
    private getFieldTranslation;
    /**
     * 获取操作列翻译
     */
    private getActionsTranslation;
    /**
     * 格式化字段名
     */
    private formatFieldName;
    /**
     * 简单的中文到英文翻译映射
     */
    private translateChineseToEnglish;
    /**
     * 简单的中文到日文翻译映射
     */
    private translateChineseToJapanese;
    /**
     * 主生成方法（为了继承BaseGenerator需要实现）
     */
    generate(): string;
}
