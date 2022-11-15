import { Client, Collection, SlashCommandBuilder } from "discord.js";
import { Config } from "./Config";
// Vibe added made custom properties on the Client which works well... Until I transfered this project to typescript and now no types so this should fix it.

export class DrippyClient extends Client {
    config: Config;
    events: Collection<string, (...args) => Function>;
    commands: Collection<string, Command>;
    cooldowns: string[];
}

type Command = {
    developer?: boolean,
    data: SlashCommandBuilder
    execute: (...args) => Function
}

type Event = {

}