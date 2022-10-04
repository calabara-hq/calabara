import React, { useState, useReducer, useEffect } from 'react'
import styled from 'styled-components'
import { Contest_h2, Contest_h2_alt, Contest_h3, Contest_h3_alt, ERC20Button_alt, ERC721Button_alt } from '../../common/common_styles'
import ToggleOption from './toggle-option'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useDispatch, useSelector } from 'react-redux'
import { selectDashboardRules } from '../../../../gatekeeper/gatekeeper-rules-reducer'
import EditRestrictionModal from '../../common/add-token-modal'
import {
    availableRestrictionsActions,
    submitterRestrictionsActions,
    submitterRestrictionsState,
    voterRestrictionsActions,
    voterRestrictionsState
} from './reducers/restrictions-reducer'


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





export default function ContestParticipantRestrictions() {
    const dashboardRules = useSelector(selectDashboardRules)
    const submitter_restrictions = useSelector(submitterRestrictionsState.getSubmitterRestrictions)
    const voter_restrictions = useSelector(voterRestrictionsState.getVoterRestrictions)
    const submitter_restriction_errors = useSelector(submitterRestrictionsState.getSubmitterRestrictionErrors)
    const voter_restriction_errors = useSelector(voterRestrictionsState.getVoterRestrictionErrors)
    const dispatch = useDispatch();
    const [editRestrictionModalOpen, setEditRestrictionModalOpen] = useState(false)
    const [newTokenType, setNewTokenType] = useState(null)



    useEffect(() => {
        dispatch(availableRestrictionsActions.initializeAvailableRules(dashboardRules))
    }, [dashboardRules])


    const handleEditRestriction = (tokenType) => {
        setNewTokenType(tokenType)
        setEditRestrictionModalOpen(true)

    }

    const handleRestrictionModalClose = (payload) => {
        if (payload.type === 'save') {
            const obj = { type: payload.data.type, symbol: payload.data.symbol, address: payload.data.address, decimal: payload.data.decimal }
            dispatch(availableRestrictionsActions.addNewAvailableRule(obj))
        }
        setEditRestrictionModalOpen(false)
    }




    return (
        <RestrictionsWrap title="Participant Restrictions">
            <RestrictionsContent>
                <Contest_h3_alt>Submitter Restrictions</Contest_h3_alt>
                <RestrictionOptionWrap>
                    <ToggleOption restriction_errors={submitter_restriction_errors} availableRestrictions={submitter_restrictions} updateAvailableRestrictions={submitterRestrictionsActions.setSubmitterRestrictions} toggle_identifier={"submitter-restrictions"} />
                </RestrictionOptionWrap>

                <NewRewardContainer>
                    <ERC20Button_alt onClick={() => handleEditRestriction('erc20')}><FontAwesomeIcon icon={faPlus} /> ERC-20</ERC20Button_alt>
                    <ERC721Button_alt onClick={() => handleEditRestriction('erc721')}><FontAwesomeIcon icon={faPlus} /> ERC-721</ERC721Button_alt>
                </NewRewardContainer>

                <Contest_h3_alt style={{ marginTop: '50px' }}>Voter Restrictions</Contest_h3_alt>
                <RestrictionOptionWrap>
                    <ToggleOption restriction_errors={voter_restriction_errors} availableRestrictions={voter_restrictions} updateAvailableRestrictions={voterRestrictionsActions.setVoterRestrictions} toggle_identifier={"voter-restrictions"} />
                </RestrictionOptionWrap>

                <NewRewardContainer>
                    <ERC20Button_alt onClick={() => handleEditRestriction('erc20')}><FontAwesomeIcon icon={faPlus} /> ERC-20</ERC20Button_alt>
                    <ERC721Button_alt onClick={() => handleEditRestriction('erc721')}><FontAwesomeIcon icon={faPlus} /> ERC-721</ERC721Button_alt>
                </NewRewardContainer>

            </RestrictionsContent>
            <EditRestrictionModal modalOpen={editRestrictionModalOpen} handleClose={handleRestrictionModalClose} existingRewardData={null} tokenType={newTokenType} title={'Add Restriction'} />
        </RestrictionsWrap>
    )
}
