import { Command, CommandOptions } from '../types'
import { ArgumentParser } from '../parser'
import { Console, Prompt } from '../utils'
import { deleteFiles } from '../../generate'

export const deleteCommand: Command = {
  name: 'delete',
  aliases: ['-d', '--delete'],
  description: '删除控制器和操作',
  usage: 'nsgm delete [controller] [action] [dictionary] [options]',
  examples: ['nsgm delete', 'nsgm delete user', 'nsgm delete user list', 'nsgm delete user all myproject'],
  options: [
    {
      name: 'controller',
      description: '控制器名称',
      required: false,
      type: 'string'
    },
    {
      name: 'action',
      description: '操作名称',
      default: 'all',
      type: 'string'
    },
    {
      name: 'dictionary',
      description: '项目目录',
      default: '',
      type: 'string'
    },
    {
      name: 'interactive',
      description: '使用交互式向导',
      default: true,
      type: 'boolean'
    }
  ],
  execute: async (options: CommandOptions) => {
    try {
      let deleteDatabase = false

      // 智能判断是否使用交互模式：如果用户提供了 controller 参数，则自动使用非交互模式
      if (options.controller && options.controller.trim() !== '') {
        options.interactive = false
      }

      // 如果启用交互模式
      if (options.interactive) {
        const wizardResult = await Prompt.deleteControllerWizard()

        Console.separator()
        Console.title('📋 删除确认')
        Console.info(`控制器名称: ${wizardResult.controller}`)
        Console.info(`删除范围: ${wizardResult.action === 'all' ? '所有相关文件' : '指定操作'}`)
        Console.info(`项目目录: ${wizardResult.dictionary}`)
        Console.info(`删除数据库: ${wizardResult.deleteDatabase ? '是' : '否'}`)
        Console.separator()

        const confirmed = await Prompt.confirm('确认删除？此操作不可恢复！', false)
        if (!confirmed) {
          Console.warning('删除操作已取消')
          process.exit(0)
        }

        // 更新选项
        options.controller = wizardResult.controller
        options.action = wizardResult.action
        options.dictionary = wizardResult.dictionary
        deleteDatabase = wizardResult.deleteDatabase
      }

      // 验证必需参数（仅在非交互模式下）
      if (!options.interactive) {
        const missing = ArgumentParser.validateRequired(options, ['controller'])
        if (missing.length > 0) {
          Console.error(`缺少必需参数: ${missing.join(', ')}`)
          Console.info('使用方法:')
          Console.info('  交互模式: nsgm delete')
          Console.info('  命令行模式: nsgm delete [controller] [action] [dictionary]')
          process.exit(1)
        }
      }

      const finalOptions = ArgumentParser.applyDefaults(options, {
        action: 'all',
        dictionary: ''
      })

      Console.highlight(`🗑️ 删除控制器: ${finalOptions.controller}`)
      Console.info(`📝 操作: ${finalOptions.action}`)
      if (finalOptions.dictionary) {
        Console.info(`📁 目录: ${finalOptions.dictionary}`)
      }

      const spinner = Console.spinner('正在删除文件...', 'red')
      spinner.start()

      try {
        await new Promise((resolve) => setTimeout(resolve, 500))

        deleteFiles(
          finalOptions.controller as string,
          finalOptions.action as string,
          deleteDatabase,
          finalOptions.dictionary as string
        )

        spinner.succeed('删除完成!')

        Console.newLine()
        Console.box(
          `控制器 "${finalOptions.controller}" 已删除成功!\n\n` +
            `操作: ${finalOptions.action}\n` +
            `路径: ${finalOptions.dictionary || './'}${deleteDatabase ? '\n数据库表: 已删除' : ''}`,
          'success'
        )
      } catch (error) {
        spinner.fail('删除失败')
        throw error
      }
    } catch (error) {
      Console.error(`删除失败: ${error}`)
      process.exit(1)
    }
  }
}

export const deleteDbCommand: Command = {
  name: 'deletedb',
  aliases: ['-db', '--deletedb'],
  description: '删除控制器、操作和相关数据库',
  usage: 'nsgm deletedb <controller> [action]',
  examples: ['nsgm deletedb user', 'nsgm deletedb user list'],
  options: [
    {
      name: 'controller',
      description: '控制器名称',
      required: true,
      type: 'string'
    },
    {
      name: 'action',
      description: '操作名称',
      default: 'all',
      type: 'string'
    }
  ],
  execute: async (options: CommandOptions) => {
    try {
      // 验证必需参数
      const missing = ArgumentParser.validateRequired(options, ['controller'])
      if (missing.length > 0) {
        console.error(`❌ 缺少必需参数: ${missing.join(', ')}`)
        console.log('使用方法: nsgm deletedb <controller> [action]')
        process.exit(1)
      }

      const finalOptions = ArgumentParser.applyDefaults(options, {
        action: 'all'
      })

      console.log(`🗑️  删除控制器和数据库: ${finalOptions.controller}`)
      console.log(`📝 操作: ${finalOptions.action}`)

      deleteFiles(finalOptions.controller as string, finalOptions.action as string, true, '')

      console.log('✅ 删除完成!')
    } catch (error) {
      console.error('❌ 删除失败:', error)
      process.exit(1)
    }
  }
}
