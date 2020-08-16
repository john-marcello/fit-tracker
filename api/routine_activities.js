const express = require('express');
const routineActivitiesRouter = express.Router();

const { getAllRoutineActivities, getRoutineById, getRoutineActivityById, updateRoutineActivity, destroyRoutineActivity } = require('../db');
const { requireUser } = require('./utils');

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


routineActivitiesRouter.patch('/:routineActivityId', requireUser, async (req, res, next) => {
    try {
        const routineActivityId = req.params.routineActivityId;
        const [{ routineId }] = await getRoutineActivityById(routineActivityId)
        const routineObj = await getRoutineById(routineId);
        
        const { duration, count } = req.body;
        const updateFields = {};

        if(duration) { updateFields.duration = duration; }
        if(count) { updateFields.count = count; }
    
        if ( routineObj.creator.id === req.user.id ) {
            
            const updatedRouteAct = await updateRoutineActivity(routineActivityId, updateFields);
            res.send({
                routine_activities: updatedRouteAct
            })
        } else {
            next({
                name: 'UnauthorizedUserError', 
                message: 'You Suck'
            })
        }
    } catch ({ name, message }) {
        next({ hi: 'hello', name, message })
    }   
});


routineActivitiesRouter.delete('/:routineActivityId', requireUser, async (req, res, next) => {
    try {
        const routineActivityId = req.params.routineActivityId;
        const [{ routineId }] = await getRoutineActivityById(routineActivityId)
        const routineObj = await getRoutineById(routineId);
    
        if ( routineObj.creator.id === req.user.id ) {
            
            await destroyRoutineActivity(routineActivityId);
            const deleteSuccess = 'You have successfully deleted this.'
            res.send({
                routine_activities: deleteSuccess
            })
        } else {
            next({
                name: 'UnauthorizedUserError', 
                message: 'You Suck'
            })
        }
    } catch ({ name, message }) {
        next({ name, message })
    }   
});


module.exports = routineActivitiesRouter;