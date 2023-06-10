const { Routes } = require('discord.js');
const { REST } = require('@discordjs/rest')
const fs = require('fs')
const commands = []
const commandFiles = fs.readdirSync('./slashcommands').filter(file => file.endsWith('.js'))

for (const file of commandFiles) {
	const command = require(`../slashcommands/${file}`);
	commands.push(command.data.toJSON());
}

const rest = new REST({ version: '10' }).setToken("MTExNzE0ODcwNTUxMDkyNDMzOQ.GEja1Q.iWCK4WuCq8v-4XZXOUBLT0BkgHs4fZKOI2g48c");

(async () => {
  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(Routes.applicationCommands("1048879773398614056"), { body: commands });

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
})();
