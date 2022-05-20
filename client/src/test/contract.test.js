import axios from 'axios'
import { act, render } from '@testing-library/react'
import store from '../app/store'
import { Provider } from 'react-redux';
import useContract from '../features/hooks/useContract';
import { expect } from 'chai';


function setup(...args) {
    const returnVal = {}
    function TestComponent() {
        Object.assign(returnVal, useContract())
        return null
    }
    render(
        <Provider store={store}>
            <TestComponent />
        </Provider>
    )

    return returnVal
}


describe('contract interactions', () => {
    const myComp = setup();
    it('erc20 fetch symbol and decimal #1', async () => {
        let res = await myComp.erc20GetSymbolAndDecimal('0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48')
        expect(res).to.eql(['USDC', '6'])
    })

    it('erc20 fetch symbol and decimal #2', async () => {
        let res = await myComp.erc20GetSymbolAndDecimal('0x514910771af9ca656af840dff83e8264ecf986ca')
        expect(res).to.eql(['LINK', '18'])
    })

    it('erc721 fetch symbol', async () => {
        let res = await myComp.erc721GetSymbol('0x79FCDEF22feeD20eDDacbB2587640e45491b757f')
        expect(res).to.eql('MFER')
    })

    it('ERC20 balanceOf', async () => {
        let res = await myComp.checkERC20Balance('0xedcc867bc8b5febd0459af17a6f134f41f422f0c', '0x9F6F91078A5072A8B54695DAfA2374Ab3cCd603b', 18)
        expect(res).equals(100)
    })

    it('ERC721 balanceOf', async () => {
        let res = await myComp.checkERC721Balance('0xedcc867bc8b5febd0459af17a6f134f41f422f0c', '0x79FCDEF22feeD20eDDacbB2587640e45491b757f')
        // bc i will always have at LEAST 1 mfer
        expect(res).greaterThan(0)
    })
})