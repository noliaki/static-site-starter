const path = require('path')
const config = require('../config')

module.exports = {
  src: path.resolve(config.src),
  dist: path.resolve(config.dist),
  docroot: path.resolve(config.docroot)
}
