import React, { useState, useReducer, useEffect } from 'react'
import styled from 'styled-components'
import { Contest_h2, Contest_h2_alt, Contest_h3, Contest_h3_alt, ERC20Button_alt, ERC721Button_alt } from '../../common/common_styles'
import ToggleOption from '../../common/toggle_option/toggle-option'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import useDashboardRules from '../../../../hooks/useDashboardRules'
import { useDispatch, useSelector } from 'react-redux'
import { selectDashboardRules } from '../../../../gatekeeper/gatekeeper-rules-reducer'
import { useParams } from 'react-router-dom'
import EditRestrictionModal from '../contest_rewards/contest-reward-input-modal'
import { setDashboardRules } from '../../../../gatekeeper/gatekeeper-rules-reducer'

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


const NewRewardContainer = styled.div`
    margin-top: 2em;
    margin-left: 10px;
    display: flex;
    > * {
        flex: 0 1 15%;
    }
`





export default function ContestParticipantRestrictions(props) {
    const { populateDashboardRules } = useDashboardRules()
    const dashboardRules = useSelector(selectDashboardRules)
    const dispatch = useDispatch();
    const { ens } = useParams()
    const [editRewardsModalOpen, setEditRewardsModalOpen] = useState(false)
    const [newTokenType, setNewTokenType] = useState(null)


    useEffect(() => {
        populateDashboardRules(ens);
    }, [])

    const handleEditRestriction = (tokenType) => {
        setNewTokenType(tokenType)
        setEditRewardsModalOpen(true)

    }

    // really need to change gk rules to be an array
    const gen_non_colliding_key = () => {
        let num = Math.floor(Math.random() * 100)
        if (typeof dashboardRules[num] !== 'undefined') return gen_non_colliding_key();
        return num
    }


    const handleRestrictionModalClose = (payload) => {
        if (payload.type === 'save') {
            let copy = JSON.parse(JSON.stringify(dashboardRules))
            const key = gen_non_colliding_key();
            copy[key] = { type: payload.data.type, symbol: payload.data.symbol, address: payload.data.address, decimal: payload.data.decimal }
            console.log(copy)
            dispatch(setDashboardRules(copy))
        }
        setEditRewardsModalOpen(false)
    }




    return (
        <RestrictionsWrap title="Participant Restrictions">
            <RestrictionsContent>
                <Contest_h3_alt>Submitter Restrictions</Contest_h3_alt>
                <RestrictionOptionWrap>
                    <Restriction ruleError={props.submitterRuleError} setRuleError={props.setSubmitterRuleError} appliedRules={props.submitterAppliedRules} setAppliedRules={props.setSubmitterAppliedRules} toggle_identifier={"submitter-restrictions"} />
                </RestrictionOptionWrap>

                <NewRewardContainer>
                    <ERC20Button_alt onClick={() => handleEditRestriction('erc20')}><FontAwesomeIcon icon={faPlus} /> ERC-20</ERC20Button_alt>
                    <ERC721Button_alt onClick={() => handleEditRestriction('erc721')}><FontAwesomeIcon icon={faPlus} /> ERC-721</ERC721Button_alt>
                </NewRewardContainer>

                <Contest_h3_alt style={{ marginTop: '50px' }}>Voter Restrictions</Contest_h3_alt>
                <RestrictionOptionWrap>
                    <Restriction ruleError={props.voterRuleError} setRuleError={props.setVoterRuleError} appliedRules={props.voterAppliedRules} setAppliedRules={props.setVoterAppliedRules} toggle_identifier={"voter-restrictions"} />
                </RestrictionOptionWrap>

                <NewRewardContainer>
                    <ERC20Button_alt onClick={() => handleEditRestriction('erc20')}><FontAwesomeIcon icon={faPlus} /> ERC-20</ERC20Button_alt>
                    <ERC721Button_alt onClick={() => handleEditRestriction('erc721')}><FontAwesomeIcon icon={faPlus} /> ERC-721</ERC721Button_alt>
                </NewRewardContainer>

            </RestrictionsContent>
            <EditRestrictionModal modalOpen={editRewardsModalOpen} handleClose={handleRestrictionModalClose} existingRewardData={null} tokenType={newTokenType} />
        </RestrictionsWrap>
    )
}


function Restriction({ ruleError, setRuleError, appliedRules, setAppliedRules, toggle_identifier }) {
    return (
        <ToggleOption ruleError={ruleError} setRuleError={setRuleError} appliedRules={appliedRules} setAppliedRules={setAppliedRules} toggle_identifier={toggle_identifier} />
    )
}

