import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectWalletAddress } from "../../../../../app/sessionReducer";
import { useWalletContext } from "../../../../../app/WalletContext";
import useSubmissionEngine from "../../../../hooks/useSubmissionEngine";
import { Contest_h4 } from "../../common/common_styles";
import { selectContestSettings, selectContestState } from "../interface/contest-interface-reducer";
import { ExpandedPromptComponent } from "../prompts/prompt-display";
import { DataGrid, GridElement, DataWrap, QualificationsContainer, RestrictionStatus, RestrictionStatusNotConnected, ConnectWalletButton, AltSubmissionButton } from "./styles";
import { TagType, TokenType } from "../../../../../css/token-button-styles";
import useVotingEngine from "../../../../hooks/useVotingEngine";
import useContestVotes from "../../../../hooks/useContestVotes";

export default function Qualifications() {
    return (
        <QualificationsContainer>
            <Data />
        </QualificationsContainer>
    )
}


function Data() {
    //const contest_state = useSelector(selectContestState)
    const isWalletConnected = useSelector(selectWalletAddress)
    const contest_state = 1;
    if (contest_state === 0) {
        return <SubmissionRequirements />
    }
    else if (contest_state === 1) {
        if (isWalletConnected) return <VotingData />
        else return <VotingRequirements />
    }
    else if (contest_state === 2) {
        return <Winners />
    }
}


function SubmissionRequirements() {
    const contest_settings = useSelector(selectContestSettings)
    const { walletConnect } = useWalletContext();
    const { isWalletConnected, alreadySubmittedError, restrictionResults, isUserEligible } = useSubmissionEngine(contest_settings.submitter_restrictions);
    const [isCreating, setIsCreating] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const handleDrawerOpen = () => {
        setIsDrawerOpen(true);
        document.body.style.overflow = 'hidden';

    }

    const handleDrawerClose = () => {
        setIsDrawerOpen(false);
        setIsCreating(false);
        document.body.style.overflow = 'unset';
    }

    return (
        <DataWrap>
            <Contest_h4>Submission Eligibility</Contest_h4>
            <DataGrid>
                <GridElement>
                    <div><p>Limit 1 submission</p></div>
                    <div><RestrictionStatus isConnected={isWalletConnected} status={!alreadySubmittedError && isWalletConnected} key={`${isWalletConnected}-already-submitted`} /></div>
                </GridElement>
                {Object.values(restrictionResults).map((restriction, index) => {
                    if (restriction.type === 'erc20' || restriction.type === 'erc721' || restriction.type === 'erc1155') {
                        return (
                            <GridElement key={index}>
                                <div><p>{restriction.threshold} {restriction.symbol}</p></div>
                                <div>
                                    <p>
                                        {isWalletConnected && <RestrictionStatus index={index + 1} isConnected={isWalletConnected} status={restriction.user_result} key={`${isWalletConnected}-${restriction.user_result}`} />}
                                        {!isWalletConnected && <RestrictionStatusNotConnected />}
                                    </p>
                                </div>
                            </GridElement>
                        )
                    }
                })}
                <GridElement>
                    <div>
                        <p>Eligible</p>
                    </div>
                    <div>
                        <RestrictionStatus isConnected={isWalletConnected} status={isUserEligible} key={`${isUserEligible}-eligibility`} />
                    </div>
                </GridElement>
                <GridElement>
                    <div>
                        <p></p>
                    </div>
                    <div>
                        {!isWalletConnected && <ConnectWalletButton onClick={walletConnect}>Connect Wallet</ConnectWalletButton>}
                        {isWalletConnected && <AltSubmissionButton disabled={!isUserEligible} onClick={handleDrawerOpen}>Submit</AltSubmissionButton>}
                    </div>
                    <>
                        <ExpandedPromptComponent isDrawerOpen={isDrawerOpen} handleDrawerClose={handleDrawerClose} isCreating={isCreating} setIsCreating={setIsCreating} />
                    </>
                </GridElement>
            </DataGrid>
        </DataWrap>
    )
}

function VotingRequirements() {
    const contest_settings = useSelector(selectContestSettings)
    return (
        <DataWrap>
            <Contest_h4>Voting Eligibility</Contest_h4>
            <DataGrid>
                {contest_settings.voter_restrictions.length > 1 && <p style={{ color: '#a3a3a3' }}>must satisfy at least one of:</p>}
                {contest_settings.voter_restrictions.map((restriction, idx) => {
                    return (
                        <GridElement key={idx}>
                            <div><p>{restriction.threshold} {restriction.symbol}</p></div>
                            <div><TokenType><TagType type={restriction.type}>{restriction.type}</TagType></TokenType></div>
                        </GridElement>
                    )
                })}
            </DataGrid>
            <Contest_h4 style={{ marginTop: '10px' }}>Voting Strategy</Contest_h4>
            <VotingPolicyDetails voting_strategy={contest_settings.voting_strategy} />
        </DataWrap>
    )
}

function VotingPolicyDetails({ voting_strategy }) {
    if (voting_strategy.strategy_type === 'token') return <TokenComponent voting_strategy={voting_strategy} />
    return <ArcadeComponent voting_strategy={voting_strategy} />
}

const TokenComponent = ({ voting_strategy }) => {

    return (
        <>
            <p><b>{voting_strategy.strategy_type} strategy</b></p>
            <li>Type: <b>{voting_strategy.symbol}</b> <TagType type={voting_strategy.type}>{voting_strategy.type}</TagType></li>
            <li>1 <b>{voting_strategy.symbol}</b> equals 1 <b>voting credit</b></li>
            {voting_strategy.hard_cap > 0 &&
                <li>Contest hard cap: <b>{voting_strategy.hard_cap}</b></li>
            }
            {voting_strategy.sub_cap > 0 &&
                <li>Submission hard cap: <b>{voting_strategy.sub_cap}</b></li>
            }

        </>

    )
}

const ArcadeComponent = ({ voting_strategy }) => {

    return (
        <>
            <p><b>{voting_strategy.strategy_type} strategy</b></p>
            <li>Total Votes: <b>{voting_strategy.hard_cap}</b></li>
            {voting_strategy.sub_cap > 0 &&
                <li>Submission hard cap: <b>{voting_strategy.sub_cap}</b></li>
            }
        </>
    )


}

function VotingData() {
    const contest_settings = useSelector(selectContestSettings)
    const {
        remaining_vp,
        total_available_vp,
    } = useContestVotes(); // use 0 since we're not intersted in any specific sub

    useEffect(() => {
        console.log(total_available_vp)
    }, [total_available_vp])


    return (
        <DataWrap>
            <Contest_h4>Votes</Contest_h4>

        </DataWrap>
    )
}


function Winners() {
    return (
        <DataWrap>

        </DataWrap>
    )
}