const pug = require('pug')
const glob = require('glob')
const path = require('path')
const fs = require('fs')
const shell = require('shelljs')

const docRoot = require('./config').docroot
const src = require('./config').src
const dist = require('./config').dist

const files = glob.sync(`${docRoot}/**/*.pug`)

const renderPug = filename => {
  const html = pug.renderFile(filename, {
    basedir: `${src}/modules/pug`,
    pretty: true
  })

  const distPath = path.resolve(dist, path.relative(docRoot, filename))

  shell.mkdir('-p', path.dirname(distPath))

  fs.writeFile(distPath.replace(/(\.pug)$/, '.html'), html, error => {
    if (error) throw error

    console.log(distPath.replace(/(\.pug)$/, '.html'))
  })
}

files.forEach(file => {
  renderPug(file)
})
