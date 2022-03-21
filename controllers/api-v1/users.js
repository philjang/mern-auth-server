const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const db = require('../../models')

// POST /users/register - CREATE a new user
router.post('/register', async (req, res) => {
    try {
        // check if the user exists already -- if so, don't allow them to sign up
        const userCheck = await db.User.findOne({
            email: req.body.email
        })

        if (userCheck) return res.status(409).json({ msg: 'user already exists' })

        // hash the password (could validate if we wanted)
        const salt = 12
        const hashedPassword = await bcrypt.hash(req.body.password, salt)
        
        // create a user in the db
        const newUser = await db.User.create({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        })

        // create a jwt payload to send back to the client
        const payload = {
            name: newUser.name,
            email: newUser.email,
            id: newUser.id // does not need underscore on back-end before id
        }

        // sign the jwt and send it (log them in)
        const token = await jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 60*60 })

        // no status with this because we cannot send anything but the token
        res.json({ token })
        
    } catch (err) {
        console.log(err)
        res.status(503).json({ msg: 'server error 503' })
    }
})

// POST /users/login - validate login credentials
router.post('/login', async (req, res) => {
    try {
        // try to find the user in the db that is logging in
        const foundUser = await db.User.findOne({
            email: req.body.email
        })

        // ambiguous error messages are best practice? 

        // if the user is not found - return out of route and send back a message that the user needs to sign up
        if (!foundUser) return res.status(400).json({ msg: 'invalid user credentials' })

        // check the password from the req.body against the password in the db
        // if the provided info does not match - return out of route and send back an error message
        if (!bcrypt.compareSync(req.body.password, foundUser.password)) return res.status(400).json({ msg: 'invalid user credentials'})
        // or
        // const comparePass = await bcrypt.compare(req.body.password, foundUser.password)
        // if(!comparePass) return res.status(401).json({ msg: 'invalid password'})
        
        // create a jwt payload
        const payload = {
            name: foundUser.name,
            email: foundUser.email,
            id: foundUser.id
        }

        // sign the jwt
        const token = await jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 60*60 })

        // send it back
        res.json({ token })

    } catch (err) {
        console.log(err)
        res.status(503).json({ msg: 'server error 503' })
    }
})

// GET /users/auth-locked - example of checking a jwt and not serving data unless the jwt is vaild
router.get('/auth-locked', (req, res) => {
    res.send('validate a token')
})

module.exports = router