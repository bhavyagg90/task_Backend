const router = require('express').Router()
const Post = require('../models/Post')
const { VerifyToken } = require('../middleware/VerifyToken')
const User = require('../models/User')
const Comment = require('../models/Comment')

router.post('/posts', async (req, res) => {

    try {
        const email = req.user.email
        const post = req.body
        const user = await User.findOne({ email: email }).select('_id')
        if (!user) {
            return res.json({ message: "You are not a valid user" })
        }
        const payload = { userId: user._id, title: post.title, Description: post.Description, imgUrl: post.imgUrl }
        const newPost = await new Post(payload)
        const savedpost = await newPost.save()
        res.status(200).json({ post: savedpost })

    } catch (error) {
        res.status(500).json({ message: error })
    }
})

router.get('/posts/:id', async (req, res) => {

    try {
        const post = await Post.findById({ _id: req.params.id })
        if (!post)
            return res.status(404).json({ message: "Post not available" })

        res.status(200).json({ post: { post } })

    } catch (error) {
        res.status(500).json({ message: error })
    }
})
router.get('/all_posts', async (req, res) => {
    console.log(req);

    try {
        const authUser = await User.findOne({ email: req.user.email })
        const posts = await Post.find().populate('userId', 'name').sort({ createdAt: -1 })

        if (!posts)
            return res.status(404).json({ message: "Post not available" })

        res.status(200).json({ posts })

    } catch (error) {
        res.status(500).json({ message: error })
    }
})
router.get('/current_user_post', async (req, res) => {
    console.log(req);

    try {
        const authUser = await User.findOne({ email: req.user.email })
        var stringId = authUser._id.toString()
        const posts = await Post.aggregate([{ $match: { userId: authUser._id } }, { $sort: { createdAt: -1 } }, { $project: { likes: { $size: '$likes' }, title: '$title', comments: "$comments", created_at: '$createdAt', Description: '$Description', imgUrl:'$imgUrl' } }])

        if (!posts)
            return res.status(404).json({ message: "Post not available" })

        res.status(200).json({ posts })

    } catch (error) {
        res.status(500).json({ message: error })
    }
})

router.delete('/posts/:id', async (req, res) => {
    try {
        const postOwner = await User.findOne({ email: req.user.email })

        var stringId = postOwner._id.toString()

        const deletdPost = await Post.findOneAndDelete({ $and: [{ userId: stringId }, { _id: req.params.id }] })

        if (!deletdPost)
            return res.status(404).json({ message: "post is not available" })

        res.status(200).json({ message: "Post deleted successfully" })


    } catch (error) {
        res.status(500).json({ message: error })
    }
})

module.exports = router