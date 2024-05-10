const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('balance')
        .setDescription('Returns balance of a user')
        .addUserOption((option) => option.setName('target').setDescription('Target user')),
    async execute(interaction, client) {
        const selectedUser = interaction.options.getUser('target') || interaction.user;
        const storedBalance = await client.getBalance(selectedUser.id, interaction.guild.id);
        if (!storedBalance) {
            return await interaction.reply({
                content: `${selectedUser} does not have a balance.`,
                ephemeral: true
            });
        } else {
            const embed = new EmbedBuilder()
                .setTitle(`${selectedUser.username}'s Balance`)
                .setTimestamp()
                .setColor("Green")
                .setImage(selectedUser.displayAvatarURL())
                .addFields([
                    {
                        name: `\`\$${storedBalance.balance}\``,
                        value: `\u200b`
                    }
                ])
                .setFooter({
                    text: 'Bananas!',
                    iconURL: client.user.displayAvatarURL()
                });
            await interaction.reply({
                embeds: [embed]
            })
        }
    },
};