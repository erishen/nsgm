import Document, { Html, Head, Main, NextScript, DocumentContext } from 'next/document'
import React from 'react'
import { ServerStyleSheet } from 'styled-components'

const MyDocument = () => {
  return (
    <Html>
      <title>NSGM CLI</title>
      <meta
        name="viewport"
        content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no,minimal-ui"
      />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta charSet="utf-8" />
      <Head>
        {/* 直接使用现有的 FontAwesome CSS 文件 */}
        <link rel="stylesheet" href="/fonts/font-awesome.min.css" />

        {/* 预加载字体文件以改善性能 */}
        <link
          rel="preload"
          href="/fonts/fontawesome-webfont.woff2?v=4.7.0"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/fontawesome-webfont.woff?v=4.7.0"
          as="font"
          type="font/woff"
          crossOrigin="anonymous"
        />

        {/* 确保字体正确显示的额外样式 */}
        <style>{`
          .fa {
            font-family: FontAwesome !important;
            font-style: normal !important;
            font-weight: normal !important;
            text-decoration: inherit;
            line-height: 1;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }
        `}</style>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}

// MyDocument.renderDocument = Document.renderDocument

MyDocument.getInitialProps = async (ctx: DocumentContext) => {
  const sheet = new ServerStyleSheet()
  const originalRenderPage = ctx.renderPage

  try {
    ctx.renderPage = () =>
      originalRenderPage({
        enhanceApp: (App) => (props) => sheet.collectStyles(<App {...props} />)
      })

    const initialProps = await Document?.getInitialProps(ctx)

    return {
      ...initialProps,
      styles: [initialProps.styles, sheet.getStyleElement()]
    }
  } finally {
    sheet.seal()
  }
}

export default MyDocument
