import React, { useState, useReducer } from 'react'
import styled from 'styled-components'
import { Contest_h2, Contest_h3 } from '../../common/common_styles'
import ToggleOption from '../../common/toggle_option/toggle-option'
const RestrictionsWrap = styled.div`
    display: flex;
    flex-direction: column;

    > * {
        margin-bottom: 30px;
    }
`

const RestrictionsContent = styled.div`
    width: 90%;
    margin: 0 auto;
`


const RestrictionOptionWrap = styled.div`
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    padding-bottom: 30px;

    > * {
        flex: 1 0 33%;
        justify-content: space-evenly;
    }
`

export default function ContestParticipantRestrictions(props) {
    return (
        <RestrictionsWrap>
            <Contest_h2 grid_area={"participant_restrictions"}>Participant Restrictions</Contest_h2>
            <RestrictionsContent>
                <Contest_h3>Submitter Restrictions</Contest_h3>

                <RestrictionOptionWrap>
                    <Restriction ruleError={props.submitterRuleError} setRuleError={props.setSubmitterRuleError} appliedRules={props.submitterAppliedRules} setAppliedRules={props.setSubmitterAppliedRules} toggle_identifier={"submitter-restrictions"} />
                </RestrictionOptionWrap>
                <Contest_h3>Voter Restrictions</Contest_h3>
                <RestrictionOptionWrap>
                    <Restriction ruleError={props.voterRuleError} setRuleError={props.setVoterRuleError} appliedRules={props.voterAppliedRules} setAppliedRules={props.setVoterAppliedRules} toggle_identifier={"voter-restrictions"} />
                </RestrictionOptionWrap>
            </RestrictionsContent>
        </RestrictionsWrap>
    )
}


function Restriction({ ruleError, setRuleError, appliedRules, setAppliedRules, toggle_identifier }) {
    return (
        <ToggleOption ruleError={ruleError} setRuleError={setRuleError} appliedRules={appliedRules} setAppliedRules={setAppliedRules} toggle_identifier={toggle_identifier} />
    )
}

