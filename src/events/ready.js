const moment = require('moment');
const guildSettings = require('../schemas/guildSettings')

module.exports = {
	name: 'ready',
	once: true, 
	async execute(client) {
		console.log('Bot is logged in'.green);

        // client.user.setPresence({ activities: [{ type: 'WATCHING', name: 'for new members 🎈' }], status: 'online' });

		const statuses = [
            {
                status: 'online', // online, idle, dnd or invisible
                type: 'PLAYING', // PLAYING, WATCHING, LISTENING, STREAMING, COMPETING
                text: 'with emojies 😜', // whatever :p
            },
            {
                status: 'online',
                type: 'LISTENING',
                text: '/help ✨',
            },
            {
                status: 'online',
                type: 'WATCHING',
                text: 'for new members 🎈',
            },
			{
				status: 'online',
				type: 'WATCHING',
				text: 'over '
			}
        ]

        async function autoStatus(client) {
            let step = 0;
        
            setInterval(() => {
        
                const status = statuses[step].status;
                const type = statuses[step].type;
				let text;

				if(step == 3) {
					text = statuses[step].text + client.guilds.cache.size + " guilds 🍑";
				} else {
                	text = statuses[step].text;
				}
        
                client.user.setPresence({activities: [{type: type, name: text}], status: status });
				// console.log(`✨ | Status set to ${status} | ${type} | ${text}`.green);
        
                if(step == statuses.length - 1) step = 0;
                else step++;
        
            }, 10 * 1000); // every 10 seconds
        }

		await autoStatus(client);
	}
};