const fs = require('fs');
const { promisify } = require('util');
const readdir = promisify(fs.readdir);

async function CommandHandler(cmddir, clientcmd, clientalias) {
  const cmdFiles = await readdir(cmddir);
  cmdFiles.forEach((file) => {
    try {
      const f = require(`${cmddir}/${file}`);
      if (file.split('.').slice(-1)[0] !== 'js') return;
      clientcmd.set(f.help.name, f);
      f.help.aliases.forEach((alias) => {
        clientalias.set(alias, f.help.name);
      });
      console.log(`Loading Command: ${file.split('.')[0]}: Successful`);
    } catch (e) {
      console.error(`There was an error with ${file}`, e.stack);
    }
  });
}

async function EventHandler(path, client) {
  const evtFiles = await readdir(path);
  evtFiles.forEach((file) => {
    if (file.split('.').slice(-1)[0] !== 'js') return;
    const eventFunction = require(`${path}/${file}`);
    const event = file.split('.')[0];
    if (eventFunction.length <= 0) return console.log('There are no events');
    client.on(event, (...args) => {
      eventFunction.run(client, ...args);
    });
    console.log(`Loading Event: ${event}: Successful`);
  });
}

module.exports = { CommandHandler, EventHandler };
