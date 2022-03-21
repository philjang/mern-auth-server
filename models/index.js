const mongoose = require('mongoose')

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/mernAuth'

mongoose.connect(MONGODB_URI)

const db = mongoose.connection

db.once('open', () => {
    console.log(`Mongoose connected at ${db.host}:${db.port}`)
})

db.on('error', (err) => {
    console.log(`Database error: \n ${err}`)
})

module.exports.User = require('./user')