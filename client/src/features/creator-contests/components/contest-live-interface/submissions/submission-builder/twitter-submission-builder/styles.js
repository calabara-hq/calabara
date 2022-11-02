import styled from 'styled-components'
import { fade_in } from '../../../../common/common_styles'

export const TwitterSubmissionContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 50px;
    width: 100%;

`

export const CheckpointWrap = styled.div`
    background-color: #141416;
    border-radius: 10px;
    width: 90%;
    margin: 0 auto;
    padding: 10px 0px;

`
export const CheckpointBottom = styled.div`
    margin: 0 auto;
    background-color: pink;
    height: fit-content;
    width: 95%;
    color: #d3d3d3;
    margin-bottom: 0em;
    animation: ${fade_in} 0.8s ease-in-out;

    .RSPBprogressBar > .RSPBstep:nth-child(1)::after {
      text-align: center;
      content: "submit method";
      width: 100px;
      color: grey;
      position: absolute;
      top: 2em;
    }

    .RSPBprogressBar > .RSPBstep:nth-child(2)::after {
      text-align: center;
      content: "authorize";
      color: grey;
      position: absolute;
      top: 2em;
    }

    .RSPBprogressBar > .RSPBstep:nth-child(3)::after {
      text-align: center;
      content: "tweet";
      color: grey;
      position: absolute;
      top: 2em;
    }
`


export const ContentWrap = styled.div`
    align-self: flex-start;
    width: 100%;
    margin-left: auto;
`