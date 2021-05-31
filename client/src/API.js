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
        completed: task.completed !== 0 ? true : false
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
        completed: task.completed ? 1 : 0,
        user: 1
    }
    return taskServer;
}

// async function getAllTasks() {
//     try {
//         const response = await fetch('/api/tasks/all');
//         if (response.ok) {
//             const tasks = await response.json();
//             return tasks;
//         }
//         else {
//             throw new Error(response.statusText);
//         }
//     } catch (err) {
//         console.log(err);
//         throw new Error(err);
//     }
// }

async function getFilteredTasks(filter) {
    try {
        const response = await fetch('/api/tasks/' + filter);
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

async function deleteTask(id) {

    return fetch('api/tasks/delete', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: id })
    })
        .then(() => {
            console.log("task " + id + "deleted");
        })
        .catch(function (error) {
            console.log('Failed to delete data on server: ', error);
        });
};

async function editTask(task) {
    let editTask = unmarshallTask(task);
    task = { id: task.id, ...editTask };

    console.log("trying to edit: ", task);
    return fetch('api/tasks/update', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(task)
    })
        .then(() => {
            console.log("task " + task.id + "updated");
        })
        .catch(function (error) {
            console.log('Failed to update data on server: ', error);
        });

}

async function setCompletedTask(id, isCompleted) {
    return fetch('api/tasks/setCompleted', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: id, completed: isCompleted ? 1 : 0 })
    })
        .then(() => {
            console.log("task " + id + "set as " + isCompleted);
        })
        .catch(function (error) {
            console.log('Failed to set completed on server the task: ', error);
        });
}

/*************************************************************************************/
/* USER AND AUTHENTICATION API */

async function logIn(credentials) {
    let response = await fetch('/api/sessions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
    });
    if (response.ok) {
        const user = await response.json();
        return user.name;
    }
    else {
        try {
            const errDetail = await response.json();
            throw errDetail.message;
        }
        catch (err) {
            throw err;
        }
    }
}

async function logOut() {
    await fetch('/api/sessions/current', { method: 'DELETE' });
}

async function getUserInfo() {
    const response = await fetch('/sessions/current');
    const userInfo = await response.json();
    if (response.ok) {
        return userInfo;
    } else {
        throw userInfo;  // an object with the error coming from the server
    }
}



const API = { addNewTask, marshallTask, unmarshallTask, getFilteredTasks, deleteTask, editTask, setCompletedTask, logIn, logOut };


export default API;
