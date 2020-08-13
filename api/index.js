const express = require('express');
const apiRouter = express.Router();

const usersRouter = require('./users');
const routinesRouter = require('./routines');
const activitiesRouter = require('./activities');
const routineActivitiesRouter = require('./routine_activities');

apiRouter.use('/users', usersRouter);
apiRouter.use('/routines', routinesRouter);
apiRouter.use('/activities', activitiesRouter);
apiRouter.use('/routineactivities', routineActivitiesRouter);

// apiRouter.use(async (req, res, next) => {
//     const prefix = 'Bearer ';
//     const auth = req.header('Authorization');
//     if (!auth) { 
//         next();
//     } else if (auth.startsWith(prefix)) {
//         const token = auth.slice(prefix.length);
//         try {
//             const { id } = jwt.verify(token, JWT_SECRET);
//             if (id) {
//                 req.user = await getUser(id);
//                 next();
//             }
//         } catch ({ name, message }) {
//             next({ name, message });
//         }
//     } else {
//         next({
//             name: 'AuthorizationHeaderError',
//             message: `Authorization token must start with ${prefix}`
//         });
//     }
// });

apiRouter.use((error, req, res, next) => {
    res.send(error);
  });

module.exports = apiRouter;