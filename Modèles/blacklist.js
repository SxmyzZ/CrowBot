const mongoose = require('mongoose')

let Schema = new mongoose.Schema({
    id: String,
    Guild: String,
})

module.exports = mongoose.model('blacklist', Schema)