const client = require('./client.js');

const { 
    getAllUsers,
    createUser,
    getUser,
    updateUser,
    getAllRoutines,
    getPublicRoutines,
    getRoutinesByUser,
    getPublicRoutinesByUser,
    getPublicRoutinesByActivity,
    createRoutine,
    updateRoutine,
    destroyRoutine,
    getAllActivities,
    createActivity,
    updateActivity,
    getAllRoutineActivities,
    updateRoutineActivity,
    destroyRoutineActivity,
    addActivityToRoutine
} = require('./index.js')

async function dropTables() {
    try {
        console.log('Starting to drop tables...');
        await client.query(`
            DROP TABLE IF EXISTS routine_activities;
            DROP TABLE IF EXISTS activities;
            DROP TABLE IF EXISTS routines;
            DROP TABLE IF EXISTS users;
        `);
        console.log('Finished dropping tables!');
    } catch (error) {
        console.error('Error dropping tables!');
        throw error;
    }
}

async function createTables() {
    try {
        console.log('Starting to build tables...');
        await client.query(`
            CREATE TABLE users (
                id SERIAL PRIMARY KEY,
                username varchar(255) UNIQUE NOT NULL,
                password varchar(255) NOT NULL
            );
            CREATE TABLE routines (
                id SERIAL PRIMARY KEY,
                "creatorId" INTEGER REFERENCES users(id),
                public BOOLEAN DEFAULT false,
                name VARCHAR(255) UNIQUE NOT NULL,
                goal TEXT NOT NULL
            );
            CREATE TABLE activities (
                id SERIAL PRIMARY KEY,
                name varchar(255) UNIQUE NOT NULL,
                description TEXT NOT NULL
            );
            CREATE TABLE routine_activities (
                id SERIAL PRIMARY KEY,
                "routineId" INTEGER REFERENCES routines(id),
                "activityId" INTEGER REFERENCES activities(id),
                UNIQUE("routineId", "activityId"),
                duration INTEGER,
                count INTEGER
            );
      `);
        console.log('Finished building tables!');
    } catch (error) {
        console.error('Error building tables!');
        throw error;
    }
}

async function createInitialUsers() {
    try {
        console.log('Starting to create users...');
        await createUser({
            username: 'johndoe',
            password: 'pass1234',
        });
        await createUser({
            username: 'suziequeue',
            password: 'pass5678',
        });
        await createUser({
            username: 'marysample',
            password: 'password',
        });
        console.log('Finished creating users!');
    } catch (error) {
        console.error('Error creating users!');
        throw error;
    }
}

async function createInitialRoutines() {
    try {
        const [johndoe, suziequeue, marysample] = await getAllUsers();
        
        console.log("Starting to create routines...");
        const testJohn = await createRoutine({
            creatorId: johndoe.id,
            public: false,
            name: 'The Punisher',
            goal: 'Run five miles without throwing up.',
        });

        const testSuzie = await createRoutine({
            creatorId: suziequeue.id,
            public: false,
            name: "How You Like Me Now?",
            goal: "1000 Squat Thrusts",
        });
        const testMary = await createRoutine({
            creatorId: marysample.id,
            public: false,
            name: "You Want Fries With That?",
            goal: "100 crunches and 100 handstand pushups",
        });

        const activityList = await createInitialActivities();
        await addActivityToRoutine(testJohn.id, activityList);
        await addActivityToRoutine(testSuzie.id, activityList);
        await addActivityToRoutine(testMary.id, activityList);

        console.log("Finished creating routines!");

    } catch (error) {
        console.log("Error creating routines!");
        throw error;
    }
}

async function createInitialActivities() {
    
    const actArr = [
        { name: 'stop', description: 'Stop right there.' },
        { name: 'drop', description: 'Drop and give me 20.' },
        { name: 'roll', description: 'Keep on rolling.'} 
    ]
    try {
        console.log("starting to create activities...")
        const activity = await Promise.all(
            actArr.map(act => {
                return createActivity(act.name, act.description)
            })
        )
        console.log("finished creating activities")
        return activity;
    } catch (error) {
        console.log("error creating activities...")
        throw error
    }
}

async function testDB() {
    try {

        console.log('Starting to test database...');


        console.log('Calling getAllUsers');
            const users = await getAllUsers();
        console.log('Result:', users,);
        

        console.log('Calling getUser on users[0]');
            const getUserResult = await getUser({
                username: 'johndoe'
            });
        console.log('Result:', getUserResult);


        console.log('Calling updateUser on users[0]');
            const updateUserResult = await updateUser(users[0].id, {
                username: 'johndeere'
            });
        console.log('Result:', updateUserResult);


        console.log('Calling getAllRoutines');
            const routines = await getAllRoutines();
        console.log('Result:', routines);
        

        console.log("Calling updateRoutine on routines[0], only updating activities");
            const updateRoutineResult = await updateRoutine(routines[0].id, {
                public: true, name: 'The New Punisher', goal: 'Something Different',
            });
        console.log("Result:", updateRoutineResult);


        console.log('Calling getPublicRoutines');
            const publicRoutines = await getPublicRoutines();
        console.log('Result:', publicRoutines);


        console.log('Calling getRoutinesByUser on routines[0]');
            const getRoutinesByUserResult = await getRoutinesByUser({ 
                username: 'johndeere' 
            });
        console.log('Result:', getRoutinesByUserResult);


        console.log('Calling getPublicRoutinesByUser on routines[0]');
            const getPublicRoutinesByUserResult = await getPublicRoutinesByUser({ 
                username: 'johndeere' 
            });
        console.log('Result:', getPublicRoutinesByUserResult);


        console.log('Calling getPublicRoutinesByActivity on routines[0]');
            const getPublicRoutinesByActivityResult = await getPublicRoutinesByActivity({ 
                activityId: 1
            });
        console.log('Result:', getPublicRoutinesByActivityResult);


        console.log('Calling getAllActivities');
            const activities = await getAllActivities();
        console.log('Result:', activities);


        console.log('Calling updateActivities');
            const updateActivityResult = await updateActivity(activities[0].id, {
                name: 'Another One', description: 'This bites the dust.'
            });
        console.log('Result:', updateActivityResult);

        console.log('Calling getAllRoutineActivities');
            const getAllRoutineActsResult = await getAllRoutineActivities();
        console.log('Result:', getAllRoutineActsResult);
        
        console.log('Calling updateRoutineActivity');
            const updateRoutineActivityResult = await updateRoutineActivity(routines[0].id, {
                duration: 10, count: 100
            });
        console.log('Result:', updateRoutineActivityResult);


        console.log('Calling destroyRoutine on routines[0]');
            const destroyRoutineResult = await destroyRoutine(routines[0].id);
            const deletedRoutineResult = await getAllRoutines();
        console.log('Result:', destroyRoutineResult);
        console.log('Result:', deletedRoutineResult);


        console.log('Calling destroyRoutineActivities on routines[1]');
            const destroyRoutineActsResult = await destroyRoutineActivity(routines[1].id);
            const deletedRoutineActsResult = await getAllRoutineActivities();
        console.log('Result:', destroyRoutineActsResult);
        console.log('Result:', deletedRoutineActsResult);


        console.log('End test database...');


    } catch (error) {
        console.log('Error during testDB');
        throw error;
    }
}

async function rebuildDB() {
    try {
        client.connect();
        await dropTables();
        await createTables();
        await createInitialUsers();
        await createInitialRoutines();
        await createInitialActivities();
    } catch (error) {
      console.log("Error during rebuildDB")
      throw error;
    }
  }

rebuildDB()
    .then(testDB)
    .catch(console.error)
    .finally(() => client.end());