const m = require('mongoose')

module.exports = m.model(
    "whitelist",
    new m.Schema({
        User: String,
        Guild: String
    })
)