import { loadFiles } from "../Functions/fileLoader";
import { DrippyClient } from "../Utils/DrippyClient";

export async function loadEvents(client: DrippyClient) {
  const ascii = require("ascii-table");
  const table = new ascii().setHeading("Events", "Status");

  await client.events.clear();

  const Files = await loadFiles("Events");

  Files.forEach((file) => {
    const event = require(file);

    const execute = (...args) => event.execute(...args, client);
    client.events.set(event.name, execute);    

    if (event.rest && event.once) client.rest.once(event.name, execute);
    else if (event.rest) client.rest.on(event.name, execute);
    else if (event.once) client.once(event.name, execute);
    else client.on(event.name, execute);

    table.addRow(event.name, "🟢");
  })
  
  return console.log(table.toString(), "\n 🟢 Events Loaded");
}