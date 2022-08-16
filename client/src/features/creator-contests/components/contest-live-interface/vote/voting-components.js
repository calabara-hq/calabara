import { useEffect, useMemo, useState } from "react";
import useVotingEngine from "../../../../hooks/useVotingEngine";
import styled from "styled-components";
import useWallet from "../../../../hooks/useWallet";

const VoteInput = styled.input`
    color: black;
`
const InitialVoteButton = styled.button`
    color: black;
`
const ConnectWalletButton = styled.button`
    color: black;
`
const CastVotesButton = styled.button`
    color: black;
`
const RetractVotesButton = styled.button`
    color: black;
`

function SubmissionVotingBox({ sub_id }) {
    const [votesToSpend, setVotesToSpend] = useState(null);
    const [isVoteButtonClicked, setIsVoteButtonClicked] = useState(false);
    const { walletConnect } = useWallet();

    const {
        votingPower,
        spentVotes,
        isWalletConnected,
        castVote,
        retractVotes,
        exceedVotingPowerError,
        setExceedVotingPowerError
    } = useVotingEngine(sub_id);


    const updateInput = (e) => {
        if (exceedVotingPowerError) setExceedVotingPowerError(false);
        setVotesToSpend(parseFloat(e.target.value))
    }


    return (
        <div>
            {!isVoteButtonClicked &&
                <div>
                    <InitialVoteButton disabled={!isWalletConnected} onClick={() => setIsVoteButtonClicked(true)}>vote</InitialVoteButton>
                    {!isWalletConnected && <ConnectWalletButton onClick={walletConnect}>connect wallet</ConnectWalletButton>}
                    {spentVotes > 0 &&
                        <>
                            <RetractVotesButton onClick={() => retractVotes()}>retract votes</RetractVotesButton>
                            <p>spent votes: {spentVotes}</p>
                        </>
                    }
                </div>
            }
            {isVoteButtonClicked &&
                <div>
                    <VoteInput type="number" value={votesToSpend} onChange={updateInput} placeholder="votes"></VoteInput>
                    <CastVotesButton onClick={() => {castVote(votesToSpend); setIsVoteButtonClicked(false)}}>cast votes</CastVotesButton>
                    <p>voting power: {votingPower}</p>
                    {exceedVotingPowerError && <b><p>amount exceeds available voting power</p></b>}
                </div>
            }
        </div>
    )
}

export { SubmissionVotingBox }