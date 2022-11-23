import { read } from 'jimp';

export class Player {
    public name: string;
    public uuid: string;
    private image: any;

    constructor(name: string, uuid: string) {
        this.name = name;
        this.uuid = uuid;
    }

    getHeadURL() {
        return `https://mc-heads.net/avatar/${this.uuid || this.name}`;
    }

    // Downloads the player's head picture and returns it
    async downloadImage() {
        if (this.image) return this.image; // If the image is already downloaded, return it
        this.image = await read(
            `https://mc-heads.net/avatar/${this.uuid || this.name}`
        );
        return this.image;
    }
}
