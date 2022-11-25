import { EmbedBuilder } from 'discord.js';
import { DiscordClient } from '../Utils/DiscordClient';

export function handleChat(client: DiscordClient) {
    const { bot } = client;

    // Detects when a player sends a message in minecraft chat
    bot.on('player_chat', (data) => {
        let name = JSON.parse(data.networkName).text;
        name.length
            ? (name = name)
            : (name = JSON.parse(data.networkName)?.extra[2]?.text);
        if (name === bot.username) return; // Ignore messages from the bot
        if (
            client.config['in-game-bot'].muted.find(
                (entry) => entry.name === name
            )
        )
            return; // Ignore messages from muted players
        const player = bot.playerManager.getPlayerByUUID(data.senderUuid);
        client.sendWebHookMessage(
            data.plainMessage,
            player?.getHeadURL() || client.config.constants.defaultProfile,
            name
        ); // Send the message to discord
    });

    // Detects when there is a system message in minecraft chat
    //@ts-ignore
    bot.on('system_chat', async (data) => {
        const raw = JSON.parse(data.content);
        const { color, translate } = raw;
        const username = raw?.with ? raw?.with[0]?.insertion : undefined;
        const hoverEvent = raw?.with ? raw?.with[0]?.hoverEvent : undefined;
        const { id } = hoverEvent?.contents || {};
        const player = bot.playerManager.getPlayerByUUID(id);

        if(username === client.bot.username) return;
        if (
            client.config['in-game-bot'].muted.find(
                (entry) => entry.name === username
            )
        )
            return; // Ignore messages from muted players

        switch (
            translate // Checks what type of system message it is
        ) {
            case 'multiplayer.player.joined':
                if (color !== 'yellow' || !translate || !username || !id)
                    return;
                if(bot.playerManager.joinCache.has(id)) {
                    const entry = bot.playerManager.joinCache.get(id)
                    bot.playerManager.joinCache.set(id, {
                        count: (entry?.count || 1) + 1,
                        message: entry?.message
                    })
                    
                    const embed = new EmbedBuilder()
        
                    embed.setAuthor({
                        name: entry?.message?.embeds[0].author?.name || 'John Doe',
                        iconURL: entry?.message?.embeds[0].author?.iconURL
                    })
                    embed.setDescription(`${username} has joined the game. (${(entry?.count || 1) + 1})`)
                    embed.setColor('#00ff00')
        
                    return entry?.message?.edit({
                        embeds: [embed]
                    })
                };

                const message = await client.sendEmbedMessage(
                    client.config.guild.channels.relay_channel,
                    username,
                    `${username} has joined the game.`,
                    bot.profileCache.get(id) || client.config.constants.defaultProfile,
                    '#00ff00'
                );
                bot.playerManager.joinCache.set(id || '', {
                    count: 1,
                    message: message
                })
                break;

            case 'sleep.players_sleeping':
                if (!translate || !raw.with) return;
                client.sendEmbedMessage(
                    client.config.guild.channels.relay_channel,
                    `Sleeper count has changed!`,
                    `There are now ${raw.with.join('/')} players sleeping.`,
                    player?.getHeadURL() || client.config.constants.defaultProfile,
                    '#c2c5cc'
                );
                break;
        }
    });

    // Detects when a player sends a message in discord channel
    client.on('messageCreate', (message) => {
        if (message.author.bot) return; // Ignore messages from bot
        if (message.channel.id !== client.config.guild.channels.relay_channel) return; // Ignore messages from other channels
        if (message.content.startsWith(client.config['in-game-bot'].ignorePrefix)) return; // Filter out messages that begin with the defined ignorePrefix.
        
        bot.write('chat_message', {
            message: message.author.tag + ': ' + message.content,
            timestamp: BigInt(Date.now()),
            salt: 0,
            signature: Buffer.alloc(0),
            signedPreview: false,
            previousMessages: [],
            lastMessage: null
        }); // Send the message to minecraft chat
    });
}
