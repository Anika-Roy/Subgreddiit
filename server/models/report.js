const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = require('mongodb').ObjectId;

const reportSchema = new Schema({
    concern: { type: String, required: true },
    reportedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    reportedUser: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    reportedPost: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
    reportedIn: { type: Schema.Types.ObjectId, ref: 'Subgreddiit', required: true },
    ignored: { type: Boolean, default: false },
}, {
    timestamps: true,
});

const Report = mongoose.model('Report',reportSchema );

module.exports = Report ;