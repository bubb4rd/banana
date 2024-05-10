const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const Balance = require('../../schemas/balance');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('pay')
        .setDescription('Pays a user the amount')
        .addUserOption((option) => option.setName('target').setDescription('Target user').setRequired(true))
        .addNumberOption((option) => option.setName('amount').setDescription('Amount to send').setRequired(true)),
    async execute(interaction, client) {
        const userStoredBalance = await client.fetchBalance(interaction.user.id, interaction.guild.id);
        let amount = interaction.options.getNumber('amount');
        const selectedUser = interaction.options.getUser('target');

        if (selectedUser.bot) return await interaction.reply({
            content: 'You cannot send money to a bot! :-(',
            ephemeral: true,
        });
        else if (selectedUser.id === interaction.user.id) return await interaction.reply({
            content: 'You cannot send money to yourself! :-(',
            ephemeral: true,
        });
        else if (amount < 1.00) return await interaction.reply({
            content: 'The minimum amount is \`$1.00\`',
            ephemeral: true,
        });
        else if (amount > userStoredBalance.amount) return await interaction.reply({
            content: 'You do not have enough money to send!',
            ephemeral: true,
        });
        const selectedUserBalance = await client.fetchBalance(selectedUser.id, interaction.guild.id);
        amount = await client.toFixedNumber(amount);
        await Balance.findOneAndUpdate(
            { _id: userStoredBalance._id },
            {
                balance: await client.toFixedNumber(userStoredBalance.balance - amount),
            },
        );
        await Balance.findOneAndUpdate(
            { _id: selectedUserBalance._id },
            {
                balance: await client.toFixedNumber(selectedUserBalance.balance + amount),
            },
        );
        await interaction.reply({
            content: `You sent \$${amount} to ${selectedUser}!`,
            ephemeral: true
        });
    },
};