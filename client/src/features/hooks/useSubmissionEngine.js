import { useState, useMemo, useEffect } from 'react'
import axios from 'axios';
import { selectConnectedBool, selectConnectedAddress } from "../wallet/wallet-reducer";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import useContract from './useContract';
import useGatekeeper from './useGatekeeper';
import useCommon from './useCommon';


const getUserSubmissions = (contest_hash) => {
    axios.post('/creator_contests/get_user_submissions', { contest_hash: contest_hash }).then(result => { return result.data })
}

const checkUserEligibility = (contest_hash) => {
    axios.post('/creator_contests/check_user_eligibility', { contest_hash: contest_hash }).then(result => { return result.data })
}


export default function useSubmissionEngine(submitter_restrictions) {
    const walletAddress = useSelector(selectConnectedAddress);
    const isConnected = useSelector(selectConnectedBool);
    const [userSubmissions, setUserSubmissions] = useState([])
    const { ens, contest_hash } = useParams();
    const { contestQueryGatekeeper } = useGatekeeper();
    const [restrictionResults, setRestrictionResults] = useState(Object.values(submitter_restrictions))
    const [isUserEligible, setIsUserEligible] = useState(false);
    const { authenticated_post } = useCommon();

    useEffect(() => {
        if (isConnected) {
            // check if wallet already submitted in this contest
            (async () => {
                let [user_subs, eligibility] = await Promise.all([
                    authenticated_post('/creator_contests/get_user_submissions', { contest_hash: contest_hash, ens: ens}).then(result => { return result.data }),
                    authenticated_post('/creator_contests/check_user_eligibility', { contest_hash: contest_hash, ens: ens }).then(result => { return result.data })
                ])
                setUserSubmissions(user_subs);
                setRestrictionResults(eligibility);

                for(const el of eligibility){
                    if(el.user_result && user_subs.length < 1){
                       return setIsUserEligible(true)
                    }
                }
            })();

        }
    }, [isConnected])



    return {
        userSubmissions: userSubmissions,
        isWalletConnected: isConnected,
        restrictionResults: restrictionResults,
        isUserEligible: isUserEligible,
        /*
        castVote: async (numVotes) => {
            return await castVote(numVotes);
        },
        retractVotes: async () => {
            return await retractVotes();
        }
        */
    }

}