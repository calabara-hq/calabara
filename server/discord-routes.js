const express = require('express');
const axios = require('axios')
const fetch = require('node-fetch')
const db = require('./db-init')

const discordApp = express();
discordApp.use(express.json())

const { getServerRoles, getGuildUserRoles } = require('./discord-bot/discord-bot.js')
require('./discord-bot/deploy-commands.js')


const API_ENDPOINT = 'https://discord.com/api/v8'
const CLIENT_ID = '895719351406190662'
const CLIENT_SECRET = 'kLgpila03Wur86mEJsgk-u3R_LYy4RSP'
const REDIRECT_URI = 'https://localhost:3000/explore'
const botToken = 'ODk1NzE5MzUxNDA2MTkwNjYy.YV8ppw.DOCyNSp5486W8q8TIgbvfqwDO28'


function clean(data) {
  if (data.rows.length == 0) { return null }
  else if (data.rows.length == 1) { return data.rows[0] }
  else { return data.rows }

}



const addDiscordUser = async (oauthData, wallet) => {

  // get the user discord id

  const userResult = await axios.get('https://discord.com/api/users/@me', {
    headers: {
      authorization: `${oauthData.token_type} ${oauthData.access_token}`
    }
  })

  // post the userid to the users table of database

  await db.query('update users set discord = $1 where address = $2', [userResult.data.id, wallet])
}



const addDiscordBot = async (ens, oauthData, wallet) => {
  // get the user discord id and set it in user field of db for this users address.
  const discord_id = await addDiscordUser(oauthData, wallet)
  await db.query('insert into discord_guilds (ens, guild_id) values ($1, $2) on CONFLICT (ens) DO update set guild_id = $2', [ens, oauthData.guild.id]);

}


discordApp.post('/oauthFlow', async function (req, res, next) {
  const { type, code, redirect_uri, wallet, ens } = req.body;
  const data = {
    'client_id': CLIENT_ID,
    'client_secret': CLIENT_SECRET,
    'grant_type': 'authorization_code',
    'code': code,
    'redirect_uri': redirect_uri
  }

  var response = await fetch('https://discord.com/api/oauth2/token', {
    method: 'POST',
    body: new URLSearchParams(data),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
  })

  const oauthData = await response.json();

  if (type === 'user') {
    // send the access code and retrieve a user id
    await addDiscordUser(oauthData, wallet)
  }

  else if (type === 'bot') {
    await addDiscordBot(ens, oauthData, wallet)
  }

  res.send('success')
  res.status(200)
})





const getGuildRoles = async (guild_id) => {
  try {
    var response = await axios.get(`https://discord.com/api/v6/guilds/${guild_id}/roles`, {
      headers: {
        authorization: `Bot ${botToken}`,
        "Content-Type": "application/json",
      },
    })
    return response.data
  } catch (err) {
    return 'unable to read roles'
  }
}


/*

discordApp.post('/getGuildRoles', async function (req, res, next) {
  const { ens } = req.body;


  // check whether user aborted popout window

  const guild = await db.query('select guild_id from discord_guilds where ens = $1', [ens]).then(clean)
  if (!guild) {
    res.send('not added');
    res.status(200)
  }

    // if not aborted, send the guild roles back


  else {

    const roles = await getGuildRoles(guild.guild_id);
    res.send(roles)
    res.status(200);
  }
});

*/


discordApp.post('/getUserRoles', async function (req, res, next) {
  const { user_id, guild_id } = req.body;
  try{
  let resp = await getGuildUserRoles(guild_id, user_id)
  res.send(resp)
  res.status(200)
  }catch(e){
    res.send('error')
    res.status(200)
  }
});


discordApp.post('/getUserDiscord', async function (req, res, next) {
const { walletAddress } = req.body;
const resp = await db.query('select discord from users where address = $1', [walletAddress]).then(clean)
res.send(JSON.stringify(resp.discord));
res.status(200);

});

// fetch guild name and roles for an ens
discordApp.post('/getGuildProperties', async function (req, res, next) {
  const { ens } = req.body;

  const guild = await db.query('select guild_id from discord_guilds where ens = $1', [ens]).then(clean)
  if (!guild) {
    res.send('guild does not exist');
    res.status(200)
    return
  }

  try {
    var response = await axios.get(`https://discord.com/api/v6/guilds/${guild.guild_id}`, {
      headers: {
        authorization: `Bot ${botToken}`,
        "Content-Type": "application/json",
      },
    })
    res.send(response.data)
    res.status(200)
  } catch (err) {
    res.send('unable to read roles')
    res.status(200)
  }

});


module.exports = {
  discordApp,
  getGuildRoles
}