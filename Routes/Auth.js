const router = require('express').Router()
const User = require('../models/User')
const bcrypt = require('bcrypt')
var jwt = require('jsonwebtoken');

const saltValu = 10
router.post('/authenticate', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email })

        if (user) {
            bcrypt.compare(req.body.password, user.password, (err, result) => {
                console.log(result) 
                    if(err)
                    {
                        return res.json({message:err.message})
                    }
                if (result) {
                    var token = jwt.sign({ email: user.email }, process.env.TOKEN_KEY)
                    res.status(200).json({ token: token })
                }
                else {

                    res.status(403).json({ message: "Wrong Credential" })
                }
            })

        }
        else {
            res.status(404).json({ message: "user not found" })
        }
    } catch (error) {
        res.status(500).json({ message: error })

    }
})
router.post('/register', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email })
        var letterNumber = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/


        if (req.body.password?.length < 5) {
            return res.json({ message: "Password must be 5 character long" })
        }
        if (!user) {    

            bcrypt.hash(req.body.password, saltValu, (err, hash) => {

                if (err) {
                    return res.json({ err })
                }

                const newUser = new User({ email: req.body.email, password: hash, name: req.body?.name })
                console.log(newUser)

                newUser.save().then(response => {
                    return res.status(200).json(response)
                })
            })
        }
        else {
            res.status(403).json({ message: "User already exist" })
        }
    } catch (error) {
        res.status(500).json({ message: error.message })

    }
})


module.exports = router
