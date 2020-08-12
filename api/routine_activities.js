const express = require('express');
const routineActivitiesRouter = express.Router();

const { getAllRoutineActivities } = require('../db');

routineActivitiesRouter.use((req, res, next) => {
    console.log('Making a request to /activities');
    next();
});

routineActivitiesRouter.get('/', async (req, res) => {
    const routineActs = await getAllRoutineActivities();
    res.send({
        routineActs
    });    
});

module.exports = routineActivitiesRouter;