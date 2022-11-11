import axios from 'axios';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { selectIsConnected, selectWalletAddress } from '../../app/sessionReducer';
import { useWalletContext } from '../../app/WalletContext';
import { selectRemainingVotingPower, setRemainingVotingPower } from '../creator-contests/components/contest-live-interface/interface/contest-interface-reducer';
import { showNotification } from '../notifications/notifications';





const calculateSubmissionVotingPower = async (ens, sub_id, walletAddress, contest_hash) => {
    let res = await axios.post('/creator_contests/user_voting_metrics', { ens: ens, contest_hash: contest_hash, sub_id: sub_id, walletAddress: walletAddress });
    return res.data
}

export default function useVotingEngine(sub_id) {
    const [remaining_vp, set_remaining_vp] = useState(0);
    const [total_available_vp, set_total_available_vp] = useState(0);
    const [votes_spent, set_votes_spent] = useState(0);
    const contest_remaining_vp = useSelector(selectRemainingVotingPower)
    const [restrictions, set_restrictions] = useState(null)
    const isConnected = useSelector(selectIsConnected);
    const walletAddress = useSelector(selectWalletAddress);
    const [is_self_voting_error, set_is_self_voting_error] = useState(true);
    const { authenticated_post } = useWalletContext();
    const { ens, contest_hash } = useParams();

    const dispatch = useDispatch();
    useEffect(() => {
        if (isConnected) {

            calculateSubmissionVotingPower(ens, sub_id, walletAddress, contest_hash).then(result => {
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
                dispatch(setRemainingVotingPower(contest_remaining_vp - (numVotes - votes_spent)))
                set_remaining_vp(total_available_vp - votes_spent);
                set_votes_spent(spent.data);
                return true;
            }
        }
    }

    const retractVotes = async () => {
        await authenticated_post('/creator_contests/retract_sub_votes', { sub_id: sub_id })
            .then(() => {
                dispatch(setRemainingVotingPower(contest_remaining_vp + votes_spent))
                set_remaining_vp(total_available_vp);
                set_votes_spent(0);
            })
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