import axios from 'axios';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectOrganizations, selectMemberOf, populateMembership, populateOrganizations, join } from '../org-cards/org-cards-reducer';
import { decreaseMemberCount, increaseMemberCount } from '../dashboard/dashboard-info-reducer';
import useCommon from './useCommon';

export default function useOrganization() {
    const organizations = useSelector(selectOrganizations);
    const { authenticated_post } = useCommon()
    const memberOf = useSelector(selectMemberOf);
    const dispatch = useDispatch();

    const isMember = (ens) => {
        console.log(organizations)
        var result = Boolean(memberOf.find(el => { return el === ens }))
        return result
    }

    const deleteMembership = async (walletAddress, ens) => {
        let res = await authenticated_post('/organizations/removeSubscription/', { address: walletAddress, ens: ens });
        if (res) {
            var newData = JSON.parse(JSON.stringify(memberOf))
            const toDelete = (el) => el == ens;
            const toDeleteIndex = newData.findIndex(toDelete)
            newData.splice(toDeleteIndex, 1)
            dispatch(populateMembership(newData))
            dispatch(decreaseMemberCount)
        }

    }

    const deleteOrganization = (ens) => {
        var cardsCopy = JSON.parse(JSON.stringify(organizations));

        for (var i in cardsCopy) {
            if (cardsCopy[i].ens == ens) {
                cardsCopy.splice(i, 1)
                break;
            }
        }
        dispatch(populateOrganizations(cardsCopy))
    }

    const populateInitialMembership = async (walletAddress) => {

        var subs = await axios.get('/organizations/getSubscriptions/' + walletAddress);
        dispatch(populateMembership(subs.data))
    }

    const addMembership = async (walletAddress, ens) => {

        let res = await authenticated_post('/organizations/addSubscription/', { address: walletAddress, ens: ens });
        if (res) {
            dispatch(join(ens))
            dispatch(increaseMemberCount)

        }

    }

    const fetchUserMembership = async (walletAddress, membershipPulled) => {
        if (!membershipPulled && walletAddress) {
            populateInitialMembership(walletAddress);
        }
    }

    return {
        isMember: (ens) => {
            return isMember(ens);
        },
        deleteMembership: (walletAddress, ens) => {
            deleteMembership(walletAddress, ens);
        },
        deleteOrganization: (ens) => {
            deleteOrganization(ens);
        },
        populateInitialMembership: (walletAddress) => {
            populateInitialMembership(walletAddress);
        },
        addMembership: (walletAddress, ens) => {
            addMembership(walletAddress, ens)
        },
        fetchUserMembership: (walletAddress, membershipPulled) => {
            fetchUserMembership(walletAddress, membershipPulled)
        }
    }
}