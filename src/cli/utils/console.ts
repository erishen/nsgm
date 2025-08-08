import chalk from 'chalk'

/**
 * 控制台输出工具类
 */
export class Console {
  /**
   * 成功消息
   */
  static success(message: string): void {
    console.log(chalk.green('✅ ') + chalk.white(message))
  }

  /**
   * 错误消息
   */
  static error(message: string): void {
    console.log(chalk.red('❌ ') + chalk.white(message))
  }

  /**
   * 警告消息
   */
  static warning(message: string): void {
    console.log(chalk.yellow('⚠️  ') + chalk.white(message))
  }

  /**
   * 信息消息
   */
  static info(message: string): void {
    console.log(chalk.blue('ℹ️  ') + chalk.white(message))
  }

  /**
   * 调试消息
   */
  static debug(message: string): void {
    console.log(chalk.gray('🐛 ') + chalk.gray(message))
  }

  /**
   * 标题
   */
  static title(message: string): void {
    console.log(chalk.bold.blue(message))
  }

  /**
   * 副标题
   */
  static subtitle(message: string): void {
    console.log(chalk.cyan(message))
  }

  /**
   * 突出显示
   */
  static highlight(message: string): void {
    console.log(chalk.bold.yellow(message))
  }

  /**
   * 分隔线
   */
  static separator(): void {
    console.log(chalk.gray('─'.repeat(50)))
  }

  /**
   * 空行
   */
  static newLine(count = 1): void {
    console.log('\n'.repeat(count - 1))
  }

  /**
   * 简单的加载动画
   */
  static spinner(
    text: string,
    color: 'red' | 'green' | 'yellow' | 'blue' | 'magenta' | 'cyan' | 'white' = 'cyan'
  ): {
    start(): void
    stop(): void
    succeed(message?: string): void
    fail(message?: string): void
  } {
    let spinnerInterval: NodeJS.Timeout | null = null
    const frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏']
    let currentFrame = 0

    return {
      start(): void {
        process.stdout.write(chalk[color](`${frames[0]} ${text}`))
        spinnerInterval = setInterval(() => {
          currentFrame = (currentFrame + 1) % frames.length
          process.stdout.write(`\r${chalk[color](`${frames[currentFrame]} ${text}`)}`)
        }, 100)
      },
      stop(): void {
        if (spinnerInterval) {
          clearInterval(spinnerInterval)
          spinnerInterval = null
          process.stdout.write(`\r${' '.repeat(text.length + 2)}\r`)
        }
      },
      succeed(message?: string): void {
        this.stop()
        Console.success(message || text)
      },
      fail(message?: string): void {
        this.stop()
        Console.error(message || text)
      }
    }
  }

  /**
   * 带边框的消息
   */
  static box(message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info'): void {
    const colors = {
      success: chalk.green,
      error: chalk.red,
      warning: chalk.yellow,
      info: chalk.blue
    }

    const icons = {
      success: '✅',
      error: '❌',
      warning: '⚠️',
      info: 'ℹ️'
    }

    const color = colors[type]
    const icon = icons[type]
    const lines = message.split('\n')
    const maxLength = Math.max(...lines.map((line) => line.length))
    const border = '─'.repeat(maxLength + 4)

    console.log(color(`┌${border}┐`))
    console.log(color(`│ ${icon}  ${' '.repeat(maxLength - 1)} │`))
    lines.forEach((line) => {
      const padding = ' '.repeat(maxLength - line.length)
      console.log(color(`│  ${line}${padding}  │`))
    })
    console.log(color(`└${border}┘`))
  }

  /**
   * 进度条（简单版本）
   */
  static progress(current: number, total: number, description = ''): void {
    const percentage = Math.round((current / total) * 100)
    const completed = Math.round((current / total) * 20)
    const remaining = 20 - completed

    const progressBar = chalk.green('█'.repeat(completed)) + chalk.gray('░'.repeat(remaining))
    const text = description ? ` ${description}` : ''

    process.stdout.write(`\r[${progressBar}] ${percentage}%${text}`)

    if (current === total) {
      console.log() // 换行
    }
  }
}
