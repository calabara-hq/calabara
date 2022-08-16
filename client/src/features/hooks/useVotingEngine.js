import { useState, useMemo, useEffect } from 'react'
import axios from 'axios';
import { selectConnectedBool, selectConnectedAddress } from "../wallet/wallet-reducer";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
/**
 * 
 * 0x1 = token
 * 0x2 = arcade
 */

/**
 * 
 * query db for votes cast by a wallet
 * calculate remaining voting power based on strategy
 * 
 */

/*
*   control the voting power state and actions associated with voting
*   pull contest strategy from elsewhere
*   

*   voting power = spent - available
*/

// TODO 
// get index of submission
// create retract votes endpoint
// 


let strategy = 0x1
let total_allowable = 50

const calculateVotingPower = async (strategy, sub_id, walletAddress, contest_hash) => {
    let res = await axios.post('/creator_contests/fetch_user_spent_votes/', { sub_id: sub_id, walletAddress: walletAddress, contest_hash: contest_hash });
    console.log(res)
    return { votes_spent: parseFloat(res.data.votes_spent), curr_voting_power: total_allowable - parseFloat(res.data.votes_spent) }

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
    const { contest_hash } = useParams();

    useEffect(() => {
        if (isConnected) {
            calculateVotingPower(strategy, sub_id, walletAddress, contest_hash).then(result => {
                console.log(result)
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
            setVotingPower(total_allowable);
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