import { Command, CommandOptions } from '../types'
import { ArgumentParser } from '../parser'
import { Console, Prompt } from '../utils'
import { createFiles } from '../../generate'

export const createCommand: Command = {
  name: 'create',
  aliases: ['-c', '--create'],
  description: '创建控制器和操作',
  usage: 'nsgm create [controller] [action] [dictionary] [options]',
  examples: ['nsgm create', 'nsgm create user', 'nsgm create user manage', 'nsgm create user manage myproject'],
  options: [
    {
      name: 'controller',
      description: '控制器名称',
      required: false,
      type: 'string',
    },
    {
      name: 'action',
      description: '操作名称',
      default: 'manage',
      type: 'string',
    },
    {
      name: 'dictionary',
      description: '项目目录',
      default: '',
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
      // 智能判断是否使用交互模式：如果用户提供了 controller 参数，则自动使用非交互模式
      if (options.controller && options.controller.trim() !== '') {
        options.interactive = false
      }

      // 如果启用交互模式
      if (options.interactive) {
        const wizardResult = await Prompt.createControllerWizard()

        Console.separator()
        Console.title('📋 控制器配置确认')
        Console.info(`项目目录: ${wizardResult.dictionary}`)
        Console.info(`控制器名称: ${wizardResult.controller}`)
        Console.info(`功能模块: 完整CRUD + 导入导出 + 批量删除`)
        Console.info(`描述: ${wizardResult.description}`)
        Console.info(`数据库表: ${wizardResult.includeDatabase ? '是' : '否'}`)
        if (wizardResult.includeDatabase && wizardResult.fields.length > 0) {
          const fieldNames = wizardResult.fields.map((field) => field.name).join(', ')
          Console.info(`字段: ${fieldNames}`)
        }
        Console.separator()

        const confirmed = await Prompt.confirm('确认创建控制器？', true)
        if (!confirmed) {
          Console.warning('控制器创建已取消')
          process.exit(0)
        }

        // 更新选项
        options.controller = wizardResult.controller
        options.action = wizardResult.action
        options.dictionary = wizardResult.dictionary
        options.fields = wizardResult.fields
      }

      // 验证必需参数（仅在非交互模式下）
      if (!options.interactive) {
        const missing = ArgumentParser.validateRequired(options, ['controller'])
        if (missing.length > 0) {
          Console.error(`缺少必需参数: ${missing.join(', ')}`)
          Console.info('使用方法:')
          Console.info('  交互模式: nsgm create')
          Console.info('  命令行模式: nsgm create [controller] [action] [dictionary]')
          process.exit(1)
        }
      }

      const finalOptions = ArgumentParser.applyDefaults(options, {
        action: 'manage',
        dictionary: '',
      })

      Console.highlight(`🎯 创建控制器: ${finalOptions.controller}`)
      Console.info(`📝 操作: ${finalOptions.action}`)
      if (finalOptions.dictionary) {
        Console.info(`📁 目录: ${finalOptions.dictionary}`)
      }

      const spinner = Console.spinner('正在创建文件...', 'green')
      spinner.start()

      try {
        // 模拟创建过程
        await new Promise((resolve) => setTimeout(resolve, 800))

        createFiles(
          finalOptions.controller as string,
          finalOptions.action as string,
          finalOptions.dictionary as string,
          finalOptions.fields
        )

        spinner.succeed('控制器创建完成!')

        Console.newLine()
        Console.box(
          `控制器 "${finalOptions.controller}" 已创建成功!\n\n` +
            `操作: ${finalOptions.action}\n` +
            `路径: ${finalOptions.dictionary || './'}`,
          'success'
        )
      } catch (error) {
        spinner.fail('控制器创建失败')
        throw error
      }
    } catch (error) {
      Console.error(`创建失败: ${error}`)
      process.exit(1)
    }
  },
}
