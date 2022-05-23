const dotenv = require('dotenv'); //initialize dotenv
const { Client, Intents } = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS] }); //create new client

dotenv.config();


client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;
  const { commandName } = interaction;
  if (commandName === 'ping') {
    await interaction.reply('Pong');
  }
  if (commandName === 'vibe-police') {
    const prob = Math.floor(Math.random() * 100);
    if(prob % 2 == 0){
      await interaction.reply('you passed the vibe check, well done son');
    }
    else{
      await interaction.reply('you have the right to remain silent, any negative vibe you create can be used against you');
    }
  }
});



// fetch all roles for a guild by guildId
async function getServerRoles(guildId) {

  const res = await client.guilds.fetch();
  console.log(res)
  const guild = await client.guilds.fetch(res.first().id)
  const roles = await guild.roles.fetch();
  roles.forEach((val) => console.log(val.name, val.id))

}

async function getGuildUserRoles(guildId, userId){
  const guild = await client.guilds.fetch(guildId);
  const member = await guild.members.fetch(userId)
  return member._roles;
}




/*
const role = interaction.guild.roles.cache.find(role => role.name === "member") //the role to check
const totalAdmin = role.members.map(m => m.id) // array of user IDs who have the role
const totalMembers = totalAdmin.length // how many users have the role
*/

//make sure this line is the last line
client.login(process.env.DISCORD_BOT_TOKEN); //login bot using token

exports.getServerRoles = getServerRoles;
exports.getGuildUserRoles = getGuildUserRoles;
