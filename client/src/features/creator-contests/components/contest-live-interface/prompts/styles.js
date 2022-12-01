import styled, { keyframes, css } from "styled-components"
import { scaleElement } from "../../../../../css/scale-element";
import { Label, fade_in } from "../../common/common_styles";

const highlight = (props) => keyframes`
    0% {
        opacity: 0;
        transform: scale(1.0);
    }
    50% {
        opacity: 1 !important;
        transform: scale(1.7);
    }
    100% {
        opacity: 1 !important;
        transform: scale(1.0);
        display: visible;
    }

`;


export const DefaultContainerWrap = styled.div`
    display: flex;
    flex-direction: column;
    background-color: #1e1e1e;
    border-radius: 10px;
    padding: 10px;
    position: relative;
    height: 290px;
    animation: ${fade_in} 0.2s ease-in-out;
    cursor: pointer;

`

export const PromptContainer = styled.div`
    display: flex;
    flex-direction: column;
    position: relative;
    height: 100%;
    border-radius: 4px;
    transition: visibility 0.2s, max-height 0.3s ease-in-out;
    color: #d3d3d3;
    overflow: hidden;
    
    > p {
        font-size: 16px;
    }

    > img {
        max-width: 15em;
    }

`

// prompt sidebar styling


export const PromptWrap = styled.div`
    align-items: flex-start;
    background-color: #262626;
    border-radius: 10px;
    padding: 10px;
    word-wrap: break-word;
    text-align: center;
    animation: ${fade_in} 0.5s ease-in;

    > * h2 {
        color: #d9d9d9;
        text-align: left;
    }
    
    > * p {
        font-size: 15px;
        color: #d3d3d3;
        text-align: left;

    }

    img {
        max-width: 35em;
        border-radius: 10px;
        align-self: center;
        justify-self: center;
        border-radius: 10px;
        margin-top: 20px;
        margin-bottom: 20px;
        text-align: center;
    }

    @media screen and (max-width: 500px){
        img{
            max-width: 20em !important;
        }
    }

    > * {
        margin-top: 20px;
        margin-bottom: 20px;


    }
`

export const FadeDiv = styled.div`
    animation: ${fade_in} 0.5s ease-in-out;
`

export const PromptTop = styled.div`
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    margin-top: 10px;
    margin-bottom: 20px;
    color: #bfbfbf;

    > ${Label}{
        margin-left: 10px;
        margin-right: 10px;
    }


    > h3 {
        margin-top: 0px;
        margin-bottom: 0px;
        font-size: 2em;
    }

    @media screen and (max-width: 600px){
        > h3{
            font-size: 1.5em;
        }
    }
`
export const PromptContent = styled.div`
    font-size: 1.2em;
    > p{
        margin: 10px 0px;
    }
`

export const PromptReadMore = styled.div`
    display: flex;
    justify-content: center;
    align-items: flex-end;
    position: absolute;
    bottom: 0;
    background-image: linear-gradient(to bottom, rgba(30, 30, 30, 0), rgba(30, 30, 30, 1) );
    height: 100px;
    width: 100%;

`

export const ReadMoreButton = styled.button`
    border-radius: 10px;
    font-weight: bold;
    border: 2px solid #4d4d4d;
    background-color: #1e1e1e;
    padding: 5px 10px;
    ${scaleElement}
    
`

export const PromptCoverImage = styled.img`
    float: right;
    margin-right: 10px;
    max-width: 12em;
    max-height: 12em;
    border-radius: 10px;

    @media screen and (max-width: 700px){
            max-width: 8em;
            justify-self: center;
            align-self: center;
    }

    @media screen and (max-width: 400px){
            //display: none;
    }
`

export const ExpandedCoverImage = styled.img`
    max-width: 90%;
    border-radius: 10px;
    margin: 0 auto;
`


export const AltSubmissionButton = styled.button`
    height: 40px;
    font-size: 15px;
    color: rgb(138,128,234);
    background-color: rgb(138,128,234,.3);
    border: 2px solid rgb(138,128,234,.3);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.30), 0 15px 12px rgba(0, 0, 0, 0.22);

    border-radius: 10px;
    padding: 5px 20px;
    transition: background-color 0.2 ease-in-out;
    transition: color 0.3s ease-in-out;
    overflow: hidden;

    &:hover{
        background-color: rgb(138,128,234);
        color: #fff;
    }

    &:disabled{
    cursor: not-allowed;
    color: rgb(138,128,234,.3);
    background-color: #262626;

    }
`

export const QualificationsWrap = styled.div`
    background-color: #1e1e1e;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.30), 0 15px 12px rgba(0, 0, 0, 0.22);
    border: 1px solid #4d4d4d;
    border-radius: 10px;
    padding: 5px;
    margin-top: 20px;
`