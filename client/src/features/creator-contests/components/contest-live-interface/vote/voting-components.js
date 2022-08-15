import { useEffect, useState } from "react";
import { calculateVotingPower } from "../../../../hooks/useVotingEngine";
import styled from "styled-components";



const VoteInput = styled.input`
    color: black;
`

const CastVotesButton = styled.button`
    color: black;
`
const RetractVotesButton = styled.button`
    color: black;
`

function SubmissionVotingBox({ }) {
    const [votes, setVotes] = useState(null);
    const [votingPower, setVotingPower] = useState(0);

    useEffect(() => {
        setVotingPower(calculateVotingPower(0x1))
    }, [])

    const updateInput = (e) => {
        setVotes(e.target.value)
    }

    return (
        <div>
            <VoteInput value={votes} onChange={updateInput} placeholder="votes"></VoteInput>
            <CastVotesButton>cast votes</CastVotesButton>
            <RetractVotesButton>retract all votes</RetractVotesButton>
        </div>
    )
}

export { SubmissionVotingBox }