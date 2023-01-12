import axios from 'axios';
import useContract from './useContract';



export default function useGatekeeper() {

    // const {walletAddress, rules, ruleResults, discordId, enforced_roles, user_roles} = props

    const { checkWalletTokenBalance } = useContract()

    // rules stores the rule definitions
    // ruleResults stores the rule_id's which we need to execute tests against
    // we will store the result of balanceOf function in ruleResults and return it



    async function queryGatekeeper(walletAddress, rules, ruleResults, discordId) {
        for (const [key, value] of Object.entries(ruleResults)) {
            if (rules[key].type === 'erc20' || rules[key].type === 'erc721' || rules[key].type === 'erc1155') {
                const balance = await checkWalletTokenBalance(walletAddress, rules[key].address, rules[key].decimal, rules[key].token_id)
                ruleResults[key] = parseFloat(balance)
            }
            else if (rules[key].type === 'discord') {
                if (discordId) {
                    // fetch the roles that this user has for the server and assign them to the results key
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

    function testDiscordRoles(enforced_roles, user_roles) {



        // if user_roles !empty and there aren't errors with the guild
        if (user_roles && user_roles !== 'fail') {

            const intersection = enforced_roles.filter(element => user_roles.includes(element));
            if (intersection.length > 0) return 'pass'

            return 'fail'

        }
        return 'fail'
    }


    return {
        queryGatekeeper: async (walletAddress, rules, ruleResults, discordId) => {
            return await queryGatekeeper(walletAddress, rules, ruleResults, discordId)
        },

        testDiscordRoles: async (enforced_roles, user_roles) => {
            return testDiscordRoles(enforced_roles, user_roles)
        }
    }
}
