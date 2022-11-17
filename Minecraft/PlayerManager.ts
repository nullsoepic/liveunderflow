import { DrippyClient } from "../Utils/DrippyClient";

export class PlayerManager {
    public packetName: string;
    private client: DrippyClient;

    constructor(client: DrippyClient) {
        this.packetName = "player_info"
        this.client = client;
    }

    async execute(data: any) {
        console.log(data);
    }
}