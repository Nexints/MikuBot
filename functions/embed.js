const { EmbedBuilder } = require('discord.js');
const { embedURL, embedIconURL, footerText, infoColor } = require('../config.js');

// Embed function
// Input: title, description, url, shortURL (url can be null)
// Output: returns embed
const embed = async function (title, description, url, shortURL) {
    const embed = new EmbedBuilder()
        .setColor(infoColor)
        .setTitle(title)
        .setURL(url)
        .setDescription(description)
        .setThumbnail(embedURL)
        .setImage(shortURL)
        .setTimestamp()
        .setFooter({ text: footerText, iconURL: embedIconURL });
    return embed;
}

module.exports = {
    embed,
};