// Mock for chalk v5 ES module
const chalk = {
  green: (text) => text,
  red: (text) => text,
  yellow: (text) => text,
  blue: (text) => text,
  white: (text) => text,
  gray: (text) => text,
  bold: {
    blue: (text) => text
  }
}

module.exports = chalk
module.exports.default = chalk
