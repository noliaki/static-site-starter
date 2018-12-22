const stylus = require('stylus')
const postcss = require('postcss')
const autoprefixer = require('autoprefixer')
const fs = require('fs-extra')
const path = require('path')
const glob = require('fast-glob')
const url = require('url')
const isStylus = require('./util').isStylus
const config = require('../config')

async function render(filename) {
  const css = await compile(filename)

  writeFile(filename, css)
}

async function compile(filename) {
  const css = await stylusToCss(filename)
  const result = await addPrefix(css)

  result.warnings().forEach(warn => {
    console.warn(warn.toString())
  })

  return result.css
}

function stylusToCss(filename) {
  const str = fs.readFileSync(filename, {
    encoding: 'utf8'
  })

  return new Promise((resolve, reject) => {
    const renderer = stylus(str).set(
      'compress',
      config.stylus.compress || process.env.NODE_ENV === 'production'
    )

    config.stylus.includes.forEach(path => {
      renderer.include(path)
    })

    renderer.render((error, output) => {
      if (error) {
        reject(error)
        throw error
      }

      resolve(output)
    })
  })
}

function writeFile(filename, string) {
  const distPath = path.resolve(
    config.dist,
    path.relative(config.docroot, filename)
  )
  const cssFileName = distPath.replace(/\.styl$/, '.css')

  fs.ensureDirSync(path.dirname(distPath))

  fs.writeFile(cssFileName, string, error => {
    if (error) throw error

    console.log(`CREATED stylus -> css: ${cssFileName}`)
  })
}

function addPrefix(css) {
  return postcss([autoprefixer(config.stylus.autoprefixerconfig)]).process(css)
}

function renderAll() {
  const files = glob
    .sync([`${config.docroot}/**/*.styl`, `${config.docroot}/*.styl`])
    .filter(file => isStylus.test(file))

  files.forEach(file => {
    render(file)
  })
}

async function middleware(req, res, next) {
  const requestPath = url.parse(req.url).pathname
  const filePath = path.join(
    config.docroot,
    requestPath.replace(/\.css$/i, '.styl')
  )

  if (!/\.css$/i.test(requestPath) || !fs.pathExistsSync(filePath)) {
    next()
    return
  }

  console.log(`stylus compile: ${requestPath}`)

  const css = await compile(filePath)

  res.writeHead(200, { 'Content-Type': 'text/css' })
  res.end(css)
}

module.exports = {
  renderAll,
  middleware
}
