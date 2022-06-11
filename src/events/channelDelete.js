const moment = require('moment');
const guildSettings = require('../schemas/guildSettings');

module.exports = {
	name: 'channelDelete',
	once: false, 
	async execute(channel, client) {
        // TO-DO: Check if the channel was used in a setup and if so, remove the setup.
		const { guild } = channel;

		// Check if the channel is a guild channel
		if (channel.type !== 'GUILD_TEXT') return;
		
		//check if channel was in the database
		try {
			const guildFromDb = await guildSettings.findOne({ guildID: guild.id });
		} catch (err) {
			console.log("🚑 ERORRR" + err);
		}

		if (guildFromDb.verificationChannelId == channel.id) {
			console.log('asd');
			await guildSettings.findOneAndUpdate({ guildId: guild.id }, { verificationChannelId: 0, verificationRoleId: 0 });
			console.log(`[${moment().format('MMMM Do YYYY, h:mm:ss a')}] 🍮 Channel (#${channel.name}) has been deleted from ${guild.name} and setup was cleared`);
		} else {
			console.log('nope');
		}

	}
};