require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const ejs = require('ejs')
const _ = require('lodash')
const bcrypt = require('bcrypt')
const { hash } = require('bcryptjs')

const saltRounds = 10

const app = express()

app.use(bodyParser.urlencoded({ extended: true }))

app.set('view engine', 'ejs')

mongoose.connect('mongodb://127.0.0.1:27017/userDB')

const userSchema = new mongoose.Schema({
    email: String,
    password: String
})

const User = mongoose.model('User', userSchema)

app.use(express.static('public'))

app.get('/', (req, res) => {
    res.render('home')
})

app.get('/login', (req, res) => {
    res.render('login')
})

app.get('/register', (req, res) => {
    res.render('register')
})


app.post('/register', (req, res) => {
    const email = req.body.username
    const password = req.body.password

    bcrypt.hash(password, saltRounds).then((hash) => {
        const user = new User({
            email: email,
            password: hash
        })

        user.save().then(() => {
            res.render('secrets')
        }).catch((err) => {
            console.log(err)
        })
    }).catch((err) => {
        console.log(err)
    })



})

app.post('/login', (req, res) => {

    const email = req.body.username
    const password = req.body.password

    User.findOne({ email: email }).then((user) => {
        bcrypt.compare(password, user.password).then((response) => {
            if (response === true) {
                res.render('secrets')
            }else{
                res.render('login')
            }
        }).catch((err) => {
            res.send(err)
        })

    })
})




app.listen(3000, () => {
    console.log('Server runnning at port 3000.')
})