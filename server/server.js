'use strict';

const express = require('express');
const morgan = require('morgan');
const dayjs = require('dayjs');
var customParseFormat = require('dayjs/plugin/customParseFormat');
dayjs.extend(customParseFormat);


const PORT = 3001;

const dao = require('./dao');

const app = express();

app.use(morgan('dev')); //to see server side some logs
app.use(express.json()); //to parse the tasks from string to json

//to install for validating (npm install --save express-validator)
const { body, validationResult } = require('express-validator');


app.get('/', (req, res) => {
    res.send('Hello World, from your server');
});



app.get('/api/tasks/:filter/:firstParam?', (req, res) => {
    const filter = req.params.filter;
    const firstParam = req.params.firstParam;
    switch (filter) {
        case "all":
            dao.listTasks()
                //json(tasks) encodes the object "tasks" (which is the result of a query) into the JSON format
                .then((tasks) => { res.json(tasks); })
                .catch((error) => { res.status(500).json(error); });
            break;
        case "deadline":
            console.log("this is the date you are asking for: " + firstParam);

            if (dayjs(firstParam, [
                "YYYY-MM-DD HH:mm",
                "YYYY-MM-DD H:m",
                "YYYY-MM-DD HH:m",
                "YYYY-MM-DD H:mm"
            ], true).isValid()) {
                dao.getTasksByDeadline(firstParam)
                    .then((tasks) => { res.json(tasks); })
                    .catch((error) => { res.status(500).json(error); });
            } else if (dayjs(firstParam, 'YYYY-MM-DD', true).isValid()) {
                let from = firstParam+ " 00:00";
                let to = firstParam+ " 23:59";
                dao.getTasksByDeadlineRange(from, to)
                    .then((tasks) => { res.json(tasks); })
                    .catch((error) => { res.status(500).json(error); });
            } else {
                res.status(500).json("Invalid deadline");
                return;
            }
            break;
        case "important":
            dao.getImportantTasks()
                .then((tasks) => { res.json(tasks); })
                .catch((error) => { res.status(500).json(error); });
            break;
        case "private":
            dao.getPrivateTasks()
                .then((tasks) => { res.json(tasks); })
                .catch((error) => { res.status(500).json(error); });
            break;
        case "completed":
            dao.getCompletedTasks()
                .then((tasks) => { res.json(tasks); })
                .catch((error) => { res.status(500).json(error); });
            break;
        case "uncompleted":
            dao.getUncompletedTasks()
                .then((tasks) => { res.json(tasks); })
                .catch((error) => { res.status(500).json(error); });
            break;
        case "next7days":
            dao.getNext7DaysTasks()
                .then((tasks) => { res.json(tasks); })
                .catch((error) => { res.status(500).json(error); });
            break;
        case "id":
            dao.getTaskById(firstParam)
                .then((tasks) => { res.json(tasks); })
                .catch((error) => { res.status(500).json(error); });
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
            let id = await dao.getLastId();
            //console.log("Last id is: " + id);
            await dao.addTask(id + 1, task);
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

        try {
            await dao.updateTask(id, task);
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
        await dao.setCompletedFieldInTask(id, completed);
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
        await dao.deleteTask(id);
        res.end();
    } catch (error) {
        res.status(500).json(error);
    }
});





app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}/`));