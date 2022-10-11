import React from 'react';
import { render, waitFor } from '@testing-library/react';
import useWallet from '../features/hooks/useWallet2';
import { WalletProvider } from '../app/WalletContext';
import store from '../app/store';
import { Provider } from 'react-redux';
import crypto from 'crypto'
import { expect } from 'chai';
import { act } from 'react-dom/test-utils';


Object.defineProperty(global.self, 'crypto', {
    value: {
        getRandomValues: arr => crypto.randomBytes(arr.length)
    }
});

function setup(...args) {
    const returnVal = {}
    function TestComponent() {
        Object.assign(returnVal, useWallet())
        return null
    }
    render(
        <WalletProvider>
            <TestComponent />
        </WalletProvider>
    )

    return returnVal
}


describe('new wallet valid address test', () => {
    const myComp = setup();
    it('successfully resolve address to checksum', async () => {
        act(() => {
            myComp.validAddress('0xedcC867bc8B5FEBd0459af17a6f134F41f422f0C').then(result => {
                expect(result).eqls('0xedcC867bc8B5FEBd0459af17a6f134F41f422f0C')
            })
        })
    })

    it('successfully resolve ens to checksum', async () => {
        act(() => {
            myComp.validAddress('nickdodson.eth').then(result => {
                expect(result).eqls('0xedcC867bc8B5FEBd0459af17a6f134F41f422f0C')
            })
        })
    })

    it('bad address', async () => {
        act(() => {
            myComp.validAddress('0xedcC867bc8B5FEBd0459af17a6f134F41f422f0').then(result => {
                expect(result).eqls(false)
            })
        })
    })

    it('non existing ens', async () => {
        act(() => {
            myComp.validAddress('calabara1234592834765927834659827364.eth').then(result => {
                expect(result).eqls(false)
            })
        })
    })
})


