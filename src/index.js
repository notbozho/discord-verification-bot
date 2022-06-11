const fs = require('fs');
const colour = require('colour');
const mongoose = require('mongoose');
const moment = require('moment');
// const StormDB = require('stormdb');

// const engine = new StormDB.localFileEngine('./db.stormdb');
// const db = new StormDB(engine);

const { Client, Intents, Collection } = require('discord.js');
const client = new Client({
	intents:[Intents.FLAGS.GUILDS],
	presence: {
		status: 'online',
		activity: {
			name: 'with slash commands',
			type: 'PLAYING'
		}
	}
});

client.commands = new Collection();

require('dotenv').config();

const guildSettings = require('./schemas/guildSettings');

const functions = fs.readdirSync('./src/functions').filter(file => file.endsWith('.js'));
const eventsFiles = fs.readdirSync('./src/events').filter(file => file.endsWith('.js'));
const commandFolders = fs.readdirSync('./src/commands');

(async () => {
	for (file of functions){
		await require(`./functions/${file}`)(client);
	}

	//load database
	await mongoose.connect(process.env.DB_CONNECTION, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	  }).then((m) => {
		console.log("🚚 Connected to Database.".red)
	  }).catch((err) => console.error(err));
	
	// client.database = db;
	// client.database.default({users: [], guilds: [], logs: [] }).save();

	await client.handleEvents(eventsFiles, './src/events');
	await client.handleCommands(commandFolders, './src/commands');

	// login
	await client.login(process.env.SECRET);

	//save the new uncached guilds into the database
	const allGuilds = await client.guilds.cache.values();
	for (const guild of allGuilds) {
		const getGuildDB = await guildSettings.findOne({ guildId: guild.id });
		if (!getGuildDB) {
			let guildOwner;
			await guild.fetchOwner().then(owner => guildOwner = owner.user);
			const guildOwnerTag = guildOwner.username + '#' + guildOwner.discriminator;

			await guildSettings.create({ 
				guildId: guild.id,
				guildName: guild.name,
				ownerId: guildOwner.id,
				ownerTag: guildOwnerTag,
			});

			console.log(`[${moment().format('MMMM Do YYYY, h:mm:ss a')}] 🌮 Added new guild to database: ${guild.name} (${guild.id})`.cyan);

		}
	}

	// check database for guilds that are not in the client.guilds cache
	const wholeDB = await guildSettings.find({});
	for (const guild of wholeDB) {
		const id = guild.guildId
		if (!client.guilds.cache.find(g => g.id == id)) {
			await guildSettings.findOneAndDelete({ guildId: guild.guildId }).then(() => {
				console.log(`[${moment().format('MMMM Do YYYY, h:mm:ss a')}] 🥪 Guild ${guild.guildId} no longer exists. Removing from database.`);
			});
		} else {
			console.log('SKIPPED 🤡');
		}
	}

	console.log(`🌹 ${wholeDB.length} guilds found in database`.red);

})();

// client.on('debug', console.log)
//       .on('warn', console.log)