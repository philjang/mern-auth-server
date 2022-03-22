const jwt = require('jsonwebtoken')
const db = require('../models')

async function requiresToken(req,res,next) { // this is a simple version of what one strategy could look like in Passport
    try {
        // get token from the client
        // console.log(req.headers)
        const token = req.headers.authorization

        // verify the token - if not verified, will wind up in catch
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        // console.log(decoded)

        // find the user from the data in the token -- will wind up in catch if invalid user id
        const foundUser = await db.User.findById(decoded.id) // .populate('refs') (if you need the values of referenced model)
        // console.log(foundUser)
        
        // mount the user on the response for the next middleware/route
        res.locals.user = foundUser

        // invoke next to go to the next middleware function
        next()
    } catch (err) {
        // if we are here - authentication has failed
        console.log(err)
        res.status(401).json({ msg: 'unauthorized' })
    }
}

module.exports = requiresToken