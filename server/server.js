'use strict';

const express = require('express') ;
const morgan = require('morgan') ;
const dayjs = require('dayjs');

const PORT = 3001;

const dao = require('./dao');

const app = express();

app.use(morgan('dev')) ; //to see server side some logs
app.use(express.json()); //to parse the tasks from string to json


app.get('/', (req, res) => {
    res.send('Hello World, from your server');
}) ;


/**
 * filter: is the type of the filter
 * firstParam: is optional and it is used for deadline filter 
 * body: (empty)    
 */
app.get('/api/tasks/:filter/:firstParam?', (req, res) => {
    const filter = req.params.filter;
    const firstParam = req.params.firstParam;
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

/**
 * body:
 * description: string 
 * important: 1 or 0
 * isPrivate: 1 or 0
 * deadline: string (date format YYYY-MM-DD HH:mm)
 * completed: 1 or 0
 * user: 1 or 0
 */
app.post('/api/tasks/new', async (req, res) => {
    let description = req.body.description;
    let important = req.body.important;
    let isPrivate = req.body.isPrivate;
    let deadline = req.body.deadline;
    let completed = req.body.completed;
    let user = req.body.user;

    //console.log("This is the description: " + description);
    
    let task = {description: description,
                         important: important,
                         isPrivate: isPrivate,
                         deadline: deadline,
                         completed: completed,
                         user: user};

    try {
        let id = await dao.getLastId();
        //console.log("Last id is: " + id);
        await dao.addTask(id+1,task);
        res.end();
    } catch (error) {
        res.status(500).json(error);
    }
});

app.post('/api/tasks/update', async (req, res) => {
    //console.log(req.body);
    
    let id = req.body.id;
    let description = req.body.description;
    let important = req.body.important;
    let isPrivate = req.body.isPrivate;
    let deadline = req.body.deadline;
    let completed = req.body.completed;
    let user = req.body.user;

    //console.log("This is the description: " + description);
    
    let task = {description: description,
                         important: important,
                         isPrivate: isPrivate,
                         deadline: deadline,
                         completed: completed,
                         user: user};

    try {
        await dao.updateTask(id, task);
        res.end();
    } catch (error) {
        res.status(500).json(error);
    }
});

app.post('/api/tasks/setcompleted', async (req, res) => {
    
    let id = req.body.id;
    let completed = req.body.completed;


    try {
        await dao.setCompletedFieldInTask(id, completed);
        res.end();
    } catch (error) {
        res.status(500).json(error);
    }
});

app.post('/api/tasks/delete', async (req, res) => {
    
    let id = req.body.id;

    try {
        await dao.deleteTask(id);
        res.end();
    } catch (error) {
        res.status(500).json(error);
    }
});





app.listen(PORT, ()=>console.log(`Server running on http://localhost:${PORT}/`));