const pug = require('pug')
const glob = require('glob')
const path = require('path')
const fs = require('fs-extra')
const url = require('url')
const HTMLHint = require('htmlhint').HTMLHint

const paths = require('./paths')
const isPug = require('./util').isPug

const defaultOption = {
  basedir: `${paths.src}/modules/pug`,
  pretty: process.env.NODE_ENV !== 'production'
}

const renderPug = async filename => {
  const html = await compile(filename)
  const distPath = path.resolve(paths.dist, path.relative(paths.docroot, filename))

  fs.ensureDirSync(path.dirname(distPath))

  const htmlFileName = distPath.replace(/\.pug$/, '.html')

  fs.writeFile(htmlFileName, html, error => {
    if (error) throw error

    console.log(`CREATED pug -> html: ${htmlFileName}`)
  })
}

const compile = filename => {
  const option = Object.assign(defaultOption, {
    filePath: path.relative(paths.docroot, filename)
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

const exec = () => {
  const files = glob.sync(`${paths.docroot}/**/*.pug`).filter(file => isPug.test(file))

  files.forEach(file => {
    renderPug(file)
  })
}
exports.exec = exec

async function middleware (req, res, next) {
  const requestPath = url.parse(req.url).pathname
  const filePath = path.join(paths.docroot, requestPath.replace(/\.html$/i, '.pug'))

  if (!(/\.html$/i.test(requestPath)) || !fs.pathExistsSync(filePath)) {
    next()
    return
  }

  console.log(`pug compile: ${requestPath}`)

  const html = await compile(filePath)

  res.writeHead(200, {'Content-Type': 'text/html'})
  res.end(html)
  next()
}
exports.middleware = middleware
