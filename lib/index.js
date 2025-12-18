#! /usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startExpress = void 0;
// 加载环境变量
require("dotenv").config({ quiet: true });
// 仅在开发环境中禁用TLS证书验证
if (process.env.NODE_ENV === "development") {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}
const next_1 = __importDefault(require("next"));
const express_1 = __importDefault(require("express"));
const url_1 = require("url");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const body_parser_1 = __importDefault(require("body-parser"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const graphql_1 = __importDefault(require("./server/graphql"));
const config_1 = __importDefault(require("next/config"));
const cors_1 = __importDefault(require("cors"));
const express_session_1 = __importDefault(require("express-session"));
const csrf_1 = require("./server/csrf");
const cli_1 = require("./cli");
const { resolve } = path_1.default;
const curFolder = process.cwd();
const handleServer = (server, prefix, _command) => {
    // 本项目路径是 NSGM-CLI/server 目录，生成项目路径是 generation/server 目录
    const serverPath = resolve(`${curFolder}/server/`);
    if (fs_1.default.existsSync(serverPath)) {
        const list = fs_1.default.readdirSync(serverPath);
        list.forEach((item) => {
            const resolverPath = resolve(`${serverPath}/${item}`);
            const stat = fs_1.default.statSync(resolverPath);
            const isFile = stat.isFile();
            // 只看单个文件，不看目录
            if (isFile) {
                let filename = item;
                if (item.indexOf(".") !== -1) {
                    filename = item.split(".")[0];
                }
                if (server && filename !== undefined && filename !== "") {
                    try {
                        const routeModule = require(resolverPath);
                        // 检查导入的模块是否是有效的Express中间件
                        if (typeof routeModule === "function" ||
                            (routeModule && typeof routeModule === "object" && routeModule.router)) {
                            server.use(`/${filename}`, routeModule);
                            server.use(`${prefix}/${filename}`, routeModule);
                        }
                        else {
                            console.warn(`跳过文件 ${item}: 不是有效的Express路由模块`);
                        }
                    }
                    catch (error) {
                        const errorMessage = error instanceof Error ? error.message : String(error);
                        console.error(`加载路由文件 ${item} 失败:`, errorMessage);
                    }
                }
            }
        });
    }
};
const startExpress = (options, callback, command = "dev") => {
    // console.info('startExpress', curFolder)
    const app = (0, next_1.default)(options);
    const handle = app.getRequestHandler();
    app
        .prepare()
        .then(async () => {
        if (callback) {
            callback();
            return;
        }
        // 初始化数据库连接池
        try {
            const dbPoolManager = require(resolve(`${curFolder}/server/utils/db-pool-manager`));
            await dbPoolManager.initialize();
            console.log("数据库连接池初始化完成");
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            console.error("数据库连接池初始化失败:", errorMessage);
            // 不要因为数据库连接失败就退出，允许应用继续运行
        }
        const server = (0, express_1.default)();
        // 配置 session（CSRF 保护需要）
        server.use((0, express_session_1.default)({
            secret: process.env.SESSION_SECRET || "nsgm-default-secret-key-change-in-production",
            resave: false,
            saveUninitialized: true, // 改为 true，确保 session 被创建
            name: "sessionId", // 明确指定 session cookie 名称
            cookie: {
                secure: false, // 开发环境总是使用 false，生产环境再考虑 HTTPS
                httpOnly: true,
                maxAge: 24 * 60 * 60 * 1000, // 24小时
                sameSite: "lax", // 设置 SameSite 策略
                domain: undefined, // 不设置 domain，使用默认
            },
        }));
        // 初始化 CSRF token - 移除全局初始化，让每个端点自己处理
        // server.use(setupCSRFToken)
        server.use(body_parser_1.default.urlencoded({
            extended: false,
        }));
        // 支持跨域，nsgm export 之后前后分离
        server.use((0, cors_1.default)({
            credentials: true, // 允许发送 cookies
            origin: process.env.ALLOWED_ORIGINS?.split(",") || ["http://localhost:3000"],
        }));
        server.use(body_parser_1.default.json());
        // 添加基本安全中间件
        server.use(csrf_1.securityMiddleware.basicHeaders);
        if (process.env.NODE_ENV === "production") {
            server.use((0, csrf_1.createCSPMiddleware)()); // 内容安全策略
        }
        // 添加 CSRF 保护中间件（在解析 body 之后）
        server.use(csrf_1.csrfProtection);
        server.use((0, express_fileupload_1.default)());
        server.use("/static", express_1.default.static(path_1.default.join(__dirname, "public")));
        server.use("/graphql", (0, graphql_1.default)(command));
        const nextConfig = (0, config_1.default)();
        const { publicRuntimeConfig } = nextConfig;
        const { host, port, prefix } = publicRuntimeConfig;
        // 提供 CSRF token 的端点
        server.get("/csrf-token", csrf_1.getCSRFToken);
        if (prefix !== "") {
            server.get(`${prefix}/csrf-token`, csrf_1.getCSRFToken);
            server.use(`${prefix}/static`, express_1.default.static(path_1.default.join(__dirname, "public")));
            server.use(`${prefix}/graphql`, (0, graphql_1.default)(command));
        }
        handleServer(server, prefix, command);
        server.get("*", (req, res) => {
            const { url } = req;
            const parsedUrl = (0, url_1.parse)(url, true);
            return handle(req, res, parsedUrl);
        });
        server.listen(port, () => {
            console.log(`> Ready on http://${host}:${port}`);
        });
    })
        .catch((ex) => {
        console.error(ex.stack);
        process.exit(1);
    });
};
exports.startExpress = startExpress;
// 使用新的 CLI 架构
(0, cli_1.runCli)().catch((error) => {
    console.error("CLI 执行失败:", error);
    process.exit(1);
});
