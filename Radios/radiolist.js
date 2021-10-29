const Discord = require("discord.js");

module.exports.run = async (bot, message) => {
    let embed = new Discord.RichEmbed()
    .setTitle("Liste des Radios")
    .setDescription("Tu dois etre connecter a un salon vocal pour executer les commandes suivante")
    .setThumbnail("https://i.imgur.com/RVH6pir.png")
    .addField("Hardcore Radio:", "``!hardcoreradio``")
    .addField("Fun Radio France:", "``!funradio``")
    .addField("Contact:", "``!contact``")
    .addField("NRJ France:", "``!nrj``")
    .addField("Skyrock:", "``!skyrock``")
    .addField("Radio FG:", "``!radiofg``")
    .addField("Galaxie Radio", "``!galaxie``")
    .addField("Techno4ever", "``!techno4ever``")
    .addField("Hit-a-jam", "``!hitajam``")
    .addField("Studio Brussel", "``!studiobrussel``")
    .setColor('#606060')
    .setFooter(`Demandé par ${message.author.username}`)
    .setTimestamp()
    message.channel.send(embed);
    message.delete().catch();

    console.log(`Commande ${message.author.lastMessage} executé sur le serveur ${message.guild.name} dans le salon ${message.channel.name} par le membre ${message.author.username} le ${message.createdAt}`)

}

module.exports.help = {
    name: "radiolist",
}    
