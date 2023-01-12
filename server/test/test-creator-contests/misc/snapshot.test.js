const { checkWalletTokenBalance, calculateBlock } = require('../../../web3/web3')
const { expect } = require('chai');



describe('eth snapshot balance checks', async (done) => {

    it('eth snapshot timestamp 0', async () => {
        let walletAddress = '0xedcC867bc8B5FEBd0459af17a6f134F41f422f0C'
        let timestamp = '2022-09-28T12:30:00.000Z'
        let usdc_address = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'
        let usdc_decimal = 6
        let block = await calculateBlock(timestamp)
        let balance = await checkWalletTokenBalance(walletAddress, usdc_address, usdc_decimal, block)
        expect(balance).to.eq(0)
    })

    it('eth snapshot timestamp 1 ', async () => {
        let walletAddress = '0xedcC867bc8B5FEBd0459af17a6f134F41f422f0C'
        let timestamp = '2022-09-29T12:30:00.000Z'
        let usdc_address = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'
        let usdc_decimal = 6
        let block = await calculateBlock(timestamp)
        let balance = await checkWalletTokenBalance(walletAddress, usdc_address, usdc_decimal, block)
        expect(balance).to.eq(67.274366)
    })

    it('erc1155 balance check ', async () => {
        let walletAddress = '0xe9ad38d6E38E0A9970D6ebEc84C73DEA3e025da1'
        let timestamp = new Date().toISOString()
        let contract = '0xB48176c8779559f01eff37834fa563be997aE5e6'
        let decimal = 0
        let block = await calculateBlock(timestamp)
        let balance = await checkWalletTokenBalance(walletAddress, contract, decimal, block, '139')
        expect(balance).to.eq(1)
    })

    done();
})