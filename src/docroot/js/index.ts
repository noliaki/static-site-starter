import throttle from '~/modules/utils/throttle'
import scrollTop from '~/modules/utils/scroll-top'

document.addEventListener(
  'scroll',
  throttle((event: Event): void => {
    console.log(event)
    console.log(scrollTop())
  }, 200),
  {
    passive: true,
  }
)
