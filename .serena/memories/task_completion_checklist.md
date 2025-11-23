提交前检查清单:
1. Lint/Format：npm run lint:check；必要时 npm run lint 与 npm run format
2. 单测：npm test 或 npm run test:coverage；关键逻辑补充测试
3. 构建验证：npm run tsbuild（CLI 源码）与 npm run build（Next 应用）通过
4. 本地运行：npm run dev 或 npm run start；主要页面与 REST/GraphQL 路由可用
5. i18n：多语言文案是否完善（public/locales）；Antd 语言映射正确
6. 环境变量：涵盖必要配置，参考 .env.example；不要提交敏感信息
7. 依赖健康：npm run check-deps；必要时 update/audit-fix
8. 体积与优化：如需分析，ANALYZE=true npm run build 并审查分包
9. 文档：如有新命令或约定，更新 README/内置页面说明
