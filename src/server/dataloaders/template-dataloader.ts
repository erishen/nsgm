import DataLoader from "dataloader";
import db from "../db";

/**
 * Template DataLoader
 * 针对 template 表的批量数据加载器，解决 N+1 查询问题
 */
export class TemplateDataLoader {
  // 按 ID 批量加载 templates
  public readonly byId: DataLoader<number, any>;

  // 按名称批量加载 templates
  public readonly byName: DataLoader<string, any>;

  // 按名称模糊搜索 templates
  public readonly searchByName: DataLoader<string, any[]>;

  constructor() {
    // 按 ID 批量加载
    this.byId = new DataLoader(
      async (ids: readonly number[]) => {
        try {
          console.log(`🔍 DataLoader: 批量加载 ${ids.length} 个 template by ID`);

          const placeholders = ids.map(() => "?").join(",");
          const sql = `SELECT id, name FROM template WHERE id IN (${placeholders})`;

          const results = await db.executeQuery(sql, [...ids]);

          // 确保返回顺序与输入 keys 一致，未找到的返回 null
          return ids.map((id) => results.find((row: any) => row.id === id) || null);
        } catch (error) {
          console.error("DataLoader byId 批量加载失败:", error);
          throw error;
        }
      },
      {
        cache: true,
        maxBatchSize: 100,
        batchScheduleFn: (callback) => setTimeout(callback, 10), // 10ms 内的请求合并
      }
    );

    // 按名称批量加载
    this.byName = new DataLoader(
      async (names: readonly string[]) => {
        try {
          console.log(`🔍 DataLoader: 批量加载 ${names.length} 个 template by name`);

          const placeholders = names.map(() => "?").join(",");
          const sql = `SELECT id, name FROM template WHERE name IN (${placeholders})`;

          const results = await db.executeQuery(sql, [...names]);

          // 确保返回顺序与输入 keys 一致
          return names.map((name) => results.find((row: any) => row.name === name) || null);
        } catch (error) {
          console.error("DataLoader byName 批量加载失败:", error);
          throw error;
        }
      },
      {
        cache: true,
        maxBatchSize: 50,
        batchScheduleFn: (callback) => setTimeout(callback, 10),
      }
    );

    // 按名称模糊搜索（返回数组）
    this.searchByName = new DataLoader(
      async (searchTerms: readonly string[]) => {
        try {
          console.log(`🔍 DataLoader: 批量搜索 ${searchTerms.length} 个关键词`);

          // 对于搜索，我们需要为每个搜索词执行独立的查询
          const results = await Promise.all(
            searchTerms.map(async (term) => {
              const sql = "SELECT id, name FROM template WHERE name LIKE ?";
              return db.executeQuery(sql, [`%${term}%`]);
            })
          );

          return results;
        } catch (error) {
          console.error("DataLoader searchByName 批量搜索失败:", error);
          throw error;
        }
      },
      {
        cache: true,
        maxBatchSize: 20, // 搜索请求较少，降低批量大小
        batchScheduleFn: (callback) => setTimeout(callback, 20), // 稍长的等待时间
      }
    );
  }

  /**
   * 清除所有缓存
   */
  clearAll(): void {
    this.byId.clearAll();
    this.byName.clearAll();
    this.searchByName.clearAll();
    console.log("🧹 Template DataLoader 缓存已清空");
  }

  /**
   * 清除特定 ID 的缓存
   */
  clearById(id: number): void {
    this.byId.clear(id);
  }

  /**
   * 清除特定名称的缓存
   */
  clearByName(name: string): void {
    this.byName.clear(name);
  }

  /**
   * 预加载数据到缓存
   */
  prime(id: number, data: any): void {
    this.byId.prime(id, data);
    if (data?.name) {
      this.byName.prime(data.name, data);
    }
  }

  /**
   * 获取缓存统计信息
   */
  getStats() {
    return {
      byId: {
        cacheMap: (this.byId as any).cacheMap?.size || 0,
        name: "Template.byId",
      },
      byName: {
        cacheMap: (this.byName as any).cacheMap?.size || 0,
        name: "Template.byName",
      },
      searchByName: {
        cacheMap: (this.searchByName as any).cacheMap?.size || 0,
        name: "Template.searchByName",
      },
    };
  }
}

/**
 * 创建 Template DataLoader 实例
 */
export function createTemplateDataLoader(): TemplateDataLoader {
  return new TemplateDataLoader();
}
