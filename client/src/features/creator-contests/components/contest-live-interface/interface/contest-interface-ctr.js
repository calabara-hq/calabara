import ContestInterface from "../interface";
import InterfaceContext from "./interface-ctr-context";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from 'axios';


export default function ContestInterfaceController({ }) {
    const [contest_settings, set_contest_settings] = useState(null)
    const { ens } = useParams();
    useEffect(() => {
        (async () => {
            console.log('re fetch')
            let res = await axios.get(`/creator_contests/fetch_contest/${ens}`);
            set_contest_settings(res.data)
        })();
    }, [])

    return (
        <>
            {contest_settings && <ContestInterface contest_settings={contest_settings}/>}
        </>
    )
}