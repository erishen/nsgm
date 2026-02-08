// 数据库连接池管理器
const { serverDB } = require('nsgm-cli')

class DatabasePoolManager {
    constructor() {
        this.initialized = false
    }

    // 初始化连接池
    async initialize() {
        if (this.initialized) {
            console.log('数据库连接池已经初始化')
            return
        }

        try {
            // 测试连接池
            await serverDB.executeQuery('SELECT 1 as test')
            this.initialized = true
            console.log('数据库连接池初始化成功')

            // 设置进程退出时的清理函数
            this.setupGracefulShutdown()
        } catch (error) {
            console.error('数据库连接池初始化失败:', error.message)
            throw error
        }
    }

    // 设置优雅关闭
    setupGracefulShutdown() {
        const shutdown = async (signal) => {
            console.log(`接收到 ${signal} 信号，开始关闭数据库连接池...`)
            try {
                await serverDB.closePool()
                console.log('数据库连接池关闭成功')
                process.exit(0)
            } catch (error) {
                console.error('关闭数据库连接池失败:', error.message)
                process.exit(1)
            }
        }

        // 监听进程退出信号
        process.on('SIGTERM', () => shutdown('SIGTERM'))
        process.on('SIGINT', () => shutdown('SIGINT'))
        process.on('SIGQUIT', () => shutdown('SIGQUIT'))
    }

    // 检查连接池状态
    async healthCheck() {
        try {
            const result = await serverDB.executeQuery('SELECT 1 as health_check')
            return { status: 'healthy', result }
        } catch (error) {
            return { status: 'unhealthy', error: error.message }
        }
    }
}

// 导出单例实例
const dbPoolManager = new DatabasePoolManager()

module.exports = dbPoolManager
