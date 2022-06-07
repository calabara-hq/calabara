import React, { useEffect, useReducer, useRef, useState } from "react"
import ContestDateTimeBlock from "./components/datepicker/start-end-date"
import ContestRewardsBlock from "./components/contest-rewards/contest-rewards"
import { RainbowThemeContainer } from 'react-rainbow-components';
import SimpleInputs from "./components/contest_simple_inputs/contest_simple_inputs";


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



export default function ContestSettings() {

    const [date_0, setDate_0] = useState(new Date())
    const [date_1, setDate_1] = useState(false)
    const [date_2, setDate_2] = useState(false)
    const [date_3, setDate_3] = useState(false)

    const [rewardOptions, setRewardOptions] = useReducer(reducer, {});
    const [rewards, setRewards] = useReducer(reducer, {});
    const [errorMatrix, setErrorMatrix] = useState([[null, null, null, null]]);
    const [voterRewards, setVoterRewards] = useReducer(reducer, [])

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
                reward_options: rewardOptions,
                submitter_rewards: rewards,
                voter_rewards: voterRewards
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
            <ContestDateTimeBlock
                date_0={date_0}
                date_1={date_1}
                date_2={date_2}
                date_3={date_3}
                setDate_0={setDate_0}
                setDate_1={setDate_1}
                setDate_2={setDate_2}
                setDate_3={setDate_3}
            />

            <ContestRewardsBlock
                rewardOptions={rewardOptions}
                setRewardOptions={setRewardOptions}
                rewards={rewards}
                setRewards={setRewards}
                voterRewards={voterRewards}
                setVoterRewards={setVoterRewards}
                errorMatrix={errorMatrix}
                setErrorMatrix={setErrorMatrix}
                theme={theme.rainbow}
            />

            <SimpleInputs/>
            <button onClick={printContestData}> print contest data</button>
        </RainbowThemeContainer>
    )
}