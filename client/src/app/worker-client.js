import React, { useEffect, useState } from 'react';
import * as Comlink from 'comlink'
import {
  populateLogoCache
} from '../features/org-cards/org-cards-reducer'
import styled from 'styled-components'
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

const worker = new Worker('/worker/webworker.js')
const { pullLogo, pullSubmissions } = Comlink.wrap(worker);


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
  console.log('WEBWORKER')
  const imgElements = document.querySelectorAll('img[data-src]')
  var elements = Array.from(imgElements)
  elements.map(async (element, index) => {
    const imageURL = element.getAttribute('data-src')
    let objectURL
    console.log(imageURL)
    const blob = await pullLogo(imageURL);
    console.log(blob)
    objectURL = URL.createObjectURL(blob);


    element.removeAttribute('data-src')
    element.setAttribute('src', objectURL);
  })

  return elements

}



function ProcessSubmissions({ subs }) {
  console.log('running webworker !!!')
  const [sub_content, set_sub_content] = useState([])

  /*
  elements.map(async (element, index) => {
    const dataURL = element.getAttribute('data-url')

    let objectURL
    console.log('pulling!')
    let start = performance.now();
    let res = await pullSubmissions(dataURL);
    console.log(res)

    console.log('TOOK', performance.now() - start, 'ms')
  })
*/


  /*
 
  element.childNodes[1].src = data.tldr_image
 
  //objectURL = URL.createObjectURL(blob);
 
  //element.removeAttribute('data-src')
  //element.setAttribute('src', objectURL);
  */
  return (
    <>
      {subs.map((element, index) => {
        console.log(element)
        return (
          <SubmissionPreviewContainer key={index}>
            <p>{element.tldr_text}</p>
            <LazyLoadImage
            style={{maxWidth: '15em', margin: 'auto', borderRadius: '10px'}}
            effect="blur"

            src={element.tldr_image}/>
          </SubmissionPreviewContainer>
        )
      })}
    </ >

  )


}

const PreviewImage = styled.div`
    max-width: 15em;
    margin: auto;
    border-radius: 10px;
`
const SubmissionPreviewContainer = styled.div`
    display: flex;
    flex: 1 1 30%;
    flex-direction: column;
    flex-wrap: wrap;
    justify-content: space-between;
    font-size: 15px;
    color: #d3d3d3;
    background-color: #262626;
    border: 2px solid #4d4d4d;
    border-radius: 4px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.30), 0 15px 12px rgba(0, 0, 0, 0.22);
    padding: 20px;
    transition: width 0.6s ease-in-out;
    cursor: pointer;

    &:hover {
        transform: scale(1.01);
        transition-duration: 0.5s;
        background-color: #1e1e1e;
    }
`

export { processImages, settingsProcessLogo, updateLogo, processImages2, ProcessSubmissions }
