import _ from 'lodash'

export const getProcessArgvs = (removeItems = 2) => {
  const args = process.argv.slice(removeItems)
  const result = {
    command: '', // dev, start, build, export, create, delete, init, help
    dictionary: '', // export/init dictionary=${dictionary}
    controller: '',
    action: '' // create/delete controller=${controller} action=${action}
  }

  _.each(args, (item, index) => {
    if (item.indexOf('=') !== -1) {
      const itemArr = item.split('=')
      const key: string = itemArr[0].toLowerCase()
      result[key] = itemArr[1]
    } else {
      const { command } = result
      switch (index) {
        case 0:
          result.command = item
          break
        case 1:
          if (
            command === 'create' ||
            command === '-c' ||
            command.indexOf('delete') !== -1 ||
            command.indexOf('-d') !== -1
          ) {
            result.controller = item
          }

          if (command === 'export' || command === 'init' || command === '-i') {
            result.dictionary = item
          }
          break
        case 2:
          if (
            command === 'create' ||
            command === '-c' ||
            command.indexOf('delete') !== -1 ||
            command.indexOf('-d') !== -1
          ) {
            result.action = item
          }
          break
      }
    }
  })

  return result
}
