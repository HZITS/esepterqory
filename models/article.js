const mongoose = require('mongoose')

const articleSchema = new mongoose.Schema({
    _id: String,
    article: String,
    title: String,
    dif: Number,
    path: [String],
    topics: [String],
    topic: String,
    seen: {
        type: Number,
        default: 0
    },
    downloaded: {
        type: Number,
        default: 0
    }
},{
  timestamps: true,
  minimize: true
})

module.exports = mongoose.model('Article', articleSchema);
