import mysql from 'mysql2';
declare const _default: {
    getMysqlConfig: () => null;
    getConnection: () => Promise<unknown>;
    getPool: () => mysql.Pool;
    executeQuery: (sql: string, values?: any[]) => Promise<any>;
    executePaginatedQuery: (sql: string, countSql: string, values: any[], countValues?: any[]) => Promise<any>;
    closePool: () => Promise<void>;
};
export default _default;
