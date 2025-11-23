项目根（nsgm-cli 开发）:
- 开发运行：npm run dev  （等同 tsbuild 后执行 nsgm dev）
- 构建：npm run build
- 启动：npm run start
- 静态导出：npm run export
- 初始化：npm run init
- 升级：npm run upgrade
- 模板生成/删除：npm run create / npm run delete / npm run deletedb
- 清理：npm run clean
- Lint 修复：npm run lint
- Lint 检查：npm run lint:check
- 格式化：npm run format
- 测试：npm test / npm run test:coverage / npm run test:watch
- 依赖检查：npm run check-deps / npm run update-deps / npm run audit-fix
- 性能检查：npm run performance

示例工程（generation/）:
- 开发：cd generation && npm run dev
- 构建/启动/导出：npm run build / start / export
- 模板操作：npm run create / delete / deletedb

macOS 常用工具（Darwin）:
- 目录/文件：ls, cd, pwd, mkdir, rm -rf, cp, mv
- 查找/搜索：find, grep -R, sed, awk
- 版本控制：git status/add/commit/push/pull/checkout/tag
- 端口/进程：lsof -i :3000, ps aux | grep node, kill -9 PID
