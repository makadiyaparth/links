const mongoose = require("mongoose")

const schema = mongoose.Schema({
    title: String,
    href: String,
    tags: [{type: String, trim: true}]
})

module.exports = mongoose.model("Link", schema)