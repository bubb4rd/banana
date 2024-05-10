const { ActivityType } = require('discord.js')

module.exports = (client) => {
    client.pickPresence = async () => {
        const members = client.memberCounts();
        const options = [
            {
                type: ActivityType.Watching,
                text: "the sunrise",
                status: "online"
            },
            {
                type: ActivityType.Listening,
                text: `${members} friends`,
                status: "online"
            }

        ];

        const option = Math.floor(Math.random() * options.length);
        await client.user.setPresence({
            activities: [
                {
                name: options[option].text,
                type: options[option].type,
            },
        ],
            status: options[option].status
        });
    }
}