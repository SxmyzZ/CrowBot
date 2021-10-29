const { Collection } = require("discord.js")

const afk = new Collection()
const antijoin = new Collection()
const antiaddbot = new Collection()
const antichannel = new Collection()

module.exports = { afk, antijoin, antiaddbot, antichannel }