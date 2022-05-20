import axios from 'axios'
import { act, render } from '@testing-library/react'
import store from '../app/store'
import { Provider, useDispatch, useSelector } from 'react-redux';
import useDashboard from '../features/hooks/useDashboard';
import { selectInstalledWidgets } from '../features/dashboard/dashboard-widgets-reducer';
import { expect } from 'chai';
import { populateInfo } from '../features/dashboard/dashboard-info-reducer';


function setup(...args) {
    const returnVal = {}
    function TestComponent() {
        const dispatch = useDispatch();
        const installedWidgets = useSelector(selectInstalledWidgets);
        Object.assign(returnVal, useDispatch())
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
      //  act(() => { myComp.updateDashboardInfo({ens: 'test.eth'}) })
       // expect(myComp.info.ens).to.eql('test.eth')
       // act(() => { myComp.dispatch(populateInfo({ens: 'test2.eth'})) })
       // expect(myComp.info.ens).to.eql('test2.eth')
    })

})