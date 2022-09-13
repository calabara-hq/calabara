import React, { useState, useReducer } from 'react'
import styled from 'styled-components'
import { Contest_h2, Contest_h2_alt, Contest_h3, Contest_h3_alt } from '../../common/common_styles'
import ToggleOption from '../../common/toggle_option/toggle-option'
const RestrictionsWrap = styled.div`
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

const RestrictionsContent = styled.div`
    width: 90%;
    margin: 0 auto;
    > * {
        margin: 20px 0;
    }
`


const RestrictionOptionWrap = styled.div`
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    padding-bottom: 20px;
    

    > * {
        flex: 1 0 33%;
        justify-content: space-evenly
        ;
    }
`

export default function ContestParticipantRestrictions(props) {
    return (
        <RestrictionsWrap title="Participant Restrictions">
            <RestrictionsContent>
                <Contest_h3_alt>Submitter Restrictions</Contest_h3_alt>

                <RestrictionOptionWrap>
                    <Restriction ruleError={props.submitterRuleError} setRuleError={props.setSubmitterRuleError} appliedRules={props.submitterAppliedRules} setAppliedRules={props.setSubmitterAppliedRules} toggle_identifier={"submitter-restrictions"} />
                </RestrictionOptionWrap>
                <Contest_h3_alt>Voter Restrictions</Contest_h3_alt>
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

