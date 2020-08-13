const express = require('express');
const usersRouter = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const { 
    getAllUsers,
    getUser,
    createUser,
    getPublicRoutinesByUser
} = require('../db');


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


usersRouter.get('/:username/routines', async (req, res, next) => {
    const thisUserName = req.params.username;
    try {
        const routines  = await getPublicRoutinesByUser({ 
            username: thisUserName 
        });
        if(!routines) {
            next({
                name: 'NoNoRoutinesForThisUser',
                message: 'This user has no routines'
            })
        } else {
            res.send(routines);   
        }
    } catch ({ name, message }) {
        next({ name, message });
    }   
});


usersRouter.post('/register', async (req, res, next) => {
	try {
        const { username, password } = req.body;
        const SALT_COUNT = 11;
        let securedPassword;
        const _user = await getUser({ username });
        if (_user) {
            next({
                name: 'UserExistsError',
                message: 'A user by that username already exists.',
            });
        }
        if  (password.length<=7) {
            next({
                name: 'PasswordLengthError',
                message: 'The password must be a minimum of at least 8 characters.',
            });
        } else {
            bcrypt.hash(password, SALT_COUNT, async (err, hashedPassword) => {
                securedPassword = hashedPassword;
                const user = await createUser({ username, password: securedPassword });
            
                const token = jwt.sign({ id: user.id, username,}, process.env.JWT_SECRET, { expiresIn: '1w' });
                res.send({ message: 'The user was successfully created', token });
            });
        }
    } catch ({ name, message }) {
        next({ name, message });
    }
});


usersRouter.post('/login', async (req, res, next) => {
    const { username, password } = req.body;
    if (!username || !password) {
        next({
            name: 'MissingCredentialsError',
            message: 'Please enter both a username and a password.',
        });
    }
    try {
        const user = await getUser({ username });
        if (user) {
            let hashedPassword = user.password;
            bcrypt.compare(password, hashedPassword, (err, passwordsMatch) => {
                if (passwordsMatch) {
                    const token = jwt.sign({ id: user.id, username,}, process.env.JWT_SECRET, { expiresIn: '1w' });
                    res.send({ message: 'You are logged in.', token: `${token}` })
                } else {
                    res.send({ message: 'Password does not match.' });
                }
            })
        } else {
            next({
                name: 'IncorrectCredentialsError',
                message: 'Username or password is incorrect.',
            });
        }
    } catch (error) {
        console.log(error);
        next(error.message);
    }
});

module.exports = usersRouter;