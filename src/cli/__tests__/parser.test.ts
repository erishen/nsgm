import { ArgumentParser } from '../parser'

// Mock process.exit before importing any CLI modules
const mockExit = jest.fn()
const originalExit = process.exit
process.exit = mockExit as any

describe('ArgumentParser 测试', () => {
  beforeEach(() => {
    mockExit.mockClear()
  })

  afterAll(() => {
    process.exit = originalExit
  })

  test('应该正确解析基本命令', () => {
    const result = ArgumentParser.parse(['help'])
    expect(result.command).toBe('help')
    expect(result.options).toEqual({})
  })

  test('应该正确解析带参数的命令', () => {
    const result = ArgumentParser.parse(['create', 'user', 'manage'])
    expect(result.command).toBe('create')
    expect(result.options.controller).toBe('user')
    expect(result.options.action).toBe('manage')
  })

  test('应该正确解析 key=value 格式参数', () => {
    const result = ArgumentParser.parse(['export', 'dictionary=webapp'])
    expect(result.command).toBe('export')
    expect(result.options.dictionary).toBe('webapp')
  })

  test('应该正确解析 --key value 格式参数', () => {
    const result = ArgumentParser.parse(['init', '--dictionary', 'myproject'])
    expect(result.command).toBe('init')
    expect(result.options.dictionary).toBe('myproject')
  })

  test('应该验证必需参数', () => {
    const missing = ArgumentParser.validateRequired({}, ['controller'])
    expect(missing).toEqual(['controller'])
  })

  test('应该应用默认值', () => {
    const options = ArgumentParser.applyDefaults({ controller: 'user' }, { action: 'manage', dictionary: '' })
    expect(options).toEqual({
      controller: 'user',
      action: 'manage',
      dictionary: '',
    })
  })
})
