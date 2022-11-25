import { DiscordClient } from "../Utils/DiscordClient";
import fs from 'fs';

export class ProfileCache {
    client: DiscordClient;
    collection: Map<string, string>;

    constructor(client: DiscordClient) {
        this.client = client;
        this.collection = new Map();
        this.loadCache()
    }

    has(key: string) {
        return this.collection.has(key);
    }

    get(key: string) {
        return this.collection.get(key);
    }

    set(key: string, value: string) {
        this.collection.set(key, value);
        this.writeCache();
        return this;
    }

    delete(key: string) {
        this.collection.delete(key);
        this.writeCache();
        return this;
    }

    private loadCache() {
        const exists = fs.existsSync(__dirname + '/cache/' + 'cache.json');
        if(!exists) return this.generateCache();
        const data: Object = JSON.parse(fs.readFileSync(__dirname + '/cache/' +  'cache.json', { encoding: 'utf8' }));
        const keys = Object.keys(data);
        keys?.forEach((key) => {
            this.collection.set(key, data[key])
            this.writeCache()
        })
    }

    private generateCache() {
        fs.writeFileSync(__dirname + '/cache/' + 'cache.json', '{}', { encoding: "utf-8" });
    }

    private writeCache() {
        fs.writeFileSync(__dirname + '/cache/' + 'cache.json', JSON.stringify(Object.fromEntries(this.collection.entries())), { encoding: "utf-8" });
    }
}