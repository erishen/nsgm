"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.SQLGenerator = void 0;
const base_generator_1 = require("./base-generator");
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
/**
 * SQL生成器
 * 专门负责生成数据库表结构
 */
class SQLGenerator extends base_generator_1.BaseGenerator {
    /**
     * 从目标项目的 mysql.config.js 读取数据库名称
     */
    getDatabaseName() {
        try {
            // 尝试从目标项目读取配置文件
            const configPath = path.join(process.cwd(), "mysql.config.js");
            if (fs.existsSync(configPath)) {
                const config = require(configPath);
                if (config?.mysqlOptions?.database) {
                    return config.mysqlOptions.database;
                }
            }
        }
        catch {
            // 读取失败时使用默认值
        }
        return "crm_demo";
    }
    generate() {
        const fieldDefinitions = this.fields.map((field) => {
            let sql = `  \`${field.name}\``;
            // 数据类型
            sql += ` ${this.getSQLType(field)}`;
            // 是否必填
            if (field.required && !field.isAutoIncrement) {
                sql += " NOT NULL";
            }
            else if (!field.required) {
                sql += " DEFAULT NULL";
            }
            // 自增
            if (field.isAutoIncrement) {
                sql += " AUTO_INCREMENT";
            }
            // 默认值
            if (field.type === "timestamp" && field.name === "create_date") {
                sql += " DEFAULT CURRENT_TIMESTAMP(3)";
            }
            else if (field.type === "timestamp" && field.name === "update_date") {
                sql += " DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)";
            }
            else if (field.type === "varchar" && field.name !== "id" && !field.required) {
                sql += " DEFAULT ''";
            }
            // 注释
            if (field.comment) {
                sql += ` COMMENT '${field.comment}'`;
            }
            return sql;
        });
        const primaryKeyField = this.fields.find((f) => f.isPrimaryKey);
        const primaryKey = primaryKeyField ? `  PRIMARY KEY (\`${primaryKeyField.name}\`)` : "";
        const databaseName = this.getDatabaseName();
        return `use ${databaseName};

CREATE TABLE \`${this.controller}\` (
${fieldDefinitions.join(",\n")},
${primaryKey}
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4;`;
    }
}
exports.SQLGenerator = SQLGenerator;
