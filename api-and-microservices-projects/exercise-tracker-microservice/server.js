const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();
const userController = require('./controllers/user');
const exerciseController = require('./controllers/exercise');

const app = express();

try {
    mongoose.connect(process.env.MONGOLAB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    if(process.env.NODE_ENV != 'production')
        mongoose.set('debug', true);
} catch (e) {
    console.log(e);
}

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(express.static("public"));

app.get('/', function (req, res) {
    res.sendFile(__dirname + "/views/index.html");
})

app.post('/api/exercise/new-user', userController.addUser);

app.get('/api/exercise/users', userController.findAllUsers);

app.post('/api/exercise/add', exerciseController.addExercise);

app.get('/api/exercise/log?', exerciseController.findAllByUser);

// Not found middleware
app.use((req, res, next) => {
    return next({ status: 404, message: 'not found' })
})

// Error Handling middleware
app.use((err, req, res, next) => {
    let errCode, errMessage

    if (err.errors) {
        // mongoose validation error
        errCode = 400 // bad request
        const keys = Object.keys(err.errors)
        // report the first validation error
        errMessage = err.errors[keys[0]].message
    } else {
        // generic or custom error
        errCode = err.status || 500
        errMessage = err.message || 'Internal Server Error'
    }
    res.status(errCode).type('txt')
        .send(errMessage)
})

const port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log(`Express listening on ${port}`);
});