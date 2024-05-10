const { SlashCommandBuilder } = require('discord.js');
const Balance = require('../../schemas/balance');
const { customRoleCost } = require('../../../shop_prices.json');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('shop')
        .setDescription('Spend your money at the shop!')
        .addSubcommand((subcommand) =>
            subcommand
                .setName('custom-role')
                .setDescription(`Buy or edit custom role for ${customRoleCost} dollars`)
                .addStringOption((option) =>
                    option
                        .setName('action')
                        .setDescription('Choose an action for the custom role')
                        .addChoices(
                            { name: `Buy role: \$${customRoleCost}`, value: "buy"},
                            { name: `Edit role: \$${customRoleCost/2}`, value: "edit"}
                        )
                        .setRequired(true)
                )
                .addStringOption((option) =>
                    option
                        .setName('name')
                        .setDescription('name of your color')
                        .setMinLength(1)
                        .setMaxLength(20)
                        .setRequired(true)
                )
                .addStringOption((option) =>
                    option
                        .setName('hex')
                        .setDescription('Hex color code (do not include #)')
                        .setMinLength(6)
                        .setMaxLength(12)
                        .setRequired(true)
                )

                
            )
        .addSubcommand((subcommand) =>
            subcommand
                .setName('custom-role-remove')
                .setDescription('Remove your custom roll for free!')
        ),
    async execute(interaction, client) {
        const userStoredData = await client.fetchBalance(interaction.user.id, interaction.guild.id);
        const shopCommand = interaction.options.getSubcommand();
        const editCost = (customRoleCost / 2);
        if (shopCommand === 'custom-role') {
            const action = interaction.options.getString('action');
            const name = interaction.options.getString('name');
            const color = interaction.options.getString('hex');
            if (action === "edit") {
                if (userStoredData.customColorId === "") return await interaction.reply({
                    content: "You must have a custom role first",
                    ephemeral: true
                });
                else if (userStoredData.balance < editCost) return await interaction.reply({
                    content: `You do not have enough money to edit the role! **(\$${editCost})`,
                    ephemeral: true
                });
                const role = await interaction.guild.roles.fetch(userStoredData.customColorId);
                role.edit({
                    name,
                    color
                });
                await Balance.findOneAndUpdate(
                    {_id: userStoredData._id },
                    {
                        balance: await client.toFixedNumber(userStoredData.balance - editCost)
                    }
                )
                return await interaction.reply({
                    content: `You edited ${name} for \$${editCost}!`,
                    ephemeral: true
                });
            }
            if (action === "buy") {
                if (userStoredData.customColorId !== "") return await interaction.reply({
                    content: `You already have a custom color!`,
                    ephemeral: true
                });
                else if (userStoredData.balance < customRoleCost) return await interaction.reply({
                    content: `You do not have enough money to buy that! **(\$${customRoleCost})**`,
                    ephemeral: true
                });
                const role = await interaction.guild.roles.create({
                    name,
                    permissions: [],
                    color,
                });
                interaction.member.roles.add(role);
                await Balance.findOneAndUpdate(
                    {_id: userStoredData._id},
                    {
                        balance: await client.toFixedNumber(userStoredData.balance - customRoleCost),
                        customColorId: role.id
                    }
                );
                return await interaction.reply(`You bought ${name}!`);
            }
        }
        if (shopCommand === 'custom-role-remove') {
            if (userStoredData.customColorId === "") return await interaction.reply({
                content: "You do not have a custom role!",
                ephemeral: true
            });
            const role = await interaction.guild.roles.fetch(userStoredData.customColorId);
            role.delete();
            
            await Balance.findOneAndUpdate(
                {_id: userStoredData._id},
                {
                    customColorId: ""
                }
                );
                return await interaction.reply({
                    content: `Removed your custom color.`,
                    ephemeral: true
                });
        }
    },
};