TypeScript:
- 严格选项：noUnusedLocals/Parameters、exactOptionalPropertyTypes、noImplicitReturns、noFallthrough
- paths: '@/*' 映射到 client/*；moduleResolution=bundler；源码位置 src/pages/client
- 构建：tsconfig.build.json 设置 CommonJS 输出到 lib，开发阶段不 emit

React/Next:
- pages/_app.tsx 使用 appWithTranslation 包裹；SSR 警告在 next.config.js 中定向抑制
- 组件命名：Page.displayName 用于识别特殊页面；Layout 作为非登录/错误页容器
- 数据获取：采用 getServerSideProps（示例 index.tsx），静态优化建议使用 getStaticProps/SSR 按需

Redux:
- Redux Toolkit configureStore，序列化检查忽略 persist 动作；reducers 聚合在 client/redux

i18n:
- next-i18next，禁用 localeDetection；localePath=public/locales；前端通过 useTranslation/useI18n 与 Antd locale 映射

GraphQL:
- 动态聚合 server/modules 与外部 plugins；生产模式缓存 schema/resolvers；Express handler 使用 graphql-http

Next Webpack & 构建:
- transpilePackages: antd/rc-*；别名 '@' -> client；modules 解析含 client & node_modules
- 非开发阶段：优化 splitChunks，按 vendors/antd/react/common 分组；BundleAnalyzer 可选
- distDir: build；assetPrefix 可配；generateBuildId 使用版本绑定

通用约定:
- 代码格式化：Prettier；Lint：ESLint；测试：Jest
- 环境变量范例：.env.example
