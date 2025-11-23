Purpose: 提供 nsgm-cli 工具与示例工程（generation）以快速启动 Next.js + styled-components + GraphQL + MySQL 的全栈项目，集成 Redux、i18n、REST/GraphQL 服务。

Tech Stack:
- Frontend: Next.js 15, React 18, styled-components 6, Ant Design 5, Redux Toolkit, next-i18next
- Backend: Express REST (server/rest.js), GraphQL via graphql-http +动态 schema/resolvers, MySQL2
- Lang/Build: TypeScript 5, ESLint 9, Prettier 3, Jest 30
- CLI: 自研 nsgm-cli（lib/index.js），通过 scripts 调度 dev/build/start/export 等

Structure (top-level highlights):
- pages/ 与 client/：Next 页面与 UI/Redux/i18n 工具、Layout、组件
- server/：REST 路由与 APIs，SQL，模板模块
- src/server/*：GraphQL 构建与插件，TypeScript 源码（编译到 lib）
- lib/*：编译后 CLI 与服务工具
- generation/*：示例工程，依赖 nsgm-cli 运行
- public/locales/*：i18n 资源（zh-CN/en-US/ja-JP）
- next.config.js：构建/分包优化、别名、i18n、buildId、assetPrefix 等
- tsconfig.json：严格 TS 选项，paths @ -> client

Entrypoints:
- Next 应用入口: pages/_app.tsx（appWithTranslation，Redux 注入，SSO 检查）
- REST: server/rest.js（/template, /sso）
- GraphQL: src/server/graphql.ts 导出 express handler（动态聚合 schema/resolvers）

i18n: next-i18next.config.js + public/locales；页面侧支持 serverSideTranslations。

Build/Dist: 非开发阶段 distDir=build，assetPrefix 支持前缀部署。
