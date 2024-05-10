const { EmbedBuilder } = require("discord.js");
const getLocalCommands = require("../../utils/getLocalCommands");
const { SlashCommandBuilder } = require('discord.js');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('cmds')
        .setDescription('Return all commands registered.'),
    async execute(interaction, client) {
        const cmds = getLocalCommands();
        let cmdString = ' ';
        let adminString = ' ';
        let economyString = ' ';
        for (let cmd of cmds) {
            const command = cmd.data.name;
            if (command === 'ban' || command === 'kick' || command === 'purge' || command === 'admin') adminString += command + '\n';
            else if (command === 'leaderboard' || command === 'balance' || command === 'pay' || command === 'daily' || command === 'coinflip') economyString += command + '\n';
            else cmdString += command + '\n';
        }
        const embed = new EmbedBuilder()
            .setTitle(`Banana Commands`)
            .setTimestamp()
            .setFooter({
                text: 'Bananas!',
                iconURL: client.user.avatarURL(),
            })
            .setThumbnail(client.user.avatarURL())
            .addFields(
                {
                    name: 'Commands',
                    value: cmdString,
                },
                {
                    name: 'Economy Commands',
                    value: economyString,
                },
                {
                    name: 'Admin Commands',
                    value: adminString,
                },
            );
        interaction.reply({embeds: [embed]});
    }
}