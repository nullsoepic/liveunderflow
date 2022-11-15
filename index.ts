import { GatewayIntentBits, Partials, Collection } from 'discord.js';
import { loadEvents } from './Handlers/eventHandler';
import { DrippyClient } from './Utils/DrippyClient';

const { Guilds, GuildMessages, GuildMembers } = GatewayIntentBits;
const { User, Message, GuildMember, ThreadMember } = Partials;
// Create Client with intents and partials
const client = new DrippyClient({
    intents: [Guilds, GuildMessages, GuildMembers],
    partials: [User, Message, GuildMember, ThreadMember ]
});

client.config = require("./config.json");

client.events = new Collection();
client.commands = new Collection();
client.cooldowns = [];

// Register Events
loadEvents(client);

client.login(client.config.token);
