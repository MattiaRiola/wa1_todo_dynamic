'use strict';
/* Data Access Object (DAO) module for accessing courses and exams */

const sqlite = require('sqlite3');
const dayjs = require('dayjs');

// open the database
const db = new sqlite.Database('tasks.db', (err) => {
    if (err) throw err;
});

// get all tasks
exports.listTasks = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM tasks';
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            const tasks = rows.map((t) => ({ id: t.id, description: t.description, important: t.important, private: t.private, deadline: t.deadline, completed: t.completed, user: t.user }));
            resolve(tasks);
        });
    });
};

// get tasks with a given deadline
exports.getTasksByDeadline = (deadline) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM tasks WHERE deadline=?';
        db.all(sql, [deadline], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            const tasks = rows.map((t) => ({ id: t.id, description: t.description, important: t.important, private: t.private, deadline: t.deadline, completed: t.completed, user: t.user }));
            resolve(tasks);
        });
    });
};

// get tasks with a given deadline range
exports.getTasksByDeadlineRange = (left,right) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM tasks WHERE deadline>=? AND deadline<?';
        db.all(sql, [left,right], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            const tasks = rows.map((t) => ({ id: t.id, description: t.description, important: t.important, private: t.private, deadline: t.deadline, completed: t.completed, user: t.user }));
            resolve(tasks);
        });
    });
};

// get tasks with filter "IMPORTANT"
exports.getImportantTasks = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM tasks WHERE important = 1';
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            const tasks = rows.map((t) => ({ id: t.id, description: t.description, important: t.important, private: t.private, deadline: t.deadline, completed: t.completed, user: t.user }));
            resolve(tasks);
        });
    });
}

// get tasks with filter "PRIVATE"
exports.getPrivateTasks = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM tasks WHERE private = 1';
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            const tasks = rows.map((t) => ({ id: t.id, description: t.description, important: t.important, private: t.private, deadline: t.deadline, completed: t.completed, user: t.user }));
            resolve(tasks);
        });
    });
}

// get tasks with filter "COMPLETE"
exports.getCompletedTasks = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM tasks WHERE completed = 1';
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            const tasks = rows.map((t) => ({ id: t.id, description: t.description, important: t.important, private: t.private, deadline: t.deadline, completed: t.completed, user: t.user }));
            resolve(tasks);
        });
    });
}

// get tasks with filter "UNCOMPLETE"
exports.getUncompletedTasks = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM tasks WHERE completed = 0';
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            const tasks = rows.map((t) => ({ id: t.id, description: t.description, important: t.important, private: t.private, deadline: t.deadline, completed: t.completed, user: t.user }));
            resolve(tasks);
        });
    });
}

// get tasks with filter "NEXT7DAYS"
exports.getNext7DaysTasks = () => {
    return new Promise((resolve, reject) => {
        const now = dayjs().format('YYYY-MM-DD HH:mm').toString();
        const dayslater = dayjs().add(7, 'day').format('YYYY-MM-DD HH:mm').toString();
        const sql = 'SELECT * FROM tasks WHERE deadline < date(?) AND deadline > date(?)';
        db.all(sql, [dayslater, now], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            const tasks = rows.map((t) => ({ id: t.id, description: t.description, important: t.important, private: t.private, deadline: t.deadline, completed: t.completed, user: t.user }));
            resolve(tasks);
        });
    });
}

// retrieve a task, given its “id”; 
exports.getTaskById = (id) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM tasks WHERE id = ?';
        db.all(sql, [id], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            const tasks = rows.map((t) => ({ id: t.id, description: t.description, important: t.important, private: t.private, deadline: t.deadline, completed: t.completed, user: t.user }));
            resolve(tasks);
        });
    });
}

exports.getLastId = () => {
    //get the highest ID in database
    return new Promise((resolve, reject) => {
        const sql = 'SELECT MAX(id) as lastid FROM tasks';
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(rows[0].lastid);
        });
    });
}

exports.addTask = (id, task) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO tasks(id, description, important, private, deadline, completed, user) VALUES(?, ?, ?, ?, ?, ?, ?)';
        db.all(sql, [id, task.description, task.important, task.isPrivate, task.deadline, task.completed, task.user], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
        
            resolve(id);
        });
    });
}

// updatean existing task, by providing all relevant information (all the properties except the “id”
// will overwrite the current properties of the existing task. The “id” will not change after the update)
exports.updateTask = (id, task) => {
            return new Promise((resolve, reject) => {
                const sql = 'UPDATE tasks SET description=?, important=?, private=?, deadline=?, completed=?, user=? WHERE id = ?';
                db.all(sql, [task.description, task.important, task.isPrivate, task.deadline, task.completed, task.user, id], (err, rows) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    //console.log("Updated task id: " + id);
                
                    resolve(id);
                });
            });
        }

// mark an existing task as completed/uncompleted;
exports.setCompletedFieldInTask = (id, isCompleted) => {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE tasks SET completed=? WHERE id = ?';
        db.all(sql, [isCompleted, id], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            //console.log("task " + id + " change completed status");
            resolve(id);
        });
    });
}

// delete an existing task, given its “id”.
exports.deleteTask = (id) => {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM tasks WHERE id = ?';
        db.all(sql, [id], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            console.log("task " + id + " deleted");
            resolve(id);
        });
    });
}
