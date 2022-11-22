import { Client, ClientOptions } from 'minecraft-protocol';
import { PlayerManager } from '../Minecraft/PlayerManager';
import * as mc from 'minecraft-protocol';

export class DrippyBlockClient extends Client {
    playerManager: PlayerManager;
    options: ClientOptions;
}

// Creates a new client
export function createClient(options: ClientOptions) {
    const bot = mc.createClient(options) as DrippyBlockClient;
    bot.options = options;
    return bot;
}
