const { loadCommands } = require('../../Handlers/commandHandler');
const axios = require('axios');
import { ActivityType } from 'discord.js';

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
                const guild = await client.guilds.cache.find(g => g.id === client.config.guild.id)
                const channel = await guild.channels.cache.find(c => c.id === client.config.guild.channels.statchan);
                const ip = client.config.ips.main;
                const url = `https://api.mcsrvstat.us/2/${ip}`;
        
                const { data } = await axios.get(url)
                if (!data.online) {
                    client.user.setStatus('dnd');
                    client.user.setActivity(`OFFLINE`, { type: ActivityType.Playing });
                    channel.setName(`🔴 OFFLINE`)
                } else {
                    client.user.setActivity(`${data.players.online}/${data.players.max} players`, { type: ActivityType.Watching });
                    if(data.players.online == data.players.max) {
                        channel.setName(`🟠 ${data.players.online}/${data.players.max} Players`)
                        client.user.setStatus('idle');
                    } else {
                        channel.setName(`🟢 ${data.players.online}/${data.players.max} Players`)
                        client.user.setStatus('online');
                    }
                }
            } catch {
                console.error
            }
        }

        loadCommands(client);
        checksrv()
        console.log(` ⚪ - ${client.user.tag} ready!`);
        client.user.setActivity('the Server', { type: ActivityType.Watching });
    
        setInterval(async () => {
            await checksrv()
        }, client.config.autodata.delay * 1000)
    }

}
