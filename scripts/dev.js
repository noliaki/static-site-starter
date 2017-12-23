const fs = require('fs-extra')
const path = require('path')
const bs = require('browser-sync').create()
const pugMiddleware = require('./pug').middleware
const stylusMiddleware = require('./stylus').middleware
const imageMin = require('./imagemin')
const copyFile = require('./cp-files')
const paths = require('./paths')
const util = require('./util')
const config = require('../config').browsersync

imageMin.exec()
copyFile.exec()

bs.init(Object.assign(config, {
  middleware: [
    pugMiddleware,
    stylusMiddleware
  ]
}))

fs.watch(paths.src, { recursive: true }, (event, filename) => {
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

  // pug
  if (util.isPug.test(filename)) {
    console.log(path.relative(paths.docroot, filename))
    bs.reload('*.html')
    return
  }

  // stylus
  if (util.isStylus.test(filename)) {
    console.log(path.relative(paths.docroot, filename))
    bs.reload('*.css')
    return
  }

  if (/^\/?modules\//.test(filename)) {
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
