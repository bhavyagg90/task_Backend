const router = require('express').Router()
const Post = require('../models/Post')
const { VerifyToken } = require('../middleware/VerifyToken')
const User = require('../models/User')

router.post('/follow/:id', async (req, res) => {

    try {
        const id = req.params.id
        const user = await User.findById({ _id: id })
        const userId = await User.findById({ _id: id }).select('_id')
        
        const follower = await User.findOne({ email: req.user.email }).select('_id')
        if (userId.equals(follower._id))
        {
            
            return  res.status(403).json({ message: "you cannot follow yourself" })
        }
        
        
        if (user.followers.includes(follower._id)) {
            return res.status(403).json({ message: "You are already following this user" })
        }
        else {
            const updatedFollower = await user.updateOne({ $push: { followers: follower.id } })
                                     await follower.updateOne({ $push: { following: id } })
            if (updatedFollower) {
                res.status(200).json({ message: `You are following ${user.email}` })
            }
        }



    } catch (error) {
        console.log("errr");
        res.status(500).json({ message: error })
    }
})

module.exports = router