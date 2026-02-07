import fs from "fs";
import { join } from "path";
import { createTemplateDataLoader } from "./template-dataloader";

/**
 * DataLoader 上下文接口
 */
export interface DataLoaderContext extends Record<string, unknown> {
  dataloaders: Record<string, any>;
}

/**
 * 加载项目中的自定义 DataLoader
 * 只加载编译后的 JavaScript 文件 (*.js)
 */
function loadProjectDataLoaders(): Record<string, any> {
  const projectDataLoadersPath = join(process.cwd(), "server", "dataloaders");
  const dataLoaders: Record<string, any> = {};

  if (!fs.existsSync(projectDataLoadersPath)) {
    return dataLoaders;
  }

  try {
    const files = fs.readdirSync(projectDataLoadersPath);
    let loadedCount = 0;

    files.forEach((file) => {
      // 只加载 JavaScript dataloader 文件：*-dataloader.js
      const match = file.match(/^([a-z_-]+)-dataloader\.js$/i);
      if (match) {
        const moduleName = match[1]; // 提取模块名，如 'product'
        const filePath = join(projectDataLoadersPath, file);

        try {
          // 清除 require 缓存，确保每次都能重新加载
          delete require.cache[require.resolve(filePath)];

          // 加载 JavaScript DataLoader 文件
          const loaderModule = require(filePath);

          // 获取 DataLoader 类的构造函数或工厂函数
          const DataLoaderClass = loaderModule.default || loaderModule;
          if (typeof DataLoaderClass === "function") {
            const instance = new DataLoaderClass();
            dataLoaders[moduleName] = instance;
            loadedCount++;
          } else {
            // 尝试工厂函数
            const factoryName = `create${moduleName.charAt(0).toUpperCase() + moduleName.slice(1)}DataLoader`;
            const createFunc = loaderModule[factoryName] || loaderModule.createProductDataLoader;
            if (typeof createFunc === "function") {
              dataLoaders[moduleName] = createFunc();
              loadedCount++;
            }
          }
        } catch (error: any) {
          console.warn(`⚠️  加载 DataLoader 失败: ${file}`, error.message);
        }
      }
    });

    if (loadedCount > 0) {
      console.log(`📦 共加载 ${loadedCount} 个自定义 DataLoader: ${Object.keys(dataLoaders).join(", ")}`);
    }

    return dataLoaders;
  } catch (error) {
    console.warn("⚠️  加载项目 DataLoader 时出错:", error);
    return dataLoaders;
  }
}

/**
 * 创建 DataLoader 上下文
 * 每个 GraphQL 请求都会创建新的 DataLoader 实例，确保请求隔离
 */
export function createDataLoaderContext(): DataLoaderContext {
  const projectDataLoaders = loadProjectDataLoaders();

  return {
    dataloaders: {
      ...projectDataLoaders,
      template: createTemplateDataLoader(),
    },
  };
}

/**
 * DataLoader 统计信息
 */
export function getDataLoaderStats(context: DataLoaderContext) {
  const stats: Record<string, any> = {
    timestamp: new Date().toISOString(),
  };

  if (context.dataloaders) {
    Object.keys(context.dataloaders).forEach((key) => {
      const loader = context.dataloaders[key];
      if (loader && typeof loader.getStats === "function") {
        stats[key] = loader.getStats();
      } else {
        stats[key] = { name: key, status: "no stats" };
      }
    });
  }

  return stats;
}

/**
 * 清除所有 DataLoader 缓存
 */
export function clearAllDataLoaderCache(context: DataLoaderContext): void {
  if (context.dataloaders) {
    Object.keys(context.dataloaders).forEach((key) => {
      const loader = context.dataloaders[key];
      if (loader && typeof loader.clearAll === "function") {
        loader.clearAll();
      }
    });
  }

  console.log("🧹 所有 DataLoader 缓存已清空");
}
