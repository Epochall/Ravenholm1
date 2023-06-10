module.exports = async interaction => {
  	if (!interaction.isChatInputCommand()) return;
	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'Komut yazdırılırken bir hata oluştu!', ephemeral: true });
	}
}
module.exports.config = {
    name: "interactionCreate"
}