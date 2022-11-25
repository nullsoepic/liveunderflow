import Jimp, { MIME_PNG } from "jimp";
import { DiscordClient } from "../Utils/DiscordClient";
import { AttachmentBuilder } from 'discord.js';

export async function uploadImage(image: Jimp, client: DiscordClient) {
    const buffer = await image.getBufferAsync(MIME_PNG);
    const attachment = new AttachmentBuilder(buffer, { name: 'image.png' });
    return client.sendAttachments(client.config.guild.channels.cache_channel, [ attachment ]);
}