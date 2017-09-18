const anchor: NodeList = document.querySelectorAll('a')

Array.prototype.slice.call(anchor).forEach(a => {
  a.addEventListener('click', onClick, false)
})

function onClick (event) {
  event.preventDefault()

  const href = event.currentTarget.getAttribute('href')
  window.open(href, 'share this page', 'width=550, height=450, personalbar=0, toolbar=0, scrollbars=1, resizable=!')
}
