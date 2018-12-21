// const rimraf = require('rimraf')
// const distDir = require('../config').dist

// rimraf(distDir, err => {
//   if (err) throw new Error(err)

//   console.log(`[Done remove] ${distDir}`)
// })
import * as rimraf from 'rimraf'
import { dist } from '../config'

rimraf(
  dist,
  (error: any): void => {
    if (error) throw new Error(error)

    console.log(`[Done remove] ${dist}`)
  }
)
