FROM node:20-alpine

WORKDIR /app

# 复制package.json和package-lock.json
COPY package*.json ./

# 安装所有依赖（包括开发依赖）
RUN npm ci --legacy-peer-deps

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
CMD ["npm", "start"]