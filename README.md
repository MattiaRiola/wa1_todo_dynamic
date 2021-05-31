# BigLab 2 - Class: 2021 WA1

## Team name: A short name

Team members:
* s280169 RIOLA MATTIA
* s288200 SCAFFIDI MILITONE GABRIELE
* s281554 SMORTI MARCO

## Instructions

A general description of the BigLab 2 is avaible in the `course-materials` repository, [under _labs_](https://github.com/polito-WA1-AW1-2021/course-materials/tree/main/labs/BigLab2/BigLab2.pdf). In the same repository, you can find the [instructions for GitHub Classroom](https://github.com/polito-WA1-AW1-2021/course-materials/tree/main/labs/GH-Classroom-BigLab-Instructions.pdf), covering this and the next BigLab.

Once cloned this repository, instead, write your names in the above section.

When committing on this repository, please, do **NOT** commit the `node_modules` directory, so that it is not pushed to GitHub.
This should be already automatically excluded from the `.gitignore` file, but double-check.

When another member of the team pulls the updated project from the repository, remember to run `npm install` in the project directory to recreate all the Node.js dependencies locally, in the `node_modules` folder.

Finally, remember to add the `final` tag for the final submission, otherwise it will not be graded.

## List of APIs offered by the server

### Check if the user is logged

* **GET** _/api/sessions/current
* This API check whether the user is logger in or not
* **Sample request**:
``` 
GET http://localhost:3001/api/sessions/current
```

* **POST** _/api/sessions
* login API
* **Sample request**:
``` 
POST http://localhost:3001/api/sessions/current
{username: "user@mail.com", password: "strongPassword"}
```
* **Sample response**:
```
200 OK
```
* **Error response**:
```
401 Unauthenticated user!
```

* **DELETE** _/api/session/current
* API for logout 
``` 
DELETE http://localhost:3001/api/sessions/current
```


### Get filtered tasks

* **GET** _/api/tasks/:filter/_
* This API gives back the filtered tasks by reading "filter" variable and, if necessary a second parameter (for deadline tasks) 

* **Sample request**:
```
GET http://localhost:3001/api/tasks/all
GET http://localhost:3001/api/tasks/important
GET http://localhost:3001/api/tasks/private
GET http://localhost:3001/api/tasks/today
GET http://localhost:3001/api/tasks/completed
GET http://localhost:3001/api/tasks/uncompleted
GET http://localhost:3001/api/tasks/next7days
GET http://localhost:3001/api/tasks/search?id=5
GET http://localhost:3001/api/tasks/deadline?time=YYYY-MM-DD%20HH:mm
GET http://localhost:3001/api/tasks/deadline?time=YYYY-MM-DD
```
* **Sample response**:
```
200 OK
GET http://localhost:3001/api/tasks/deadline/2021-06-20%2000:00
```
* **Error response**:
```
404 Not Found
{"No tasks with ID 34039"}
GET http://localhost:3001/api/tasks/search?id=34039

500 Internal Server Error
{"Invalid deadline"}
GET http://localhost:3001/api/tasks/deadline/thisisinvalidparam

```

### Add task

* **POST** _/api/tasks/new_
* This API adds a task contained in the body of the POST request in JSON format.
* **Sample request**:
``` 
POST http://localhost:3001/api/tasks/new
Content-Type: application/json

{        
    "description": "test api task",
    "important": 1,
    "isPrivate": 1,
    "deadline": "2021-08-06",
    "completed": 1,
    "user": 1  
}
```
* **Sample response**: 
```
200 OK
POST http://localhost:3001/api/tasks/new
```
* **Error response**:
```
500 Internal Server Error
POST http://localhost:3001/api/tasks/new
{"errno":19,"code":"SQLITE_CONSTRAINT"}
```
###

* **POST** _/api/tasks/update_
* This API update an existing task with information contained in the body of the POST request in JSON format. The id of the task to update is written in the body.
* **Sample request**:
``` 
POST http://localhost:3001/api/tasks/update
Content-Type: application/json

{   
    "id": 9, 
    "description": "updating task test from api.http",
    "important": 0,
    "isPrivate": 1,
    "deadline": "2021-05-12 22:50",
    "completed": 1,
    "user": 1
} 
```
* **Sample response**: 
```
200 OK
POST http://localhost:3001/api/tasks/update
```
* **Error response**:
```
404 Not Found
POST http://localhost:3001/api/tasks/update
Content-Type: application/json
{       "id": 900, 
        "description": "updating task test from api.http",
        "important": 0,
        "isPrivate": 1,
        "deadline": "2021-05-12 22:42",
        "completed": 1,
        "user": 1  
} 

500 Internal Server Error
POST http://localhost:3001/api/tasks/update
{"errno":19,"code":"SQLITE_CONSTRAINT"}
```


###
### Set completed/uncompleted

* **POST** _/api/tasks/setCompleted_
* This API sets the completed/uncompleted parameter of a task reading it from the body 
* **Sample request**:
``` 
POST http://localhost:3001/api/tasks/setCompleted
Content-Type: application/json

{ 
    "id": 6, 
    "completed": 1 
}
```
* **Sample response**: 
```
200 OK
POST http://localhost:3001/api/tasks/setCompleted
```
* **Error response**:
```
500 Internal Server Error
POST http://localhost:3001/api/tasks/setCompleted
{"errno":19,"code":"SQLITE_CONSTRAINT"}
```

### Delete task

* **POST** _/api/tasks/delete_
* This API deletes a task which ID is contained in the body of the POST request in JSON format.
* **Sample request**:
``` 
POST http://localhost:3001/api/tasks/delete
Content-Type: application/json

{   "id": 50}
```
* **Sample response**: 
```
200 OK
POST http://localhost:3001/api/tasks/delete
```
* **Error response**:
```
500 Internal Server Error
POST http://localhost:3001/api/tasks/delete
{"errno":19,"code":"SQLITE_CONSTRAINT"}
```