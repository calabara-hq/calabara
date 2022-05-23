import { expect } from 'chai'
import reducer, { populateInfo, increaseMemberCount, decreaseMemberCount, dashboardInfoReset } from '../../features/dashboard/dashboard-info-reducer'


const initialState = {
    info: {
        name: "",
        ens: "",
        logo: "",
        members: "",
        website: "",
        discord: "",
        verified: "",
        addresses: [],
    }
}


const initialState2 = {
    info: {
        name: "test",
        ens: "test.eth",
        logo: null,
        members: 40,
        website: "https://calabara.com",
        discord: null,
        verified: false,
        addresses: ['calabara.eth']
    }
}

describe('dashboard info reducer', () => {
    it('verify initial emptiness', async () => {
        expect(reducer(undefined, {})).eqls(initialState)
    })

    it('should handle populate info', () => {
        expect(reducer(initialState, populateInfo({
            name: "test",
            ens: "test.eth",
            logo: null,
            members: 40,
            website: "https://calabara.com",
            discord: null,
            verified: false,
            addresses: ['calabara.eth'],
        }))).eqls(initialState2)
    })

    it('should increase member count', () => {
        expect(reducer(initialState2, increaseMemberCount())).eqls({
            info: {
                name: "test",
                ens: "test.eth",
                logo: null,
                members: 41,
                website: "https://calabara.com",
                discord: null,
                verified: false,
                addresses: ['calabara.eth']
            }
        })
    })

    it('should decrease member count', () => {
        expect(reducer({
            info: {
                name: "test",
                ens: "test.eth",
                logo: null,
                members: 41,
                website: "https://calabara.com",
                discord: null,
                verified: false,
                addresses: ['calabara.eth']
            }
        }, decreaseMemberCount())).eqls(initialState2)
    })

    it('should reset to initial state', () => {
        expect(reducer({
            info: {
                name: "test",
                ens: "test.eth",
                logo: null,
                members: 41,
                website: "https://calabara.com",
                discord: null,
                verified: false,
                addresses: ['calabara.eth']
            }
        }, dashboardInfoReset())).eqls(initialState)
    })


})