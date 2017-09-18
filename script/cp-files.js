const fs = require('fs-extra')
const path = require('path')
const glob = require('glob')
const docRoot = require('./config').docroot
const distPath = require('./config').dist

const isNotTarget = /\.(pug|styl|jpg|jpeg|gif|png|svg|js|ts)$/i

const copy = filename => {
  if (isNotTarget.test(filename)) {
    return
  }

  const distFile = path.resolve(distPath, path.relative(docRoot, filename))

  fs.ensureDirSync(path.dirname(distFile))
  fs.copy(filename, distFile, error => {
    if (error) throw error

    console.log(`copy done: ${distFile}`)
  })
}

const exec = () => {
  const files = glob.sync(`${docRoot}/**/*`, {
    nocase: true,
    nodir: true
  }).filter(file => !isNotTarget.test(file))

  files.forEach(file => {
    copy(file)
  })
}

if (process.env.NODE_ENV === 'production') {
  exec()
}

module.exports = {
  exec,
  copy
}
