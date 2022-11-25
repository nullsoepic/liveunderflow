import Jimp, { read } from 'jimp';
import { MinecraftClient } from '../Utils/MinecraftClient';

export class Player {
    public name: string;
    public uuid: string;
    private image: Jimp;
    private client: MinecraftClient;

    constructor(name: string, uuid: string, client: MinecraftClient) {
        this.name = name;
        this.uuid = uuid;
        this.client = client;
    }

    getHeadURL() {
        return this.client.profileCache.get(this.uuid);
    }

    // Downloads the player's head picture and returns it
    async downloadImage() {
        if (this.image) return this.image; // If the image is already downloaded, return it
        const url = this.client.profileCache.get(this.uuid)
        this.image = await read(
            url ? url : `https://mc-heads.net/avatar/${this.uuid || this.name}`
        );
        return this.image;
    }
}
