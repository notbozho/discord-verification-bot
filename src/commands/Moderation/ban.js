const config = require('../../../config');
const search = require('discord.js-search');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, Permissions } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ban')
		.addUserOption(option => option.setName('user').setDescription('The user who you want to ban.').setRequired(true))
		.addStringOption(option => option.setName('reason').setDescription('The reason why you are banning the user'))
		.addIntegerOption(option => option.setName('days').setDescription('The amount of days you want to ban the user for'))
		.setDescription('Ban a mentioned user with a reason.'),
	async execute(interaction, client) {

		if (!interaction.member.permissions.has(Permissions.FLAGS.BAN_MEMBERS)) return interaction.reply('**❌ | You do not have the right permissions to ban this member.**');

		const user = interaction.options.getUser('user');
		let reason = interaction.options.getString('reason');
		let days = interaction.options.getInteger('days');
        
		if (!user) return interaction.reply('**❌ | You need to provide a valid member to ban.**');
		if (!reason) reason = 'No reason given.';
		if (!days) days = 0;

		let findMem = await search.searchMember(interaction, user.tag);
		if (!findMem.bannable) return interaction.reply('**❌ | I do not have the correct permissions to ban this member / this member is not ban-able.**');

		let emb = new MessageEmbed()
			.setTitle(`Ban ${user.tag}`)
			.addField('Server', `**\`${interaction.guild.name}\`**`, true)
			.addField('Moderator', `**\`${interaction.member.user.tag}\`**`, true)
			.addField('User', `**\`${user.tag}\`**`, true)
			.addField('Reason', `**\`${reason}\`**`, false)
			.setThumbnail(user.displayAvatarURL())
			.setTimestamp()
			.setFooter(config.embeds.embedFooterText)
			.setColor('RED');

		try {
			findMem.ban({days: days, reason: reason});
		} catch (e) {
			return interaction.reply('**❌ | I do not have the correct permissions to ban this member.**');
		}

		await interaction.reply({embeds: [emb]});
	}
};

/*

> Coded by Lorne#0211
> https://discord.gg/bUMcVASrJM
> https://twitter.com/Lorne_Booker
> https://github.com/lornebookerr

*/