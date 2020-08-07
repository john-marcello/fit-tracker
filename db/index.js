const client = require('./client.js')

// get all users

// async function getAllUsers() {
//     const { rows } = await client.query(`SELECT id, username FROM users;`);
//     return rows;
// }


// async function createUser({ username, password }) {
//     try {
//         const { rows: [user] } = await client.query(`
//             INSERT INTO users(username, password) 
//             VALUES($1, $2) 
//             ON CONFLICT (username) DO NOTHING 
//             RETURNING *;
//         `, [username, password] );
//         return user;
//     } catch (error) {
//         throw error;
//     }
// }


// async function updateUser(id, fields = {}) {
//     const setString = Object.keys(fields)
//         .map((key, index) => `"${key}"=$${index + 1}`)
//         .join(', ');

//     if (setString.length === 0) {
//         return;
//     }
//     try {
//         const { rows: [user] } = await client.query(`
//             UPDATE users
//             SET ${setString}
//             WHERE id=${id}
//             RETURNING *;
//         `, Object.values(fields));
//         return user;
//     } catch (error) {
//         throw error;
//     }
// }


// async function createRoutine( { creatorId, name, goal, activities = [] } ) {
//     try {
//         const { rows: [ routine ] } = await client.query(`
//             INSERT INTO routines("creatorId", name, goal) 
//             VALUES($1, $2, $3)
//             RETURNING *;
//         `, [creatorId, name, goal]);
//         const activityList = await Promise.all(
//             activities.map(activity => {
//                 return createActivities(activity.name, activity.description);
//             })
//         );
//         return await addActivitiesToRoutine(routine.id, activityList);
//     } catch (error) {
//         throw error;
//     }
// }


// async function updateRoutine(routineId, fields = {}) {
//     const { activities } = fields;
//     delete fields.activities;
//     const setString = Object.keys(fields).map(
//       (key, index) => `"${ key }"=$${ index + 1 }`
//     ).join(', ');
  
//     try {
//         if (setString.length > 0) {
//             await client.query(`
//                 UPDATE routines
//                 SET ${ setString }
//                 WHERE id=${ routineId }
//                 RETURNING *;
//             `, Object.values(fields));
//       }
//       if (activities === undefined) {
//             return await getRoutineById(routineId);
//       }
//         const activityList = await createActivities(name, description);
//         const activityListIdString = activityList.map(
//             activity => `${activity.id }`
//         ).join(', ');
//         await client.query(`
//             DELETE FROM routine_activities
//             WHERE "activityId"
//             NOT IN (${ activityListIdString })
//             AND "routineId"=$1;
//       `, [routineId]);
//         await addActivitiesToRoutine(routineId, activityList);
//         return await getRoutineById(routineId);
//     } catch (error) {
//         throw error;
//     }
// }


// async function getAllRoutines() {
//     try {
//         const { rows: routineIds } = await client.query(`
//             SELECT id
//             FROM routines;
//         `);
//         const routines = await Promise.all(routineIds.map(
//             routine => getRoutineById( routine.id )
//         ));
//         return routines;
//     } catch (error) {
//       throw error;
//     }
// }


// async function getRoutineById(routineId) {
//     try {
//         const { rows: [ routine ]  } = await client.query(`
//             SELECT *
//             FROM routines
//             WHERE id=$1;
//         `, [routineId]);

//         if (!routine) {
//             throw {
//               name: "RoutineNotFoundError",
//               message: "Could not find a routine with that routineId"
//             };
//           }
          
//         const { rows: activities } = await client.query(`
//             SELECT activities.*
//             FROM activities
//             JOIN routine_activities ON activities.id=routine_activities."activityId"
//             WHERE routine_activities."routineId"=$1;
//         `, [routineId])
//         const { rows: [creator] } = await client.query(`
//             SELECT id, username
//             FROM users
//             WHERE id=$1;
//         `, [routine.creatorId])
//         routine.activities = activities;
//         routine.creator = creator;
//         delete routine.creatorId;
//         return routine;
//     } catch (error) {
//       throw error;
//     }
// }


// // Activities List / Taglist


// async function createActivities(name, description) {
//     try {
//         await client.query(`
//             INSERT INTO activities(name, description)
//             VALUES ($1, $2)
//             ON CONFLICT (name) DO NOTHING;
//         `, [name, description]);
//         const { rows } = await client.query(`
//             SELECT * FROM activities
//             WHERE name
//             IN  ($1, $2);
//         `, [name, description]);
//         return rows[0]
//     } catch (error) {
//         throw error;
//     }
// }


// async function createRoutineActivity(routineId, activityId) {
//     try {
//         await client.query(`
//             INSERT INTO routine_activities("routineId", "activityId")
//             VALUES ($1, $2)
//             ON CONFLICT ("routineId", "activityId") DO NOTHING;
//         `, [routineId, activityId]);
//     } catch (error) {
//         throw error;
//     }
// }


// async function getAllActivities() {
//     try {
//         const { rows } = await client.query(`
//             SELECT * FROM activities;
//         `);
//         return rows;
//     } catch (error) {
//       throw error;
//     }
// }


// async function addActivitiesToRoutine(routineId, activityList) {
//     try {
//         const createActivitiesList = activityList.map(
//             activity => createRoutineActivity(routineId, activity.id)
//         );
//         await Promise.all(createActivitiesList);
//         return await getRoutineById(routineId);
//     } catch (error) {
//         throw error;
//     }
// }


// module.exports = {
//     createUser,
//     updateUser,
//     getAllUsers,
//     createRoutine,
//     updateRoutine,
//     getAllRoutines,
//     getRoutineById,
//     createActivities,
//     getAllActivities,
//     createRoutineActivity,
//     addActivitiesToRoutine
// }