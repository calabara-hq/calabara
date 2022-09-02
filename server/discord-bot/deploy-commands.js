const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
require('dotenv').config(); //initialize dotenv

const { client } = require('./discord-bot')


const clientId = process.env.DISCORD_CLIENT_ID;
const token = process.env.DISCORD_BOT_TOKEN;


const commands = [
	new SlashCommandBuilder().setName('ping').setDescription('Replies with pong!'),
	new SlashCommandBuilder().setName('vibe-police').setDescription('checks your vibe'),
]
	.map(command => command.toJSON());

const rest = new REST({ version: '9' }).setToken(token);


const initialize_discord_bot = async () => {
	if (process.env.NODE_ENV != 'test') {
		return rest.put(Routes.applicationCommands(clientId), { body: commands })
			.then(() => client.login(token))
			.then(() => { return 'Successfully registered application commands.' })
			.catch(console.error)

	}
}


module.exports = initialize_discord_bot

