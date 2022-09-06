import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';


export default function DisplayWinners({ contest_state }) {
    const [winners, setWinners] = useState(null);
    const { ens, contest_hash } = useParams();

    useEffect(() => {
        fetch(`/creator_contests/fetch_contest_winners?ens=${ens}&contest_hash=${contest_hash}`)
            .then(res => res.json())
            .then(data => setWinners(data))
    }, [])

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

    return (
        <div>
            <button onClick={handleDownloadCsv}>download as csv</button>
        </div>

    )

}