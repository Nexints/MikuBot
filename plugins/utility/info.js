const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const { queryCommand } = require('../../functions/usageData.js');
const { version, versionID, mikuVer } = require('../../config.js');
const { client, latestVersion } = require('../../bot.js');

module.exports = {
	cooldown: 5,
	data: new SlashCommandBuilder()
		.setName('info')
		.setDescription('Info about the bot!')
		.setIntegrationTypes([0,1])
		.setContexts([0,1,2]),
	async execute(interaction) {
		// interaction.user is the object representing the User who ran the command
		// interaction.member is the GuildMember object, which represents the user in the specific guild
		let outputMsg;
		if (latestVersion > versionID) {
			outputMsg = `${latestVersion - versionID} commits behind.`;
		} else if (latestVersion == 0) {
			outputMsg = `The bot can't check for updates!`;
		} else if (latestVersion < versionID) {
			outputMsg = `${versionID - latestVersion} commits ahead.`;
		} else {
			outputMsg = `Running the latest version.`;
		}
		let guilds = await client.cluster.broadcastEval(`this.guilds.cache.size`);
		let members = await client.cluster.broadcastEval((c) => c.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0));
		let commands = await queryCommand();
		let msg = "";
		msg = msg + `Miku runs under a heavily modified instance of OpenBot, an open-source all in one moderation bot!\n\n`;

		// bot version
		msg = msg + `**Bot Version:**\n`;
		msg = msg + `Miku Version: ${mikuVer} (More development to come!)\n`
		msg = msg + `OpenBot version: ${version} (Version ID: ${versionID}) / Latest version ID: ${latestVersion}.\n${outputMsg}\n\n`;

		// stats
		msg = msg + `**Bot Stats:**\n`;
		msg = msg + `Members: ${members}\nGuilds: ${guilds.reduce((prev, val) => prev + val, 0)}\n`;
		msg = msg + `Total commands used: ${commands.value}\n`;
		await interaction.reply({
			content: msg,
			flags: MessageFlags.Ephemeral
		});
	},
};