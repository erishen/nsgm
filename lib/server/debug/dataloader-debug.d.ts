import { DataLoaderContext } from "../dataloaders";
/**
 * DataLoader 调试和监控 API
 * 在开发环境中提供 DataLoader 性能监控接口
 */
/**
 * 获取 DataLoader 统计信息的 GraphQL resolver
 */
export declare const dataLoaderStatsResolver: {
    dataLoaderStats: (_: any, context: DataLoaderContext) => Promise<{
        status: string;
        score: number;
        summary: {
            totalLoaders: number;
            totalRequests: number;
            totalBatchRequests: number;
            totalCacheHits: number;
            totalCacheMisses: number;
        };
        loaders: any[];
        recommendations: string[];
        contextStats: {
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
        } | null;
        timestamp: string;
    }>;
    resetDataLoaderStats: () => Promise<{
        success: boolean;
        message: string;
        timestamp: string;
    }>;
    clearDataLoaderCache: (_: any, context: DataLoaderContext) => Promise<{
        success: boolean;
        message: string;
        timestamp: string;
    }>;
};
/**
 * DataLoader 调试 Schema
 */
export declare const dataLoaderDebugSchema: {
    query: string;
    mutation: string;
    type: string;
};
/**
 * Express 路由：DataLoader 调试接口
 */
export declare function createDataLoaderDebugRoutes(app: any): void;
