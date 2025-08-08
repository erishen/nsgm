/**
 * Example test file to demonstrate Jest configuration
 * This file can be removed or modified according to your project needs
 */

describe('Jest Configuration Test', () => {
  test('Jest is properly configured', () => {
    expect(true).toBe(true)
  })

  test('Basic math operations', () => {
    expect(2 + 2).toBe(4)
    expect(5 * 3).toBe(15)
    expect(10 / 2).toBe(5)
  })

  test('String operations', () => {
    const testString = 'Hello, World!'
    expect(testString).toContain('World')
    expect(testString.length).toBe(13)
  })

  test('Array operations', () => {
    const testArray = [1, 2, 3, 4, 5]
    expect(testArray).toHaveLength(5)
    expect(testArray).toContain(3)
    expect(testArray[0]).toBe(1)
  })

  test('Object operations', () => {
    const testObject = {
      name: 'Test',
      version: '1.0.0',
      active: true
    }

    expect(testObject).toHaveProperty('name')
    expect(testObject.name).toBe('Test')
    expect(testObject.active).toBeTruthy()
  })
})
