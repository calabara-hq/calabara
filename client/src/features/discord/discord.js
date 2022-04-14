import React, { useEffect, useState } from 'react'
import axios from 'axios'
import '../../css/discord-add-bot.css'
import '../../css/status-messages.css'

/* Bot Helpers */

const fetchGuildFromInvite = async (inviteLink) => {
    let inviteCode = inviteLink.split('/')[3]
    let resp = await axios.post('/discord/fetchGuildFromInvite', { inviteCode: inviteCode });
    console.log(resp)
}


// https://discord.gg/kJFGKenU


/* User Helpers */


export default function Discord() {
    const [inviteLink, setInviteLink] = useState('')
    const [guildId, setGuildId] = useState('');
    const [popoutFired, setPopoutFired] = useState(false);
    const [popoutClosed, setPopoutClosed] = useState(false);
    const [isVerifyingBot, setIsVerifyingBot] = useState(false);
    const [isBotVerified, setIsBotVerified] = useState(false);
    const [botFailureMessage, setBotFailureMessage] = useState('')
    const ens = 'sample.eth'

    const updateLink = (e) => {
        setInviteLink(e.target.value)
    }



    const addBot = async () => {
        setPopoutFired(true)
        setIsVerifyingBot(false)
        //pass guildId as autofill
        let popout = window.open(`https://discord.com/api/oauth2/authorize?client_id=895719351406190662&permissions=0&redirect_uri=https%3A%2F%2Flocalhost%3A3000%2Foauth%2Fdiscord&response_type=token&scope=identify%20bot%20applications.commands&state=${ens}`, 'popUpWindow', 'height=700,width=600,left=100,top=100,resizable=yes,scrollbars=yes,toolbar=yes,menubar=no,location=no,directories=no,status=yes')


        var pollTimer = window.setInterval(async function () {
            if (popout.closed !== false) {
                window.clearInterval(pollTimer);
                setPopoutClosed(true);
                setPopoutFired(false);
                setIsVerifyingBot(true)
                await verifyBot();
            }
        }, 2000);

    }

    // if there was a problem adding, let the user know and reset the whole process
    // otherwise, set a success message

    const verifyBot = async () => {
        const resp = await axios.post('/discord/getGuildRoles', { ens: ens })
        setIsVerifyingBot(false)
        console.log(resp.data)
        switch (resp.data) {
            case 'not added':
                setIsBotVerified(false);
                setBotFailureMessage('bot was not added')
                return;
            case 'unable to read roles':
                setIsBotVerified(false);
                setBotFailureMessage('not able to read roles from server');
                return;
            default:
                console.log('here')
                setIsBotVerified(true)
        }

    }



    // https://discord.gg/kAvqq8cg



    return (
        <div className="discord-add-bot">
            <input placeholder="invite link" value={inviteLink} onChange={updateLink} type="text" />
            {!isVerifyingBot && <button disabled={!inviteLink} className={'add-bot ' + (popoutFired ? 'loading' : '')} onClick={() => { addBot(guildId) }}>{popoutFired ? 'check popup window' : 'add bot'}</button>}

            {isBotVerified &&
                <div className="tab-message success">
                    <p>bot successfully added!</p>
                </div>
            }
            {!isBotVerified &&
                <div className="tab-message error">
                    <p>{botFailureMessage}</p>
                </div>
            }
        </div>
    )



}