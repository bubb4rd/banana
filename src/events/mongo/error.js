const chalk = require('chalk');

module.exports = {
    name: "error",
    execute(err) {
        console.log(chalk.red(`An error occured during the connection:\n${err}`));
    },
};