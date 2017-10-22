const fs = require('fs-extra')
const path = require('path')
const glob = require('glob')

const paths = require('./paths')
const util = require('./util')

const copy = filename => {
  if (!util.shouldCopy(filename)) {
    return
  }

  const distFile = path.resolve(paths.dist, path.relative(paths.docroot, filename))

  fs.ensureDirSync(path.dirname(distFile))
  fs.copyFile(filename, distFile, error => {
    if (error) throw error

    console.log(`copy done: ${distFile}`)
  })
}

const exec = () => {
  const files = glob.sync(`${paths.docroot}/**/*`, {
    nocase: true,
    nodir: true
  }).filter(file => util.shouldCopy(file))

  files.forEach(file => {
    copy(file)
  })
}

module.exports = {
  exec,
  copy
}
