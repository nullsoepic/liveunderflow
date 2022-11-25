import { Client, ClientOptions } from 'minecraft-protocol';
import { PlayerManager } from '../Minecraft/PlayerManager';
import * as mc from 'minecraft-protocol';
import { ProfileCache } from '../Minecraft/ProfileCache';

export class MinecraftClient extends Client {
    playerManager: PlayerManager;
    profileCache: ProfileCache;
    options: ClientOptions;
}

// Creates a new client
export function createClient(options: ClientOptions) {
    const bot = mc.createClient(options) as MinecraftClient;
    bot.options = options;
    return bot;
}
