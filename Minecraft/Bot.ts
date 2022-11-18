import { createClient } from "../Utils/DrippyBlockClient";
import { DrippyClient } from "../Utils/DrippyClient";
import { HandleChat } from "./Chat";
import { PlayerManager } from "./PlayerManager";

export function HandleMinecraft(client: DrippyClient) {
    if(!client.config["in-game-bot"].enabled) return;
    client.bot = createClient({
        host: client.config.ips.n00b,
        port: 25565,
        username: 'sysctl',
        profilesFolder: __dirname + '\\auth',
        auth: 'microsoft',
        disableChatSigning: true,
    })

    client.bot.playerManager = new PlayerManager(client.bot);

    client.bot.on('disconnect', (packet) => {
        console.log('Disconnected from server : ' + packet.reason)
        ReconnectToServer(client);
    })
      
    client.bot.on('end', () => {
        console.log('Connection lost')
        ReconnectToServer(client);
    })
      
    client.bot.on('error', (err) => {
        if(err.message.includes('play.toClient')) return;
        console.log('Error occurred')
        console.log(err)
    })
    
    client.bot.on('connect', () => {
        console.log(`Connected to Server...`)
        HandleChat(client);
    })
}

function ReconnectToServer(client: DrippyClient) {
    console.log('Reconnecting in 3 seconds...')
    setTimeout(() => {
        console.log('Attempting to connect...')
        client.bot = createClient(client.bot.options)
    }, 1000 * 3)
}