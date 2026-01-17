const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const { addCommandsUsed } = require('../../functions/usageData.js');

module.exports = {
	cooldown: 5,
	data: new SlashCommandBuilder()
		.setName('mizuover')
		.setDescription('It\'s mizuover.')
		.setIntegrationTypes([0,1])
		.setContexts([0,1,2]),
	async execute(interaction) {

		// Add to analytics
		addCommandsUsed(interaction.user);

		// Reply
		await interaction.reply({
			content: "It's so mizuover. **1003.**\n\nAkiyama Mizuki (暁山 瑞希) is a second year student at Kamiyama High School. They are the animator of the online music circle 25-ji, Nightcord de., going by the alias \"Amia\".\n-# This is a silly command, and will be toggleable shortly."
		});
	},
};