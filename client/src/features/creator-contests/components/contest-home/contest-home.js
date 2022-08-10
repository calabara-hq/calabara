import { useEffect, useState } from "react";
import axios from 'axios'
import { useParams, useHistory } from "react-router-dom";


export default function ContestHomepage({ }) {
    const [all_contests, set_all_contests] = useState(null);
    const [contest_hash, set_contest_hash] = useState(null);
    const { ens } = useParams();
    const history = useHistory();

    // on page load, fetch all the contests for this org and display.
    // if one is clicked, set the contest_hash in the url and fetch the settings

    useEffect(() => {
        (async () => {
            let res = await axios.get(`/creator_contests/fetch_org_contests/${ens}`);
            set_all_contests(res.data)
        })();
    }, [])

    const handleClick = (_hash) => {
        history.push(`creator_contests/${_hash}`)
    }
    return (
        <>
            {all_contests && <div>
                {all_contests.map((el, index) => {
                    return (
                        <p style={{ color: 'lightblue', fontSize: '20px', cursor: 'pointer' }} onClick={() => handleClick(el._hash)}>Round {index + 1}</p>
                    )
                })}
            </div>}
        </>
    )


}