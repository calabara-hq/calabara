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



// error handling
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
    const [votingStrategy, setVotingStrategy] = useReducer(reducer, { strategy_id: 0x0 });
    const [submitterAppliedRules, setSubmitterAppliedRules] = useReducer(reducer, {});
    const [voterAppliedRules, setVoterAppliedRules] = useReducer(reducer, {});
    const [submitterRuleError, setSubmitterRuleError] = useState(false);
    const [voterRuleError, setVoterRuleError] = useState(false);
    const { ens } = useParams();
    const { populateDashboardRules } = useDashboardRules();


    const [promptBuilderData, setPromptBuilderData] = useReducer(reducer, initialPromptData)
    const [simpleInputData, setSimpleInputData] = useReducer(reducer, { anonSubmissions: true, visibleVotes: false, selfVoting: false })



    const TimeBlockRef = useRef(null);
    const RewardsRef = useRef(null);
    const RestrictionsBlockRef = useRef(null)
    const StrategyBlockRef = useRef(null)
    const PromptBlockRef = useRef(null)
    const promptEditorCore = useRef(null);





    useEffect(() => {
        populateDashboardRules(ens)
    }, [])



    return (
        <ContestSettingsWrap>

            <SettingsBlockElement ref={TimeBlockRef}>
                <ContestDateTimeBlock
                    currentDate={currentDate}
                    date_1={date_1}
                    date_2={date_2}
                    setCurrentDate={setCurrentDate}
                    setDate_1={setDate_1}
                    setDate_2={setDate_2}
                />
            </SettingsBlockElement>

            <SettingsBlockElement ref={RewardsRef}>
                <ContestRewardsBlock
                    theme={theme.rainbow}
                />
            </SettingsBlockElement>

            <SettingsBlockElement>
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

            <SettingsBlockElement>
                <VotingPolicy votingStrategy={votingStrategy} setVotingStrategy={setVotingStrategy} />
            </SettingsBlockElement>

            <SettingsBlockElement>
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

            <SettingsBlockElement>
                <SaveSettings
                    setCurrentDate={setCurrentDate}
                    date_1={date_1}
                    date_2={date_2}
                    promptEditorCore={promptEditorCore}
                    votingStrategy={votingStrategy}
                    submitterAppliedRules={submitterAppliedRules}
                    voterAppliedRules={voterAppliedRules}
                    simpleInputData={simpleInputData}
                    promptBuilderData={promptBuilderData}
                    TimeBlockRef={TimeBlockRef}
                    RewardsRef={RewardsRef}
                />
            </SettingsBlockElement>

        </ContestSettingsWrap >
    )
}



function SaveSettings(props) {
    const rewardOptions = useSelector(rewardOptionState.getRewardOptions)
    const submitterRewards = useSelector(submitterRewardState.getSubmitterRewards)
    const voterRewards = useSelector(voterRewardState.getVoterRewards)
    const { authenticated_post } = useCommon();
    const { handleErrors } = useErrorHandler();
    const { ens } = useParams();

    const {
        setCurrentDate,
        date_1,
        date_2,
        promptEditorCore,
        votingStrategy,
        submitterAppliedRules,
        voterAppliedRules,
        simpleInputData,
        promptBuilderData,
        TimeBlockRef,
        RewardsRef
    } = props


    const handleSave = async () => {

        let [isSubmitterError, isVoterError, isTimeError] = handleErrors([setCurrentDate, date_1, date_2]);
        if (isTimeError) return TimeBlockRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
        if (isSubmitterError) return RewardsRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
        if (isVoterError) return RewardsRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })


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

        const promptEditorData = await promptEditorCore.current.save();

        let contest_data = {
            date_times: {
                start_date: new Date().toISOString(),
                voting_begin: date_1.toISOString(),
                end_date: date_2.toISOString()
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
        }

        let prompt_data = {
            editorData: promptEditorData,
            title: promptBuilderData.prompt_heading,
            coverImage: promptBuilderData.prompt_cover_image ? promptBuilderData.prompt_cover_image.url : null,
            promptLabel: promptBuilderData.prompt_label,
            promptLabelColor: promptBuilderData.prompt_label_color
        }

        console.log(contest_data.submitter_rewards)



        if (window.confirm('are you sure you want to continue?')) {
            authenticated_post('/creator_contests/create_contest', { ens: ens, contest_settings: contest_data, prompt_data: prompt_data })
        }

    }

    return (
        <button style={{ color: 'black' }} onClick={handleSave}>save</button>
    )
}