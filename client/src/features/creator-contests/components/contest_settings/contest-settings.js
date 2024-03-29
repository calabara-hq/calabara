import React, { useEffect, useReducer, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import styled from 'styled-components';
import '../../../../css/gatekeeper-toggle.css';
import '../../../../css/manage-widgets.css';
import useDashboardRules from "../../../hooks/useDashboardRules";
import { fade_in } from "../common/common_styles";
import ContestParticipantRestrictions from "./contest_gatekeeper/particpant-restrictions";
import ContestRewardsBlock from "./contest_rewards/contest-rewards-block";
import { rewardOptionState, submitterRewardState, voterRewardState } from "./contest_rewards/reducers/rewards-reducer";
import SimpleInputs from "./contest_simple_inputs/contest_simple_inputs";
import ContestDateTimeBlock from "./datepicker/start-end-date";
import PromptBuilder from "./prompt_builder/prompt-builder";
import VotingPolicy from "./voting_policy/voting-policy";



// error handling
import { selectIsConnected } from "../../../../app/sessionReducer";
import { useWalletContext } from "../../../../app/WalletContext";
import DrawerComponent from "../../../drawer/drawer";
import TwitterThreadReducer, { twitter_initial_state } from "../../../reducers/twitter-thread-reducer";
import Placeholder from "../common/spinner";
import ContestSummaryComponent from "../contest-details/detail-components";
import { SummaryWrap } from "../contest-details/detail-style";
import { submitterRestrictionsState, voterRestrictionsState } from "./contest_gatekeeper/reducers/restrictions-reducer";
import useErrorHandler from "./handle-errors";
import Twitter from "./twitter_automation/twitter";



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
    border: 2px solid rgb(3, 176, 159);
    background-color: rgb(3, 176, 159); 
    color: black;
    padding: 10px 15px;
    border-radius: 10px;
    font-weight: bold;
    &:hover{
        background-color: rgba(3, 176, 159, 0.9);
    }
    &:active{
        transform: scale(1.01);
    }
    &:disabled{
        background-color: #262626;
        border-color: rgba(3, 176, 159, 0.2);
        color: grey;
        cursor: not-allowed;
        transform: none;
    }
    
`

const ConnectWalletButton = styled.button`
    border: 2px solid rgb(83,155,245);
    border-radius: 10px;
    width: 100%;
    padding: 10px 15px;
    background-color: rgb(83,155,245);
    color: black;
    font-weight: bold;


`

const SummaryButtons = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
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
    prompt_heading: '',
    prompt_heading_error: false,
    prompt_label: '',
    prompt_label_error: false,
    prompt_label_color: 0,
    prompt_content_error: false,
    prompt_cover_image: null
}


export default function ContestSettings() {
    const { populateDashboardRules } = useDashboardRules();
    const { ens } = useParams();
    const [currentDate, setCurrentDate] = useState(new Date())
    const [date_1, setDate_1] = useState(new Date())
    const [date_2, setDate_2] = useState(new Date())
    const [snapshotDate, setSnapshotDate] = useState(new Date())

    const [votingStrategy, setVotingStrategy] = useReducer(reducer, { strategy_id: 0 });
    const [votingStrategyError, setVotingStrategyError] = useState(false);
    const [promptBuilderData, setPromptBuilderData] = useReducer(reducer, initialPromptData)
    const [simpleInputData, setSimpleInputData] = useReducer(reducer, { anonSubmissions: true, visibleVotes: false, selfVoting: false })
    const [twitterData, setTwitterData] = useReducer(TwitterThreadReducer, twitter_initial_state)

    const TimeBlockRef = useRef(null)
    const RewardsRef = useRef(null)
    const RestrictionsBlockRef = useRef(null)
    const StrategyBlockRef = useRef(null)
    const PromptBlockRef = useRef(null)
    const promptEditorCore = useRef(null)
    const TwitterBlockRef = useRef(null)

    useEffect(() => {
        populateDashboardRules(ens)
    }, [])

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
                <ContestParticipantRestrictions />
            </SettingsBlockElement>

            <SettingsBlockElement ref={StrategyBlockRef}>
                <VotingPolicy votingStrategy={votingStrategy} setVotingStrategy={setVotingStrategy} votingStrategyError={votingStrategyError} setVotingStrategyError={setVotingStrategyError} />
            </SettingsBlockElement>

            <SettingsBlockElement ref={PromptBlockRef}>
                <PromptBuilder promptBuilderData={promptBuilderData} setPromptBuilderData={setPromptBuilderData} promptEditorCore={promptEditorCore} />
            </SettingsBlockElement>

            <SettingsBlockElement ref={TwitterBlockRef}>
                <Twitter twitterData={twitterData} setTwitterData={setTwitterData} />
            </SettingsBlockElement>

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
                simpleInputData={simpleInputData}
                promptBuilderData={promptBuilderData}
                setPromptBuilderData={setPromptBuilderData}
                twitterData={twitterData}
                setTwitterData={setTwitterData}
                TimeBlockRef={TimeBlockRef}
                RewardsRef={RewardsRef}
                PromptBlockRef={PromptBlockRef}
                RestrictionsBlockRef={RestrictionsBlockRef}
                StrategyBlockRef={StrategyBlockRef}
                TwitterBlockRef={TwitterBlockRef}
            />

        </ContestSettingsWrap >
    )
}



function SaveSettings(props) {
    const rewardOptions = useSelector(rewardOptionState.getRewardOptions)
    const submitterRewards = useSelector(submitterRewardState.getSubmitterRewards)
    const voterRewards = useSelector(voterRewardState.getVoterRewards)
    const submitterRestrictions = useSelector(submitterRestrictionsState.getSelectedSubmitterRestrictions)
    const voterRestrictions = useSelector(voterRestrictionsState.getSelectedVoterRestrictions)
    const [showSummary, setShowSummary] = useState(false);
    const [contestData, setContestData] = useState(null);
    const [promptData, setPromptData] = useState(null);

    const [warnings, setWarnings] = useState([]);
    const history = useHistory();



    const {
        handleSubmitterErrors,
        handleTimeBlockErrors,
        handleVoterErrors,
        handlePromptErrors,
        handleRestrictionErrors,
        handleVotingStrategyErrors,
        handleTwitterErrors
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
        simpleInputData,
        promptBuilderData,
        setPromptBuilderData,
        twitterData,
        setTwitterData,
        TimeBlockRef,
        RewardsRef,
        PromptBlockRef,
        RestrictionsBlockRef,
        StrategyBlockRef,
        TwitterBlockRef
    } = props

    const handleShowSummary = () => {
        setShowSummary(true);
        document.body.style.overflow = 'hidden';
    }

    const handleCloseSummary = (type) => {
        setShowSummary(false);
        document.body.style.overflow = 'unset';
        if (type === 'saved') {
            window.scrollTo(0, 0)
            history.push('creator_contests')
        }
    }

    const handleWarnings = () => {

        let prep_warnings = []
        if (Object.values(voterRestrictions).length === 0 && votingStrategy.strategy_type === 'arcade') {
            prep_warnings.push('An arcade strategy with no voter restrictions means that anyone can vote. Maybe this isn\'t what you wanted')
        }
        return setWarnings(prep_warnings)
    }





    const handleSave = async () => {

        const isTimeError = handleTimeBlockErrors([setCurrentDate, date_1, date_2, snapshotDate]);
        const isSubmitterError = handleSubmitterErrors();
        const isVoterError = handleVoterErrors();
        if (isTimeError) return TimeBlockRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
        if (isSubmitterError) return RewardsRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
        if (isVoterError) return RewardsRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })

        const isRestrictionError = handleRestrictionErrors();
        if (isRestrictionError) return RestrictionsBlockRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })


        const isVotingStrategyError = handleVotingStrategyErrors(votingStrategy, setVotingStrategyError)
        if (isVotingStrategyError) return StrategyBlockRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })



        const promptEditorData = await promptEditorCore.current.save();
        const isPromptError = handlePromptErrors(promptEditorData, promptBuilderData, setPromptBuilderData);
        if (isPromptError) return PromptBlockRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })


        const isTwitterError = await handleTwitterErrors(twitterData, setTwitterData)
        if (isTwitterError) return TwitterBlockRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })





        let strategy
        if (votingStrategy.strategy_type === 'arcade') {
            strategy = {
                strategy_type: votingStrategy.strategy_type,
                hard_cap: votingStrategy.data.credit_allowance,
                sub_cap: votingStrategy.data.additional_configs.max_per_sub_limit
            }
        }

        if (votingStrategy.strategy_type === 'token') {
            let { type, symbol, address, decimal, token_id } = votingStrategy.data.token_data
            strategy = {
                strategy_type: votingStrategy.strategy_type,
                type: type,
                symbol: symbol,
                address: address,
                decimal: decimal,
                ...token_id && { token_id: token_id },
                hard_cap: votingStrategy.data.additional_configs.hardcap_limit,
                sub_cap: votingStrategy.data.additional_configs.max_per_sub_limit
            }
        }

        setContestData({
            date_times: {
                start_date: new Date().toISOString(),
                voting_begin: date_1.toISOString(),
                end_date: date_2.toISOString(),
            },
            reward_options: rewardOptions,
            submitter_rewards: submitterRewards,
            voter_rewards: voterRewards,
            submitter_restrictions: submitterRestrictions,
            voter_restrictions: voterRestrictions,
            voting_strategy: strategy,
            anon_subs: simpleInputData.anonSubmissions,
            visible_votes: simpleInputData.visibleVotes,
            self_voting: simpleInputData.selfVoting,
            snapshot_timestamp: snapshotDate.toISOString(),

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
            <SaveButton disabled={showSummary} style={{ width: '60%', margin: '30px auto' }} onClick={handleSave}>save</SaveButton>
            <DrawerComponent drawerOpen={showSummary} handleClose={handleCloseSummary} showExit={true}>
                <Summary contestData={contestData} promptData={promptData} twitterData={twitterData} warnings={warnings} handleCloseDrawer={handleCloseSummary} />
            </DrawerComponent>
        </>
    )
}




function Summary({ contestData, promptData, twitterData, warnings, handleCloseDrawer }) {
    const { ens } = useParams();
    const { walletConnect, authenticated_post } = useWalletContext();
    const isWalletConnected = useSelector(selectIsConnected)
    const [isSaving, setIsSaving] = useState(false);

    const sendAnnouncementTweet = async () => {
        return await authenticated_post('/twitter/send_announcement_tweet', { ens: ens, tweet: twitterData.tweets })
            .then(result => result ? result.data : console.log(result))
    }

    const handleConfirm = async () => {
        setIsSaving(true)
        if (twitterData.enabled) {
            let announcement_id = await sendAnnouncementTweet();
            if (announcement_id) contestData.twitter_integration = { announcementID: announcement_id }
            else {
                handleCloseDrawer()
                return
            }
        }

        await authenticated_post('/creator_contests/create_contest', { ens: ens, contest_settings: contestData, prompt_data: promptData })
            .then(() => {
                setTimeout(() => {
                    handleCloseDrawer('saved')
                }, 500)
            })
            .catch(err => console.log(err))

    }

    if (isSaving) {
        return <Placeholder />
    }

    return (
        <SummaryWrap>
            <p style={{ color: 'grey' }}>Please review the contest configuration</p>

            <ContestSummaryComponent contest_settings={contestData} />
            {warnings.map(warning => {
                return <div className="tab-message warning" style={{ width: '100%' }}><p>{warning}</p></div>
            })}

            <SummaryButtons>
                {!isWalletConnected ? <ConnectWalletButton onClick={walletConnect}>Connect</ConnectWalletButton> : null}
                <SaveButton disabled={!isWalletConnected} style={{ width: '100%' }} onClick={handleConfirm}>Confirm + Initialize Contest</SaveButton>
            </SummaryButtons>
        </SummaryWrap>
    )
}

