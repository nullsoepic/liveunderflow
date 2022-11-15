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
            vouchchan: string,
            appcat: string,
            statchan: string
        },
        roles: {
            rwx: string,
            rw: string
        }
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
