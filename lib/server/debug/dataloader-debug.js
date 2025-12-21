"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dataLoaderDebugSchema = exports.dataLoaderStatsResolver = void 0;
exports.createDataLoaderDebugRoutes = createDataLoaderDebugRoutes;
const dataloader_monitor_1 = require("../utils/dataloader-monitor");
/**
 * DataLoader 调试和监控 API
 * 在开发环境中提供 DataLoader 性能监控接口
 */
/**
 * 获取 DataLoader 统计信息的 GraphQL resolver
 */
exports.dataLoaderStatsResolver = {
    // 查询 DataLoader 统计信息
    dataLoaderStats: async (_, context) => {
        try {
            const health = (0, dataloader_monitor_1.getDataLoaderHealth)(context);
            const allStats = dataloader_monitor_1.DataLoaderMonitor.getAllStats();
            return {
                status: health.status,
                score: health.score,
                summary: allStats.summary,
                loaders: health.loaders,
                recommendations: health.recommendations,
                contextStats: health.contextStats,
                timestamp: new Date().toISOString(),
            };
        }
        catch (error) {
            console.error("获取 DataLoader 统计信息失败:", error);
            throw error;
        }
    },
    // 重置 DataLoader 统计信息
    resetDataLoaderStats: async () => {
        try {
            dataloader_monitor_1.DataLoaderMonitor.resetStats();
            return {
                success: true,
                message: "DataLoader 统计信息已重置",
                timestamp: new Date().toISOString(),
            };
        }
        catch (error) {
            console.error("重置 DataLoader 统计信息失败:", error);
            throw error;
        }
    },
    // 清除 DataLoader 缓存
    clearDataLoaderCache: async (_, context) => {
        try {
            if (context?.dataloaders?.template) {
                context.dataloaders.template.clearAll();
            }
            return {
                success: true,
                message: "DataLoader 缓存已清除",
                timestamp: new Date().toISOString(),
            };
        }
        catch (error) {
            console.error("清除 DataLoader 缓存失败:", error);
            throw error;
        }
    },
};
/**
 * DataLoader 调试 Schema
 */
exports.dataLoaderDebugSchema = {
    query: `
    dataLoaderStats: DataLoaderStatsResult
  `,
    mutation: `
    resetDataLoaderStats: DataLoaderActionResult
    clearDataLoaderCache: DataLoaderActionResult
  `,
    type: `
    type DataLoaderStatsResult {
      status: String
      score: Int
      summary: DataLoaderSummary
      loaders: [DataLoaderEfficiency]
      recommendations: [String]
      contextStats: DataLoaderContextStats
      timestamp: String
    }
    
    type DataLoaderSummary {
      totalLoaders: Int
      totalRequests: Int
      totalBatchRequests: Int
      totalCacheHits: Int
      totalCacheMisses: Int
    }
    
    type DataLoaderEfficiency {
      loader: String
      hitRate: String
      batchEfficiency: String
      averageBatchSize: String
      totalRequests: Int
      lastActivity: String
    }
    
    type DataLoaderContextStats {
      template: DataLoaderCacheInfo
      timestamp: String
    }
    
    type DataLoaderCacheInfo {
      byId: DataLoaderCacheDetail
      byName: DataLoaderCacheDetail
      searchByName: DataLoaderCacheDetail
    }
    
    type DataLoaderCacheDetail {
      cacheMap: Int
      name: String
    }
    
    type DataLoaderActionResult {
      success: Boolean
      message: String
      timestamp: String
    }
  `,
};
/**
 * Express 路由：DataLoader 调试接口
 */
function createDataLoaderDebugRoutes(app) {
    // 仅在开发环境中启用调试接口
    if (process.env.NODE_ENV === "development") {
        // 获取 DataLoader 统计信息
        app.get("/debug/dataloader/stats", (_req, res) => {
            try {
                const health = (0, dataloader_monitor_1.getDataLoaderHealth)();
                const allStats = dataloader_monitor_1.DataLoaderMonitor.getAllStats();
                res.json({
                    health,
                    stats: allStats,
                    timestamp: new Date().toISOString(),
                });
            }
            catch (error) {
                res.status(500).json({
                    error: "Failed to get DataLoader stats",
                    message: error instanceof Error ? error.message : String(error),
                });
            }
        });
        // 重置统计信息
        app.post("/debug/dataloader/reset", (_req, res) => {
            try {
                dataloader_monitor_1.DataLoaderMonitor.resetStats();
                res.json({
                    success: true,
                    message: "DataLoader stats reset successfully",
                    timestamp: new Date().toISOString(),
                });
            }
            catch (error) {
                res.status(500).json({
                    error: "Failed to reset DataLoader stats",
                    message: error instanceof Error ? error.message : String(error),
                });
            }
        });
        // 打印性能报告
        app.post("/debug/dataloader/report", (_req, res) => {
            try {
                dataloader_monitor_1.DataLoaderMonitor.printPerformanceReport();
                res.json({
                    success: true,
                    message: "Performance report printed to console",
                    timestamp: new Date().toISOString(),
                });
            }
            catch (error) {
                res.status(500).json({
                    error: "Failed to print performance report",
                    message: error instanceof Error ? error.message : String(error),
                });
            }
        });
        console.log("🔧 DataLoader 调试接口已启用:");
        console.log("  GET  /debug/dataloader/stats  - 获取统计信息");
        console.log("  POST /debug/dataloader/reset  - 重置统计信息");
        console.log("  POST /debug/dataloader/report - 打印性能报告");
    }
}
