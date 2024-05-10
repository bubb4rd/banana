const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const Balance = require('../../schemas/balance');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('admin')
        .setDescription('Access to admin commands')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addSubcommand((subcommand) => 
            subcommand
                .setName('add')
                .setDescription('Add money to a user\'s balance')
                .addUserOption((option) => 
                    option
                        .setName('user')
                        .setDescription('User to add money to')
                        .setRequired(true)
                )
                .addIntegerOption((option) => 
                option
                    .setName('amount')
                    .setDescription('Amount of money to add')
                    .setRequired(true)
                    .setMinValue(1)
                )
        )
        .addSubcommand((subcommand) => 
            subcommand
                .setName('sub')
                .setDescription('Subtract money to a user\'s balance')
                .addUserOption((option) => 
                    option
                        .setName('user')
                        .setDescription('User to remove money from')
                        .setRequired(true)
                )
                .addIntegerOption((option) => 
                option
                    .setName('amount')
                    .setDescription('Amount of money to subtract')
                    .setRequired(true)
                    .setMinValue(1)
                )
        ),
    async execute(interaction, client) {
        const user = interaction.options.getUser('user');
        const adminCommand = interaction.options.getSubcommand();
        if (adminCommand === 'add') {
            const userStoredBalance = await client.fetchBalance(interaction.user.id, interaction.guild.id);
            const amount = interaction.options.getInteger('amount');
            await Balance.findOneAndUpdate(
                {_id: userStoredBalance._id },
                {
                    balance: await client.toFixedNumber(userStoredBalance.balance + amount),
                },
            );
            return await interaction.reply(`Added \$${amount} to ${user}.`);
        }
        if (adminCommand === 'sub') {
            const userStoredBalance = await client.fetchBalance(interaction.user.id, interaction.guild.id);
            const amount = interaction.options.getInteger('amount');
            await Balance.findOneAndUpdate(
                {_id: userStoredBalance._id },
                {
                    balance: await client.toFixedNumber(userStoredBalance.balance - amount),
                },
            );
            return await interaction.reply(`Subtract \$${amount} from ${user}.`);
        }
    },
};