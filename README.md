# Discord.JS v13 Handler Template
A slash command and event handler for the new discord.js V13 update. Includes some commands to get you started

## Installation
> Clone the repository, or you can create your own using the template function (on GitHub)
> 
> Install the dependencies with `npm i`
> 
> Remove the `.template` suffix from the *config.js* and *.env* files
> 
> Paste your bot token in the *.env* file
> 
> Add necessary info to the *config.js* file (find out more below)
> 
> Open a terminal in the root directory of the repo
> 
> Execute `npm run production`
> 

## Configuration
* `config.general.botName` - What the bot should be referenced to in commands
* `config.general.guildid` - The guild id that the bot will be used in
* `config.general.clientid` - The client id for the bot

* `config.settings.owners` - An array for the owner's user ids (required to run OWNER commands)

* `config.support.guildid` - The guild id for your support server (if needed), THE BOT MUST BE IN THIS SERVER AND HAVE ADMINISTRATOR
* `config.support.owner` - The main owner's id (for telling the user who to contact)

* `config.embeds.embedColour` - The default colour for an embed if none is specified
* `config.embeds.embedFooterText` - The default footer text for an embed

## Credits
This project is licensed by the **GNU General Public License**. You must give credit to [me](https://github.com/lornebookerr) when using this code.
