require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const ejs = require('ejs')
const _ = require('lodash')
const encrypt = require('mongoose-encryption')

const app = express()

app.use(bodyParser.urlencoded({ extended: true }))

app.set('view engine', 'ejs')

mongoose.connect('mongodb://127.0.0.1:27017/userDB')

const userSchema = new mongoose.Schema({
    email: String,
    password: String
})

userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: [   'password']})

const allUsers = []

const User = mongoose.model('User', userSchema)

app.use(express.static('public'))

app.get('/', (req,res)=>{
    res.render('home')
})

app.get('/login', (req,res)=>{
    res.render('login')
})

app.get('/register', (req,res)=>{
    res.render('register')
})


app.post('/register', (req,res)=>{
    const email = req.body.username
    const password = req.body.password

    const user = new User({
        email: email,
        password: password
    })

    user.save().then(()=>{
        res.render('secrets')
    }).catch((err)=>{
        console.log(err)
    })

    allUsers.push(user)
})

app.post('/login', (req,res)=>{

    const email = req.body.username
    const password = req.body.password

    User.findOne({email: email}).then((user)=>{
        if(user.password === password){
            res.render('secrets')
        }else{
            res.send('Kindly re-check your email id and password.')
        }
    }).catch((err)=>{
        res.send(err)
    })

})


 

app.listen(3000, () => {
    console.log('Server runnning at port 3000.')
})