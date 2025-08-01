#!/usr/bin/env node

/**
 * 密码哈希生成工具
 * 使用方法: node scripts/generate-password-hash.js your_password
 */

const bcrypt = require('bcrypt')

const password = process.argv[2]

if (!password) {
  console.log('使用方法: node scripts/generate-password-hash.js <password>')
  console.log('示例: node scripts/generate-password-hash.js mySecurePassword123')
  process.exit(1)
}

async function generateHash() {
  try {
    const saltRounds = 10
    const hash = await bcrypt.hash(password, saltRounds)
    
    console.log('='.repeat(50))
    console.log('密码哈希生成成功!')
    console.log('='.repeat(50))
    console.log(`原始密码: ${password}`)
    console.log(`哈希值: ${hash}`)
    console.log('='.repeat(50))
    console.log('请将以下内容添加到你的 .env 文件中:')
    console.log(`LOGIN_PASSWORD_HASH=${hash}`)
    console.log('='.repeat(50))
    console.log('⚠️  安全提醒:')
    console.log('1. 不要将原始密码存储在代码中')
    console.log('2. 不要将 .env 文件提交到版本控制系统')
    console.log('3. 定期更换密码')
    console.log('='.repeat(50))
  } catch (error) {
    console.error('生成哈希失败:', error)
    process.exit(1)
  }
}

generateHash()
