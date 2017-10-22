const path = require('path')

module.exports = {
  src: path.resolve(`${__dirname}/../src`),
  dist: path.resolve(process.env.DIST_DIR || `${__dirname}/../dist-dev`),
  docroot: path.resolve(`${__dirname}/../src/docroot`)
}
