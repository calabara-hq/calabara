import * as Comlink from 'comlink'
import {
  populateLogoCache
} from '../features/org-cards/org-cards-reducer'


import { updateDashboardInfo } from '../features/dashboard/dashboard-info-reducer'

const worker = new Worker('/worker/webworker.js')

/*
const processImages2 = async function () {

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
*/

// used when settings has changed the dashboard logo

const updateLogo = async function (dispatch, logoPath, logoBlob){
      const imageURL = document.getElementById('info-logo')
      imageURL.setAttribute('src', logoBlob);
      dispatch(populateLogoCache({ [logoPath]: logoBlob }))
}



const processImages = async function (dispatch, logoCache) {
  const pullLogo = Comlink.wrap(worker);
  const imgElements = document.querySelectorAll('img[data-src]')
  var elements = Array.from(imgElements)
  elements.map(async (element, index) => {
    const imageURL = element.getAttribute('data-src')
    let objectURL
    if (logoCache[imageURL]) {
      objectURL = logoCache[imageURL]
    }
    else {
      const blob = await pullLogo(imageURL);
      objectURL = URL.createObjectURL(blob);
      dispatch(populateLogoCache({ imageURL: imageURL, blob: objectURL }))

    }
    element.removeAttribute('data-src')
    element.setAttribute('src', objectURL);
  })

  return elements

}


const settingsProcessLogo = async function (dispatch, logoCache) {
  const pullLogo = Comlink.wrap(worker);
  const imgElement = document.querySelector('img[data-src]')
  const imageURL = imgElement.getAttribute('data-src')
  const blob = await pullLogo(imageURL);
  const objectURL = URL.createObjectURL(blob);
  imgElement.removeAttribute('data-src')
  imgElement.setAttribute('src', objectURL);
  dispatch(populateLogoCache({ imageURL: 'dummy', blob: objectURL }))
  console.log(imageURL)
  return blob;
}

export { processImages, settingsProcessLogo, updateLogo }
