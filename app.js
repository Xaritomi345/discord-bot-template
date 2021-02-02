// Loading in dependencies / Modules
const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('fs');
const { promisify } = require('util');
const readdir = promisify(fs.readdir);
const { CommandHandler, EventHandler } = require('./loader');
const JMap = require('enmap-json-sync');

(async function () {
  require('dotenv').config();

  client.commands = new Discord.Collection();
  client.aliases = new Discord.Collection();
  client.settings = new JMap('./settings.json');
  await client.settings.loadFromJSON();

  const cmdFiles = await readdir('./cmd');
  cmdFiles.forEach((file) => {
    try {
      CommandHandler(`./cmd/${file}`, client.commands, client.aliases);
    } catch (e) {
      console.error(`There was an error with ${file}`, e.stack);
    }
  });
  EventHandler('./events', client);

  client.login(process.env.TOKEN);
})();
