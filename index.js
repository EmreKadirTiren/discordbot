const dotenv = require('dotenv');
const { Client, GatewayIntentBits } = require('discord.js');

dotenv.config();
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });
client.login(process.env.DISCORD_TOKEN);
prefix = '!';

// When the bot is ready, log to the console
client.once('ready', () => {
    console.log(`Bot is online! And logged in as ${client.user.tag}!`);
});

// If ping is sent, reply with pong
client.on('messageCreate', message => {
    if (message.content === `${prefix}ping`) {
        message.channel.send('pong');
    }
});

// If someone says nee reply with nee 
client.on('messageCreate', message => {
    if (message.author.bot) return;
    if (message.content === `${prefix}nee`) {
      message.reply('nee');
    }
});



// if somone runs the command !pyramid 5, it will return a pyramid with 5 rows
client.on('messageCreate', message => {
    if (message.content.startsWith(`${prefix}pyramid`)) {
        const args = message.content.split(' ');
        const size = parseInt(args[1]);
        const block = args[2] || '#';

        if (!size || size <= 0) {
            return message.channel.send('Please provide a valid positive number for the pyramid size.');
        }

        let pyramid = '';
        for (let i = 1; i <= size; i++) {
            pyramid += ' '.repeat(size - i) + block.repeat(i * 2 - 1) + '\n';
        }

       //message.channel.send(`\`\`\`${pyramid}\`\`\``);
       message.channel.send(pyramid);
    }
});

client.login(process.env.DISCORD_TOKEN);
