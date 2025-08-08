import { ProjectConfig } from './cli/types/project';
import { FieldDefinition } from './cli/utils/prompt';
/**
 * 初始化项目文件和目录结构
 * @param dictionary 目标目录名称，空字符串表示当前目录
 * @param upgradeFlag 是否为升级模式，升级模式下不会安装依赖
 * @param projectConfig 项目配置信息（可选）
 */
export declare const initFiles: (dictionary: string, upgradeFlag?: boolean, projectConfig?: ProjectConfig) => void;
/**
 * 创建控制器相关文件
 * @param controller 控制器名称
 * @param action 动作名称
 * @param dictionary 目标目录名称，空字符串表示当前目录
 * @param fields 字段定义数组
 */
export declare const createFiles: (controller: string, action: string, dictionary?: string, fields?: FieldDefinition[]) => void;
/**
 * 删除控制器相关文件
 * @param controller 控制器名称
 * @param action 动作名称
 * @param deleteDBFlag 是否删除数据库相关文件
 * @param dictionary 目标目录名称，空字符串表示当前目录
 */
export declare const deleteFiles: (controller: string, action: string, deleteDBFlag?: boolean, dictionary?: string) => void;
