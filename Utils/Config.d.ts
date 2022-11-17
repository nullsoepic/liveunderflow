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
            logchan: string,
            appcat: string,
            statchan: string,
            chat_relay: string
        },
        roles: {
            rwx: string,
            rw: string
        }
    },
    "in-game-bot": {
        enabled: boolean,
        logJoins: boolean,
        logLeaves: boolean,
        logChat: boolean,
        webhookURL: string
    },
    autodata: {
        delay: number
    },
    cooldown: {
        enabled: boolean,
        time: number
    },
    filter: string[],
    
}
