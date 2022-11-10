import { useState, useMemo, useEffect } from 'react'
import axios from 'axios';
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { selectContestState } from '../creator-contests/components/contest-live-interface/interface/contest-interface-reducer';
import { selectIsConnected, selectWalletAddress } from '../../app/sessionReducer';
import { socket } from '../../service/socket';



export default function useSubmissionEngine(submitter_restrictions) {
    const walletAddress = useSelector(selectWalletAddress);
    const isConnected = useSelector(selectIsConnected);
    const [alreadySubmittedError, setAlreadySubmittedError] = useState(false)
    const { ens, contest_hash } = useParams();
    const [restrictionResults, setRestrictionResults] = useState(submitter_restrictions)
    const [isUserEligible, setIsUserEligible] = useState(false);
    const [submissionStatus, setSubmissionStatus] = useState('pending');


    useEffect(() => {
        if (isConnected) {
            // check if wallet already submitted in this contest
            axios.post('/creator_contests/check_user_eligibility', { contest_hash: contest_hash, ens: ens, walletAddress: walletAddress })
                .then(result => result.data)
                .then(eligibility => {
                    setAlreadySubmittedError(eligibility.has_already_submitted);
                    eligibility.has_already_submitted ? setSubmissionStatus('submitted') : setSubmissionStatus('not submitted')
                    console.log(eligibility.restrictions)
                    setRestrictionResults(eligibility.restrictions);

                    // error if not in submit window
                    if (!eligibility.is_submit_window) return setIsUserEligible(false);

                    // submitter restrictions are either true or an array
                    // if restriction results are true (no restrictions)
                    if (eligibility.restrictions === true) {
                        if (!eligibility.has_already_submitted) {
                            return setIsUserEligible(true)
                        }
                    }
                    // restriction results are an array
                    else {
                        for (const el of eligibility.restrictions) {
                            if (el.user_result && !eligibility.has_already_submitted) {
                                return setIsUserEligible(true)
                            }
                        }
                    }
                })
            socket.emit('user-subscribe', `${contest_hash}-${walletAddress}`)
        }
        else {
            setIsUserEligible(false)
        }
    }, [isConnected])


    useEffect(() => {
        socket.on('user_twitter_submission', (status) => setSubmissionStatus(status))
    }, [socket])

    return {
        alreadySubmittedError: alreadySubmittedError,
        isWalletConnected: isConnected,
        restrictionResults: restrictionResults,
        isUserEligible: isUserEligible,
        submissionStatus: submissionStatus
    }

}