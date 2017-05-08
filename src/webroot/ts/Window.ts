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

function winWidth (): number {
  return doc.documentElement.clientWidth
}

function winHeight (): number {
  return window.innerHeight || doc.documentElement.clientHeight || 0
}

function scrollTop (): number {
  return (window.pageYOffset !== undefined) ? window.pageYOffset : bodyEle.scrollTop
}

function winResize (event: Event): void {
  const param: WinState = {
    width: winWidth(),
    height: winHeight(),
    scrollTop: scrollTop()
  }

  eventEmitter.emit('winResize', param)
}

function winScroll (event: Event): void {
  eventEmitter.emit('winScroll', scrollTop())
}
