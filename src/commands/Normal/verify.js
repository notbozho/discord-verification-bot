const config = require('../../../config');
const guildSettings = require('../../schemas/guildSettings');

const wait = require('util').promisify(setTimeout);

//lodash stuff
const sample = require('lodash.sample');
const findIndex = require('lodash.findindex');
const sampleSize = require('lodash.samplesize');

//discord stuff
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageSelectMenu, MessageButton } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('verify')
		.setDescription('Sends a verification challenge to the user\'s DMs'),
	async execute(interaction, client) {
		let { user, guild } = interaction;

        const settings = await guildSettings.findOne({ guildId: guild.id });
        const roleId = settings.verificationRoleId;
        // console.log(roleId + " role id");

        const wrongChannelEmbed = new MessageEmbed()
            .setTitle('➣ Wrong channel')
            .setDescription(`You can **only** use this command in <#${settings.verificationChannelId}>`)
            .setColor('RED')
            .setTimestamp()
			.setFooter(config.embeds.embedFooterText);

        const alreadyVerifiedEmbed = new MessageEmbed()
            .setTitle('➣ Already verified')
            .setDescription(`You have already verified your account.`)
            .setColor('RED')
            .setTimestamp()
            .setFooter(config.embeds.embedFooterText);

        const setupMissingEmbed = new MessageEmbed()
            .setTitle('➣ Missing setup')
            .setDescription(`Please tell staff member to setup the verification system`)
            .setColor('RED')
            .setTimestamp()
            .setFooter(config.embeds.embedFooterText);


        if(settings.verificationChannelId == 0) {
            return await interaction.reply({embeds: [setupMissingEmbed]});
        }

        //TO-DO: if channel not the verify channel, send error message
        if(interaction.channel.id != settings.verificationChannelId) {
            return await interaction.reply({embeds: [wrongChannelEmbed]}).then(async () => {
                await wait(8000);
                await interaction.deleteReply(); 
            });
        }
        //TO-DO: if user is already verified, send error message
        let verif_role = guild.roles.cache.get(roleId);
        if(interaction.member.roles.cache.has(verif_role.id)) {
            return await interaction.reply({embeds: [alreadyVerifiedEmbed]}).then(async () => {
                await wait(8000);
                await interaction.deleteReply();
            });
        }

        //TO-DO: if user is already in a verification process, send error message


        let verificationGuild = guild.name;
        let verificationChannel = interaction.channel.name;
        
		let emb = new MessageEmbed()
			.setTitle(`➣ ${user.tag}`)
            .setDescription('Verification challenge sent to your DMs.')
			.setThumbnail(user.displayAvatarURL())
			.setTimestamp()
			.setFooter(config.embeds.embedFooterText)
			.setColor('GREEN');

        // 🍌 🍏 🍯 🍉 🍒 🍓 🍑 🍐 🍋 🍍 🍆 🥕 🥒 🍊 🥑 🍅 🍄 🍣 🍦 🍔 🍕 🍩 🌮 🍭 🍇 🌽 🥝 🥪 🥞 🧀 🤡

        const possibleOptions = 
        [
            {
                label: '🍌',
                value: 'banana'
            },
            {
                label: '🍏',
                value: 'apple'
            },
            {
                label: '🍯',
                value: 'honey'
            },
            {
                label: '🍉',
                value: 'watermelon'
            },
            {
                label: '🍒',
                value: 'cherry'
            },
            {
                label: '🍓',
                value: 'strawberry'
            },
            {
                label: '🍑',
                value: 'peach'
            },
            {
                label: '🍐',
                value: 'pear'
            },
            {
                label: '🍋',
                value: 'lemon'
            },
            {
                label: '🍍',
                value: 'pineapple'
            },
            {
                label: '🍆',
                value: 'eggplant'
            },
            {
                label: '🥕',
                value: 'carrot'
            },
            {
                label: '🥒',
                value: 'cucumber'
            },
            {
                label: '🍊',
                value: 'orange'
            },
            {
                label: '🥑',
                value: 'avocado'
            },
            {
                label: '🍅',
                value: 'tomato'
            },
            {
                label: '🍄',
                value: 'mushroom'
            },
            {
                label: '🍣',
                value: 'sushi'
            },
            {
                label: '🍦',
                value: 'icecream'
            },
            {
                label: '🍔',
                value: 'hamburger'
            },
            {
                label: '🍕',
                value: 'pizza'
            },
            {
                label: '🍩',
                value: 'donut'
            },
            {
                label: '🌮',
                value: 'taco'
            },
            {
                label: '🍭',
                value: 'lollipop'
            },
            {
                label: '🍇',
                value: 'grape'
            },
            {
                label: '🌽',
                value: 'corn'
            },
            {
                label: '🥝',
                value: 'kiwi'
            },
            {
                label: '🥪',
                value: 'sandwich'
            },
            {
                label: '🥞',
                value: 'pancakes'
            },
            {
                label: '🧀',
                value: 'cheese'
            }];

        // console.log(possibleOptions.length);

        const options = sampleSize(possibleOptions, 5);
        const correctOne = sample(options);

        let challenge_embed = new MessageEmbed()
            .setTitle('➣ Verification challenge 🔒')
            .setDescription(`Please pick the **${correctOne.value}** emoji in the dropdown menu to gain access in ${verificationGuild}\n\n*You have **2 minutes***`)
            .setTimestamp()
            .setFooter(config.embeds.embedFooterText)
            .setColor('RED');

        let channel = await user.createDM()
            
        // TO-DO: Make a tutorial gif how to allow dms  

        const row = new MessageActionRow()
			.addComponents( 
                new MessageSelectMenu()
                    .setCustomId('select')
                    .setPlaceholder('Select the correct emoji')
                    .addOptions(options)
            );

        const msg = await channel.send({embeds: [challenge_embed], components: [row]});

        const filter = i => {
            i.deferUpdate();
            return i.user.id === interaction.user.id;
        };

        const menuCollector = await msg.createMessageComponentCollector({ componentType: 'SELECT_MENU', time: 120000 })
    
        let didUserSelect = false;

        menuCollector.on('collect', async inte => {
            console.log(inte.values[0] + ' o/');
            inte.deferUpdate();

            didUserSelect = true;

            if(inte.values[0] == correctOne.value) {
                challenge_embed.setDescription(`You have been **verified** and have been granted access in **${verificationGuild}**.`)
                challenge_embed.setColor('GREEN');

                //give user verified role in guild
                const role = await guild.roles.cache.get(roleId);
                await interaction.member.roles.add(role);

                await msg.edit({embeds: [challenge_embed], components: []});

                
            } else {
                challenge_embed.setTitle('➣ Verification challenge failed 🤦‍♂️')

                const interactionValueIndex = findIndex(options, (o) => o.value === inte.values[0]);
                challenge_embed.setDescription(`\n** **\nYou picked **${inte.values[0]} ${options[interactionValueIndex].label}** instead of **${correctOne.value} ${correctOne.label}** !` +
                 `\n\n • Please try again by going back to **#${verificationChannel}** in ${verificationGuild} and typing \`/verify\``);
                //  \n\n**TIP**: *You can try 2 more times until \`21:34:09\`.*`
                challenge_embed.setColor('DARK_RED');
                return await msg.edit({embeds: [challenge_embed], components: []});
            }
        });

        menuCollector.on('end', collected => {
            if(!didUserSelect) {
                challenge_embed.setTitle(`➣ Verification timed out ⏰`)
                challenge_embed.setDescription(`You didn't select any emojis in time !`)
                challenge_embed.setColor('DARK_BUT_NOT_BLACK');
                msg.edit({embeds: [challenge_embed], components: []});
            }
        });
        

        // console.log(options);
        // console.log(correctOne);

		return await interaction.reply({embeds: [emb]});
	}
};