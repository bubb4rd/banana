const fs = require('fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const chalk = require('chalk');
const guilds = require('../../../guilds.json');
module.exports = (client) => {
    client.handleCommands = async () => {
        const commandFolders = fs.readdirSync('./src/commands')
        .filter((file) => file !== '.DS_Store');
        for (const folder of commandFolders) {
            const commandFiles = fs
                .readdirSync(`./src/commands/${folder}`)
                .filter((file) => file.endsWith('.js'));

            const { commands, commandArray } = client; 
            for (const file of commandFiles) {
                const command = require(`../../commands/${folder}/${file}`);
                await commands.set(command.data.name, command);
                commandArray.push(command.data.toJSON());
            }
        }
        const clientId = '1184364896071196672';
        const rest = new REST({ version: '9'}).setToken(process.env.token);

        try {
             for (let i = 0; i < guilds.length; i++) {
                 const guildObject = guilds[i];
                 const guild = guildObject.id;
                 console.log(chalk.gray(`Started refreshing application (/) commands for ${guild}`))
                 await rest.put(Routes.applicationGuildCommands(clientId, guild), {
                     body: client.commandArray,
                 });
             }
            console.log(chalk.gray("Reloaded application (/) commands."));
        } catch (error) {
            console.log(error);
        }
    };
};