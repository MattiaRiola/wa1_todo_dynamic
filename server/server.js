'use strict';

const express = require('express') ;
const morgan = require('morgan') ;

const PORT = 3001;

const dao = require('./dao');

const app = express();

app.use(morgan('dev')) ;
app.use(express.json());


app.get('/', (req, res) => {
    res.send('Hello World, from you server');
}) ;

app.get('/api/alltasks', (req, res) => {
    dao.listTasks()
        .then((tasks) => { res.json(tasks); })
        .catch((error) => {res.status(500).json(error); });
}) ;


app.listen(PORT, ()=>console.log(`Server running on http://localhost:${PORT}/`));