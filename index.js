const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const path = require('path');
require('dotenv').config();


const app = express();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

let emailId;
let emailPwd; 


  emailId = process.env.EMAIL;
  emailPwd = process.env.EMAIL_PWD;

  if(process.env.NODE_ENV === 'production') {
    emailId = process.env.HEROKU_EMAIL;
    emailPwd = process.env.HEROKU_EMAIL_PWD;
    app.use(express.static('learning/build'))
    app.get('*', (req,res)=> res.sendFile(path.resolve(__dirname, 'learning', 'build', 'index.html')))
    
  }  

app.post('/api/form', (req,res) => {
        console.log('Received')
        console.log(process.env.NODE_ENV)
    
        const htmlEmail = `
        <h3>Contact Details</h3>
        <ul>
            <li>Name : ${req.body.name}</li>
            <li>Email-Id : ${req.body.email}</li>
        </ul>
        <h3>Message</h3>
        <img src="https://unsplash.com/photos/f77Bh3inUpE/download?force=true&w=1920" alt="Image of computer" width="900" height="300">
        <p>${req.body.message}</p>
        `
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: `${emailId}`,
              pass: `${emailPwd}`
            }
          });

         let mailOptions = {
            from: 'shashankkr384@gmail.com',
            to: 'shashank.mayur@gmail.com',
            subject: 'New Contact through Portfolio',
            html: htmlEmail
          };

          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });
    })

   

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
})