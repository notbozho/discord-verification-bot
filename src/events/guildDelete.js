const moment = require('moment');
const guildSettings = require('../schemas/guildSettings');

module.exports = {
	name: 'guildDelete',
	once: false, 
	async execute(guild, client) {
		// TO-DO: Delete guild from database

		let log = `[${moment().format('MMMM Do YYYY, h:mm:ss a')}] 💔 Bot has been removed from ${guild.name}`;
		console.log(log);
		
		//check if role was in the database
		const guildFromDb = await guildSettings.findOne({ guildId: guild.id });

		if(guildFromDb) {
			await guildSettings.findOneAndDelete({ guildId: guild.id });
		}

	}
};