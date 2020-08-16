const client = require('./client.js');

async function getAllRoutines() {
    try {
        const { rows: routineIds } = await client.query(`
            SELECT id
            FROM routines;
        `);
        const routines = await Promise.all(routineIds.map(
            routine => getRoutineById( routine.id )
        ));
        return routines;
    } catch (error) {
      throw error;
    }
}

async function getPublicRoutines() {
    try {
        const { rows: publicRoutines } = await client.query(`
            SELECT *
            FROM routines
            WHERE public=true;
        `);
        // const routines = await Promise.all(routineIds.map(
        //     routine => getRoutineById( routine.id )
        // ));
        return publicRoutines;
    } catch (error) {
      throw error;
    }
}

async function getRoutinesByUser({ username }) {
    try {
        const { rows: [userId] } = await client.query(`
            SELECT id
            FROM users
            WHERE username=$1
        `, [username]);
        const routineId = userId.id
        const { rows: [routines] } = await client.query(`
            SELECT *
            FROM routines
            WHERE "creatorId"=$1
        `,[routineId]);
        return routines;
    } catch (error) {
      throw error;
    }
}

async function getPublicRoutinesByUser({ username }) {
    try {
        const { rows: [userId] } = await client.query(`
            SELECT id
            FROM users
            WHERE username=$1;
        `, [username]);
        const routineId = userId.id
        const { rows: [routines] } = await client.query(`
            SELECT *
            FROM routines
            WHERE "creatorId"=$1 AND public=true;
        `,[routineId]);
        return routines;
    } catch (error) {
      throw error;
    }
}

async function getPublicRoutinesByActivity({ activityId }) {
    try {
        const { rows: [activity] } = await client.query(`
            SELECT id
            FROM routine_activities
            WHERE "activityId"=$1;
        `, [activityId]);
        const routineId = activity.id
        const { rows: [routines] } = await client.query(`
            SELECT id, public, name, goal
            FROM routines
            WHERE id=$1 AND public=true
        `,[routineId]);
        return routines;
    } catch (error) {
      throw error;
    }
}

async function getRoutineById(routineId) {
    try {
        const { rows: [ routine ]  } = await client.query(`
            SELECT *
            FROM routines
            WHERE id=$1;
        `, [routineId]);
        if (!routine) {
            throw {
              name: "RoutineNotFoundError",
              message: "Could not find a routine with that routineId"
            };
        }
        const { rows } = await client.query(`
            SELECT activities.*
            FROM activities
            JOIN routine_activities ON activities.id=routine_activities."activityId"
            WHERE routine_activities."routineId"=$1;
        `, [routineId])
        const { rows: [creator] } = await client.query(`
            SELECT id, username
            FROM users
            WHERE id=$1;
        `, [routine.creatorId])
        routine.activities = rows;
        routine.creator = creator;
        delete routine.creatorId;
        return routine;
    } catch (error) {
      throw error;
    }
}

async function createRoutine( { creatorId, public, name, goal, activities = [] } ) {
    try {
        const { rows: [ routine ] } = await client.query(`
            INSERT INTO routines("creatorId", public, name, goal) 
            VALUES($1, $2, $3, $4)
            RETURNING *;
        `, [creatorId, public, name, goal]);
        return routine;
        
    } catch (error) {
        throw error;
    }
}

async function updateRoutine(routineId, fields = {}) {
    const setString = Object.keys(fields).map(
        (key, index) => `"${key}"=$${index + 1}`
    ).join(', ');
    
    if (setString.length === 0) {
        return;
    }
    try {
        const { rows: [routine] } = await client.query(`
            UPDATE routines
            SET ${ setString }
            WHERE id=${ routineId }
            RETURNING *;
        `, Object.values(fields));
        return routine;
    } catch (error) {
        throw error;
    }
}

async function destroyRoutine(id) {
    try {
        await client.query(`
            DELETE FROM "routine_activities" 
            WHERE "routineId"=${id};
            DELETE FROM routines
            WHERE id=${id};
        `);
        return true;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    getAllRoutines,
    getPublicRoutines,
    getRoutinesByUser,
    getPublicRoutinesByUser,
    getPublicRoutinesByActivity,
    getRoutineById,
    createRoutine,
    updateRoutine,
    destroyRoutine
}