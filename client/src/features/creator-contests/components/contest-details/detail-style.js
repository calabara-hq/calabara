import styled from 'styled-components'

export const SummaryWrap = styled.div`
    display: flex;
    flex-direction: column;
    padding: 10px;
    gap: 20px;
    div {
        background-color: #141416;
        border-radius: 10px;
    }
    padding-bottom: 100px;
`


export const ContestDatesWrap = styled.div`
    display: flex;
    flex-direction: column;
    padding: 10px;
    > div {
        display: flex;
        flex-direction: row;
        gap: 10px;
    }
`

export const RewardRow = styled.div`
    display: flex;
    border: 1px dotted grey;
    border-radius: 4px;

    > * {
        margin: 10px;
    }
    > p {
        //text-align: left;
    }

`

export const DetailContainer = styled.div`
    margin-top: 20px;
    margin-bottom: 20px;
`

export const DetailWrap = styled.div`
    padding: 10px;
    span{
        margin-left: 10px;
        padding: 3px 3px;
        border-radius: 4px;
        font-size: 15px;
        font-weight: 550;
    }
`

export const VoterRow = styled.div`
    display: flex;
    flex-direction: column;
    border-radius: 4px;

    > * {
        margin: 10px;
    }
    > p {
        //text-align: left;
    }

`

