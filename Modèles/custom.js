const mongoose = require('mongoose')

module.exports = mongoose.model('custom', new mongoose.Schema({
    Guild: String,
    Command: String,
    Response: String
}))