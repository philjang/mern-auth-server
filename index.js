require('./models')
require('dotenv').config()
const cors = require('cors');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 8000;

// middlewares
app.use(cors());
app.use(express.json()); // for json request bodies

// basically what the morgan npm does
const myMiddleWare = (req, res, next) => {
    // console.log('hello from inside a middleware')
    console.log(`incoming request: ${req.method} - ${req.url}`)
    next()
}

app.use(myMiddleWare)

// allows us to insert custom middleware for only certain routes
app.get('/', myMiddleWare, (req, res) => {
    res.json({ msg: 'welcome to the user app' });
});

// controller middleware
app.use('/api-v1/users', require('./controllers/api-v1/users'))

app.listen(PORT, () => {
    console.log(`Server up and running on port ${PORT}`);
});
