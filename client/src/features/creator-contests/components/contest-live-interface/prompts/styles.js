import styled, { keyframes, css } from "styled-components"
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

const highlightAnimation = css`
    animation: ${highlight} 1s ease;
`;




export const DefaultContainerWrap = styled.div`
    display: flex;
    flex: 1 0 70%;
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
    position: relative;
    background-color: #262626;
    border-radius: 10px;
    padding: 10px;
    padding-bottom: 100px;

    > p {
        font-size: 15px;
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
    border: 2px solid #2682f2;
    background-color: #1e1e1e;
    padding: 5px 10px;
    &:hover{
        background-color: #1a1a1a;
        transition: border-color 0.2s ease-in-out;

    }
    
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
            display: none;
    }
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

export const CreateSubmissionButtonContainer = styled.div`
    position: absolute;
    bottom: 10px;
    right: 25px;


`
export const SubmissionRequirements = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #1e1e1e;
    //box-shadow: 0 10px 30px rgba(0, 0, 0, 0.30), 0 15px 12px rgba(0, 0, 0, 0.22);
    border: 1px solid #4d4d4d;
    border-radius: 10px;
    padding: 5px;
    margin-top: 20px;

    > h2 {
        text-align: center;
        font-size: 18px;
        font-weight: 500;
    }

    > p {
        font-size: 16px;
    }
`

export const EligibilityCheck = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    > p {
        margin: 0;
        margin-right: 20px;
    }
    > button {
        border: double 2px transparent;
        border-radius: 10px;
        background-image: linear-gradient(#141416,#141416), linear-gradient(to right,#e00f8e,#2d66dc);
        background-origin: border-box;
        background-clip: padding-box,border-box;
        box-shadow: 0 10px 30px rgb(0 0 0 / 30%), 0 15px 12px rgb(0 0 0 / 22%);
        padding: 3px 5px;
    }
`


export const RestrictionStatus = styled.span`
    display: inline-block;
    &::after{
        font-family: 'Font Awesome 5 Free';
        margin-left: 20px;
        content: '${props => props.status ? "\f058" : "\f057"}';
        color: ${props => props.status ? 'rgb(6, 214, 160)' : 'grey'};
        font-weight: 900;
    }

    animation: ${highlight} 1s ease-in;
    animation-delay: ${props => props.index * 0.3}s;

`

export const RestrictionStatusNotConnected = styled.span`
    display: inline-block;
    &::after{
        font-family: 'Font Awesome 5 Free';
        margin-left: 20px;
        content:  "\f057";
        color:  grey;
        font-weight: 900;
    }
`

export const SubButton = styled.div`
    display:flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    //margin-left: auto;
    margin-top: 2em;
    margin-right: 10px;
    margin-bottom: 10px;
    margin-left: auto;
    grid-gap: 10px;
`

export const ConnectWalletButton = styled.button`
    height: 40px;
    //width: 12em;
    font-size: 15px;
    //font-weight: 550;
    color: #f2f2f2;
    background-image: linear-gradient(#262626, #262626),linear-gradient(90deg,#e00f8e,#2d66dc);
    background-origin: border-box;
    background-clip: padding-box,border-box;
    border: 2px double transparent;
    border-radius: 10px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.30), 0 15px 12px rgba(0, 0, 0, 0.22);
    padding: 5px 20px;
    cursor: pointer;
    overflow: hidden;
    &:hover{
        background-color: #1e1e1e;
        background-image: linear-gradient(#141416, #141416),
        linear-gradient(to right, #e00f8e, #2d66dc);
    }

`