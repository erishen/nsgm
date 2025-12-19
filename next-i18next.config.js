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
  strictMode: false,
  serializeConfig: true, // 序列化配置到页面中，避免抖动
  react: {
    useSuspense: false,
  },
  reloadOnPrerender: process.env.NODE_ENV === 'development',
}
