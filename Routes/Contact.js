const router = require('express').Router()
const { mongoose } = require('mongoose')
const Comment = require('../models/Comment')
const Post = require('../models/Post')
const Contact = require('../models/Contact')
router.post("/contact", async(req, res) => {
    const name = req.body.firstName + req.body.lastName;
    const email = req.body.email;
    const message = req.body.message;
    const phone = req.body.phone;

    const saved = new Contact({name, email, message, phone})

     saved.save().then(respo=>{
        res.json(respo)
    })



});

module.exports = router