import { GatewayIntentBits, Partials, Collection, WebhookClient } from 'discord.js';
import { loadEvents } from './Handlers/eventHandler';
import { handleMinecraft } from './Minecraft/Bot';
import { DiscordClient } from './Utils/DiscordClient';

const { Guilds, GuildMessages, GuildMembers, MessageContent } = GatewayIntentBits;
const { User, Message, GuildMember, ThreadMember } = Partials;
// Create Client with intents and partials
const client = new DiscordClient({
    intents: [ Guilds, GuildMessages, GuildMembers, GuildMessages, MessageContent ],
    partials: [User, Message, GuildMember, ThreadMember ],
    allowedMentions: { parse: [] }
});

client.config = require("./config.json");

client.events = new Collection();
client.commands = new Collection();
client.cooldowns = [];
client.webhook = new WebhookClient({
    url: client.config['in-game-bot'].webhookURL
})
client.webhook.options.allowedMentions = { parse: [] };

// Register Events
loadEvents(client);

//Begin MC Client
handleMinecraft(client);

client.login(client.config.token);
