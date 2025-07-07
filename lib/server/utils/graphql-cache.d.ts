export declare const graphqlCacheMiddleware: (req: any, res: any, next: any) => any;
export declare const clearGraphQLCache: () => void;
export declare const getCacheStats: () => {
    size: number;
    entries: {
        query: string;
        age: number;
    }[];
};
