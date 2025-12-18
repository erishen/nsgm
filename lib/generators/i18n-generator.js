"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.I18nGenerator = void 0;
const base_generator_1 = require("./base-generator");
/**
 * 国际化文件生成器
 * 生成控制器对应的多语言文件
 */
class I18nGenerator extends base_generator_1.BaseGenerator {
    /**
     * 生成中文翻译文件
     */
    generateChineseTranslation() {
        const capitalizedController = this.getCapitalizedController();
        const formFields = this.getFormFields();
        const displayFields = this.getDisplayFields();
        // 生成字段翻译
        const fieldTranslations = this.generateFieldTranslations(displayFields, formFields, "zh-CN");
        // 生成占位符翻译
        const placeholderTranslations = this.generatePlaceholderTranslations(formFields, "zh-CN");
        return JSON.stringify({
            [this.controller]: {
                title: `${capitalizedController} 管理`,
                fields: fieldTranslations,
                buttons: {
                    add: "新增",
                    edit: "修改",
                    delete: "删除",
                    search: "搜索",
                    export: "导出",
                    import: "导入",
                    batchDelete: "批量删除",
                    confirm: "确认",
                    cancel: "取消",
                },
                placeholders: placeholderTranslations,
                messages: {
                    confirmDelete: "确认删除吗",
                    confirmBatchDelete: "确认批量删除吗",
                    uploadSuccess: "文件上传成功",
                    uploadFailed: "文件上传失败",
                    onlyExcel: "只能上传 Excel 文件!",
                    fileSizeLimit: "文件大小不能超过 2MB!",
                    noData: "没有数据无需导出",
                    noDataBatchDelete: "没有数据不能批量删除",
                },
                modal: {
                    addTitle: `新增 ${capitalizedController}`,
                    editTitle: `修改 ${capitalizedController}`,
                },
                pagination: {
                    total: "共 {{total}} 条记录",
                },
            },
        }, null, 2);
    }
    /**
     * 生成英文翻译文件
     */
    generateEnglishTranslation() {
        const capitalizedController = this.getCapitalizedController();
        const formFields = this.getFormFields();
        const displayFields = this.getDisplayFields();
        // 生成字段翻译
        const fieldTranslations = this.generateFieldTranslations(displayFields, formFields, "en-US");
        // 生成占位符翻译
        const placeholderTranslations = this.generatePlaceholderTranslations(formFields, "en-US");
        return JSON.stringify({
            [this.controller]: {
                title: `${capitalizedController} Management`,
                fields: fieldTranslations,
                buttons: {
                    add: "Add",
                    edit: "Edit",
                    delete: "Delete",
                    search: "Search",
                    export: "Export",
                    import: "Import",
                    batchDelete: "Batch Delete",
                    confirm: "Confirm",
                    cancel: "Cancel",
                },
                placeholders: placeholderTranslations,
                messages: {
                    confirmDelete: "Are you sure to delete?",
                    confirmBatchDelete: "Are you sure to batch delete?",
                    uploadSuccess: "File uploaded successfully",
                    uploadFailed: "File upload failed",
                    onlyExcel: "Only Excel files are allowed!",
                    fileSizeLimit: "File size cannot exceed 2MB!",
                    noData: "No data to export",
                    noDataBatchDelete: "No data to batch delete",
                },
                modal: {
                    addTitle: `Add ${capitalizedController}`,
                    editTitle: `Edit ${capitalizedController}`,
                },
                pagination: {
                    total: "Total {{total}} records",
                },
            },
        }, null, 2);
    }
    /**
     * 生成日文翻译文件
     */
    generateJapaneseTranslation() {
        const capitalizedController = this.getCapitalizedController();
        const formFields = this.getFormFields();
        const displayFields = this.getDisplayFields();
        // 生成字段翻译
        const fieldTranslations = this.generateFieldTranslations(displayFields, formFields, "ja-JP");
        // 生成占位符翻译
        const placeholderTranslations = this.generatePlaceholderTranslations(formFields, "ja-JP");
        return JSON.stringify({
            [this.controller]: {
                title: `${capitalizedController}管理`,
                fields: fieldTranslations,
                buttons: {
                    add: "追加",
                    edit: "編集",
                    delete: "削除",
                    search: "検索",
                    export: "エクスポート",
                    import: "インポート",
                    batchDelete: "一括削除",
                    confirm: "確認",
                    cancel: "キャンセル",
                },
                placeholders: placeholderTranslations,
                messages: {
                    confirmDelete: "削除してもよろしいですか？",
                    confirmBatchDelete: "一括削除してもよろしいですか？",
                    uploadSuccess: "ファイルのアップロードが成功しました",
                    uploadFailed: "ファイルのアップロードが失敗しました",
                    onlyExcel: "Excelファイルのみアップロード可能です！",
                    fileSizeLimit: "ファイルサイズは2MBを超えることはできません！",
                    noData: "エクスポートするデータがありません",
                    noDataBatchDelete: "一括削除するデータがありません",
                },
                modal: {
                    addTitle: `${capitalizedController}を追加`,
                    editTitle: `${capitalizedController}を編集`,
                },
                pagination: {
                    total: "合計 {{total}} 件",
                },
            },
        }, null, 2);
    }
    /**
     * 生成字段翻译
     */
    generateFieldTranslations(displayFields, formFields, locale) {
        const translations = {};
        // 合并显示字段和表单字段，去重
        const allFields = [...displayFields, ...formFields];
        const uniqueFields = allFields.filter((field, index, self) => index === self.findIndex((f) => f.name === field.name));
        // 添加操作列
        translations.actions = this.getActionsTranslation(locale);
        // 为每个字段生成翻译
        uniqueFields.forEach((field) => {
            translations[field.name] = this.getFieldTranslation(field, locale);
        });
        return translations;
    }
    /**
     * 生成占位符翻译
     */
    generatePlaceholderTranslations(formFields, locale) {
        const translations = {};
        formFields.forEach((field) => {
            const fieldName = field.name;
            const capitalizedName = fieldName.charAt(0).toUpperCase() + fieldName.slice(1);
            const fieldTranslation = this.getFieldTranslation(field, locale);
            switch (locale) {
                case "zh-CN":
                    translations[`enter${capitalizedName}`] = `请输入${fieldTranslation}搜索`;
                    translations[`input${capitalizedName}`] = `请输入${fieldTranslation}`;
                    break;
                case "en-US":
                    translations[`enter${capitalizedName}`] = `Enter ${fieldTranslation.toLowerCase()} to search`;
                    translations[`input${capitalizedName}`] = `Enter ${fieldTranslation.toLowerCase()}`;
                    break;
                case "ja-JP":
                    translations[`enter${capitalizedName}`] = `${fieldTranslation}を入力して検索`;
                    translations[`input${capitalizedName}`] = `${fieldTranslation}を入力`;
                    break;
            }
        });
        return translations;
    }
    /**
     * 获取字段翻译
     */
    getFieldTranslation(field, locale) {
        // 如果字段有注释且是中文环境，直接使用注释
        if (field.comment && locale === "zh-CN") {
            return field.comment;
        }
        // 根据字段名生成对应语言的翻译
        switch (field.name.toLowerCase()) {
            case "id":
                return "ID";
            case "name":
                return locale === "zh-CN" ? "名称" : locale === "en-US" ? "Name" : "名前";
            case "email":
                return locale === "zh-CN" ? "邮箱" : locale === "en-US" ? "Email" : "メール";
            case "phone":
                return locale === "zh-CN" ? "电话" : locale === "en-US" ? "Phone" : "電話";
            case "address":
                return locale === "zh-CN" ? "地址" : locale === "en-US" ? "Address" : "住所";
            case "description":
                return locale === "zh-CN" ? "描述" : locale === "en-US" ? "Description" : "説明";
            case "status":
                return locale === "zh-CN" ? "状态" : locale === "en-US" ? "Status" : "ステータス";
            case "created_at":
            case "create_date":
                return locale === "zh-CN" ? "创建时间" : locale === "en-US" ? "Created At" : "作成日時";
            case "updated_at":
            case "update_date":
                return locale === "zh-CN" ? "更新时间" : locale === "en-US" ? "Updated At" : "更新日時";
            default:
                // 如果有中文注释，根据语言环境处理
                if (field.comment) {
                    switch (locale) {
                        case "zh-CN":
                            return field.comment;
                        case "en-US":
                            // 尝试将中文字段名转换为英文（简单映射）
                            return this.translateChineseToEnglish(field.comment) || this.formatFieldName(field.name);
                        case "ja-JP":
                            // 尝试将中文字段名转换为日文（简单映射）
                            return this.translateChineseToJapanese(field.comment) || this.formatFieldName(field.name);
                        default:
                            return field.comment;
                    }
                }
                // 如果没有注释，格式化字段名
                return this.formatFieldName(field.name);
        }
    }
    /**
     * 获取操作列翻译
     */
    getActionsTranslation(locale) {
        switch (locale) {
            case "zh-CN":
                return "操作";
            case "en-US":
                return "Actions";
            case "ja-JP":
                return "操作";
            default:
                return "Actions";
        }
    }
    /**
     * 格式化字段名
     */
    formatFieldName(fieldName) {
        // 将下划线转换为空格并首字母大写
        return fieldName.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
    }
    /**
     * 简单的中文到英文翻译映射
     */
    translateChineseToEnglish(chinese) {
        const translations = {
            用户名: "Username",
            用户: "User",
            邮箱: "Email",
            电话: "Phone",
            手机: "Mobile",
            地址: "Address",
            描述: "Description",
            状态: "Status",
            名称: "Name",
            标题: "Title",
            内容: "Content",
            价格: "Price",
            数量: "Quantity",
            创建时间: "Created At",
            更新时间: "Updated At",
            修改时间: "Modified At",
        };
        return translations[chinese] || null;
    }
    /**
     * 简单的中文到日文翻译映射
     */
    translateChineseToJapanese(chinese) {
        const translations = {
            用户名: "ユーザー名",
            用户: "ユーザー",
            邮箱: "メール",
            电话: "電話",
            手机: "携帯電話",
            地址: "住所",
            描述: "説明",
            状态: "ステータス",
            名称: "名前",
            标题: "タイトル",
            内容: "内容",
            价格: "価格",
            数量: "数量",
            创建时间: "作成日時",
            更新时间: "更新日時",
            修改时间: "変更日時",
        };
        return translations[chinese] || null;
    }
    /**
     * 主生成方法（为了继承BaseGenerator需要实现）
     */
    generate() {
        return this.generateChineseTranslation();
    }
}
exports.I18nGenerator = I18nGenerator;
