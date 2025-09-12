import path, { resolve } from 'path'
import {
  sourceFolder,
  destFolder,
  clientPath,
  serverPath,
  pagesPath,
  publicPath,
  scriptsPath,
  typesPath,
  reduxPath,
  styledPath,
  styledLayoutPath,
  utilsPath,
  layoutPath,
  componentsPath,
  apisPath,
  utilsMenuPath,
  reduxReducersPath,
  slbHealthCheckPath,
  packagePath,
  restPath,
  sourceGenerationPath,
  sourceClientPath,
  sourceClientPathGeneration,
  sourceServerPath,
  sourceServerPathGeneration,
  sourcePagesPath,
  sourcePublicPath,
  sourceScriptsPath,
  destClientPath,
  destServerPath,
  destPagesPath,
  destPublicPath,
  destScriptsPath,
  destTypesPath,
} from './constants'
import { mkdirSync, copyFileSync } from './utils'
import { existsSync, readdirSync } from 'fs'

// 类型定义
interface FileMapping {
  source: string
  dest: string
  upgradeFlag?: boolean
}

interface InitResult {
  [key: string]: string
}

// 常量定义
const CLIENT_FILES = {
  reduxStore: '/store.ts',
  styledCommon: '/common.ts',
  styledLayoutIndex: '/index.ts',
  utilsCommon: '/common.ts',
  utilsFetch: '/fetch.ts',
  utilsCookie: '/cookie.ts',
  utilsSso: '/sso.ts',
  utilsI18n: '/i18n.ts',
  utilsNavigation: '/navigation.ts',
  utilsSuppressWarnings: '/suppressWarnings.ts',
  layoutIndex: '/index.tsx',
  languageSwitcher: '/LanguageSwitcher.tsx',
  clientProviders: '/ClientProviders.tsx',
  ssrSafeAntdProvider: '/SSRSafeAntdProvider.tsx',
  suppressHydrationWarnings: '/SuppressHydrationWarnings.tsx',
} as const

const PAGES_FILES = {
  index: '/index.tsx',
  app: '/_app.tsx',
  document: '/_document.tsx',
  login: '/login.tsx',
} as const

const SERVER_FILES = {
  apisSso: '/sso.js',
  utilsCommon: '/common.js',
  utilsDBPoolManager: '/db-pool-manager.js',
  utilsValidation: '/validation.js',
} as const

const PUBLIC_FILES = {
  images: '/images',
  fonts: '/fonts',
  favicon: '/favicon.ico',
  locales: '/locales',
} as const

const SCRIPTS_FILES = {
  startup: '/startup.sh',
  shutdown: '/shutdown.sh',
  password: '/generate-password-hash.js',
} as const

const ROOT_FILES = {
  nextConfig: '/next.config.js',
  nextI18nConfig: '/next-i18next.config.js',
  mysqlConfig: '/mysql.config.js',
  projectConfig: '/project.config.js',
  tsconfig: '/tsconfig.json',
  gitignoreSource: '/gitignore',
  gitignore: '/.gitignore',
  eslintrc: '/eslint.config.js',
  nextEnvSource: '../next-env.d.ts',
  nextEnv: '/next-env.d.ts',
  readme: '/README.md',
  appConfigSource: '../app.config.js',
  appConfig: '/app.config.js',
  app: '/app.js',
  envExampleSource: '/env.example',
  envExample: '/.env.example',
  envSource: '/env',
  env: '/.env',
  jestConfig: '/jest.config.js',
  jestSetup: '/jest.setup.js',
  jestSetupGlobals: '/jest.setup-globals.js',
} as const

// 辅助函数
const createDirectoryStructure = (directories: string[]): void => {
  directories.forEach((dir) => mkdirSync(dir))
}

const copyMultipleFiles = (fileMappings: FileMapping[]): void => {
  fileMappings.forEach(({ source, dest, upgradeFlag }) => {
    copyFileSync(source, dest, upgradeFlag)
  })
}

/**
 * 初始化客户端文件
 * @param dictionary 目标目录名称
 * @param newDestFolder 新的目标文件夹路径
 * @param upgradeFlag 是否为升级模式
 */
export const initClientFiles = (dictionary: string, newDestFolder: string, upgradeFlag: boolean): InitResult => {
  console.log('Initializing client files...')

  try {
    // 1. 确定目标路径
    const baseDestPath = dictionary === '' ? destClientPath : path.join(newDestFolder, clientPath)

    const destPaths = {
      client: baseDestPath,
      redux: resolve(baseDestPath + reduxPath),
      styled: resolve(baseDestPath + styledPath),
      styledLayout: resolve(baseDestPath + styledPath + styledLayoutPath),
      utils: resolve(baseDestPath + utilsPath),
      layout: resolve(baseDestPath + layoutPath),
    }

    // 2. 创建目录结构
    const directoriesToCreate = [
      destPaths.client,
      destPaths.redux,
      destPaths.styled,
      destPaths.styledLayout,
      destPaths.utils,
      destPaths.layout,
      resolve(baseDestPath + componentsPath),
    ]

    createDirectoryStructure(directoriesToCreate)

    // 3. 定义文件映射
    const fileMappings: FileMapping[] = [
      {
        source: resolve(sourceClientPath + reduxPath + CLIENT_FILES.reduxStore),
        dest: resolve(destPaths.redux + CLIENT_FILES.reduxStore),
        upgradeFlag,
      },
      {
        source: resolve(sourceClientPath + styledPath + CLIENT_FILES.styledCommon),
        dest: resolve(destPaths.styled + CLIENT_FILES.styledCommon),
        upgradeFlag,
      },
      {
        source: resolve(sourceClientPath + styledPath + styledLayoutPath + CLIENT_FILES.styledLayoutIndex),
        dest: resolve(destPaths.styledLayout + CLIENT_FILES.styledLayoutIndex),
        upgradeFlag,
      },
      {
        source: resolve(sourceClientPath + utilsPath + CLIENT_FILES.utilsCookie),
        dest: resolve(destPaths.utils + CLIENT_FILES.utilsCookie),
        upgradeFlag,
      },
      {
        source: resolve(sourceClientPath + utilsPath + CLIENT_FILES.utilsSso),
        dest: resolve(destPaths.utils + CLIENT_FILES.utilsSso),
        upgradeFlag,
      },
      {
        source: resolve(sourceClientPath + utilsPath + CLIENT_FILES.utilsCommon),
        dest: resolve(destPaths.utils + CLIENT_FILES.utilsCommon),
        upgradeFlag,
      },
      {
        source: resolve(sourceClientPath + utilsPath + CLIENT_FILES.utilsFetch),
        dest: resolve(destPaths.utils + CLIENT_FILES.utilsFetch),
        upgradeFlag,
      },
      {
        source: resolve(sourceClientPath + layoutPath + CLIENT_FILES.layoutIndex),
        dest: resolve(destPaths.layout + CLIENT_FILES.layoutIndex),
        upgradeFlag,
      },
      {
        source: resolve(sourceClientPath + utilsPath + CLIENT_FILES.utilsI18n),
        dest: resolve(destPaths.utils + CLIENT_FILES.utilsI18n),
        upgradeFlag,
      },
      {
        source: resolve(sourceClientPath + utilsPath + CLIENT_FILES.utilsNavigation),
        dest: resolve(destPaths.utils + CLIENT_FILES.utilsNavigation),
        upgradeFlag,
      },
      {
        source: resolve(sourceClientPath + componentsPath + CLIENT_FILES.languageSwitcher),
        dest: resolve(baseDestPath + componentsPath + CLIENT_FILES.languageSwitcher),
        upgradeFlag,
      },
      {
        source: resolve(sourceClientPath + componentsPath + CLIENT_FILES.clientProviders),
        dest: resolve(baseDestPath + componentsPath + CLIENT_FILES.clientProviders),
        upgradeFlag,
      },
      {
        source: resolve(sourceClientPath + componentsPath + CLIENT_FILES.ssrSafeAntdProvider),
        dest: resolve(baseDestPath + componentsPath + CLIENT_FILES.ssrSafeAntdProvider),
        upgradeFlag,
      },
      {
        source: resolve(sourceClientPath + componentsPath + CLIENT_FILES.suppressHydrationWarnings),
        dest: resolve(baseDestPath + componentsPath + CLIENT_FILES.suppressHydrationWarnings),
        upgradeFlag,
      },
      {
        source: resolve(sourceClientPath + utilsPath + CLIENT_FILES.utilsSuppressWarnings),
        dest: resolve(baseDestPath + utilsPath + CLIENT_FILES.utilsSuppressWarnings),
        upgradeFlag,
      },
      // 这些文件不使用 upgradeFlag
      {
        source: resolve(sourceClientPathGeneration + reduxPath + reduxReducersPath),
        dest: resolve(destPaths.redux + reduxReducersPath),
      },
      {
        source: resolve(sourceClientPathGeneration + utilsPath + utilsMenuPath),
        dest: resolve(destPaths.utils + utilsMenuPath),
      },
    ]

    // 4. 复制文件
    copyMultipleFiles(fileMappings)

    console.log('Client files initialization completed')

    return {
      destClientUtilsMenuPath: resolve(destPaths.utils + utilsMenuPath),
      destClientReduxReducersAllPath: resolve(destPaths.redux + reduxReducersPath),
    }
  } catch (error) {
    console.error('Failed to initialize client files:', error)
    throw error
  }
}

/**
 * 初始化页面文件
 * @param dictionary 目标目录名称
 * @param newDestFolder 新的目标文件夹路径
 * @param upgradeFlag 是否为升级模式
 */
export const initPagesFiles = (dictionary: string, newDestFolder: string, upgradeFlag: boolean): void => {
  console.log('Initializing pages files...')

  try {
    // 1. 确定目标路径
    const baseDestPath = dictionary === '' ? destPagesPath : path.join(newDestFolder, pagesPath)

    // 2. 创建目录
    createDirectoryStructure([baseDestPath])

    // 3. 定义文件映射
    const fileMappings: FileMapping[] = [
      {
        source: resolve(sourcePagesPath + PAGES_FILES.index),
        dest: resolve(baseDestPath + PAGES_FILES.index),
        upgradeFlag,
      },
      {
        source: resolve(sourcePagesPath + PAGES_FILES.app),
        dest: resolve(baseDestPath + PAGES_FILES.app),
        upgradeFlag,
      },
      {
        source: resolve(sourcePagesPath + PAGES_FILES.document),
        dest: resolve(baseDestPath + PAGES_FILES.document),
        upgradeFlag,
      },
      {
        source: resolve(sourcePagesPath + PAGES_FILES.login),
        dest: resolve(baseDestPath + PAGES_FILES.login),
        upgradeFlag,
      },
    ]

    // 4. 复制文件
    copyMultipleFiles(fileMappings)

    console.log('Pages files initialization completed')
  } catch (error) {
    console.error('Failed to initialize pages files:', error)
    throw error
  }
}

/**
 * 初始化服务器文件
 * @param dictionary 目标目录名称
 * @param newDestFolder 新的目标文件夹路径
 * @param upgradeFlag 是否为升级模式
 */
export const initServerFiles = (dictionary: string, newDestFolder: string, upgradeFlag: boolean): InitResult => {
  console.log('Initializing server files...')

  try {
    // 1. 确定目标路径
    const baseDestPath = dictionary === '' ? destServerPath : path.join(newDestFolder, serverPath)

    const destPaths = {
      server: baseDestPath,
      apis: resolve(baseDestPath + apisPath),
      utils: resolve(baseDestPath + utilsPath),
    }

    // 2. 创建目录结构
    const directoriesToCreate = [destPaths.server, destPaths.apis, destPaths.utils]

    createDirectoryStructure(directoriesToCreate)

    // 3. 定义文件映射
    const fileMappings: FileMapping[] = [
      {
        source: resolve(sourceServerPath + apisPath + SERVER_FILES.apisSso),
        dest: resolve(destPaths.apis + SERVER_FILES.apisSso),
        upgradeFlag,
      },
      {
        source: resolve(sourceServerPathGeneration + utilsPath + SERVER_FILES.utilsCommon),
        dest: resolve(destPaths.utils + SERVER_FILES.utilsCommon),
        upgradeFlag,
      },
      {
        source: resolve(sourceServerPathGeneration + utilsPath + SERVER_FILES.utilsDBPoolManager),
        dest: resolve(destPaths.utils + SERVER_FILES.utilsDBPoolManager),
        upgradeFlag,
      },
      {
        source: resolve(sourceServerPath + utilsPath + SERVER_FILES.utilsValidation),
        dest: resolve(destPaths.utils + SERVER_FILES.utilsValidation),
        upgradeFlag,
      },
      // REST 文件不使用 upgradeFlag
      {
        source: resolve(sourceServerPathGeneration + restPath),
        dest: resolve(destPaths.server + restPath),
      },
    ]

    // 4. 复制文件
    copyMultipleFiles(fileMappings)

    console.log('Server files initialization completed')

    return {
      destServerRestPath: resolve(destPaths.server + restPath),
    }
  } catch (error) {
    console.error('Failed to initialize server files:', error)
    throw error
  }
}

/**
 * 初始化公共文件
 * @param dictionary 目标目录名称
 * @param newDestFolder 新的目标文件夹路径
 * @param upgradeFlag 是否为升级模式
 */
export const initPublicFiles = (dictionary: string, newDestFolder: string, upgradeFlag: boolean): InitResult => {
  console.log('Initializing public files...')

  try {
    // 1. 确定目标路径
    const baseDestPath = dictionary === '' ? destPublicPath : path.join(newDestFolder, publicPath)

    const destPaths = {
      public: baseDestPath,
      images: resolve(baseDestPath + PUBLIC_FILES.images),
      fonts: resolve(baseDestPath + PUBLIC_FILES.fonts),
      locales: resolve(baseDestPath + PUBLIC_FILES.locales),
    }

    // 2. 创建目录结构
    const directoriesToCreate = [destPaths.public, destPaths.images, destPaths.fonts, destPaths.locales]

    createDirectoryStructure(directoriesToCreate)

    // 3. 定义文件映射
    const fileMappings: FileMapping[] = [
      {
        source: resolve(sourcePublicPath + slbHealthCheckPath),
        dest: resolve(destPaths.public + slbHealthCheckPath),
        upgradeFlag,
      },
      {
        source: resolve(sourcePublicPath + PUBLIC_FILES.favicon),
        dest: resolve(destPaths.public + PUBLIC_FILES.favicon),
        upgradeFlag,
      },
    ]

    // 4. 复制文件
    copyMultipleFiles(fileMappings)

    // 5. 复制 fonts 目录下的所有文件
    const sourceFontsDir = resolve(sourcePublicPath + PUBLIC_FILES.fonts)
    if (existsSync(sourceFontsDir)) {
      const fontFiles = readdirSync(sourceFontsDir)
      fontFiles.forEach((file) => {
        const sourceFile = resolve(sourceFontsDir, file)
        const destFile = resolve(destPaths.fonts, file)
        copyFileSync(sourceFile, destFile, upgradeFlag)
      })
    }

    // 6. 复制 locales 目录下的所有文件（递归复制）
    const sourceLocalesDir = resolve(sourcePublicPath + PUBLIC_FILES.locales)
    if (existsSync(sourceLocalesDir)) {
      const copyLocalesRecursive = (sourceDir: string, destDir: string) => {
        const items = readdirSync(sourceDir, { withFileTypes: true })
        items.forEach((item) => {
          const sourcePath = resolve(sourceDir, item.name)
          const destPath = resolve(destDir, item.name)

          if (item.isDirectory()) {
            mkdirSync(destPath)
            copyLocalesRecursive(sourcePath, destPath)
          } else {
            copyFileSync(sourcePath, destPath, upgradeFlag)
          }
        })
      }

      copyLocalesRecursive(sourceLocalesDir, destPaths.locales)
    }

    console.log('Public files initialization completed')

    return {
      destPublicHealthCheckPath: resolve(destPaths.public + slbHealthCheckPath),
    }
  } catch (error) {
    console.error('Failed to initialize public files:', error)
    throw error
  }
}

/**
 * 初始化脚本文件
 * @param dictionary 目标目录名称
 * @param newDestFolder 新的目标文件夹路径
 */
export const initScriptsFiles = (dictionary: string, newDestFolder: string): void => {
  console.log('Initializing scripts files...')

  try {
    // 1. 确定目标路径
    const baseDestPath = dictionary === '' ? destScriptsPath : path.join(newDestFolder, scriptsPath)

    // 2. 创建目录
    createDirectoryStructure([baseDestPath])

    // 3. 定义文件映射（脚本文件通常不使用 upgradeFlag）
    const fileMappings: FileMapping[] = [
      {
        source: resolve(sourceScriptsPath + SCRIPTS_FILES.startup),
        dest: resolve(baseDestPath + SCRIPTS_FILES.startup),
      },
      {
        source: resolve(sourceScriptsPath + SCRIPTS_FILES.shutdown),
        dest: resolve(baseDestPath + SCRIPTS_FILES.shutdown),
      },
      {
        source: resolve(sourceScriptsPath + SCRIPTS_FILES.password),
        dest: resolve(baseDestPath + SCRIPTS_FILES.password),
      },
    ]

    // 4. 复制文件
    copyMultipleFiles(fileMappings)

    console.log('Scripts files initialization completed')
  } catch (error) {
    console.error('Failed to initialize scripts files:', error)
    throw error
  }
}

/**
 * 初始化根目录文件
 * @param dictionary 目标目录名称
 * @param newDestFolder 新的目标文件夹路径
 */
export const initRootFiles = (dictionary: string, newDestFolder: string): InitResult => {
  console.log('Initializing root files...')

  try {
    // 1. 确定目标路径
    const baseDestPath = dictionary === '' ? destFolder : newDestFolder

    // 2. 定义文件映射（根文件通常不使用 upgradeFlag）
    const fileMappings: FileMapping[] = [
      {
        source: resolve(sourceGenerationPath + ROOT_FILES.nextConfig),
        dest: resolve(baseDestPath + ROOT_FILES.nextConfig),
      },
      {
        source: resolve(path.join(sourceFolder, '..', ROOT_FILES.nextI18nConfig)),
        dest: resolve(baseDestPath + ROOT_FILES.nextI18nConfig),
      },
      {
        source: resolve(sourceGenerationPath + ROOT_FILES.mysqlConfig),
        dest: resolve(baseDestPath + ROOT_FILES.mysqlConfig),
      },
      {
        source: resolve(sourceGenerationPath + ROOT_FILES.projectConfig),
        dest: resolve(baseDestPath + ROOT_FILES.projectConfig),
      },
      {
        source: resolve(sourceGenerationPath + packagePath),
        dest: resolve(baseDestPath + packagePath),
      },
      {
        source: resolve(sourceGenerationPath + ROOT_FILES.tsconfig),
        dest: resolve(baseDestPath + ROOT_FILES.tsconfig),
      },
      {
        source: resolve(sourceGenerationPath + ROOT_FILES.gitignoreSource),
        dest: resolve(baseDestPath + ROOT_FILES.gitignore),
      },
      {
        source: resolve(sourceGenerationPath + ROOT_FILES.eslintrc),
        dest: resolve(baseDestPath + ROOT_FILES.eslintrc),
      },
      {
        source: path.join(sourceFolder, ROOT_FILES.nextEnvSource),
        dest: resolve(baseDestPath + ROOT_FILES.nextEnv),
      },
      {
        source: resolve(sourceGenerationPath + ROOT_FILES.readme),
        dest: resolve(baseDestPath + ROOT_FILES.readme),
      },
      {
        source: path.join(sourceFolder, ROOT_FILES.appConfigSource),
        dest: resolve(baseDestPath + ROOT_FILES.appConfig),
      },
      {
        source: resolve(sourceGenerationPath + ROOT_FILES.app),
        dest: resolve(baseDestPath + ROOT_FILES.app),
      },
      {
        source: resolve(sourceGenerationPath + ROOT_FILES.envExampleSource),
        dest: resolve(baseDestPath + ROOT_FILES.envExample),
      },
      {
        source: resolve(sourceGenerationPath + ROOT_FILES.envSource),
        dest: resolve(baseDestPath + ROOT_FILES.env),
      },
      {
        source: resolve(sourceGenerationPath + ROOT_FILES.jestConfig),
        dest: resolve(baseDestPath + ROOT_FILES.jestConfig),
      },
      {
        source: resolve(path.join(sourceFolder, '..', ROOT_FILES.jestSetup)),
        dest: resolve(baseDestPath + ROOT_FILES.jestSetup),
      },
      {
        source: resolve(path.join(sourceFolder, '..', ROOT_FILES.jestSetupGlobals)),
        dest: resolve(baseDestPath + ROOT_FILES.jestSetupGlobals),
      },
    ]

    // 3. 复制文件
    copyMultipleFiles(fileMappings)

    console.log('Root files initialization completed')

    return {
      destPackagePath: resolve(baseDestPath + packagePath),
    }
  } catch (error) {
    console.error('Failed to initialize root files:', error)
    throw error
  }
}

/**
 * 初始化类型定义文件
 * @param dictionary 目标目录名称
 * @param newDestFolder 新的目标文件夹路径
 */
export const initTypesFiles = (dictionary: string, newDestFolder: string): void => {
  console.log('Initializing types files...')

  try {
    // 1. 确定目标路径
    const baseDestPath = dictionary === '' ? destTypesPath : path.join(newDestFolder, typesPath)

    // 2. 创建目录
    createDirectoryStructure([baseDestPath])

    // 3. 复制 i18next.d.ts 文件
    const sourceI18nextFile = resolve(destFolder, 'types', 'i18next.d.ts')
    const destI18nextFile = resolve(baseDestPath, 'i18next.d.ts')

    if (existsSync(sourceI18nextFile)) {
      copyFileSync(sourceI18nextFile, destI18nextFile)
    }

    console.log('Types files initialization completed')
  } catch (error) {
    console.error('Failed to initialize types files:', error)
    throw error
  }
}

/**
 * 初始化测试文件和目录
 * @param dictionary 目标目录名称
 * @param newDestFolder 新的目标文件夹路径
 */
export const initTestFiles = (dictionary: string, newDestFolder: string): void => {
  console.log('Initializing test files...')

  try {
    // 1. 确定目标路径
    const baseDestPath = dictionary === '' ? destFolder : newDestFolder
    const testDestPath = path.join(baseDestPath, '__tests__')

    // 2. 创建测试目录
    createDirectoryStructure([testDestPath])

    // 3. 定义文件映射
    const fileMappings: FileMapping[] = [
      {
        source: path.join(sourceGenerationPath, '__tests__', 'example.test.js'),
        dest: path.join(testDestPath, 'example.test.js'),
      },
    ]

    // 4. 复制文件
    copyMultipleFiles(fileMappings)

    console.log('Test files initialization completed')
  } catch (error) {
    console.error('Failed to initialize test files:', error)
    throw error
  }
}
