import { Command, CommandOptions } from '../types'
import { startExpress } from '../../index'

export const devCommand: Command = {
  name: 'dev',
  aliases: [],
  description: '开发模式启动服务器',
  usage: 'nsgm dev',
  examples: ['nsgm dev'],
  execute: async (_options: CommandOptions) => {
    console.log('🚀 启动开发服务器...')
    startExpress({ dev: true }, undefined, 'dev')
  }
}

export const startCommand: Command = {
  name: 'start',
  aliases: [],
  description: '生产模式启动服务器',
  usage: 'nsgm start',
  examples: ['nsgm start'],
  execute: async (_options: CommandOptions) => {
    console.log('🌟 启动生产服务器...')
    startExpress({ dev: false }, undefined, 'start')
  }
}
