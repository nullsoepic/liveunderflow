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

    client.application?.commands.set(commandsArray)
    //guild.commands.set(commandsArray);

    return console.log(table.toString(), '\n 🟢 - Commands Loaded')
}