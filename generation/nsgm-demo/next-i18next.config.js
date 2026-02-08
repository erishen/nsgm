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
  localePath: path.resolve(process.cwd(), 'public/locales'),
  saveMissing: false,
  strictMode: false,
  serializeConfig: true,
  react: {
    useSuspense: false,
  },
  reloadOnPrerender: process.env.NODE_ENV === 'development',
}
