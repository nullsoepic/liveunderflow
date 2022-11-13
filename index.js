const { Client, GatewayIntentBits, Partials, Collection } = require('discord.js');
const { Guilds, GuildMessages, GuildMembers } = GatewayIntentBits;
const { User, Message, GuildMember, ThreadMember } = Partials;
// Create Client with intents and partials
const client = new Client({
    intents: [Guilds, GuildMessages, GuildMembers],
    partials: [User, Message, GuildMember, ThreadMember ]
});

// Require handlers
const { loadEvents } = require('./Handlers/eventHandler');

client.config = require("./config.json");

client.events = new Collection();
client.commands = new Collection();
client.cooldowns = [];

// Register Events
loadEvents(client);

client.login(client.config.token);
