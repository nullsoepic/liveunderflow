import axios from 'axios';

export class PlayerAPI {
    uuid: string;

    constructor(uuid: string) {
        this.uuid = uuid;
    }

    getHeadPictureURL() {
        return `https://mc-heads.net/avatar/${this.uuid}`;
    }
}