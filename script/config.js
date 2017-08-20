const path = require('path')

module.exports = {
  src: path.resolve(`${__dirname}/../src/docroot`),
  dist: path.resolve(process.env.DIST_DIR || `${__dirname}/../dist-dev`)
}
