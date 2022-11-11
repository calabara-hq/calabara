import styled, { keyframes } from 'styled-components'
import { scaleElement } from '../../../../../css/scale-element';
import { fade_in } from '../../common/common_styles';

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


export const Container = styled.div`
    background-color: #262626;
    border-radius: 10px;
    padding: 10px;
    @media screen and (max-width: 800px){
        width: 50%;
    }
    @media screen and (max-width: 600px){
        width: 100%;
    }
`

export const DataWrap = styled.div`
    padding: 5px 10px;
    position: relative;
    > span{
        position: absolute;
        top: 0;
        right: 15px;
        font-size: 20px;
        cursor: pointer;
        color: #6673ff;
    }
`

export const DataGrid = styled.div`
    display: flex;
    flex-direction: column;
    padding: 5px 10px;
    gap: 15px;
    margin-top: 15px;
    > * p {
        margin: 0;
    }
`

export const GridElement = styled.div`
    display: flex;
    font-size: 16px;
    > div:first-child{
        width: 50%;
        display: flex;
        align-items: center;
        font-weight: 500;
        color: #a3a3a3;
    }
    > div:nth-child(2){
        width: 50%;
        display: flex;
        color: #c3c3c3;
        font-weight: 550;

        > * {
            margin-left: auto;
        }

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

    animation: ${fade_in} 0.3s ease-in;

`

export const SubmissionStatus = styled.span`
    display: inline-block;
    margin-left: 10px;
    &::after{
        font-family: 'Font Awesome 5 Free';
        font-weight: 900;
        content: '${props => props.status === 'pass' ? "\f058" : (props.status === 'fail' ? "\f057" : "\f111")}';

        ${props => props.status === 'pass' && ({
        color: 'rgb(6, 214, 160)',
    })}
        ${props => props.status === 'loading' && ({
        color: 'orange',
    })}
        ${props => props.status === 'fail' && ({
        color: 'grey',
    })}
    }

    animation: ${fade_in} 0.3s ease-in;

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

export const AltSubmissionButton = styled.button`
    font-size: 15px;
    color: rgb(138,128,234);
    background-color: rgb(138,128,234,.3);
    border: 2px solid rgb(138,128,234,.3);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.30), 0 15px 12px rgba(0, 0, 0, 0.22);

    border-radius: 10px;
    padding: 5px 10px;
    transition: background-color 0.2 ease-in-out;
    transition: color 0.3s ease-in-out;
    overflow: hidden;
    animation: ${fade_in} 0.5s ease-in-out;

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

export const TwitterWrap = styled.div`
    display: flex;
    flex-direction: row;
    position: relative;
    align-items: center;
`

export const TwitterAccountBox = styled.div`
    display: flex;
    align-items: center;
`

export const TwitterSwitchAccount = styled.span`
    font-size: 14px;
    margin-left: 5px;
    color: grey;
    align-self: flex-end;
    cursor: pointer;
    background-color: transparent;
    border-radius: 4px;
    padding: 3px;
    ${scaleElement};

    &:hover{
        background-color: #1e1e1e;
    }
`


export const WinnersButton = styled.button`
    margin-left: auto;
    font-size: 15px;
    border: 2px solid #539bf5;
    border-radius: 10px;
    background-color: #1e1e1e;
    color: #d3d3d3;
    padding: 10px 15px;
    ${scaleElement};
    @media screen and (max-width: 408px){
        margin-left: 0;
    }
`