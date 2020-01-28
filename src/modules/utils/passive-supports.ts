let passiveSupports: boolean = false

try {
  const options: any = {
    get passive() {
      passiveSupports = true
      return undefined
    }
  }

  window.addEventListener('test', options, options)
  window.removeEventListener('test', options, options)
} catch (error) {
  passiveSupports = false
}

export default passiveSupports
