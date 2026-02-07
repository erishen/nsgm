/**
 * 日期格式化工具
 * 将 MySQL TIMESTAMP 格式转换为前端可解析的 ISO 8601 格式
 */

// 格式化单个日期
const formatDate = (date) => {
    if (!date) return null;
    if (date instanceof Date) {
        return date.toISOString();
    }
    if (typeof date === 'string') {
        // 如果已经是 ISO 格式，直接返回
        if (date.includes('T') || date.endsWith('Z')) {
            return date;
        }
        
        // 规范化日期字符串：将斜杠格式转换为横杠格式
        let normalizedDate = date;
        // 匹配 "2024/2/5 10:00:00" 或 "2024/02/05 10:00:00"
        const slashDateRegex = /^(\d{4})\/(\d{1,2})\/(\d{1,2})(?:\s+(\d{1,2}):(\d{1,2}):(\d{1,2}))?$/;
        const match = normalizedDate.match(slashDateRegex);
        if (match) {
            // 将斜杠格式转换为横杠格式，并确保月份和日期是两位数
            const year = match[1];
            const month = match[2].padStart(2, '0');
            const day = match[3].padStart(2, '0');
            if (match[4]) {
                // 有时间部分
                const hours = match[4].padStart(2, '0');
                const minutes = match[5].padStart(2, '0');
                const seconds = match[6].padStart(2, '0');
                normalizedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
            } else {
                normalizedDate = `${year}-${month}-${day}`;
            }
        }
        
        // 处理 MySQL 格式: '2024-02-07 10:00:00' 或 '2024-02-07 10:00:00.000'
        // 尝试解析为 Date 对象
        const parsed = new Date(normalizedDate);
        if (!isNaN(parsed.getTime())) {
            return parsed.toISOString();
        }
        // 如果解析失败，尝试手动转换
        // 替换空格为 T，如果有点毫秒则替换为 Z，否则添加 Z
        if (normalizedDate.includes('.')) {
            return normalizedDate.replace(' ', 'T').replace(/\.\d{3}$/, 'Z');
        } else {
            return normalizedDate.replace(' ', 'T') + 'Z';
        }
    }
    return date;
};

// 格式化结果中的时间字段
const formatResultDates = (result) => {
    if (!result) return result;
    
    if (Array.isArray(result)) {
        return result.map(item => formatResultDates(item));
    }
    
    if (typeof result === 'object' && result !== null) {
        const newResult = { ...result };
        
        // 常见时间字段
        const dateFields = [
            'create_date', 'update_date', 'pay_time', 'ship_time', 
            'callback_time', 'create_time', 'update_time'
        ];
        
        dateFields.forEach(field => {
            if (newResult[field] !== undefined) {
                newResult[field] = formatDate(newResult[field]);
            }
        });
        
        return newResult;
    }
    
    return result;
};

// 包装 executePaginatedQuery，自动格式化时间
const wrapPaginatedResult = async (executePaginatedQuery, sql, countSql, values) => {
    const result = await executePaginatedQuery(sql, countSql, values);
    
    if (result && result.items) {
        result.items = formatResultDates(result.items);
    }
    
    return result;
};

module.exports = {
    formatDate,
    formatResultDates,
    wrapPaginatedResult
};