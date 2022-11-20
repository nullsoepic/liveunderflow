import { read } from 'jimp';

export class Player {
    public name: string;
    public uuid: string;
    private image: any;

    constructor(name: string, uuid: string) {
        this.name = name;
        this.uuid = uuid
    }

    async downloadImage() {
        if(this.image) return this.image;
        this.image = await read(`https://mc-heads.net/avatar/${this.uuid || this.name}`);
        return this.image;
    }
}