const router = require('express').Router()
const Post = require('../models/Post')
const { VerifyToken } = require('../middleware/VerifyToken')
const User = require('../models/User')

router.post('/like/:id', async (req, res) => {

    try {
        const id = req.params.id
        const post = await Post.findOne({ _id: id })
        const liker = await User.findOne({ email: req.user.email }).select('_id')
        const liked = post.likes?.includes(liker._id)
        if (liked) {
            return res.status(403).json({ message: "You are already liked it" })
        }
        else {
            const updatedLikes = await post.updateOne({ $push: { likes: liker._id } })

            if (updatedLikes) {
                res.status(200).json({ message: `You Liked the post` })
            }
        }



    } catch (error) {
        console.log("errr");
        res.status(500).json({ message: error })
    }
})
router.post('/unlike/:id', async (req, res) => {

    try {
        const id = req.params.id
        const post = await Post.findOne({ _id: id })
        const liker = await User.findOne({ email: req.user.email }).select('_id')

        if (!post.likes.includes(liker._id)) {
            return res.status(403).json({ message: "You can't unlike it" })
        }
        else {
            const updatedLikes = await post.updateOne({ $pull: { likes: liker._id } })

            if (updatedLikes) {
                res.status(200).json({ message: `You Unliked the post` })
            }
        }



    } catch (error) {
        console.log("errr");
        res.status(500).json({ message: error })
    }
})


module.exports = router