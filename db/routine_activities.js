const client = require('./client.js');
const { getRoutineById } = require('./routines.js');

async function getAllRoutineActivities() {
    try {
        const { rows } = await client.query(`
            SELECT * FROM routine_activities;
        `);
        return rows;
    } catch (error) {
      throw error;
    }
}

async function createRoutineActivity(routineId, activityId, duration, count) {
    try {
        await client.query(`
            INSERT INTO routine_activities("routineId", "activityId", duration, count)
            VALUES ($1, $2, $3, $4)
            ON CONFLICT ("routineId", "activityId") DO NOTHING;
        `, [routineId, activityId, duration, count]);
    } catch (error) {
        throw error;
    }
}

async function updateRoutineActivity(routineId, fields = {}) {
    const setString = Object.keys(fields).map(
        (key, index) => `"${key}"=$${index + 1}`
    ).join(', ');
    if (setString.length === 0) {
        return;
    }
    try {
        const { rows: [routine_acts] } = await client.query(`
            UPDATE routine_activities
            SET ${ setString}
            WHERE id=${ routineId }
            RETURNING *;
        `, Object.values(fields));
        return routine_acts;
    } catch (error) {
        throw error;
    }
}

async function addActivityToRoutine(routineId, activityList) {
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

async function destroyRoutineActivity(id) {
    try {

        await client.query(`
            DELETE FROM "routine_activities" 
            WHERE "routineId"=${id};
        `);
        return true;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    getAllRoutineActivities,
    createRoutineActivity,
    updateRoutineActivity,
    destroyRoutineActivity,
    addActivityToRoutine
}