'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const expect = require('chai').expect;
const cors = require('cors');
const helmet = require('helmet');
const apiRoutes = require('./routes/api.js');
const fccTestingRoutes = require('./routes/fcctesting.js');
const runner = require('./test-runner');
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();

try {
    mongoose.connect(process.env.MONGOLAB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    })
    if(process.env.NODE_ENV === 'develop')
        mongoose.set('debug', true);
} catch (e) {
    console.log(e);
}

const app = express();

app.use(helmet.dnsPrefetchControl());
app.use(helmet.frameguard({ action: 'sameorigin' }));
app.use(helmet.referrerPolicy({ policy: 'same-origin' }));

app.use('/public', express.static(process.cwd() + '/public'));

app.use(cors({ origin: '*' })); //For FCC testing purposes only

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Sample front-end
app.route('/b/:board/')
    .get(function (req, res) {
        res.sendFile(process.cwd() + '/views/board.html');
    });
app.route('/b/:board/:threadid')
    .get(function (req, res) {
        res.sendFile(process.cwd() + '/views/thread.html');
    });

//Index page (static HTML)
app.route('/')
    .get(function (req, res) {
        res.sendFile(process.cwd() + '/views/index.html');
    });

//For FCC testing purposes
fccTestingRoutes(app);

//Routing for API 
apiRoutes(app);

//Sample Front-end


//404 Not Found Middleware
app.use(function (req, res, next) {
    res.status(404)
        .type('text')
        .send('Not Found');
});

const port = process.env.PORT || 3000;
//Start our server and tests!
app.listen(port, function () {
    console.log("Listening on port " + port);
    if (process.env.NODE_ENV === 'test') {
        console.log('Running Tests...');
        setTimeout(function () {
            try {
                runner.run();
            } catch (e) {
                let error = e;
                console.log('Tests are not valid:');
                console.log(error);
            }
        }, 1500);
    }
});

module.exports = app; //for testing