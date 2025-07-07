#!/bin/bash

echo "🚀 开始性能优化分析..."

# 1. 分析包大小
echo "📦 分析包大小..."
npm run analyze

# 2. 检查依赖更新
echo "🔍 检查依赖更新..."
npm outdated

# 3. 安全审计
echo "🔒 安全审计..."
npm audit

# 4. 构建时间分析
echo "⏱️  构建时间分析..."
time npm run build

# 5. 检查未使用的依赖
echo "🧹 检查未使用的依赖..."
if command -v depcheck &> /dev/null; then
    depcheck
else
    echo "💡 建议安装 depcheck: npm install -g depcheck"
fi

echo "✅ 性能分析完成！"
