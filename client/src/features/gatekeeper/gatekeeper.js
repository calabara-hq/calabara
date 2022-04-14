import axios from 'axios';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { checkERC20Balance, checkERC721Balance } from '../wallet/wallet'


// rules stores the rule definitions
// ruleResults stores the rule_id's which we need to execute tests against
// we will store the result of balanceOf function in ruleResults and return it

export async function queryGatekeeper(walletAddress, rules, ruleResults, discordId) {


    for (const [key, value] of Object.entries(ruleResults)) {

        if (rules[key].gatekeeperType === 'erc20') {
            const balance = await checkERC20Balance(walletAddress, rules[key].gatekeeperAddress, rules[key].gatekeeperDecimal)
            ruleResults[key] = parseFloat(balance)


        }
        else if (rules[key].gatekeeperType === 'erc721') {
            const balance = await checkERC721Balance(walletAddress, rules[key].gatekeeperAddress)
            ruleResults[key] = parseFloat(balance)
        }
        else if (rules[key].gatekeeperType === 'discord') {

            if (discordId) {
                // fetch the roles that this user has for the server and assing them to the results key
                const resp = await axios.post('/discord/getUserRoles', { user_id: discordId, guild_id: rules[key].guildId })
                if (resp.data === 'error') {
                    ruleResults[key] = 'fail'
                }

                else {
                    // set the response and push @eveyone role (guildId) to the array
                    resp.data.push(rules[key].guildId)
                    ruleResults[key] = resp.data
                }
            }
            else {
                ruleResults[key] = 'fail';
            }

        }
    }

    return ruleResults
}

// take in the applied roles and user roles and guildId
// if there is a match, set result to = pass
// otherwise set result to fail
export function testDiscordRoles(enforced_roles, user_roles) {



    // if user_roles !empty and there aren't errors with the guild
    if (user_roles && user_roles !== 'fail') {

        const intersection = enforced_roles.filter(element => user_roles.includes(element));
        if (intersection.length > 0) return 'pass'

        return 'fail'

    }
    return 'fail'
}

