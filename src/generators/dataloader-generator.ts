import { BaseGenerator } from "./base-generator";

/**
 * DataLoader生成器
 * 自动生成对应的 DataLoader JavaScript 文件
 */
export class DataLoaderGenerator extends BaseGenerator {
  /**
   * 可能的 JSON 字段名（需要自动解析）
   */
  private jsonFieldNames = [
    "images",
    "photos",
    "gallery",
    "metadata",
    "attributes",
    "specs",
    "options",
    "settings",
    "config",
    "extra",
    "data",
    "json",
    "params",
  ];

  /**
   * 获取可能是 JSON 的字段
   */
  private getJsonFields(): string[] {
    return this.fields
      .filter((f) => this.jsonFieldNames.some((jsonName) => f.name.toLowerCase().includes(jsonName)))
      .map((f) => f.name);
  }

  generate(): string {
    const capitalizedController = this.getCapitalizedController();
    const selectFields = this.fields.map((f) => f.name).join(", ");
    const jsonFields = this.getJsonFields();
    const hasJsonFields = jsonFields.length > 0;

    return `const DataLoader = require('dataloader');
const { executeQuery } = require('../utils/common');

${
  hasJsonFields
    ? `/**
 * 处理 ${this.controller} 行数据，将 JSON 字符串解析为对象
 */
function process${capitalizedController}Row(row) {
  if (!row) return row;
  
${jsonFields
  .map(
    (field) => `  // 处理 ${field} 字段（JSON 字符串转对象）
  if (row.${field} && typeof row.${field} === 'string') {
    try {
      row.${field} = JSON.parse(row.${field});
    } catch (e) {
      row.${field} = ${field === "images" || field === "photos" || field === "gallery" ? "[]" : "{}"};
    }
  }`
  )
  .join(",\n  ")}
  
  return row;
}

`
    : ""
}/**
 * ${capitalizedController} DataLoader
 * 针对 ${this.controller} 表的批量数据加载器，解决 N+1 查询问题
 */
class ${capitalizedController}DataLoader {
  constructor() {
    // 按 ID 批量加载
    this.byId = new DataLoader(
      async (ids) => {
        try {
          console.log(\`🔍 DataLoader: 批量加载 \${ids.length} 个 ${this.controller} by ID\`);
          
          const placeholders = ids.map(() => '?').join(',');
          const sql = \`SELECT ${selectFields} FROM ${this.controller} WHERE id IN (\${placeholders})\`;
          
          const results = await executeQuery(sql, [...ids]);
          
          // 确保返回顺序与输入 keys 一致，未找到的返回 null
          return ids.map(id => ${hasJsonFields ? `process${capitalizedController}Row(results.find((row) => row.id === id) || null)` : `results.find((row) => row.id === id) || null`});
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
      async (names) => {
        try {
          console.log(\`🔍 DataLoader: 批量加载 \${names.length} 个 ${this.controller} by name\`);
          
          const placeholders = names.map(() => '?').join(',');
          const sql = \`SELECT ${selectFields} FROM ${this.controller} WHERE name IN (\${placeholders})\`;
          
          const results = await executeQuery(sql, [...names]);
          
          // 确保返回顺序与输入 keys 一致
          return names.map(name => ${hasJsonFields ? `process${capitalizedController}Row(results.find((row) => row.name === name) || null)` : `results.find((row) => row.name === name) || null`});
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
      async (searchTerms) => {
        try {
          console.log(\`🔍 DataLoader: 批量搜索 \${searchTerms.length} 个关键词\`);
          
          // 对于搜索，我们需要为每个搜索词执行独立的查询
          const results = await Promise.all(
            searchTerms.map(async (term) => {
              const sql = 'SELECT ${selectFields} FROM ${this.controller} WHERE name LIKE ?';
              const rows = await executeQuery(sql, [\`%\${term}%\`]);
              ${hasJsonFields ? `return rows.map(process${capitalizedController}Row);` : "return rows;"}
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

    ${this.generateForeignKeyLoaders(hasJsonFields, capitalizedController)}
  }

  /**
   * 清除所有缓存
   */
  clearAll() {
    this.byId.clearAll();
    this.byName.clearAll();
    this.searchByName.clearAll();
    console.log('🧹 ${capitalizedController} DataLoader 缓存已清空');
  }

  /**
   * 清除特定 ID 的缓存
   */
  clearById(id) {
    this.byId.clear(id);
  }

  /**
   * 清除特定名称的缓存
   */
  clearByName(name) {
    this.byName.clear(name);
  }

  /**
   * 预加载数据到缓存
   */
  prime(id, data) {
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
function create${capitalizedController}DataLoader() {
  return new ${capitalizedController}DataLoader();
}

module.exports = { ${capitalizedController}DataLoader, create${capitalizedController}DataLoader };`;
  }

  /**
   * 生成外键 DataLoader
   */
  private generateForeignKeyLoaders(hasJsonFields: boolean, capitalizedController: string): string {
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
      async (${fk.name}s) => {
        try {
          console.log(\`🔍 DataLoader: 批量加载 \${${fk.name}s.length} 个 ${this.controller} by ${fk.name}\`);
          
          const placeholders = ${fk.name}s.map(() => '?').join(',');
          const sql = \`SELECT ${this.fields.map((f) => f.name).join(", ")} FROM ${this.controller} WHERE ${fk.name} IN (\${placeholders})\`;
          
          const results = await executeQuery(sql, [...${fk.name}s]);
          
          // 按外键分组
          return ${fk.name}s.map(${fk.name} => 
            results
              .filter((row) => row.${fk.name} === ${fk.name})
              ${hasJsonFields ? `.map(process${capitalizedController}Row)` : ""}
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
