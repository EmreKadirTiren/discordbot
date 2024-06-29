const { Client, GatewayIntentBits, REST, Routes } = require('discord.js');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// MongoDB connection
mongoose.connect(process.env.MONGO_URI);

// Define quote schema and model
const quoteSchema = new mongoose.Schema({
  quote: String,
  author: String,
  date: String,
});

const Quote = mongoose.model('Quote', quoteSchema);

client.once('ready', async () => {
  console.log(`Bot is online! Logged in as ${client.user.tag}!`);

  const commands = [
    { name: 'ping', description: 'Ping the bot' },
    { name: 'nee', description: 'Respond with nee' },
    {
      name: 'pyramid',
      description: 'Create a pyramid with the specified size and block (max size: 10)',
      options: [
        { name: 'size', type: 4, description: 'Size of the pyramid (max 10)', required: true },
        { name: 'block', type: 3, description: 'Building block for the pyramid', required: false },
      ],
    },
    {
      name: 'addquote',
      description: 'Add a new quote',
      options: [
        { name: 'quote', type: 3, description: 'The quote to add', required: true },
        { name: 'author', type: 3, description: 'Who said the quote', required: false },
        { name: 'date', type: 3, description: 'When the quote was said', required: false },
      ],
    },
    { name: 'quote', description: 'Get a random quote' },
    { name: 'listquotes', description: 'List all quotes' },
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
    const block = options.getString('block') || ':bolleqiqi:';

    if (size <= 0 || size > 10) {
      return interaction.reply('Please provide a valid positive number for the pyramid size (max 10).');
    }

    let pyramid = '';
    for (let i = 1; i <= size; i++) {
      pyramid += `${block.repeat(i * 2 - 1)}\n`;
    }

    await interaction.reply(pyramid);
  } else if (commandName === 'addquote') {
    const quote = options.getString('quote');
    const author = options.getString('author') || 'Unknown';
    const date = options.getString('date') || 'Unknown';

    if (quote) {
      const newQuote = new Quote({ quote, author, date });
      await newQuote.save();
      await interaction.reply(`Quote added successfully: "${quote}" \n- ${author} (${date})`);
    } else {
      await interaction.reply('Please provide a valid quote.');
    }
  } else if (commandName === 'quote') {
    const count = await Quote.countDocuments();
    if (count > 0) {
      const random = Math.floor(Math.random() * count);
      const randomQuote = await Quote.findOne().skip(random);
      await interaction.reply(`"${randomQuote.quote}" \n - ${randomQuote.author} (${randomQuote.date})`);
    } else {
      await interaction.reply('No quotes found.');
    }
  } else if (commandName === 'listquotes') {
    const quotes = await Quote.find();
    if (quotes.length > 0) {
      const quoteList = quotes.map((q, index) => `${index + 1}. "${q.quote}" - ${q.author} (${q.date})`).join('\n');
      await interaction.reply(`List of quotes:\n${quoteList}`);
    } else {
      await interaction.reply('No quotes found.');
    }
  }
});

client.login(process.env.DISCORD_TOKEN);
