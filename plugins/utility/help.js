const { SlashCommandBuilder, MessageFlags, PermissionsBitField } = require('discord.js');
const { devID } = require("./../../config.js");

module.exports = {
	cooldown: 3,
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Need help tinkering?')
		.addIntegerOption(option =>
			option
				.setName('page')
				.setRequired(true)
				.setDescription('Page.'))
		.setIntegrationTypes([0,1])
		.setContexts([0,1,2]),
	async execute(interaction) {
		// interaction.user is the object representing the User who ran the command
		// interaction.member is the GuildMember object, which represents the user in the specific guild
		let helpMessage = "# Help Menu:";
		let helpArray = [];
		if (interaction.user.id == devID || interaction.user.id == "978666464225681469") {
			helpArray.push("**Bot Owner commands:**");
			helpArray.push("- No extra commands available at the moment.");
		}

		// Fun stuff
		helpArray.push("**Fun commands:**");
		helpArray.push("-Vocaloid Gifs-");
		helpArray.push("- /miku: Sends a Miku gif.");
		helpArray.push("- /teto: Sends a Teto gif.");
		helpArray.push("- /luka: Sends a Luka gif.");
		helpArray.push("- /rin: Sends a Rin gif.");
		helpArray.push("- /len: Sends a Len gif.");
		helpArray.push("- /meiko: Sends a Meiko gif.");
		helpArray.push("- /luka: Sends a Luka gif.");
		helpArray.push("-Action Gifs-");
		helpArray.push("- /boop: Boops someone! (WIP)");
		helpArray.push("- /hug: Hugs someone! (WIP)");
		helpArray.push("- /pat: Pats someone! (WIP)");
		helpArray.push("- /wave: Waves towards someone! (WIP)");
		helpArray.push("- /poke: Pokes someone! (WIP)");
		helpArray.push("- /punch: Punches someone. (WIP)");
		helpArray.push("- /kill: Self explanatory... (WIP)");
		
		// Utils
		helpArray.push("**Utility commands:**");
		helpArray.push("- /gospel: Sends a Christian Gospel message (privately).");
		helpArray.push("- /help: Provides this help menu.");
		helpArray.push("- /info: Provides an info manual about the bot.");
		helpArray.push("- /notify: Opt in / out of notifications.");
		helpArray.push("- /opt-in: Opt in towards data collection.");
		helpArray.push("- /opt-out: Opt out towards data collection.");
		
		// Silly stuff
		helpArray.push("**Silly commands:**");
		helpArray.push("- /minori: Small (minori) spelling mistake.");
		helpArray.push("- /mizuover: It's so Mizuover..");
		helpArray.push("-# This help menu only gives you help for commands you have permission to use.")

		let page = interaction.options.getInteger("page");
		let pageSize = 15;
		if (helpArray[(page - 1) * pageSize] == undefined) {
			helpMessage += `\n\nThe page that you have requested is not within bounds. Only pages between 1 and ${Math.ceil((helpArray.length) / pageSize)} are valid.`;
		} else {
			for (let i = (page - 1) * pageSize; i < Math.min(pageSize + ((page - 1) * pageSize), helpArray.length); i++) {
				helpMessage += "\n" + helpArray[i];
			}
		}
		helpMessage += `\n--- Page (${page}/${Math.ceil((helpArray.length) / pageSize)}). © Nexint 2026. All Rights Reserved. ---`;
		await interaction.reply({
			content: helpMessage,
			flags: MessageFlags.Ephemeral
		});

	},
};