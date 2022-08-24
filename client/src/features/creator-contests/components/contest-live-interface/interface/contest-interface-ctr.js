import ContestInterface from "./interface";
import { useHistory, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from 'axios';
import { useDispatch } from "react-redux";
import { setContestHash } from "./contest-interface-reducer";

export default function ContestInterfaceController({ }) {
    const [contest_settings, set_contest_settings] = useState(null);
    const { ens, contest_hash } = useParams();

    // on page load, fetch all the contests for this org and display.
    // if one is clicked, set the contest_hash in the url and fetch the settings

    useEffect(() => {
        (async () => {
            let res = await axios.get(`/creator_contests/fetch_contest/${ens}/${contest_hash}`);
            console.log(res.data)
            set_contest_settings(res.data)
        })();
    }, [])

    return (
        <>
        {contest_settings && <p>hi</p>}
            {contest_settings && <ContestInterface contest_settings={contest_settings} />}
        </>
    )
}

