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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createFiles = void 0;
const path_1 = __importStar(require("path"));
const shelljs_1 = __importDefault(require("shelljs"));
const fs_1 = __importDefault(require("fs"));
const constants_1 = require("./constants");
const utils_1 = require("./utils");
const sql_generator_1 = require("./generators/sql-generator");
const schema_generator_1 = require("./generators/schema-generator");
const resolver_generator_1 = require("./generators/resolver-generator");
const service_generator_1 = require("./generators/service-generator");
const page_generator_1 = require("./generators/page-generator");
const file_generator_1 = require("./generators/file-generator");
const dataloader_generator_1 = require("./generators/dataloader-generator");
// 常量定义
const TEMPLATE_FILES = {
    reduxActions: "redux/template/manage/actions.ts",
    reduxReducers: "redux/template/manage/reducers.ts",
    reduxTypes: "redux/template/manage/types.ts",
    styled: "styled/template/manage.ts",
    serverApi: "apis/template.js",
};
const MYSQL_TIMEOUT = 1000;
// 辅助函数
const createDirectoryStructure = (basePaths, type = "all") => {
    const isFrontend = type === "page" || type === "component" || type === "all";
    const isBackend = type === "module" || type === "api" || type === "all";
    const allowed = basePaths.filter((p) => {
        const isFrontendPath = p.includes("/client/") || p.includes("/pages/") || p.endsWith("/client") || p.endsWith("/pages");
        const isBackendPath = p.includes("/server/") || p.endsWith("/server");
        if (isFrontendPath && !isFrontend)
            return false;
        if (isBackendPath && !isBackend)
            return false;
        return true;
    });
    allowed.forEach((p) => (0, utils_1.mkdirSync)(p));
};
const generateFilePaths = (controller, action, dictionary = ".") => {
    // 根据 dictionary 确定目标路径
    const getDestPath = (basePath) => {
        if (!dictionary || dictionary === ".") {
            return basePath;
        }
        return path_1.default.join(constants_1.destFolder, dictionary, basePath.replace(`${constants_1.destFolder}/`, ""));
    };
    const paths = {
        // Pages - 动态生成，不需要源文件
        destPagesController: (0, path_1.resolve)(`${getDestPath(constants_1.destPagesPath)}/${controller}`),
        destPagesAction: (0, path_1.resolve)(`${getDestPath(constants_1.destPagesPath)}/${controller}/${action}.tsx`),
        // Client Redux - 使用模板
        destClientReduxController: (0, path_1.resolve)(`${getDestPath(constants_1.destClientReduxPath)}/${controller}`),
        destClientReduxControllerAction: (0, path_1.resolve)(`${getDestPath(constants_1.destClientReduxPath)}/${controller}/${action}`),
        sourceClientReduxActions: (0, path_1.resolve)(`${constants_1.sourceClientPath}/${TEMPLATE_FILES.reduxActions}`),
        sourceClientReduxReducers: (0, path_1.resolve)(`${constants_1.sourceClientPath}/${TEMPLATE_FILES.reduxReducers}`),
        sourceClientReduxTypes: (0, path_1.resolve)(`${constants_1.sourceClientPath}/${TEMPLATE_FILES.reduxTypes}`),
        destClientReduxActions: (0, path_1.resolve)(`${getDestPath(constants_1.destClientReduxPath)}/${controller}/${action}/actions.ts`),
        destClientReduxReducers: (0, path_1.resolve)(`${getDestPath(constants_1.destClientReduxPath)}/${controller}/${action}/reducers.ts`),
        destClientReduxTypes: (0, path_1.resolve)(`${getDestPath(constants_1.destClientReduxPath)}/${controller}/${action}/types.ts`),
        // Client Service - 动态生成
        destClientServiceController: (0, path_1.resolve)(`${getDestPath(constants_1.destClientServicePath)}/${controller}`),
        destClientAction: (0, path_1.resolve)(`${getDestPath(constants_1.destClientServicePath)}/${controller}/${action}.ts`),
        // Client Styled - 使用模板
        sourceClientStyledAction: (0, path_1.resolve)(`${constants_1.sourceClientPath}/${TEMPLATE_FILES.styled}`),
        destClientStyledController: (0, path_1.resolve)(`${getDestPath(constants_1.destClientStyledPath)}/${controller}`),
        destClientStyledAction: (0, path_1.resolve)(`${getDestPath(constants_1.destClientStyledPath)}/${controller}/${action}.ts`),
        // Server Modules - 动态生成
        destServerModulesController: (0, path_1.resolve)(`${getDestPath(constants_1.destServerModulesPath)}/${controller}`),
        destServerModulesResolver: (0, path_1.resolve)(`${getDestPath(constants_1.destServerModulesPath)}/${controller}/resolver.js`),
        destServerModulesSchema: (0, path_1.resolve)(`${getDestPath(constants_1.destServerModulesPath)}/${controller}/schema.js`),
        // Server APIs - 使用模板
        sourceServerApisController: (0, path_1.resolve)(`${constants_1.sourceServerPath}/${TEMPLATE_FILES.serverApi}`),
        destServerApisController: (0, path_1.resolve)(`${getDestPath(constants_1.destServerApisPath)}/${controller}.js`),
        // Server SQL - 动态生成
        destServerSqlController: (0, path_1.resolve)(`${getDestPath(constants_1.destServerSqlPath)}/${controller}.sql`),
        // Configuration files
        destClientReduxReducersAllPath: !dictionary || dictionary === "."
            ? constants_1.destClientReduxReducersAllPath
            : (0, path_1.resolve)(`${getDestPath(constants_1.destClientReduxPath)}/reducers.ts`),
        destServerRestPath: !dictionary || dictionary === "." ? constants_1.destServerRestPath : (0, path_1.resolve)(`${getDestPath(constants_1.destServerPath)}/rest.js`),
        destClientUtilsMenuPath: !dictionary || dictionary === "."
            ? constants_1.destClientUtilsMenuPath
            : (0, path_1.resolve)(`${getDestPath(constants_1.destClientPath)}/utils/menu.tsx`),
    };
    return paths;
};
const performBasicReplacements = (controller, action, paths, type = "all") => {
    const isFrontend = type === "page" || type === "component" || type === "all";
    const isBackend = type === "module" || type === "api" || type === "all";
    // 前端组路径与后端组路径，用于按 type 过滤，避免对未生成的文件做替换导致崩溃
    const fePaths = new Set([
        paths.destPagesAction,
        paths.destClientAction,
        paths.destClientReduxActions,
        paths.destClientReduxReducers,
        paths.destClientReduxTypes,
    ]);
    const bePaths = new Set([
        paths.destServerModulesResolver,
        paths.destServerModulesSchema,
        paths.destServerApisController,
    ]);
    // 仅保留属于当前激活分组的路径
    const active = (p) => (fePaths.has(p) && isFrontend) || (bePaths.has(p) && isBackend);
    const replacements = [
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
            ].filter(active),
        },
        {
            regex: "Template",
            replacement: (0, utils_1.firstUpperCase)(controller),
            paths: [
                paths.destPagesAction,
                paths.destClientAction,
                paths.destClientReduxActions,
                paths.destServerModulesSchema,
                paths.destServerApisController,
            ].filter(active),
        },
        {
            regex: "TEMPLATE",
            replacement: controller.toUpperCase(),
            paths: [paths.destClientReduxActions, paths.destClientReduxReducers, paths.destClientReduxTypes].filter(active),
        },
        {
            regex: "manage",
            replacement: action,
            paths: [paths.destPagesAction, paths.destClientReduxActions].filter(active),
        },
        {
            regex: "Manage",
            replacement: (0, utils_1.firstUpperCase)(action),
            paths: [paths.destPagesAction, paths.destClientReduxReducers].filter(active),
        },
    ];
    replacements.forEach((rule) => {
        if (rule.paths.length)
            (0, utils_1.handleReplace)(rule);
    });
};
const performAdvancedReplacements = (controller, action, paths, type = "all") => {
    const isFrontend = type === "page" || type === "component" || type === "all";
    const isBackend = type === "module" || type === "api" || type === "all";
    const isApi = type === "api" || type === "all";
    const optionsArr = [];
    // 前端集成：reducers 注册 + 菜单项
    if (isFrontend) {
        optionsArr.push({
            from: /\n\s*\n/,
            to: `\nimport { ${controller}${(0, utils_1.firstUpperCase)(action)}Reducer } from './${controller}/${action}/reducers'\n\n`,
            files: [paths.destClientReduxReducersAllPath],
        }, {
            from: /Reducer,?\s*\n/,
            to: `Reducer,\n  ${controller}${(0, utils_1.firstUpperCase)(action)}: ${controller}${(0, utils_1.firstUpperCase)(action)}Reducer,\n`,
            files: [paths.destClientReduxReducersAllPath],
        }, {
            from: /\/\*\{\s*\n\s*key: \(\+\+key\)\.toString\(\),/,
            to: `{\n    // ${controller}_${action}_start\n    key: (++key).toString(),\n    text: '${controller}',\n    url: '/${controller}/${action}',\n    icon: <SolutionOutlined rev={undefined} />,\n    ` +
                `subMenus: [\n      {\n        key: \`\${key}_1\`,\n        text: '${action}',\n        url: '/${controller}/${action}'\n      }\n    ]\n    // ${controller}_${action}_end\n  },\n  /*{\n    key: (++key).toString(),`,
            files: [paths.destClientUtilsMenuPath],
        });
    }
    // 后端接口集成：rest 路由注册
    if (isApi) {
        optionsArr.push({
            from: /'(.\/apis\/template.*?)'\)\s*\n/,
            to: `'./apis/template')\nconst ${controller} = require('./apis/${controller}')\n`,
            files: [paths.destServerRestPath],
        }, {
            from: /template\)\s*\n/,
            to: `template)\nrouter.use('/${controller}', ${controller})\n`,
            files: [paths.destServerRestPath],
        });
    }
    if (constants_1.isLocal && isBackend) {
        optionsArr.push({
            from: /'nsgm-cli'\)/,
            to: "'../../../index')",
            files: [paths.destServerModulesResolver],
        });
    }
    // 清理之前的配置
    if (isFrontend) {
        shelljs_1.default.sed("-i", /.*${controller}${firstUpperCase(action)}Reducer.*/, "", paths.destClientReduxReducersAllPath);
    }
    if (isApi) {
        shelljs_1.default.sed("-i", /.*${controller}.*/, "", paths.destServerRestPath);
    }
    setTimeout(() => {
        (0, utils_1.replaceInFileAll)(optionsArr, 0, () => {
            console.log("special replace dest files finished");
        });
    }, MYSQL_TIMEOUT);
};
const generateDynamicFiles = (controller, action, paths, fields, dictionary, type = "all") => {
    // 创建生成器实例
    const sqlGenerator = new sql_generator_1.SQLGenerator(controller, action, fields);
    const schemaGenerator = new schema_generator_1.SchemaGenerator(controller, action, fields);
    const resolverGenerator = new resolver_generator_1.ResolverGenerator(controller, action, fields);
    const serviceGenerator = new service_generator_1.ServiceGenerator(controller, action, fields);
    const pageGenerator = new page_generator_1.PageGenerator(controller, action, fields);
    const dataLoaderGenerator = new dataloader_generator_1.DataLoaderGenerator(controller, action, fields);
    // 根据 dictionary 确定文件生成器的项目路径
    const projectPath = !dictionary || dictionary === "." ? "." : path_1.default.join(constants_1.destFolder, dictionary);
    const fileGenerator = new file_generator_1.FileGenerator(projectPath);
    const isFrontend = type === "page" || type === "component" || type === "all";
    const isBackend = type === "module" || type === "api" || type === "all";
    // 生成并写入文件（后端组：sql / resolver / schema / dataloader）
    if (isBackend) {
        fs_1.default.writeFileSync(paths.destServerSqlController, sqlGenerator.generate());
        fs_1.default.writeFileSync(paths.destServerModulesSchema, schemaGenerator.generate());
        fs_1.default.writeFileSync(paths.destServerModulesResolver, resolverGenerator.generate());
        // 生成 DataLoader 文件 (JavaScript)
        const dataLoaderPath = (0, path_1.resolve)(`${projectPath}/server/dataloaders/${controller}-dataloader.js`);
        (0, utils_1.mkdirSync)(path_1.default.dirname(dataLoaderPath));
        fs_1.default.writeFileSync(dataLoaderPath, dataLoaderGenerator.generate());
        console.log(`🚀 已生成 DataLoader 文件: ${dataLoaderPath}`);
    }
    // 生成并写入文件（前端组：service / page / i18n）
    if (isFrontend) {
        fs_1.default.writeFileSync(paths.destClientAction, serviceGenerator.generate());
        fs_1.default.writeFileSync(paths.destPagesAction, pageGenerator.generate());
        // 生成多语言文件
        fileGenerator.generateI18nFiles(controller, action, fields);
    }
};
/**
 * 复制并自定义模板文件
 */
const copyAndCustomizeTemplateFiles = (paths, _fields, type = "all") => {
    const isFrontend = type === "page" || type === "component" || type === "all";
    const isBackend = type === "module" || type === "api" || type === "all";
    // 只复制与当前类型相关的模板文件，其他文件已经动态生成
    const fileMappings = [];
    if (isFrontend) {
        fileMappings.push([paths.sourceClientReduxActions, paths.destClientReduxActions], [paths.sourceClientReduxReducers, paths.destClientReduxReducers], [paths.sourceClientReduxTypes, paths.destClientReduxTypes], [paths.sourceClientStyledAction, paths.destClientStyledAction]);
    }
    if (isBackend) {
        fileMappings.push([paths.sourceServerApisController, paths.destServerApisController]);
    }
    fileMappings.forEach(([source, dest]) => {
        (0, utils_1.copyFileSync)(source, dest);
    });
};
/**
 * 设置动态数据库
 */
const setupDynamicDatabase = (_controller, paths, _fields, type = "all") => {
    const isBackend = type === "module" || type === "api" || type === "all";
    if (!isBackend) {
        return;
    }
    // SQL 文件已经在 generateDynamicFiles 中生成，这里直接执行
    const mysqlCommand = `mysql -u${constants_1.mysqlUser} -p${constants_1.mysqlPassword} -h${constants_1.mysqlHost} -P${constants_1.mysqlPort} < ${paths.destServerSqlController}`;
    try {
        shelljs_1.default.exec(mysqlCommand);
        console.log("Dynamic database setup completed");
    }
    catch (error) {
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
const createFiles = (controller, action, dictionary, fields, type = "all") => {
    console.log("createFiles", constants_1.sourceFolder, constants_1.destFolder, constants_1.isLocal, controller, action, dictionary);
    try {
        // 如果没有提供字段定义，使用默认字段
        const defaultFields = [
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
        const getDestPath = (basePath) => {
            if (!dictionary || dictionary === ".") {
                return basePath;
            }
            return path_1.default.join(constants_1.destFolder, dictionary, basePath.replace(`${constants_1.destFolder}/`, ""));
        };
        // 3. 创建目录结构（包括基础目录和特定目录）
        const basePaths = [
            getDestPath(constants_1.destClientPath),
            getDestPath(constants_1.destServerPath),
            getDestPath(constants_1.destPagesPath),
            getDestPath(constants_1.destClientReduxPath),
            getDestPath(constants_1.destClientServicePath),
            getDestPath(constants_1.destClientStyledPath),
            getDestPath(constants_1.destServerModulesPath),
            getDestPath(constants_1.destServerApisPath),
            getDestPath(constants_1.destServerSqlPath),
            paths.destPagesController,
            paths.destClientReduxController,
            paths.destClientReduxControllerAction,
            paths.destClientServiceController,
            paths.destClientStyledController,
            paths.destServerModulesController,
            // 添加 DataLoader 目录
            (0, path_1.resolve)(`${getDestPath(constants_1.destServerPath)}/dataloaders`),
        ];
        createDirectoryStructure(basePaths, type);
        console.log("Directory structure created");
        // 4. 生成动态文件内容
        generateDynamicFiles(controller, action, paths, finalFields, dictionary, type);
        console.log("Dynamic files generated");
        // 5. 复制并自定义模板文件
        copyAndCustomizeTemplateFiles(paths, finalFields, type);
        console.log("Template files processed");
        // 6. 执行基本替换
        performBasicReplacements(controller, action, paths, type);
        console.log("Basic replacements completed");
        // 7. 执行高级替换
        performAdvancedReplacements(controller, action, paths, type);
        console.log("Advanced replacements initiated");
        // 8. 设置数据库
        setupDynamicDatabase(controller, paths, finalFields, type);
        console.log("createFiles completed successfully");
    }
    catch (error) {
        console.error("Failed to create files:", error);
        throw error;
    }
};
exports.createFiles = createFiles;
