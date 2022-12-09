import { DiscordClient } from '../Utils/DiscordClient';
import { MinecraftClient } from '../Utils/MinecraftClient';

export function handleIngameCommands(client: DiscordClient) {
    const { bot } = client;
    bot.on("player_chat", data =>{
        var message = String(data.plainMessage);
        if (message.includes("?seed")){
            writeChat(bot,"Test")
        }
        if (message.includes("?discord")){
            writeChat(bot,"Invite: https://discord.gg/paCcuuP964")
        }
    
    
    })
}

function writeChat(bot: MinecraftClient,message:String){
    bot.write('chat_message', {
        message: message,
        timestamp: BigInt(Date.now()),
        salt: 0,
        signature: Buffer.alloc(0),
        signedPreview: false,
        previousMessages: [],
        lastMessage: null
    });


}