require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
prefix = '!';
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

client.once('ready', () => {
    console.log('Bot is online!');
});

client.on('messageCreate', message => {
    if (message.content === 'ping') {
        message.channel.send('pong');
    }
});

client.on('messageCreate', message => {
    if (message.content === 'nee') {
      message.reply('nee');
    }
  });
  

client.login(process.env.DISCORD_TOKEN);
