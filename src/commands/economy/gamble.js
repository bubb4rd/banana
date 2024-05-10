const { SlashCommandBuilder, ButtonStyle } = require('discord.js');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require('@discordjs/builders');
const Blackjack = require("simply-blackjack");
const Balance = require('../../schemas/balance');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('gamble')
        .setDescription('Gamble with your money')
        .addSubcommand((subcommand) =>
            subcommand
                .setName('three-doors')
                .setDescription('Double, half, or lose all your money!')
                .addIntegerOption((option) =>
                    option
                        .setName('amount')
                        .setDescription('Amount of money to gamble')
                        .setRequired(true)
                        .setMinValue(2)
                        .setMaxValue(200)
                )
        ),
        // .addSubcommand((subcommand) =>
        //     subcommand
        //         .setName("blackjack")
        //         .setDescription("Play blackjack!")
        //         .addIntegerOption((option) =>
        //             option
        //                 .setName("amount")
        //                 .setDescription('Amount of money to gamble')
        //                 .setRequired(true)
        //                 .setMinValue(10)
        //                 .setMaxValue(200)
        //         )
        // )
    async execute(interaction, client) {
        const userStoredBalance = await client.fetchBalance(interaction.user.id, interaction.guild.id);
        const { username, id} = interaction.user;
        const gambleCommand = interaction.options.getSubcommand();
        try {
        const gambleEmbed = new EmbedBuilder()
        .setColor(0x00aa6d);
        //Blackjack
    //     if (gambleCommand === "blackjack") {
    //         const amount = interaction.options.getInteger('amount');
    //         if (userStoredBalance.balance < amount) return await interaction.reply('You do not have enough money to gamble!');
    //
    //         // const Button1 = new ButtonBuilder()
    //         //     .setCustomId('double')
    //         //     .setLabel("DOUBLE")
    //         //     .setStyle(ButtonStyle.Danger);
    //         const Button2 = new ButtonBuilder()
    //             .setCustomId('hit')
    //             .setLabel("HIT")
    //             .setStyle(ButtonStyle.Success);
    //         const Button3 = new ButtonBuilder()
    //             .setCustomId('stand')
    //             .setLabel("STAND")
    //             .setStyle(ButtonStyle.Primary);
    //         const row = new ActionRowBuilder({
    //             components: [
    //                 Button2,
    //                 Button3
    //             ]
    //         });
    //
    //         const Game = new Blackjack({
    //             decks: 3,
    //             payouts: {
    //                 blackjack: 1.5,
    //                 default: 1
    //             }
    //         });
    //         Game.bet(amount)
    //         let cards = Game.start();
    //         const player = cards.player;
    //
    //         const dealer = cards.dealer;
    //         gambleEmbed
    //             .setTimestamp()
    //             .setTitle(`Dealer showing ${dealer.cards[0].name}`)
    //             .setDescription(`Blackjack round for \$${amount}`)
    //             .setFooter({
    //                 text: `Total: ${player.total}`
    //             });
    //
    //
    //         const printCards = () => {
    //             let title = `Dealer showing `;
    //             for (let x = 0; x < player.cards.length; x++) {
    //                 const card = player.cards[x];
    //                 let num = card.name.substring(card.name.indexOf(' ') -1);
    //                 if (num[0] === '0') num = '1' + num;
    //                 gambleEmbed.addFields(
    //                     { 'name': `Card ${x+1}`, 'value': `**${num}**` },
    //                 );
    //             }
    //             for (let y = 0; y < dealer.cards.length; y++) {
    //                 const card = dealer.cards[y];
    //                 const num = card.name.substring(0);
    //                 title += num;
    //             }
    //             gambleEmbed.setTitle(title);
    //         }
    //         printCards();
    //
    //         const amountChange = (gamble) => {
    //             if (Game.state === 'player_blackjack') return gamble * 1.5;
    //             else if (Game.state === 'player_win') return gamble;
    //             else return -gamble;
    //         }
    //         await interaction.reply({
    //             embeds: [gambleEmbed], components: [row]
    //         });
    //         const message = await interaction.fetchReply();
    //         const filter = (i) => i.user.id === interaction.user.id;
    //         const collector = message.createMessageComponentCollector({
    //             filter,
    //             time: 60000,
    //         });
    //         let choice = null;
    //         let m = null;
    //         collector.on("collect", async(i) => {
    //             m = i;
    //             if (i.customId === "hit") {
    //                 choice = Button2;
    //                 Game.hit();
    //                 if (player.total > 21) {
    //                     gambleEmbed.setDescription("You busted! :-(");
    //                 }
    //                 printCards();
    //                 await i.update({
    //                     embeds: [gambleEmbed], components: [row]
    //                 });
    //             }
    //             else if (i.customId === "stand") {
    //                 choice = Button3;
    //                 Game.stand();
    //                 Button2.setDisabled(true);
    //                 Button3.setDisabled(true);
    //                 printCards();
    //                 i.update({
    //                     embeds: [gambleEmbed], components: [row]
    //
    //                 })
    //             }
    //
    //             if (choice === null) return await message.reply({
    //                 content: `Something went wrong, please try again.`,
    //                 ephemeral: true
    //             });
    //
    //             await i.update({
    //                 embeds: [gambleEmbed], components: [row]
    //             });
    //         });
    //         const label = choice.data.label;
    //         const revenue = amountChange(amount);
    //         if (label === 'STAND') {
    //             gambleEmbed
    //                 .setTitle(`${interaction.user} stands`);
    //             printCards();
    //
    //         }
    //         Game.on("end", (results) =>{
    //             collector.stop();
    //             console.log(results);
    //             if (results.state === 'player_win' || results.state === 'player_blackjack') {
    //                 gambleEmbed
    //                     .setDescription(`${interaction.user} won **\$${amount}**`)
    //             }
    //             else if (results.state !== 'draw') gambleEmbed.setDescription(`${interaction.user} lost **\$${amount}**`)
    //             else gambleEmbed.setDescription(`${interaction.user} pushed.`);
    //             message.update({
    //                 embeds: [gambleEmbed], components: [row]
    //             })
    //         });
    //
    //         message.update({
    //             embeds: [gambleEmbed], components: [row]
    //         })
    //         await Balance.findOneAndUpdate(
    //             {_id: userStoredBalance._id},
    //             {
    //                 balance: await client.toFixedNumber(userStoredBalance.balance + revenue)
    //             }
    //         );
    //
    // }
    // Three doors
    if (gambleCommand === 'three-doors') {
        const amount = interaction.options.getInteger('amount');
        if (userStoredBalance.balance < amount) return await interaction.reply('You do not have enough money to gamble!');

        const Button1 = new ButtonBuilder()
            .setCustomId('one')
            .setLabel("Door 1")
            .setStyle(ButtonStyle.Primary);
        const Button2 = new ButtonBuilder()
            .setCustomId('two')
            .setLabel("Door 2")
            .setStyle(ButtonStyle.Primary);
        const Button3 = new ButtonBuilder()
            .setCustomId('three')
            .setLabel("Door 3")
            .setStyle(ButtonStyle.Primary);
        const row = new ActionRowBuilder({
            components: [
                Button1,
                Button2,
                Button3
            ]
        });
        gambleEmbed
                .setTimestamp()
                .setTitle(`Playing three doors for **\$${amount}**`)
                .setFooter({
                    text: `Double, lose half or lose all`
                });
        await interaction.reply({
            embeds: [gambleEmbed], components: [row]
        });
        // this message ^
        const message = await interaction.fetchReply();
        const filter = (i) => i.user.id === interaction.user.id;
        const collector = message.createMessageComponentCollector({
            filter,
            time: 60000,
        });
        const double = "DOUBLE COINS";
        const half = "LOSE HALF";
        const lose = "LOSE ALL";
        const getAmount = (label, gamble) => {
            let amount = -gamble;
            if (label === double) amount = gamble;
            else if (label === half) amount = Math.round(gamble / 2);
            return amount;
        };
        let choice = null;
        collector.on("collect", async (i) => {
            let options = [Button1, Button2, Button3];
            const randIdxDouble = Math.floor(Math.random() * 3);
            const doubleButton = options.splice(randIdxDouble, 1)[0];
            doubleButton.setLabel(double).setDisabled(true);

            const randIdxHalf = Math.floor(Math.random() * 2);
            const halfButton = options.splice(randIdxHalf, 1)[0];
            halfButton.setLabel(half).setDisabled(true);

            const zeroButton = options[0];
            zeroButton.setLabel(lose).setDisabled(true);

            Button1.setStyle(ButtonStyle.Secondary);
            Button2.setStyle(ButtonStyle.Secondary);
            Button3.setStyle(ButtonStyle.Secondary);
            if (i.customId === 'one') choice = Button1;
            else if (i.customId === 'two') choice = Button2;
            else if (i.customId === 'three') choice = Button3;

            if (choice === null) return await interaction.reply({
                content: `Something went wrong, please try again.`,
                ephemeral: true
            });
            else choice.setStyle(ButtonStyle.Success);
            collector.stop();
            const label = choice.data.label;
            const amountChange = getAmount(label, amount);

            await Balance.findOneAndUpdate(
                {_id: userStoredBalance._id},
                {
                    balance: await client.toFixedNumber(userStoredBalance.balance + amountChange)
                }
            );
            if (label === double)
                gambleEmbed
                    .setTitle("DOUBLE! Huge Max Win!")
                    .setDescription(`${username} won \$${amountChange}`);
            else if (label === half)
            {
                gambleEmbed
                .setTitle("Half... Better than losing it all!")
                .setDescription(`${username} lost \$${amountChange}`);
                choice.setStyle(ButtonStyle.Primary);
            }
            else if (label === lose)
            {
                gambleEmbed
                .setTitle("Ouch. Maybe you will have better luck next time")
                .setDescription(`${username} lost \$${-amountChange}`);
                choice.setStyle(ButtonStyle.Danger);
            }
            await i.update({
                embeds: [gambleEmbed], components: [row]
            });
        });
    }
        } catch (error) {
            console.error(error);
            return await interaction.reply(`Sorry, something failed: ${error}`);
        }
    },
};