const Balance = require('../../schemas/balance');
const { Types } = require('mongoose');
const chalk = require('chalk');
module.exports = (client) => {
    client.fetchBalance = async (userId, guildId) => {
        let storedBalance = await Balance.findOne({ userId: userId, guildId: guildId});
        if (!storedBalance) {
            storedBalance = new Balance({
                _id: new Types.ObjectId(),
                userId: userId,
                guildId: guildId,
            });
            await storedBalance.save().then(async balance => {
                console.log(chalk.green(`[Balance Created]: UserId: ${balance.userId}`));
            }).catch(console.error);
            return storedBalance;
        } else return storedBalance;
    };
};