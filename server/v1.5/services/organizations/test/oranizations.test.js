const { expect } = require('chai');
const { cleanup, getRequest, postRequest, sessionRequest, postWithSession } = require('./setup.test')

let userAddress = '0xe9ad38d6E38E0A9970D6ebEc84C73DEA3e025da1'

describe('• organization tests', async (done) => {
    it('• get organizations', async () => {
        let res = await getRequest('/hub/organizations/organizations')
        expect(res.status).to.eql(200)
    })

    it('• get subscriptions', async () => {
        let res = await getRequest(`/hub/organizations/getSubscriptions/?address=${userAddress}`)
        expect(res.status).to.eql(200)
    })

    it('• ENS check', async () => {
        let res_1 = await getRequest(`/hub/organizations/doesEnsExist/?ens=calabara.eth`)
        expect(res_1.body).to.eql(true)
        let res_2 = await getRequest(`/hub/organizations/doesEnsExist/?ens=nevergonnaexist.eth`)
        expect(res_2.body).to.eql(false)
    })

    it('• Name check', async () => {
        let res_1 = await getRequest(`/hub/organizations/doesNameExist/?ens=sharkdao.eth&name=calabara`)
        expect(res_1.body).to.eql(true)
        let res_2 = await getRequest(`/hub/organizations/doesNameExist/?ens=sharkdao.eth&name=nevergonnaexist`)
        expect(res_2.body).to.eql(false)
    })

    it('• Add Subscription', async () => {
        let res_1 = await postWithSession(`/hub/organizations/addSubscription`, { ens: 'calabara.eth' })
        expect(res_1.status).to.eql(200)
    })

    it('• Remove Subscription', async () => {
        let res_1 = await postWithSession(`/hub/organizations/removeSubscription`, { ens: 'calabara.eth' })
        expect(res_1.status).to.eql(200)
    })

    done();
})
