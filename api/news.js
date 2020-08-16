routineActivitiesRouter.patch('/:routineActivityId', requireUser, async (req, res, next) => {
    try {
        const routActivityId = req.params.routineActivityId
        const routObj = await getRoutineById(routActivityId)
      
        const { duration, count } = req.body
        const updateFields = {}
        if (duration) {
            updateFields.duration = duration;
        }
        if (count) {
            updateFields.count = count;
        }
        // console.log('look for the update fields...', updateFields)
        // const originalRoutActivity = await getRoutineActivityByRoutineId(routActivityId);
        //  console.log('this is the original Routineactivity...', originalRoutActivity)
        if (routObj.creator.id === req.user.id) {
            const updatedRoutActivity = await updateRoutineActivity(routActivityId, updateFields);
            console.log('this is the updated RoutineActivity...', updatedRoutActivity)
            res.send({ routine_activities: updatedRoutActivity })
        } else {
            next({ name: 'unauthorizedUserError', message: 'you cannot update a activity unless you are logged in' })
        }
    } catch ({ name, message }) {
        next({ hi: 'hello', name, message })
    }
})