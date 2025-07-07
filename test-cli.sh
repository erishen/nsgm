#!/bin/bash

# NSGM CLI 测试脚本
echo "🚀 开始测试 nsgm CLI 工具..."

# 测试基本命令
echo "📋 测试基本命令："
echo "1. 版本信息："
./lib/index.js version

echo ""
echo "2. 帮助信息："
./lib/index.js help

# 测试错误处理
echo ""
echo "📋 测试错误处理："
echo "3. 无效命令："
./lib/index.js invalid-command 2>&1 || echo "✅ 错误处理正常"

# 测试 npm scripts
echo ""
echo "📋 测试 npm scripts："
echo "4. 通过 npm run 测试："
npm run help > /dev/null 2>&1 && echo "✅ npm run help 正常工作"

# 创建临时测试目录
TEST_DIR="/tmp/nsgm-test-$(date +%s)"
mkdir -p "$TEST_DIR"
cd "$TEST_DIR"

echo ""
echo "📋 测试项目初始化："
echo "5. 在临时目录中测试:"
echo "测试目录: $TEST_DIR"

echo ""
echo "🧹 清理测试目录："
cd /Users/lsun4/Workspace/lsun4/nsgm
rm -rf "$TEST_DIR"

echo ""
echo "✅ CLI 测试完成！"
echo ""
echo "💡 使用方法："
echo "   方法1: ./lib/index.js [command]"
echo "   方法2: npm run [command]"
echo "   方法3: npx nsgm [command]"
