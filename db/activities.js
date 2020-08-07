const client = require('./client.js')

// getAllActivities
// select and return an array of all activities

// createActivity
// createActivity({ name, description })
// return the new activity

// updateActivity
// updateActivity({ id, name, description })
// don't try to update the id
// do update the name and description
// return the updated activity


async function createActivities(name, description) {
    try {
        await client.query(`
            INSERT INTO activities(name, description)
            VALUES ($1, $2)
            ON CONFLICT (name) DO NOTHING;
        `, [name, description]);
        const { rows } = await client.query(`
            SELECT * FROM activities
            WHERE name
            IN  ($1, $2);
        `, [name, description]);
        return rows[0]
    } catch (error) {
        throw error;
    }
}


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


async function getAllActivities() {
    try {
        const { rows } = await client.query(`
            SELECT * FROM activities;
        `);
        return rows;
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