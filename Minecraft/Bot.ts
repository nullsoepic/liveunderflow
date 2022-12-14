import { createClient } from '../Utils/MinecraftClient';
import { DiscordClient } from '../Utils/DiscordClient';
import { handleChat } from './Chat';
import { PlayerManager } from './PlayerManager';
import { ProfileCache } from './ProfileCache';

export function handleMinecraft(client: DiscordClient) {
    if (!client.config['in-game-bot'].enabled) return; // Returns if there is no bot config
    client.bot = createClient({
        host: client.config.ips.n00b,
        port: 25565,
        username: 'sysctl',
        profilesFolder: __dirname + '\\auth',
        auth: 'microsoft',
        disableChatSigning: true
    }); // Creates the bot

    client.bot.profileCache = new ProfileCache(client);
    client.bot.playerManager = new PlayerManager(client);

    client.bot.on('disconnect', (packet) => {
        console.log('Disconnected from server : ' + packet.reason);
        reconnectToServer(client);
    }); // Sends log message when the bot disconnects from the server and reconnects it

    client.bot.on('end', () => {
        console.log('Connection lost');
        reconnectToServer(client);
    }); // Sends log message when the bot loses connection to the server and reconnects it

    client.bot.on('error', (err) => {
        if (err.message.includes('play.toClient')) return;
        console.log('Error occurred');
        console.log(err);
    }); // Sends log message when the bot encounters an error

    client.bot.on('connect', () => {
        console.log(`Connected to Server...`);
        handleChat(client);
    }); // Sends log message when the bot connects to the server
}

// Waits a minute and tries to reconnect to the server
function reconnectToServer(client: DiscordClient) {
    console.log('Reconnecting in 60 seconds...');
    setTimeout(() => {
        console.log('Attempting to connect...');
        handleMinecraft(client);
    }, 1000 * 60);
}