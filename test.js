const config = require('../../../config');
const guildSettings = require('../../schemas/guildSettings');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('test')
		.setDescription('Sends some information on the developer of this template.'),
	async execute(interaction, client) {
		const { guild } = interaction;
		const updateDb = await guildSettings.findOneAndUpdate({ guildID: guild.id }, { verificationChannelId: 0, verificationRoleId: 0 });

		await interaction.reply('alo');
	}
};