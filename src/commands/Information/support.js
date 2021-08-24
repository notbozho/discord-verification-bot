const config = require('../../../config');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('support')
		.setDescription('Get an invite link to the support server.'),
	async execute(interaction, client) {
		if (!config.support.guildid) {
			return interaction.reply(`**❌ | I have not been given a guild for support, please contact the owner.**\n> **Owner:** <@${config.support.owner}>`);
		}
		var server = client.guilds.cache.get(config.support.guildid);

		if (!server) return interaction.reply('**❌ | I am not able to find the server, remember I need to be in the support server to invite people.**');
		var channel = server.channels.cache.filter(chx => chx.type === 'GUILD_TEXT').find(x => x.position === 0);
		let invite = await channel.createInvite({ maxAge: 10 * 60 * 1000, maxUses: 1}, `Requested with command by ${interaction.member.user.tag}`).catch(console.log);

		let emb = new MessageEmbed()
			.setTitle(`Join the ${server.name} server`)
			.setDescription(`Use this invite [**\`LINK\`**](${invite.url})!`)
			.setTimestamp()
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