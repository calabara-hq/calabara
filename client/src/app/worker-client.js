import * as Comlink from 'comlink'

const worker = new Worker('/worker/webworker.js')

const processImages = async function () {

  const pullLogo = Comlink.wrap(worker);
  const imgElements = document.querySelectorAll('img[data-src]')
  var elements = Array.from(imgElements)
  elements.map(async (element, index) => {
    const imageURL = element.getAttribute('data-src')
    const blob = await pullLogo(imageURL);
    const objectURL = URL.createObjectURL(blob);
    element.removeAttribute('data-src')
    element.setAttribute('src', objectURL);
  })

  return elements

}

const settingsProcessLogo = async function () {
  const pullLogo = Comlink.wrap(worker);
  const imgElement = document.querySelector('img[data-src]')
  const imageURL = imgElement.getAttribute('data-src')
  const blob = await pullLogo(imageURL);
  const objectURL = URL.createObjectURL(blob);
  imgElement.removeAttribute('data-src')
  imgElement.setAttribute('src', objectURL);
  return blob;
}

export { processImages, settingsProcessLogo }
