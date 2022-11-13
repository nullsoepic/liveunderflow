async function loadCommands(client) {
    const { loadFiles } = require('../Functions/fileLoader');
    const ascii = require('ascii-table');
    const table = new ascii().setHeading('Commands', 'Status');

    await client.commands.clear()

    let commandsArray = [];

    const Files = await loadFiles('Commands');
    Files.forEach((file) => {
	try {
	    const command = require(file);
	    client.commands.set(command.data.name, command);

            commandsArray.push(command.data.toJSON());

            table.addRow(command.data.name, "🟢")
	} catch (e) {console.log(e)}
    })

    let guild = client.guilds.cache.get(client.config.guild.id);
    client.application.commands.set(commandsArray)
    //guild.commands.set(commandsArray);

    return console.log(table.toString(), '\n 🟢 - Commands Loaded')
}

module.exports = {
    loadCommands
}
