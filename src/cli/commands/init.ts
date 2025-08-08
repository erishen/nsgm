import { Command, CommandOptions, ProjectConfig } from '../types'
import { ArgumentParser } from '../parser'
import { Console, Prompt } from '../utils'
import { initFiles } from '../../generate'

export const initCommand: Command = {
  name: 'init',
  aliases: ['-i', '--init'],
  description: '初始化 NSGM 项目',
  usage: 'nsgm init [dictionary] [options]',
  examples: ['nsgm init', 'nsgm init myproject', 'nsgm init --dictionary=myproject'],
  options: [
    {
      name: 'dictionary',
      description: '项目目录名称',
      default: '.',
      type: 'string',
    },
    {
      name: 'interactive',
      description: '使用交互式向导',
      default: true,
      type: 'boolean',
    },
  ],
  execute: async (options: CommandOptions) => {
    try {
      let projectConfig: ProjectConfig | undefined

      // 智能判断是否使用交互模式：如果用户提供了 dictionary 参数且不是默认值，则自动使用非交互模式
      if (options.dictionary && options.dictionary !== '.') {
        options.interactive = false
      }

      // 如果启用交互模式
      if (options.interactive) {
        const wizardResult = await Prompt.initWizard()

        Console.separator()
        Console.title('📋 项目配置确认')
        Console.info(`项目名称: ${wizardResult.projectName}`)
        Console.info(`项目描述: ${wizardResult.description}`)
        Console.info(`作者: ${wizardResult.author}`)
        Console.info(`数据库: ${wizardResult.database ? '是' : '否'}`)
        Console.info(`功能: ${wizardResult.features.join(', ')}`)
        Console.separator()

        const confirmed = await Prompt.confirm('确认创建项目？', true)
        if (!confirmed) {
          Console.warning('项目创建已取消')
          process.exit(0)
        }

        options.dictionary = wizardResult.projectName
        projectConfig = wizardResult
      }

      const finalOptions = ArgumentParser.applyDefaults(options, {
        dictionary: '.',
      })

      // 检查是否需要跳过初始化（保持原有逻辑）
      let initFlag = true
      const argvArr = process.argv
      const argvArrLen = argvArr.length

      let fileName = ''
      if (argvArrLen > 2) {
        fileName = argvArr[2]
      } else if (argvArrLen > 1) {
        fileName = argvArr[1]
      }

      if (fileName !== '') {
        if (fileName.indexOf('\\') !== -1) {
          fileName = fileName.replace(/\\/g, '/')
        }

        const fileNameArr = fileName.split('/')
        const fileNameArrLen = fileNameArr.length
        const fileNameStr = fileNameArr[fileNameArrLen - 1]
        if (fileNameStr === 'app') {
          initFlag = false
        }

        for (const item of fileNameArr) {
          if (item === 'pm2') {
            initFlag = false
            break
          }
        }
      }

      if (initFlag) {
        const spinner = Console.spinner('正在初始化项目...', 'cyan')
        spinner.start()

        try {
          await new Promise((resolve) => setTimeout(resolve, 1000)) // 模拟初始化时间
          initFiles(finalOptions.dictionary || '.', false, projectConfig)

          spinner.succeed(`项目初始化完成! 目录: ${finalOptions.dictionary}`)

          Console.newLine()
          Console.box(
            `项目已成功创建到 ${finalOptions.dictionary} 目录\n\n` +
              `下一步:\n` +
              `1. cd ${finalOptions.dictionary}\n` +
              `2. cp .env.example .env\n` +
              `3. npm run generate-password yourPassword\n` +
              `4. modify .env LOGIN_PASSWORD_HASH=yourEncryptedPassword\n` +
              `5. npm run dev`,
            'success'
          )
        } catch (error) {
          spinner.fail('项目初始化失败')
          throw error
        }
      } else {
        Console.warning('跳过初始化（检测到特殊环境）')
      }

      process.exit(0)
    } catch (error) {
      Console.error(`初始化失败: ${error}`)
      process.exit(1)
    }
  },
}
