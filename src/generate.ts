import fs from 'fs'
import path from 'path'
import shell from 'shelljs'
import serverDB from './server/db'
import replace from 'replace'
import { replaceInFile } from 'replace-in-file'

const { resolve } = path
const { getMysqlConfig } = serverDB
const { mysqlOptions }: any = getMysqlConfig()
const {
  user: mysqlUser,
  password: mysqlPassword,
  host: mysqlHost,
  port: mysqlPort,
  database: mysqlDatabase
} = mysqlOptions

const mkdirFlag = true
const copyFileFlag = true
const replaceFlag = true
const replaceInFileFlag = true
const rmdirFlag = true
const rmfileFlag = true

const firstUpperCase = (word: string) => {
  return word.substring(0, 1).toUpperCase() + word.substring(1)
}

const mkdirSync = (dirPath: string) => {
  if (mkdirFlag) {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath)
    }
  }
}

const rmFileSync = (filePath: string) => {
  if (rmfileFlag) {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
    }
  }
}

const rmdirSync = (dirPath: string) => {
  if (rmdirFlag) {
    if (fs.existsSync(dirPath)) {
      const list = fs.readdirSync(dirPath)

      list.forEach((item) => {
        const resolverPath = resolve(`${dirPath}/${item}`)
        const stat = fs.statSync(resolverPath)
        const isDir = stat.isDirectory()
        const isFile = stat.isFile()

        if (isDir) {
          rmdirSync(resolverPath)
        } else if (isFile) {
          rmFileSync(resolverPath)
        }
      })

      fs.rmdirSync(dirPath)
    }
  }
}

const copyFileSync = (source: string, dest: string, upgradeFlag = false) => {
  if (copyFileFlag) {
    if (!upgradeFlag) {
      if (!fs.existsSync(dest) && fs.existsSync(source)) {
        fs.copyFileSync(source, dest)
      }
    } else {
      if (fs.existsSync(source)) {
        fs.copyFileSync(source, dest)
      }
    }
  }
}

const handleReplace = ({ regex, replacement, paths }: any) => {
  if (replaceFlag) {
    replace({
      regex,
      replacement,
      paths,
      recursive: true,
      silent: true
    })
  }
}

const replaceInFileAll = async (array: any, index = 0, callback: any) => {
  if (replaceInFileFlag) {
    console.log('replaceInFileAll', index)
    const arrayLen = array.length
    if (index < arrayLen) {
      const item = array[index]

      replaceInFile(item)
        .then((changedFiles) => {
          console.log('Modified files:', changedFiles)
          replaceInFileAll(array, ++index, callback)
        })
        .catch((error) => {
          if (error) {
            console.error('Error occurred:', error)
          }
        })

      // replaceInFile(item, (error, changedFiles) => {
      //   if (error) {
      //     console.error('Error occurred:', error)
      //   }
      //   console.log('Modified files:', changedFiles)
      //   replaceInFileAll(array, ++index, callback)
      // })
    } else {
      return callback?.()
    }
  } else {
    return callback?.()
  }
}

const sourceFolder = __dirname
const destFolder = process.cwd()

const isLocal = sourceFolder === resolve(`${destFolder}/lib`)

const generationPath = '../generation'
const clientPathSource = '../client'
const clientPath = './client'
const serverPathSource = '../server'
const serverPath = './server'
const pagesPathSource = '../pages'
const pagesPath = './pages'
const publicPathSource = '../public'
const publicPath = './public'
const scriptsPathSource = '../scripts'
const scriptsPath = './scripts'

const reduxPath = '/redux'
const servicePath = '/service'
const styledPath = '/styled'
const styledLayoutPath = '/layout'
const utilsPath = '/utils'
const layoutPath = '/layout'
const modulesPath = '/modules'
const apisPath = '/apis'
const sqlPath = '/sql'

const utilsMenuPath = '/menu.tsx'
const reduxReducersPath = '/reducers.ts'
const slbHealthCheckPath = '/slbhealthcheck.html'
const packagePath = '/package.json'
const restPath = '/rest.js'

const sourceGenerationPath = path.join(sourceFolder, generationPath)

const sourceClientPath = path.join(sourceFolder, clientPathSource)
const sourceClientPathGeneration = path.join(sourceGenerationPath, clientPath)

const sourceServerPath = path.join(sourceFolder, serverPathSource)
const sourceServerPathGeneration = path.join(sourceGenerationPath, serverPath)

const sourcePagesPath = path.join(sourceFolder, pagesPathSource)
const sourcePublicPath = path.join(sourceFolder, publicPathSource)
const sourceScriptsPath = path.join(sourceFolder, scriptsPathSource)

const destClientPath = path.join(destFolder, clientPath)
const destClientReduxPath = resolve(destClientPath + reduxPath)
const destClientServicePath = resolve(destClientPath + servicePath)
const destClientStyledPath = resolve(destClientPath + styledPath)
const destClientStyledLayoutPath = resolve(destClientStyledPath + styledLayoutPath)
const destClientUtilsPath = resolve(destClientPath + utilsPath)
const destClientLayoutPath = resolve(destClientPath + layoutPath)

const destServerPath = path.join(destFolder, serverPath)
const destServerModulesPath = resolve(destServerPath + modulesPath)
const destServerApisPath = resolve(destServerPath + apisPath)
const destServerSqlPath = resolve(destServerPath + sqlPath)
const destServerUtilsPath = resolve(destServerPath + utilsPath)

const destPagesPath = path.join(destFolder, pagesPath)
const destPublicPath = path.join(destFolder, publicPath)
const destScriptsPath = path.join(destFolder, scriptsPath)

let destClientUtilsMenuPath = resolve(destClientUtilsPath + utilsMenuPath)
let destClientReduxReducersAllPath = resolve(destClientReduxPath + reduxReducersPath)
let destPublicHealthCheckPath = resolve(destPublicPath + slbHealthCheckPath)
let destPackagePath = resolve(destFolder + packagePath)
let destServerRestPath = resolve(destServerPath + restPath)

export const initFiles = (dictionary: string, upgradeFlag = false) => {
  if (isLocal) {
    upgradeFlag = false
  }

  // 禁止绝对路径，强制所有生成目录都在 cwd 下
  if (!dictionary || dictionary === '/') {
    dictionary = '.'
  }

  let newDestFolder = destFolder
  if (dictionary !== '') {
    newDestFolder = path.join(destFolder, dictionary)
    mkdirSync(newDestFolder)
  }

  console.log('initFiles', dictionary === '' ? '.' : dictionary, upgradeFlag)

  const initClientFiles = () => {
    const clientReduxPath = reduxPath
    const clientReduxReducersPath = reduxReducersPath
    const clientReduxStorePath = '/store.ts'
    const clientStyledPath = styledPath
    const clientStyledCommonPath = '/common.ts'
    const clientStyledLayoutPath = styledLayoutPath
    const clientStyledLayoutIndexPath = '/index.ts'
    const clientUtilsPath = utilsPath
    const clientUtilsCommonPath = '/common.ts'
    const clientUtilsFetchPath = '/fetch.ts'
    const clientUtilsCookiePath = '/cookie.ts'
    const clientUtilsSsoPath = '/sso.ts'
    const clientUtilsMenuPath = utilsMenuPath
    const clientLayoutPath = layoutPath
    const clientLayoutIndexPath = '/index.tsx'

    // 仍旧使用 generation/client/redux/reducers.ts
    const sourceClientReduxReducersAllPath = resolve(
      sourceClientPathGeneration + clientReduxPath + clientReduxReducersPath
    )

    const sourceClientReduxStorePath = resolve(sourceClientPath + clientReduxPath + clientReduxStorePath)
    const sourceClientLayoutIndexPath = resolve(sourceClientPath + clientLayoutPath + clientLayoutIndexPath)
    const sourceClientStyledLayoutIndexPath = resolve(
      sourceClientPath + clientStyledPath + clientStyledLayoutPath + clientStyledLayoutIndexPath
    )
    const sourceClientStyledCommonPath = resolve(sourceClientPath + clientStyledPath + clientStyledCommonPath)
    const sourceClientUtilsCommonPath = resolve(sourceClientPath + clientUtilsPath + clientUtilsCommonPath)
    const sourceClientUtilsFetchPath = resolve(sourceClientPath + clientUtilsPath + clientUtilsFetchPath)
    const sourceClientUtilsCookiePath = resolve(sourceClientPath + clientUtilsPath + clientUtilsCookiePath)
    const sourceClientUtilsSsoPath = resolve(sourceClientPath + clientUtilsPath + clientUtilsSsoPath)

    // 仍旧使用 generation/client/utils/menu.tsx
    const sourceClientUtilsMenuPath = resolve(sourceClientPathGeneration + clientUtilsPath + clientUtilsMenuPath)

    let destClientReduxStorePath = resolve(destClientReduxPath + clientReduxStorePath)
    let destClientLayoutIndexPath = resolve(destClientLayoutPath + clientLayoutIndexPath)
    let destClientStyledLayoutIndexPath = resolve(destClientStyledLayoutPath + clientStyledLayoutIndexPath)
    let destClientStyledCommonPath = resolve(destClientStyledPath + clientStyledCommonPath)
    let destClientUtilsCommonPath = resolve(destClientUtilsPath + clientUtilsCommonPath)
    let destClientUtilsFetchPath = resolve(destClientUtilsPath + clientUtilsFetchPath)
    let destClientUtilsCookiePath = resolve(destClientUtilsPath + clientUtilsCookiePath)
    let destClientUtilsSsoPath = resolve(destClientUtilsPath + clientUtilsSsoPath)

    if (dictionary === '') {
      mkdirSync(destClientPath)
      mkdirSync(destClientReduxPath)
      mkdirSync(destClientStyledPath)
      mkdirSync(destClientStyledLayoutPath)
      mkdirSync(destClientUtilsPath)
      mkdirSync(destClientLayoutPath)
    } else {
      const newDestClientPath = path.join(newDestFolder, clientPath)
      const newDestClientReduxPath = resolve(newDestClientPath + clientReduxPath)
      const newDestClientStyledPath = resolve(newDestClientPath + clientStyledPath)
      const newDestClientStyledLayoutPath = resolve(newDestClientStyledPath + clientStyledLayoutPath)
      const newDestClientUtilsPath = resolve(newDestClientPath + clientUtilsPath)
      const newDestClientLayoutPath = resolve(newDestClientPath + clientLayoutPath)

      mkdirSync(newDestClientPath)
      mkdirSync(newDestClientReduxPath)
      mkdirSync(newDestClientStyledPath)
      mkdirSync(newDestClientUtilsPath)
      mkdirSync(newDestClientLayoutPath)
      mkdirSync(newDestClientStyledLayoutPath)

      destClientReduxReducersAllPath = resolve(newDestClientReduxPath + clientReduxReducersPath)
      destClientReduxStorePath = resolve(newDestClientReduxPath + clientReduxStorePath)
      destClientLayoutIndexPath = resolve(newDestClientLayoutPath + clientLayoutIndexPath)
      destClientStyledLayoutIndexPath = resolve(newDestClientStyledLayoutPath + clientStyledLayoutIndexPath)
      destClientStyledCommonPath = resolve(newDestClientStyledPath + clientStyledCommonPath)
      destClientUtilsCommonPath = resolve(newDestClientUtilsPath + clientUtilsCommonPath)
      destClientUtilsFetchPath = resolve(newDestClientUtilsPath + clientUtilsFetchPath)
      destClientUtilsCookiePath = resolve(newDestClientUtilsPath + clientUtilsCookiePath)
      destClientUtilsSsoPath = resolve(newDestClientUtilsPath + clientUtilsSsoPath)
      destClientUtilsMenuPath = resolve(newDestClientUtilsPath + clientUtilsMenuPath)
    }

    copyFileSync(sourceClientReduxStorePath, destClientReduxStorePath, upgradeFlag)
    copyFileSync(sourceClientStyledCommonPath, destClientStyledCommonPath, upgradeFlag)
    copyFileSync(sourceClientStyledLayoutIndexPath, destClientStyledLayoutIndexPath, upgradeFlag)
    copyFileSync(sourceClientUtilsCookiePath, destClientUtilsCookiePath, upgradeFlag)
    copyFileSync(sourceClientUtilsSsoPath, destClientUtilsSsoPath, upgradeFlag)
    copyFileSync(sourceClientUtilsCommonPath, destClientUtilsCommonPath, upgradeFlag)
    copyFileSync(sourceClientUtilsFetchPath, destClientUtilsFetchPath, upgradeFlag)
    copyFileSync(sourceClientLayoutIndexPath, destClientLayoutIndexPath, upgradeFlag)

    copyFileSync(sourceClientReduxReducersAllPath, destClientReduxReducersAllPath)
    copyFileSync(sourceClientUtilsMenuPath, destClientUtilsMenuPath)
  }

  const initPagesFiles = () => {
    const pageIndexPath = '/index.tsx'
    const pageAppPath = '/_app.tsx'
    const pageDocumentPath = '/_document.tsx'
    const pageLoginPath = '/login.tsx'

    const sourcePagesIndexPath = resolve(sourcePagesPath + pageIndexPath)
    const sourcePagesAppPath = resolve(sourcePagesPath + pageAppPath)
    const sourcePagesDocumentPath = resolve(sourcePagesPath + pageDocumentPath)
    const sourcePagesLoginPath = resolve(sourcePagesPath + pageLoginPath)

    let destPagesIndexPath = resolve(destPagesPath + pageIndexPath)
    let destPagesAppPath = resolve(destPagesPath + pageAppPath)
    let destPagesDocumentPath = resolve(destPagesPath + pageDocumentPath)
    let destPagesLoginPath = resolve(destPagesPath + pageLoginPath)

    if (dictionary === '') {
      mkdirSync(destPagesPath)
    } else {
      const newDestPagesPath = path.join(newDestFolder, pagesPath)
      mkdirSync(newDestPagesPath)

      destPagesIndexPath = resolve(newDestPagesPath + pageIndexPath)
      destPagesAppPath = resolve(newDestPagesPath + pageAppPath)
      destPagesDocumentPath = resolve(newDestPagesPath + pageDocumentPath)
      destPagesLoginPath = resolve(newDestPagesPath + pageLoginPath)
    }

    copyFileSync(sourcePagesIndexPath, destPagesIndexPath, upgradeFlag)
    copyFileSync(sourcePagesAppPath, destPagesAppPath, upgradeFlag)
    copyFileSync(sourcePagesDocumentPath, destPagesDocumentPath, upgradeFlag)
    copyFileSync(sourcePagesLoginPath, destPagesLoginPath, upgradeFlag)
  }

  const initServerFiles = () => {
    const serverRestPath = restPath
    const serverApisPath = apisPath
    const serverApisSsoPath = '/sso.js'
    const serverUtilsPath = utilsPath
    const serverUtilsCommonPath = '/common.js'
    const serverUtilsDBPoolManagerPath = '/db-pool-manager.js'

    // 仍旧使用 generation/server/rest.js
    const sourceServerRestPath = resolve(sourceServerPathGeneration + serverRestPath)

    // 仍旧使用 generation/server/utils/common.js
    const sourceServerUtilsCommonPath = resolve(sourceServerPathGeneration + serverUtilsPath + serverUtilsCommonPath)

    const sourceServerUtilsDBPoolManagerPath = resolve(
      sourceServerPathGeneration + serverUtilsPath + serverUtilsDBPoolManagerPath
    )

    const sourceServerApisSsoPath = resolve(sourceServerPath + serverApisPath + serverApisSsoPath)

    let destServerApisSsoPath = resolve(destServerApisPath + serverApisSsoPath)
    let destServerUtilsCommonPath = resolve(destServerUtilsPath + serverUtilsCommonPath)
    let destServerUtilsDBPoolManagerPath = resolve(destServerUtilsPath + serverUtilsDBPoolManagerPath)

    if (dictionary === '') {
      mkdirSync(destServerPath)
      mkdirSync(destServerApisPath)
      mkdirSync(destServerUtilsPath)
    } else {
      const newDestServerPath = path.join(newDestFolder, serverPath)
      const newDestServerApisPath = resolve(newDestServerPath + serverApisPath)
      const newDestServerUtilsPath = resolve(newDestServerPath + serverUtilsPath)

      mkdirSync(newDestServerPath)
      mkdirSync(newDestServerApisPath)
      mkdirSync(newDestServerUtilsPath)

      destServerRestPath = resolve(newDestServerPath + serverRestPath)
      destServerApisSsoPath = resolve(newDestServerApisPath + serverApisSsoPath)
      destServerUtilsCommonPath = resolve(newDestServerUtilsPath + serverUtilsCommonPath)
      destServerUtilsDBPoolManagerPath = resolve(newDestServerUtilsPath + serverUtilsDBPoolManagerPath)
    }

    copyFileSync(sourceServerApisSsoPath, destServerApisSsoPath, upgradeFlag)
    copyFileSync(sourceServerUtilsCommonPath, destServerUtilsCommonPath, upgradeFlag)
    copyFileSync(sourceServerUtilsDBPoolManagerPath, destServerUtilsDBPoolManagerPath, upgradeFlag)

    copyFileSync(sourceServerRestPath, destServerRestPath)
  }

  const initPublicFiles = () => {
    const publicImagesPath = '/images'
    const publicImagesZhizuotuPath = '/zhizuotu_1.png'
    const publicSlbHealthcheckPath = slbHealthCheckPath

    const destPublicImagesPath = resolve(destPublicPath + publicImagesPath)
    const sourcePublicImages1Path = resolve(sourcePublicPath + publicImagesPath + publicImagesZhizuotuPath)
    const sourcePublicHealthCheckPath = resolve(sourcePublicPath + publicSlbHealthcheckPath)
    let destPublicImages1Path = resolve(destPublicImagesPath + publicImagesZhizuotuPath)

    if (dictionary === '') {
      mkdirSync(destPublicPath)
      mkdirSync(destPublicImagesPath)
    } else {
      const newDestPublicPath = path.join(newDestFolder, publicPath)
      const newDestPublicImagesPath = resolve(newDestPublicPath + publicImagesPath)

      mkdirSync(newDestPublicPath)
      mkdirSync(newDestPublicImagesPath)

      destPublicHealthCheckPath = resolve(newDestPublicPath + publicSlbHealthcheckPath)
      destPublicImages1Path = resolve(newDestPublicImagesPath + publicImagesZhizuotuPath)
    }

    copyFileSync(sourcePublicHealthCheckPath, destPublicHealthCheckPath, upgradeFlag)
    copyFileSync(sourcePublicImages1Path, destPublicImages1Path, upgradeFlag)
  }

  const initScriptsFiles = () => {
    const scriptsStartupPath = '/startup.sh'
    const scriptsShutdownPath = '/shutdown.sh'

    const sourceScriptsStartupPath = resolve(sourceScriptsPath + scriptsStartupPath)
    const sourceScriptsShutdownPath = resolve(sourceScriptsPath + scriptsShutdownPath)
    let destScriptsStartupPath = resolve(destScriptsPath + scriptsStartupPath)
    let destScriptsShutdownPath = resolve(destScriptsPath + scriptsShutdownPath)

    if (dictionary === '') {
      mkdirSync(destScriptsPath)
    } else {
      const newDestScriptsPath = path.join(newDestFolder, scriptsPath)
      mkdirSync(newDestScriptsPath)

      destScriptsStartupPath = resolve(newDestScriptsPath + scriptsStartupPath)
      destScriptsShutdownPath = resolve(newDestScriptsPath + scriptsShutdownPath)
    }

    copyFileSync(sourceScriptsStartupPath, destScriptsStartupPath)
    copyFileSync(sourceScriptsShutdownPath, destScriptsShutdownPath)
  }

  const initRootFiles = () => {
    const rootNextConfigPath = '/next.config.js'
    const rootMysqlConfigPath = '/mysql.config.js'
    const rootProjectConfigPath = '/project.config.js'
    const rootPackagePath = packagePath
    const rootTsconfigPath = '/tsconfig.json'

    // const rootBabelrcPath = '/.babelrc'

    const rootGitignorePathSource = '/gitignore'
    const rootGitignorePath = '/.gitignore'

    const rootEslintrcPathSource = '/eslintrc.js'
    const rootEslintrcPath = '/.eslintrc.js'

    const rootNextEnvPathSource = '../next-env.d.ts'
    const rootNextEnvPath = '/next-env.d.ts'

    const rootReadmePath = '/README.md'

    const rootAppConfigPathSource = '../app.config.js'
    const rootAppConfigPath = '/app.config.js'

    const rootAppPath = '/app.js'

    const sourceNextConfigPath = resolve(sourceGenerationPath + rootNextConfigPath)
    const sourceMysqlConfigPath = resolve(sourceGenerationPath + rootMysqlConfigPath)
    const sourceProjectConfigPath = resolve(sourceGenerationPath + rootProjectConfigPath)
    const sourceTsConfigPath = resolve(sourceGenerationPath + rootTsconfigPath)

    // const sourceBabelrcPath = path.join(sourceGenerationPath, rootBabelrcPath)
    const sourceGitignorePath = resolve(sourceGenerationPath + rootGitignorePathSource)

    const sourceEslintrcPath = resolve(sourceGenerationPath + rootEslintrcPathSource)

    const sourceNextEnvPath = path.join(sourceFolder, rootNextEnvPathSource)

    const sourceReadmePath = resolve(sourceGenerationPath + rootReadmePath)

    const sourceAppConfigPath = path.join(sourceFolder, rootAppConfigPathSource)

    const sourceAppath = resolve(sourceGenerationPath + rootAppPath)
    const sourcePackagePath = resolve(sourceGenerationPath + rootPackagePath)

    let destNextConfigPath = resolve(destFolder + rootNextConfigPath)
    let destMysqlConfigPath = resolve(destFolder + rootMysqlConfigPath)
    let destProjectConfigPath = resolve(destFolder + rootProjectConfigPath)
    let destTsConfigPath = resolve(destFolder + rootTsconfigPath)
    // let destBabelrcPath = resolve(destFolder + rootBabelrcPath)
    let destGitignorePath = resolve(destFolder + rootGitignorePath)
    let destEslintrcPath = resolve(destFolder + rootEslintrcPath)
    let destNextEnvPath = resolve(destFolder + rootNextEnvPath)
    let destReadmePath = resolve(destFolder + rootReadmePath)
    let destAppConfigPath = resolve(destFolder + rootAppConfigPath)
    let destAppath = resolve(destFolder + rootAppPath)

    if (dictionary !== '') {
      destNextConfigPath = resolve(newDestFolder + rootNextConfigPath)
      destMysqlConfigPath = resolve(newDestFolder + rootMysqlConfigPath)
      destProjectConfigPath = resolve(newDestFolder + rootProjectConfigPath)

      destTsConfigPath = resolve(newDestFolder + rootTsconfigPath)
      // destBabelrcPath = resolve(newDestFolder + rootBabelrcPath)
      destGitignorePath = resolve(newDestFolder + rootGitignorePath)
      destEslintrcPath = resolve(newDestFolder + rootEslintrcPath)
      destNextEnvPath = resolve(newDestFolder + rootNextEnvPath)
      destReadmePath = resolve(newDestFolder + rootReadmePath)
      destAppConfigPath = resolve(newDestFolder + rootAppConfigPath)
      destAppath = resolve(newDestFolder + rootAppPath)
      destPackagePath = resolve(newDestFolder + rootPackagePath)
    }

    copyFileSync(sourceNextConfigPath, destNextConfigPath)
    copyFileSync(sourceMysqlConfigPath, destMysqlConfigPath)
    copyFileSync(sourceProjectConfigPath, destProjectConfigPath)
    copyFileSync(sourcePackagePath, destPackagePath)
    copyFileSync(sourceTsConfigPath, destTsConfigPath)
    // copyFileSync(sourceBabelrcPath, destBabelrcPath)
    copyFileSync(sourceGitignorePath, destGitignorePath)
    copyFileSync(sourceEslintrcPath, destEslintrcPath)
    copyFileSync(sourceNextEnvPath, destNextEnvPath)
    copyFileSync(sourceReadmePath, destReadmePath)
    copyFileSync(sourceAppConfigPath, destAppConfigPath)
    copyFileSync(sourceAppath, destAppath)
  }

  initClientFiles()
  initPagesFiles()
  initServerFiles()
  initPublicFiles()
  initScriptsFiles()
  initRootFiles()

  if (!isLocal && !upgradeFlag) {
    if (dictionary !== '') {
      shell.sed('-i', eval('/nsgm-cli-project/'), `${dictionary}-project`, destPackagePath)
      shell.sed('-i', eval('/NSGM-CLI/'), dictionary, destPublicHealthCheckPath)

      shell.exec(`cd ${dictionary} && npm install --save nsgm-cli --legacy-peer-deps`)
      shell.exec(
        `cd ${dictionary} && npm install --save-dev @types/node@^20 @types/react@^18 @types/lodash@^4 typescript@^5 --legacy-peer-deps`
      )
    } else {
      shell.sed('-i', eval('/nsgm-cli-project/'), `${path.basename(destFolder)}-project`, destPackagePath)
      shell.sed('-i', eval('/NSGM-CLI/'), path.basename(destFolder), destPublicHealthCheckPath)

      shell.exec('npm install --save nsgm-cli --legacy-peer-deps')
      shell.exec(
        'npm install --save-dev @types/node@^20 @types/react@^18 @types/lodash@^4 typescript@^5 --legacy-peer-deps'
      )
      // shell.exec('npm install --save-dev babel-plugin-styled-components@2.1.4 --legacy-peer-deps')
    }
  }

  console.log('initFiles finished')
}

export const createFiles = (controller: string, action: string) => {
  console.log('createFiles', sourceFolder, destFolder, isLocal, controller, action)

  mkdirSync(destClientPath)
  mkdirSync(destServerPath)
  mkdirSync(destPagesPath)

  // pages
  const sourcePagesActionPath = resolve(`${sourcePagesPath}/template/manage.tsx`)
  const destPagesControllerPath = resolve(`${destPagesPath}/${controller}`)
  const destPagesActionPath = resolve(`${destPagesControllerPath}/${action}.tsx`)

  mkdirSync(destPagesControllerPath)

  copyFileSync(sourcePagesActionPath, destPagesActionPath)

  console.log('pages finished')

  // client redux
  const destClientReduxControllerPath = resolve(`${destClientReduxPath}/${controller}`)
  const destClientReduxControllerActionPath = resolve(`${destClientReduxControllerPath}/${action}`)

  mkdirSync(destClientReduxPath)
  mkdirSync(destClientReduxControllerPath)
  mkdirSync(destClientReduxControllerActionPath)

  const sourceClientReduxActionsPath = resolve(`${sourceClientPath}/redux/template/manage/actions.ts`)
  const sourceClientReduxReducersPath = resolve(`${sourceClientPath}/redux/template/manage/reducers.ts`)
  const sourceClientReduxTypesPath = resolve(`${sourceClientPath}/redux/template/manage/types.ts`)
  const destClientReduxActionsPath = resolve(`${destClientReduxControllerActionPath}/actions.ts`)
  const destClientReduxReducersPath = resolve(`${destClientReduxControllerActionPath}/reducers.ts`)
  const destClientReduxTypesPath = resolve(`${destClientReduxControllerActionPath}/types.ts`)

  copyFileSync(sourceClientReduxActionsPath, destClientReduxActionsPath)

  copyFileSync(sourceClientReduxReducersPath, destClientReduxReducersPath)

  copyFileSync(sourceClientReduxTypesPath, destClientReduxTypesPath)

  console.log('client redux finished')

  // client service
  const sourceClientActionPath = resolve(`${sourceClientPath}/service/template/manage.ts`)
  const destClientServiceControllerPath = resolve(`${destClientServicePath}/${controller}`)
  const destClientActionPath = resolve(`${destClientServiceControllerPath}/${action}.ts`)

  mkdirSync(destClientServicePath)
  mkdirSync(destClientServiceControllerPath)

  copyFileSync(sourceClientActionPath, destClientActionPath)

  console.log('client service finished')

  // client styled
  const sourceClientStyledActionPath = resolve(`${sourceClientPath}/styled/template/manage.ts`)
  const destClientStyledControllerPath = resolve(`${destClientStyledPath}/${controller}`)

  mkdirSync(destClientStyledPath)
  mkdirSync(destClientStyledControllerPath)

  const destClientStyledActionPath = resolve(`${destClientStyledControllerPath}/${action}.ts`)

  copyFileSync(sourceClientStyledActionPath, destClientStyledActionPath)

  console.log('client styled finished')

  // server modules
  const sourceServerModulesResolverPath = resolve(`${sourceServerPath}/modules/template/resolver.js`)
  const sourceServerModulesSchemaPath = resolve(`${sourceServerPath}/modules/template/schema.js`)
  const destServerModulesControllerPath = resolve(`${destServerModulesPath}/${controller}`)

  mkdirSync(destServerModulesPath)
  mkdirSync(destServerModulesControllerPath)

  const destServerModulesResolverPath = resolve(`${destServerModulesControllerPath}/resolver.js`)
  const destServerModulesSchemaPath = resolve(`${destServerModulesControllerPath}/schema.js`)

  copyFileSync(sourceServerModulesResolverPath, destServerModulesResolverPath)
  copyFileSync(sourceServerModulesSchemaPath, destServerModulesSchemaPath)

  console.log('server modules finished')

  // server apis
  const sourceServerApisControllerPath = resolve(`${sourceServerPath}/apis/template.js`)

  mkdirSync(destServerApisPath)

  const destServerApisControllerPath = resolve(`${destServerApisPath}/${controller}.js`)

  copyFileSync(sourceServerApisControllerPath, destServerApisControllerPath)

  console.log('server apis finished')

  // server sql
  const sourceServerSqlControllerPath = resolve(`${sourceServerPath}/sql/template.sql`)

  mkdirSync(destServerSqlPath)

  const destServerSqlControllerPath = resolve(`${destServerSqlPath}/${controller}.sql`)

  copyFileSync(sourceServerSqlControllerPath, destServerSqlControllerPath)

  console.log('server sql finished')

  // replace dest files
  handleReplace({
    regex: 'template',
    replacement: controller,
    paths: [
      destPagesActionPath,
      destClientActionPath,
      destClientReduxActionsPath,
      destClientReduxReducersPath,
      destServerModulesResolverPath,
      destServerModulesSchemaPath,
      destServerApisControllerPath
    ]
  })

  handleReplace({
    regex: 'Template',
    replacement: firstUpperCase(controller),
    paths: [
      destPagesActionPath,
      destClientActionPath,
      destClientReduxActionsPath,
      destServerModulesSchemaPath,
      destServerApisControllerPath
    ]
  })

  handleReplace({
    regex: 'TEMPLATE',
    replacement: controller.toUpperCase(),
    paths: [destClientReduxActionsPath, destClientReduxReducersPath, destClientReduxTypesPath]
  })

  handleReplace({
    regex: 'manage',
    replacement: action,
    paths: [destPagesActionPath, destClientReduxActionsPath]
  })

  handleReplace({
    regex: 'Manage',
    replacement: firstUpperCase(action),
    paths: [destPagesActionPath, destClientReduxReducersPath]
  })

  console.log('replace dest files finished')

  // special replace dest files
  const optionsArr = [
    {
      from: /\n\s*\n/,
      to: `\nimport { ${controller}${firstUpperCase(action)}Reducer } from './${controller}/${action}/reducers'\n\n`,
      files: [destClientReduxReducersAllPath]
    },
    {
      from: /Reducer,\s*\n/,
      to: `Reducer,\n  ${controller}${firstUpperCase(action)}: ${controller}${firstUpperCase(action)}Reducer,\n`,
      files: [destClientReduxReducersAllPath]
    },
    {
      from: /'(.\/apis\/template.*?)'\)\s*\n/,
      to: `'./apis/template')\nconst ${controller} = require('./apis/${controller}')\n`,
      files: [destServerRestPath]
    },
    {
      from: /template\)\s*\n/,
      to: `template)\nrouter.use('/${controller}', ${controller})\n`,
      files: [destServerRestPath]
    },
    {
      from: /null\s*\n/,
      to:
        `null\n  },\n  {\n    // ${controller}_${action}_start\n    key: (++key).toString(),\n    text: '${
          controller
        }',\n    url: '/${controller}/${action}',\n    icon: <SolutionOutlined rev={undefined} />,\n    ` +
        `subMenus: [\n      {\n        key: key + '_1',\n        text: '${action}',\n        url: '/${controller}/${
          action
        }'\n      }\n    ]\n    // ${controller}_${action}_end\n`,
      files: [destClientUtilsMenuPath]
    }
  ]

  if (isLocal) {
    optionsArr.push({
      from: /'nsgm-cli'\)/,
      to: "'../../../index')",
      files: [destServerModulesResolverPath]
    })
  }

  shell.sed('-i', eval(`/.*${controller}${firstUpperCase(action)}Reducer.*/`), '', destClientReduxReducersAllPath)

  shell.sed('-i', eval(`/.*${controller}.*/`), '', destServerRestPath)

  shell.sed('-i', eval('/template/'), controller, destServerSqlControllerPath)

  shell.sed('-i', eval('/crm_demo/'), mysqlDatabase, destServerSqlControllerPath)

  shell.exec(`mysql -u${mysqlUser} -p${mysqlPassword} -h${mysqlHost} -P${mysqlPort} < ${destServerSqlControllerPath}`)

  setTimeout(() => {
    replaceInFileAll(optionsArr, 0, () => {
      console.log('special replace dest files finished')
    })
  }, 1000)
}

export const deleteFiles = (controller: string, action: string, deleteDBFlag = false) => {
  console.log('deleteFiles', sourceFolder, destFolder, isLocal, controller, action, deleteDBFlag)

  // pages
  const destPagesControllerPath = resolve(`${destPagesPath}/${controller}`)

  // client redux
  const destClientReduxControllerPath = resolve(`${destClientReduxPath}/${controller}`)

  // client service
  const destClientServiceControllerPath = resolve(`${destClientServicePath}/${controller}`)

  // client styled
  const destClientStyledControllerPath = resolve(`${destClientStyledPath}/${controller}`)

  // server modules
  const destServerModulesControllerPath = resolve(`${destServerModulesPath}/${controller}`)

  // server apis
  const destServerApisControllerPath = resolve(`${destServerApisPath}/${controller}.js`)

  // server sql
  const destServerSqlControllerPath = resolve(`${destServerSqlPath}/${controller}.sql`)

  if (action === 'all') {
    rmdirSync(destPagesControllerPath)
    rmdirSync(destClientReduxControllerPath)
    rmdirSync(destClientServiceControllerPath)
    rmdirSync(destClientStyledControllerPath)
    rmdirSync(destServerModulesControllerPath)
    rmFileSync(destServerApisControllerPath)

    shell.sed('-i', eval(`/.*${controller}.*` + `Reducer.*/`), '', destClientReduxReducersAllPath)
    shell.sed('-i', eval(`/.*${controller}.*/`), '', destServerRestPath)

    shell.sed('-i', eval(`/.*${controller}_.*_start.*/`), '    /*', destClientUtilsMenuPath)
    shell.sed('-i', eval(`/.*${controller}_.*_end.*/`), '    */', destClientUtilsMenuPath)

    if (deleteDBFlag) {
      shell.sed(
        '-i',
        eval(`/${mysqlDatabase};/`),
        `${mysqlDatabase};\nDROP TABLE \`${controller}\`;\n/*`,
        destServerSqlControllerPath
      )
      shell.sed('-i', eval('/utf8mb4;/'), 'utf8mb4;\n*/', destServerSqlControllerPath)

      shell.exec(
        `mysql -u${mysqlUser} -p${mysqlPassword} -h${mysqlHost} -P${mysqlPort} < ${destServerSqlControllerPath}`
      )
    }

    rmFileSync(destServerSqlControllerPath)

    const optionsArr = [
      {
        from: /\n\s*\n/,
        to: '\n\n',
        files: [destClientReduxReducersAllPath]
      },
      {
        from: /Reducer,\s*\n/,
        to: 'Reducer,\n',
        files: [destClientReduxReducersAllPath]
      },
      {
        from: /'(.\/apis\/template.*?)'\)\s*\n/,
        to: "'./apis/template')\n\n",
        files: [destServerRestPath]
      },
      {
        from: /template\)\s*\n/,
        to: 'template)\n\n',
        files: [destServerRestPath]
      }
    ]

    setTimeout(() => {
      replaceInFileAll(optionsArr, 0, () => {
        console.log('special replace dest files finished')
      })
    }, 1000)
  } else {
    // pages
    const destPagesActionPath = resolve(`${destPagesControllerPath}/${action}.tsx`)

    // client redux
    const destClientReduxControllerActionPath = resolve(`${destClientReduxControllerPath}/${action}`)

    // client service
    const destClientActionPath = resolve(`${destClientServiceControllerPath}/${action}.ts`)

    // client styled
    const destClientStyledActionPath = resolve(`${destClientStyledControllerPath}/${action}.ts`)

    rmFileSync(destPagesActionPath)
    rmdirSync(destClientReduxControllerActionPath)
    rmFileSync(destClientActionPath)
    rmFileSync(destClientStyledActionPath)

    shell.sed('-i', eval(`/.*${controller}${firstUpperCase(action)}Reducer.*/`), '', destClientReduxReducersAllPath)

    const optionsArr = [
      {
        from: /\n\s*\n/,
        to: '\n\n',
        files: [destClientReduxReducersAllPath]
      },
      {
        from: /Reducer,\s*\n/,
        to: 'Reducer,\n',
        files: [destClientReduxReducersAllPath]
      }
    ]

    setTimeout(() => {
      replaceInFileAll(optionsArr, 0, () => {
        console.log('special replace dest files finished')
      })
    }, 1000)
  }
  console.log('delFiles finished')
}
