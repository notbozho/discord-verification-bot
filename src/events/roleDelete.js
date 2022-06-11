const moment = require('moment');
const guildSettings = require('../schemas/guildSettings');

module.exports = {
	name: 'roleDelete',
	once: false, 
	async execute(role, client) {
        // TO-DO: Check if the role was used in a setup and if so, remove the setup.
		const { guild } = role; 

		//check if role was in the database
		const guildFromDb = await guildSettings.findOne({ guildId: guild.id });

		// is this the correct role check
		if (guildFromDb.verificationRoleId == role.id) {
			console.log('asd');
			await guildSettings.findOneAndUpdate({ guildId: guild.id }, { verificationChannelId: 0, verificationRoleId: 0 });
			console.log(`[${moment().format('MMMM Do YYYY, h:mm:ss a')}] 🍮 Role (#${role.name}) has been deleted from ${guild.name} and setup was cleared`);
		} else {
			console.log('nope');
		}

		
	}
};