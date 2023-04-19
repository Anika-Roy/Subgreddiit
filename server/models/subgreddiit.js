const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = require('mongodb').ObjectId;

const subgreddiitSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String },
    tags: { type: [String], default: [] },
    bannedKeywords: { type: [String], default: [] },
    bannedMembers: [{ type: Schema.Types.ObjectId, ref: 'User' ,default: []}],
    blockedmembers: [{ type: Schema.Types.ObjectId, ref: 'User' ,default: []}],
    notBannedMembers: [{ type: Schema.Types.ObjectId, ref: 'User' ,default: []}],
    posts: [{ type: Schema.Types.ObjectId, ref: 'Post' ,default: []}],
    moderators: [{ type: Schema.Types.ObjectId, ref: 'User' ,default: []}],
    reports: [{ type: Schema.Types.ObjectId, ref: 'Report' ,default: []}],
    requestedUsers: [{ type: Schema.Types.ObjectId, ref: 'User' ,default: []}],
}, {
    timestamps: true,
});

const Subgreddiit = mongoose.model('Subgreddiit',subgreddiitSchema );

module.exports = Subgreddiit ;