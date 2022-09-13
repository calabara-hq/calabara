import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { selectContestState } from '../interface/contest-interface-reducer';
import styled from 'styled-components'

const Winners = styled.button`
    position: absolute;
    right: 0;
    border: 2px solid #539bf5;
    background-color: #1a1a1a;
    border-radius: 10px;
    padding: 5px 10px;
    color: #bfbfbf;
    font-weight: bold;
    &:hover{
        background-color: #24262e;
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