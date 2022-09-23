import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { selectContestState } from '../interface/contest-interface-reducer';
import styled from 'styled-components'

const Winners = styled.button`
    margin-left: auto;
    font-size: 15px;
    border: 2px solid #539bf5;
    border-radius: 10px;
    background-color: #1e1e1e;
    color: #d3d3d3;
    padding: 10px 15px;
    &:active{
        transform: scale(0.9);
    }
    @media screen and (max-width: 408px){
        margin-left: 0;
    }

`

export default function DisplayWinners() {
    const [winners, setWinners] = useState(null);
    const { ens, contest_hash } = useParams();
    const contest_state = useSelector(selectContestState)


    const handleDownloadCsv = async () => {
        let csv_data = await fetch(`/creator_contests/fetch_contest_winners_as_csv?ens=${ens}&contest_hash=${contest_hash}`)
            .then(res => res.text())

        var encodedUri = encodeURI(csv_data);
        var link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "winners.csv");
        document.body.appendChild(link); // Required for FF
        link.click();

    }

    if (contest_state === 2) {
        return (
            <Winners onClick={handleDownloadCsv}>Download Winners</Winners>
        )
    }
    return (<></>)
}