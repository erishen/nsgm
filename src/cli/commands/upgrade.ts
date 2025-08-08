import { Command, CommandOptions } from '../types'
import { ArgumentParser } from '../parser'
import { initFiles } from '../../generate'

export const upgradeCommand: Command = {
  name: 'upgrade',
  aliases: ['-u', '--upgrade'],
  description: '升级 NSGM 项目',
  usage: 'nsgm upgrade [dictionary]',
  examples: ['nsgm upgrade', 'nsgm upgrade myproject'],
  options: [
    {
      name: 'dictionary',
      description: '项目目录名称',
      default: '',
      type: 'string',
    },
  ],
  execute: async (options: CommandOptions) => {
    try {
      const finalOptions = ArgumentParser.applyDefaults(options, {
        dictionary: '',
      })

      console.log('⬆️  升级 NSGM 项目...')
      if (finalOptions.dictionary) {
        console.log(`📁 目录: ${finalOptions.dictionary}`)
      }

      initFiles(finalOptions.dictionary as string, true)
      console.log('✅ 升级完成!')

      process.exit(0)
    } catch (error) {
      console.error('❌ 升级失败:', error)
      process.exit(1)
    }
  },
}
