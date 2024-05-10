const { EmbedBuilder } = require('discord.js');
const { SlashCommandBuilder } = require('discord.js');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('info')
        .setDescription('Information about the Banana Bot!'),
    async execute(interaction, client) {
        const embed = new EmbedBuilder()
            .setTitle("Banana Bot Info")
            .setDescription('Carrying out all the needs for the Great Banana Empire!')
            .setColor('#ffb703')
            .setTimestamp()
            .setFooter({
                text: 'Bananas!',
                iconURL: client.user.avatarURL(),
            })
            .addFields(
                {
                    name: 'Members',
                    value: `${client.memberCounts()}`,
                    inline: true
                },
                {
                    name: 'Servers',
                    value: `${client.serverCounts()}`,
                    inline: true
                },
                {
                name: 'Version', 
                value: '\`1.0.0\`',
                inline: true
            },
            {
                name: 'Developer', 
                value: '<@!232309522092261378>',
                inline: true
            }
            );
            interaction.reply({embeds: [embed]});
    },
};