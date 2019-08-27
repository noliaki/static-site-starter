export default (): number => {
  return document.documentElement.scrollTop || document.body.scrollTop
}
