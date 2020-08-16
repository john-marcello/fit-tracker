const express = require('express');
const routinesRouter = express.Router();

const { getAllRoutines, getActivityById, createRoutine, updateRoutine, getRoutineById, destroyRoutine, addActivityToRoutine } = require('../db');
const { requireUser } = require('./utils');

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


routinesRouter.post('/', requireUser, async (req, res) => {
    const { public, name, goal } = req.body;
    const creatorId = req.user.id;
    routine = await createRoutine( { creatorId, public, name, goal, } );
    res.send({
        routine
    });
});


routinesRouter.patch('/:routineId', requireUser, async (req, res, next) => {
    const routine = await getRoutineById(req.params.routineId); 
    const { public, name, goal } = req.body;
    const updateFields = {};

    if (name) { updateFields.name = name; }
    if (goal) { updateFields.goal = goal; }
    if (public) { updateFields.public = public;  } 

    try {
        if (routine && routine.creator.id === req.user.id) {
            const updatedRoutine = await updateRoutine(routine.id, updateFields);
            res.send({ 
                routine: updatedRoutine
            });
        }
    } catch ({ name, message }) {
        next({ name, message });
    }
});


routinesRouter.post('/:routineId/activities', async (req, res, next) => {
    const routine = await getRoutineById(req.params.routineId); 
    const activityObj = await getActivityById(req.body.activityId);

    try {
        const addAct = await addActivityToRoutine(routine.id, [activityObj]);
        if(addAct) {
            res.send(addAct);
        } else {
            console.log('else');
            'Some error message'
        }
    } catch ({ name, message }) {
        console.log(name);
        next({ name, message });
    }
});


routinesRouter.delete('/:routineId', requireUser, async (req, res, next) => {
    try {
      const routine = await getRoutineById(req.params.routineId);
  
      if (routine && routine.creator.id === req.user.id) {
        const destroyThis = await destroyRoutine(routine.id);
  
        res.send({ routine: destroyThis });
      } else {
        next(routine ? { 
          name: "UnauthorizedUserError",
          message: "You cannot delete a routine which is not yours."
        } : {
          name: "PostNotFoundError",
          message: "That routine does not exist."
        });
      }
  
    } catch ({ name, message }) {
      next({ name, message })
    }
});

module.exports = routinesRouter;