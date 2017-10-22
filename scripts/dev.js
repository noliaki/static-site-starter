const fs = require('fs-extra')
const path = require('path')
const glob = require('glob')
const bs = require('browser-sync').create()
const pugMiddleware = require('./pug').middleware
const stylusMiddleware = require('./stylus').middleware
const imageMin = require('./imagemin')
const copyFile = require('./cp-files')
const paths = require('./paths')
const util = require('./util')

const startPath = () => {
  const files = glob.sync(`${paths.docroot}/**/*.pug`)
  const initFile = files.reduce((prev, value) => {
    return prev.length > value.length ? value : prev
  })

  return `/${path.relative(paths.docroot, initFile).replace(/\.pug$/, '.html')}`
}

imageMin.exec()
copyFile.exec()

bs.init({
  server: {
    baseDir: paths.dist,
    directory: true
  },
  startPath: startPath(),
  files: paths.dist,
  ghostMode: false,
  logLevel: 'debug',
  middleware: [
    pugMiddleware,
    stylusMiddleware
  ],
  reloadDebounce: 500,
  ui: false,
  open: false
})

fs.watch(paths.src, { recursive: true }, async (event, filename) => {
  console.log(event, filename)

  // ignore
  if (ignoreFile(filename)) {
    console.log('ignore this file')
    return
  }

  const absolutePath = path.resolve(paths.src, filename)

  if (!fs.pathExistsSync(absolutePath)) {
    console.log('not exist')
    return
  }

  // pug or stylus
  if (util.isPug.test(filename) || util.isStylus.test(filename)) {
    console.log(path.relative(paths.docroot, filename))
    bs.reload()
    return
  }

  // image file
  if (util.isImage.test(filename)) {
    imageMin.compressImage(absolutePath)
    return
  }

  copyFile.copy(absolutePath)
})

function ignoreFile (filename) {
  return util.isTs.test(filename) || /\/\./.test(filename)
}
