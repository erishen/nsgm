// GraphQL 查询缓存中间件
const queryCache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5分钟

interface CacheEntry {
  data: any;
  timestamp: number;
}

export const graphqlCacheMiddleware = (req: any, res: any, next: any) => {
  const { query, variables } = req.body || {};

  // 只缓存查询操作，不缓存变更操作
  if (!query || query.trim().startsWith("mutation")) {
    return next();
  }

  const cacheKey = JSON.stringify({ query, variables });
  const now = Date.now();

  // 检查缓存
  const cached = queryCache.get(cacheKey) as CacheEntry;
  if (cached && now - cached.timestamp < CACHE_TTL) {
    console.log("🚀 GraphQL cache hit for:", `${query.substring(0, 50)}...`);
    return res.json(cached.data);
  }

  // 拦截响应以存储缓存
  const originalSend = res.send;
  res.send = function (body: any) {
    try {
      const data = typeof body === "string" ? JSON.parse(body) : body;

      // 只缓存成功的查询结果
      if (!data.errors) {
        queryCache.set(cacheKey, {
          data,
          timestamp: now,
        });

        // 清理过期缓存
        cleanExpiredCache();
      }
    } catch (error) {
      console.warn("⚠️  GraphQL cache error:", error);
    }

    originalSend.call(this, body);
  };

  next();
};

// 清理过期缓存
function cleanExpiredCache() {
  const now = Date.now();
  for (const [key, entry] of queryCache.entries()) {
    if (now - (entry as CacheEntry).timestamp > CACHE_TTL) {
      queryCache.delete(key);
    }
  }
}

// 清空缓存的函数
export const clearGraphQLCache = () => {
  queryCache.clear();
  console.log("🧹 GraphQL cache cleared");
};

// 获取缓存统计
export const getCacheStats = () => {
  return {
    size: queryCache.size,
    entries: Array.from(queryCache.keys()).map((key) => ({
      query: `${key.substring(0, 100)}...`,
      age: Date.now() - (queryCache.get(key) as CacheEntry).timestamp,
    })),
  };
};
