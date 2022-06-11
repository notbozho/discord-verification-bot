const moment = require('moment');
const config = require('../../config');
const guildSettings = require('../schemas/guildSettings');

const wait = require('util').promisify(setTimeout);

const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'guildCreate',
	once: false, 
	async execute(guild, client) {

		console.log(`[${moment().format('MMMM Do YYYY, h:mm:ss a')}] 💕 Bot has been added in ${guild.name}`.magenta);

		// save guild to database
		const guildFromDb = await guildSettings.findOne({ guildId: guild.id });
		if(!guildFromDb) {
			log = `[${moment().format('MMMM Do YYYY, h:mm:ss a')}] 🍄 ${guild.name} wasn\'t found in database so i added it`;
			console.log(log.green);

			let guildOwner;
			await guild.fetchOwner().then(owner => guildOwner = owner.user);
			const guildOwnerTag = guildOwner.username + '#' + guildOwner.discriminator;

			await guildSettings.create({ 
				guildId: guild.id,
				guildName: guild.name,
				ownerId: guildOwner.id,
				ownerTag: guildOwnerTag,
			});

			

		} else {
			console.log(`[${timestamp}] 🤡 ${guild.name} was found in db so i skipped it :)`.yellow);
		}

		await wait(3000);

		// send message to person who added bot to guild/ guild owner
		const welcomeEmbed = new MessageEmbed()
			.setColor('#763b4f')
			.setTitle(`➣ __Thank you__ for inviting me to **${guild.name}** 💖`)
			.setDescription(`- I'm **${client.user.username}**, a bot created by **! bozho#4881**.\n- I'm a simple bot that can give verification challenges to your new members\n- To start using me, you need to type /setup (tag the channel where members can use the /verify command) (tag the role members will recieve after verifiction)\n\n\n**REMINDER:** *I'm still in development so if you find a bug please be patient and report it :). For any questions or suggestions, feel free to join the support server*`)
			.addFields({name: '🔌 Support server', value: 'https://support.bozho.codes'})
			.setTimestamp()
			.setFooter(config.embeds.embedFooterText)

		if(guild.me.permissions.has('VIEW_AUDIT_LOG', { checkAdmin: true, checkOwner: true })) {

			const fetchedLogs = await guild.fetchAuditLogs({
			  limit: 1,
			  type: "BOT_ADD"
			});
			const auditlog = fetchedLogs.entries.first();
			
			auditlog.executor.send({embeds: [welcomeEmbed]});
		  } else {
			console.log("else")
			const guildOwner = guild.owner.user;
			
			guildOwner.send({embeds: [welcomeEmbed]});
		  }

	}
};