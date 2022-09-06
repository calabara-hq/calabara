import { useState, useMemo, useEffect } from 'react'
import axios from 'axios';
import { selectConnectedBool, selectConnectedAddress } from "../wallet/wallet-reducer";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import useContract from './useContract';
import useGatekeeper from './useGatekeeper';
import useCommon from './useCommon';




export default function useSubmissionEngine(submitter_restrictions) {
    const walletAddress = useSelector(selectConnectedAddress);
    const isConnected = useSelector(selectConnectedBool);
    const [alreadySubmittedError, setAlreadySubmittedError] = useState(false)
    const { ens, contest_hash } = useParams();
    const { contestQueryGatekeeper } = useGatekeeper();
    const [restrictionResults, setRestrictionResults] = useState(Object.values(submitter_restrictions))
    const [isUserEligible, setIsUserEligible] = useState(false);
    const { authenticated_post } = useCommon();

    useEffect(() => {
        if (isConnected) {
            // check if wallet already submitted in this contest
            (async () => {
                
                let eligibility = await axios.post('/creator_contests/check_user_eligibility', { contest_hash: contest_hash, ens: ens, walletAddress: walletAddress }).then(result => { return result.data })

                setAlreadySubmittedError(eligibility.has_already_submitted);

                setRestrictionResults(eligibility.restrictions);
                if (eligibility.restrictions.length === 0) {
                    if (!eligibility.has_already_submitted) {
                        return setIsUserEligible(true)
                    }
                }
                for (const el of eligibility.restrictions) {
                    if (el.user_result && !eligibility.has_already_submitted) {
                        return setIsUserEligible(true)
                    }
                }
            })();

        }

        else {
            setIsUserEligible(false)
        }
    }, [isConnected])



    return {
        alreadySubmittedError: alreadySubmittedError,
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