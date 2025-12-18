import inquirer from "inquirer";
import { Console } from "./console";

// 字段定义类型
export interface FieldDefinition {
  name: string;
  type: "varchar" | "text" | "integer" | "decimal" | "boolean" | "date" | "datetime" | "timestamp";
  length?: string | number;
  required?: boolean;
  comment?: string;
  isPrimaryKey?: boolean;
  isAutoIncrement?: boolean;
  isSystemField?: boolean;
  showInList?: boolean;
  showInForm?: boolean;
  searchable?: boolean;
}

/**
 * 交互式提示工具类
 */
export class Prompt {
  /**
   * 确认提示
   */
  static async confirm(message: string, defaultValue = false): Promise<boolean> {
    const { confirmed } = await inquirer.prompt({
      type: "confirm",
      name: "confirmed",
      message,
      default: defaultValue,
    });
    return confirmed;
  }

  /**
   * 输入提示
   */
  static async input(
    message: string,
    defaultValue?: string,
    validate?: (input: string) => boolean | string
  ): Promise<string> {
    const config: any = {
      type: "input",
      name: "value",
      message,
      validate: validate || (() => true),
    };

    if (defaultValue !== undefined) {
      config.default = defaultValue;
    }

    const { value } = await inquirer.prompt(config);
    return value;
  }

  /**
   * 密码输入
   */
  static async password(message: string, validate?: (input: string) => boolean | string): Promise<string> {
    const { value } = await inquirer.prompt({
      type: "password",
      name: "value",
      message,
      validate: validate || (() => true),
    });
    return value;
  }

  /**
   * 单选提示
   */
  static async select(message: string, choices: string[] | Array<{ name: string; value: any }>): Promise<any> {
    const { selected } = await inquirer.prompt({
      type: "list",
      name: "selected",
      message,
      choices,
    });
    return selected;
  }

  /**
   * 多选提示
   */
  static async multiSelect(
    message: string,
    choices: string[] | Array<{ name: string; value: any; checked?: boolean }>
  ): Promise<any[]> {
    const { selected } = await inquirer.prompt({
      type: "checkbox",
      name: "selected",
      message,
      choices,
    });
    return selected;
  }

  /**
   * 自定义提示
   */
  static async custom(questions: any): Promise<any> {
    return await inquirer.prompt(questions);
  }

  /**
   * 项目初始化向导
   */
  static async initWizard(): Promise<{
    projectName: string;
    description: string;
    author: string;
    database: boolean;
    features: string[];
  }> {
    Console.title("🚀 NSGM 项目初始化向导");
    Console.newLine();

    const answers = await inquirer.prompt([
      {
        type: "input",
        name: "projectName",
        message: "项目目录:",
        default: "my-nsgm-project",
        validate: (input: string) => {
          if (!input.trim()) return "项目目录不能为空";
          // 允许路径格式，包括相对路径和绝对路径
          if (!/^[a-zA-Z0-9\-_./\\]+$/.test(input)) return "项目目录只能包含字母、数字、横线、下划线和路径分隔符";
          return true;
        },
      },
      {
        type: "input",
        name: "description",
        message: "项目描述:",
        default: "A NSGM fullstack project",
      },
      {
        type: "input",
        name: "author",
        message: "作者:",
        default: "Your Name",
      },
    ]);

    // 设置默认配置
    const result = {
      ...answers,
      database: true,
      features: ["nextjs", "styled-components", "graphql", "mysql", "typescript", "eslint"],
    };

    return result;
  }

  /**
   * 控制器创建向导
   */
  static async createControllerWizard(): Promise<{
    controller: string;
    action: string;
    description: string;
    dictionary: string;
    includeDatabase: boolean;
    fields: FieldDefinition[];
  }> {
    Console.title("📝 创建控制器向导 (包含完整CRUD + 导入导出 + 批量删除功能)");
    Console.newLine();

    const answers: any = await inquirer.prompt([
      {
        type: "input",
        name: "dictionary",
        message: "项目目录:",
        default: ".",
        validate: (input: string) => {
          if (!input.trim()) return "项目目录不能为空";
          return true;
        },
      },
      {
        type: "input",
        name: "controller",
        message: "控制器名称:",
        validate: (input: string) => {
          if (!input.trim()) return "控制器名称不能为空";
          if (!/^[a-zA-Z][a-zA-Z0-9]*$/.test(input)) return "控制器名称必须以字母开头，只能包含字母和数字";
          return true;
        },
      },
      {
        type: "input",
        name: "description",
        message: "控制器描述:",
        default: (answers: any) => `${answers.controller} 控制器`,
      },
      {
        type: "confirm",
        name: "useCustomFields",
        message: "是否自定义字段配置？(默认字段: id, name, create_date, update_date)",
        default: false,
      },
    ]);

    // 设置默认action为manage（包含完整的CRUD + 导入 + 导出 + 批量删除功能）
    answers.action = "manage";
    answers.includeDatabase = true;

    if (answers.useCustomFields) {
      // 如果用户选择自定义字段，收集字段定义
      answers.fields = await this.collectFieldDefinitions();
    } else {
      // 使用默认字段配置
      answers.fields = [
        { name: "id", type: "integer", required: true, comment: "主键", isPrimaryKey: true, isAutoIncrement: true },
        {
          name: "name",
          type: "varchar",
          length: 100,
          required: true,
          comment: "名称",
          showInList: true,
          showInForm: true,
          searchable: true,
        },
        { name: "create_date", type: "timestamp", required: true, comment: "创建时间", isSystemField: true },
        { name: "update_date", type: "timestamp", required: true, comment: "更新时间", isSystemField: true },
      ];
    }

    return answers;
  }

  /**
   * 收集字段定义 (简化版本)
   */
  static async collectFieldDefinitions(): Promise<FieldDefinition[]> {
    const fields: FieldDefinition[] = [];

    // 默认添加ID字段
    fields.push({
      name: "id",
      type: "integer",
      required: true,
      comment: "主键",
      isPrimaryKey: true,
      isAutoIncrement: true,
    });

    Console.info("💡 输入字段信息，输入空白字段名结束添加");

    let fieldIndex = 1;
    while (true) {
      const fieldName = await this.input(`字段${fieldIndex} 名称 (留空结束):`);

      if (!fieldName.trim()) break;

      // 验证字段名
      if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(fieldName)) {
        Console.error("字段名称格式无效，请重新输入");
        continue;
      }

      if (fields.some((f) => f.name === fieldName) || ["create_date", "update_date"].includes(fieldName)) {
        Console.error("字段名称已存在或为系统保留字段，请重新输入");
        continue;
      }

      // 简化的字段类型选择
      const fieldType = await this.select("字段类型:", [
        "varchar",
        "text",
        "integer",
        "decimal",
        "boolean",
        "date",
        "datetime",
      ]);

      // 只对需要长度的类型询问长度
      let length: string | undefined;
      if (fieldType === "varchar") {
        length = await this.input("字符串长度:", "255");
      } else if (fieldType === "decimal") {
        length = await this.input("小数精度 (如: 10,2):", "10,2");
      }

      // 简化配置：只询问是否必填和注释
      const required = await this.confirm("是否必填:", true);
      const comment = await this.input("字段注释:", fieldName);

      const field: FieldDefinition = {
        name: fieldName,
        type: fieldType as any,
        required,
        comment,
        showInList: true, // 默认在列表显示
        showInForm: true, // 默认在表单显示
        searchable: fieldType === "varchar", // varchar类型默认可搜索
      };

      // 只有当length有值时才添加
      if (length) {
        field.length = length;
      }

      fields.push(field);

      fieldIndex++;
    }

    // 自动添加系统字段
    fields.push(
      {
        name: "create_date",
        type: "timestamp",
        required: true,
        comment: "创建时间",
        isSystemField: true,
      },
      {
        name: "update_date",
        type: "timestamp",
        required: true,
        comment: "更新时间",
        isSystemField: true,
      }
    );

    return fields;
  }

  /**
   * 控制器删除向导
   */
  static async deleteControllerWizard(): Promise<{
    controller: string;
    action: string;
    dictionary: string;
    deleteDatabase: boolean;
  }> {
    Console.title("🗑️ 删除控制器向导");
    Console.newLine();

    const answers: any = await inquirer.prompt([
      {
        type: "input",
        name: "dictionary",
        message: "项目目录:",
        default: ".",
        validate: (input: string) => {
          if (!input.trim()) return "项目目录不能为空";
          return true;
        },
      },
      {
        type: "input",
        name: "controller",
        message: "控制器名称:",
        validate: (input: string) => {
          if (!input.trim()) return "控制器名称不能为空";
          if (!/^[a-zA-Z][a-zA-Z0-9]*$/.test(input)) return "控制器名称必须以字母开头，只能包含字母和数字";
          return true;
        },
      },
      {
        type: "list",
        name: "action",
        message: "删除范围:",
        choices: [
          { name: "删除所有相关文件", value: "all" },
          { name: "仅删除指定操作", value: "manage" },
        ],
        default: "all",
      },
      {
        type: "confirm",
        name: "deleteDatabase",
        message: "是否同时删除数据库表?",
        default: false,
      },
    ]);

    return answers;
  }
}
