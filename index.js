// configure enviroment module

require('dotenv').config();

// set up express server and post

const PORT = 3000;
const express = require('express');
const server = express();

// set up node server dependencies

const bodyParser = require('body-parser');
const morgan = require('morgan'); 
const apiRouter = require('./api');
const { client } = require('./db/client.js.js.js');

// set up middle ware

server.use(bodyParser.json());
server.use(morgan('dev'));

server.use((req, res, next) => {
    console.log('start body');
    console.log(req.body);
    console.log('end body');
    next();
});

// connect to client and main api endpoint

client.connect();
server.use('/api', apiRouter);

// open port and listen

server.listen(PORT, () => {
    console.log('I am all the way up', PORT);
});