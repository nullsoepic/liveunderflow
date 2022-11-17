import { DrippyClient } from "../Utils/DrippyClient"
import { PlayerAPI } from "./PlayerAPI";

export function HandleChat(client: DrippyClient) {
    const { bot } = client;
    bot.on('system_chat', (data) => {
        const raw = JSON.parse(data.content)
        const { color, translate } = raw;
        const username = raw?.with ? raw?.with[0]?.insertion : undefined
        const hoverEvent = raw?.with ? raw?.with[0]?.hoverEvent : undefined
        const { id } = hoverEvent?.contents || { };
        const player = new PlayerAPI(id)
        
        if(color !== 'yellow' || !translate || !username || !id) return;

        switch(translate) {
            case 'multiplayer.player.joined':
                client.sendEmbedMessage(client.config.guild.channels.chat_relay, username, `${username} has joined the game.`, player.getHeadPictureURL(), '#00ff00')
                break;
            case 'multiplayer.player.left':
                client.sendEmbedMessage(client.config.guild.channels.chat_relay, username, `${username} has left the game.`, player.getHeadPictureURL(), '#9d3838')
                break;
        }
    })

    bot.on('chat', console.log)
}
