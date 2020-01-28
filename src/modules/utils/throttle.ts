export default (
  fn: (...args: any) => void,
  interval: number
): ((...args: any) => void) => {
  let lastTime: number = Date.now()

  return (...args: any): void => {
    const now: number = Date.now()

    if (now - lastTime >= interval) {
      lastTime = now
      fn(...args)
    }
  }
}
