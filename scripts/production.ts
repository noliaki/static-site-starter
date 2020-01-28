import { renderAll as ejsRenderAll } from './ejs'
import { renderAll as stylusRenderAll } from './stylus'
import { compressAll } from './imagemin'
import { copyAll } from './copy'

ejsRenderAll()
stylusRenderAll()
compressAll()
copyAll()
