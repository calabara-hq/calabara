import styled from 'styled-components'


export const SubmissionMeta = styled.div`
    display: flex;
    flex-direction: row;
    width: 96%;
    margin: 0 auto;
    height: 20%;
    align-items: center;
`
export const SubmissionBottomBlur = styled.div`
    position: absolute;
    bottom: 5px;
    display: flex;
    left: 0;
    width: 100%;
    height: 200px;
    align-items: flex-end;
    background-image: linear-gradient(to bottom, rgba(38, 38, 38, 0), rgba(38, 38, 38, 1) );
`

export const Author = styled.span`

    padding: 3px 10px;
    color: #f2f2f2;
    background-image: linear-gradient(#262626, #262626),linear-gradient(90deg,#e00f8e,#2d66dc);
    background-origin: border-box;
    background-clip: padding-box,border-box;
    border: 2px double transparent;
    border-radius: 10px;
    width: fit-content;
    > p{
        margin: 0;
        color: #d9d9d9;
        font-size: 12px;
    }
`

export const VoteTotals = styled.span`
    color: rgb(211,151,39);
    background-color: #1e1e1e;
    border: 2px solid rgb(211,151,39);
    border-radius: 10px;
    width: fit-content;
    padding: 3px 10px;
    margin-left: auto;
    > p{
        margin: 0;
        font-size: 12px;
    }
`

