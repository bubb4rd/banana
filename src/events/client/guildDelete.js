const guilds = require('../../../guilds.json');
module.exports = {
    name: "guildDelete",
    async execute(guild, client) {
        let index = 0;
        for (let i = 0; i < guilds.length; i++) {
            if (guilds[i].id === guild.id) index = i;
        }
        const deleted = guilds.splice(index, index);
        console.log(`Leaving Guild (id: ${deleted.id})`);
    }
}