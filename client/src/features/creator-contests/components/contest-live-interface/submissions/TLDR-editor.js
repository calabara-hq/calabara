import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import axios from 'axios'



const ImageWrapper = styled.div`
    flex: 1 1 30%;
    img{
        display: inline;
        max-width: 15em;
        max-height: 15em;
        border-radius: 10px;
    }
`

const ImageUploadBtn = styled.button`
  width: 100%;
  height: 100%;
  min-height: 15em;
  padding: 3px;
  border: double 2px transparent;
        border-radius: 10px;
        background-image: linear-gradient(#262626, #262626), 
                        linear-gradient(to right, #e00f8e, #2d66dc);
        background-origin: border-box;
        background-clip: padding-box, border-box;
`

const RemoveImageButton = styled.button`
    position: absolute;
    transform: translate(-50%, -50%);
    border: 2px solid #22272e;
    border-radius: 100px;
    padding: 10px 15px 10px 15px;
    background-color: #e5534b;
`

const TextArea = styled.textarea`
  outline: none;
  color: #d3d3d3;
  font-size: 16px;
  border: 2px solid #4d4d4d;
  background-color: #262626;
  border-radius: 10px;
  padding: 10px;
  width: 100%;
  height: 15em;
  
  resize: none;
`
const TextAreaWrap = styled.div`
    flex: 1 1 65%;
    &::after{
            content: ${props => `"${props.textLength} / ${props.maxLength} "`};
            color: ${props => props.textLength > props.maxLength ? 'rgb(178, 31, 71)' : ''};
            position: absolute;
            transform: translate(-110%, -100%)
        }
`
const TLDRWrap = styled.div`
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    margin: -10px;
    margin-bottom: 20px;

    > * {
        margin: 10px;
    }
`

export default function TLDR({ isUserEligible, setShowWarning, TLDRimage, setTLDRImage, TLDRText, setTLDRText }) {

    const tldr_max_length = {
        with_img: "150",
        no_img: "250"
    }


    const imageUploader = useRef(null);

    function b64toBlob(dataURI) {

        var byteString = atob(dataURI.split(',')[1]);
        var ab = new ArrayBuffer(byteString.length);
        var ia = new Uint8Array(ab);

        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        return new Blob([ab], { type: 'image/jpeg' });
    }

    const handleUpload = (e) => {
        const img = {
            preview: URL.createObjectURL(e.target.files[0]),
            data: e.target.files[0],
            url: null
        }
        const formData = new FormData();
        formData.append(
            "image",
            img.data
        )
        axios({
            method: 'post',
            url: '/creator_contests/upload_img',
            data: formData
        }).then((response) => {
            img.url = response.data.file.url;
            setTLDRImage(img)
        })
    }

    const updateTLDRText = (e) => {
        setTLDRText(e.target.value);
        if (!isUserEligible) {
            setShowWarning(true)
        }
    }



    return (
        <TLDRWrap>
            <TextAreaWrap textLength={TLDRText.length} maxLength={TLDRimage ? 150 : 250}>
                <TextArea placeholder='TLDR text' value={TLDRText} onChange={updateTLDRText}></TextArea>
            </TextAreaWrap>
            <ImageWrapper>
                <input placeholder="Logo" type="file" accept="image/*" style={{ display: 'none' }} onChange={handleUpload} ref={imageUploader} />
                <ImageUploadBtn type="button" onClick={() => imageUploader.current.click()}>
                    <div>
                        {TLDRimage && <img src={TLDRimage.preview} />}
                        {!TLDRimage && <p style={{ color: '#d3d3d3' }}>TLDR Image</p>}
                    </div>
                </ImageUploadBtn>
                {TLDRimage && <RemoveImageButton onClick={() => setTLDRImage(null)}><FontAwesomeIcon icon={faTimes}></FontAwesomeIcon></RemoveImageButton>}
            </ImageWrapper>
        </TLDRWrap>
    )
}