import styled from 'styled-components'
import { fade_in } from '../../common/common_styles'

const InterfaceHeading = styled.div`
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    align-content: center;
    color: #d3d3d3;
    margin-bottom: 70px;
    //margin-top: 50px;
`

const HeadingSection1 = styled.div`
    display: flex;
    color: #d3d3d3;
    width: 85%;
    //margin-left: 20px;
`

const OrgImg = styled.img`
    max-width: 10em;
    border: none;
    border-radius: 100px;
`
const ContestDetails = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    height: 130px;
    width: 100%;

`

const DetailColumn = styled.div`
    //background-color: grey;
    display: flex;
    flex-direction: column;
    flex: 0 0 31%;
    justify-content: center;
    background-color: #1e1e1e;
    border-radius: 10px;
    padding: 20px;
    //margin: 10px;


    p {
        //margin: auto;
    }



`

const DetailRow = styled.div`
    display: grid;
    grid-template-columns: 5fr auto;
    //width: 100%;
    //justify-items: center;
    justify-content: center;
    justify-items: start;
    //font-weight: bold;
    text-align: left;
    align-items: center;
    //margin-left: 10px;

    p {
        //margin: auto;
        padding: 5px 0;
        font-weight: bold;

    }

`
const SubRewardDetails = styled.div` 
        visibility: hidden;
        position: absolute;
        display: grid;
        grid-template-columns: 3fr auto;
        align-content: center;
        justify-items: center;
        height: 100px;
        transform: translate(360px, -80px);
        background-color: #4d4d4d;
        border-radius: 10px;
        padding: 10px;
        column-gap: 50px

`

const VoteRewardDetails = styled.div` 
        visibility: hidden;
        position: absolute;
        display: flex;
        flex-direction: row;
        align-items: center;
        height: 100px;
        transform: translate(100%, 100%);
        background-color: #4d4d4d;
        border-radius: 10px;
        padding: 10px;


`


const DetailRowHover = styled.div`
    position: relative;
    display: grid;
    grid-template-columns: 5fr auto;
    //width: 100%;
    //justify-items: center;
    justify-content: center;
    justify-items: start;
    //font-weight: bold;
    text-align: left;
    align-items: center;
    //margin-left: 10px;

    &:hover{
        border-radius: 10px;
        border: 2px dotted #4d4d4d;

    }

    &:hover ${SubRewardDetails}{

        visibility: visible;

    }
    p {
        //margin: auto;
        padding: 5px 0;
        font-weight: bold;
        

    }

`



const CheckpointWrap = styled.div`

    display: flex;
    flex-direction: column;
    width: 100%;
    //background-color: pink;




`

const CheckpointTop = styled.div`
    margin: 0 auto;
    height: fit-content;
    width: 70%;
    color: #d3d3d3;
    margin-bottom: 1em;

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

const CheckpointBottomTag = styled.p`
    color: ${props => props.status === 'active' ? '#384aff' : (props.status === 'complete' ? 'grey' : '')};
`

const CheckpointBottom = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    width: 75%;
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


const label_status = [
    { status: 'accepting submissions', text: 'rgb(138, 128, 234)', background: 'rgba(138, 128, 234, 0.3)' },
    { status: 'voting', text: 'rgb(211, 151, 39)', background: 'rgba(211, 151, 39, 0.3)' },
    { status: 'end', text: 'rgb(178, 31, 71)', background: 'rgba(178, 31, 71, 0.3)' }

]

export { InterfaceHeading, HeadingSection1, OrgImg, ContestDetails, DetailColumn, DetailRow, DetailRowHover, SubRewardDetails, CheckpointWrap, CheckpointTop, CheckpointBottomTag, CheckpointBottom, label_status }