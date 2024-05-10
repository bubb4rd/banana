const { SlashCommandBuilder } = require('discord.js');
const { coinFlipReward } = require('../../../globalValues.json');
const Balance = require('../../schemas/balance');
const parseMilliseconds = require('parse-ms-2');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('coinflip')
        .setDescription('Flip a coin for a free bonus!')
        .addStringOption((option) =>
            option
                .setName('choice')
                .setDescription("Heads or Tails")
                .setRequired(true)
                .addChoices(
                    { name: 'Heads', value: 'Heads'},
                    { name: 'Tails', value: 'Tails'}
                )
        ),
    async execute(interaction, client) {
        const userStoredBalance = await client.fetchBalance(interaction.user.id, interaction.guild.id);
        const cooldown = 3600000; // 1 hr cooldown
        const { coinFlipLastUsed } = userStoredBalance;
        const timeLeft = cooldown - (Date.now() - coinFlipLastUsed);

        if (timeLeft > 0) {
            const { minutes, seconds } = parseMilliseconds(timeLeft);
            return await interaction.reply({
                content: `Claim your next coinflip in **${minutes}** mins **${seconds}** secs`,
                ephemeral: true,
            });
        }
        await Balance.findOneAndUpdate(
            {_id: userStoredBalance._id},
            {
                coinFlipLastUsed: Date.now()
            },
        );
        const randumNum = Math.round(Math.random());
        const result = randumNum ? "Heads" : "Tails";
        const choice = interaction.options.getString("choice");

        if (choice === result) {
            await Balance.findOneAndUpdate(
                {_id: userStoredBalance._id},
                {
                    balance: await client.toFixedNumber(userStoredBalance.balance + coinFlipReward),
                },
            );
            return await interaction.reply(`Winner, Winner, Chicken Dinner! You won \$${coinFlipReward} with **${choice}**`);
        } else {
            return await interaction.reply(`Pooh... You chose **${choice}** but it was ${result}`);
        }
    },
};