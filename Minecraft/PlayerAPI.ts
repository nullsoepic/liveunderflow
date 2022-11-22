import axios from 'axios';

export class PlayerAPI {
    uuid: string;

    constructor(uuid: string) {
        this.uuid = uuid;
    }

    // Gets the player's head picture URL based on their UUID
    getHeadPictureURL() {
        return `https://mc-heads.net/avatar/${this.uuid}`;
    }

    // Gets the player's skin URL based on their username
    getHeadPictureURLByName(username: string) {
        return `https://mc-heads.net/avatar/${username}`;
    }
}
