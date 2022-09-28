import React, { useEffect, useReducer, useRef, useState } from "react"
import ContestDateTimeBlock from "./datepicker/start-end-date"
import ContestRewardsBlock from "./contest_rewards/contest-rewards-block"
import ContestParticipantRestrictions from "./contest_gatekeeper/particpant_restrictions";
import PromptBuilder from "./prompt_builder/prompt-builder";
import SimpleInputs from "./contest_simple_inputs/contest_simple_inputs";
import styled from 'styled-components'
import VotingPolicy from "./voting_policy/voting-policy";
import { useParams } from "react-router-dom";
import useDashboardRules from "../../../hooks/useDashboardRules";
import useCommon from "../../../hooks/useCommon";
import { rewardOptionState, voterRewardState, submitterRewardState } from "./contest_rewards/reducers/rewards-reducer";
import { useSelector } from "react-redux";
import { fade_in } from "../common/common_styles";
import '../../../../css/manage-widgets.css'
import '../../../../css/gatekeeper-toggle.css'
import { TagType } from "../common/common_styles";



// error handling
import useErrorHandler from "./handle-errors";
import Twitter from "./twitter_automation/twitter";
import DrawerComponent from "../../../drawer/drawer";




const theme = {
    rainbow: {
        palette: {
            brand: '#539bf5',
            brand_alt: '#f2f2f2',
            mainBackground: '#303030',
            fontSize: '20px',
            rewards_text: [
                '#80deea',
                'rgb(173, 156, 220)',
                'rgb(26, 188, 156)',
                'rgb(155, 89, 182)',
            ],
            rewards_background: [
                'rgba(128, 222, 234, 0.3)',
                'rgba(173, 156, 220, 0.3)',
                'rgba(26, 188, 156, 0.3)',
                'rgba(155, 89, 182, 0.3)',
            ],
            rewards_text_alt: [
                '#d95169',
                '#3c3c3d',
                '#03b09f',
                '#ab6afb',
            ],

        },
    },
};



const ContestSettingsWrap = styled.div`
    width: 95vw;
    margin: 0 auto;
    padding: 10px;
    display: flex;
    flex-direction: column;
    animation: ${fade_in} 0.4s ease-in-out;

`

const SettingsBlockElement = styled.div`
        margin: 50px auto;
        border-radius: 10px;
        width: 60%;
        padding: 10px;
        background-color: #1e1e1e;
        color: #d9d9d9;

        @media screen and (max-width: 1300px){
            width: 90%;
        }
`

const SaveButton = styled.button`
    width: 60%;
    margin: 50px auto;
    border: 2px solid rgb(83,155,245);
    background-color: rgb(83,155,245); 
    padding: 10px 15px;
    border-radius: 10px;
    font-weight: bold;
    &:hover{
        background-color: rgba(83,155,245, 0.9);
    }
    &:active{
        transform: scale(1.01);
    }
`

function reducer(state, action) {
    switch (action.type) {
        case 'update_single':
            return { ...state, ...action.payload };
        case 'update_all':
            return { ...action.payload }
        default:
            throw new Error();
    }
}


const initialPromptData = {
    prompt_heading: null,
    prompt_heading_error: false,
    prompt_label: null,
    prompt_label_error: false,
    prompt_label_color: 0,
    prompt_content_error: false,
    prompt_cover_image: null
}


export default function ContestSettings() {
    const [currentDate, setCurrentDate] = useState(new Date())
    const [date_1, setDate_1] = useState(new Date())
    const [date_2, setDate_2] = useState(new Date())
    const [snapshotDate, setSnapshotDate] = useState(new Date())

    const [votingStrategy, setVotingStrategy] = useReducer(reducer, { strategy_id: 0x0 });
    const [votingStrategyError, setVotingStrategyError] = useState(false);
    const [submitterAppliedRules, setSubmitterAppliedRules] = useReducer(reducer, {});
    const [voterAppliedRules, setVoterAppliedRules] = useReducer(reducer, {});
    const [submitterRuleError, setSubmitterRuleError] = useState(false);
    const [voterRuleError, setVoterRuleError] = useState(false);
    const [promptBuilderData, setPromptBuilderData] = useReducer(reducer, initialPromptData)
    const [simpleInputData, setSimpleInputData] = useReducer(reducer, { anonSubmissions: true, visibleVotes: false, selfVoting: false })

    const TimeBlockRef = useRef(null);
    const RewardsRef = useRef(null);
    const RestrictionsBlockRef = useRef(null)
    const StrategyBlockRef = useRef(null)
    const PromptBlockRef = useRef(null)
    const promptEditorCore = useRef(null);


    return (
        <ContestSettingsWrap>

            <SettingsBlockElement ref={TimeBlockRef}>
                <ContestDateTimeBlock
                    currentDate={currentDate}
                    snapshotDate={snapshotDate}
                    date_1={date_1}
                    date_2={date_2}
                    setCurrentDate={setCurrentDate}
                    setSnapshotDate={setSnapshotDate}
                    setDate_1={setDate_1}
                    setDate_2={setDate_2}
                />
            </SettingsBlockElement>

            <SettingsBlockElement ref={RewardsRef}>
                <ContestRewardsBlock
                    theme={theme.rainbow}
                />
            </SettingsBlockElement>

            <SettingsBlockElement ref={RestrictionsBlockRef}>
                <ContestParticipantRestrictions
                    submitterAppliedRules={submitterAppliedRules}
                    setSubmitterAppliedRules={setSubmitterAppliedRules}
                    voterAppliedRules={voterAppliedRules}
                    setVoterAppliedRules={setVoterAppliedRules}
                    submitterRuleError={submitterRuleError}
                    setSubmitterRuleError={setSubmitterRuleError}
                    voterRuleError={voterRuleError}
                    setVoterRuleError={setVoterRuleError}
                />
            </SettingsBlockElement>

            <SettingsBlockElement ref={StrategyBlockRef}>
                <VotingPolicy votingStrategy={votingStrategy} setVotingStrategy={setVotingStrategy} votingStrategyError={votingStrategyError} setVotingStrategyError={setVotingStrategyError} />
            </SettingsBlockElement>

            <SettingsBlockElement ref={PromptBlockRef}>
                <PromptBuilder promptBuilderData={promptBuilderData} setPromptBuilderData={setPromptBuilderData} promptEditorCore={promptEditorCore} />
            </SettingsBlockElement>
            {/*
            <SettingsBlockElement>
                <Twitter />
            </SettingsBlockElement>
            */}
            <SettingsBlockElement>
                <SimpleInputs simpleInputData={simpleInputData} setSimpleInputData={setSimpleInputData} />
            </SettingsBlockElement>

            <SaveSettings
                setCurrentDate={setCurrentDate}
                date_1={date_1}
                date_2={date_2}
                snapshotDate={snapshotDate}
                promptEditorCore={promptEditorCore}
                votingStrategy={votingStrategy}
                setVotingStrategyError={setVotingStrategyError}
                submitterAppliedRules={submitterAppliedRules}
                voterAppliedRules={voterAppliedRules}
                setSubmitterRuleError={setSubmitterRuleError}
                setVoterRuleError={setVoterRuleError}
                simpleInputData={simpleInputData}
                promptBuilderData={promptBuilderData}
                setPromptBuilderData={setPromptBuilderData}
                TimeBlockRef={TimeBlockRef}
                RewardsRef={RewardsRef}
                PromptBlockRef={PromptBlockRef}
                RestrictionsBlockRef={RestrictionsBlockRef}
                StrategyBlockRef={StrategyBlockRef}
            />

        </ContestSettingsWrap >
    )
}



function SaveSettings(props) {
    const rewardOptions = useSelector(rewardOptionState.getRewardOptions)
    const submitterRewards = useSelector(submitterRewardState.getSubmitterRewards)
    const voterRewards = useSelector(voterRewardState.getVoterRewards)
    const [showSummary, setShowSummary] = useState(false);
    const [contestData, setContestData] = useState(null);
    const [promptData, setPromptData] = useState(null);
    const [warnings, setWarnings] = useState([])

    const {
        handleSubmitterErrors,
        handleTimeBlockErrors,
        handleVoterErrors,
        handlePromptErrors,
        handleRestrictionErrors,
        handleVotingStrategyErrors,
    } = useErrorHandler();
    const { ens } = useParams();

    const {
        setCurrentDate,
        date_1,
        date_2,
        snapshotDate,
        promptEditorCore,
        votingStrategy,
        setVotingStrategyError,
        submitterAppliedRules,
        voterAppliedRules,
        setSubmitterRuleError,
        setVoterRuleError,
        simpleInputData,
        promptBuilderData,
        setPromptBuilderData,
        TimeBlockRef,
        RewardsRef,
        PromptBlockRef,
        RestrictionsBlockRef,
        StrategyBlockRef
    } = props

    const handleShowSummary = () => {
        setShowSummary(true);
        document.body.style.overflow = 'hidden';
    }

    const handleCloseSummary = () => {
        setShowSummary(false);
        document.body.style.overflow = 'unset';
    }

    const handleWarnings = () => {

        let prep_warnings = []
        if (Object.values(voterAppliedRules).length === 0 && votingStrategy.strategy_type === 'arcade') {
            prep_warnings.push('An arcade strategy with no voter restrictions means that anyone can vote. Maybe this isn\'t what you wanted')
        }
        console.log(prep_warnings)
        return setWarnings(prep_warnings)
    }



    const handleSave = async () => {

        const isTimeError = handleTimeBlockErrors([setCurrentDate, date_1, date_2, snapshotDate]);
        const isSubmitterError = handleSubmitterErrors();
        const isVoterError = handleVoterErrors();
        if (isTimeError) return TimeBlockRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
        if (isSubmitterError) return RewardsRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
        if (isVoterError) return RewardsRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })

        const isRestrictionError = handleRestrictionErrors(submitterAppliedRules, setSubmitterRuleError, voterAppliedRules, setVoterRuleError);
        if (isRestrictionError) return RestrictionsBlockRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })


        const isVotingStrategyError = handleVotingStrategyErrors(votingStrategy, setVotingStrategyError)
        if (isVotingStrategyError) return StrategyBlockRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })



        const promptEditorData = await promptEditorCore.current.save();
        const isPromptError = handlePromptErrors(promptEditorData, promptBuilderData, setPromptBuilderData);
        if (isPromptError) return PromptBlockRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })

        let strategy
        if (votingStrategy.strategy_type === 'arcade') {
            strategy = {
                strategy_type: votingStrategy.strategy_type,
                hard_cap: votingStrategy.data.credit_allowance,
                sub_cap: votingStrategy.data.additional_configs.max_per_sub_limit
            }
        }

        if (votingStrategy.strategy_type === 'token') {
            let { type, symbol, address, decimal } = votingStrategy.data.token_data
            strategy = {
                strategy_type: votingStrategy.strategy_type,
                type: type,
                symbol: symbol,
                address: address,
                decimal: decimal,
                hard_cap: votingStrategy.data.additional_configs.hardcap_limit,
                sub_cap: votingStrategy.data.additional_configs.max_per_sub_limit
            }
        }

        setContestData({
            date_times: {
                start_date: new Date().toISOString(),
                voting_begin: date_1.toISOString(),
                end_date: date_2.toISOString(),
                snapshot_block: snapshotDate.toISOString()
            },
            reward_options: rewardOptions,
            submitter_rewards: submitterRewards,
            voter_rewards: voterRewards,
            submitter_restrictions: submitterAppliedRules,
            voter_restrictions: voterAppliedRules,
            voting_strategy: strategy,
            anon_subs: simpleInputData.anonSubmissions,
            visible_votes: simpleInputData.visibleVotes,
            self_voting: simpleInputData.selfVoting
        })

        setPromptData({
            editorData: promptEditorData,
            title: promptBuilderData.prompt_heading,
            coverImage: promptBuilderData.prompt_cover_image ? promptBuilderData.prompt_cover_image.url : null,
            promptLabel: promptBuilderData.prompt_label,
            promptLabelColor: promptBuilderData.prompt_label_color
        })

        handleWarnings();
        handleShowSummary();
    }

    return (
        <>
            <SaveButton style={{ color: 'black' }} onClick={handleSave}>save</SaveButton>
            <DrawerComponent drawerOpen={showSummary} handleClose={handleCloseSummary} showExit={true}>
                <Summary contestData={contestData} promptData={promptData} warnings={warnings} />
            </DrawerComponent>
        </>
    )
}


const SummaryWrap = styled.div`
    display: flex;
    flex-direction: column;
    padding: 10px;
    gap: 20px;
    div {
        background-color: #141416;
        border-radius: 10px;
    }
    padding-bottom: 100px;
`
const ContestDatesWrap = styled.div`
    display: flex;
    flex-direction: column;
    padding: 10px;
    > div {
        display: flex;
        flex-direction: row;
        gap: 10px;
    }
`

const RewardRow = styled.div`
    display: flex;
    border: 1px dotted grey;
    border-radius: 4px;

    > * {
        margin: 10px;
    }
    > p {
        //text-align: left;
    }

`

const RewardContainer = styled.div`
    margin-top: 20px;
    margin-bottom: 20px;
`

const DetailWrap = styled.div`
    padding: 10px;
    span{
        margin-left: 10px;
        padding: 3px 3px;
        border-radius: 4px;
        font-size: 15px;
        font-weight: 550;
    }
`

const VoterRow = styled.div`
    display: flex;
    flex-direction: column;
    border-radius: 4px;

    > * {
        margin: 10px;
    }
    > p {
        //text-align: left;
    }

`

function Summary({ contestData, promptData, warnings }) {
    const { ens } = useParams();
    const { authenticated_post } = useCommon();
    const readableStart = new Date(contestData.date_times.start_date);
    const readableVote = new Date(contestData.date_times.voting_begin);
    const readableEnd = new Date(contestData.date_times.end_date);
    const readableSnapshot = new Date(contestData.date_times.snapshot_block);


    const handleConfirm = () => {
        authenticated_post('/creator_contests/create_contest', { ens: ens, contest_settings: contestData, prompt_data: promptData })
    }


    return (
        <SummaryWrap>
            <p style={{ color: 'grey' }}>Please review the contest configuration</p>
            <h3>Summary</h3>
            <ContestDatesWrap>
                <h4>Dates</h4>
                <div><p>Start:</p><p>{readableStart.toLocaleDateString() + ' ' + readableStart.toLocaleTimeString()}</p></div>
                <div><p>Vote:</p><p>{readableVote.toLocaleDateString() + ' ' + readableVote.toLocaleTimeString()}</p></div>
                <div><p>End:</p><p>{readableEnd.toLocaleDateString() + ' ' + readableEnd.toLocaleTimeString()}</p></div>
                <div><p>Snapshot:</p><p>{readableSnapshot.toLocaleDateString() + ' ' + readableSnapshot.toLocaleTimeString()}</p></div>
            </ContestDatesWrap>
            <DetailWrap>
                <h4>Submitter Rewards</h4>
                {Object.values(contestData.submitter_rewards).length === 0 && <p><b>There are no submitter rewards defined for this contest.</b></p>}
                {Object.values(contestData.submitter_rewards).length > 0 &&
                    <RewardContainer>
                        {Object.values(contestData.submitter_rewards).map((reward, idx) => {
                            return (
                                <RewardRow key={idx}>
                                    <p><b>rank {reward.rank}:</b></p>
                                    {reward.eth ? <p>{reward.eth.amount} ETH</p> : null}
                                    {reward.erc20 ? <p style={{ marginLeft: '30px' }}>{reward.erc20.amount} {reward.erc20.symbol}</p> : null}
                                    {reward.erc721 ? <p style={{ marginLeft: '30px' }}>1 {reward.erc721.symbol} (token id {reward.erc721.token_id}) </p> : null}

                                </RewardRow>
                            )
                        })}
                    </RewardContainer>
                }
            </DetailWrap>
            <DetailWrap>
                <h4>Voter Rewards</h4>
                {Object.values(contestData.voter_rewards).length === 0 && <p><b>There are no voter rewards defined for this contest.</b></p>}
                {Object.values(contestData.voter_rewards).length > 0 &&
                    <RewardContainer>
                        {Object.values(contestData.voter_rewards).map((reward, idx) => {
                            return (
                                <RewardRow key={idx}>
                                    {reward.eth ? <p>Voters that accurately choose the rank {reward.rank} submission will <b>split </b>{reward.eth.amount} ETH</p> : null}
                                    {reward.erc20 ? <p>Voters that accurately choose the rank {reward.rank} submission will <b>split </b>{reward.erc20.amount} {reward.erc20.symbol}</p> : null}
                                </RewardRow>
                            )
                        })}
                    </RewardContainer>
                }
            </DetailWrap>
            <DetailWrap>
                <h4>Submitter Restrictions</h4>
                {Object.values(contestData.submitter_restrictions).length === 0 && <p><b>There are no submitter restrictions defined for this contest.</b></p>}
                {Object.values(contestData.submitter_restrictions).length > 0 &&
                    <RewardContainer>
                        {Object.values(contestData.submitter_restrictions).map((restriction, idx) => {
                            return (
                                <RewardRow key={idx}>
                                    <p>Type: <TagType type={restriction.type}>{restriction.type}</TagType></p>
                                    <p>Symbol: {restriction.symbol}</p>
                                    <p>Threshold: {restriction.threshold}</p>
                                </RewardRow>
                            )
                        })}
                    </RewardContainer>
                }
            </DetailWrap>
            <DetailWrap>
                <h4>Voter Restrictions</h4>
                {Object.values(contestData.voter_restrictions).length === 0 && <p><b>There are no voter restrictions defined for this contest.</b></p>}
                {Object.values(contestData.voter_restrictions).length > 0 &&
                    <RewardContainer>
                        {Object.values(contestData.voter_restrictions).map((restriction, idx) => {
                            return (
                                <RewardRow key={idx}>
                                    <p>Type: <TagType type={restriction.type}>{restriction.type}</TagType></p>
                                    <p>Symbol: {restriction.symbol}</p>
                                    <p>Threshold: {restriction.threshold}</p>
                                </RewardRow>
                            )
                        })}
                    </RewardContainer>
                }
            </DetailWrap>
            <DetailWrap>
                <h4>Voting Policy</h4>
                {contestData.voting_strategy.strategy_type == 'token' ?
                    <TokenComponent voting_strategy={contestData.voting_strategy} />
                    :
                    <ArcadeComponent voting_strategy={contestData.voting_strategy} />
                }
            </DetailWrap>
            <DetailWrap>
                <h4>Additional Configs</h4>
                <li>Votes <b>{contestData.visible_votes ? 'are' : 'not'}</b> visible during voting</li>
                <li>Submitters will be <b>{contestData.anon_subs ? 'anonymous' : 'visible'}</b> throughout the contest</li>
                <li>Voters can <b>{contestData.self_voting ? '' : 'not'}</b> vote on themselves</li>

            </DetailWrap>

            {warnings.map(warning => {
                return <div className="tab-message warning" style={{width: '100%'}}><p>{warning}</p></div>
            })}

            <SaveButton style={{ width: '100%', color: 'black' }} onClick={handleConfirm}>Confirm</SaveButton>

        </SummaryWrap>
    )
}


function TokenComponent({ voting_strategy }) {


    return (
        <VoterRow>
            <p><b>{voting_strategy.strategy_type} strategy</b></p>
            <li>Type: <b>{voting_strategy.symbol}</b> <TagType type={voting_strategy.type}>{voting_strategy.type}</TagType></li>
            <li>1 <b>{voting_strategy.symbol}</b> equals 1 <b>voting credit</b></li>
            {voting_strategy.hard_cap > 0 &&
                <li>Contest hard cap: <b>{voting_strategy.hard_cap}</b></li>
            }
            {voting_strategy.sub_cap > 0 &&
                <li>Submission hard cap: <b>{voting_strategy.sub_cap}</b></li>
            }

        </VoterRow>

    )



}

function ArcadeComponent({ voting_strategy }) {


    return (
        <VoterRow>
            <p><b>{voting_strategy.strategy_type} strategy</b></p>
            <li>Total Votes: <b>{voting_strategy.hard_cap}</b></li>
            {voting_strategy.sub_cap > 0 &&
                <li>Submission hard cap: <b>{voting_strategy.sub_cap}</b></li>
            }
        </VoterRow>
    )


}
