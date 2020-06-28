export default function onClick(event: MouseEvent): void {
  event.preventDefault()

  const href = (event.currentTarget as Element).getAttribute('href')
  window.open(
    href,
    'share this page',
    'width=550, height=450, personalbar=0, toolbar=0, scrollbars=1, resizable=!'
  )
}
