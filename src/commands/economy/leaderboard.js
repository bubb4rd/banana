const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const Balance = require('../../schemas/balance');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leaderboard')
        .setDescription('Shows the top earners in the server'),
    async execute(interaction, client) {
        const userStoredBalance = await client.fetchBalance(interaction.user.id, interaction.guild.id);
        let leaderboardEmbed = new EmbedBuilder()
            .setTitle(`${interaction.guild.name}'s **Top 10 Earners**`)
            .setColor('#45d6fd')
            .setThumbnail(interaction.guild.iconURL())
            .setFooter({
                text: 'You are not ranked yet!'
            });
            const members = await Balance.find({'guildId': `${interaction.guild.id}`}).sort({balance: -1}).catch((error) => console.error(error));

            const memberIdx = members.findIndex((member) => member.userId === userStoredBalance.userId);
            leaderboardEmbed.setFooter({
                text: `${interaction.user.username}, you are rank #${memberIdx + 1} with \$${userStoredBalance.balance}`,
                iconURL: interaction.user.displayAvatarURL(),
            });
            const topTen = members.slice(0, 10);
            let desc = '';
            for (let i = 0; i < topTen.length; i++) {
                let { user } = await interaction.guild.members.fetch(topTen[i].userId);
                if (!user) return;
                let userBalance = topTen[i].balance;
                desc += `**${i + 1}. ${user}:** **\$${userBalance}**\n`;
            }
            if (desc !== '') leaderboardEmbed.setDescription(desc);
            await interaction.reply({
                embeds: [leaderboardEmbed]
            });
    },
};