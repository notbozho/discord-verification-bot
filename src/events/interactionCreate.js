const { MessageEmbed } = require('discord.js');
const config = require('../../config');

module.exports = {
	name: 'interactionCreate',
	async execute(interaction, client) {
		if(!interaction.channel == null) {
			console.log(`${interaction.user.tag} in #${interaction.channel.name} triggered an interaction`.blue);
		} else {
			console.log(`${interaction.user.tag} triggered an interaction in DMs`.blue);
		}
		if (!interaction.isCommand()) return;

		const command = client.commands.get(interaction.commandName);
		if (!command) return;

		const embed = new MessageEmbed()
			.setTitle('➣ I can\'t send direct messages to you.')
			.setDescription('Please follow the tutorial **above** 👆, open your direct messages and then try again')
			.setColor('RED')
			.setTimestamp()
			.setFooter(config.embeds.embedFooterText)


		try {
			await command.execute(interaction, interaction.client);
		} catch (error) {
			console.log(`${error}`);
			if(error == `DiscordAPIError: Cannot send messages to this user`) {
				await interaction.reply({embeds: [embed], files: ['./dms_tutorial.gif']});
			} else {
				await interaction.reply(
					{
						content: 'There was an error executing this command. Please contact \`! bozho#4881\`',
						ephmeral: true
					}
				);
			}
		}
	}
};