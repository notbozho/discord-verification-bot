const config = require('../../../config');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('github')
		.setDescription('Sends the template maker\'s GitHub account.'),
	async execute(interaction, client) {
		const row = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setStyle('LINK')
					.setLabel('GitHub')
					.setURL('https://github.com/lornebookerr'),
				new MessageButton()
					.setStyle('LINK')
					.setLabel('Command Handler Template')
					.setURL('https://github.com/lornebookerr/discordjs-v13-handler-template')
			);

		let emb = new MessageEmbed()
			.setTitle('GitHub')
			.setDescription('Here are some links for my GitHub / some projects that I work on.')
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