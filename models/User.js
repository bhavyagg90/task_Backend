const mongoose = require('mongoose')


const UserSchema = new mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        min: 4
    },
    followers: {
        type: Array,
        default: []
    },
    following: {
        type: Array,
        default: []
    }
},
    {
        timestamps: true
    }

)

module.exports = mongoose.model('UserModel', UserSchema)