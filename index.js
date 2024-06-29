const { Client, GatewayIntentBits, REST, Routes } = require('discord.js');
const dotenv = require('dotenv');

dotenv.config();
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const prefix = '/';

client.once('ready', async () => {
    console.log(`Bot is online! Logged in as ${client.user.tag}!`);

    const commands = [
        {
            name: 'ping',
            description: 'Ping the bot',
        },
        {
            name: 'nee',
            description: 'Respond with nee',
        },
        {
            name: 'pyramid',
            description: 'Create a pyramid with the specified size and block',
            options: [
                {
                    name: 'size',
                    type: 4, // INTEGER
                    description: 'Size of the pyramid',
                    required: true,
                },
                {
                    name: 'block',
                    type: 3, // STRING
                    description: 'Building block for the pyramid',
                    required: true,
                },
            ],
        },
    ];

    const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

    try {
        await rest.put(
            Routes.applicationGuildCommands(client.user.id, process.env.GUILD_ID),
            { body: commands },
        );
        console.log('Successfully registered application commands.');
    } catch (error) {
        console.error(error);
    }
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const { commandName, options } = interaction;

    if (commandName === 'ping') {
        await interaction.reply('pong');
    } else if (commandName === 'nee') {
        await interaction.reply('nee');
    } else if (commandName === 'pyramid') {
        const size = options.getInteger('size');
        const block = options.getString('block');

        if (size <= 0) {
            return interaction.reply('Please provide a valid positive number for the pyramid size.()');
        }

        let pyramid = '';
        for (let i = 1; i <= size; i++) {
            pyramid += `${block.repeat(i)}\n`;
        }

        await interaction.reply(pyramid);
    }
});

client.login(process.env.DISCORD_TOKEN);
