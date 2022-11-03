import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { selectOrganizations, selectMemberOf, populateMembership, populateOrganizations, join } from '../org-cards/org-cards-reducer';
import { decreaseMemberCount, increaseMemberCount } from '../dashboard/dashboard-info-reducer';
import useCommon from './useCommon';
import { useWalletContext } from '../../app/WalletContext';

export default function useOrganization() {
    const organizations = useSelector(selectOrganizations);
    const { authenticated_post } = useWalletContext();
    const memberOf = useSelector(selectMemberOf);
    const dispatch = useDispatch();

    const isMember = (ens) => {
        var result = Boolean(memberOf.find(el => { return el === ens }))
        return result
    }

    const deleteMembership = async (ens) => {
        let res = await authenticated_post('/organizations/removeSubscription/', { ens: ens });
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

    const addMembership = async (ens) => {

        let res = await authenticated_post('/organizations/addSubscription/', { ens: ens });
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
        deleteMembership: (ens) => {
            deleteMembership(ens);
        },
        deleteOrganization: (ens) => {
            deleteOrganization(ens);
        },
        populateInitialMembership: (walletAddress) => {
            populateInitialMembership(walletAddress);
        },
        addMembership: (ens) => {
            addMembership(ens)
        },
        fetchUserMembership: (walletAddress, membershipPulled) => {
            fetchUserMembership(walletAddress, membershipPulled)
        }
    }
}