import { DrippyClient } from "../Utils/DrippyClient"
import { PlayerAPI } from "./PlayerAPI";

export function HandleChat(client: DrippyClient) {
    const { bot } = client;

    bot.on('player_chat', (data) => {
        let name = JSON.parse(data.networkName).text
        name.length ? name = name : name = JSON.parse(data.networkName)?.extra[2]?.text;
        if(name === bot.username) return;
        
        const player = new PlayerAPI(data.senderUuid)
        client.sendWebHookMessage(data.plainMessage, player.getHeadPictureURL(), name)
    })

    bot.on('system_chat', (data) => {
        const raw = JSON.parse(data.content)
        const { color, translate } = raw;
        const username = raw?.with ? raw?.with[0]?.insertion : undefined
        const hoverEvent = raw?.with ? raw?.with[0]?.hoverEvent : undefined
        const { id } = hoverEvent?.contents || { };
        const player = new PlayerAPI(id)

        switch(translate) {
            case 'multiplayer.player.joined':
                if(color !== 'yellow' || !translate || !username || !id) return;
                client.sendEmbedMessage(client.config.guild.channels.chat_relay, username, `${username} has joined the game.`, player.getHeadPictureURL(), '#00ff00');
                break;
            case 'multiplayer.player.left':
                if(color !== 'yellow' || !translate || !raw.with) return;
                client.sendEmbedMessage(client.config.guild.channels.chat_relay, raw?.with[0]?.text, `${raw?.with[0]?.text} has left the game.`, player.getHeadPictureURLByName(raw?.with[0]?.text), '#9d3838');
                break;
            case 'sleep.players_sleeping':
                if(!translate || !raw.with) return;
                client.sendEmbedMessage(client.config.guild.channels.chat_relay, `Sleeper count has changed!`, `There are now ${raw.with.join('/')} players sleeping.`, 'https://yt3.ggpht.com/ytc/AMLnZu8gDqmPezdXMDI1k183oQeknA_V4ZDb6FQPo39PVg=s88-c-k-c0x00ffffff-no-rj', '#c2c5cc');
                break;
        }
    })

    client.on('messageCreate', (message) => {
        if(message.author.bot) return;
        if(message.channel.id !== client.config.guild.channels.chat_relay) return;

        bot.write('chat_message', {
            message: message.author.tag + ' > ' + message.content,
            timestamp: BigInt(Date.now()),
            salt: 0,
            signature: Buffer.alloc(0),
            signedPreview: false,
            previousMessages: [],
            lastMessage: null
        })
    })
}
