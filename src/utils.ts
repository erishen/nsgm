import fs from 'fs'
import { resolve } from 'path'
import replace from 'replace'
import { replaceInFile } from 'replace-in-file'

const mkdirFlag = true
const copyFileFlag = true
const replaceFlag = true
const replaceInFileFlag = true
const rmdirFlag = true
const rmfileFlag = true

export const firstUpperCase = (word: string) => {
  return word.substring(0, 1).toUpperCase() + word.substring(1)
}

export const mkdirSync = (dirPath: string) => {
  if (mkdirFlag) {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath)
    }
  }
}

export const rmFileSync = (filePath: string) => {
  if (rmfileFlag) {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
    }
  }
}

export const rmdirSync = (dirPath: string) => {
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

export const copyFileSync = (source: string, dest: string, upgradeFlag = false) => {
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

export const handleReplace = ({ regex, replacement, paths }: any) => {
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

export const replaceInFileAll = async (array: any, index = 0, callback: any) => {
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
    } else {
      return callback?.()
    }
  } else {
    return callback?.()
  }
}
