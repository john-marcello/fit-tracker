const express = require('express');
const usersRouter = express.Router();

const { getAllUsers } = require('../db');
const { getUser } = require('../db');
const { createUser } = require('../db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

jwt.sign({ id: 2, username: 'suziequeue' }, process.env.JWT_SECRET);

const token = jwt.sign({ id: 2, username: 'suziequeue' }, 'secretaccesskey', { expiresIn: '1h', });


usersRouter.use((req, res, next) => {
    console.log('Making a request to /users');
    next();
});


usersRouter.get('/', async (req, res) => {
    const users = await getAllUsers();
    const user = await getUser({
        username: 'johndeere'
    });
    res.send({
        users, user
    });
});


// usersRouter.post('/register', async (req, res, next) => {
//     try {
//         const { username, password } = req.body;
//         const SALT_COUNT = 11;
//         const _user = await getUser(username);
//         if (_user) {
//             next({
//                 name: 'UserExistsError',
//                 message: 'A user by that username already exists',
//             });
//         }
//         bcrypt.hash(password, SALT_COUNT, function(err, hashedPassword) {
//             createUser({ username, password: hashedPassword});
//             console.log(hashedPassword);
//         });
//         const user = await createUser({ username, password });
//         const token = jwt.sign({ id: user.id, username,}, process.env.JWT_SECRET, { expiresIn: '1w' });
//         res.send({
//             message: 'Thank you for signing up.',
//             token,
//         });
//     } catch ({ name, message }) {
//         next({ name, message });
//     }
// });


usersRouter.post('/register', async (req, res, next) => {
	try {
        const { username, password } = req.body;
        const SALT_COUNT = 11;
        let securedPassword;
        
		bcrypt.hash(password, SALT_COUNT, async (err, hashedPassword) => {

            const _user = await getUser(username);
            if (_user) {
                next({
                    name: 'UserExistsError',
                    message: 'A user by that username already exists',
                });
            }
            console.log(_user, '_user')

			console.log(hashedPassword);
            securedPassword = hashedPassword;
            console.log(securedPassword);

            const user = await createUser({ username, password: securedPassword });
            
            const token = jwt.sign({ id: user.id, username,}, process.env.JWT_SECRET, { expiresIn: '1w' });
            
            res.send({ message: 'The user was successfully created', token });
            
		})
    } catch ({ name, message }) {
        next({ name, message });
    }
});


// usersRouter.post('/login', async (req, res, next) => {
//     const { username, password } = req.body;
//     // request must have both
//     if (!username || !password) {
//         next({
//             name: 'MissingCredentialsError',
//             message: 'Please enter both a username and a password.',
//         });
//     }
//     try {
//         const user = await getUser({username});
//         if (user && user.password == password) {
//             // create token & return to user
//             res.send({ message: 'You are logged in!', token: `${token}` });
//         } else {
//             next({
//                 name: 'IncorrectCredentialsError',
//                 message: 'Username or password is incorrect.',
//             });
//         }
//     } catch (error) {
//         console.log(error);
//         next(error.message);
//     }
// });

module.exports = usersRouter;