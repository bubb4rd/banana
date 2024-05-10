const { EmbedBuilder } = require("discord.js");
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('server')
        .setDescription('Get server information'),
    async execute(interaction, client) {
        try {
            let guild = interaction.guild;
        // console.log(guild);
        const roles = Array.from(guild.roles.cache.values()).filter(role => isNaN(role) === false);
        const channels = Array.from(guild.channels.cache.values()).filter(channel => isNaN(channel) === false);
        const serverInfo = new EmbedBuilder()
            .setTitle(guild.name)
            .setColor("Random")
            .setThumbnail(guild.iconURL(), true)
            .setTimestamp()
            .setFooter({
                text: 'Bananas!',
                iconURL: client.user.avatarURL(),
            })
            .addFields(
                {
                name: 'Member count',
                value: `${guild.memberCount}`,
                inline: true,
                },
                {
                name: 'Date created',
                value: `<t:${parseInt(guild.createdTimestamp/1000)}:R>`,
                inline: true,
                },
                {
                    name: `Roles - ${roles.length}`,
                    value: `${roles}`,
                    inline: false,
                },
                {
                    name: `Channels - ${channels.length}`,
                    value: `${channels}`,
                    inline: false,
                },
            );
            interaction.reply({embeds: [serverInfo]});
        } catch (error) {
            console.log(`Error: ${error}`);
        }
    },
};