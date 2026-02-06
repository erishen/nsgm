# 使用配置文件创建模块

## 概述

nsgm-cli 现在支持从 JSON 配置文件批量创建模块，这对于大型项目和多模块管理非常有用。

## 新增命令：`nsgm create-config`

### 命令格式

```bash
nsgm create-config <config-file> [options]
```

### 参数说明

| 参数 | 说明 |
|------|------|
| `<config-file>` | 配置文件路径（必需） |
| `--module <name>` | 创建指定模块 |
| `--all` | 创建所有模块（默认行为） |
| `--dry-run` | 预览模式，只显示不创建 |

### 使用示例

#### 1. 创建所有模块

```bash
nsgm create-config config/modules.json
```

#### 2. 创建指定模块

```bash
nsgm create-config config/modules.json --module product
```

#### 3. 预览模式

```bash
nsgm create-config config/modules.json --dry-run
```

## 配置文件格式

配置文件必须是 JSON 数组，包含一个或多个模块配置。

### 单模块配置

```json
{
  "controller": "product",
  "action": "manage",
  "dictionary": ".",
  "fields": [
    {
      "name": "name",
      "type": "varchar",
      "length": 255,
      "required": true,
      "comment": "商品名称",
      "showInList": true,
      "showInForm": true,
      "searchable": true
    }
  ]
}
```

### 多模块配置

```json
[
  {
    "controller": "product",
    "action": "manage",
    "dictionary": ".",
    "fields": [...]
  },
  {
    "controller": "category",
    "action": "manage",
    "dictionary": ".",
    "fields": [...]
  }
]
```

## 配置项说明

### 模块级别配置

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| controller | string | 是 | 控制器名称 |
| action | string | 否 | 操作名称，默认 "manage" |
| dictionary | string | 否 | 目标目录，默认 "." |

### 字段定义

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| name | string | 是 | 字段名称 |
| type | string | 是 | 字段类型 |
| length | string/number | 否 | 字段长度（varchar/decimal 类型需要） |
| required | boolean | 否 | 是否必填 |
| comment | string | 是 | 字段注释 |
| showInList | boolean | 否 | 是否在列表显示 |
| showInForm | boolean | 否 | 是否在表单显示 |
| searchable | boolean | 否 | 是否可搜索 |
| isPrimaryKey | boolean | 否 | 是否主键 |
| isAutoIncrement | boolean | 否 | 是否自增 |
| isSystemField | boolean | 否 | 是否系统字段 |

## 支持的字段类型

- `varchar` - 字符串类型（需要 length）
- `text` - 长文本类型
- `integer` - 整数类型
- `decimal` - 小数类型（需要 length，格式 "10,2"）
- `boolean` - 布尔类型
- `date` - 日期类型
- `datetime` - 日期时间类型
- `timestamp` - 时间戳类型

## 命名规范

### 数据库字段命名

推荐使用**蛇形命名（snake_case）**：

✅ 正确示例：
```json
{
  "name": "user_id",
  "name": "total_amount",
  "name": "payment_method"
}
```

❌ 不推荐：
```json
{
  "name": "userId",
  "name": "totalAmount",
  "name": "paymentMethod"
}
```

## 完整示例

### 电商系统配置

`config/ecommerce.json`:

```json
[
  {
    "controller": "category",
    "action": "manage",
    "dictionary": ".",
    "fields": [
      {
        "name": "id",
        "type": "integer",
        "required": true,
        "comment": "主键",
        "isPrimaryKey": true,
        "isAutoIncrement": true
      },
      {
        "name": "name",
        "type": "varchar",
        "length": 100,
        "required": true,
        "comment": "分类名称",
        "showInList": true,
        "showInForm": true,
        "searchable": true
      },
      {
        "name": "description",
        "type": "text",
        "required": false,
        "comment": "分类描述",
        "showInList": false,
        "showInForm": true
      },
      {
        "name": "parent_id",
        "type": "integer",
        "required": false,
        "comment": "父分类ID",
        "showInList": true,
        "showInForm": true
      },
      {
        "name": "sort_order",
        "type": "integer",
        "required": true,
        "comment": "排序",
        "showInList": true,
        "showInForm": true
      },
      {
        "name": "status",
        "type": "varchar",
        "length": 20,
        "required": true,
        "comment": "状态",
        "showInList": true,
        "showInForm": true
      }
    ]
  },
  {
    "controller": "order",
    "action": "manage",
    "dictionary": ".",
    "fields": [
      {
        "name": "id",
        "type": "integer",
        "required": true,
        "comment": "主键",
        "isPrimaryKey": true,
        "isAutoIncrement": true
      },
      {
        "name": "order_no",
        "type": "varchar",
        "length": 50,
        "required": true,
        "comment": "订单号",
        "showInList": true,
        "showInForm": true,
        "searchable": true
      },
      {
        "name": "user_id",
        "type": "integer",
        "required": true,
        "comment": "用户ID",
        "showInList": true,
        "showInForm": false
      },
      {
        "name": "total_amount",
        "type": "decimal",
        "required": true,
        "comment": "订单总金额",
        "showInList": true,
        "showInForm": true
      },
      {
        "name": "status",
        "type": "varchar",
        "length": 20,
        "required": true,
        "comment": "订单状态",
        "showInList": true,
        "showInForm": true
      },
      {
        "name": "payment_method",
        "type": "varchar",
        "length": 50,
        "required": false,
        "comment": "支付方式",
        "showInList": true,
        "showInForm": true
      },
      {
        "name": "shipping_address",
        "type": "text",
        "required": false,
        "comment": "收货地址",
        "showInList": false,
        "showInForm": true
      }
    ]
  }
]
```

### 使用配置文件

```bash
# 创建所有模块
nsgm create-config config/ecommerce.json

# 只创建 category 模块
nsgm create-config config/ecommerce.json --module category

# 预览将要创建的模块
nsgm create-config config/ecommerce.json --dry-run
```

## 与传统方式的对比

### 传统方式（交互式）

```bash
nsgm create
# 然后逐个输入：项目目录、控制器名称、字段定义...
```

**缺点：**
- ❌ 需要手动逐个输入字段
- ❌ 重复工作量大
- ❌ 容易出错
- ❌ 无法批量创建

### 传统方式（命令行）

```bash
nsgm create product manage .
# 使用默认字段，无法自定义
```

**缺点：**
- ❌ 只能使用默认字段
- ❌ 无法自定义字段属性

### 新方式（配置文件）

```bash
nsgm create-config config/modules.json
# 一次性创建所有模块，支持完全自定义
```

**优点：**
- ✅ 支持批量创建
- ✅ 完全自定义字段
- ✅ 可版本控制
- ✅ 可重复使用
- ✅ 减少重复工作

## 最佳实践

### 1. 配置文件管理

建议将配置文件放在项目根目录的 `config/` 目录下：

```
project/
├── config/
│   ├── modules.json          # 所有模块配置
│   ├── core-modules.json     # 核心模块
│   └── feature-modules.json  # 功能模块
└── ...
```

### 2. 模块分类

可以按照功能域分类配置：

- **核心模块**：user, role, permission
- **业务模块**：product, order, payment
- **系统模块**：log, config, setting

### 3. 字段命名约定

始终使用蛇形命名（snake_case）：

- 单词之间用下划线连接
- 全部小写
- 避免使用驼峰命名

### 4. 字段属性设置

- `showInList`: 用于列表页面的列
- `showInForm`: 用于表单的输入框
- `searchable`: 允许字段搜索（通常用于 varchar 类型）
- `required`: 数据库 NOT NULL 约束

## 故障排查

### 配置文件格式错误

**错误信息：** `配置文件格式错误：必须是一个数组`

**解决方法：** 确保配置文件是 JSON 数组格式

```json
[
  { "controller": "module1", ... },
  { "controller": "module2", ... }
]
```

### 模块未找到

**错误信息：** `未找到模块: xxx`

**解决方法：** 检查模块名称拼写，或使用 `--all` 创建所有模块

### SQL 执行失败

**错误信息：** `Failed to execute dynamic SQL script`

**解决方法：**
1. 检查 `mysql.config.js` 配置
2. 确认数据库连接正常
3. 检查 SQL 文件内容

## 版本要求

- **nsgm-cli**: 2.1.23 及以上
- **Node.js**: 16 及以上

## 总结

使用 `nsgm create-config` 命令可以：

1. ✅ 批量创建多个模块
2. ✅ 完全自定义字段定义
3. ✅ 支持配置文件版本控制
4. ✅ 减少重复输入工作
5. ✅ 提高开发效率

这是大型项目和团队协作的理想选择！
