const fs = require('fs-extra')
const glob = require('glob')
const path = require('path')
const util = require('./util')
const config = require('../config')

const copy = filename => {
  if (!util.shouldCopy(filename)) {
    return
  }

  const distFile = path.resolve(
    config.dist,
    path.relative(config.docroot, filename)
  )

  fs.ensureDirSync(path.dirname(distFile))
  fs.copyFile(filename, distFile, error => {
    if (error) throw error

    console.log(`copy done: ${distFile}`)
  })
}

const exec = () => {
  const files = glob
    .sync([`${config.docroot}/**/*`, `${config.docroot}/*`], {
      nocase: true,
      nodir: true
    })
    .filter(file => util.shouldCopy(file))

  files.forEach(file => {
    copy(file)
  })
}

module.exports = {
  exec,
  copy
}
