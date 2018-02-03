
const mongoose = require('mongoose');
const topicSchema = new mongoose.Schema({
    _id: String,
    title: String,
    path: String,
    prepath: String,
    topicsPath:[String],
    problemsCount: {
        type: Number,
        default: 0
    }
}, {
    toObject: { virtuals: false },
    toJSON: { virtuals: false }
})

topicSchema.virtual('subtopics',{
    localField: 'path',
    foreignField: 'prepath'
})

topicSchema.virtual('problems',{
    ref: 'Problem',
    localField: '_id',
    foreignField: 'path.*'
})


module.exports = mongoose.model('Topic', topicSchema);
