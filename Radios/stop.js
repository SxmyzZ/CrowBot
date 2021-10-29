const Discord = require("discord.js");
const YTDL = require("ytdl-core");

module.exports.run = async (bot, message, args, ops) => {
    if (!message.member.hasPermission("STREAM")) return errors.noPerms(message, "STREAM");
    if (!message.member.voiceChannel) return errors.noinchanvocal(message);
    if (!message.guild.me.voiceChannel) return errors.botpresence(message);
    if (!message.guild.me.voiceChannelID) return errors.noevenchan(message);
    message.guild.me.voiceChannel.leave();
    let stopembed = new Discord.RichEmbed()
    .setTitle("**Déconnexion**")
    .setDescription('Fin de la lecture, déconnexion du channel vocal ...')
    .setFooter(`Déconnexion effectuée par ${message.author.username}`)
    message.channel.send(stopembed);
    message.delete().catch();

    console.log(`Commande ${message.author.lastMessage} executé sur le serveur ${message.guild.name} dans le salon ${message.channel.name} par le membre ${message.author.username} le ${message.createdAt}`)
    console.log(`${bot.user.username} a quitté un salon vocal`)

}

module.exports.help = {
    name: "stop",
}    
