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
    bot.on('system_chat', (data) => {
        const raw = JSON.parse(data.content);
        const { color, translate } = raw;
        const username = raw?.with ? raw?.with[0]?.insertion : undefined;
        const hoverEvent = raw?.with ? raw?.with[0]?.hoverEvent : undefined;
        const { id } = hoverEvent?.contents || {};
        const player = bot.playerManager.getPlayerByUUID(id);

        if (username === client.bot.username) return;
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

                client.sendEmbedMessage(
                    client.config.guild.channels.relay_channel,
                    username,
                    `${username} has joined the game.`,
                    player?.getHeadURL() ||
                        client.config.constants.defaultProfile,
                    '#00ff00'
                );
                break;
            case 'multiplayer.player.left':
                if (color !== 'yellow' || !translate || !raw.with) return;
                if (
                    client.config['in-game-bot'].muted.find(
                        (entry) => entry.name === raw?.with[0]?.text
                    )
                )
                    return;

                client.sendEmbedMessage(
                    client.config.guild.channels.relay_channel,
                    raw?.with[0]?.text,
                    `${raw?.with[0]?.text} has left the game.`,
                    player?.getHeadURL() ||
                        client.config.constants.defaultProfile,
                    '#9d3838'
                );
                break;
            case 'sleep.players_sleeping':
                if (!translate || !raw.with) return;
                client.sendEmbedMessage(
                    client.config.guild.channels.relay_channel,
                    `Sleeper count has changed!`,
                    `There are now ${raw.with.join('/')} players sleeping.`,
                    player?.getHeadURL() ||
                        client.config.constants.defaultProfile,
                    '#c2c5cc'
                );
                break;
        }
    });

    let messageQueue: string[] = [];
    let sending = false;
    // Detects when a player sends a message in discord channel
    client.on('messageCreate', (message) => {
        if (message.author.bot) return; // Ignore messages from bot
        if (message.channel.id !== client.config.guild.channels.relay_channel)
            // Ignore messages from other channels
            return;

        // Split long messages to prevent kick from mc server
        if (message.content.length > 255 - message.author.tag.length - 3) {
            // 3 is to account for the " > " in the sent message
            let originalMessage = message.content;
            let splitMessage: string[] = [];

            // Repeat while the message is too long (I use 250 to account for the index of the split message added to the beggining of the message)
            let j = 0;
            while (
                originalMessage.length >
                250 - message.author.tag.length - 3
            ) {
                // Find the space to split the message at
                let i = 250 - message.author.tag.length - 3;
                while (originalMessage[i] !== ' ' || i > 50) {
                    i--;
                }

                // If there was no space found, split close to the 255 character limit
                if (i <= 50 || originalMessage[i] !== ' ') {
                    splitMessage.push(
                        `[${j}] ` +
                            originalMessage.slice(
                                0,
                                250 - message.author.tag.length - 3
                            )
                    );
                    originalMessage = originalMessage.slice(
                        250 - message.author.tag.length - 3
                    );
                }
                // If there was a space found, split at the space
                else {
                    splitMessage.push(`[${j}] ` + originalMessage.slice(0, i));
                    originalMessage = originalMessage.slice(i + 1);
                }
                j++;
            }

            // Add the split messages to the queue
            messageQueue = messageQueue.concat(splitMessage);
        } else {
            // Add current message to queue
            messageQueue.push(message.content);
        }

        while (messageQueue.length > 0) {
            if (!sending) {
                bot.write('chat_message', {
                    message: message.author.tag + ' > ' + messageQueue[0],
                    timestamp: BigInt(Date.now()),
                    salt: 0,
                    signature: Buffer.alloc(0),
                    signedPreview: false,
                    previousMessages: [],
                    lastMessage: null
                }); // Send the message to minecraft chat

                messageQueue.shift();
                sending = true;
                setTimeout(() => (sending = false), 1000);
            }
        }
    });
}
