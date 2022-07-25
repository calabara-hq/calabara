import styled from 'styled-components'

const InterfaceHeading = styled.div`
    display: flex;
    flex-direction: column;
    color: #d3d3d3;
    margin-bottom: 100px;
    margin-top: 20px;
`

const HeadingSection1 = styled.div`
    display: flex;
    color: #d3d3d3;
    width: 85%;
    margin: 0 auto;
`

const OrgImg = styled.img`
    max-width: 15em;
    border: none;
    border-radius: 4px;
`
const ContestDetails = styled.div`
    display: flex;
    flex-direction: column;
    justify-self: center;
    align-self: center;
    margin: 0 auto;
`

const DetailRow = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    width: 25em;
    justify-content: space-between;
    font-weight: bold;
    text-align: left;
    align-items: center;
    p{
        margin: 0;
        padding: 5px 0;
    }
`

const CheckpointWrap = styled.div`
    margin: 0 auto;
    width: 80%;
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
    color: ${props => props.status === 'active' ? 'green' : (props.status === 'complete' ? 'grey' : '')};
`

const CheckpointBottom = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    width: 85%;
    color: #d3d3d3;
    margin: 0 auto;
    margin-bottom: 50px;
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

export {InterfaceHeading, HeadingSection1, OrgImg, ContestDetails, DetailRow, CheckpointWrap, CheckpointBottomTag, CheckpointBottom, label_status}