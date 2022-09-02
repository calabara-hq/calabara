import ContestInterface from "./interface";
import { useHistory, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from 'axios';
import { useDispatch } from "react-redux";
import { setContestHash } from "./contest-interface-reducer";

export default function ContestInterfaceController({ }) {
    const [contest_data, set_contest_data] = useState(null);
    const { ens, contest_hash } = useParams();

    // on page load, fetch all the contests for this org and display.
    // if one is clicked, set the contest_hash in the url and fetch the settings

    useEffect(() => {
        (async () => {
            let res = await axios.get(`/creator_contests/fetch_contest/${ens}/${contest_hash}`);
            set_contest_data(res.data)
        })();
    }, [])

    return (
        <>
            {contest_data && <ContestInterface contest_settings={contest_data.settings} prompt_data={contest_data.prompt_data} />}
        </>
    )
}

