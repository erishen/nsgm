import path, { resolve } from "path";
import shell from "shelljs";
import fs from "fs";
import {
  sourceFolder,
  destFolder,
  isLocal,
  sourceClientPath,
  sourceServerPath,
  destClientPath,
  destClientReduxPath,
  destClientServicePath,
  destClientStyledPath,
  destServerPath,
  destServerModulesPath,
  destServerApisPath,
  destServerSqlPath,
  destPagesPath,
  destClientUtilsMenuPath,
  destClientReduxReducersAllPath,
  destServerRestPath,
  mysqlUser,
  mysqlPassword,
  mysqlHost,
  mysqlPort,
} from "./constants";
import { firstUpperCase, mkdirSync, copyFileSync, handleReplace, replaceInFileAll } from "./utils";
import { FieldDefinition } from "./cli/utils/prompt";
import { SQLGenerator } from "./generators/sql-generator";
import { SchemaGenerator } from "./generators/schema-generator";
import { ResolverGenerator } from "./generators/resolver-generator";
import { ServiceGenerator } from "./generators/service-generator";
import { PageGenerator } from "./generators/page-generator";
import { FileGenerator } from "./generators/file-generator";

/**
 * 文件生成器 - 重构后的清晰架构
 *
 * 职责分离：
 * 1. 路径管理 - generateFilePaths
 * 2. 目录创建 - createDirectoryStructure
 * 3. 代码生成 - 各个专门的生成器
 * 4. 文件写入 - writeGeneratedFiles
 * 5. 模板处理 - processTemplateFiles
 * 6. 数据库设置 - setupDatabase
 */

// 类型定义
interface ReplaceRule {
  regex: string;
  replacement: string;
  paths: string[];
}

// 常量定义
const TEMPLATE_FILES = {
  reduxActions: "redux/template/manage/actions.ts",
  reduxReducers: "redux/template/manage/reducers.ts",
  reduxTypes: "redux/template/manage/types.ts",
  styled: "styled/template/manage.ts",
  serverApi: "apis/template.js",
} as const;

const MYSQL_TIMEOUT = 1000;

// 辅助函数
const createDirectoryStructure = (basePaths: string[]): void => {
  basePaths.forEach((path) => mkdirSync(path));
};

const generateFilePaths = (controller: string, action: string, dictionary = ".") => {
  // 根据 dictionary 确定目标路径
  const getDestPath = (basePath: string) => {
    if (!dictionary || dictionary === ".") {
      return basePath;
    }
    return path.join(destFolder, dictionary, basePath.replace(`${destFolder}/`, ""));
  };

  const paths = {
    // Pages - 动态生成，不需要源文件
    destPagesController: resolve(`${getDestPath(destPagesPath)}/${controller}`),
    destPagesAction: resolve(`${getDestPath(destPagesPath)}/${controller}/${action}.tsx`),

    // Client Redux - 使用模板
    destClientReduxController: resolve(`${getDestPath(destClientReduxPath)}/${controller}`),
    destClientReduxControllerAction: resolve(`${getDestPath(destClientReduxPath)}/${controller}/${action}`),
    sourceClientReduxActions: resolve(`${sourceClientPath}/${TEMPLATE_FILES.reduxActions}`),
    sourceClientReduxReducers: resolve(`${sourceClientPath}/${TEMPLATE_FILES.reduxReducers}`),
    sourceClientReduxTypes: resolve(`${sourceClientPath}/${TEMPLATE_FILES.reduxTypes}`),
    destClientReduxActions: resolve(`${getDestPath(destClientReduxPath)}/${controller}/${action}/actions.ts`),
    destClientReduxReducers: resolve(`${getDestPath(destClientReduxPath)}/${controller}/${action}/reducers.ts`),
    destClientReduxTypes: resolve(`${getDestPath(destClientReduxPath)}/${controller}/${action}/types.ts`),

    // Client Service - 动态生成
    destClientServiceController: resolve(`${getDestPath(destClientServicePath)}/${controller}`),
    destClientAction: resolve(`${getDestPath(destClientServicePath)}/${controller}/${action}.ts`),

    // Client Styled - 使用模板
    sourceClientStyledAction: resolve(`${sourceClientPath}/${TEMPLATE_FILES.styled}`),
    destClientStyledController: resolve(`${getDestPath(destClientStyledPath)}/${controller}`),
    destClientStyledAction: resolve(`${getDestPath(destClientStyledPath)}/${controller}/${action}.ts`),

    // Server Modules - 动态生成
    destServerModulesController: resolve(`${getDestPath(destServerModulesPath)}/${controller}`),
    destServerModulesResolver: resolve(`${getDestPath(destServerModulesPath)}/${controller}/resolver.js`),
    destServerModulesSchema: resolve(`${getDestPath(destServerModulesPath)}/${controller}/schema.js`),

    // Server APIs - 使用模板
    sourceServerApisController: resolve(`${sourceServerPath}/${TEMPLATE_FILES.serverApi}`),
    destServerApisController: resolve(`${getDestPath(destServerApisPath)}/${controller}.js`),

    // Server SQL - 动态生成
    destServerSqlController: resolve(`${getDestPath(destServerSqlPath)}/${controller}.sql`),

    // Configuration files
    destClientReduxReducersAllPath:
      !dictionary || dictionary === "."
        ? destClientReduxReducersAllPath
        : resolve(`${getDestPath(destClientReduxPath)}/reducers.ts`),
    destServerRestPath:
      !dictionary || dictionary === "." ? destServerRestPath : resolve(`${getDestPath(destServerPath)}/rest.js`),
    destClientUtilsMenuPath:
      !dictionary || dictionary === "."
        ? destClientUtilsMenuPath
        : resolve(`${getDestPath(destClientPath)}/utils/menu.tsx`),
  };

  return paths;
};

const performBasicReplacements = (
  controller: string,
  action: string,
  paths: ReturnType<typeof generateFilePaths>
): void => {
  const replacements: ReplaceRule[] = [
    {
      regex: "template",
      replacement: controller,
      paths: [
        paths.destPagesAction,
        paths.destClientAction,
        paths.destClientReduxActions,
        paths.destClientReduxReducers,
        paths.destServerModulesResolver,
        paths.destServerModulesSchema,
        paths.destServerApisController,
      ],
    },
    {
      regex: "Template",
      replacement: firstUpperCase(controller),
      paths: [
        paths.destPagesAction,
        paths.destClientAction,
        paths.destClientReduxActions,
        paths.destServerModulesSchema,
        paths.destServerApisController,
      ],
    },
    {
      regex: "TEMPLATE",
      replacement: controller.toUpperCase(),
      paths: [paths.destClientReduxActions, paths.destClientReduxReducers, paths.destClientReduxTypes],
    },
    {
      regex: "manage",
      replacement: action,
      paths: [paths.destPagesAction, paths.destClientReduxActions],
    },
    {
      regex: "Manage",
      replacement: firstUpperCase(action),
      paths: [paths.destPagesAction, paths.destClientReduxReducers],
    },
  ];

  replacements.forEach((rule) => {
    handleReplace(rule);
  });
};

const performAdvancedReplacements = (
  controller: string,
  action: string,
  paths: ReturnType<typeof generateFilePaths>
): void => {
  const optionsArr = [
    {
      from: /\n\s*\n/,
      to: `\nimport { ${controller}${firstUpperCase(action)}Reducer } from './${controller}/${action}/reducers'\n\n`,
      files: [paths.destClientReduxReducersAllPath],
    },
    {
      from: /Reducer,?\s*\n/,
      to: `Reducer,\n  ${controller}${firstUpperCase(action)}: ${controller}${firstUpperCase(action)}Reducer,\n`,
      files: [paths.destClientReduxReducersAllPath],
    },
    {
      from: /'(.\/apis\/template.*?)'\)\s*\n/,
      to: `'./apis/template')\nconst ${controller} = require('./apis/${controller}')\n`,
      files: [paths.destServerRestPath],
    },
    {
      from: /template\)\s*\n/,
      to: `template)\nrouter.use('/${controller}', ${controller})\n`,
      files: [paths.destServerRestPath],
    },
    {
      from: /\/\*\{\s*\n\s*key: \(\+\+key\)\.toString\(\),/,
      to:
        `{\n    // ${controller}_${action}_start\n    key: (++key).toString(),\n    text: '${
          controller
        }',\n    url: '/${controller}/${action}',\n    icon: <SolutionOutlined rev={undefined} />,\n    ` +
        `subMenus: [\n      {\n        key: \`\${key}_1\`,\n        text: '${action}',\n        url: '/${controller}/${
          action
        }'\n      }\n    ]\n    // ${controller}_${action}_end\n  },\n  /*{\n    key: (++key).toString(),`,
      files: [paths.destClientUtilsMenuPath],
    },
  ];

  if (isLocal) {
    optionsArr.push({
      from: /'nsgm-cli'\)/,
      to: "'../../../index')",
      files: [paths.destServerModulesResolver],
    });
  }

  // 清理之前的配置
  shell.sed("-i", /.*${controller}${firstUpperCase(action)}Reducer.*/, "", paths.destClientReduxReducersAllPath);
  shell.sed("-i", /.*${controller}.*/, "", paths.destServerRestPath);

  setTimeout(() => {
    replaceInFileAll(optionsArr, 0, () => {
      console.log("special replace dest files finished");
    });
  }, MYSQL_TIMEOUT);
};

const generateDynamicFiles = (
  controller: string,
  action: string,
  paths: ReturnType<typeof generateFilePaths>,
  fields: FieldDefinition[],
  dictionary?: string
): void => {
  // 创建生成器实例
  const sqlGenerator = new SQLGenerator(controller, action, fields);
  const schemaGenerator = new SchemaGenerator(controller, action, fields);
  const resolverGenerator = new ResolverGenerator(controller, action, fields);
  const serviceGenerator = new ServiceGenerator(controller, action, fields);
  const pageGenerator = new PageGenerator(controller, action, fields);

  // 根据 dictionary 确定文件生成器的项目路径
  const projectPath = !dictionary || dictionary === "." ? "." : path.join(destFolder, dictionary);
  const fileGenerator = new FileGenerator(projectPath);

  // 生成并写入文件
  fs.writeFileSync(paths.destServerSqlController, sqlGenerator.generate());
  fs.writeFileSync(paths.destServerModulesSchema, schemaGenerator.generate());
  fs.writeFileSync(paths.destServerModulesResolver, resolverGenerator.generate());
  fs.writeFileSync(paths.destClientAction, serviceGenerator.generate());
  fs.writeFileSync(paths.destPagesAction, pageGenerator.generate());

  // 生成多语言文件
  fileGenerator.generateI18nFiles(controller, action, fields);
};

/**
 * 复制并自定义模板文件
 */
const copyAndCustomizeTemplateFiles = (
  paths: ReturnType<typeof generateFilePaths>,
  _fields: FieldDefinition[]
): void => {
  // 只复制 Redux 相关的模板文件，其他文件已经动态生成
  const fileMappings: Array<[string, string]> = [
    [paths.sourceClientReduxActions, paths.destClientReduxActions],
    [paths.sourceClientReduxReducers, paths.destClientReduxReducers],
    [paths.sourceClientReduxTypes, paths.destClientReduxTypes],
    [paths.sourceClientStyledAction, paths.destClientStyledAction],
    [paths.sourceServerApisController, paths.destServerApisController],
  ];

  fileMappings.forEach(([source, dest]) => {
    copyFileSync(source, dest);
  });
};

/**
 * 设置动态数据库
 */
const setupDynamicDatabase = (
  _controller: string,
  paths: ReturnType<typeof generateFilePaths>,
  _fields: FieldDefinition[]
): void => {
  // SQL 文件已经在 generateDynamicFiles 中生成，这里直接执行
  const mysqlCommand = `mysql -u${mysqlUser} -p${mysqlPassword} -h${mysqlHost} -P${mysqlPort} < ${paths.destServerSqlController}`;

  try {
    shell.exec(mysqlCommand);
    console.log("Dynamic database setup completed");
  } catch (error) {
    console.error("Failed to execute dynamic SQL script:", error);
  }
};

/**
 * 创建控制器和动作相关的文件
 * @param controller 控制器名称
 * @param action 动作名称
 * @param dictionary 目标目录路径（可选，默认为当前目录）
 * @param fields 字段定义数组（可选）
 */
export const createFiles = (controller: string, action: string, dictionary?: string, fields?: FieldDefinition[]) => {
  console.log("createFiles", sourceFolder, destFolder, isLocal, controller, action, dictionary);

  try {
    // 如果没有提供字段定义，使用默认字段
    const defaultFields: FieldDefinition[] = [
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

    const finalFields = fields && fields.length > 0 ? fields : defaultFields;

    // 1. 生成文件路径
    const paths = generateFilePaths(controller, action, dictionary);

    // 2. 根据 dictionary 确定基础路径
    const getDestPath = (basePath: string) => {
      if (!dictionary || dictionary === ".") {
        return basePath;
      }
      return path.join(destFolder, dictionary, basePath.replace(`${destFolder}/`, ""));
    };

    // 3. 创建目录结构（包括基础目录和特定目录）
    const basePaths = [
      getDestPath(destClientPath),
      getDestPath(destServerPath),
      getDestPath(destPagesPath),
      getDestPath(destClientReduxPath),
      getDestPath(destClientServicePath),
      getDestPath(destClientStyledPath),
      getDestPath(destServerModulesPath),
      getDestPath(destServerApisPath),
      getDestPath(destServerSqlPath),
      paths.destPagesController,
      paths.destClientReduxController,
      paths.destClientReduxControllerAction,
      paths.destClientServiceController,
      paths.destClientStyledController,
      paths.destServerModulesController,
    ];

    createDirectoryStructure(basePaths);
    console.log("Directory structure created");

    // 4. 生成动态文件内容
    generateDynamicFiles(controller, action, paths, finalFields, dictionary);
    console.log("Dynamic files generated");

    // 5. 复制并自定义模板文件
    copyAndCustomizeTemplateFiles(paths, finalFields);
    console.log("Template files processed");

    // 6. 执行基本替换
    performBasicReplacements(controller, action, paths);
    console.log("Basic replacements completed");

    // 7. 执行高级替换
    performAdvancedReplacements(controller, action, paths);
    console.log("Advanced replacements initiated");

    // 8. 设置数据库
    setupDynamicDatabase(controller, paths, finalFields);

    console.log("createFiles completed successfully");
  } catch (error) {
    console.error("Failed to create files:", error);
    throw error;
  }
};
