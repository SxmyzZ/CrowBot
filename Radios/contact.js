const Discord = require("discord.js");
//const ffmpeg = require("ffmpeg-binaries");
const opusscript = require("opusscript");

module.exports.run = async (bot, message, args) => {
    if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.reply("Tu n'as pas la permission d'exécuter cette commande!");
    if (message.member.voiceChannel) {
        message.member.voiceChannel.join()
        .then(connection => {
            let embed = new Discord.RichEmbed()
            .setTitle("Contact")
            .setDescription("**Connected**")
            .setColor('#606060')
			.setURL("http://www.mycontact.fr/")
			.setImage("https://i.imgur.com/3yLtz7v.png")
			.setTimestamp()
            connection.playArbitraryInput(`http://radio-contact.ice.infomaniak.ch/radio-contact-high`);
			message.channel.send(embed);
			message.delete().catch();
        })
        .catch(console.log);
    } else {
        message.reply('Tu dois etre dans un channel vocal !');
    }

    console.log(`Commande ${message.author.lastMessage} executé sur le serveur ${message.guild.name} dans le salon ${message.channel.name} par le membre ${message.author.username} le ${message.createdAt}`)
    console.log(`${bot.user.username} a rejoint un salon vocal`)
    
};

module.exports.help = {
    name: "contact"
}    