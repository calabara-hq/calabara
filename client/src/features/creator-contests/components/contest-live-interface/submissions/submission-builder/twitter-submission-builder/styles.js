import styled from 'styled-components'
import { fade_in } from '../../../../common/common_styles'
import { scaleElement } from '../../../../../../../css/scale-element'


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
      top: 2.5em;
    }

    .RSPBprogressBar > .RSPBstep:nth-child(2)::after {
      text-align: center;
      content: "authorize";
      color: grey;
      position: absolute;
      top: 2.5em;
    }

    .RSPBprogressBar > .RSPBstep:nth-child(3)::after {
      text-align: center;
      content: "submit";
      color: grey;
      position: absolute;
      top: 2.5em;
    }
`

export const ContentWrap = styled.div`
    align-self: flex-start;
    width: 100%;
    margin-left: auto;
    display: flex;
    flex-direction: column;
    gap: 20px;
`

export const AuthChoiceWrap = styled.div`
    display: flex;
    width: 80%;
    margin: 0 auto;
    gap: 20px;
`

export const AuthChoiceButton = styled.button`
    width: 50%;
    height: 200px;
    border-radius: 10px;
    background-color: #2a2a2a;
    border: 1px solid #6673ff;
    font-size: 16px;
    &:hover{
        //background-color: #2f2f2f;
    }
    ${scaleElement}
`
export const LinkTwitterWrap = styled.div`
    display: flex;
    align-items: flex-end;
    justify-content: center;
    position: relative;
    width: 80%;
    height: 100px;
    margin: 0 auto;
`
