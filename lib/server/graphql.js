"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("graphql-http/lib/use/express");
const graphql_1 = require("graphql");
const fs_1 = __importDefault(require("fs"));
const lodash_1 = __importDefault(require("lodash"));
const path_1 = require("path");
const date_1 = __importDefault(require("./plugins/date"));
const dataloaders_1 = require("./dataloaders");
// 缓存已生成的 schema 和 resolvers
let cachedSchema = null;
let cachedResolvers = null;
const defaultPath = (0, path_1.resolve)(__dirname, "./modules/");
const typeDefFileName = "schema.js";
const resolverFileName = "resolver.js";
const curFolder = process.cwd();
const outModulesPath = (0, path_1.resolve)(`${curFolder}/server/modules/`);
const handleOutPlugins = () => {
    let result = {};
    const outPluginsPath = (0, path_1.resolve)(`${curFolder}/server/plugins/`);
    if (!fs_1.default.existsSync(outPluginsPath)) {
        return result;
    }
    try {
        const list = fs_1.default.readdirSync(outPluginsPath);
        list.forEach((item) => {
            const resolverPath = (0, path_1.resolve)(`${outPluginsPath}/${item}`);
            if (!fs_1.default.existsSync(resolverPath))
                return;
            const stat = fs_1.default.statSync(resolverPath);
            const isFile = stat.isFile();
            if (isFile && (item.endsWith(".js") || item.endsWith(".ts"))) {
                const pluginModule = require(resolverPath);
                result = {
                    ...result,
                    ...(pluginModule.default || pluginModule),
                };
            }
        });
    }
    catch (error) {
        console.warn("⚠️  Error loading plugins:", error);
    }
    return result;
};
function generateTypeDefsAndResolvers() {
    // 如果已有缓存且在生产环境，直接返回缓存
    if (process.env.NODE_ENV === "production" && cachedSchema && cachedResolvers) {
        return {
            schemaStr: cachedSchema,
            resolvers: cachedResolvers,
        };
    }
    const querySchemes = ["_: Boolean"];
    const mutationSchemes = ["_: Boolean"];
    const subscriptionSchemes = ["_: Boolean"];
    const typeSchemes = [];
    const resolvers = {
        ...date_1.default,
        ...handleOutPlugins(),
    };
    const scalars = lodash_1.default.keys(resolvers);
    let scalarStr = "";
    lodash_1.default.each(scalars, (item) => {
        scalarStr += `scalar ${item}\n    `;
    });
    const _generateAllComponentRecursive = (path = defaultPath) => {
        if (!fs_1.default.existsSync(path))
            return;
        try {
            const list = fs_1.default.readdirSync(path);
            list.forEach((item) => {
                const resolverPath = `${path}/${item}`;
                if (!fs_1.default.existsSync(resolverPath))
                    return;
                const stat = fs_1.default.statSync(resolverPath);
                const isDir = stat.isDirectory();
                const isFile = stat.isFile();
                if (isDir) {
                    _generateAllComponentRecursive(resolverPath);
                }
                else if (isFile && item === typeDefFileName) {
                    try {
                        let schemaObj = require(resolverPath);
                        if (schemaObj.default !== undefined)
                            schemaObj = schemaObj.default;
                        const { query, mutation, subscription, type } = schemaObj;
                        if (query && query !== "")
                            querySchemes.push(query);
                        if (mutation && mutation !== "")
                            mutationSchemes.push(mutation);
                        if (subscription && subscription !== "")
                            subscriptionSchemes.push(subscription);
                        if (type && type !== "")
                            typeSchemes.push(type);
                    }
                    catch (error) {
                        console.warn(`⚠️  Error loading schema from ${resolverPath}:`, error);
                    }
                }
                else if (isFile && item === resolverFileName) {
                    try {
                        let resolversObj = require(resolverPath);
                        if (resolversObj.default !== undefined)
                            resolversObj = resolversObj.default;
                        Object.keys(resolversObj).forEach((k) => {
                            if (!resolvers[k])
                                resolvers[k] = {};
                            resolvers[k] = resolversObj[k];
                        });
                    }
                    catch (error) {
                        console.warn(`⚠️  Error loading resolver from ${resolverPath}:`, error);
                    }
                }
            });
        }
        catch (error) {
            console.warn(`⚠️  Error reading directory ${path}:`, error);
        }
    };
    _generateAllComponentRecursive();
    _generateAllComponentRecursive(outModulesPath);
    const schemaStr = `
    ${scalarStr}

    type Query { 
        ${querySchemes.join("\n")} 
    }

    type Mutation { 
        ${mutationSchemes.join("\n")} 
    }

    type Subscription { 
        ${subscriptionSchemes.join("\n")} 
    }

    ${typeSchemes.join("\n")}
  `;
    // 在生产环境中缓存结果
    if (process.env.NODE_ENV === "production") {
        cachedSchema = schemaStr;
        cachedResolvers = resolvers;
    }
    return { querySchemes, mutationSchemes, subscriptionSchemes, typeSchemes, resolvers, scalarStr, schemaStr };
}
const generateResult = generateTypeDefsAndResolvers();
const { querySchemes: querySchemesV, mutationSchemes: mutationSchemesV, subscriptionSchemes: subscriptionSchemesV, typeSchemes: typeSchemesV, resolvers: resolversV, scalarStr: scalarStrV, schemaStr: generatedSchemaStr, } = generateResult;
// 导出 handler 函数，兼容 express 用法
const handler = (command) => {
    const schemaStr = generatedSchemaStr ||
        `
      ${scalarStrV}

      type Query { 
          ${querySchemesV?.join("\n") || "_: Boolean"} 
      }

      type Mutation { 
          ${mutationSchemesV?.join("\n") || "_: Boolean"} 
      }

      type Subscription { 
          ${subscriptionSchemesV?.join("\n") || "_: Boolean"} 
      }

      ${typeSchemesV?.join("\n") || ""}
    `;
    if (command === "dev") {
        console.log("schemaStr", schemaStr);
        console.log("resolvers", resolversV);
    }
    // graphql-http 不再内置 graphiql，需手动集成 playground 或 altair，以下为基础 handler
    return (0, express_1.createHandler)({
        schema: (0, graphql_1.buildSchema)(schemaStr),
        rootValue: resolversV,
        // 为每个请求创建新的 DataLoader 上下文，确保请求隔离和缓存正确性
        context: (_req, _params) => {
            const context = (0, dataloaders_1.createDataLoaderContext)();
            if (command === "dev") {
                console.log("🚀 GraphQL DataLoader 上下文已创建");
            }
            return context;
        },
    });
};
exports.default = handler;
