const { SlashCommandBuilder } = require('discord.js');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Pong! Returns application latency.'),
    async execute(interaction, client) {
        interaction.reply(`Pong! \`Latency: ${client.ws.ping} ms\``);
    },
};