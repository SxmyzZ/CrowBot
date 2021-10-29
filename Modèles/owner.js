const m = require('mongoose')

module.exports = m.model(
    "owner",
    new m.Schema({
        User: String,
        Guild: String
    })
)