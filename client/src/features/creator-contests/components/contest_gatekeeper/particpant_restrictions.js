import React, {useState, useReducer} from 'react'
import styled from 'styled-components'
import { Contest_h2, Contest_h3 } from '../common/common_styles'
import { RuleSelect } from '../../../manage-widgets/gatekeeper-toggle';

const RestrictionsWrap = styled.div`
    display: flex;
    flex-direction: column;
    background-color: #22272e;
    border: 2px solid #444c56;
    border-radius: 4px;
    padding: 10px;
    width: 70%;
    margin: 0 auto;

    > * {
        margin-bottom: 30px;
    }
`

const RestrictionsMainHeading = styled.div`
    display: grid;
    grid-template-columns: repeat(3, 33%);
    grid-template-areas: "participant_restrictions . .";
`
const RestrictionOptionWrap = styled.div`
    display: grid;
    grid-template-rows: 2;
    width: 90%;
    margin: 0 auto;
    padding-bottom: 30px;
`

export default function ContestParticipantRestrictions(props) {
    return (
        <RestrictionsWrap>
            <RestrictionsMainHeading>
                <Contest_h2 grid_area={"participant_restrictions"}>Participant Restrictions</Contest_h2>
            </RestrictionsMainHeading>

            <RestrictionOptionWrap>
                <Contest_h3>Submitter Restrictions</Contest_h3>
                <Restriction ruleError={props.submitterRuleError} setRuleError={props.setSubmitterRuleError} appliedRules={props.submitterAppliedRules} setAppliedRules={props.setSubmitterAppliedRules} toggle_identifier={"submitter-restrictions"}/>
            </RestrictionOptionWrap>
            <RestrictionOptionWrap>
                <Contest_h3>Voter Restrictions</Contest_h3>
                <Restriction ruleError={props.voterRuleError} setRuleError={props.setVoterRuleError} appliedRules={props.voterAppliedRules} setAppliedRules={props.setVoterAppliedRules} toggle_identifier={"voter-restrictions"}/>
            </RestrictionOptionWrap>
        </RestrictionsWrap>
    )
}


function Restriction({ruleError, setRuleError, appliedRules, setAppliedRules, toggle_identifier}){
    return(
       <RuleSelect ruleError={ruleError} setRuleError={setRuleError} appliedRules={appliedRules} setAppliedRules={setAppliedRules} toggle_identifier={toggle_identifier} />
    )
}

