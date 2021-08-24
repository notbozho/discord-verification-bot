const config = require('../../../config');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('invite')
		.setDescription('Sends you an invite link for the bot.'),
	async execute(interaction, client) {
		let emb = new MessageEmbed()
			.setTitle(`Add ${config.general.botName} to your server.`)
			.addField('Invite Link', `[**\`CLICK HERE\`**](https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot%20applications.commands)`, true)
			.addField('Required Permissions', '[**`ADMINISTRATOR`**](https://discordapi.com/permissions.html#8)', true)
			.setFooter(config.embeds.embedFooterText)
			.setColor('AQUA');
		await interaction.reply({embeds: [emb]});
	}
};

/*

> Coded by Lorne#0211
> https://discord.gg/bUMcVASrJM
> https://twitter.com/Lorne_Booker
> https://github.com/lornebookerr

*/