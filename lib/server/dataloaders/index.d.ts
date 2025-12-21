import { TemplateDataLoader } from './template-dataloader';
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
export declare function createDataLoaderContext(): DataLoaderContext;
/**
 * DataLoader 统计信息
 */
export declare function getDataLoaderStats(context: DataLoaderContext): {
    template: {
        byId: {
            cacheMap: any;
            name: string;
        };
        byName: {
            cacheMap: any;
            name: string;
        };
        searchByName: {
            cacheMap: any;
            name: string;
        };
    };
    timestamp: string;
};
/**
 * 清除所有 DataLoader 缓存
 */
export declare function clearAllDataLoaderCache(context: DataLoaderContext): void;
