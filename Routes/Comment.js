const router = require('express').Router()
const { mongoose } = require('mongoose')
const Comment = require('../models/Comment')
const Post = require('../models/Post')
const User = require('../models/User')
router.post('/comment/:id', async (req, res) => {

    try {
        const postId = req.params.id
        const userId = await User.findOne({ email: req.user.email }).select('_id')
        const ispost = Post.findById({_id:postId})
        if(!ispost)
        {
            return res.status(400).json({message:"post id is not a valid id"})
        }
        else {
            const newcomment = new Comment({
                comment:req.body.comment, 
                userId:userId, 
                post_id:postId
            })
                        
            newcomment.save().then(resp=>{
                Post.findByIdAndUpdate(postId, {$push:{comments:resp._id}},  (err, post) => {
                    if (err) {
                      return res.status(500).json({ success: false, msg: err.message });
                    }
                    res.status(200).json({ success: true, commentId:resp._id });
                  })
                
            }).catch(err=>res.status(500).json({message:err}))
        }



    } catch (error) {
        console.log("errr");
        res.status(500).json({ message: error })
    }
})

module.exports = router