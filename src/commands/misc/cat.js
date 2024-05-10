const { EmbedBuilder } = require('discord.js');
const { SlashCommandBuilder } = require('discord.js');
const getRandomCat = require('random-cat-img');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('cat')
        .setDescription('Returns a cute cat :3'),
    async execute(interaction, client) {
        const cat = await getRandomCat();
        const link = await cat.message;
        const embed = new EmbedBuilder()
            .setTimestamp()
            .setFooter({
                text: 'Bananas!',
                iconURL: client.user.avatarURL(),
            })
            .setColor('Random')
            .setImage(link);
            interaction.reply({embeds: [embed]});
    }
}