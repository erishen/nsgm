"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDataLoaderContext = createDataLoaderContext;
exports.getDataLoaderStats = getDataLoaderStats;
exports.clearAllDataLoaderCache = clearAllDataLoaderCache;
const template_dataloader_1 = require("./template-dataloader");
/**
 * 创建 DataLoader 上下文
 * 每个 GraphQL 请求都会创建新的 DataLoader 实例，确保请求隔离
 */
function createDataLoaderContext() {
    return {
        dataloaders: {
            template: (0, template_dataloader_1.createTemplateDataLoader)(),
        }
    };
}
/**
 * DataLoader 统计信息
 */
function getDataLoaderStats(context) {
    return {
        template: context.dataloaders.template.getStats(),
        timestamp: new Date().toISOString(),
    };
}
/**
 * 清除所有 DataLoader 缓存
 */
function clearAllDataLoaderCache(context) {
    context.dataloaders.template.clearAll();
    console.log('🧹 所有 DataLoader 缓存已清空');
}
