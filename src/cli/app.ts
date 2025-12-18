import { ArgumentParser } from "./parser";
import { CommandRegistry } from "./registry";
import { Console } from "./utils";

/**
 * CLI 应用程序主类
 */
export class CliApp {
  private registry: CommandRegistry;

  constructor() {
    this.registry = new CommandRegistry();
  }

  /**
   * 运行 CLI 应用
   */
  async run(args: string[] = process.argv.slice(2)): Promise<void> {
    try {
      const { command, options } = ArgumentParser.parse(args);

      // 查找命令
      const cmd = this.registry.get(command);

      if (!cmd) {
        Console.error(`未知命令: ${command}`);
        Console.info('使用 "nsgm help" 查看可用命令');
        Console.newLine();

        // 提供建议的命令
        const availableCommands = this.registry.getAllCommands().map((c) => c.name);
        const suggestions = this.findSimilarCommands(command, availableCommands);

        if (suggestions.length > 0) {
          Console.subtitle("你是否想要运行:");
          suggestions.forEach((suggestion) => {
            console.log(`   nsgm ${suggestion}`);
          });
        }

        process.exit(1);
      }

      // 应用命令选项的默认值
      const finalOptions = this.applyCommandDefaults(cmd, options);

      // 执行命令
      await cmd.execute(finalOptions);
    } catch (error) {
      Console.error(`执行命令时发生错误: ${error}`);
      Console.debug('使用 "nsgm help" 查看帮助信息');
      process.exit(1);
    }
  }

  /**
   * 查找相似的命令（简单的字符串匹配）
   */
  private findSimilarCommands(input: string, commands: string[]): string[] {
    const suggestions: string[] = [];

    // 查找包含输入字符的命令
    for (const cmd of commands) {
      if (cmd.includes(input) || input.includes(cmd)) {
        suggestions.push(cmd);
      }
    }

    // 如果没有找到，查找第一个字符相同的
    if (suggestions.length === 0) {
      for (const cmd of commands) {
        if (cmd[0] === input[0]) {
          suggestions.push(cmd);
        }
      }
    }

    return suggestions.slice(0, 3); // 最多返回3个建议
  }

  /**
   * 应用命令默认值
   */
  private applyCommandDefaults(cmd: any, options: any): any {
    const result = { ...options };

    // 应用命令选项中定义的默认值
    if (cmd.options) {
      for (const option of cmd.options) {
        if (option.default !== undefined && (result[option.name] === undefined || result[option.name] === "")) {
          result[option.name] = option.default;
        }
      }
    }

    return result;
  }

  /**
   * 获取命令注册表（用于测试）
   */
  getRegistry(): CommandRegistry {
    return this.registry;
  }
}

/**
 * 创建并运行 CLI 应用的便捷函数
 */
export async function runCli(args?: string[]): Promise<void> {
  const app = new CliApp();
  await app.run(args);
}
