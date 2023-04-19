const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = require('mongodb').ObjectId;

const postSchema = new Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    creatorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    postedBy: { type: String, required: true },
    postedIn: { type: Schema.Types.ObjectId, ref: 'Subgreddiiit', required: true },
    upvotes: [{type: Schema.Types.ObjectId, ref: 'User'}],
    downvotes: [{type: Schema.Types.ObjectId, ref: 'User'}],
    comments: {type: [String], default:[]},

}, {
    timestamps: true,
});

const Post = mongoose.model('Post',postSchema );

module.exports = Post ;