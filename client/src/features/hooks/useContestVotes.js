
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { selectIsConnected, selectWalletAddress } from '../../app/sessionReducer';


const calculateContestVotingPower = async (ens, walletAddress, contest_hash) => {
    let res = await axios.post('/creator_contests/user_total_voting_metrics', { ens: ens, contest_hash: contest_hash, walletAddress: walletAddress });
    return res.data

}

export default function useContestVotes() {
    const [remaining_vp, set_remaining_vp] = useState(0);
    const [total_available_vp, set_total_available_vp] = useState(0);
    const [votes_spent, set_votes_spent] = useState(0);
    const isConnected = useSelector(selectIsConnected);
    const walletAddress = useSelector(selectWalletAddress);
    const { ens, contest_hash } = useParams();


    useEffect(() => {
        if (isConnected) {

            calculateContestVotingPower(ens, walletAddress, contest_hash).then(result => {
                console.log(result)
                if (!result.is_self_voting_error) {
                    set_remaining_vp(result.metrics.contest_remaining_vp)
                    set_total_available_vp(result.metrics.contest_total_vp)
                    //set_votes_spent(result.metrics.sub_votes_spent)
                }
            })
        }
    }, [isConnected])


    return {
        remaining_vp: remaining_vp,
        total_available_vp: total_available_vp,
        votes_spent: votes_spent,
        isWalletConnected: isConnected,
    }

}