import path from 'path'
import shell from 'shelljs'
import {
  sourceFolder,
  destFolder,
  isLocal,
  mysqlUser,
  mysqlPassword,
  mysqlHost,
  mysqlPort,
  mysqlDatabase,
} from './constants'
import { firstUpperCase, rmFileSync, rmdirSync, replaceInFileAll } from './utils'

// 类型定义
interface CleanupRule {
  from: RegExp
  to: string
  files: string[]
}

interface DeletePaths {
  destPagesController: string
  destClientReduxController: string
  destClientServiceController: string
  destClientStyledController: string
  destServerModulesController: string
  destServerApisController: string
  destServerSqlController: string
  destPagesAction?: string
  destClientReduxControllerAction?: string
  destClientAction?: string
  destClientStyledAction?: string
  // 配置文件路径
  destClientReduxReducersAllPath: string
  destServerRestPath: string
  destClientUtilsMenuPath: string
  // 多语言文件路径
  destI18nZhCN: string
  destI18nEnUS: string
  destI18nJaJP: string
}

// 常量定义
const CLEANUP_TIMEOUT = 1000

// 辅助函数
const generateDeletePaths = (controller: string, action: string, dictionary?: string): DeletePaths => {
  const basePath = dictionary || process.cwd()

  return {
    destPagesController: path.join(basePath, 'pages', controller),
    destClientReduxController: path.join(basePath, 'client', 'redux', controller),
    destClientServiceController: path.join(basePath, 'client', 'service', controller),
    destClientStyledController: path.join(basePath, 'client', 'styled', controller),
    destServerModulesController: path.join(basePath, 'server', 'modules', controller),
    destServerApisController: path.join(basePath, 'server', 'apis', `${controller}.js`),
    destServerSqlController: path.join(basePath, 'server', 'sql', `${controller}.sql`),
    // 配置文件路径
    destClientReduxReducersAllPath: path.join(basePath, 'client', 'redux', 'reducers.ts'),
    destClientUtilsMenuPath: path.join(basePath, 'client', 'utils', 'menu.tsx'),
    destServerRestPath: path.join(basePath, 'server', 'rest.js'),
    // 多语言文件路径
    destI18nZhCN: path.join(basePath, 'public', 'locales', 'zh-CN', `${controller}.json`),
    destI18nEnUS: path.join(basePath, 'public', 'locales', 'en-US', `${controller}.json`),
    destI18nJaJP: path.join(basePath, 'public', 'locales', 'ja-JP', `${controller}.json`),
    ...(action && {
      destPagesAction: path.join(basePath, 'pages', controller, `${action}.tsx`),
      destClientReduxControllerAction: path.join(basePath, 'client', 'redux', controller, action),
      destClientAction: path.join(basePath, 'client', 'components', controller, action),
      destClientStyledAction: path.join(basePath, 'client', 'styled', controller, `${action}.js`),
    }),
  }
}

const deleteAllControllerFiles = (paths: DeletePaths): void => {
  const directoriesToDelete = [
    paths.destPagesController,
    paths.destClientReduxController,
    paths.destClientServiceController,
    paths.destClientStyledController,
    paths.destServerModulesController,
  ]

  const filesToDelete = [paths.destServerApisController, paths.destServerSqlController]

  directoriesToDelete.forEach((dir) => rmdirSync(dir))
  filesToDelete.forEach((file) => rmFileSync(file))
}

const deleteSpecificActionFiles = (paths: DeletePaths): void => {
  if (paths.destPagesAction) {
    rmFileSync(paths.destPagesAction)
  }
  if (paths.destClientReduxControllerAction) {
    rmdirSync(paths.destClientReduxControllerAction)
  }
  if (paths.destClientAction) {
    rmFileSync(paths.destClientAction)
  }
  if (paths.destClientStyledAction) {
    rmFileSync(paths.destClientStyledAction)
  }
}

const deleteI18nFiles = (paths: DeletePaths): void => {
  console.log('Deleting i18n files...')
  const i18nFilesToDelete = [paths.destI18nZhCN, paths.destI18nEnUS, paths.destI18nJaJP]

  i18nFilesToDelete.forEach((filePath) => {
    rmFileSync(filePath)
    console.log(`✅ 删除多语言文件: ${filePath}`)
  })
}

const cleanupConfigurationFiles = (controller: string, action: string, paths: DeletePaths): void => {
  if (action === 'all') {
    // 清理所有控制器相关的配置
    // 1. 删除 import 语句
    shell.sed('-i', new RegExp(`^.*import.*${controller}.*Reducer.*from.*$`, 'gm'), '', paths.destClientReduxReducersAllPath)
    
    // 2. 删除 export 对象中的属性行
    shell.sed(
      '-i',
      new RegExp(`^\\s*${controller}[^:]*:\\s*${controller}.*Reducer,?\\s*$`, 'gm'),
      '',
      paths.destClientReduxReducersAllPath
    )
    
    // 3. 修复可能出现的语法问题
    // 移除空行
    shell.sed('-i', /^\s*$/g, '', paths.destClientReduxReducersAllPath)
    shell.sed('-i', /\n\n\n/g, '\n\n', paths.destClientReduxReducersAllPath)
    
    // 4. 修复对象末尾的逗号问题
    // 如果对象只剩一个属性，移除末尾逗号
    shell.sed('-i', /,(\s*\n\s*\})/, '$1', paths.destClientReduxReducersAllPath)
    
    // 5. 清理服务器端配置
    shell.sed('-i', new RegExp(`.*${controller}.*`, 'g'), '', paths.destServerRestPath)
  } else {
    // 清理特定动作的配置
    shell.sed(
      '-i',
      new RegExp(`^.*import.*${controller}${firstUpperCase(action)}Reducer.*from.*$`, 'gm'),
      '',
      paths.destClientReduxReducersAllPath
    )
    shell.sed(
      '-i',
      new RegExp(
        `^\\s*${controller}${firstUpperCase(action)}[^:]*:\\s*${controller}${firstUpperCase(action)}.*Reducer,?\\s*$`,
        'gm'
      ),
      '',
      paths.destClientReduxReducersAllPath
    )
    
    // 修复语法问题
    shell.sed('-i', /^\s*$/g, '', paths.destClientReduxReducersAllPath)
    shell.sed('-i', /,(\s*\n\s*\})/, '$1', paths.destClientReduxReducersAllPath)
  }
}

const performDatabaseCleanup = (controller: string, paths: DeletePaths): void => {
  try {
    shell.sed(
      '-i',
      new RegExp(`${mysqlDatabase};`, 'g'),
      `${mysqlDatabase};\nDROP TABLE \`${controller}\`;\n/*`,
      paths.destServerSqlController
    )
    shell.sed('-i', /utf8mb4;/g, 'utf8mb4;\n*/', paths.destServerSqlController)

    const mysqlCommand = `mysql -u${mysqlUser} -p${mysqlPassword} -h${mysqlHost} -P${mysqlPort} < ${paths.destServerSqlController}`
    shell.exec(mysqlCommand)
    console.log('Database cleanup completed')
  } catch (error) {
    console.error('Failed to execute database cleanup:', error)
  }
}

const performAdvancedCleanup = (controller: string, action: string, paths: DeletePaths): void => {
  const cleanupRules: CleanupRule[] = [
    // 标准化空行
    {
      from: /\n\s*\n\s*\n/g,
      to: '\n\n',
      files: [paths.destClientReduxReducersAllPath],
    },
    // 修复 reducers.ts 中可能的语法问题
    {
      from: /(\w+Reducer),?\s*\n\s*\}/g,
      to: '$1,\n}',
      files: [paths.destClientReduxReducersAllPath],
    },
  ]

  if (action === 'all') {
    cleanupRules.push(
      // 服务器端 REST 文件清理
      {
        from: /'(.\/apis\/template.*?)'\)\s*\n/,
        to: "'./apis/template')\n\n",
        files: [paths.destServerRestPath],
      },
      {
        from: /template\)\s*\n/,
        to: 'template)\n\n',
        files: [paths.destServerRestPath],
      },
      // 菜单清理 - 改进版本，保持正确的缩进和逗号
      {
        from: new RegExp(
          `,?\\s*\\{\\s*//\\s*${controller}_.*_start[\\s\\S]*?//\\s*${controller}_.*_end\\s*\\}\\s*,?`,
          'gm'
        ),
        to: ',', // 保留逗号，确保数组语法正确
        files: [paths.destClientUtilsMenuPath],
      }
    )
  }

  setTimeout(() => {
    replaceInFileAll(cleanupRules, 0, () => {
      console.log('Advanced cleanup completed')
      
      // 执行额外的清理步骤
      performFinalCleanup(paths)
      
      // 如果是删除整个控制器，还需要清理菜单缩进
      if (action === 'all') {
        cleanupMenuIndentation(paths)
      }
    })
  }, CLEANUP_TIMEOUT)
}

// 新增：智能菜单清理函数
const cleanupMenuIndentation = (paths: DeletePaths): void => {
  // 读取菜单文件内容
  const menuFile = paths.destClientUtilsMenuPath
  
  // 使用更智能的方式处理菜单清理，保持正确的缩进
  setTimeout(() => {
    // 清理可能出现的缩进问题，确保注释代码块有正确的缩进
    shell.sed('-i', /^[ ]{0,2}\/\*\{/gm, '    /*{', menuFile)
    shell.sed('-i', /^[ ]{0,4}key:/gm, '      key:', menuFile)
    shell.sed('-i', /^[ ]{0,4}text:/gm, '      text:', menuFile)
    shell.sed('-i', /^[ ]{0,4}url:/gm, '      url:', menuFile)
    shell.sed('-i', /^[ ]{0,4}icon:/gm, '      icon:', menuFile)
    shell.sed('-i', /^[ ]{0,4}subMenus:/gm, '      subMenus:', menuFile)
    shell.sed('-i', /^[ ]{0,2}\}\*\//gm, '    }*/', menuFile)
    
    // 修复可能出现的连续逗号问题
    shell.sed('-i', /,,+/g, ',', menuFile)
    // 修复数组末尾多余的逗号（在注释前）
    shell.sed('-i', /,(\s*\/\*)/g, '$1', menuFile)
    // 确保数组项之间有正确的逗号
    shell.sed('-i', /(\})(\s*\/\*)/g, '$1,$2', menuFile)
    
    console.log('Menu indentation cleanup completed')
  }, 1500)
}

// 新增：最终清理函数
const performFinalCleanup = (paths: DeletePaths): void => {
  // 修复 reducers.ts 的最终格式
  setTimeout(() => {
    // 确保最后一个属性有逗号（如果不是空对象）
    shell.sed('-i', /(\w+Reducer)(\s*\n\s*\})/, '$1,$2', paths.destClientReduxReducersAllPath)
    // 移除空对象中的逗号
    shell.sed('-i', /\{\s*,\s*\}/, '{}', paths.destClientReduxReducersAllPath)
    // 标准化缩进
    shell.sed('-i', /^[ ]{2}/gm, '  ', paths.destClientReduxReducersAllPath)
    
    console.log('Final cleanup completed')
  }, 500)
}

/**
 * 删除控制器相关的文件
 * @param controller 控制器名称
 * @param action 动作名称，传入 'all' 删除整个控制器
 * @param deleteDBFlag 是否删除数据库表
 * @param dictionary 目标目录路径（可选，默认为当前目录）
 */
export const deleteFiles = (controller: string, action: string, deleteDBFlag = false, dictionary?: string) => {
  console.log('deleteFiles', sourceFolder, destFolder, isLocal, controller, action, deleteDBFlag, dictionary)

  try {
    // 1. 生成删除路径
    const paths = generateDeletePaths(controller, action, dictionary)

    // 2. 删除文件和目录
    if (action === 'all') {
      console.log('Deleting all controller files...')
      deleteAllControllerFiles(paths)
      // 删除多语言文件
      deleteI18nFiles(paths)
    } else {
      console.log(`Deleting specific action files for ${action}...`)
      deleteSpecificActionFiles(paths)
    }

    // 3. 清理配置文件
    cleanupConfigurationFiles(controller, action, paths)
    console.log('Configuration files cleaned up')

    // 4. 处理数据库清理（仅在删除整个控制器且设置了标志时）
    if (action === 'all' && deleteDBFlag) {
      performDatabaseCleanup(controller, paths)
    }

    // 5. 执行高级清理
    performAdvancedCleanup(controller, action, paths)

    console.log('deleteFiles completed successfully')
  } catch (error) {
    console.error('Failed to delete files:', error)
    throw error
  }
}
