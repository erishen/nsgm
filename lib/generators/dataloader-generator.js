"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataLoaderGenerator = void 0;
const base_generator_1 = require("./base-generator");
/**
 * DataLoader生成器
 * 自动生成对应的 DataLoader 文件
 */
class DataLoaderGenerator extends base_generator_1.BaseGenerator {
    generate() {
        const capitalizedController = this.getCapitalizedController();
        const selectFields = this.fields.map((f) => f.name).join(", ");
        // const searchableFields = this.getSearchableFields(); // 暂时注释掉未使用的变量
        return `import DataLoader from 'dataloader';
import { executeQuery } from '../utils/common';

/**
 * ${capitalizedController} DataLoader
 * 针对 ${this.controller} 表的批量数据加载器，解决 N+1 查询问题
 */
export class ${capitalizedController}DataLoader {
  // 按 ID 批量加载 ${this.controller}
  public readonly byId: DataLoader<number, any>;
  
  // 按名称批量加载 ${this.controller}  
  public readonly byName: DataLoader<string, any>;
  
  // 按名称模糊搜索 ${this.controller}
  public readonly searchByName: DataLoader<string, any[]>;

  constructor() {
    // 按 ID 批量加载
    this.byId = new DataLoader(
      async (ids: readonly number[]) => {
        try {
          console.log(\`🔍 DataLoader: 批量加载 \${ids.length} 个 ${this.controller} by ID\`);
          
          const placeholders = ids.map(() => '?').join(',');
          const sql = \`SELECT ${selectFields} FROM ${this.controller} WHERE id IN (\${placeholders})\`;
          
          const results = await executeQuery(sql, [...ids]);
          
          // 确保返回顺序与输入 keys 一致，未找到的返回 null
          return ids.map(id => 
            results.find((row: any) => row.id === id) || null
          );
        } catch (error) {
          console.error('DataLoader byId 批量加载失败:', error);
          throw error;
        }
      },
      {
        cache: true,
        maxBatchSize: 100,
        batchScheduleFn: callback => setTimeout(callback, 10), // 10ms 内的请求合并
      }
    );

    // 按名称批量加载
    this.byName = new DataLoader(
      async (names: readonly string[]) => {
        try {
          console.log(\`🔍 DataLoader: 批量加载 \${names.length} 个 ${this.controller} by name\`);
          
          const placeholders = names.map(() => '?').join(',');
          const sql = \`SELECT ${selectFields} FROM ${this.controller} WHERE name IN (\${placeholders})\`;
          
          const results = await executeQuery(sql, [...names]);
          
          // 确保返回顺序与输入 keys 一致
          return names.map(name => 
            results.find((row: any) => row.name === name) || null
          );
        } catch (error) {
          console.error('DataLoader byName 批量加载失败:', error);
          throw error;
        }
      },
      {
        cache: true,
        maxBatchSize: 50,
        batchScheduleFn: callback => setTimeout(callback, 10),
      }
    );

    // 按名称模糊搜索（返回数组）
    this.searchByName = new DataLoader(
      async (searchTerms: readonly string[]) => {
        try {
          console.log(\`🔍 DataLoader: 批量搜索 \${searchTerms.length} 个关键词\`);
          
          // 对于搜索，我们需要为每个搜索词执行独立的查询
          const results = await Promise.all(
            searchTerms.map(async (term) => {
              const sql = 'SELECT ${selectFields} FROM ${this.controller} WHERE name LIKE ?';
              return executeQuery(sql, [\`%\${term}%\`]);
            })
          );
          
          return results;
        } catch (error) {
          console.error('DataLoader searchByName 批量搜索失败:', error);
          throw error;
        }
      },
      {
        cache: true,
        maxBatchSize: 20, // 搜索请求较少，降低批量大小
        batchScheduleFn: callback => setTimeout(callback, 20), // 稍长的等待时间
      }
    );

    ${this.generateForeignKeyLoaders()}
  }

  /**
   * 清除所有缓存
   */
  clearAll(): void {
    this.byId.clearAll();
    this.byName.clearAll();
    this.searchByName.clearAll();
    console.log('🧹 ${capitalizedController} DataLoader 缓存已清空');
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
    if (data && data.name) {
      this.byName.prime(data.name, data);
    }
  }

  /**
   * 获取缓存统计信息
   */
  getStats() {
    return {
      byId: {
        cacheMap: this.byId.cacheMap?.size || 0,
        name: '${capitalizedController}.byId'
      },
      byName: {
        cacheMap: this.byName.cacheMap?.size || 0,
        name: '${capitalizedController}.byName'
      },
      searchByName: {
        cacheMap: this.searchByName.cacheMap?.size || 0,
        name: '${capitalizedController}.searchByName'
      }
    };
  }
}

/**
 * 创建 ${capitalizedController} DataLoader 实例
 */
export function create${capitalizedController}DataLoader(): ${capitalizedController}DataLoader {
  return new ${capitalizedController}DataLoader();
}`;
    }
    /**
     * 生成外键 DataLoader
     */
    generateForeignKeyLoaders() {
        const foreignKeys = this.fields.filter((f) => f.name.endsWith("_id") && f.name !== "id");
        if (foreignKeys.length === 0) {
            return "";
        }
        return foreignKeys
            .map((fk) => {
            const relatedTable = fk.name.replace("_id", "");
            const capitalizedRelated = relatedTable.charAt(0).toUpperCase() + relatedTable.slice(1);
            return `
    // 按 ${fk.name} 批量加载相关的 ${this.controller}
    this.by${capitalizedRelated}Id = new DataLoader(
      async (${fk.name}s: readonly number[]) => {
        try {
          console.log(\`🔍 DataLoader: 批量加载 \${${fk.name}s.length} 个 ${this.controller} by ${fk.name}\`);
          
          const placeholders = ${fk.name}s.map(() => '?').join(',');
          const sql = \`SELECT ${this.fields.map((f) => f.name).join(", ")} FROM ${this.controller} WHERE ${fk.name} IN (\${placeholders})\`;
          
          const results = await executeQuery(sql, [...${fk.name}s]);
          
          // 按外键分组
          return ${fk.name}s.map(${fk.name} => 
            results.filter((row: any) => row.${fk.name} === ${fk.name})
          );
        } catch (error) {
          console.error('DataLoader by${capitalizedRelated}Id 批量加载失败:', error);
          throw error;
        }
      },
      {
        cache: true,
        maxBatchSize: 50,
        batchScheduleFn: callback => setTimeout(callback, 10),
      }
    );`;
        })
            .join("\n");
    }
}
exports.DataLoaderGenerator = DataLoaderGenerator;
