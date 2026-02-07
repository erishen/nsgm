import { DataLoaderContext } from "../dataloaders";
/**
 * DataLoader 性能监控和调试工具
 */
export declare class DataLoaderMonitor {
    private static requestStats;
    /**
     * 记录 DataLoader 请求统计
     */
    static recordRequest(loaderName: string, isBatch: boolean, batchSize?: number): void;
    /**
     * 记录缓存命中/未命中
     */
    static recordCacheResult(loaderName: string, isHit: boolean): void;
    /**
     * 获取所有 DataLoader 统计信息
     */
    static getAllStats(): {
        summary: {
            totalLoaders: number;
            totalRequests: number;
            totalBatchRequests: number;
            totalCacheHits: number;
            totalCacheMisses: number;
        };
        loaders: {
            [k: string]: {
                totalRequests: number;
                batchRequests: number;
                cacheHits: number;
                cacheMisses: number;
                averageBatchSize: number;
                lastActivity: Date;
            };
        };
        generatedAt: string;
    };
    /**
     * 获取 DataLoader 缓存效率报告
     */
    static getCacheEfficiencyReport(): any[];
    /**
     * 重置统计信息
     */
    static resetStats(): void;
    /**
     * 打印性能报告到控制台
     */
    static printPerformanceReport(): void;
}
/**
 * 创建 DataLoader 性能中间件
 */
export declare function createDataLoaderPerformanceMiddleware(): (req: any, res: any, next: any) => void;
/**
 * 获取 DataLoader 健康状态
 */
export declare function getDataLoaderHealth(context?: DataLoaderContext): {
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
    contextStats: Record<string, any> | null;
};
