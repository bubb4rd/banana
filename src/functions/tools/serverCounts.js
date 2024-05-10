module.exports = (client) => {
    client.serverCounts = () => {
        let count = 0;
        client.guilds.cache.each(guild => {
            count++;
        });
        return count;
    }
}