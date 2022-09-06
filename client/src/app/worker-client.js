import React, { useEffect, useState } from 'react';
import * as Comlink from 'comlink'
import {
  populateLogoCache
} from '../features/org-cards/org-cards-reducer'
import styled from 'styled-components'
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

const worker = new Worker('/worker/webworker.js')
const { pullLogo } = Comlink.wrap(worker);


// used when settings has changed the dashboard logo

const updateLogo = async function (dispatch, logoPath, logoBlob) {
  const imageURL = document.getElementById('info-logo')
  imageURL.setAttribute('src', logoBlob);
  dispatch(populateLogoCache({ imageURL: [logoPath], blob: logoBlob }))
}


const processImages = async function (dispatch, logoCache) {
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
  const imgElement = document.querySelector('img[data-src]')
  const imageURL = imgElement.getAttribute('data-src')
  const blob = await pullLogo(imageURL);
  const objectURL = URL.createObjectURL(blob);
  imgElement.removeAttribute('data-src')
  imgElement.setAttribute('src', objectURL);
  dispatch(populateLogoCache({ imageURL: 'dummy', blob: objectURL }))

  return blob;
}

const processImages2 = async function () {
  
  const imgElements = document.querySelectorAll('img[data-src]')
  var elements = Array.from(imgElements)
  elements.map(async (element, index) => {
    const imageURL = element.getAttribute('data-src')
    let objectURL
    
    const blob = await pullLogo(imageURL);
    
    objectURL = URL.createObjectURL(blob);


    element.removeAttribute('data-src')
    element.setAttribute('src', objectURL);
  })

  return elements

}





export { processImages, settingsProcessLogo, updateLogo, processImages2 }
