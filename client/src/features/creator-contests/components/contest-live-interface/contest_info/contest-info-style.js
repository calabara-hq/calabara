import styled from 'styled-components'
import { fade_in } from '../../common/common_styles'



export const DetailElement = styled.div`
    display: flex;
    flex-direction: column;
    background-color: #1e1e1e;
    border-radius: 10px;
    padding: 10px;
    position: relative;
    > span{
        position: absolute;
        top: 10px;
        right: 20px;
        font-size: 20px;
        cursor: pointer;
        color: #6673ff;
    }
    @media screen and (max-width: 800px){
        width: 50%;
    }
    @media screen and (max-width: 600px){
        width: 100%;
    }

`
export const DetailGrid = styled.div`
    display: flex;
    flex-direction: column;
    padding: 5px 10px;
    gap: 15px;
    > * p {
        margin: 0;
    }
`

export const GridElement = styled.div`
    display: flex;
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


export const CheckpointWrap = styled.div`
    margin-top: 70px;
    display: flex;
    flex-direction: column;
    width: 100%;

`

export const CheckpointTop = styled.div`
    margin: 0 auto;
    background-color: pink;
    height: fit-content;
    width: 95%;
    color: #d3d3d3;
    margin-bottom: 1em;
    animation: ${fade_in} 0.8s ease-in-out;

    .RSPBprogressBar > .RSPBstep:nth-child(1)::after {
      text-align: center;
      content: "submit";
      color: rgb(138, 128, 234);
      background-color: rgba(138, 128, 234, 0.3);
      border-radius: 4px;
      padding: 5px 10px;
      position: absolute;
      bottom: 2em;
    }

    .RSPBprogressBar > .RSPBstep:nth-child(2)::after {
      text-align: center;
      content: "vote";
      color: rgb(211, 151, 39);
      background-color: rgba(211, 151, 39, 0.3);
      border-radius: 4px;
      padding: 5px 10px;
      position: absolute;
      bottom: 2em;
    }

    .RSPBprogressBar > .RSPBstep:nth-child(3)::after {
      text-align: center;
      content: "end";
      color: rgb(178, 31, 71);
      background-color: rgba(178, 31, 71, 0.3);
      border-radius: 4px;
      padding: 5px 10px;
      position: absolute;
      bottom: 2em;
    }
`

export const CheckpointBottomTag = styled.p`
    color: ${props => props.status === 'active' ? '#539bf5' : (props.status === 'complete' ? 'grey' : '')};
    animation: ${fade_in} 0.2s ease-in;


`

export const CheckpointBottom = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    width: 100%;
    color: #d3d3d3;
    margin: 0 auto;
    //margin-bottom: 50px;
    font-weight: bold;

    

    ${CheckpointBottomTag}:nth-child(1){
        text-align: left;

    }
    ${CheckpointBottomTag}:nth-child(2){
        text-align: center;
    }
    ${CheckpointBottomTag}:nth-child(3){
        text-align: right;

    }
`


export const label_status = [
    { status: 'accepting submissions', text: 'rgb(138, 128, 234)', background: 'rgba(138, 128, 234, 0.3)' },
    { status: 'voting', text: 'rgb(211, 151, 39)', background: 'rgba(211, 151, 39, 0.3)' },
    { status: 'end', text: 'rgb(178, 31, 71)', background: 'rgba(178, 31, 71, 0.3)' }

]

