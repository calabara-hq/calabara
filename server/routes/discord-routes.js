const express = require('express');
const axios = require('axios')
const fetch = require('node-fetch')
const db = require('../helpers/db-init.js')
const dotenv = require('dotenv')
const discordApp = express();
discordApp.use(express.json())

const { getServerRoles, getGuildUserRoles } = require('../discord-bot/discord-bot.js')
require('../discord-bot/deploy-commands.js')
const { authenticateToken } = require('../middlewares/jwt-middleware')
const { isAdmin } = require('../middlewares/admin-middleware')


dotenv.config();

const CLIENT_ID = process.env.DISCORD_CLIENT_ID
const CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET
const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN


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

  return
}



const addDiscordBot = async (ens, oauthData, wallet) => {
  // get the user discord id and set it in user field of db for this users address.
  await addDiscordUser(oauthData, wallet)
  await db.query('insert into discord_guilds (ens, guild_id) values ($1, $2) on CONFLICT (ens) DO update set guild_id = $2', [ens, oauthData.guild.id]);
  return
}


discordApp.post('/botOauthFlow', async function (req, res, next) {
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


  await addDiscordBot(ens, oauthData, wallet)


  res.send(oauthData)
  res.status(200)
})

discordApp.post('/userOauthFlow', async function (req, res, next) {
  const { code, redirect_uri, wallet } = req.body;
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

  // send the access code and retrieve a user id
  // await addDiscordUser(oauthData, wallet)


  res.send(oauthData)
  res.status(200)
})




const getGuildRoles = async (guild_id) => {
  try {
    var response = await axios.get(`https://discord.com/api/v6/guilds/${guild_id}/roles`, {
      headers: {
        authorization: `Bot ${BOT_TOKEN}`,
        "Content-Type": "application/json",
      },
    })
    return response.data
  } catch (err) {
    return 'unable to read roles'
  }
}


discordApp.post('/getUserRoles', async function (req, res, next) {
  const { user_id, guild_id } = req.body;
  try {
    let resp = await getGuildUserRoles(guild_id, user_id)
    res.send(resp)
    res.status(200)
  } catch (e) {
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
        authorization: `Bot ${BOT_TOKEN}`,
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