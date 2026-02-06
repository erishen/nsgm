import { BaseGenerator } from "./base-generator";
import * as path from "path";
import * as fs from "fs";

/**
 * SQL生成器
 * 专门负责生成数据库表结构
 */
export class SQLGenerator extends BaseGenerator {
  /**
   * 从目标项目的 mysql.config.js 读取数据库名称
   */
  private getDatabaseName(): string {
    try {
      // 尝试从目标项目读取配置文件
      const configPath = path.join(process.cwd(), "mysql.config.js");
      if (fs.existsSync(configPath)) {
        const config = require(configPath);
        if (config?.mysqlOptions?.database) {
          return config.mysqlOptions.database;
        }
      }
    } catch {
      // 读取失败时使用默认值
    }
    return "crm_demo";
  }

  generate(): string {
    const fieldDefinitions = this.fields.map((field) => {
      let sql = `  \`${field.name}\``;

      // 数据类型
      sql += ` ${this.getSQLType(field)}`;

      // 是否必填
      if (field.required && !field.isAutoIncrement) {
        sql += " NOT NULL";
      } else if (!field.required) {
        sql += " DEFAULT NULL";
      }

      // 自增
      if (field.isAutoIncrement) {
        sql += " AUTO_INCREMENT";
      }

      // 默认值
      if (field.type === "timestamp" && field.name === "create_date") {
        sql += " DEFAULT CURRENT_TIMESTAMP(3)";
      } else if (field.type === "timestamp" && field.name === "update_date") {
        sql += " DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)";
      } else if (field.type === "varchar" && field.name !== "id" && !field.required) {
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
