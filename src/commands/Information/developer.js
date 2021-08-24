const config = require('../../../config');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('developer')
		.setDescription('Sends some information on the developer of this template.'),
	async execute(interaction, client) {
		const row = new MessageActionRow().addComponents(new MessageButton().setURL('https://twitter.com/Lorne_Booker').setStyle('LINK').setLabel('Twitter'), new MessageButton().setURL('https://github.com/lornebookerr/discordjs-v13-handler-template').setStyle('LINK').setLabel('Command Handler Template'), new MessageButton().setURL('https://github.com/lornebookerr').setStyle('LINK').setLabel('GitHub'));

		let emb = new MessageEmbed()
			.setTitle('Lorne Booker')
			.setDescription('Hi, I\'m Lorne!\nI am a Python and Javascript developer who coded the template for this bot. You can visit me with the links below.')
			.setFooter(config.embeds.embedFooterText)
			.setColor('BLUE');
		await interaction.reply({embeds: [emb], components: [row]});
	}
};

/*

> Coded by Lorne#0211
> https://discord.gg/bUMcVASrJM
> https://twitter.com/Lorne_Booker
> https://github.com/lornebookerr

*/