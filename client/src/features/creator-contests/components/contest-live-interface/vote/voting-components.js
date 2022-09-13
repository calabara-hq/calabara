import { useEffect, useMemo, useState } from "react";
import useVotingEngine from "../../../../hooks/useVotingEngine";
import styled from "styled-components";
import { useWalletContext } from "../../../../../app/WalletContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckToSlot, faCircleCheck, faQuestionCircle } from "@fortawesome/free-solid-svg-icons";
import { ErrorMessage, fade_in } from "../../common/common_styles";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import '../../../../../css/manage-widgets.css'
import '../../../../../css/gatekeeper-toggle.css'
let compact_formatter = Intl.NumberFormat('en', { notation: 'compact' })
let round_formatter = Intl.NumberFormat('en', { maximumFractionDigits: 0 })




const VotingContainer = styled.div`
    background-color: ${props => props.isVoting ? '#262626' : 'none'};
    padding: 10px;
    border: none;
    border-radius: 10px;
    width: ${props => props.isVoting ? '40em' : '40em'};
    position: relative;
    display: flex;
`


const VoteInput = styled.input`
    height: 40px;
    width: 100px;
    font-size: 15px;
    font-weight: 550;
    color: #f2f2f2;
    background-color: #121212;
    border: 2px solid ${props => props.error ? '#d95169' : 'rgb(211,151,39)'};
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
    transition: background-color 0.3s ease-in-out;
    transition: color 0.3s ease-in-out;

    &:hover{
        background-color: rgb(6, 214, 160);
        color: #fff;
    }

    &:disabled{
        cursor: not-allowed;
        color: rgba(6, 214, 160, 0.3);
        background-color: #262626;
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

const CancelVoteButton = styled.button`

    border: 2px solid #4d4d4d;
    color: grey;
    border-radius: 100px;
    padding: 5px 15px 5px 15px;
    background-color: transparent;
    margin-left: auto;
    animation: ${fade_in} 0.4s ease-in-out;
    &:hover{
        color: #d3d3d3;
        background-color: #1e1e1e;
    }
`



const VotingStats = styled.div`
    display: flex;
    flex-direction: column;
    position: relative;

    > p {
        margin: 0;
    }

`


const LightP = styled.p`
    font-size: 15px;
    font-weight: 550;
    color: grey;
    cursor: pointer;
    -webkit-touch-callout: none; /* iOS Safari */
    -webkit-user-select: none; /* Safari */
    -khtml-user-select: none; /* Konqueror HTML */
    -moz-user-select: none; /* Old versions of Firefox */
    -ms-user-select: none; /* Internet Explorer/Edge */
    user-select: none; 

`

const InputCast = styled.div`
    display: flex;
    flex: 1;
    flex-direction: row;
    align-items: flex-end;
    animation: ${fade_in} 0.4s ease-in-out;
`






function SubmissionVotingBox({ sub_id }) {
    const [isVoteButtonClicked, setIsVoteButtonClicked] = useState(false);
    const [exceedVotingPowerError, setExceedVotingPowerError] = useState(false);
    const { walletConnect } = useWalletContext();
    const [votesToSpend, setVotesToSpend] = useState('');
    const [formatVotesSpent, setFormatVotesSpent] = useState(true);
    const [formatVotingPower, setFormatVotingPower] = useState(true);


    const {
        remaining_vp,
        votes_spent,
        total_available_vp,
        isWalletConnected,
        voting_restrictions,
        is_self_voting_error,
        castVote,
        retractVotes
    } = useVotingEngine(sub_id);




    useEffect(() => {
        setVotesToSpend(votes_spent || '')
    }, [votes_spent])


    const updateInput = (e) => {
        if (exceedVotingPowerError) setExceedVotingPowerError(false);
        setVotesToSpend(Math.abs(Math.round(e.target.value)) || '')
    }

    const handleVote = async (num_votes) => {
        if (num_votes != '') {
            let didCast = await castVote(num_votes)
            if (!didCast) return setExceedVotingPowerError(true)
            setIsVoteButtonClicked(false)
        }
    }

    const handleCancel = () => {
        setIsVoteButtonClicked(false)
        setExceedVotingPowerError(false)
        setVotesToSpend(votes_spent || '')
    }

    const formatSpent = () => {
        setFormatVotesSpent(!formatVotesSpent)
    }

    const formatVP = () => {
        setFormatVotingPower(!formatVotingPower)
    }


    return (
        <>
            <VotingContainer isVoting={isVoteButtonClicked}>
                {!isVoteButtonClicked &&
                    <InputCast>
                        <InitialVoteButton disabled={!isWalletConnected || is_self_voting_error} onClick={() => setIsVoteButtonClicked(true)}>vote <FontAwesomeIcon icon={faCheckToSlot} /></InitialVoteButton>
                        {!isWalletConnected && <ConnectWalletButton onClick={walletConnect}>connect wallet</ConnectWalletButton>}
                        <>
                            {votes_spent > 0 && <RetractVotesButton onClick={retractVotes}>retract votes</RetractVotesButton>}
                            {(isWalletConnected && !is_self_voting_error) &&
                                <>
                                    <VotingStats>
                                        <LightP onClick={formatSpent}>votes spent:{" "} {formatVotesSpent ? compact_formatter.format(votes_spent) : round_formatter.format(votes_spent)}</LightP>
                                        <LightP onClick={formatVP}>voting power: {formatVotingPower ? compact_formatter.format(total_available_vp) : round_formatter.format(total_available_vp)} </LightP>
                                    </VotingStats>
                                </>
                            }
                        </>
                    </InputCast>
                }
                {isVoteButtonClicked &&
                    <>
                        <InputCast>
                            <VoteInput onWheel={(e) => e.target.blur()} error={exceedVotingPowerError} type="number" value={votesToSpend} onChange={updateInput} placeholder="votes"></VoteInput>
                            <CastVotesButton disabled={!votesToSpend} onClick={() => { handleVote(votesToSpend) }}>cast votes <FontAwesomeIcon icon={faCircleCheck} /></CastVotesButton>
                            <VotingStats>
                                <LightP>votes spent: {compact_formatter.format(votes_spent)}</LightP>
                                <LightP>voting power: {compact_formatter.format(total_available_vp)}</LightP>
                            </VotingStats>
                        </InputCast>
                        <CancelVoteButton onClick={handleCancel}><FontAwesomeIcon icon={faTimes} /></CancelVoteButton>
                    </>
                }
            </VotingContainer>
        </>

    )
}

export { SubmissionVotingBox }