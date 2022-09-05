import { useHistory, useParams } from "react-router-dom";
import React, { useState, useEffect, Suspense } from "react";
import axios from 'axios';
import { useDispatch } from "react-redux";
import { setContestHash } from "./contest-interface-reducer";
import { Placeholder } from "../../common/common_components";
const ContestInterface = React.lazy(() => import('./interface'));

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
        <Suspense fallback={<Placeholder />}>
            {contest_data && <ContestInterface contest_settings={contest_data.settings} prompt_data={contest_data.prompt_data} />}
        </Suspense>
    )
}

