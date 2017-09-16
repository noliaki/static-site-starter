const fs = require('fs')
const path = require('path')
const glob = require('glob')
const bs = require('browser-sync').create()
const pugMiddleware = require('./pug')
const stylusMiddleware = require('./stylus')
const imageMin = require('./imagemin')
const copyFile = require('./cp-files')
const dist = require('./config').dist
const src = require('./config').src
const docRoot = require('./config').docroot

const startPath = () => {
  const files = glob.sync(`${docRoot}/**/*.pug`)
  const initFile = files.reduce((prev, value) => {
    return prev.length > value.length ? value : prev
  })

  return `/${path.relative(docRoot, initFile).replace(/\.pug$/, '.html')}`
}

imageMin.exec()
copyFile.exec()

bs.init({
  server: {
    baseDir: dist,
    directory: true
  },
  startPath: startPath(),
  files: dist,
  ghostMode: false,
  logLevel: 'debug',
  middleware: [
    pugMiddleware,
    stylusMiddleware
  ],
  reloadDebounce: 500
})

fs.watch(src, { recursive: true }, async (event, filename) => {
  console.log(event, filename)

  // ignore
  if (ignoreFile(filename)) {
    console.log('ignore this file')
    return
  }

  const absolutePath = path.resolve(src, filename)
  const valid = await validFile(absolutePath)

  if (!valid) {
    console.log('invalid file')
    return
  }

  // pug or stylus
  if (/\.(pug|styl)$/.test(filename)) {
    bs.reload()
    return
  }

  // image file
  if (imageMin.isImage.test(filename)) {
    imageMin.compressImage(absolutePath)
    return
  }

  fs.stat(absolutePath, (error, stats) => {
    if (error || stats.isDirectory()) {
      return
    }

    copyFile.copy(absolutePath)
  })
})

function validFile (filename) {
  return new Promise((resolve, reject) => {
    fs.stat(filename, (error, stats) => {
      if (error) {
        reject(error)
        return
      }

      if (stats.isDirectory()) {
        resolve(false)
        return
      }

      resolve(true)
    })
  })
}

function ignoreFile (filename) {
  return /\.js$/.test(filename) || /\/?\./.test(filename)
}
