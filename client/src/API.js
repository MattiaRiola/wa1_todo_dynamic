import dayjs from 'dayjs';

/**
 * Transform a task received from the server to a client-readable task
 */
function marshallTask(task) {
    let taskClient = {
        id: task.id,
        description: task.description,
        date: dayjs(task.deadline).isValid() ? dayjs(task.deadline) : undefined,
        urgent: task.important !== 0 ? true : false,
        private: task.private !== 0 ? true : false,
    }
    return taskClient;
}

/**
 * Transform a client-readable task in a server-readable one 
 */
function unmarshallTask(task) {
    let taskServer = {
        description: task.description,
        important: task.urgent ? 1 : 0,
        isPrivate: task.private ? 1 : 0,
        deadline: task.date !== undefined ? task.date.format('YYYY-MM-DD HH:mm') : "",
        completed: 0,
        user: 1
    }
    return taskServer;
}

async function getAllTasks() {
    try {
        const response = await fetch('/api/tasks/all');
        if (response.ok) {
            const tasks = await response.json();
            return tasks;
        }
        else {
            throw new Error(response.statusText);
        }
    } catch (err) {
        console.log(err);
        throw new Error(err);
    }
}

async function addNewTask(addedTask) {
    addedTask = unmarshallTask(addedTask);

    return fetch('api/tasks/new', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(addedTask)
    })
        .then(() => {
            console.log("task " + addedTask + "added");
        })
        .catch(function (error) {
            console.log('Failed to store data on server: ', error);
        });
};

const API = { getAllTasks, addNewTask, marshallTask, unmarshallTask };


export default API;
