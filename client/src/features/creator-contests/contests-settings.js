import React, { useEffect, useReducer, useRef, useState } from "react"
import ContestDateTimeBlock from "./components/datepicker/start-end-date"
import ContestRewardsBlock from "./components/contest-rewards/contest-rewards"
import ContestParticipantRestrictions from "./components/contest_gatekeeper/particpant_restrictions";
import PromptBuilder from "./components/prompt_builder/prompt_builder";
import { RainbowThemeContainer } from 'react-rainbow-components';
import SimpleInputs from "./components/contest_simple_inputs/contest_simple_inputs";
import styled from 'styled-components'

const theme = {
    rainbow: {
        palette: {
            brand: '#80deea',
            mainBackground: '#303030',
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

        },
    },
};



const ContestSettingsWrap = styled.div`
    width: 95vw;
    margin: 0 auto;
    padding: 10px;
    display: flex;
    flex-direction: column;
    
    > *  {
        margin-bottom: 100px;
        border-radius: 20px;
    }
`

const containerStyles = {
    maxWidth: 300,
    width: '5rem',
};

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

const defaultPossibleRewards = {
    'ETH': {
        type: 'ETH',
        symbol: 'ETH',
        img: 'eth'
    },
    /*
    'erc721': {
        type: 'erc721',
        symbol: 'NOUN',
        address: '0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03'
    },
    'erc20': {
        type: 'erc20',
        symbol: 'SHARK',
        address: '0x232AFcE9f1b3AAE7cb408e482E847250843DB931',
        0xdac17f958d2ee523a2206206994597c13d831ec7
        decimal: '18'
    }
    */
}



export default function ContestSettings() {

    const [date_0, setDate_0] = useState(new Date())
    const [date_1, setDate_1] = useState(false)
    const [date_2, setDate_2] = useState(false)

    const [rewardOptions, setRewardOptions] = useReducer(reducer, defaultPossibleRewards);
    const [selectedRewards, setSelectedRewards] = useReducer(reducer, {});
    const [submitterRewards, setSubmitterRewards] = useReducer(reducer, {});
    const [errorMatrix, setErrorMatrix] = useState([[null, null, null, null]]);
    const [voterRewards, setVoterRewards] = useReducer(reducer, [])

    const [submitterAppliedRules, setSubmitterAppliedRules] = useReducer(reducer, {});
    const [voterAppliedRules, setVoterAppliedRules] = useReducer(reducer, {});
    const [submitterRuleError, setSubmitterRuleError] = useState(false);
    const [voterRuleError, setVoterRuleError] = useState(false);


    /*

        participant restriction error handling
    
        const handleNext = () => {
            // check if selected gatekeepers have a threshold value set
            for (const [key, value] of Object.entries(appliedRules)) {
              if (value == '') {
                setRuleError({ id: key })
                return;
              }
            }
            setProgress(3)
        
          }
    
          */


    // don't run time difference checks on initial render
    const firstUpdate = useRef(true)


    useEffect(() => {
        if (firstUpdate.current) {

            firstUpdate.current = false;
            return;
        }
    }, [date_0])


    const printContestData = () => {
        let contest_obj = {
            contest_data: {
                date_times: {
                    start_date: date_0,
                    voting_begin: date_1,
                    end_date: date_2
                },
                reward_options: rewardOptions,
                submitter_rewards: submitterRewards,
                voter_rewards: voterRewards,
                submitter_restrictions: submitterAppliedRules,
                voter_restrictions: voterAppliedRules
            }
        }
        console.log(contest_obj)
    }

    return (
        <RainbowThemeContainer
            className="rainbow-align-content_center rainbow-m-vertical_large rainbow-p-horizontal_small rainbow-m_auto"
            style={containerStyles}
            theme={theme}

        >
            <ContestSettingsWrap theme={theme}>
                <ContestDateTimeBlock
                    date_0={date_0}
                    date_1={date_1}
                    date_2={date_2}
                    setDate_0={setDate_0}
                    setDate_1={setDate_1}
                    setDate_2={setDate_2}
                />

                <ContestRewardsBlock
                    rewardOptions={rewardOptions}
                    setRewardOptions={setRewardOptions}
                    selectedRewards={selectedRewards}
                    setSelectedRewards={setSelectedRewards}
                    submitterRewards={submitterRewards}
                    setSubmitterRewards={setSubmitterRewards}
                    voterRewards={voterRewards}
                    setVoterRewards={setVoterRewards}
                    errorMatrix={errorMatrix}
                    setErrorMatrix={setErrorMatrix}
                    theme={theme.rainbow}
                />

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

                <SimpleInputs />
                <PromptBuilder />
                <button onClick={printContestData}> print contest data</button>
            </ContestSettingsWrap >
        </RainbowThemeContainer>
    )
}