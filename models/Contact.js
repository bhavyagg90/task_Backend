const mongoose = require('mongoose')

const PostSchema = mongoose.Schema({
    message:String,
    email: String,
    name:String,
    phone:String
},
    {
        timestamps: true
    }
)

module.exports = mongoose.model('Contact', PostSchema)