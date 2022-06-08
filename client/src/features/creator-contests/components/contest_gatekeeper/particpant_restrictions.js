import React, {useState, useReducer} from 'react'
import styled from 'styled-components'
import { Contest_h2, Contest_h3 } from '../common/common_styles'
import { RuleSelect } from '../../../manage-widgets/gatekeeper-toggle';

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


const RestrictionsWrap = styled.div`
    display: flex;
    flex-direction: column;
    grid-template-columns: repeat(2, 25%);
    grid-gap: 30px;
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

export default function ContestParticipantRestrictions({ }) {
    const [ruleError, setRuleError] = useState(false);
    const [submitterAppliedRules, setSubmitterAppliedRules] = useReducer(reducer, {});
    const [voterAppliedRules, setVoterAppliedRules] = useReducer(reducer, {});


    return (
        <RestrictionsWrap>
            <RestrictionsMainHeading>
                <Contest_h2 grid_area={"participant_restrictions"}>Participant Restrictions</Contest_h2>
            </RestrictionsMainHeading>

            <RestrictionOptionWrap>
                <Contest_h3>Submitter Restrictions</Contest_h3>
                <Restriction ruleError={ruleError} setRuleError={setRuleError} appliedRules={submitterAppliedRules} setAppliedRules={setSubmitterAppliedRules} toggle_identifier={"submitter-restrictions"}/>
            </RestrictionOptionWrap>
            <RestrictionOptionWrap>
                <Contest_h3>Voter Restrictions</Contest_h3>
                <Restriction ruleError={ruleError} setRuleError={setRuleError} appliedRules={voterAppliedRules} setAppliedRules={setVoterAppliedRules} toggle_identifier={"voter-restrictions"}/>
            </RestrictionOptionWrap>
        </RestrictionsWrap>
    )
}


function Restriction({ruleError, setRuleError, appliedRules, setAppliedRules, toggle_identifier}){
    return(
       <RuleSelect ruleError={ruleError} setRuleError={setRuleError} appliedRules={appliedRules} setAppliedRules={setAppliedRules} toggle_identifier={toggle_identifier} />
    )
}

