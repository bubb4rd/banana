const { EmbedBuilder } = require("@discordjs/builders");
const { ApplicationCommandOptionType } = require("discord.js");
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('user')
        .setDescription('Get a user\'s information'),
    options: [
        {
            name: 'target-user',
            description: 'Grab this user\'s info',
            required: false,
            type: ApplicationCommandOptionType.Mentionable,
        },
    ],
    async execute(interaction, client) {
        const targetId = interaction.options.get('target-user')?.value || interaction.member.user;
        
        const target = await interaction.guild.members.fetch(targetId);
        // const member = await interaction.guild.members.fetch(targetId);
        const embed = new EmbedBuilder()
            .setTitle(`${target.user.username}'s info`)
            .setTimestamp()
            .setFooter({
                text: 'Bananas!',
                iconURL: client.user.avatarURL(),
            })
            .setThumbnail(target.user.avatarURL())
            .setDescription(`${targetId}`)
            .addFields(
                {
                    name: "Account created",
                    value: `<t:${parseInt(target.user.createdAt/1000)}:R>`,
                    inline: true,
                },
                {
                    name: "Joined Server",
                    value: `<t:${parseInt(target.joinedAt/1000)}:R>`,
                    inline: true,
                },
                {
                    name: 'Roles',
                    value: `<@&${target._roles.join('> <@&')}>`,

                }
            );
            interaction.reply({embeds: [embed]});
    },
};