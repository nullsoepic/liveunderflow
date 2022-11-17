import { Client, ClientOptions } from "minecraft-protocol";
import { PlayerManager } from "../Minecraft/PlayerManager";
import * as mc from 'minecraft-protocol';


export class DrippyBlockClient extends Client {
    playerManager?: PlayerManager;
}

export function createClient(options: ClientOptions)  {
    return mc.createClient(options) as DrippyBlockClient
}