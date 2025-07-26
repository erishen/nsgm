import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext
} from 'next/document'
import React from 'react'
import { ServerStyleSheet } from 'styled-components'

const MyDocument = () => {
  return (
    <Html>
      <title>NSGM CLI</title>
      <meta name="viewport" content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no,minimal-ui" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta charSet="utf-8" />
      <Head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" />
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
  // console.log('document getInitialProps')

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
      styles: (
        <>
          {initialProps.styles}
          {sheet.getStyleElement()}
        </>
      )
    }
  } finally {
    sheet.seal()
  }
}

export default MyDocument
