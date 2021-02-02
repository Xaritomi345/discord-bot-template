exports.run = async (client, message, args, Discord, settings) => {
  message.channel.send('PONG');
};

exports.help = {
  name: 'ping',
  usage: 'ping',
  description: 'You can send the command ping, and the bot will respond with a pong!.',
  aliases: [],
  category: 'settings',
  perms: 0,
};
