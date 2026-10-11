FROM node:20-alpine

WORKDIR /app

# 复制 package.json 和 pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# 引导 pnpm 并安装依赖（含开发依赖）
RUN npm i -g pnpm@9.15.9
RUN pnpm install --frozen-lockfile

# 复制项目文件
COPY . .

# 构建项目
RUN pnpm run tsbuild
RUN pnpm run build

# 暴露端口
EXPOSE 8080

# 设置环境变量
ENV NODE_ENV=production

# 启动应用
CMD ["pnpm", "start"]
