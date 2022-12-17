export type Config = {
    token: string,
    dev: string,
    name: string,
    ips: {
        main: string,
        n00b: string
    },
    guild: {
        id: string,
        channels: {
            log_channel: string,
            app_category: string,
            stat_channel: string,
            relay_channel: string,
            cache_channel: string
        },
        roles: {
            rwx: string,
            rw: string,
            verified: string
        }
    },
    "in-game-bot": {
        enabled: boolean,
        logJoins: boolean,
        logLeaves: boolean,
        logChat: boolean,
        webhookURL: string,
        muted: Muted[]
    },
    constants: {
        defaultProfile: string
    },
    autodata: {
        delay: number
    },
    cooldown: {
        enabled: boolean,
        time: number
    },
    filter: string[]
}

interface Muted {
    name: string;
    reason: string;
}
