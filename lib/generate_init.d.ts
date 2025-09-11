interface InitResult {
    [key: string]: string;
}
/**
 * 初始化客户端文件
 * @param dictionary 目标目录名称
 * @param newDestFolder 新的目标文件夹路径
 * @param upgradeFlag 是否为升级模式
 */
export declare const initClientFiles: (dictionary: string, newDestFolder: string, upgradeFlag: boolean) => InitResult;
/**
 * 初始化页面文件
 * @param dictionary 目标目录名称
 * @param newDestFolder 新的目标文件夹路径
 * @param upgradeFlag 是否为升级模式
 */
export declare const initPagesFiles: (dictionary: string, newDestFolder: string, upgradeFlag: boolean) => void;
/**
 * 初始化服务器文件
 * @param dictionary 目标目录名称
 * @param newDestFolder 新的目标文件夹路径
 * @param upgradeFlag 是否为升级模式
 */
export declare const initServerFiles: (dictionary: string, newDestFolder: string, upgradeFlag: boolean) => InitResult;
/**
 * 初始化公共文件
 * @param dictionary 目标目录名称
 * @param newDestFolder 新的目标文件夹路径
 * @param upgradeFlag 是否为升级模式
 */
export declare const initPublicFiles: (dictionary: string, newDestFolder: string, upgradeFlag: boolean) => InitResult;
/**
 * 初始化脚本文件
 * @param dictionary 目标目录名称
 * @param newDestFolder 新的目标文件夹路径
 */
export declare const initScriptsFiles: (dictionary: string, newDestFolder: string) => void;
/**
 * 初始化根目录文件
 * @param dictionary 目标目录名称
 * @param newDestFolder 新的目标文件夹路径
 */
export declare const initRootFiles: (dictionary: string, newDestFolder: string) => InitResult;
/**
 * 初始化类型定义文件
 * @param dictionary 目标目录名称
 * @param newDestFolder 新的目标文件夹路径
 */
export declare const initTypesFiles: (dictionary: string, newDestFolder: string) => void;
/**
 * 初始化测试文件和目录
 * @param dictionary 目标目录名称
 * @param newDestFolder 新的目标文件夹路径
 */
export declare const initTestFiles: (dictionary: string, newDestFolder: string) => void;
export {};
