const chalk = require("chalk");
const {Routes} = require("discord-api-types/v9");
const { REST } = require('@discordjs/rest');
const guilds = require('../../../guilds.json');
module.exports = {
    name: "guildCreate",
    async execute(guild, client) {
        const guildToAdd = {
            id: guild.id
        };
        guilds.push(guildToAdd);
        console.log(`Joined Guild (id: ${guild.id})`);
        const rest = new REST({ version: '9'}).setToken(process.env.token);
        try {
            console.log(chalk.gray("Started refreshing application (/) commands for NEW SERVER"));
            const clientId = '1184364896071196672';
                const guildId = guild.id;
                await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
                    body: client.commandArray,
                });
            console.log(chalk.gray("Reloaded application (/) commands."));
        } catch (error) {
            console.log(error);
        }
    }
}