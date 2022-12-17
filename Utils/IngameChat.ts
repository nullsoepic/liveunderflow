import { MinecraftClient } from "./MinecraftClient";

export function writeChat(bot: MinecraftClient,message:String){
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
export function whisperChat(bot: MinecraftClient,message:String,user:String){
    const command = `tell ${user} ${message}`
    bot.write('chat_command', {
        command: command,
        timestamp: BigInt(Date.now()),
        salt: 0,
        argumentSignatures: [
            {argumentName:"targets",signature:Buffer.alloc(0)},
            {argumentName:"message",signature:Buffer.alloc(0)}
        ],
        signedPreview: false,
        previousMessages: [],
        lastMessage: null
    });
}