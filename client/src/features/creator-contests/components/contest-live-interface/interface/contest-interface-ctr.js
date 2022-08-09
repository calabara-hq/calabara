import ContestInterface from "./interface";
import { useHistory, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from 'axios';
import { useDispatch } from "react-redux";
import { setContestHash } from "./contest-interface-reducer";

export default function ContestInterfaceController({ }) {
    const [contest_settings, set_contest_settings] = useState(null);
    const [all_contests, set_all_contests] = useState(null);
    const [contest_hash, set_contest_hash] = useState(null);
    const { ens } = useParams();
    const history = useHistory();

    // on page load, fetch all the contests for this org and display.
    // if one is clicked, set the contest_hash in the url and fetch the settings

    useEffect(() => {
        (async () => {
            let res = await axios.get(`/creator_contests/fetch_org_contests/${ens}`);
            //set_contest_settings(res.data)
            console.log(res.data)
            set_all_contests(res.data)
            //dispatch(setContestHash(res.data.hash))
        })();
    }, [])


    useEffect(() => {
        if (contest_hash) {
            (async () => {
                let res = await axios.get(`/creator_contests/fetch_latest_contest/${ens}`);
                set_contest_settings(res.data)
            })();
        }
    }, [contest_hash])



    return (
        <>
            {!contest_settings && all_contests && <ShowContests all_contests={all_contests} set_contest_hash={set_contest_hash} />}
            {contest_settings && <ContestInterface contest_settings={contest_settings} />}
        </>
    )
}

function ShowContests({ all_contests, set_contest_hash }) {
    const history = useHistory();
    const setHash = (_url) => {
        let split = _url.split('/')
        set_contest_hash(split[2])
        history.push('creator_contests/' + split[2])

    }
    return (
        <>
            {all_contests.map((el, index) => {
                return (
                    <p style={{ color: 'lightblue', fontSize: '20px', cursor: 'pointer' }} onClick={() => setHash(el._url)}>hello</p>
                )
            })}
        </>
    )
}