import EventEmitter, { EventType } from './event-emitter'

const mediaQueryList: MediaQueryList = window.matchMedia('(max-width: 768px)')

function mqlListener(event: MediaQueryListEvent): void {
  EventEmitter.emit(EventType.ON_MATCH_MEDIA, event)
}

mediaQueryList.addListener(mqlListener)

export default mediaQueryList
