import { Command } from '../types'
import { Console } from '../utils'

export const helpCommand: Command = {
  name: 'help',
  aliases: ['-h', '--help'],
  description: '显示帮助信息',
  usage: 'nsgm help [command]',
  examples: ['nsgm help', 'nsgm help create'],
  execute: async () => {
    Console.title('🎉 Welcome to use NSGM')
    Console.newLine()

    Console.subtitle('📖 使用方法:')
    console.log('   nsgm <command> [options]')
    Console.newLine()

    Console.subtitle('🛠️  可用命令:')
    console.log('   help, -h, --help           显示帮助信息')
    console.log('   version, -v, --version     显示版本信息')
    console.log('   init, -i, --init          初始化项目 [dictionary]')
    console.log('   upgrade, -u, --upgrade     升级项目')
    console.log('   create, -c, --create       创建控制器 <controller> [action] [dictionary]')
    console.log('   delete, -d, --delete       删除控制器 <controller> [action] [dictionary]')
    console.log('   deletedb, -db, --deletedb  删除控制器和数据库 <controller> [action]')
    console.log('   dev                        开发模式启动')
    console.log('   build                      构建生产版本')
    console.log('   start                      生产模式启动')
    console.log('   export                     导出静态网站 [dictionary]')
    Console.newLine()

    Console.subtitle('💡 示例:')
    console.log('   nsgm init myproject        # 初始化项目到 myproject 目录')
    console.log('   nsgm create user           # 创建 user 控制器，默认 manage 操作')
    console.log('   nsgm create user list      # 创建 user 控制器的 list 操作')
    console.log('   nsgm dev                   # 开发模式启动')
    console.log('   nsgm build                 # 构建生产版本')
    console.log('   nsgm export webapp         # 导出到 webapp 目录')
    Console.newLine()

    Console.highlight('🎈 Happy to use!')
    Console.info('❓ If you have questions, please contact Erishen (787058731@qq.com)')

    process.exit(0)
  },
}
