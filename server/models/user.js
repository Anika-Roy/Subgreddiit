const mongoose = require('mongoose');
const SALT_WORK_FACTOR = 10;
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const ObjectId = require('mongodb').ObjectId;

const userSchema = new Schema({
    firstName: { type: String, 
                required: true,
                minlength: 2,
                maxlength: 50},
    lastName: { type: String, 
                required: true,
                minlength: 2,
                maxlength: 50 },
    userName: { type: String, 
                required: true,
                minlength: 2,
                maxlength: 50,
                unique: true },
    password: { type: String, 
                required: true,
                minlength: 2 },
    email: { type: String, 
            required: true },
    contactNo: { type: Number, 
                required: true,
                minlength: 10,
                maxlength: 10},
    age: { type: Number, 
        required: true,
        min: 18},
    followers: [{ type: Schema.Types.ObjectId, ref: 'User' ,default: []}],
    following: [{ type: Schema.Types.ObjectId, ref: 'User' , default: []}],
    createdSubGreddiits: [{ type: Schema.Types.ObjectId, ref: 'Subgreddiit' , default: []}],
    joinedSubGreddiits: [{ type: Schema.Types.ObjectId, ref: 'Subgreddiit' , default: []}],
    savedPosts: [{ type: Schema.Types.ObjectId, ref: 'Post' , default: []}],
    // createdPosts: [{ type: Schema.Types.ObjectId, ref: 'Post' , default: []}],
}, {
    timestamps: true,
});

userSchema.pre('save', function (next) {
    var user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
        if (err) return next(err);

        // hash the password using our new salt
        bcrypt.hash(user.password, salt, function (err, hash) {
            if (err) return next(err);

            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });


});

userSchema.methods.comparePassword = function (candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

const User = mongoose.model('User', userSchema);

module.exports = User;