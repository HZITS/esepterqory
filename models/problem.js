const mongoose = require('mongoose')

const problemSchema = new mongoose.Schema({
    _id: String,
    problem: String,
    solution: String,
    number: String,
    dif: Number,
    path: [String],
    topics: [String],
    topic: String
},{
  timestamps: true,
  minimize: true
})

module.exports = mongoose.model('Problem', problemSchema);
