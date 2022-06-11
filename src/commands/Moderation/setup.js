const config = require('../../../config');
const wait = require('util').promisify(setTimeout);
const guildSettings = require('../../schemas/guildSettings');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton, Permissions } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('setup')
		.addChannelOption(option => option.setName('channel').setDescription('The channel you want people to send the /verify command').setRequired(true))
		.addRoleOption(option => option.setName('role').setDescription('The role you want people to have when they verify').setRequired(true))
		// .addBooleanOption(option => option.setName('removerole').setDescription(`Whether or not to remove the old role from the user when they verify`).setRequired(true))
		.setDescription('Configure your guild\'s verification system'),
	async execute(interaction, client) {
		if (!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) return interaction.reply('**❌ | You do not have the right permissions to use this command.**');

		const rolePosition = new MessageEmbed()
			.setTitle('➣ Role\'s position is higher than my role position.')
			.setDescription('You can fix this by going to **Server settings > Roles** and __moving__ my role higher than your selected role. Tutorial **above** 👆\n\n\n *After that you can try again*')
			.setFooter(config.embeds.embedFooterText)
			.setTimestamp()
			.setColor('RED');

		let role = interaction.options.getRole('role');
		// console.log(role.permissions);
		if (role.name == '@everyone') return await interaction.reply('❌ ➣ The role you specified __can not__ be `@everyone`');
		if (!role.editable) return await interaction.reply({embeds: [rolePosition], files: ['./role_tutorial.gif']});
		if (role.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) return await interaction.reply('**❌ ➣ The role you specified __can not__ have **ADMINISTRATOR** permissions');
		let channel = interaction.options.getChannel('channel');
		if(channel.type !== 'GUILD_TEXT') return await interaction.reply('❌ ➣ The channel you specified __is not__ a text channel.**');

		// let removeRole = interaction.options.getBoolean('removerole');

		let embed = new MessageEmbed()
			.setTitle('➣ Are you sure ?')
			.setDescription('__Make sure__ that you selected the **correct channel and role** for verification.')
			.setFields([{name: 'CHANNEL', value: `<#${channel.id}>`, inline: true}, {name: 'ROLE', value: `<@&${role.id}>`, inline: true}])
			.setFooter(config.embeds.embedFooterText)
			.setTimestamp()
			.setColor('ORANGE');

		const row = new MessageActionRow()
		 .addComponents(
			 new MessageButton()
				.setCustomId('confirmSetupBtn')
				.setEmoji('🍄')
				.setLabel('100% Sure')
				.setStyle('SUCCESS'),
			new MessageButton()
				.setCustomId('declineSetupBtn')
				.setEmoji('😫')
				.setLabel('Nope! Let me try again')
				.setStyle('DANGER')
		 )

		
		const msg = await interaction.reply({embeds: [embed], components: [row], fetchReply: true});

		const collector = msg.createMessageComponentCollector({ componentType: 'BUTTON', time: 60000 });

		collector.on('collect', async i => {
			await i.deferUpdate();

			if (i.component.customId === 'confirmSetupBtn') {
				await channel.permissionOverwrites.create(role, { VIEW_CHANNEL: false, SEND_MESSAGES: false, ADD_REACTIONS: false });
				await guildSettings.findOneAndUpdate({guildId: interaction.guild.id}, { verificationChannelId: channel.id, verificationRoleId: role.id})
						.then(async () => {
							console.log(`✨ ${interaction.guild.name}(${interaction.guild.id}) setuped their verification system successfully`)
						
							await interaction.editReply({embeds: [new MessageEmbed()
								.setTitle('➣ Done !')
								.setDescription('Verification system is setup-ed successfully\n\n **⚠ WARNING:**  *If you delete the channel or the role \nyou must do the setup again !*\n** **\n**TIP:**  *If you change your mind you can do /setup again.*\n** **\n ** **')
								.setFields([{name: 'CHANNEL', value: `<#${channel.id}>`, inline: true}, {name: 'ROLE', value: `<@&${role.id}>`, inline: true}
								// ,{name: 'REMOVE OLD ROLE', value: removeRole ? '✅' : '❌', inline: true}
							])
								.setFooter(config.embeds.embedFooterText)
								.setTimestamp()
								.setColor('GREEN')], components: []});
						})

			} else if (i.component.customId === 'declineSetupBtn') {
				await interaction.editReply({embeds: [new MessageEmbed()
					.setTitle('➣ Cancelling setup')
					.setDescription('If you wish, you can try again :)')
					.setFooter(config.embeds.embedFooterText)
					.setTimestamp()
					.setColor('RED')], components: []});
				await wait(8000);
				await interaction.deleteReply();
			}

		})
	}
};