'use strict';

require('dotenv').config();
var mongo = require('mongodb');
var mongoose = require('mongoose');
var app = require('./app');

// Basic Configuration 
var port = process.env.PORT || 3000;

/** this project needs a db !! **/
mongoose.connect(process.env.MONGOLAB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => app.listen(port, function () {
    console.log(`Node.js listening on port: ${port}...`);
  })).catch(e => {
    console.log(e);
  });