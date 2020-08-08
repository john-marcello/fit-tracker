const client = require('./client.js');

const { getRoutineById } = require('./routines.js');

async function createRoutineActivity(routineId, activityId) {
    try {
        await client.query(`
            INSERT INTO routine_activities("routineId", "activityId")
            VALUES ($1, $2)
            ON CONFLICT ("routineId", "activityId") DO NOTHING;
        `, [routineId, activityId]);
    } catch (error) {
        throw error;
    }
}

async function addActivitiesToRoutine(routineId, activityList) {
    try {
        const createActivitiesList = activityList.map(
            activity => createRoutineActivity(routineId, activity.id)
        );
        await Promise.all(createActivitiesList);
        return await getRoutineById(routineId);
    } catch (error) {
        throw error;
    }
}

module.exports = {
    createRoutineActivity,
    addActivitiesToRoutine
}