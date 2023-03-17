const mongoose = require('mongoose')

const CommentSchema = new mongoose.Schema({
    comment:String, 
    userId:{
        type:mongoose.Schema.Types.ObjectId, ref:'UserModel'
    },
    post_id:{
        type:mongoose.Schema.Types.ObjectId, ref:'PostModel'
    }
})

module.exports = mongoose.model('Comment', CommentSchema)