const rimraf = require('rimraf')
const distDir = require('../config').dist

rimraf(distDir, err => {
  if (err) throw new Error(err)

  console.log(`[Done remove] ${distDir}`)
})
