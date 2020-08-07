const client = require('./client.js')

// getAllRoutines
// select and return an array of all routines, include their activities

// getPublicRoutines
// select and return an array of public routines, include their activities

// getAllRoutinesByUser

// getAllRoutinesByUser({ username })
// select and return an array of all routines made by user, include their activities

// getPublicRoutinesByUser

// getPublicRoutinesByUser({ username })
// select and return an array of public routines made by user, include their activities

// getPublicRoutinesByActivity

// getPublicRoutinesByActivity({ activityId })
// select and return an array of public routines which have a specific activityId in
// their routine_activities join, include their activities

// createRoutine

// createRoutine({ creatorId, public, name, goal })
// create and return the new routine

// updateRoutine

// updateRoutine({ id, public, name, goal })
// Find the routine with id equal to the passed in id
// Don't update the routine id, but do update the public status, name, or goal, as necessary
// Return the updated routine

// destroyRoutine

// destroyRoutine(id)
// remove routine from database
// Make sure to delete all the routine_activities whose routine is the one being deleted.

module.exports = {

}