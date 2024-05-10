const { EmbedBuilder } = require('discord.js');
const facts = require('../../../facts.json');
const { SlashCommandBuilder } = require('discord.js');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('fact')
        .setDescription('Get a random banana fact.'),
    async execute(interaction, client) {
        const randomNum = Math.floor(Math.random() * facts.length);
        const randomFact = facts[randomNum];
        const embed = new EmbedBuilder()
            .setTitle(`Random Banana Fact #${randomFact.id}`)
            .setTimestamp()
            .setColor('Random')
            .setFooter({
                text: 'Bananas!',
                iconURL: client.user.avatarURL(),
            })
            .setDescription(randomFact.fact);
            interaction.reply({embeds: [embed]}); 
    }
}