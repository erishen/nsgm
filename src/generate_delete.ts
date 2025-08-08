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
  mysqlDatabase
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
    ...(action && {
      destPagesAction: path.join(basePath, 'pages', controller, `${action}.tsx`),
      destClientReduxControllerAction: path.join(basePath, 'client', 'redux', controller, action),
      destClientAction: path.join(basePath, 'client', 'components', controller, action),
      destClientStyledAction: path.join(basePath, 'client', 'styled', controller, `${action}.js`)
    })
  }
}

const deleteAllControllerFiles = (paths: DeletePaths): void => {
  const directoriesToDelete = [
    paths.destPagesController,
    paths.destClientReduxController,
    paths.destClientServiceController,
    paths.destClientStyledController,
    paths.destServerModulesController
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

const cleanupConfigurationFiles = (controller: string, action: string, paths: DeletePaths): void => {
  if (action === 'all') {
    // 清理所有控制器相关的配置
    shell.sed('-i', new RegExp(`.*${controller}.*Reducer.*`, 'g'), '', paths.destClientReduxReducersAllPath)
    shell.sed('-i', new RegExp(`.*${controller}.*`, 'g'), '', paths.destServerRestPath)
  } else {
    // 清理特定动作的配置
    shell.sed(
      '-i',
      new RegExp(`.*${controller}${firstUpperCase(action)}Reducer.*`, 'g'),
      '',
      paths.destClientReduxReducersAllPath
    )
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
    {
      from: /\n\s*\n/,
      to: '\n\n',
      files: [paths.destClientReduxReducersAllPath]
    },
    {
      from: /Reducer,?\s*\n/,
      to: 'Reducer\n',
      files: [paths.destClientReduxReducersAllPath]
    }
  ]

  if (action === 'all') {
    cleanupRules.push(
      {
        from: /'(.\/apis\/template.*?)'\)\s*\n/,
        to: "'./apis/template')\n\n",
        files: [paths.destServerRestPath]
      },
      {
        from: /template\)\s*\n/,
        to: 'template)\n\n',
        files: [paths.destServerRestPath]
      },
      {
        from: new RegExp(
          `,?\\s*{\\s*//\\s*${controller}_.*_start[\\s\\S]*?//\\s*${controller}_.*_end\\s*}\\s*,?`,
          'gm'
        ),
        to: ',',
        files: [paths.destClientUtilsMenuPath]
      }
    )
  }

  setTimeout(() => {
    replaceInFileAll(cleanupRules, 0, () => {
      console.log('Advanced cleanup completed')
    })
  }, CLEANUP_TIMEOUT)
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
