import 'babel-polyfill'

const anchor = document.querySelectorAll('a')

anchor.forEach(a => {
  a.addEventListener('click', onClick, false)
})

function onClick (event) {
  event.preventDefault()

  const href = event.currentTarget.getAttribute('href')
  window.open(href, 'share this page', 'width=550, height=450, personalbar=0, toolbar=0, scrollbars=1, resizable=!')
}

async function fuga () {
  const is = await hoge()

  console.log(is)
}

function hoge () {
  return new Promise((resolve: any, reject: any) => {
    setTimeout(() => {
      resolve(true)
    }, 1000)
  })
}

const hoe = [1,2,3,9,1,2]

hoe.find((current) => {
  return current === 9
})

console.log(...hoe)
fuga()
