// Performance monitoring middleware
const performanceMiddleware = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    
    // Log slow requests (>1000ms)
    if (duration > 1000) {
      console.warn(`🐌 Slow request: ${req.method} ${req.url} - ${duration}ms`);
    }
    
    // Log very slow requests (>3000ms) as errors
    if (duration > 3000) {
      console.error(`🚨 Very slow request: ${req.method} ${req.url} - ${duration}ms`);
    }
    
    // Log performance metrics in development
    if (process.env.NODE_ENV === 'development') {
      const status = res.statusCode >= 400 ? '❌' : '✅';
      console.log(`${status} ${req.method} ${req.url} - ${duration}ms - ${res.statusCode}`);
    }
  });
  
  next();
};

// Memory usage monitoring
const memoryMonitor = () => {
  const used = process.memoryUsage();
  const formatMemory = (bytes) => Math.round(bytes / 1024 / 1024 * 100) / 100;
  
  const memoryInfo = {
    rss: `${formatMemory(used.rss)} MB`,
    heapTotal: `${formatMemory(used.heapTotal)} MB`,
    heapUsed: `${formatMemory(used.heapUsed)} MB`,
    external: `${formatMemory(used.external)} MB`,
  };
  
  // 内存使用警告
  const heapUsedMB = formatMemory(used.heapUsed);
  if (heapUsedMB > 500) {
    console.warn('⚠️  High memory usage detected:', memoryInfo);
  }
  
  return memoryInfo;
};

// CPU 使用率监控
const cpuMonitor = () => {
  const startUsage = process.cpuUsage();
  
  return () => {
    const endUsage = process.cpuUsage(startUsage);
    const userTime = endUsage.user / 1000; // 转换为毫秒
    const systemTime = endUsage.system / 1000;
    
    return {
      user: `${userTime.toFixed(2)}ms`,
      system: `${systemTime.toFixed(2)}ms`,
      total: `${(userTime + systemTime).toFixed(2)}ms`
    };
  };
};

module.exports = {
  performanceMiddleware,
  memoryMonitor,
  cpuMonitor
};
