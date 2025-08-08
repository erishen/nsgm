/**
 * 删除控制器相关的文件
 * @param controller 控制器名称
 * @param action 动作名称，传入 'all' 删除整个控制器
 * @param deleteDBFlag 是否删除数据库表
 * @param dictionary 目标目录路径（可选，默认为当前目录）
 */
export declare const deleteFiles: (controller: string, action: string, deleteDBFlag?: boolean, dictionary?: string) => void;
