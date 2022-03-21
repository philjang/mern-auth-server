const jwt = require('jsonwebtoken')
require('dotenv').config()

const jwtTest = async () => {
    try {
        // simulate a server reponse when a user is logged in
        // create jwt payload
        const payload = {
            name: 'hi im a user',
            id: 'askljfga;lhwoer',
            // password?? - NO. The payload is not secure
            email: 'email@domain.com'
        }
        // sign the jwt
        const secret = 'my secret that the token is signed with; this is like a password'
        const token = jwt.sign(payload, secret, { expiresIn: 60*60 }) // expiresIn is how long the token is good for (in seconds w/no units specified) // can also use a timestamp for the interval
        console.log(token)
        // decode the jwt -- make sure that the secret in the jwt is the same as our server's secret
        // const decode = jwt.verify(token, 'wrong secret') // this will throw an error because the signature is invalid
        const decode = jwt.verify(token, secret)
        console.log(decode)


    } catch (err) {
        console.log(err)
    }
}

jwtTest()