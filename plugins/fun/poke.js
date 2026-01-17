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

const poke = fundb.define('poke', {
	userId: {
		type: Sequelize.STRING,
	},
	pokeId: {
		type: Sequelize.STRING,
	},
	value: {
		type: Sequelize.INTEGER,
	},
});

module.exports = {
	cooldown: 5,
	data: new SlashCommandBuilder()
		.setName('poke')
		.setDescription('Pokes someone!')
		.addUserOption(option =>
			option
				.setName('user')
				.setRequired(true)
				.setDescription('The person to poke.'))
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
		const results = await searchGif("anime poke");
		let findPokes;

		// What should the description be?
		let description = `One of you has opted out of data collection.\n-# Via Klipy API.`;
		if (!optedOut) {
			findPokes = await poke.findOne({
				where: {
					userId: interaction.user.id,
					pokeId: interaction.options.getUser("user").id
				}
			});
			if (findPokes === null) {
				await poke.create({
					userId: interaction.user.id,
					pokeId: interaction.options.getUser("user").id,
					value: 1
				});
				findPokes = await poke.findOne({
					where: {
						userId: interaction.user.id,
						pokeId: interaction.options.getUser("user").id
					}
				});
			} else {
				findPokes.value += 1;
				await findPokes.save();
			}
			description = `${interaction.user.displayName} has poked ${interaction.options.getUser("user").displayName} ${findPokes.value} time(s)! ༼ つ ◕_◕ ༽つ\n-# Via Klipy API.`;
		}

		// Title?
		let title = `${interaction.user.displayName} pokes ${interaction.options.getUser("user").displayName}! ༼ つ ◕_◕ ༽つ`;


		// Send Embed!
		const pokeEmbed = await embed(title, description, results.url, results.shortURL)
		const embedMessage = await interaction.reply({
			embeds: [pokeEmbed], withResponse: true
		});

		// DM Notify
		let notifdesc = `${interaction.user.displayName} pokes you in the channel ${embedMessage.resource.message.url}!`;
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