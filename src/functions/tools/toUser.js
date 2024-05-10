module.exports = (client) => {
    client.toUser = async (string) => {
        let fullUser = `<@${string}>`;
        return fullUser;
    }
};