const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const { addCommandsUsed } = require('../../functions/usageData.js');

module.exports = {
	cooldown: 5,
	data: new SlashCommandBuilder()
		.setName('minori')
		.setDescription('Minori spelling mistake.')
		.setIntegrationTypes([0,1])
		.setContexts([0,1,2]),
	async execute(interaction) {

		// Add to analytics
		addCommandsUsed(interaction.user);

		// Reply
		await interaction.reply({
			content: "https://tenor.com/view/minori-hanasato-minori-pjsk-more-more-jump-project-sekai-pjsk-gif-10970315925687936087\n-# This is a silly command, and will be toggleable shortly."
		});
	},
};