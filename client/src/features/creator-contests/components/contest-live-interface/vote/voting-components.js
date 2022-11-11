import { faCheckToSlot, faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { useWalletContext } from "../../../../../app/WalletContext";
import '../../../../../css/gatekeeper-toggle.css';
import '../../../../../css/manage-widgets.css';
import useVotingEngine from "../../../../hooks/useVotingEngine";
import { showNotification } from "../../../../notifications/notifications";
import { fade_in } from "../../common/common_styles";
let compact_formatter = Intl.NumberFormat('en', { notation: 'compact' })
let round_formatter = Intl.NumberFormat('en', { maximumFractionDigits: 0 })




const VotingContainer = styled.div`
    background-color: ${props => props.isVoting ? '#262626' : 'none'};
    padding: 10px;
    border: none;
    border-radius: 10px;
    width: 40em;
    position: relative;
    display: flex;
    flex-wrap: wrap;
    @media screen and (max-width: 1000px){
        width: 100%;
    }
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
    &:active{
        transform: scale(0.9)
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
    &:active{
        transform: scale(0.9)
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
    &:active{
        transform: scale(0.9)
    }

`

const CancelVoteButton = styled.button`
    align-self: center;
    font-size: 16px;
    margin-left: auto;
    background-color: transparent;
    border: none;
    border-radius: 10px;
    color: rgba(244, 33, 46, 0.5);
    padding: 5px 10px;
    &:hover{
        background-color: rgba(244, 33, 46, 0.1);
        color: rgb(244, 33, 46);
    }
    &:active{
        transform: scale(0.9)
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
    flex-direction: row;
    flex-wrap: wrap;
    align-items: flex-end;
    gap: 20px;
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
            showNotification('success', 'success', 'successfully casted votes')

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

    const handleRetractVotes = () => {
        retractVotes();
        showNotification('success', 'success', 'votes retracted')
    }


    return (
        <>
            <VotingContainer isVoting={isVoteButtonClicked}>
                {!isVoteButtonClicked &&
                    <InputCast>
                        <InitialVoteButton disabled={!isWalletConnected || is_self_voting_error} onClick={() => setIsVoteButtonClicked(true)}>vote <FontAwesomeIcon icon={faCheckToSlot} /></InitialVoteButton>
                        {!isWalletConnected && <ConnectWalletButton onClick={walletConnect}>connect wallet</ConnectWalletButton>}
                        <>
                            {votes_spent > 0 && <RetractVotesButton onClick={handleRetractVotes}>retract votes</RetractVotesButton>}
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
                            <div>
                                <VoteInput onWheel={(e) => e.target.blur()} error={exceedVotingPowerError} type="number" value={votesToSpend} onChange={updateInput} placeholder="votes"></VoteInput>
                                <CastVotesButton disabled={!votesToSpend} onClick={() => { handleVote(votesToSpend) }}>cast votes <FontAwesomeIcon icon={faCircleCheck} /></CastVotesButton>
                            </div>
                            <VotingStats>
                                <LightP>votes spent: {compact_formatter.format(votes_spent)}</LightP>
                                <LightP>voting power: {compact_formatter.format(total_available_vp)}</LightP>
                            </VotingStats>
                        </InputCast>
                        <CancelVoteButton onClick={handleCancel}>cancel</CancelVoteButton>
                    </>
                }
            </VotingContainer>
        </>

    )
}

export { SubmissionVotingBox };
