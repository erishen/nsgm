import { Request, Response, NextFunction } from "express";
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
export declare const csrfProtection: (req: Request, res: Response, next: NextFunction) => unknown;
export declare const getCSRFToken: (req: Request, res: Response) => void;
export declare const securityMiddleware: {
    basicHeaders: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
};
export declare const createCSPMiddleware: () => import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
