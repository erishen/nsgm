import { FieldDefinition } from "./cli/utils/prompt";
/**
 * 创建控制器和动作相关的文件
 * @param controller 控制器名称
 * @param action 动作名称
 * @param dictionary 目标目录路径（可选，默认为当前目录）
 * @param fields 字段定义数组（可选）
 */
export declare const createFiles: (controller: string, action: string, dictionary?: string, fields?: FieldDefinition[]) => void;
