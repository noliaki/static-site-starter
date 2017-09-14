const pug = require('pug')
const glob = require('glob')
const path = require('path')
const fs = require('fs')
const shell = require('shelljs')
const url = require('url')

const docRoot = require('./config').docroot
const src = require('./config').src
const dist = require('./config').dist

const files = glob.sync(`${docRoot}/**/*.pug`)

const option = {
  basedir: `${src}/modules/pug`,
  pretty: true
}

const renderPug = async filename => {
  const html = await compile(filename)

  const distPath = path.resolve(dist, path.relative(docRoot, filename))

  shell.mkdir('-p', path.dirname(distPath))

  fs.writeFile(distPath.replace(/(\.pug)$/, '.html'), html, error => {
    if (error) throw error

    console.log(distPath.replace(/(\.pug)$/, '.html'))
  })
}

const compile = (filename) => {
  return new Promise((resolve, reject) => {
    pug.renderFile(filename, option, (error, html) => {
      if (error) {
        reject(error)
        throw error
      }

      resolve(html)
    })
  })
}

files.forEach(file => {
  renderPug(file)
})

// middleware for browsersync
module.exports = async (req, res, next) => {
  const requestPath = url.parse(req.url).pathname

  console.log(requestPath)

  if (!(/(\.html)$/.test(requestPath))) {
    next()
    return
  }

  const filePath = path.join(docRoot, requestPath.replace(/(\.html)$/, '.pug'))
  const html = await compile(filePath)

  res.end(html)
  next()
}
