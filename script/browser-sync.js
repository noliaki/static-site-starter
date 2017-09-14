const bs = require('browser-sync').create()
const pug = require('./pug')
const dist = require('./config').dist

bs.init({
  server: {
    baseDir: dist,
    directory: true,
    index: 'index.html'
  },
  files: dist,
  ghostMode: false,
  logLevel: 'debug',
  middleware: [
    pug
  ]
})
