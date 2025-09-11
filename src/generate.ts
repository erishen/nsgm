import path from 'path'
import shell from 'shelljs'
import { mkdirSync } from './utils'
import { destFolder, isLocal } from './constants'
import { applyProjectConfig } from './utils/project-config'
import { ProjectConfig } from './cli/types/project'
import { FieldDefinition } from './cli/utils/prompt'
import {
  initClientFiles,
  initPagesFiles,
  initServerFiles,
  initPublicFiles,
  initScriptsFiles,
  initRootFiles,
  initTestFiles,
  initTypesFiles,
} from './generate_init'
import { createFiles as generateCreateFiles } from './generate_create'
import { deleteFiles as generateDeleteFiles } from './generate_delete'

// 常量提取
const NPM_INSTALL_FLAGS = '--legacy-peer-deps'

// 类型定义
type DirectoryInput = string | undefined | null

// 辅助函数
const normalizeDirectory = (dictionary: DirectoryInput): string => {
  // 禁止绝对路径，强制所有生成目录都在 cwd 下
  if (!dictionary || dictionary === '/' || dictionary.trim() === '') {
    return '.'
  }
  return dictionary.trim()
}

const installNpmPackages = (targetDir?: string): boolean => {
  try {
    const prefix = targetDir ? `cd ${targetDir} && ` : ''

    console.log('Installing all dependencies from package.json...')
    const installResult = shell.exec(`${prefix}npm install ${NPM_INSTALL_FLAGS}`)

    return installResult.code === 0
  } catch (error) {
    console.error('Failed to install npm packages:', error)
    return false
  }
}

const updateProjectFiles = (
  projectName: string,
  destPackagePath: string,
  destPublicHealthCheckPath: string,
  skipPackageUpdate = false
): boolean => {
  try {
    const cleanProjectName = path.basename(projectName)
    if (!skipPackageUpdate) {
      console.log(`Updating project name to: ${cleanProjectName}`)
      shell.sed('-i', /nsgm-cli-project/g, `${cleanProjectName}-project`, destPackagePath)
    }
    shell.sed('-i', /NSGM-CLI/g, cleanProjectName, destPublicHealthCheckPath)
    return true
  } catch (error) {
    console.error('Failed to update project files:', error)
    return false
  }
}

/**
 * 初始化项目文件和目录结构
 * @param dictionary 目标目录名称，空字符串表示当前目录
 * @param upgradeFlag 是否为升级模式，升级模式下不会安装依赖
 * @param projectConfig 项目配置信息（可选）
 */
export const initFiles = (dictionary: string, upgradeFlag = false, projectConfig?: ProjectConfig) => {
  if (isLocal) {
    upgradeFlag = false
  }

  const normalizedDictionary = normalizeDirectory(dictionary)

  let newDestFolder = destFolder
  if (normalizedDictionary !== '.') {
    newDestFolder = path.join(destFolder, normalizedDictionary)
    mkdirSync(newDestFolder)
  }

  console.log('initFiles', normalizedDictionary === '.' ? '.' : normalizedDictionary, upgradeFlag)

  initClientFiles(normalizedDictionary, newDestFolder, upgradeFlag)
  initPagesFiles(normalizedDictionary, newDestFolder, upgradeFlag)
  initServerFiles(normalizedDictionary, newDestFolder, upgradeFlag)

  const { destPublicHealthCheckPath } = initPublicFiles(normalizedDictionary, newDestFolder, upgradeFlag)

  initScriptsFiles(normalizedDictionary, newDestFolder)

  const { destPackagePath } = initRootFiles(normalizedDictionary, newDestFolder)

  initTestFiles(normalizedDictionary, newDestFolder)

  initTypesFiles(normalizedDictionary, newDestFolder)

  // 如果提供了项目配置，应用到生成的文件中
  if (projectConfig) {
    console.log('应用项目配置...')
    applyProjectConfig(newDestFolder, projectConfig)
  }

  const installFlag = !upgradeFlag && (!isLocal || dictionary.indexOf('..') !== -1)

  if (installFlag) {
    const projectName = normalizedDictionary !== '.' ? normalizedDictionary : path.basename(destFolder)

    // 如果有项目配置，跳过 package.json 的默认更新，因为 applyProjectConfig 已经处理了
    const skipPackageUpdate = !!projectConfig
    const updateSuccess = updateProjectFiles(projectName, destPackagePath, destPublicHealthCheckPath, skipPackageUpdate)
    const installSuccess = installNpmPackages(normalizedDictionary !== '.' ? normalizedDictionary : undefined)

    if (!updateSuccess || !installSuccess) {
      console.warn('Some operations failed during project initialization')
    }
  }

  console.log('initFiles finished')
}

/**
 * 创建控制器相关文件
 * @param controller 控制器名称
 * @param action 动作名称
 * @param dictionary 目标目录名称，空字符串表示当前目录
 * @param fields 字段定义数组
 */
export const createFiles = (controller: string, action: string, dictionary = '', fields?: FieldDefinition[]) => {
  const normalizedDictionary = normalizeDirectory(dictionary)
  generateCreateFiles(controller, action, normalizedDictionary, fields)
}

/**
 * 删除控制器相关文件
 * @param controller 控制器名称
 * @param action 动作名称
 * @param deleteDBFlag 是否删除数据库相关文件
 * @param dictionary 目标目录名称，空字符串表示当前目录
 */
export const deleteFiles = (controller: string, action: string, deleteDBFlag = false, dictionary = '') => {
  const normalizedDictionary = normalizeDirectory(dictionary)
  generateDeleteFiles(controller, action, deleteDBFlag, normalizedDictionary)
}
