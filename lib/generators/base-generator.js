"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseGenerator = void 0;
/**
 * 基础生成器抽象类
 * 定义所有代码生成器的通用接口
 */
class BaseGenerator {
    constructor(controller, action, fields) {
        this.controller = controller;
        this.action = action;
        this.fields = fields;
    }
    /**
     * 获取首字母大写的控制器名
     */
    getCapitalizedController() {
        return this.controller.charAt(0).toUpperCase() + this.controller.slice(1);
    }
    /**
     * 获取首字母大写的动作名
     */
    getCapitalizedAction() {
        return this.action.charAt(0).toUpperCase() + this.action.slice(1);
    }
    /**
     * 获取显示字段
     */
    getDisplayFields() {
        return this.fields.filter((f) => f.showInList && !f.isSystemField);
    }
    /**
     * 获取表单字段
     */
    getFormFields() {
        return this.fields.filter((f) => f.showInForm && !f.isPrimaryKey && !f.isSystemField);
    }
    /**
     * 获取可搜索字段
     */
    getSearchableFields() {
        return this.fields.filter((f) => f.searchable);
    }
    /**
     * 获取非系统字段
     */
    getNonSystemFields() {
        return this.fields.filter((f) => !f.isSystemField);
    }
    /**
     * 将字段类型转换为GraphQL类型
     */
    getGraphQLType(fieldType) {
        switch (fieldType) {
            case "integer":
                return "Int";
            case "decimal":
                return "Float";
            case "boolean":
                return "Boolean";
            default:
                return "String";
        }
    }
    /**
     * 将字段类型转换为SQL类型
     */
    getSQLType(field) {
        switch (field.type) {
            case "varchar":
                return `varchar(${field.length || 255})`;
            case "text":
                return "text";
            case "integer":
                return "integer";
            case "decimal":
                const [precision, scale] = (field.length || "10,2").toString().split(",");
                return `decimal(${precision || 10},${scale || 2})`;
            case "boolean":
                return "boolean";
            case "date":
                return "date";
            case "datetime":
                return "datetime";
            case "timestamp":
                return "TIMESTAMP(3)";
            default:
                return "varchar(255)";
        }
    }
}
exports.BaseGenerator = BaseGenerator;
