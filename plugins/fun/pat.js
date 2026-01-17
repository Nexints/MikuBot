const Sequelize = require('sequelize');
const { dmNotify } = require('../../functions/notify.js');
const { SlashCommandBuilder, MessageFlags, InteractionContextType } = require('discord.js');
const { klipyKey } = require('../../config.js');
const { searchGif } = require('../../functions/gifs.js');
const { embed } = require('../../functions/embed.js');
const { optOutChk } = require('../../functions/optOut.js');
const { addCommandsUsed } = require('../../functions/usageData.js');

const sequelize = new Sequelize('database', 'user', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	// SQLite only
	storage: 'database.sqlite',
});

const fundb = new Sequelize('database', 'user', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	// SQLite only
	storage: 'fundb.sqlite',
});

const optOut = sequelize.define('optout', {
	author: {
		type: Sequelize.STRING,
		unique: true,
	}
});

const pat = fundb.define('pat', {
	userId: {
		type: Sequelize.STRING,
	},
	pattedId: {
		type: Sequelize.STRING,
	},
	value: {
		type: Sequelize.INTEGER,
	},
});

module.exports = {
	cooldown: 5,
	data: new SlashCommandBuilder()
		.setName('pat')
		.setDescription('Pat someone!')
		.addUserOption(option =>
			option
				.setName('user')
				.setRequired(true)
				.setDescription('The person to pat.'))
		.addBooleanOption(option =>
			option
				.setName('notify')
				.setDescription('Whether or not to notify the person. Defaults to false.'))
        .setIntegrationTypes([0, 1])
        .setContexts([0, 1, 2]),
	async execute(interaction) {
		// Check for klipy key
		if (klipyKey == "") {
			await interaction.reply({
				content: "The bot owner didn't set up an API key for tenor.",
				flags: MessageFlags.Ephemeral
			});
			return;
		}

		// Opt-out check
		let optedOut = await optOutChk(interaction.user, interaction.options.getUser("user"));

		// Add to analytics
		addCommandsUsed(interaction.user);

		// Search for gif
		const results = await searchGif("anime pat")
		let findpat;

		// What should the description be?
		let description = `One of you has opted out of data collection.\n-# Via Klipy API.`;
		if (!optedOut) {
			findpat = await pat.findOne({
				where: {
					userId: interaction.user.id,
					pattedId: interaction.options.getUser("user").id
				}
			});

			if (findpat === null) {
				await pat.create({
					userId: interaction.user.id,
					pattedId: interaction.options.getUser("user").id,
					value: 1
				});
				findpat = await pat.findOne({
					where: {
						userId: interaction.user.id,
						pattedId: interaction.options.getUser("user").id
					}
				});
			} else {
				findpat.value += 1;
				await findpat.save();
			}
			description = `${interaction.user.displayName} has patted ${interaction.options.getUser("user").displayName} ${findpat.value} time(s)! ⸜(｡˃ ᵕ ˂ )⸝♡\n-# Via Klipy API.`;
		}

		// Title?
		let title = `${interaction.user.displayName} pats ${interaction.options.getUser("user").displayName}! ⸜(｡˃ ᵕ ˂ )⸝♡`;

		// Send Embed!
		const patEmbed = await embed(title, description, results.url, results.shortURL)
		const embedMessage = await interaction.reply({
			embeds: [patEmbed], withResponse: true
		});

		// DM Notify
		let notifdesc = `${interaction.user.displayName} patted you in the channel ${embedMessage.resource.message.url}!`;
		let notify = interaction.options.getBoolean("notify");
		if (notify == null) {
			notify = false;
		}
		if (notify && interaction.contextType !== InteractionContextType.PrivateChannel) {
			await dmNotify(interaction.options.getUser("user"), notifdesc, results.shortURL, results.url);
		}
		return;
	},
};