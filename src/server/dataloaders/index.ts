import { TemplateDataLoader, createTemplateDataLoader } from './template-dataloader';

/**
 * DataLoader 上下文接口
 */
export interface DataLoaderContext extends Record<string, unknown> {
  dataloaders: {
    template: TemplateDataLoader;
  };
}

/**
 * 创建 DataLoader 上下文
 * 每个 GraphQL 请求都会创建新的 DataLoader 实例，确保请求隔离
 */
export function createDataLoaderContext(): DataLoaderContext {
  return {
    dataloaders: {
      template: createTemplateDataLoader(),
    }
  };
}

/**
 * DataLoader 统计信息
 */
export function getDataLoaderStats(context: DataLoaderContext) {
  return {
    template: context.dataloaders.template.getStats(),
    timestamp: new Date().toISOString(),
  };
}

/**
 * 清除所有 DataLoader 缓存
 */
export function clearAllDataLoaderCache(context: DataLoaderContext): void {
  context.dataloaders.template.clearAll();
  console.log('🧹 所有 DataLoader 缓存已清空');
}