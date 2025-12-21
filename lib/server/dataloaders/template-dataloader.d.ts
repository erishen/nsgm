import DataLoader from "dataloader";
/**
 * Template DataLoader
 * 针对 template 表的批量数据加载器，解决 N+1 查询问题
 */
export declare class TemplateDataLoader {
    readonly byId: DataLoader<number, any>;
    readonly byName: DataLoader<string, any>;
    readonly searchByName: DataLoader<string, any[]>;
    constructor();
    /**
     * 清除所有缓存
     */
    clearAll(): void;
    /**
     * 清除特定 ID 的缓存
     */
    clearById(id: number): void;
    /**
     * 清除特定名称的缓存
     */
    clearByName(name: string): void;
    /**
     * 预加载数据到缓存
     */
    prime(id: number, data: any): void;
    /**
     * 获取缓存统计信息
     */
    getStats(): {
        byId: {
            cacheMap: any;
            name: string;
        };
        byName: {
            cacheMap: any;
            name: string;
        };
        searchByName: {
            cacheMap: any;
            name: string;
        };
    };
}
/**
 * 创建 Template DataLoader 实例
 */
export declare function createTemplateDataLoader(): TemplateDataLoader;
