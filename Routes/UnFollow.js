const router = require('express').Router()
const Post = require('../models/Post')
const { VerifyToken } = require('../middleware/VerifyToken')
const User = require('../models/User')

router.post('/unfollow/:id', async (req, res) => {

    try {
        const id = req.params.id
        const user = await User.findById({ _id: id })
        
        const userId = await User.findById({ _id: id }).select('_id')

        const follower = await User.findOne({ email: req.user.email }).select('_id')
        // console.log(userId.equals(follower._id), userId);
        if (userId.equals(follower._id)) {


            return res.status(403).json({ message: "you cannot Unfollow yourself" })
        }

        if (!user.followers.includes(follower._id)) {
            return res.status(403).json({ message: "You are not following this user" })
        }
        else {
            var stringId = follower._id.toString()
             await user.updateOne({ $pull: { followers: stringId } })
             await follower.updateOne({ $pull: { following: id } })
            
            res.status(200).json({ message: `You have Unfollowed ${user.email}` })

           
        }

    } catch (error) {
        console.log("errr");
        res.status(500).json({ message: error })
    }
})

module.exports = router