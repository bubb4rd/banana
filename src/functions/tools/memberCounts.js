const guilds = require('../../../guilds.json');
module.exports = (client) => {
    client.memberCounts = () => {
        let count = 0;
        for (let i = 0; i < guilds.length; i++) {
            const guild = client.guilds.cache.get(guilds[i].id);
            count += guild.memberCount;
        }
        return count;
    }
}