#!/usr/bin/env node
if (process.argv.length !== 7) {
  process.stdout.write(
    'Usage: <publisher> <password> <project> <edition> <digest>\n'
  )
  process.exit(1)
}

require('./').apply(
  null,
  process.argv.slice(2, 7).concat(function (error, location) {
    if (error) {
      if (error.statusCode) {
        console.error('Server responded ' + error.statusCode + '.')
      }
      console.error(error)
      process.exit(1)
    } else {
      process.stdout.write(location + '\n')
      process.exit(0)
    }
  })
)
