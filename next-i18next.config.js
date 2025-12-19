const path = require('path');

/**
 * @type {import('next-i18next').UserConfig}
 */
module.exports = {
  i18n: {
    defaultLocale: 'zh-CN',
    locales: ['zh-CN', 'en-US', 'ja-JP'],
    localeDetection: false,
  },
  localePath: typeof window === 'undefined' ? path.resolve('./public/locales') : '/locales',
  saveMissing: false,
  strictMode: false, // 在生产环境中禁用严格模式
  serializeConfig: false,
  react: {
    useSuspense: false,
  },
  // 在 serverless 环境中使用
  reloadOnPrerender: process.env.NODE_ENV === 'development',
}
