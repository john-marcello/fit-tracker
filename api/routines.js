const express = require('express');
const routinesRouter = express.Router();

const { getAllRoutines } = require('../db');

routinesRouter.use((req, res, next) => {
    console.log('Making a request to /routines');
    next();
});

routinesRouter.get('/', async (req, res) => {
    const routines = await getAllRoutines();
    res.send({
        routines
    });    
});

module.exports = routinesRouter;