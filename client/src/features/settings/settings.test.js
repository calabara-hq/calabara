import React from "react";
import { configure, shallow, mount, render } from "enzyme";
import chai, { expect } from "chai";
import chaiEnzyme from "chai-enzyme";
import Adapter from "@wojtekmaj/enzyme-adapter-react-17";
import { OrgGateKeeperTab } from "./settings";
import store from '../../app/store';
import { Provider } from 'react-redux';
import { wrap } from "module";

configure({ adapter: new Adapter() })

const mockProps = {
    fields: {
        "name": "calabara2",
        "ens": "calabara.eth",
        "logo": "samplelogo",
        "members": 3,
        "website": "calabara.com",
        "discord": "",
        "verified": false,
        "addresses": [
            "0xedcC867bc8B5FEBd0459af17a6f134F41f422f0C"
        ],
        "gatekeeper": {
            "rules": [
                {
                    "gatekeeperType": "erc20",
                    "gatekeeperSymbol": "USDT",
                    "gatekeeperAddress": "0xdac17f958d2ee523a2206206994597c13d831ec7",
                    "gatekeeperDecimal": "6"
                }
            ],
            "rulesToDelete": []
        }

    },
    setTabHeader: (tab) => {return tab}
}

describe('settings gatekeeper tab test', () => {
    it('test remove gatekeeper', () => {

        const wrapper = mount(
            <Provider store={store}>
                <OrgGateKeeperTab store={store} {...mockProps}/>
            </Provider >
        );

        //const message = <p>Gatekeepers allow organizations to use token balance or discord role checks to offer different app functionality and displays for users via rules set for each app. </p>

        //expect(wrapper.find("p").to.have.text(message))
        console.log(wrapper.debug())
        //wrapper.instance().removeGatekeeperRule(0)
    });
    chai.use(chaiEnzyme());
})