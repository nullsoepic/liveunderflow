import { createClient } from "../Utils/DrippyBlockClient";
import { DrippyClient } from "../Utils/DrippyClient";
import { HandleChat } from "./Chat";
import { PlayerManager } from "./PlayerManager";

export function HandleMinecraft(client: DrippyClient) {
    client.bot = createClient({
        host: client.config.ips.main,
        port: 25565,
        username: 'sysctl',
        profilesFolder: __dirname + '\\auth',
        auth: 'microsoft'
    })

    client.bot.on('disconnect', (packet) => {
        console.log('Disconnected from server : ' + packet.reason)
    })
      
    client.bot.on('end', () => {
        console.log('Connection lost')
        process.exit()
    })
      
    client.bot.on('error',  (err) => {
        console.log('Error occurred')
        console.log(err)
        process.exit(1)
    })
    
    client.bot.on('connect', () => {
        console.log(`Connected to Server...`)
        HandleChat(client);
    })
}