const path = require('path');

/**
 * @type {import('next-i18next').UserConfig}
 */
module.exports = {
  i18n: {
    defaultLocale: 'zh-CN',
    locales: ['zh-CN', 'en-US', 'ja-JP'],
    localeDetection: false, // 禁用自动语言检测
  },
  localePath: path.resolve(process.cwd(), './public/locales'),
  /** To avoid issues when deploying to some platforms, we can configure the cache */
  saveMissing: false,
  strictMode: true,
  serializeConfig: false,
  react: {
    useSuspense: false,
  },
}
