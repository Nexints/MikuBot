const { SlashCommandBuilder, MessageFlags } = require('discord.js');

const { version, versionID } = require('../../config.js');
const { client } = require('../../bot.js');

module.exports = {
	cooldown: 5,
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Check each shard\'s ping!')
		.setIntegrationTypes([0, 1])
		.setContexts([0, 1, 2]),
	async execute(interaction) {
		// interaction.user is the object representing the User who ran the command
		// interaction.member is the GuildMember object, which represents the user in the specific guild
		await interaction.deferReply({
			flags: MessageFlags.Ephemeral
		});
		let ping = "";
		let results = await client.cluster.broadcastEval(client => {
			// This code runs on each individual shard
			return {
				shardId: client.cluster.id,
				ping: Math.round(client.ws.ping),
			};
		})
		results.forEach(shardInfo => {
			ping = ping + `\n• Cluster #${shardInfo.shardId} | Ping: ${shardInfo.ping}ms`;
		})
		await interaction.editReply({
			content: `Miku Ping:\n${ping}`,
			flags: MessageFlags.Ephemeral
		});
	},
};