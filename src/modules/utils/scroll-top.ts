export default (): number => {
  return (
    document.scrollingElement?.scrollTop ||
    document.documentElement?.scrollTop ||
    document.body.scrollTop
  )
}
