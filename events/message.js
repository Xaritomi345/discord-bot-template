const Discord = require('discord.js');

module.exports.run = async (client, message) => {
  if (!(await client.settings.has(message.guild.id))) {
    await client.settings.set(message.guild.id, {
      prefix: '?',
      ADMIN_ROLE: 'Admin',
      APPROVER_ROLE: 'Approver',
      MEMBER_ROLE: 'Members',
      ApproveChannel: '',
      AutoAdd: false,
    });
  }
  let settings = await client.settings.get(message.guild.id);
  let prefix = settings.prefix;

  if (message.guild === null) return;
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;

  let perms;
  try {
    perms = await checkPerms(message, settings);
  } catch (err) {
    perms = 0;
  }
  let command = message.content.split(' ')[0].slice(prefix.length).toLowerCase();
  let args = message.content.split(' ').slice(1);
  let cmd;
  if (client.commands.has(command)) {
    cmd = client.commands.get(command);
  } else if (client.aliases.has(command)) {
    cmd = client.commands.get(client.aliases.get(command));
  }
  if (cmd) {
    if (perms < cmd.help.perm) return message.channel.send(`Im sorry, but this command requires a permission level of ${cmd.help.perm} or higher.`);
    cmd.run(client, message, args, Discord, settings);
  }
};

async function checkPerms(message, settings) {
  let perms = 0;

  try {
    let Member = message.guild.roles.cache.find((role) => role.name === settings.MEMBER_ROLE);
    if (message.member.roles.cache.has(Member.id)) perms = 1;
  } catch (err) {
    // console.log(err);
  }

  try {
    let Approve = message.guild.roles.cache.find((role) => role.name === settings.APPROVER_ROLE);
    if (message.member.roles.cache.has(Approve.id)) perms = 2;
  } catch (err) {
    // console.log(err);
  }

  try {
    let Admin = message.guild.roles.cache.find((role) => role.name === settings.ADMIN_ROLE);
    if (message.author.id == message.guild.ownerID || message.member.roles.cache.has(Admin.id)) perms = 3;
  } catch (err) {
    // console.log(err);
  }

  return perms;
}
