import { loadCommands } from '../../Handlers/commandHandler';
import axios from 'axios';
import { ActivityType } from 'discord.js';
import { DiscordClient } from '../../Utils/DiscordClient';

export const name = "ready";
export const once = true;
export async function execute(client: DiscordClient) {
    async function checkSRV() {
        try {
            const guild = await client.guilds.cache.find(g => g.id === client.config.guild.id)
            const channel = await guild?.channels.cache.find(c => c.id === client.config.guild.channels.stat_channel);
            const ip = client.config.ips.main;
            const url = `https://api.mcsrvstat.us/2/${ip}`;
    
            const { data } = await axios.get(url)
            if (!data.online) {
                client.user?.setStatus('dnd');
                client.user?.setActivity(`OFFLINE`, { type: ActivityType.Playing });
                channel?.setName(`🔴 OFFLINE`)
            } else {
                client.user?.setActivity(`${data.players.online}/${data.players.max} players`, { type: ActivityType.Watching });
                if(data.players.online >= data.players.max) {
                    channel?.setName(`🟠 ${data.players.online}/${data.players.max} Players`)
                    client.user?.setStatus('idle');
                } else {
                    channel?.setName(`🟢 ${data.players.online}/${data.players.max} Players`)
                    client.user?.setStatus('online');
                }
            }
        } catch {
            console.error
        }
    }

    loadCommands(client);
    checkSRV()
    console.log(` ⚪ - ${client.user?.tag} ready!`);
    client.user?.setActivity('the Server', { type: ActivityType.Watching });

    setInterval(async () => {
        await checkSRV()
    }, client.config.autodata.delay * 1000)
}