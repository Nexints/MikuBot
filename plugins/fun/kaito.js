const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const { klipyKey } = require('../../config.js');
const { searchGif } = require('../../functions/gifs.js');
const { embed } = require('../../functions/embed.js');
const { addCommandsUsed } = require('../../functions/usageData.js');

module.exports = {
    cooldown: 5,
    data: new SlashCommandBuilder()
        .setName('kaito')
        .setDescription('Pulls a gif of Kaito!')
        .setIntegrationTypes([0, 1])
        .setContexts([0, 1, 2]),
    async execute(interaction) {
        // Check for klipy key
        if (klipyKey == "") {
            await interaction.reply({
                content: "The bot owner didn't set up an API key for Klipy.",
                flags: MessageFlags.Ephemeral
            });
            return;
        }

		// Add to analytics
		addCommandsUsed(interaction.user);

        // Search for Gif
        const results = await searchGif("kaito vocaloid")

        // Configure the gif response
        let description = `Via Klipy API.`;
        let title = `Found a Kaito Gif!`;

        // Send gif
        const kaito = await embed(title, description, results.url, results.shortURL)
        await interaction.reply({
            embeds: [kaito]
        });
        return;
    }
};