const { loadCommands } = require('../../Handlers/commandHandler');
const axios = require('axios');
const { ActivityType, Client } = require(`discord.js`)

module.exports = {
    name: "ready",
    once: true,
    /**
     * 
     * @param { Client } client 
     */
    async execute(client) {

        async function checksrv() {
            try {
                let g = await client.guilds.cache.find(g => g.id === client.config.guild.id)
                let chan = await g.channels.cache.find(c => c.id === client.config.guild.channels.statchan);
                let ip = client.config.ips.main;
                let url = `https://api.mcsrvstat.us/2/${ip}`;
        
                axios.get(url)
                .then(function (res) {
                    let data = res.data;
                    if (data.online === false) {
                        client.user.setStatus('dnd');
                        client.user.setActivity(`OFFLINE`, {type: ActivityType.Playing});
                        chan.setName(`🔴 OFFLINE`)
                    } else {
                        client.user.setActivity(`${data.players.online}/${data.players.max} players`, { type: ActivityType.Watching });
                        if(data.players.online == data.players.max) {
                            chan.setName(`🟠 ${data.players.online}/${data.players.max} Players`)
                            client.user.setStatus('idle');
                        } else {
                            chan.setName(`🟢 ${data.players.online}/${data.players.max} Players`)
                            client.user.setStatus('online');
                        }
                    }
                })
            } catch {
                console.error
            }
        }

        loadCommands(client);
        checksrv()
        console.log(` ⚪ - ${client.user.tag} ready!`);
        client.user.setActivity('the Server', { type: ActivityType.Watching });
    
        setInterval(async function() {
            await checksrv()
        }, client.config.autodata.delay * 1000)
    }

}
