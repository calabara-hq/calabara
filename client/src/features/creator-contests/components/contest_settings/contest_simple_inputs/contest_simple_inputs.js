import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { ToggleButton } from '../../common/common_components';
import { Contest_h2, Contest_h3, Contest_h3_alt, Contest_h3_alt_small, Contest_h4 } from '../../common/common_styles';

const AdditionalParamsWrap = styled.div`
    display: flex;
    flex-direction: column;
    &::before{
        content: '${props => props.title}';
        position: absolute;
        transform: translate(0%, -150%);
        color: #f2f2f2;
        font-size: 30px;
    }
    
    > * {
        margin-bottom: 30px;
    }
`

const AdditionalParamsMainHeading = styled.div`
    display: grid;
    grid-template-columns: repeat(3, 33%);
    grid-template-areas: "additional_params . .";
`

const ParamsWrap = styled.div`
    display: flex;
    flex-direction: column;
    width: 90%;
    margin: 20px auto;
    grid-gap: 20px;
`

const Parameter = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr;
    align-items: center;
`


export default function SimpleInputs({ simpleInputData, setSimpleInputData }) {

    const toggleVisibleVotes = () => {
        setSimpleInputData({ type: "update_single", payload: { visibleVotes: !simpleInputData.visibleVotes } })
    }

    const toggleAnonSubs = () => {
        setSimpleInputData({ type: "update_single", payload: { anonSubmissions: !simpleInputData.anonSubmissions } })
    }

    const toggleSelfVoting = () => {
        setSimpleInputData({ type: "update_single", payload: { selfVoting: !simpleInputData.selfVoting } })
    }


    return (
        <AdditionalParamsWrap title="Additional Parameters">
            <ParamsWrap>
                <Parameter>
                    <Contest_h3_alt>Visible Results</Contest_h3_alt>
                    <ToggleButton identifier={'visible-results-toggle'} isToggleOn={simpleInputData.visibleVotes} handleToggle={toggleVisibleVotes} />
                    <p style={{ color: '#a3a3a3' }}>Should contest results be visible during voting?</p>
                    <b></b>
                </Parameter>
                <Parameter>
                    <Contest_h3_alt>Anonymous Submissions</Contest_h3_alt>
                    <ToggleButton identifier={'anon-submissions-toggle'} isToggleOn={simpleInputData.anonSubmissions} handleToggle={toggleAnonSubs} />
                    <p style={{ color: '#a3a3a3' }}>Should submitters be anonymous during voting?</p>
                    <b></b>
                </Parameter>
                <Parameter>
                    <Contest_h3_alt>Self Voting</Contest_h3_alt>
                    <ToggleButton identifier={'self-voting-toggle'} isToggleOn={simpleInputData.selfVoting} handleToggle={toggleSelfVoting} />
                    <p style={{ color: '#a3a3a3' }}>Are participants able to vote on their own submissions?</p>
                    <b></b>
                </Parameter>
            </ParamsWrap>
        </AdditionalParamsWrap>


    )
}
