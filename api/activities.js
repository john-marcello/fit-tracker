const express = require('express');
const activitiesRouter = express.Router();

const { 
    getAllActivities, 
    createActivity, 
    updateActivity, 
    getPublicRoutinesByActivity 
} = require('../db');

const { requireUser } = require('./utils');

activitiesRouter.use((req, res, next) => {
    console.log('Making a request to /activities');
    next();
});

activitiesRouter.get('/', async (req, res) => {
    const activities = await getAllActivities();
    res.send({
        activities
    });    
});

activitiesRouter.post('/', requireUser, async (req, res) => {
    const { name, description } = req.body;
    activity = await createActivity(name, description);
    console.log(activity, 'activity');

    res.send({
       activity
    });   

});

activitiesRouter.patch('/:activityId', requireUser, async (req, res, next) => {
    const { activityId } = req.params;
    const { name, description } = req.body;
    const updateFields = {};
    // technical debt: add check for if activity id exists
    if (name) {
        updateFields.name = name;
    }
    if (description) {
        updateFields.description = description;
    }  
    try {
        const updatedActivity = await updateActivity(activityId, updateFields);
        res.send({ 
            activity: updatedActivity 
        });
        
    } catch ({ name, message }) {
        next({ name, message });
    }   
});

activitiesRouter.get('/:activityId/routines', async (req, res, next) => {
    const thisActivityId = req.params.activityId;
    console.log('The id is',thisActivityId);
    try {
        const routines  = await getPublicRoutinesByActivity({ 
            activityId: thisActivityId 
        });
        console.log('This is', routines);
        if(!routines) {
            next({
                name: 'NoNRoutinesHaveThisActivity',
                message: 'This activity has no routines'
            })
        } else {
            res.send(routines);   
        }
    } catch ({ name, message }) {
        next({ name, message });
    }   
});

module.exports = activitiesRouter;