import { loadFiles } from "../Functions/fileLoader";
import { DrippyClient } from "../Utils/DrippyClient";

export async function loadCommands(client: DrippyClient) {
    const ascii = require('ascii-table');
    const table = new ascii().setHeading('Commands', 'Status');

    await client.commands.clear()

    const commandsArray: any[] = [];

    const Files = await loadFiles('Commands');
    Files.forEach((file) => {
	    try {
	        const command = require(file);
	        client.commands.set(command.data.name, command);

            commandsArray.push(command.data.toJSON());

            table.addRow(command.data.name, "🟢")
	    } catch (error) {
            console.error(error)
        }
    })
    
    // ~ Un-comment this for global commands
    // ! Make sure to comment out the guild commands code
    // This bot is not intended to be used with global commands
    // Enabling global commands WILL cause issues
    //client.application?.commands.set(commandsArray)
    
    const guild = await client.guilds.cache.find(g => g.id === client.config.guild.id)
    guild?.commands.set(commandsArray);

    return console.log(table.toString(), '\n 🟢 - Commands Loaded')
}