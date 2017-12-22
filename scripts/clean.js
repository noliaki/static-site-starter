const rimraf = require('rimraf')
const paths = require('./paths')

rimraf(paths.dist, (err) => {
  if (err) throw new Error(err)

  console.log(`[Done remove] ${paths.dist}`)
})
