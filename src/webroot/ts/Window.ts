import eventEmitter from './EventEmitter'
import * as debounce from 'lodash/debounce'
import * as throttle from 'lodash/throttle'

const doc: Document = window.document
const bodyEle: HTMLElement = (doc.documentElement || doc.body.parentNode as HTMLElement || doc.body)

export interface WinState {
  width: number
  height: number
  scrollTop: number
}

window.addEventListener('resize', debounce(winResize, 500), false)
window.addEventListener('scroll', throttle(winScroll, 100), false)

function winResize (event: Event): void {
  const param: WinState = {
    width: doc.documentElement.clientWidth,
    height: window.innerHeight || doc.documentElement.clientHeight || 0,
    scrollTop: (window.pageYOffset !== undefined) ? window.pageYOffset : bodyEle.scrollTop
  }

  eventEmitter.emit('winResize', param)
}

function winScroll (event: Event): void {
  eventEmitter.emit('winScroll', (window.pageYOffset !== undefined) ? window.pageYOffset : bodyEle.scrollTop)
}
