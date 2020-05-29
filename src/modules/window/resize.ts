import debounce from '~/modules/utils/debounce'
import supportPassive from '~/modules/utils/passive-supports'
import EventEmitter, { EventType } from '../utils/event-emitter'

const resizeHandler: EventListener = debounce((_event: Event): void => {
  EventEmitter.emit(EventType.ON_WINDOW_RESIZE)
}, 300)

window.addEventListener(
  'resize',
  resizeHandler,
  supportPassive
    ? {
        passive: true,
      }
    : false
)
