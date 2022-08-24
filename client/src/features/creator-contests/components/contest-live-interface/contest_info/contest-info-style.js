import styled from 'styled-components'

const InterfaceHeading = styled.div`
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    align-content: center;
    color: #d3d3d3;
    margin-bottom: 70px;
    margin-top: 50px;
`

const HeadingSection1 = styled.div`
    display: flex;
    color: #d3d3d3;
    width: 85%;
    //margin-left: 20px;
`

const OrgImg = styled.img`
    flex: 0 0 30%;
    max-width: 15em;
    border: none;
    border-radius: 4px;
`
const ContestDetails = styled.div`
    display: flex;
    height: 130px;
    width: 70%;
    flex-direction: row;
    justify-self: center;
    align-self: center;
    margin: 0 auto;
`

const DetailColumn = styled.div`
    //background-color: grey;
    display: flex;
    flex-direction: column;
    flex: 1 1 33%;
    justify-content: center;
    border: 2px solid #4d4d4d;
    border-radius: 10px;
    margin: 10px;
    padding: 20px;


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

    &:nth-child(2){
        //background-color: blue;
    }

    p {
        //margin: auto;
        padding: 5px 0;
        font-weight: bold;

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
    color: ${props => props.status === 'active' ? '#384aff' : (props.status === 'complete' ? 'grey' : '')};
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

export { InterfaceHeading, HeadingSection1, OrgImg, ContestDetails, DetailColumn, DetailRow, CheckpointWrap, CheckpointBottomTag, CheckpointBottom, label_status }