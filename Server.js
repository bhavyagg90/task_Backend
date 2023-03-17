const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()
const app= express()
const Auth = require('./Routes/Auth')

const GetUser = require('./Routes/GetUser')
const Contact = require('./Routes/Contact')

const nodemailer = require("nodemailer");
mongoose.set('strictQuery', true)
mongoose.connect(process.env.MONGO_URL, {useNewUrlParser:true}).then(()=>{
    console.log('database Connected..');
}).catch(err=>{
    console.log(err.message);
})


const contactEmail = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: "pravinkumartemhua@gmail.com",
      pass: "fqwumibtvziffjzl"
    },
  });
  
  contactEmail.verify((error) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Ready to Send");
    }
  });

app.use(express.json())
app.use(cors())

app.post("/contact", (req, res) => {
    const name = req.body.firstName + req.body.lastName;
    const email = req.body.email;
    const message = req.body.message;
    const phone = req.body.phone;
    const mail = {
      from: name,
      to: "pravinkumartemhua@gmail.com",
      subject: "Contact Form Submission - Portfolio",
      html: `<p>Name: ${name}</p>
             <p>Email: ${email}</p>
             <p>Phone: ${phone}</p>
             <p>Message: ${message}</p>`,
    };
    contactEmail.sendMail(mail, (error) => {
      if (error) {
        res.json(error);
      } else {
        res.json({ code: 200, status: "Message Sent" });
      }
    });
  });
 const { verifyToken } = require('./middleware/VerifyToken')
app.use('/api', Auth)
app.use('/api',Contact)
app.use('/api', verifyToken,GetUser)

const PORT = process.env.PORT


app.listen(PORT||5000, ()=>{
    console.log(`server runnig on port ${process.env.PORT}`);
})