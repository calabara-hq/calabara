import { useEffect, useMemo, useState } from "react";
import useVotingEngine from "../../../../hooks/useVotingEngine";
import styled from "styled-components";
import useWallet from "../../../../hooks/useWallet";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckToSlot, faCircleCheck } from "@fortawesome/free-solid-svg-icons";


const VoteInput = styled.input`
    height: 40px;
    width: 100px;
    font-size: 15px;
    font-weight: 550;
    color: #f2f2f2;
    background-color: #121212;
    border: 2px solid #d95169;
    border-radius: 10px;
    outline: none;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.30), 0 15px 12px rgba(0, 0, 0, 0.22);
    padding: 5px 10px;
    text-align: center;
    margin-right: 30px;

    &:hover{
        //border: 2px solid #f2f2f2;

    }

    &:disabled{


    }

`
const InitialVoteButton = styled.button`
    height: 40px;
    font-size: 15px;
    font-weight: 550;
    color: rgb(211,151,39);
    background-color: rgb(211,151,39, .3);
    border: 2px solid rgb(211,151,39, .3);
    border-radius: 10px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.30), 0 15px 12px rgba(0, 0, 0, 0.22);
    padding: 5px 20px;
    margin-right: 30px;
    &:hover{
        background-color: rgb(211,151,39);
        color: #fff;
    
    }

    &:disabled{
    cursor: not-allowed;
    color: rgb(211,151,39, .3);
    background-color: #262626;

    }

`

const ConnectWalletButton = styled.button`
    height: 40px;
    font-size: 15px;
    font-weight: 550;
    color: #f2f2f2;
    background-image: linear-gradient(#262626, #262626),linear-gradient(90deg,#e00f8e,#2d66dc);
    background-origin: border-box;
    background-clip: padding-box,border-box;
    border: 2px double transparent;
    border-radius: 10px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.30), 0 15px 12px rgba(0, 0, 0, 0.22);
    padding: 5px 20px;
    cursor: pointer;

    &:hover{
        background-color: #1e1e1e;
        background-image: linear-gradient(#141416, #141416),
        linear-gradient(to right, #e00f8e, #2d66dc);

    }
    
`
const CastVotesButton = styled.button`
    height: 40px;
    font-size: 15px;
    font-weight: 550;
    color: rgb(6, 214, 160);
    background-color: rgb(6, 214, 160, .3);
    border: 2px solid rgb(6, 214, 160, .3);
    border-radius: 10px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.30), 0 15px 12px rgba(0, 0, 0, 0.22);
    padding: 5px 20px;
    margin-right: 30px;

    &:hover{
        background-color: rgb(6, 214, 160);
        color: #fff;
    
    }
`
const RetractVotesButton = styled.button`
    height: 40px;
    font-size: 15px;
    font-weight: 550;
    color: rgb(211,151,39);
    background-color: #1e1e1e;
    border: 2px solid rgb(211,151,39, .3);
    border-radius: 10px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.30), 0 15px 12px rgba(0, 0, 0, 0.22);
    padding: 5px 20px;
    margin-right: 30px;

    &:hover{
        background-color: rgb(211,151,39);
        color: #fff;
    
    };

`

const IntialVoteButtonA = styled.button `
    height: 40px;
    font-size: 15px;
    font-weight: 550;
    color: rgb(211,151,39);
    background-color: rgb(211,151,39, .3);
    border: 2px solid rgb(211,151,39, .3);
    border-radius: 10px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.30), 0 15px 12px rgba(0, 0, 0, 0.22);
    padding: 5px 20px;
    margin-right: 30px;

    &:hover{
        background-color: rgb(6, 214, 160);
        color: #fff;
    
    };
    ////////////////////////////
    height: 40px;
    font-size: 15px;
    font-weight: 550;
    color: #ffff;
    border: 2px double transparent;
    border-radius: 10px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.30), 0 15px 12px rgba(0, 0, 0, 0.22);
    padding: 5px 20px;
    background-image: linear-gradient(#262626, #262626),linear-gradient(90deg,#e00f8e,#2d66dc);
    background-origin: border-box;
    background-clip: padding-box,border-box;
    margin-right: 30px;
    cursor: pointer;

    &:hover{
    background-color: #1e1e1e;
    background-image: linear-gradient(#141416, #141416),
    linear-gradient(to right, #e00f8e, #2d66dc);

    }

    &:disabled{
    cursor: not-allowed;
    background-image: linear-gradient(#262626, #262626),linear-gradient(90deg,#e00f8e,#2d66dc);

    }
    
`

const VoteP = styled.p `

    font-size: 15px;
    font-weight: 550;
    color: #d9d9d9;

`

const InputCast = styled.div`
    display: flex;
    flex: 1;
    flex-direction: row;
    align-items: flex-end;

    > p {
        font-size: 15px;
        font-weight: 550;
        color: #d9d9d9;

    }

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
                <InputCast>
                    <InitialVoteButton disabled={!isWalletConnected} onClick={() => setIsVoteButtonClicked(true)}>vote <FontAwesomeIcon icon={faCheckToSlot}/></InitialVoteButton>
                    {!isWalletConnected && <ConnectWalletButton onClick={walletConnect}>connect wallet</ConnectWalletButton>}
                    {spentVotes > 0 &&
                        <>
                            <RetractVotesButton onClick={() => retractVotes()}>retract votes</RetractVotesButton>
                            <p>spent votes: {spentVotes}</p>
                        </>
                    }
                </InputCast>
            }
            {isVoteButtonClicked &&
                <InputCast>
                    <VoteInput type="number" value={votesToSpend} onChange={updateInput} placeholder="votes"></VoteInput>
                    <CastVotesButton onClick={() => {castVote(votesToSpend); setIsVoteButtonClicked(false)}}>cast votes <FontAwesomeIcon icon={faCircleCheck}/></CastVotesButton>
                    <p>voting power: {votingPower}</p>
                    {exceedVotingPowerError && <b><p>amount exceeds available voting power</p></b>}
                </InputCast>
            }
        </div>
    )
}

export { SubmissionVotingBox }