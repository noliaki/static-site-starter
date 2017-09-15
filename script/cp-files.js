const fs = require('fs')
const path = require('path')
const glob = require('glob')
const shell = require('shelljs')
const docRoot = require('./config').docroot
const distPath = require('./config').dist

const isNotTarget = /(\.(pug|styl|jpg|jpeg|gif|png|svg|js))$/i

const copy = filename => {
  if (isNotTarget.test(filename)) {
    return
  }

  const distFile = path.resolve(distPath, path.relative(docRoot, filename))

  shell.mkdir('-p', path.dirname(distFile))
  console.log(`copy start: ${distFile}`)
  fs.copyFile(filename, distFile, error => {
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
