const mongoose = require('mongoose')

const PostSchema = mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'UserModel' },
    title: String,
    Description: String,
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'UserModel' }],
    comments: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment' },
    imgUrl: {
        type: String,
        required: true
    }
},
    {
        timestamps: true
    }
)

module.exports = mongoose.model('PostModel', PostSchema)