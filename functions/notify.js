const { EmbedBuilder } = require('discord.js');
const { embedURL, embedIconURL, footerText, infoColor } = require('../config.js');
const Sequelize = require('sequelize');

const fundb = new Sequelize('database', 'user', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    // SQLite only
    storage: 'fundb.sqlite',
});

const notify = fundb.define('notify', {
    userId: {
        type: Sequelize.STRING,
    },
});

const dmNotify = async function (user, description, imageURL, messageURL) {
    const dmNotif = new EmbedBuilder()
        .setColor(infoColor)
        .setTitle(`Notification!`)
        .setURL(messageURL)
        .setDescription(description + "\n-# Turn notifs off with /notify!")
        .setThumbnail(embedURL)
        .setImage(imageURL)
        .setTimestamp()
        .setFooter({ text: footerText, iconURL: embedIconURL });
    try {
        const rowCount = await notify.findOne({ where: { userId: user.id } })
        if (rowCount === null) {
            await user.send({
                embeds: [dmNotif]
            });
        }
        return 0;
    } catch (error) {
        return error;
    }
}

module.exports = {
    dmNotify,
};