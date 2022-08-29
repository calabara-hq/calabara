import { useState, useMemo, useEffect } from 'react'
import axios from 'axios';
import { selectConnectedBool, selectConnectedAddress } from "../wallet/wallet-reducer";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import useCommon from './useCommon'




const calculateVotingPower = async (sub_id, walletAddress, contest_hash) => {
    let res = await axios.get(`/creator_contests/user_voting_metrics?contest_hash=${contest_hash}&sub_id=${sub_id}&walletAddress=${walletAddress}`);
    console.log(res.data)
    return { votes_spent: res.data.votes_spent, curr_voting_power: res.data.voting_power }

}

const sendVote = async (sub_id, numVotes, walletAddress, contest_hash) => {
    let remaining = await axios.post('/creator_contests/cast_vote/', { contest_hash: 'cd97e8e2', sub_id: sub_id, walletAddress: walletAddress, num_votes: numVotes })
}


const retract = async (sub_id, walletAddress) => {
    let retracted = await axios.post('/creator_contests/retract_sub_votes/', { sub_id: sub_id, walletAddress: walletAddress })
}


export default function useVotingEngine(sub_id) {
    const [votingPower, setVotingPower] = useState(0);
    const [spentVotes, setSpentVotes] = useState(0);
    const [exceedVotingPowerError, setExceedVotingPowerError] = useState(false);
    const walletAddress = useSelector(selectConnectedAddress);
    const isConnected = useSelector(selectConnectedBool);
    const { authenticated_post } = useCommon();
    const { contest_hash } = useParams();

    useEffect(() => {
        if (isConnected) {
            calculateVotingPower(sub_id, walletAddress, contest_hash).then(result => {
                setVotingPower(result.curr_voting_power)
                setSpentVotes(result.votes_spent)
            })
        }
    }, [isConnected])


    

    const castVote = (numVotes) => {
        if (numVotes > votingPower) return setExceedVotingPowerError(true)
        else {
            sendVote(sub_id, numVotes, walletAddress, contest_hash)
            setVotingPower(votingPower - numVotes);
            setSpentVotes(spentVotes + numVotes)
        }
    }

    const retractVotes = async () => {
        retract(sub_id, walletAddress).then(result => {
            //setVotingPower(total_allowable);
            setSpentVotes(0);
        })
    }

    return {
        votingPower: votingPower,
        spentVotes: spentVotes,
        isWalletConnected: isConnected,
        exceedVotingPowerError: exceedVotingPowerError,
        setExceedVotingPowerError: setExceedVotingPowerError,
        castVote: async (numVotes) => {
            return await castVote(numVotes);
        },
        retractVotes: async () => {
            return await retractVotes();
        }
    }

}