const pug = require('pug')
const glob = require('fast-glob')
const path = require('path')
const fs = require('fs-extra')
const url = require('url')
const HTMLHint = require('htmlhint').HTMLHint
const isPug = require('./util').isPug
const config = require('../config')

const defaultOption = Object.assign({}, config.pug)

async function render(filename) {
  const html = await compile(filename)
  const distPath = path.resolve(
    config.dist,
    path.relative(config.docroot, filename)
  )

  fs.ensureDirSync(path.dirname(distPath))

  const htmlFileName = distPath.replace(/\.pug$/, '.html')

  fs.writeFile(htmlFileName, html, error => {
    if (error) throw error

    console.log(`CREATED pug -> html: ${htmlFileName}`)
  })
}

function compile(filename) {
  const option = Object.assign({}, defaultOption, {
    filePath: path.relative(config.docroot, filename)
  })

  return new Promise((resolve, reject) => {
    pug.renderFile(filename, option, (error, html) => {
      if (error) {
        reject(error)
        throw error
      }

      console.log('-----------------------------------')
      console.log(`////// ${filename} //////`)
      console.log(HTMLHint.verify(html))
      console.log('-----------------------------------')
      resolve(html)
    })
  })
}

function renderAll() {
  const files = glob
    .sync(`${config.docroot}/**/*.pug`)
    .filter(file => isPug.test(file))

  files.forEach(file => {
    render(file)
  })
}

async function middleware(req, res, next) {
  const requestPath = url.parse(req.url).pathname
  const filePath = path.join(
    config.docroot,
    requestPath.replace(/\.html$/i, '.pug')
  )

  if (!/\.html$/i.test(requestPath) || !fs.pathExistsSync(filePath)) {
    next()
    return
  }

  console.log(`pug compile: ${requestPath}`)

  const html = await compile(filePath)

  res.writeHead(200, { 'Content-Type': 'text/html' })
  res.end(html)
}

module.exports = {
  renderAll,
  middleware
}
