import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import { selectDashboardRules } from '../../../../gatekeeper/gatekeeper-rules-reducer'
import EditRestrictionModal from '../../../../add-token/add-token-modal'
import { Contest_h3_alt } from '../../common/common_styles'
import {
    availableRestrictionsActions,
    submitterRestrictionsActions,
    submitterRestrictionsState,
    voterRestrictionsActions,
    voterRestrictionsState
} from './reducers/restrictions-reducer'
import ToggleOption from './toggle-option'
import { ERC1155Button, ERC20Button, ERC721Button } from '../../../../../css/token-button-styles'


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


const NewRestrictionContainer = styled.div`
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
            dispatch(availableRestrictionsActions.addNewAvailableRule(payload.data))
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

                <NewRestrictionContainer>
                    <ERC20Button onClick={() => handleEditRestriction('erc20')}><FontAwesomeIcon icon={faPlus} /> ERC-20</ERC20Button>
                    <ERC721Button onClick={() => handleEditRestriction('erc721')}><FontAwesomeIcon icon={faPlus} /> ERC-721</ERC721Button>
                    <ERC1155Button onClick={() => handleEditRestriction('erc1155')}><FontAwesomeIcon icon={faPlus} /> ERC-1155</ERC1155Button>
                </NewRestrictionContainer>

                <Contest_h3_alt style={{ marginTop: '50px' }}>Voter Restrictions</Contest_h3_alt>
                <RestrictionOptionWrap>
                    <ToggleOption restriction_errors={voter_restriction_errors} availableRestrictions={voter_restrictions} updateAvailableRestrictions={voterRestrictionsActions.setVoterRestrictions} toggle_identifier={"voter-restrictions"} />
                </RestrictionOptionWrap>

                <NewRestrictionContainer>
                    <ERC20Button onClick={() => handleEditRestriction('erc20')}><FontAwesomeIcon icon={faPlus} /> ERC-20</ERC20Button>
                    <ERC721Button onClick={() => handleEditRestriction('erc721')}><FontAwesomeIcon icon={faPlus} /> ERC-721</ERC721Button>
                    <ERC1155Button onClick={() => handleEditRestriction('erc1155')}><FontAwesomeIcon icon={faPlus} /> ERC-1155</ERC1155Button>
                </NewRestrictionContainer>

            </RestrictionsContent>
            <EditRestrictionModal modalOpen={editRestrictionModalOpen} handleClose={handleRestrictionModalClose} existingRewardData={null} tokenType={newTokenType} title={'Add Restriction'} checkDuplicates={true} />
        </RestrictionsWrap>
    )
}
