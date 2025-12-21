"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataLoaderMonitor = void 0;
exports.createDataLoaderPerformanceMiddleware = createDataLoaderPerformanceMiddleware;
exports.getDataLoaderHealth = getDataLoaderHealth;
const dataloaders_1 = require("../dataloaders");
/**
 * DataLoader 性能监控和调试工具
 */
class DataLoaderMonitor {
    /**
     * 记录 DataLoader 请求统计
     */
    static recordRequest(loaderName, isBatch, batchSize) {
        const stats = this.requestStats.get(loaderName) || {
            totalRequests: 0,
            batchRequests: 0,
            cacheHits: 0,
            cacheMisses: 0,
            averageBatchSize: 0,
            lastActivity: new Date(),
        };
        stats.totalRequests++;
        if (isBatch) {
            stats.batchRequests++;
            if (batchSize) {
                stats.averageBatchSize = (stats.averageBatchSize + batchSize) / 2;
            }
        }
        stats.lastActivity = new Date();
        this.requestStats.set(loaderName, stats);
    }
    /**
     * 记录缓存命中/未命中
     */
    static recordCacheResult(loaderName, isHit) {
        const stats = this.requestStats.get(loaderName);
        if (stats) {
            if (isHit) {
                stats.cacheHits++;
            }
            else {
                stats.cacheMisses++;
            }
            this.requestStats.set(loaderName, stats);
        }
    }
    /**
     * 获取所有 DataLoader 统计信息
     */
    static getAllStats() {
        const stats = Object.fromEntries(this.requestStats);
        return {
            summary: {
                totalLoaders: this.requestStats.size,
                totalRequests: Array.from(this.requestStats.values()).reduce((sum, stat) => sum + stat.totalRequests, 0),
                totalBatchRequests: Array.from(this.requestStats.values()).reduce((sum, stat) => sum + stat.batchRequests, 0),
                totalCacheHits: Array.from(this.requestStats.values()).reduce((sum, stat) => sum + stat.cacheHits, 0),
                totalCacheMisses: Array.from(this.requestStats.values()).reduce((sum, stat) => sum + stat.cacheMisses, 0),
            },
            loaders: stats,
            generatedAt: new Date().toISOString(),
        };
    }
    /**
     * 获取 DataLoader 缓存效率报告
     */
    static getCacheEfficiencyReport() {
        const report = [];
        this.requestStats.forEach((stats, loaderName) => {
            const totalCacheRequests = stats.cacheHits + stats.cacheMisses;
            const hitRate = totalCacheRequests > 0 ? (stats.cacheHits / totalCacheRequests * 100) : 0;
            const batchEfficiency = stats.totalRequests > 0 ? (stats.batchRequests / stats.totalRequests * 100) : 0;
            report.push({
                loader: loaderName,
                hitRate: `${hitRate.toFixed(2)}%`,
                batchEfficiency: `${batchEfficiency.toFixed(2)}%`,
                averageBatchSize: stats.averageBatchSize.toFixed(2),
                totalRequests: stats.totalRequests,
                lastActivity: stats.lastActivity.toISOString(),
            });
        });
        return report.sort((a, b) => b.totalRequests - a.totalRequests);
    }
    /**
     * 重置统计信息
     */
    static resetStats() {
        this.requestStats.clear();
        console.log('📊 DataLoader 统计信息已重置');
    }
    /**
     * 打印性能报告到控制台
     */
    static printPerformanceReport() {
        const stats = this.getAllStats();
        const efficiency = this.getCacheEfficiencyReport();
        console.log('\n📊 DataLoader 性能报告');
        console.log('========================');
        console.log(`总加载器数量: ${stats.summary.totalLoaders}`);
        console.log(`总请求数: ${stats.summary.totalRequests}`);
        console.log(`批量请求数: ${stats.summary.totalBatchRequests}`);
        console.log(`缓存命中数: ${stats.summary.totalCacheHits}`);
        console.log(`缓存未命中数: ${stats.summary.totalCacheMisses}`);
        if (stats.summary.totalCacheHits + stats.summary.totalCacheMisses > 0) {
            const overallHitRate = (stats.summary.totalCacheHits / (stats.summary.totalCacheHits + stats.summary.totalCacheMisses) * 100).toFixed(2);
            console.log(`总体缓存命中率: ${overallHitRate}%`);
        }
        console.log('\n各加载器效率:');
        efficiency.forEach(loader => {
            console.log(`  ${loader.loader}:`);
            console.log(`    缓存命中率: ${loader.hitRate}`);
            console.log(`    批量效率: ${loader.batchEfficiency}`);
            console.log(`    平均批量大小: ${loader.averageBatchSize}`);
            console.log(`    总请求数: ${loader.totalRequests}`);
        });
        console.log('========================\n');
    }
}
exports.DataLoaderMonitor = DataLoaderMonitor;
DataLoaderMonitor.requestStats = new Map();
/**
 * 创建 DataLoader 性能中间件
 */
function createDataLoaderPerformanceMiddleware() {
    return (req, res, next) => {
        const startTime = Date.now();
        // 在响应结束时记录性能数据
        res.on('finish', () => {
            const duration = Date.now() - startTime;
            if (req.body?.query) {
                const isQuery = req.body.query.trim().toLowerCase().startsWith('query');
                const isMutation = req.body.query.trim().toLowerCase().startsWith('mutation');
                if (isQuery || isMutation) {
                    console.log(`🚀 GraphQL ${isQuery ? 'Query' : 'Mutation'} 执行时间: ${duration}ms`);
                    // 每10个请求打印一次性能报告
                    if (Math.random() < 0.1) {
                        DataLoaderMonitor.printPerformanceReport();
                    }
                }
            }
        });
        next();
    };
}
/**
 * 获取 DataLoader 健康状态
 */
function getDataLoaderHealth(context) {
    const stats = DataLoaderMonitor.getAllStats();
    const efficiency = DataLoaderMonitor.getCacheEfficiencyReport();
    // 计算健康分数
    let healthScore = 100;
    efficiency.forEach(loader => {
        const hitRate = parseFloat(loader.hitRate);
        const batchEfficiency = parseFloat(loader.batchEfficiency);
        // 缓存命中率低于50%扣分
        if (hitRate < 50) {
            healthScore -= 10;
        }
        // 批量效率低于30%扣分
        if (batchEfficiency < 30) {
            healthScore -= 15;
        }
    });
    const status = healthScore >= 80 ? 'healthy' : healthScore >= 60 ? 'warning' : 'critical';
    return {
        status,
        score: Math.max(0, healthScore),
        summary: stats.summary,
        loaders: efficiency,
        recommendations: generateRecommendations(efficiency),
        contextStats: context ? (0, dataloaders_1.getDataLoaderStats)(context) : null,
    };
}
/**
 * 生成性能优化建议
 */
function generateRecommendations(efficiency) {
    const recommendations = [];
    efficiency.forEach(loader => {
        const hitRate = parseFloat(loader.hitRate);
        const batchEfficiency = parseFloat(loader.batchEfficiency);
        if (hitRate < 50) {
            recommendations.push(`${loader.loader}: 考虑增加缓存时间或优化查询模式以提高缓存命中率`);
        }
        if (batchEfficiency < 30) {
            recommendations.push(`${loader.loader}: 考虑调整 batchScheduleFn 延迟时间以提高批量效率`);
        }
        if (parseFloat(loader.averageBatchSize) < 2) {
            recommendations.push(`${loader.loader}: 批量大小较小，可能需要优化查询时机`);
        }
    });
    if (recommendations.length === 0) {
        recommendations.push('DataLoader 性能表现良好，无需优化');
    }
    return recommendations;
}
