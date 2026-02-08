import { Request, Response, NextFunction } from "express";
import lusca from "lusca";

// 扩展 Request 和 Session 类型
declare module "express-session" {
  interface SessionData {
    _csrf?: string;
  }
}

declare module "express-serve-static-core" {
  interface Request {
    csrfToken?: () => string;
  }
}

// Lusca CSRF 配置
const luscaConfig = {
  // CSRF 保护 - 修正配置格式
  csrf: {
    header: "x-csrf-token", // 从 header 中读取 token
    cookie: "_csrf", // cookie 名称
    key: "csrf", // session key
    secret: process.env.CSRF_SECRET || "your-csrf-secret-change-in-production",
  },

  // 内容安全策略
  csp: {
    policy: {
      "default-src": "'self'",
      "script-src": "'self' 'unsafe-inline'",
      "style-src": "'self' 'unsafe-inline'",
      "img-src": "'self' data: https:",
      "font-src": "'self' https:",
      "connect-src": "'self'",
    },
  },

  // 其他安全设置
  xframe: "SAMEORIGIN" as const,
  nosniff: true,
  xssProtection: true,
  referrerPolicy: "same-origin" as const,
};

// 条件性 CSRF 保护中间件
export const csrfProtection = (req: Request, res: Response, next: NextFunction) => {
  // 跳过 GET 请求和某些不需要 CSRF 保护的路径
  if (
    req.method === "GET" ||
    req.path.startsWith("/static") ||
    req.path === "/csrf-token" ||
    req.path.startsWith("/_next") || // Next.js 内部资源
    req.path.startsWith("/__next") // Next.js 开发模式内部端点
  ) {
    return next();
  }

  // 对其他请求应用 Lusca CSRF 保护
  return lusca.csrf(luscaConfig.csrf)(req, res, next);
};

// 获取 CSRF token 的路由处理器
export const getCSRFToken = (req: Request, res: Response) => {
  try {
    // 尝试从 session 中获取已有的 token
    const csrfToken = req.session._csrf || req.session[luscaConfig.csrf.key];

    if (!csrfToken) {
      // 如果没有 token，先生成一个
      lusca.csrf(luscaConfig.csrf)(req, res, () => {
        const newToken = req.session._csrf || req.session[luscaConfig.csrf.key] || (req as any).csrfToken?.();
        res.json({
          csrfToken: newToken,
        });
      });
    } else {
      res.json({
        csrfToken: csrfToken,
      });
    }
  } catch (error) {
    console.error("获取 CSRF token 错误:", error);
    res.status(500).json({
      error: "Failed to generate CSRF token",
      message: "生成 CSRF 令牌失败",
    });
  }
};

// Lusca 安全中间件配置
export const securityMiddleware: { basicHeaders: any } = {
  // 基本的安全头
  basicHeaders: lusca({
    xframe: luscaConfig.xframe,
    nosniff: luscaConfig.nosniff,
    xssProtection: luscaConfig.xssProtection,
    referrerPolicy: luscaConfig.referrerPolicy,
  }),
};

// CSP 中间件
export const createCSPMiddleware = (): any => {
  return lusca.csp(luscaConfig.csp);
};
