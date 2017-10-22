const isPug = /\.pug$/
exports.isPug = isPug

const isImage = /\.(jpe?g|gif|png|svg)$/i
exports.isImage = isImage

const isStylus = /\.styl$/
exports.isStylus = isStylus

const isTs = /\.ts$/
exports.isTs = isTs

exports.shouldCopy = filename => {
  return !(isPug.test(filename) || isStylus.test(filename) || isImage.test(filename) || isTs.test(filename))
}
