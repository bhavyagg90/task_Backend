const router = require('express').Router()
const User = require('../models/User')
router.get('/user', async (req, res) => {

    try {
        // const user = await User.findOne({email:req.user.email})
        const userdetails = await User.aggregate([{$match:{email:req.user.email}},{$project: { followers: { $size: '$followers' }, following: { $size: '$following' },username:'$email', name:"$name"}}])

        if (!userdetails)
            return res.status(404).json({ message: "user not available" })

        res.status(200).json({ ...userdetails?.[0] })

    } catch (error) {
        res.status(500).json({ message: error })
    }
})

module.exports = router
