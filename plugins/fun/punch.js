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

const punch = fundb.define('punch', {
	userId: {
		type: Sequelize.STRING,
	},
	punchId: {
		type: Sequelize.STRING,
	},
	value: {
		type: Sequelize.INTEGER,
	},
});

module.exports = {
	cooldown: 5,
	data: new SlashCommandBuilder()
		.setName('punch')
		.setDescription('Punches someone!')
		.addUserOption(option =>
			option
				.setName('user')
				.setRequired(true)
				.setDescription('The person to punch.'))
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
		const results = await searchGif("anime punch");
		let findPunch;

		// What should the description be?
		let description = `One of you has opted out of data collection.\n-# Via Klipy API.`;
		if (!optedOut) {
			findPunch = await punch.findOne({
				where: {
					userId: interaction.user.id,
					punchId: interaction.options.getUser("user").id
				}
			});
			if (findPunch === null) {
				await punch.create({
					userId: interaction.user.id,
					punchId: interaction.options.getUser("user").id,
					value: 1
				});
				findPunch = await punch.findOne({
					where: {
						userId: interaction.user.id,
						punchId: interaction.options.getUser("user").id
					}
				});
			} else {
				findPunch.value += 1;
				await findPunch.save();
			}
			description = `${interaction.user.displayName} has punched ${interaction.options.getUser("user").displayName} ${findPunch.value} time(s)...\n-# Via Klipy API.`;
		}

		// Title?
		let title = `${interaction.user.displayName} punches ${interaction.options.getUser("user").displayName} D:`;


		// Send Embed!
		const punchEmbed = await embed(title, description, results.url, results.shortURL)
		const embedMessage = await interaction.reply({
			embeds: [punchEmbed], withResponse: true
		});

		// DM Notify
		let notifdesc = `${interaction.user.displayName} punched you in the channel ${embedMessage.resource.message.url}!`;
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