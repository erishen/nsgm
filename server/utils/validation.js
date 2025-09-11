/**
 * 通用验证工具
 */

/**
 * 验证并转换整数值
 * @param {*} value - 要验证的值
 * @param {string} fieldName - 字段名称，用于错误信息
 * @param {Object} options - 验证选项
 * @param {number} options.min - 最小值
 * @param {number} options.max - 最大值
 * @param {boolean} options.required - 是否必填
 * @returns {number|undefined} 验证后的整数值
 */
const validateInteger = (value, fieldName = 'value', options = {}) => {
  const { min = Number.MIN_SAFE_INTEGER, max = Number.MAX_SAFE_INTEGER, required = false } = options

  // 如果值为空或未定义
  if (value === undefined || value === null || value === '') {
    if (required) {
      throw new Error(`${fieldName}是必填字段`)
    }
    return undefined
  }

  let numericValue = value

  // 如果是字符串，尝试转换为数字
  if (typeof value === 'string') {
    numericValue = parseInt(value.trim(), 10)
    if (isNaN(numericValue)) {
      throw new Error(`${fieldName}必须是数字，收到的值: "${value}"`)
    }
  }

  // 验证是否为整数
  if (!Number.isInteger(numericValue)) {
    throw new Error(`${fieldName}必须是整数，收到的值: ${value}`)
  }

  // 验证范围
  if (numericValue < min || numericValue > max) {
    throw new Error(`${fieldName}必须在${min}-${max}之间，收到的值: ${value}`)
  }

  return numericValue
}

/**
 * 验证并转换浮点数值
 * @param {*} value - 要验证的值
 * @param {string} fieldName - 字段名称，用于错误信息
 * @param {Object} options - 验证选项
 * @param {number} options.min - 最小值
 * @param {number} options.max - 最大值
 * @param {boolean} options.required - 是否必填
 * @returns {number|undefined} 验证后的浮点数值
 */
const validateFloat = (value, fieldName = 'value', options = {}) => {
  const { min = Number.MIN_SAFE_INTEGER, max = Number.MAX_SAFE_INTEGER, required = false } = options

  // 如果值为空或未定义
  if (value === undefined || value === null || value === '') {
    if (required) {
      throw new Error(`${fieldName}是必填字段`)
    }
    return undefined
  }

  let numericValue = value

  // 如果是字符串，尝试转换为数字
  if (typeof value === 'string') {
    numericValue = parseFloat(value.trim())
    if (isNaN(numericValue)) {
      throw new Error(`${fieldName}必须是数字，收到的值: "${value}"`)
    }
  }

  // 验证是否为有效数字
  if (!Number.isFinite(numericValue)) {
    throw new Error(`${fieldName}必须是有效数字，收到的值: ${value}`)
  }

  // 验证范围
  if (numericValue < min || numericValue > max) {
    throw new Error(`${fieldName}必须在${min}-${max}之间，收到的值: ${value}`)
  }

  return numericValue
}

/**
 * 验证字符串
 * @param {*} value - 要验证的值
 * @param {string} fieldName - 字段名称，用于错误信息
 * @param {Object} options - 验证选项
 * @param {number} options.minLength - 最小长度
 * @param {number} options.maxLength - 最大长度
 * @param {boolean} options.required - 是否必填
 * @param {RegExp} options.pattern - 正则表达式模式
 * @returns {string|undefined} 验证后的字符串值
 */
const validateString = (value, fieldName = 'value', options = {}) => {
  const { minLength = 0, maxLength = Infinity, required = false, pattern } = options

  // 如果值为空或未定义
  if (value === undefined || value === null || value === '') {
    if (required) {
      throw new Error(`${fieldName}是必填字段`)
    }
    return undefined
  }

  const stringValue = String(value).trim()

  // 验证长度
  if (stringValue.length < minLength) {
    throw new Error(`${fieldName}长度不能少于${minLength}个字符`)
  }

  if (stringValue.length > maxLength) {
    throw new Error(`${fieldName}长度不能超过${maxLength}个字符`)
  }

  // 验证正则表达式
  if (pattern && !pattern.test(stringValue)) {
    throw new Error(`${fieldName}格式不正确`)
  }

  return stringValue
}

/**
 * 验证分页参数
 * @param {*} page - 页码
 * @param {*} pageSize - 页面大小
 * @returns {Object} 验证后的分页参数
 */
const validatePagination = (page, pageSize) => {
  const validPage = validateInteger(page, 'page', { min: 0, max: 999999 }) || 0
  const validPageSize = validateInteger(pageSize, 'pageSize', { min: 1, max: 100 }) || 10

  return { page: validPage, pageSize: validPageSize }
}

/**
 * 验证 ID 参数
 * @param {*} id - ID值
 * @param {string} fieldName - 字段名称
 * @returns {number} 验证后的ID
 */
const validateId = (id, fieldName = 'ID') => {
  return validateInteger(id, fieldName, { min: 1, required: true })
}

module.exports = {
  validateInteger,
  validateFloat,
  validateString,
  validatePagination,
  validateId
}
