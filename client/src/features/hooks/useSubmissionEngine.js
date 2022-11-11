import axios from 'axios';
import { useEffect, useState } from 'react';
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { selectIsConnected, selectWalletAddress } from '../../app/sessionReducer';
import { socket } from '../../service/socket';



export default function useSubmissionEngine(submitter_restrictions) {
    const walletAddress = useSelector(selectWalletAddress);
    const isConnected = useSelector(selectIsConnected);
    const [alreadySubmittedError, setAlreadySubmittedError] = useState(false)
    const { ens, contest_hash } = useParams();
    const [restrictionResults, setRestrictionResults] = useState(submitter_restrictions)
    const [isUserEligible, setIsUserEligible] = useState(false);
    const [submissionStatus, setSubmissionStatus] = useState('not submitted');

    useEffect(() => {
        if (isConnected) processEligibility()
        else setIsUserEligible(false)
    }, [isConnected])


    const processEligibility = () => {
        axios.post('/creator_contests/check_user_eligibility', { contest_hash: contest_hash, ens: ens, walletAddress: walletAddress })
            .then(result => result.data)
            .then(eligibility => {
                setAlreadySubmittedError(eligibility.has_already_submitted);
                eligibility.is_pending ? setSubmissionStatus('registering') : (
                    eligibility.has_already_submitted ? setSubmissionStatus('submitted') : setSubmissionStatus('not submitted')
                )
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
    }


    useEffect(() => {
        socket.on('user_twitter_submission', (status) => setSubmissionStatus(status))
    }, [socket])

    return {
        alreadySubmittedError: alreadySubmittedError,
        isWalletConnected: isConnected,
        restrictionResults: restrictionResults,
        isUserEligible: isUserEligible,
        submissionStatus: submissionStatus,
        processEligibility: () => processEligibility()
    }

}