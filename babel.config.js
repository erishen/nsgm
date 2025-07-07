module.exports = {
  presets: [
    ['next/babel', {
      'preset-env': {
        targets: {
          node: '18'
        }
      }
    }]
  ],
  plugins: [
    ['styled-components', {
      ssr: true,
      displayName: true,
      preprocess: false
    }]
  ]
}
