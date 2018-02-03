const mongoose = require('mongoose')

const problemSchema = new mongoose.Schema({
    _id: String,
    problem: String,
    solution: String,
    dif: Number,
    path: [String],
    topics: [String],
    topic: String
})

module.exports = mongoose.model('Problem', problemSchema);
