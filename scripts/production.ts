import { renderAll as ejsRenderAll } from './ejs'
import { renderAll as posecssRenderAll } from './postcss'
import { compressAll } from './imagemin'
import { copyAll } from './copy'

ejsRenderAll()
posecssRenderAll()
compressAll()
copyAll()
