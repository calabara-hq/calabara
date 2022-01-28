import {useState} from 'react';
import { useSelector } from 'react-redux';
import {checkERC20Balance, checkERC721Balance, getAddress} from '../wallet/wallet'


// rules stores the rule definitions
// rule test results stores the rule_id's which we need to execute tests against
// we will store the result of balanceOf function in ruleResults and return it

export default async function queryGatekeeper(walletAddress, rules, ruleResults){

    for (const [key, value] of Object.entries(ruleResults)){

        if(rules[key].gatekeeperType === 'erc20'){
            const balance = await checkERC20Balance(walletAddress, rules[key].gatekeeperAddress, rules[key].gatekeeperDecimal)
            ruleResults[key] = parseFloat(balance)

        }
        else if(rules[key].gatekeeperType === 'erc721'){
            const balance = await checkERC721Balance(walletAddress, rules[key].gatekeeperAddress)
            ruleResults[key] = parseFloat(balance)
        }
    }

    return ruleResults
}
