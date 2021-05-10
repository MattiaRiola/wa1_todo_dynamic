'use strict';

const express = require('express') ;
const morgan = require('morgan') ;

const PORT = 3001;

const dao = require('./dao');

const app = express();

app.use(morgan('dev')) ; //to see server side some logs
app.use(express.json()); //to parse the tasks from string to json


app.get('/', (req, res) => {
    res.send('Hello World, from your server');
}) ;

// app.get('/api/alltasks', (req, res) => {
//     dao.listTasks()
//         //json(tasks) encodes the object "tasks" (which is the result of a query) into the JSON format
//         .then((tasks) => { res.json(tasks); })
//         .catch((error) => {res.status(500).json(error); });
// }) ;

// app.get('/api/tasks/:deadline', (req, res) => {
//     dao.getTasksByDeadline(req.params.deadline)
//         .then((tasks) => { res.json(tasks); })
//         .catch((error) => {res.status(500).json(error); });
// }) ;

app.get('/api/tasks/:filter/:firstParam?', (req, res) => {
    const filter = req.params.filter;
    const firstParam = req.params.firstParam;
    //console.log("Variables are: " + req.params + " ");
    switch(filter) {
        case "all":
            dao.listTasks()
            //json(tasks) encodes the object "tasks" (which is the result of a query) into the JSON format
            .then((tasks) => { res.json(tasks); })
            .catch((error) => {res.status(500).json(error); });
        break;
        case "deadline":
            dao.getTasksByDeadline(firstParam)
            .then((tasks) => { res.json(tasks); })
            .catch((error) => {res.status(500).json(error); });
        break;
        case "important":
            dao.getImportantTasks()
            .then((tasks) => { res.json(tasks); })
            .catch((error) => {res.status(500).json(error); });
        break;
        case "private":
            dao.getPrivateTasks()
            .then((tasks) => { res.json(tasks); })
            .catch((error) => {res.status(500).json(error); });
        break;
        case "completed":
            dao.getCompletedTasks()
            .then((tasks) => { res.json(tasks); })
            .catch((error) => {res.status(500).json(error); });
        break;
        case "uncompleted":
            dao.getUncompletedTasks()
            .then((tasks) => { res.json(tasks); })
            .catch((error) => {res.status(500).json(error); });
        break;
        case "next7days":
            dao.getNext7DaysTasks()
            .then((tasks) => { res.json(tasks); })
            .catch((error) => {res.status(500).json(error); });
        break;
        case "id":
            dao.getTaskById(firstParam)
            .then((tasks) => { res.json(tasks); })
            .catch((error) => {res.status(500).json(error); });
        break;
    }
}) ;

app.post('/api/tasks/new', async (req, res) => {
    console.log(req.body);
    let description = req.body.description;
    let important = req.body.important;
    let isPrivate = req.body.isPrivate;
    let deadline = req.body.deadline;
    let completed = req.body.completed;
    let user = req.body.user;

    console.log("This is the description: " + description);
    
    let task = {description: description,
                         important: important,
                         isPrivate: isPrivate,
                         deadline: deadline,
                         completed: completed,
                         user: user};

    try {
        let id = await dao.getLastId();
        await dao.addTask(id,task);
        res.end();
    } catch (error) {
        res.status(500).json(error);
    }

    

    // dao.createTask({description: description,
    //                 important: important,
    //                 isPrivate: isPrivate,
    //                 deadline: deadline,
    //                 completed: completed,
    //                 user: user     
    //     })
    //     .then(res.end())
    //     .catch((error) => {res.status(500).json(error); });
});



app.listen(PORT, ()=>console.log(`Server running on http://localhost:${PORT}/`));