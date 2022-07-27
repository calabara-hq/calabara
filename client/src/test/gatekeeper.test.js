import axios from 'axios'
import { act, render } from '@testing-library/react'
import store from '../app/store'
import { Provider } from 'react-redux';
import useContract from '../features/hooks/useContract';
import useGatekeeper from '../features/hooks/useGatekeeper';
import { expect } from 'chai';


function setup(...args) {
    const returnVal = {}
    function TestComponent() {
        Object.assign(returnVal, useGatekeeper())
        return null
    }
    render(
        <Provider store={store}>
            <TestComponent />
        </Provider>
    )

    return returnVal
}


// some helpers for useContract hook interactions
 let dashboardRules = {
    "55": {
        "guildId": "892877917762244680",
        "serverName": "Calabara",
        "gatekeeperType": "discord",
        "available_roles": [
            {
                "role_id": "892877917762244680",
                "role_name": "@everyone",
                "role_color": 0
            },
            {
                "role_id": "893184621523660850",
                "role_name": "core-team",
                "role_color": 15105570
            },
            {
                "role_id": "895903844926623785",
                "role_name": "bot",
                "role_color": 6323595
            },
            {
                "role_id": "896082699402510377",
                "role_name": "member",
                "role_color": 15277667
            },
            {
                "role_id": "896088160684089447",
                "role_name": "MEE6",
                "role_color": 0
            },
            {
                "role_id": "899761111476359269",
                "role_name": "szn1",
                "role_color": 1752220
            },
            {
                "role_id": "907775296659390496",
                "role_name": "OG calabarator",
                "role_color": 15844367
            },
            {
                "role_id": "908035108861251605",
                "role_name": "sesh",
                "role_color": 0
            },
            {
                "role_id": "919991694030671893",
                "role_name": "carl-bot",
                "role_color": 0
            },
            {
                "role_id": "919994529912881192",
                "role_name": "onboardee",
                "role_color": 10181046
            },
            {
                "role_id": "956696519384391703",
                "role_name": "calabara",
                "role_color": 11342935
            },
            {
                "role_id": "974402409533149217",
                "role_name": "Member",
                "role_color": 0
            }
        ]
    },
    "64": {
        "gatekeeperType": "erc20",
        "gatekeeperSymbol": "SHARK",
        "gatekeeperAddress": "0x232AFcE9f1b3AAE7cb408e482E847250843DB931",
        "gatekeeperDecimal": "18"
    },
    "72": {
        "gatekeeperType": "erc721",
        "gatekeeperSymbol": "NOUN",
        "gatekeeperAddress": "0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03"
    },
    "73": {
        "gatekeeperType": "erc721",
        "gatekeeperSymbol": "MFER",
        "gatekeeperAddress": "0x79FCDEF22feeD20eDDacbB2587640e45491b757f"
    }
}

let ruleTestResults = {
    "64": "",
    "72": "",
}

let discordId = '804073245946806303'
let walletAddress = '0xedcC867bc8B5FEBd0459af17a6f134F41f422f0C'

describe('old gatekeeper queries', () => {
    const myComp = setup();
    it('check nicks wallet for a non-zero $SHARK balance', async () => {
        let res = await myComp.queryGatekeeper(walletAddress, dashboardRules, {"64": ""})
        expect(res).eqls({"64": 10})
    })
    it('check sharkdao wallet for a non-zero NOUNS balance', async () => {
        let res = await myComp.queryGatekeeper('0xAe7f458667f1B30746354aBC3157907d9F6FD15E', dashboardRules, {"64": "", "72": ""})
        expect(res).eqls({"64": 0, "72": 6})
    })
})

describe('new gatekeeper queries', () => {
    const myComp = setup();
    it('check nicks wallet for a non-zero $SHARK balance', async () => {
        let res = await myComp.queryGatekeeper2(walletAddress, dashboardRules, {"64": ""})
        expect(res).eqls({"64": 10})
    })
    it('check sharkdao wallet for a non-zero NOUNS balance', async () => {
        let res = await myComp.queryGatekeeper2('0xAe7f458667f1B30746354aBC3157907d9F6FD15E', dashboardRules, {"64": "", "72": ""})
        expect(res).eqls({"64": 0, "72": 6})
    })
})