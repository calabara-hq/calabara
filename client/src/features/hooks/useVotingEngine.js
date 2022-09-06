import { useState, useMemo, useEffect } from 'react'
import axios from 'axios';
import { selectConnectedBool, selectConnectedAddress } from "../wallet/wallet-reducer";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import useCommon from './useCommon'
import { showNotification } from '../notifications/notifications';





const calculateVotingPower = async (ens, sub_id, walletAddress, contest_hash) => {
    let res = await axios.post('/creator_contests/user_voting_metrics', { ens: ens, contest_hash: contest_hash, sub_id: sub_id, walletAddress: walletAddress });
    return res.data

}


const retract = async (sub_id, walletAddress) => {
    await axios.post('/creator_contests/retract_sub_votes/', { sub_id: sub_id, walletAddress: walletAddress })
    return
}


export default function useVotingEngine(sub_id) {
    const [remaining_vp, set_remaining_vp] = useState(0);
    const [total_available_vp, set_total_available_vp] = useState(0);
    const [votes_spent, set_votes_spent] = useState(0);
    const [restrictions, set_restrictions] = useState(null)
    const walletAddress = useSelector(selectConnectedAddress);
    const isConnected = useSelector(selectConnectedBool);
    const [is_self_voting_error, set_is_self_voting_error] = useState(true);
    const { authenticated_post } = useCommon();

    const { ens, contest_hash } = useParams();

    useEffect(() => {
        if (isConnected) {
            
            calculateVotingPower(ens, sub_id, walletAddress, contest_hash).then(result => {
                if (!result.is_self_voting_error) {
                    set_is_self_voting_error(false);
                    set_remaining_vp(result.metrics.sub_remaining_vp)
                    set_total_available_vp(result.metrics.sub_total_vp)
                    set_votes_spent(result.metrics.sub_votes_spent)
                    set_restrictions(result.restrictions_with_results)
                }
            })
        }
    }, [isConnected])




    const castVote = async (numVotes) => {
        if (numVotes > total_available_vp) {
            showNotification('error', 'error', 'amount exceeds available voting power')
            return false;
        }
        else {
            let spent = await authenticated_post('/creator_contests/cast_vote', { ens: ens, contest_hash: contest_hash, sub_id: sub_id, walletAddress: walletAddress, num_votes: numVotes })
            if (spent) {
                set_remaining_vp(total_available_vp - votes_spent);
                set_votes_spent(spent.data);
                return true;
            }
        }
    }

    const retractVotes = async () => {
        let result = await authenticated_post('/creator_contests/retract_sub_votes', { sub_id: sub_id })
        set_remaining_vp(total_available_vp);
        set_votes_spent(0);
    }

    return {
        remaining_vp: remaining_vp,
        total_available_vp: total_available_vp,
        votes_spent: votes_spent,
        isWalletConnected: isConnected,
        voting_restrictions: restrictions,
        is_self_voting_error,
        castVote: async (numVotes) => {
            return await castVote(numVotes);
        },
        retractVotes: async () => {
            return await retractVotes();
        }
    }

}