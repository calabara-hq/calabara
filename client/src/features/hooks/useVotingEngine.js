import { useState, useMemo, useEffect } from 'react'


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
*/

const calculateVotingPower = (strategy, wallet, contest_hash) => {
    if (strategy === 0x1) return 20
    else if (strategy === 0x2) return 50
}




export default function useVotingEngine() {
    const [votingPower, setVotingPower] = useState(0);
    const [exceedVotingPowerError, setExceedVotingPowerError] = useState(false);

    useEffect(() => {
        setVotingPower(calculateVotingPower(0x1))
    }, [])


    const castVote = (numVotes) => {
        if (numVotes > votingPower) return setExceedVotingPowerError(true)
        else {
            setVotingPower(votingPower - numVotes)
        }
    }

    const retractVotes = () => {
        setVotingPower(calculateVotingPower(0x1))
    }

    return {
        votingPower: votingPower,
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