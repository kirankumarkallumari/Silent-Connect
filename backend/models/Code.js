const mongoose = require('mongoose');

const codeSchema = new mongoose.Schema({
    code: String,
    message: String,
    instagram: String,
    createdAt: {
        type:Date,
        default: Date.now,
        expires: 600 //10 mintutes expiry
    },
});

module.exports = mongoose.model('Code',codeSchema);