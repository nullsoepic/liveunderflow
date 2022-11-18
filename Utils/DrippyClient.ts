import { Client, Collection, ColorResolvable, EmbedBuilder, SlashCommandBuilder, TextChannel, WebhookClient } from "discord.js";
import { Config } from "./Config";
import { DrippyBlockClient } from "./DrippyBlockClient";

// Vibe added made custom properties on the Client which works well... Until I transfered this project to typescript and now no types so this should fix it.
export class DrippyClient extends Client {
    config: Config;
    events: Collection<string, (...args) => Function>;
    commands: Collection<string, Command>;
    cooldowns: string[];
    bot: DrippyBlockClient;
    webhook: WebhookClient;

    sendWebHookMessage(message: string, picture: string = "https://yt3.ggpht.com/ytc/AMLnZu8gDqmPezdXMDI1k183oQeknA_V4ZDb6FQPo39PVg=s88-c-k-c0x00ffffff-no-rj", username?: string) {
        this.webhook.send({
            content: message,
            avatarURL: picture,
            username: username,
            allowedMentions: { parse: [] }
        })
    }

    sendEmbedMessage(location: string, title: string, description: string, picture: string, color: ColorResolvable) {
        picture = picture || "https://yt3.ggpht.com/ytc/AMLnZu8gDqmPezdXMDI1k183oQeknA_V4ZDb6FQPo39PVg=s88-c-k-c0x00ffffff-no-rj"

        const channel = this.getTextChannel(location)
        const embed = new EmbedBuilder({
            author: {
                name: title,
                icon_url: picture
            },
            description: description,
        })

        embed.setColor(color)
        
        channel.send({
            embeds: [ embed ]
        })
    }

    getTextChannel(id: string) {
        return this.channels.cache.find(c => c.id === id) as TextChannel;
    }
}

type Command = {
    developer?: boolean,
    data: SlashCommandBuilder
    execute: (...args) => Function
}

type Event = {

}