const { InteractionContextType, SlashCommandBuilder, PermissionFlagsBits, PermissionsBitField, MessageFlags } = require('discord.js');
const { devID } = require('../../config.js');

module.exports = {
    cooldown: 5,
    data: new SlashCommandBuilder()
		.setName('gospel')
	    .setDescription('Gives a link to the Christian Gospel')
	    .setIntegrationTypes([0,1])
	    .setContexts([0,1,2]),
    async execute(interaction) {
        // interaction.user is the object representing the User who ran the command
        // interaction.member is the GuildMember object, which represents the user in the specific guild
        await interaction.reply({
            content: "Check out the Christian Gospel here! https://the-gospel.xyz",
			flags: MessageFlags.Ephemeral
        });
        return;
    }
};