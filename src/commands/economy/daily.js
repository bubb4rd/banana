const { SlashCommandBuilder, EmbedBuilder, time } = require('discord.js');
const parseMilliseconds = require('parse-ms-2');
const Balance = require('../../schemas/balance');
const { dailyMin, dailyMax } = require('../../../globalValues.json');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('daily')
        .setDescription('Daily spin to get free money!'),
    async execute(interaction, client) {
        const userStoredBalance = await client.fetchBalance(interaction.user.id, interaction.guild.id);
        const { dailyLastUsed } = userStoredBalance;
        const cooldown = 86400000;
        const timeLeft = cooldown - (Date.now() - dailyLastUsed);
        
        if (timeLeft > 0) {
            const { hours, minutes, seconds } = parseMilliseconds(timeLeft);
            return await interaction.reply({
                content: `You can claim your next daily in **${hours}** hrs **${minutes}** mins **${seconds}** sec!`,
                ephemeral: true,
            });
        }

        const randomAmount = Math.floor(Math.random() *  (dailyMax - dailyMin + 1));
        try {
            await Balance.findOneAndUpdate(
                {_id: userStoredBalance._id},
                {
                    balance: await client.toFixedNumber(userStoredBalance.balance + randomAmount),
                    dailyLastUsed: Date.now(),
                }
            )
            await interaction.reply({
                content: `You won **\$${randomAmount}**!`,
                ephemeral: true,
            });
        } catch (error) {
            console.error(error);
        }
    },
};