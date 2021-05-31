'use strict';

const express = require('express');
const morgan = require('morgan');
const session = require('express-session'); // session middleware

const dayjs = require('dayjs');
var customParseFormat = require('dayjs/plugin/customParseFormat');
dayjs.extend(customParseFormat);


const PORT = 3001;

const passport = require('passport');
const passportLocal = require('passport-local');

const task_dao = require('./task-dao');
const user_dao = require('./user-dao');


// initialize and configure passport
passport.use(new passportLocal.Strategy((username, password, done) => {
    // verification callback for authentication
    user_dao.getUser(username, password).then(user => {
        if (user)
            done(null, user);
        else
            done(null, false, { message: 'Username or password wrong' });
    }).catch(err => {
        done(err);
    });
}));

// serialize and de-serialize the user (user object <-> session)
// we serialize the user id and we store it in the session: the session is very small in this way
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// starting from the data in the session, we extract the current (logged-in) user
passport.deserializeUser((id, done) => {
    user_dao.getUserById(id)
        .then(user => {
            done(null, user); // this will be available in req.user
        }).catch(err => {
            done(err, null);
        });
});


const app = express();

app.use(morgan('dev')); //to see server side some logs
app.use(express.json()); //to parse the tasks from string to json


// custom middleware: check if a given request is coming from an authenticated user
// simple way could be check req.isAuthenticated() at the beginning of every callback body in each route to protect
const isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated())
    // SE SONO AUTENTICATO POSSO PROCEDERE A CHIAMARE LA FUNZIONE CHE SEGUE, CHE SARA' IL CORPO DELLE RICHIESTE GET/POST
      return next();  
    // altrimenti ritorno l'errore e non proseguo al prossimo middleware
    return res.status(401).json({ error: 'not authenticated' });
}

// initialize and configure HTTP sessions
app.use(session({
    secret: 'The secret of aShortName. We really do love Corno please 30L us',
    resave: false,
    saveUninitialized: false
  }));
  
// tell passport to use session cookies
app.use(passport.initialize());
app.use(passport.session());


//to install for validating (npm install --save express-validator)
const { body, validationResult, query } = require('express-validator');


app.get('/', (req, res) => {
    res.send('Hello World, from your server');
});

app.get('/api/tasks/:filter', 
        // isLoggedIn,  //to deny access by not logged users to filters api
         (req, res) => {
    const filter = req.params.filter;
    const deadline = req.query.time;
    const id = req.query.id;
    switch (filter) {
        case "all":
            task_dao.listTasks()
                //json(tasks) encodes the object "tasks" (which is the result of a query) into the JSON format
                .then((tasks) => { res.json(tasks); })
                .catch((error) => { res.status(500).json(error); });
            break;
        case "deadline":
            console.log("this is the date you are asking for: " + deadline);

            if (dayjs(deadline, [
                "YYYY-MM-DD HH:mm",
                "YYYY-MM-DD H:m",
                "YYYY-MM-DD HH:m",
                "YYYY-MM-DD H:mm"
            ], true).isValid()) {
                task_dao.getTasksByDeadline(deadline)
                    .then((tasks) => {
                        if (Object.entries(tasks).length === 0)
                            res.status(404).json("No tasks with deadline " + deadline);
                        else
                            res.json(tasks);
                    })
                    .catch((error) => { res.status(500).json(error); });
            } else if (dayjs(deadline, 'YYYY-MM-DD', true).isValid()) {
                let from = deadline + " 00:00";
                let to = deadline + " 23:59";
                task_dao.getTasksByDeadlineRange(from, to)
                    .then((tasks) => {
                        if (Object.entries(tasks).length === 0)
                            res.status(404).json("No tasks with deadline " + deadline);
                        else
                            res.json(tasks);
                    })
                    .catch((error) => { res.status(500).json(error); });
            } else {
                res.status(500).json("Invalid deadline");
                return;
            }
            break;
        case "today":
            let today = dayjs();
            let from = today.format("YYYY-MM-DD").toString() + " 00:00";
            let to = today.format("YYYY-MM-DD").toString() + " 23:59";
            task_dao.getTasksByDeadlineRange(from, to)
                .then((tasks) => {
                    if (Object.entries(tasks).length === 0)
                        res.status(404).json("No today tasks");
                    else
                        res.json(tasks);
                })
                .catch((error) => { res.status(500).json(error); });
            break;
        case "important":
            task_dao.getImportantTasks()
                .then((tasks) => {
                    if (Object.entries(tasks).length === 0)
                        res.status(404).json("No important tasks");
                    else
                        res.json(tasks);
                })
                .catch((error) => { res.status(500).json(error); });
            break;
        case "private":
            task_dao.getPrivateTasks()
                .then((tasks) => {
                    if (Object.entries(tasks).length === 0)
                        res.status(404).json("No private tasks");
                    else
                        res.json(tasks);
                })
                .catch((error) => { res.status(500).json(error); });
            break;
        case "completed":
            task_dao.getCompletedTasks()
                .then((tasks) => {
                    if (Object.entries(tasks).length === 0)
                        res.status(404).json("No completed tasks");
                    else
                        res.json(tasks);
                })
                .catch((error) => { res.status(500).json(error); });
            break;
        case "uncompleted":
            task_dao.getUncompletedTasks()
                .then((tasks) => {
                    if (Object.entries(tasks).length === 0)
                        res.status(404).json("No uncompleted tasks");
                    else
                        res.json(tasks);
                })
                .catch((error) => { res.status(500).json(error); });
            break;
        case "next7days":
            task_dao.getNext7DaysTasks()
                .then((tasks) => {
                    if (Object.entries(tasks).length === 0)
                        res.status(404).json("No tasks in 7days");
                    else
                        res.json(tasks);
                })
                .catch((error) => { res.status(500).json(error); });
            break;
        case "search":
            if (!isNaN(id)) {
                task_dao.getTaskById(id)
                    .then((tasks) => {
                        if (Object.entries(tasks).length === 0)
                            res.status(404).json("No tasks with id " + id);
                        else
                            res.json(tasks);
                    })
                    .catch((error) => { res.status(500).json(error); });
            } else {
                res.status(500).json("Invalid ID");
            }
            break;
    }
});


app.post('/api/tasks/new',
    body('important').isBoolean(),
    body('isPrivate').isBoolean(),
    //body('deadline').isDate(),      checked manually inside the function
    body('completed').isBoolean(),
    body('user').isNumeric(),
    async (req, res) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        let description = req.body.description;
        let important = req.body.important;
        let isPrivate = req.body.isPrivate;
        let deadline;
        let completed = req.body.completed;
        let user = req.body.user;

        if (req.body.deadline == "") {
            deadline = null;
        } else {
            if (!(dayjs(req.body.deadline, [
                "YYYY-MM-DD",
                "YYYY-MM-DD HH:mm",
                "YYYY-MM-DD H:m",
                "YYYY-MM-DD HH:m",
                "YYYY-MM-DD H:mm",
            ], true).isValid())) {
                res.status(500).json("Invalid deadline");
                return;
            } else {
                deadline = req.body.deadline;
            }
        }


        //console.log("This is the description: " + description);

        let task = {
            description: description,
            important: important,
            isPrivate: isPrivate,
            deadline: deadline,
            completed: completed,
            user: user
        };

        try {
            let id = await task_dao.getLastId();
            //console.log("Last id is: " + id);
            await task_dao.addTask(id + 1, task);
            res.end();
        } catch (error) {
            res.status(500).json(error);
        }
    });

app.post('/api/tasks/update',
    body('id').isNumeric(),
    body('important').isBoolean(),
    body('isPrivate').isBoolean(),
    //body('deadline').isDate(),      checked manually inside the function
    body('completed').isBoolean(),
    body('user').isNumeric(),
    async (req, res) => {
        //console.log(req.body);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        let id = req.body.id;
        let description = req.body.description;
        let important = req.body.important;
        let isPrivate = req.body.isPrivate;
        let deadline;
        let completed = req.body.completed;
        let user = req.body.user;


        if (req.body.deadline == "") {
            deadline = null;
        } else {
            if (!(dayjs(req.body.deadline, [
                "YYYY-MM-DD",
                "YYYY-MM-DD HH:mm",
                "YYYY-MM-DD H:m",
                "YYYY-MM-DD HH:m",
                "YYYY-MM-DD H:mm",
            ], true).isValid())) {
                res.status(500).json("Invalid deadline");
                return;
            } else {
                deadline = req.body.deadline;
            }
        }
        //console.log("This is the description: " + description);

        let task = {
            description: description,
            important: important,
            isPrivate: isPrivate,
            deadline: deadline,
            completed: completed,
            user: user
        };

        task_dao.getTaskById(id)
            .then((tasks) => {
                if (Object.entries(tasks).length === 0)
                    res.status(404).json("No tasks with id " + id);
            })
            .catch((error) => { res.status(500).json(error); });

        try {
            await task_dao.updateTask(id, task);
            res.end();
        } catch (error) {
            res.status(500).json(error);
        }
    });

app.post('/api/tasks/setcompleted', body('id').isNumeric(), body('completed').isBoolean(), async (req, res) => {

    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
        /*         server will respond like this:
                {
                    "errors": [
                      {
                        "location": "body",
                        "msg": "Invalid value",
                        "param": "completed"
                      }
                    ]
                  } */
    }

    let id = req.body.id;
    let completed = req.body.completed;


    try {
        await task_dao.setCompletedFieldInTask(id, completed);
        res.end();
    } catch (error) {
        res.status(500).json(error);
    }
});

app.post('/api/tasks/delete', body('id').isNumeric(), async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    let id = req.body.id;

    try {
        await task_dao.deleteTask(id);
        res.end();
    } catch (error) {
        res.status(500).json(error);
    }
});





app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}/`));