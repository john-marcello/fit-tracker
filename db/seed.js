const client = require('./client.js');

const { 
    getAllUsers, 
    createUser, 
    updateUser 
} = require('./users');

const { 
    getAllActivities, 
    createActivities, 
    updateActivity 
} = require('./activities.js');

const { 
    getAllRoutines, 
    getPublicRoutines, 
    getAllRoutinesByUsers, 
    getPublicRoutinesByUser, 
    getAllRoutinesByActivity, 
    createRoutine, 
    updateRotuine, 
    destroyRoutine 
} = require('./routines');

const { 
    addActivityToRoutine, 
    updateRoutineActivity, 
    destroyRoutineActivity 
} = require('./routine_activities');

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
        await createRoutine({
            creatorId: johndoe.id,
            name: 'The Punisher',
            goal: 'Run five miles without throwing up.',
            activities: [ 
                {name: 'stop', description: 'Stop right there.'},
                {name: 'drop', description: 'Drop and give me 20.'},
                {name: 'roll', description: 'Keep on rolling.'} 
            ]
        });
        await createRoutine({
            creatorId: suziequeue.id,
            name: "How You Like Me Now?",
            goal: "1000 Squat Thrusts",
            activities: [ 
                {name: 'stop', description: 'Stop right there.'},
                {name: 'drop', description: 'Drop and give me 20.'},
                {name: 'roll', description: 'Keep on rolling.'} 
            ]
        });
        await createRoutine({
            creatorId: marysample.id,
            name: "You Want Fries With That?",
            goal: "100 crunches and 100 handstand pushups",
            activities: [ 
                {name: 'stop', description: 'Stop right there.'},
                {name: 'drop', description: 'Drop and give me 20.'},
                {name: 'roll', description: 'Keep on rolling.'} 
            ]
        });
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
                createActivities(act.name, act.description)
            })
        )
        console.log("finished creating activities")
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
        
        console.log('Calling updateUser on users[0]');
        const updateUserResult = await updateUser(users[0].id, {
            username: 'johndeere'
        });
        console.log('Result:', updateUserResult);

        console.log('Calling getAllRoutines');
        const routines = await getAllRoutines();
        console.log('Result:', routines);
        
        console.log("Calling updateRoutine on routines[1], only updating activities");
        const updateRoutineActivitiesResult = await updateRoutine(routines[0].id, {
            activities: [ 
                {name: 'go', description: 'Go for it.'},
                {name: 'do', description: 'Just do it.'},
                {name: 'be', description: 'Be one with the force.'} 
            ]
        });
        console.log("Result:", updateRoutineActivitiesResult);

        console.log('Calling getUserById with 1');
        const albert = await getUserById(1);
        console.log('Result:', johndoe);
        console.log('Finished database tests!');

        console.log("Calling getRoutinesByActivityName with stop");
        const postsWithStop = await getRoutinesByActivityName("stop");
        console.log("Result:", postsWithStop);

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