const Discord = require('discord.js')

const client = new Discord.Client()

const config = require("./config.json")

require('@weky/inlinereply');

const ascii = require("ascii-table");

const table = new ascii().setHeading("Commandes", "Statut");

const prefix = config.prefix

module.exports = client;

const prefixSchema = require("./Modèles/prefix")

require("discord-buttons")(client)

const distube = require('distube')

client.prefix = async function(message) {
  let custom;

  const data = await prefixSchema.findOne({ Guild : message.guild.id })
      .catch(err => console.log(err))
  
  if(data) {
      custom = data.Prefix;
  } else {
      custom = prefix;
  }
  return custom;
}

client.distube = new distube(client, {
	leaveOnFinish: true,
	leaveOnEmpty: true,
	searchSongs: false,
	emitNewSongOnly: true,
	leaveOnStop: true,
	youtubeDL: true,
	updateYouTubeDL: true,
	youtubeCookie:
		"GPS=1; YSC=w5dGoHzqQRI; VISITOR_INFO1_LIVE=B4ElBqxSDv4; PREF=tz=Asia.Hong_Kong"
});

const voiceCollection = new Discord.Collection()

client.on("voiceStatueUpdate", async (oldState, newState) => {
    const user = await client.users.fetch(newState.id)
    const member = newState.guild.member(user)

    if(!oldState && newState.channel.id === "879526217253023775") {
        const channel = await newState.guild.channels.create("🌸・" + user, {
            type: 'voice',
            parent: newState.channel.parent
        })
        member.voice.setChannel(channel)
        voiceCollection.set(user.id, channel.id)
    } else if (!newState.channel) {
        if(oldState.channel === voiceCollection.get(newState.id)) return oldState.channel.delete()
    }
})


client.distube
	.on('playSong', (message, queue, song) =>
		message.channel.send(
			`En train de jouer \`${song.name}\` - \`${
				song.formattedDuration
			}\``,
		))
	.on('addSong', (message, queue, song) =>
		message.channel.send(
			`J'ai ajouté à la queue ${song.name} - \`${song.formattedDuration}\` , demandé par ${song.user}`,
		))

const blacklist = require('./Modèles/blacklist')

const blacklistguild = require('./Modèles/blacklist-servers')

const Schema = require("./Modèles/reaction-roles")

const bg = require('./config.json').embedcolor

const moment = require("moment")

const { antijoin } = require("./Collection")

const ms = require("ms")

client.on("guildMemberAdd", async (member) => {
    const getCollection = antijoin.get(member.guild.id)
    if (!getCollection) return;
	if(!getCollection.includes((value) => value.id === member.id)) {
		getCollection.push(member.user)
	}
    member.kick({ reason: "Le mode anti-raid a été activé." })
})

const antilinkData = require('./Modèles/antilink')
 client.on("message", async(message)=>{
  const antilink = await antilinkData.findOne({
    GuildID: message.guild.id
  })
  if (antilink) {
     if (message.content.match("https://") || message.content.match("discord.gg") || message.content.match("www.")) {
    message.delete();
    return message.channel.send("L'anti-link a été activé.").then(msg=>{
    let time = '2s'
    setTimeout(function(){
    msg.delete();
  }, ms(time));
})
  } else {
    return;
  }
} else if (!antilink) {
  return;
}
});

const db = require('quick.db')

client.on('message', async message => {
    db.add(`guildMessages_${message.guild.id}_${message.author.id}`, 1)
})

client.on ("ready", async (message) => {
    console.log(`${client.user.username} est maintenant actif !`);
    console.log(`${client.user.username} est connecté sur ${client.guilds.size} serveurs !`);
    client.user.setActivity("!help", {type: "GAME"});
    let activNum = 0;
    setInterval(function() {
        if (activNum === 0) {
            client.user.setActivity("Bot Protection Snk Fr 🌟")
            activNum = 1
        } else if (activNum === 1) {
            client.user.setActivity("Bot Protection Snk Fr 🌟")
            activNum = 0
        }
    }, 3 * 1000)
});




client.on('messageDelete', async message => {

  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  function sleep(milliseconds) {
      var start = new Date().getTime();
      for (var i = 0; i < 1e7; i++) {
          if ((new Date().getTime() - start) > milliseconds) {
              break;
          }
      }
  }

  if (message.guild) {
      if (message.author.bot) return;
      var y = db.get('messagedelete_' + message.guild.id);
      if (y !== `enabled`) return;
      var x = db.get('loggingchannel_' + message.guild.id);
      x = client.channels.cache.get(x);
      if (message.channel == x) return;
      var embed = new Discord.MessageEmbed()
          .setColor('#FF0000')
          .setAuthor(message.author.tag, message.author.avatarURL)
          .setDescription(`**Deleted message by** ${message.author} **in the channel :** ${message.channel} \n${message.content}`)
          .setTimestamp();
      x.send(embed).catch();
  }

});

client.on("channelCreate", async function (channel) {
  if (!channel.guild) return;
  var y = db.get(`channelcreate_${channel.guild.id}`);
  if (y !== 'enabled') return;
  var x = db.get('loggingchannel_' + channel.guild.id);
  var x = client.channels.cache.get(x);
  var embed = new Discord.MessageEmbed()
      .setColor('#09dc0b')
      .setAuthor(channel.guild.name, channel.guild.iconURL)
      .setTitle('Channel created')
      .addField('Channel', channel)
      .addField('Type', channel.type)
      .setFooter(`ID: ${channel.guild.id}`, channel.guild.iconURL)
      .setTimestamp();
  x.send(embed).catch();


});

client.on("channelDelete", async function (channel) {
  if (!channel.guild) return;
  var y = db.get(`channelcreate_${channel.guild.id}`);
  if (y !== 'enabled') return;
  var x = db.get('loggingchannel_' + channel.guild.id);
  var x = client.channels.cache.get(x);

  var embed = new Discord.MessageEmbed()
      .setColor('#FF0000')
      .setAuthor(channel.guild.name, channel.guild.iconURL)
      .setTitle('Channel deleted')
      .addField('Name', channel.name)
      .addField('Type', channel.type)
      .setFooter(`ID: ${channel.guild.id}`, channel.guild.iconURL)
      .setTimestamp();
  x.send(embed).catch();

});
client.on("emojiCreate", async function (emoji) {

  var y = db.get(`emojicreate_${emoji.guild.id}`);
  if (y !== 'enabled') return;
  var x = db.get('loggingchannel_' + emoji.guild.id);
  var x = client.channels.cache.get(x);

  var embed = new Discord.MessageEmbed()
      .setColor('#09dc0b')
      .setAuthor(emoji.guild.name, emoji.guild.iconURL)
      .setTitle('Emoji created')
      .addField('Emoji added', emoji + ` :${emoji.name}:`)
      .setFooter(`ID: ${emoji.guild.id}`, emoji.guild.iconURL)
      .setTimestamp();
  x.send(embed).catch();


});
client.on("emojiDelete", async function (emoji) {
  var y = db.get(`emojidelete_${emoji.guild.id}`);
  if (y !== 'enabled') return;
  var x = db.get('loggingchannel_' + emoji.guild.id);
  var x = client.channels.cache.get(x);

  var embed = new Discord.MessageEmbed()
      .setColor('#FF0000')
      .setAuthor(emoji.guild.name, emoji.guild.iconURL)
      .setTitle('Emoji deleted')
      .addField('Name', `[:${emoji.name}:](${emoji.url})`)
      .setFooter(`ID: ${emoji.guild.id}`, emoji.guild.iconURL)
      .setTimestamp();
  x.send(embed).catch();


});
client.on("guildBanAdd", async function (guild, user) {

  var y = db.get(`guildbanadd_${guild.id}`);
  if (y !== 'enabled') return;
  var x = db.get('loggingchannel_' + guild.id);
  var x = client.channels.cache.get(x);

  var embed = new Discord.MessageEmbed()
      .setColor('#FF0000')
      .setAuthor(user.tag, user.avatarURL)
      .setDescription(`${user.tag} **has been banned** `)
      .setFooter(`ID: ${guild.id}`, guild.iconURL)
      .setTimestamp();
  x.send(embed).catch();

});
client.on("guildBanRemove", async function (guild, user) {

  var y = db.get(`guildbanremove_${guild.id}`);
  if (y !== 'enabled') return;
  var x = db.get('loggingchannel_' + guild.id);
  var x = client.channels.cache.get(x);

  var embed = new Discord.MessageEmbed()
      .setColor('GREEN')
      .setAuthor(user.tag, user.avatarURL)
      .setDescription(`à${user.tag} **has been unbanned**`)
      .setFooter(`ID: ${guild.id}`, guild.iconURL)
      .setTimestamp();
  x.send(embed).catch();
});
client.on("guildMemberAdd", async function (member) {

  var y = db.get(`guildmemberadd_${member.guild.id}`);
  if (y !== 'enabled') return;
  var x = db.get('loggingchannel_' + member.guild.id);
  var x = client.channels.cache.get(x);

  var embed = new Discord.MessageEmbed()
      .setColor('GREEN')
      .setAuthor(member.user.tag, member.user.avatarURL)
      .setDescription(`${member.user.tag} **joined the server**`)
      .addField('Account created', member.user.createdAt)
      .setFooter(`ID: ${member.user.id}`)
      .setTimestamp();
  x.send(embed).catch();
});
client.on("guildMemberRemove", async function (member) {
  var y = db.get(`guildmemberremove_${member.guild.id}`);
  if (y !== 'enabled') return;
  var x = db.get('loggingchannel_' + member.guild.id);
  var x = client.channels.cache.get(x);

  var embed = new Discord.MessageEmbed()
      .setColor('RED')
      .setAuthor(member.user.tag, member.user.avatarURL)
      .setDescription(`${member.user.tag} **leaved the server**`)
      .setFooter(`ID: ${member.user.id}`)
      .setTimestamp();
  x.send(embed).catch();

});

client.on("messageDeleteBulk", async function (messages) {

  var y = db.get(`messagebulkdelete_${messages.random().guild.id}`);
  if (y !== 'enabled') return;
  var x = db.get('loggingchannel_' + messages.random().guild.id);
  var x = client.channels.cache.get(x);
  if (messages.random().channel == x) return;

  await messages.array().reverse().forEach(m => {
      var x = m.createdAt.toString().split(' ');
      fs.appendFile('messagebulkdelete.txt', `[${m.author.tag}], [#${m.channel.name}]: ["${m.content}"], sendend the [${x[0]} ${x[1]} ${x[2]} ${x[3]} ${x[4]}]\n\n`, function (err) {
          if (err) throw err;
          console.log('Saved!');
      });
  });

  var embed = new Discord.MessageEmbed()
      .setColor('#FFD700')
      .setAuthor(messages.random().guild.name, messages.random().guild.iconURL)
      .setDescription(`**${messages.array().length} messages has been cleared in ** ${messages.random().channel}`)
      .setFooter(`ID: ${messages.random().guild.id}`)
      .setTimestamp();
      await x.send(embed).catch();
      await x.send(`Here are all of the messages: \n`).catch();
      await x.send(({
          files: [{
             attachment: 'messagebulkdelete.txt'
          }]
  })).catch();

  fs.unlink('messagebulkdelete.txt', function (err) {
      if (err) throw err;
      console.log('File deleted!');
  });

});

client.on("roleCreate", async function (role) {
  var y = db.get(`rolecreate_${role.guild.id}`);
  if (y !== 'enabled') return;
  var x = db.get('loggingchannel_' + role.guild.id);
  var x = client.channels.cache.get(x);


  var embed = new Discord.MessageEmbed()
      .setColor('#09dc0b')
      .setAuthor(role.guild.name, role.guild.iconURL)
      .setTitle(`Role ${role.name} created`)
      .setDescription(`Name: ${role.name} \nColor: ${role.color}\nMentionable: ${role.mentionable}`)
      .setFooter(`ID: ${role.id}`)
      .setTimestamp();
  x.send(embed).catch();

});
client.on("roleDelete", async function (role) {

  var y = db.get(`roledelete_${role.guild.id}`);
  if (y !== 'enabled') return;
  var x = db.get('loggingchannel_' + role.guild.id);
  var x = client.channels.cache.get(x);

  var embed = new Discord.MessageEmbed()
      .setColor('#FF0000')
      .setAuthor(role.guild.name, role.guild.iconURL)
      .setTitle(`Role ${role.name} deleted`)
      .setDescription(`Name: ${role.name} \nColor: ${role.color}\nMentionable: ${role.mentionable}`)
      .setFooter(`ID: ${role.id}`)
      .setTimestamp();

  x.send(embed).catch();

});

client.on('message', async message => {

  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  if (message.content.indexOf(prefix) !== 0) return;

  function sleep(milliseconds) {
      var start = new Date().getTime();
      for (var i = 0; i < 1e7; i++) {
          if ((new Date().getTime() - start) > milliseconds) {
              break;
          }
      }

  }

  if (message.content === prefix + "logs") {
      if (!message.guild) return
      if (!message.member.hasPermission(`MANAGE_CHANNELS`) || !message.member.hasPermission(`MANAGE_GUILD`)) return message.channel.send(`You need the \`MANAGE_GUILD\` and \`MANAGE_CHANNELS\` permission.`);
      var embed = new Discord.MessageEmbed()
          .setAuthor(`Here are the logs settings of ${message.guild.name}`, message.guild.iconURL)
          .setTitle(`Logs of ${message.guild.name}\n`)
          .setColor('GREEN');
      var y = await db.get(`allenabled_${message.guild.id}`);
      if (y == 'enabled') {
          embed.addField('Deleted Messages [1]', "<:enable:880297789895110696>");
          embed.addField('Roles creations [2]', "<:enable:880297789895110696>");
          embed.addField('Roles suppression [3]', "<:enable:880297789895110696>");
          embed.addField('Cleared messages (bulkDelete) [4]', "<:enable:880297789895110696>");
          embed.addField('Kicked member [5]', "<:enable:880297789895110696>");
          embed.addField('Joining message [6]', "<:enable:880297789895110696>");
          embed.addField('Banned member [7]', "<:enable:880297789895110696>");
          embed.addField('Unbanned member [8]', "<:enable:880297789895110696>");
          embed.addField('Emoji creation [9]', "<:enable:880297789895110696>");
          embed.addField('Emoji suppression [10]', "<:enable:880297789895110696>");
          embed.addField('Channels creations [11]', "<:enable:880297789895110696>");
          embed.addField('Channels suppression [12]', "<:enable:880297789895110696>");
          embed.addField(`----------------------`, `Logs settings: \n\`${prefix}enable [number]\` - Enable the mentionned log\n\`${prefix}enable all\` - Enable all logs \n \`${prefix}disable [number]\` - Disable a log \n\`${prefix}disable all\` - Disable all log\n \`${prefix}reset\` - Reset logs, channel included`);
          var x = await db.get('loggingchannel_' + message.guild.id);
          if (x == null) embed.addField(`Please setup the logs channel:`, `\`${prefix}setlogs #channel\``);
          if (x !== null) {
              var y = client.channels.cache.get(x);
              embed.addField(`----------------------`, `The logs channel is now ${y}.`);
          }
          embed.setFooter(`Senku.`, client.user.avatarURL());
      } else if (y == "disabled") {
        embed.addField('Deleted Messages [1]', "<:disable:880297763068342342>");
        embed.addField('Roles creations [2]', "<:disable:880297763068342342>");
        embed.addField('Roles suppression [3]', "<:disable:880297763068342342>");
        embed.addField('Cleared messages (bulkDelete) [4]', "<:disable:880297763068342342>");
        embed.addField('Kicked member [5]', "<:disable:880297763068342342>");
        embed.addField('Joining message [6]', "<:disable:880297763068342342>");
        embed.addField('Banned member [7]', "<:disable:880297763068342342>");
        embed.addField('Unbanned member [8]', "<:disable:880297763068342342>");
        embed.addField('Emoji creation [9]', "<:disable:880297763068342342>");
        embed.addField('Emoji suppression [10]', "<:disable:880297763068342342>");
        embed.addField('Channels creations [11]', "<:disable:880297763068342342>");
        embed.addField('Channels suppression [12]', "<:disable:880297763068342342>");
        embed.addField(`----------------------`, `Logs settings: \n\`${prefix}enable [number]\` - Enable the mentionned log\n\`${prefix}enable all\` - Enable all logs \n \`${prefix}disable [number]\` - Disable a log \n\`${prefix}disable all\` - Disable all log\n \`${prefix}reset\` - Reset logs, channel included`);
          var x = await db.get('loggingchannel_' + message.guild.id);
          if (x == null) embed.addField(`There is no logs channel.`, `Please do [prefix]setlogs #channel`);
          if (x !== null) {
              var y = client.channels.cache.get(x);
              embed.addField(`----------------------`, `The logs channel has now been set to ${y}`);
          }
      } else {

          var x = await db.get('messagedelete_' + message.guild.id);
          if (x == null || x == "disabled") {
              embed.addField('Deleted Messages [1]', "<:disable:880297763068342342>");
          } else {
              embed.addField('Deleted Messages [1]', "<:enable:880297789895110696>");
          }
          var x = await db.get('rolecreate_' + message.guild.id);
          if (x == null || x == "disabled") {
              embed.addField('Roles creations [2]', "<:disable:880297763068342342>");
          } else {
              embed.addField('Roles creations [2]', "<:enable:880297789895110696>");
          }
          var x = await db.get('roledelete_' + message.guild.id);
          if (x == null || x == "disabled") {
              embed.addField('Roles suppression [3]', "<:disable:880297763068342342>");
          } else {
              embed.addField('Roles suppression [3]', "<:enable:880297789895110696>");
          }
          var x = await db.get('messagebulkdelete_' + message.guild.id);
          if (x == null || x == "disabled") {
              embed.addField('Cleared messages (bulkDelete) [4]', "<:disable:880297763068342342>");
          } else {
              embed.addField('Cleared messages (bulkDelete) [4]', "<:enable:880297789895110696>");
          }
          var x = await db.get('guildmemberremove_' + message.guild.id);
          if (x == null || x == "disabled") {
              embed.addField('Kicked member [5]', "<:disable:880297763068342342>");
          } else {
              embed.addField('Kicked member [5]', "<:enable:880297789895110696>");
          }
          var x = await db.get('guildmemberadd_' + message.guild.id);
          if (x == null || x == "disabled") {
              embed.addField('Joining message [6]', "<:disable:880297763068342342>");
          } else {
              embed.addField('Joining message [6]', "<:enable:880297789895110696>");
          }
          var x = await db.get('guildbanadd_' + message.guild.id);
          if (x == null || x == "disabled") {
              embed.addField('Banned member [7]', "<:disable:880297763068342342>");
          } else {
              embed.addField('Banned member [7]', "<:enable:880297789895110696>");
          }
          var x = await db.get('guildbanremove_' + message.guild.id);
          if (x == null || x == "disabled") {
              embed.addField('Unbanned member [8]', "<:disable:880297763068342342>");
          } else {
              embed.addField('Unbanned member [8]', "<:enable:880297789895110696>");
          }
          var x = await db.get('emojicreate_' + message.guild.id);
          if (x == null || x == "disabled") {
              embed.addField('Emoji creation [9]', "<:disable:880297763068342342>");
          } else {
              embed.addField('Emoji creation [9]', "<:enable:880297789895110696>");
          }
          var x = await db.get('emojidelete_' + message.guild.id);
          if (x == null || x == "disabled") {
              embed.addField('Emoji suppression [10]', "<:disable:880297763068342342>");
          } else {
              embed.addField('Emoji suppression [10]', "<:enable:880297789895110696>");
          }
          var x = await db.get('channelcreate_' + message.guild.id);
          if (x == null || x == "disabled") {
              embed.addField('Channels creations [11]', "<:disable:880297763068342342>");
          } else {
              embed.addField('Channels creations [11]', "<:enable:880297789895110696>");
          }
          var x = await db.get('channeldelete_' + message.guild.id);
          if (x == null || x == "disabled") {
              embed.addField('Channels suppression [12]', "<:disable:880297763068342342>");
          } else {
              embed.addField('Channels suppression [12]', "<:enable:880297789895110696>");
          }
          embed.addField(`----------------------`, `Logs settings: \n\`${prefix}enable [number]\` - Enable the mentionned log\n\`${prefix}enable all\` - Enable all logs \n \`${prefix}disable [number]\` - Disable a log \n\`${prefix}disable all\` - Disable all log\n \`${prefix}reset\` - Reset logs, channel included`);
          var x = await db.get('loggingchannel_' + message.guild.id);
          if (x == null) embed.addField(`There is no logs channel.`, `Please do [prefix]setlogs #channel`);
          if (x !== null) {
              var y = client.channels.cache.get(x);
              embed.addField(`----------------------`, `The logs channel has now been set to ${y}`);
          }
      }
      embed.setFooter(`Senku.`, client.user.avatarURL());
      message.channel.send(embed);

  }

  if (command == "reset") {
      if (!message.member.hasPermission(`MANAGE_CHANNELS`) || !message.member.hasPermission(`MANAGE_GUILD`)) return message.channel.send(`You need the \`MANAGE_GUILD\` and \`MANAGE_CHANNELS\` permission.`);
      await db.delete(`loggingchannel_${message.guild.id}`);
      await db.delete(`allenabled_${message.guild.id}`);
      await db.delete(`messagedelete_${message.guild.id}`);
      await db.delete('rolecreate_' + message.guild.id);
      await db.delete('roledelete_' + message.guild.id);
      await db.delete('messagebulkdelete_' + message.guild.id);
      await db.delete('guildmemberremove_' + message.guild.id);
      await db.delete('guildmemberadd_' + message.guild.id);
      await db.delete('guildbanadd_' + message.guild.id);
      await db.delete('guildbanremove_' + message.guild.id);
      await db.delete('emojicreate_' + message.guild.id);
      await db.delete('emojidelete_' + message.guild.id);
      await db.delete('channelcreate_' + message.guild.id);
      await db.delete('channeldelete_' + message.guild.id);
      message.channel.send(`I reset all logs of the server.`);
  }

  if (command == "disable") {

      if (!message.member.hasPermission(`MANAGE_CHANNELS`) || !message.member.hasPermission(`MANAGE_GUILD`)) return message.channel.send(`You need the \`MANAGE_GUILD\` and \`MANAGE_CHANNELS\` permission.`);
      if (!args[0]) return message.channel.send(`Please specify the number.`);
      var x = await db.get('loggingchannel_' + message.guild.id);
      if (x == null || x == 'none') {
          return message.channel.send(`Please setup the logs.`);
      }
      if (args[0] > 12 || args[0] < 1) return message.reply(`Invalid number.`);
      switch (args[0]) {
          case "1":
              await db.set(`messagedelete_${message.guild.id}`, 'disabled');
              message.channel.send(`Disabled the log : \`Message Delete\``);
              await db.delete(`allenabled_${message.guild.id}`);
              break;
          case "2":
              await db.set(`rolecreate_${message.guild.id}`, 'disabled');
              message.channel.send(`Disabled the log : \`Roles creations\``);
              await db.delete(`allenabled_${message.guild.id}`);
              break;
          case "3":
              await db.set(`roledelete_${message.guild.id}`, 'disabled');
              message.channel.send(`Disabled the log : \`Roles suppression\``);
              await db.delete(`allenabled_${message.guild.id}`);
              break;
          case "4":
              await db.set(`messagebulkdelete_${message.guild.id}`, 'disabled');
              message.channel.send(`Disabled the log : message \`Cleared messages (bulkDelete\``);
              await db.delete(`allenabled_${message.guild.id}`);
              break;
          case "5":
              await db.set(`guildmemberremove_${message.guild.id}`, 'disabled');
              message.channel.send(`Disabled the log : \`Kicked member\``);
              await db.delete(`allenabled_${message.guild.id}`);
              break;
          case "6":
              await db.set(`guildmemberadd_${message.guild.id}`, 'disabled');
              message.channel.send(`Disabled the log : \`Joining message\``);
              await db.delete(`allenabled_${message.guild.id}`);
              break;
          case "7":
              await db.set(`guildbanadd_${message.guild.id}`, 'disabled');
              message.channel.send(`J'ai enlevé les logs de \`Banned members\``);
              await db.delete(`allenabled_${message.guild.id}`);
              break;
          case "8":
              await db.set(`guildbanremove_${message.guild.id}`, 'disabled');
              message.channel.send(`J'ai enlevé les logs de \`Unbanned members\``);
              await db.delete(`allenabled_${message.guild.id}`);
              break;
          case "9":
              await db.set(`emojicreate_${message.guild.id}`, 'disabled');
              message.channel.send(`Disabled the log : \`Emojis creation\``);
              await db.delete(`allenabled_${message.guild.id}`);
              break;
          case "10":
              await db.set(`emojidelete_${message.guild.id}`, 'disabled');
              message.channel.send(`Disabled the log : \`Emojis suppression\``);
              await db.delete(`allenabled_${message.guild.id}`);
              break;
          case "11":
              await db.set(`channelcreate_${message.guild.id}`, 'disabled');
              message.channel.send(`Disabled the log : \`Channels creation\``);
              await db.delete(`allenabled_${message.guild.id}`);
              break;
          case "12":
              await db.set(`channeldelete_${message.guild.id}`, 'disabled');
              message.channel.send(`Disabled the log : \`Channels suppression\``);
              await db.delete(`allenabled_${message.guild.id}`);
              break;
          case "all":
              await db.set(`allenabled_${message.guild.id}`, 'disabled');
              await db.set(`messagedelete_${message.guild.id}`, 'disabled');
              await db.set('rolecreate_' + message.guild.id, 'disabled');
              await db.set('roledelete_' + message.guild.id, 'disabled');
              await db.set('messagebulkdelete_' + message.guild.id, 'disabled');
              await db.set('guildmemberremove_' + message.guild.id, 'disabled');
              await db.set('guildmemberadd_' + message.guild.id, 'disabled');
              await db.set('guildbanadd_' + message.guild.id, 'disabled');
              await db.set('guildbanremove_' + message.guild.id, 'disabled');
              await db.set('emojicreate_' + message.guild.id, 'disabled');
              await db.set('emojidelete_' + message.guild.id, 'disabled');
              await db.set('channelcreate_' + message.guild.id, 'disabled');
              await db.set('channeldelete_' + message.guild.id, 'disabled');
              message.channel.send(`Disabled all logs of the server.`);
      }
  }

  if (command == "enable") {
      
      if (!message.member.hasPermission(`MANAGE_CHANNELS`) || !message.member.hasPermission(`MANAGE_GUILD`)) return message.channel.send(`You need the \`MANAGE_GUILD\` and \`MANAGE_CHANNELS\` permission.`);
      if (!args[0]) return message.channel.send(`Invalid number.`);
      var x = await db.get('loggingchannel_' + message.guild.id);
      if (x == null || x == 'none') {
          return message.channel.send(`No logs channel has been set.`);
      }
      if (args[0] > 12 || args[0] < 1) return message.reply(`Invalid number.`);
      switch (args[0]) {
          case "1":
              await db.set(`messagedelete_${message.guild.id}`, 'enabled');
              message.channel.send(`Enabled the log : \`Message Delete\``);
              await db.delete(`allenabled_${message.guild.id}`);
              break;
          case "2":
              await db.set(`rolecreate_${message.guild.id}`, 'enabled');
              message.channel.send(`Enabled the log : \`Roles creations\``);
              await db.delete(`allenabled_${message.guild.id}`);
              break;
          case "3":
              await db.set(`roledelete_${message.guild.id}`, 'enabled');
              message.channel.send(`Enabled the log : \`Roles suppression\``);
              await db.delete(`allenabled_${message.guild.id}`);
              break;
          case "4":
              await db.set(`messagebulkdelete_${message.guild.id}`, 'enabled');
              message.channel.send(`Enabled the log : message \`Cleared messages (bulkDelete)\``);
              await db.delete(`allenabled_${message.guild.id}`);
              break;
          case "5":
              await db.set(`guildmemberremove_${message.guild.id}`, 'enabled');
              message.channel.send(`Enabled the log : \`Kicked member\``);
              await db.delete(`allenabled_${message.guild.id}`);
              break;
          case "6":
              await db.set(`guildmemberadd_${message.guild.id}`, 'enabled');
              message.channel.send(`Enabled the log : \`Joining message\``);
              await db.delete(`allenabled_${message.guild.id}`);
              break;
          case "7":
              await db.set(`guildbanadd_${message.guild.id}`, 'enabled');
              message.channel.send(`Enabled the log : \`Banned members\``);
              await db.delete(`allenabled_${message.guild.id}`);
              break;
          case "8":
              await db.set(`guildbanremove_${message.guild.id}`, 'enabled');
              message.channel.send(`Enabled the log : \`Unbanned members\``);
              await db.delete(`allenabled_${message.guild.id}`);
              break;
          case "9":
              await db.set(`emojicreate_${message.guild.id}`, 'enabled');
              message.channel.send(`Enabled the log : \`Emojis creation\``);
              await db.delete(`allenabled_${message.guild.id}`);
              break;
          case "10":
              await db.set(`emojidelete_${message.guild.id}`, 'enabled');
              message.channel.send(`Enabled the log : \`Emojis suppression\``);
              await db.delete(`allenabled_${message.guild.id}`);
              break;
          case "11":
              await db.set(`channelcreate_${message.guild.id}`, 'enabled');
              message.channel.send(`Enabled the log : \`Création de salon\``);
              await db.delete(`allenabled_${message.guild.id}`);
              break;
          case "12":
              await db.set(`channeldelete_${message.guild.id}`, 'enabled');
              message.channel.send(`Enabled the log : \`Channels suppression\``);
              await db.delete(`allenabled_${message.guild.id}`);
              break;
          case "all":
              await db.set(`allenabled_${message.guild.id}`, 'enabled');

              await db.set('rolecreate_' + message.guild.id, 'enabled');
              await db.set(`messagedelete_${message.guild.id}`, 'enabled');
              await db.set('roledelete_' + message.guild.id, 'enabled');
              await db.set('messagebulkdelete_' + message.guild.id, 'enabled');
              await db.set('guildmemberremove_' + message.guild.id, 'enabled');
              await db.set('guildmemberadd_' + message.guild.id, 'enabled');
              await db.set('guildbanadd_' + message.guild.id, 'enabled');
              await db.set('guildbanremove_' + message.guild.id, 'enabled');
              await db.set('emojicreate_' + message.guild.id, 'enabled');
              await db.set('emojidelete_' + message.guild.id, 'enabled');
              await db.set('channelcreate_' + message.guild.id, 'enabled');
              await db.set('channeldelete_' + message.guild.id, 'enabled');
              message.channel.send(`Enabled all logs`);
      }
  }

  if (command == "setlogs") {

      if (!message.member.hasPermission(`MANAGE_CHANNELS`) || !message.member.hasPermission(`MANAGE_GUILD`)) return message.channel.send(`You need the \`MANAGE_GUILD\` and \`MANAGE_CHANNELS\` permission.`);
      if (!args[0] || args[1]) return message.reply(`Please specify the channel`);

      x = message.mentions.channels.first();
      if (!x) return message.channel.send(`Please specify the channel`);
      await db.set(`loggingchannel_${message.guild.id}`, x.id);
      message.channel.send(`Logs are now set to ${x}`);
  }

});

const { antiaddbot } = require("./Collection")

client.on("guildMemberAdd", async (member) => {
	const getCollection = antiaddbot.get(member.guild.id)
    if (!getCollection) return;
	if(!getCollection.includes((value) => value.id === member.id)) {
		getCollection.push(member.user)
	}
    if(member.user.bot) member.kick({ reason: "L'anti-bot a été activé." })
})

client.on("messageReactionAdd", async (reaction, user) => {
  if (reaction.message.partial) await reaction.message.fetch()
  if (reaction.partial) await reaction.fetch()
  if (user.bot) return;

  Schema.findOne({ Message: reaction.message.id }, async (err, data) => {
    if (!data) return;
    if (!Object.keys(data.Roles).includes(reaction.emoji.name)) return;

    const [roleid] = data.Roles[reaction.emoji.name]
    reaction.message.guild.members.cache.get(user.id).roles.add(roleid)
      const embed = new Discord.MessageEmbed()
     .setDescription(`Tu viens de recevoir le rôle avec identifiant : ${roleid}.`)
     .setColor(bg)
     .setThumbnail(user.avatarURL({dynamic: true}))

     user.send(embed)
  })
})

const { afk } = require("./Collection")

client.on("message", async(message) => {
  if (!message.guild || message.author.bot) return;

  const mentionedMember = message.mentions.members.first()
  if (mentionedMember) {
    const data = afk.get(mentionedMember.id)

    if (data) {
      const [timestamp, reason] = data
      const timeAgo = moment(timestamp).fromNow()

      message.channel.send(`${mentionedMember} est AFK.\nRaison : ${reason}`)
    }
  }

  const getData = afk.get(message.author.id)
  if (getData) {
    afk.delete(message.author.id)
    message.channel.send(`${message.member}, je viens d'enlever votre AFK`)
  }
})

client.on("messageReactionRemove", async (reaction, user) => {
  if (reaction.message.partial) await reaction.message.fetch()
  if (reaction.partial) await reaction.fetch()
  if (user.bot) return;

  Schema.findOne({ Message: reaction.message.id }, async (err, data) => {
    if (!data) return;
    if (!Object.keys(data.Roles).includes(reaction.emoji.name)) return;

    const [roleid] = data.Roles[reaction.emoji.name]
    reaction.message.guild.members.cache.get(user.id).roles.remove(roleid)
    const embed = new Discord.MessageEmbed()
     .setDescription(`Vous avez perddu le rôle avec ID : ${roleid}.`)
     .setColor(bg)
     .setThumbnail(user.avatarURL({dynamic: true}))

     user.send(embed)
  })
})

const fs = require('fs')

const ranking = require("./Senku/Niveaux/resr");         //load the ranking file

ranking(client);

const Enmap = require("enmap")   

client.points = new Enmap({ name: "points" })

const snipes = new Discord.Collection()

const { GiveawaysManager } = require('discord-giveaways')

client.giveaways = new GiveawaysManager(client, {
    storage: "./giveaways.json",
    UpdateCountdownEvery: 5000
})

const mongoose = require('mongoose')

mongoose.connect(config.mongoPass, {
    useNewUrlParser: true,
	  useUnifiedTopology: true,
	  useFindAndModify: false,
})

client.commands = new Discord.Collection()

const commandFolders = fs.readdirSync("./Senku");
  for (const folder of commandFolders) {
    const commandFiles = fs
      .readdirSync(`./Senku/${folder}`)
      .filter((file) => file.endsWith(".js"));
    for (const file of commandFiles) {
      const command = require(`./Senku/${folder}/${file}`);
      if (command.name) {
        client.commands.set(command.name, command);
        table.addRow(file, "✔️");
      } else {
        table.addRow(
          file,
          "❌ => Cet commande ne possède aucune information/nom."
        );
        continue;
      }
      console.log(table.toString());
    }
}



const custom = require('./Modèles/custom')
const premium = require('./Modèles/premium')

client.on('message', async message => {
  const p = await client.prefix(message)
    if (!message.content.startsWith(p)) return;
    blacklist.findOne({ Guild: message.guild.id, id: message.author.id }, async (err, data) => {
      if (err) throw err;
      if (!data) {
        const args = message.content.slice(p.length).trim().split(/ +/)
        const command = args.shift().toLowerCase()

        const blacklisted = await blacklistguild.findOne({
          Server: message.guild.id
        })
        if(blacklisted) return message.reply(`Ce serveur a été blacklist`)



        const data = await custom.findOne({ Guild: message.guild.id, Command: command })
        if(data) return message.channel.send(data.Response)

        let commands = client.commands.get(command)

        try {
            if(commands.premium && !(await premium.findOne({User: message.author.id}))) return message.reply(`Tu n'est pas en mode premium.`)
            commands.run(client, message, args)
        } catch (error) {
            console.log(error)
        }
      } else {
        message.channel.send(`Tu as été ajouté à la blacklist.`)
      }
    })
})

client.on('guildDelete', async (guild) => {
  prefixSchema.findOne({ Guild: guild.id }, async (err, data) => {
      if (err) throw err;
      if (data) {
          await prefixSchema.findOneAndDelete({ Guild : guild.id }).then(console.log('deleted data.'))
      }
  })
})

client.on('messageDelete', message => {
    snipes.set(message.channel.id, message)
})

client.on('message', message => {
    if (message.content === config.prefix + "snipe") {
        const snipe = snipes.get(message.channel.id)
        if (!snipe) return message.channel.send("Il n'y a aucun message à snipe.")
        message.channel.send(
        new Discord.MessageEmbed()
        .setAuthor(snipe.author.tag, snipe.author.avatarURL({dynamic: true}))
        .setColor("GREEN")
        .setDescription(snipe.content)
        .setFooter("Senku", client.user.avatarURL())
    )
    }
})

client.on('clickMenu', async menu => {
  const Member = await menu.message.guild.members.fetch({ user: menu.clicker.user.id, force: true})
  if(menu.values[0] == 'DR1') {
      if(!Member.roles.cache.has('879800687691714611')) {
          await Member.roles.add('879800687691714611')
          return menu.reply.send("You just got the role <@&879800687691714611>", true)
      } else if(Member.roles.cache.has('879800687691714611')) {
          await Member.roles.remove('879800687691714611')
          return menu.reply.send("I removed you the role <@&879800687691714611>", true)
      }
  }

  if(menu.values[0] == 'DR2') {
      if(!Member.roles.cache.has('879800712639434752')) {
          await Member.roles.add('879800712639434752')
          return menu.reply.send("You just got the role <@&879800712639434752>", true)
      } else if(Member.roles.cache.has('879800712639434752')) {
          await Member.roles.remove('879800712639434752')
          return menu.reply.send("I removed from you the role <@&879800712639434752>", true)
      }
  }

  if(menu.values[0] == 'DR3') {
    if(!Member.roles.cache.has('879800725167804497')) {
        await Member.roles.add('879800725167804497')
        return menu.reply.send("You just got the role <@&879800725167804497>", true)
    } else if(Member.roles.cache.has('879800725167804497')) {
        await Member.roles.remove('879800725167804497')
        return menu.reply.send("I removed you the role <@&879800725167804497>", true)
    }
}

if(menu.values[0] == 'DR4') {
  if(!Member.roles.cache.has('879800700685668432')) {
      await Member.roles.add('879800700685668432')
      return menu.reply.send("You just got the role <@&879800700685668432>", true)
  } else if(Member.roles.cache.has('879800700685668432')) {
      await Member.roles.remove('879800700685668432')
      return menu.reply.send("I removed you the role <@&879800700685668432>", true)
  }
}
})

client.on('clickMenu', async menu => {
  const Member = await menu.message.guild.members.fetch({ user: menu.clicker.user.id, force: true})
  if(menu.values[0] == 'bg1') {
      if(!Member.roles.cache.has('878470399996866580')) {
          await Member.roles.add('878470399996866580')
          return menu.reply.send("You just got the role <@&878470399996866580>. You passed the verification", true)
      } else if(Member.roles.cache.has('878470399996866580')) {
          await Member.roles.remove('878470399996866580')
          return menu.reply.send("I removed you the role <@&878470399996866580>", true)
      }
  }
})



client.on("ready", () => {
    console.log(`${client.user.username}#${client.user.discriminator} est désormais en ligne.`)
})

client.on('message', message => {
    if (message.content ===`<@!${client.user.id}>` || message.content === `<@${client.user.id}>`) {
        return message.channel.send(`Mon préfix initiale : \`+\``)
    }
})

client.login("token")
