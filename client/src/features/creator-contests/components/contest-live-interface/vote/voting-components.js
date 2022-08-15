import { useEffect, useMemo, useState } from "react";
import useVotingEngine from "../../../../hooks/useVotingEngine";
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
    const { votingPower, castVote, retractVotes, exceedVotingPowerError, setExceedVotingPowerError } = useVotingEngine();

    console.log('render voting box')

    const updateInput = (e) => {
        if(exceedVotingPowerError) setExceedVotingPowerError(false);
        setVotes(e.target.value)
    }

    return (
        <div>
            <VoteInput type="number" value={votes} onChange={updateInput} placeholder="votes"></VoteInput>
            <CastVotesButton onClick={() => castVote(votes)}>cast votes</CastVotesButton>
            <RetractVotesButton onClick={() => retractVotes()}>retract all votes</RetractVotesButton>
            <p>voting power: {votingPower}</p>
            {exceedVotingPowerError && <b><p>amount exceeds available voting power</p></b>}
        </div>
    )
}

export { SubmissionVotingBox }