const config = require('../../../config');

//discord stuff
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Provides the helpful information'),
	async execute(interaction, client) {

        const helpEmbed = new MessageEmbed()
            .setTitle('➣ Help')
            .setDescription(`**Emoji Verification Bot** is quite simple to use but yet effective.\n\n**COMMANDS:**` +
             `\n/setup *(tag channel)* *(mention role)* *[requires* \`MANAGE_GUILD\` *permissions] - configure your guild\'s verification system*\n` +
             `\n/verify - can only be used if unverified (@everyone role) and only in the right channel provided by Staff in /setup\n\n\n**REMINDER:** *If the channel or the role is deleted the setup is cleared and you need to configure the bot again using /setup*`)
            .addFields(
                {name: '🔌 Support server', value: `https://support.bozho.codes`},
                {name: '🔗 Invite link', value: 'https://ev.bozho.codes'})
            .setColor('#763b4f')
            .setTimestamp()
            .setFooter(config.embeds.embedFooterText);

		await interaction.reply({embeds: [helpEmbed]});
	}
};