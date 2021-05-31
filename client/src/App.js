import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import MyNavbar from './MyNavbar.js';
import MyAside from './MyAside.js';
import MyMainContent from './MyMainContent.js';
import MyModal from './MyModal.js';
import { LoginForm, LogoutButton } from './LoginComponents';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import API from './API.js';

// const fakeTasks = [
//   { id: 1, description: 'laundry', date: dayjs('2021-03-29T23:59'), urgent: false, private: false },
//   { id: 2, description: 'monday lab', date: dayjs('2021-03-16T10:00'), urgent: false, private: false },
//   { id: 3, description: 'phone call', date: dayjs('2021-03-08T16:20'), urgent: true, private: false },
//   { id: 4, description: 'dinner', date: dayjs('2021-03-28T18:00'), urgent: true, private: true },
//   { id: 5, description: 'Meet Douglas', date: dayjs('2021-03-31T13:00'), urgent: false, private: false },
//   { id: 6, description: 'TODAY task', date: dayjs('2021-04-26T16:20'), urgent: true, private: true },
//   { id: 7, description: 'My Task1', date: dayjs().add(1, 'day'), urgent: true, private: true },
//   { id: 8, description: 'task the day after tomorrow', date: dayjs().add(2, 'day'), urgent: true, private: true },
//   { id: 9, description: 'My Task2', date: dayjs().add(-1, 'day'), urgent: true, private: false },
//   { id: 10, description: 'My Task3', date: dayjs().add(8, 'day'), urgent: false, private: false },
//   { id: 11, description: 'My Task in 7 days', date: dayjs().add(7, 'day'), urgent: false, private: false },
//   { id: 12, description: 'my task 12h ago', date: dayjs().add(-12, 'hour'), urgent: false, private: false },
//   { id: 13, description: 'my task  in 1h', date: dayjs().add(1, 'hour'), urgent: false, private: false },
//   { id: 14, description: 'No date task', date: undefined, urgent: true, private: true }
// ];


function App() {
  /**
   * State variable to collapse/uncollapse Aside col on mobiles
   */
  const [open, setOpen] = useState(false);

  /**
   * State variable for modal (add/edit tasks)
   */
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  /**
   * State variable of tasks (contains the list of tasks) to modify/edit
   */
  const [tasks, setTasks] = useState([]); //fakeTasks
  const [lastId, setLastId] = useState(tasks.length);
  /**
   * Server tasks
   */
  //added task stores the new task added by the client clicking on '+' button
  //const [addedTask, setAddedTask] = useState(undefined);
  //boolean variables that indicates if the are changes on server side (in this way the client will reload the tasks)
  //const [serverChanges, setServerChanges] = useState(false);

  const [dirty, setDirty] = useState(false);
  const [loading, setLoading] = useState(true);


  const [selectedFilter, setSelectedFilter] = useState("all");

  /*** Logged in */
  const [loggedIn, setLoggedIn] = useState(false); // at the beginning, no user is logged in
  const [message, setMessage] = useState('');

  //Rehydrate tasks at mount time
  useEffect(() => {
    if (loggedIn) {
      API.getFilteredTasks("all").then(newT => {
        let marshallResult = [];
        newT.forEach(task => {
          marshallResult.push(API.marshallTask(task));
        });
        setTasks(marshallResult);
        setLoading(false);
      });
    }

  }, [loggedIn]);

  // Rehydrate tasks at mount time, and when tasks are updated
  useEffect(() => {
    if (tasks.length && dirty && loggedIn) {
      //console.log("aggiorno da rehydrate, dirty: ", dirty, " tasks.length: ", tasks.length );
      API.getFilteredTasks(selectedFilter).then(newT => {
        let marshallResult = [];
        newT.forEach(task => {
          marshallResult.push(API.marshallTask(task));
        });
        setDirty(false);
        setTasks(marshallResult);
        setLoading(false);
      })
        .catch(err => { console.log(err); setLoading(false) });
    }
  }, [tasks.length, dirty, selectedFilter, loggedIn]);

  const addTask = (task) => {
    //UPDATE LOCAL TASKS WITH NEW TASK (removed if something goes wrong in the POST)
    setTasks(oldTasks => [...oldTasks, task]);

    //ADD THE TASK TO THE SERVER. IF EVERYTHING GOES FINE, SET DIRTY=TRUE

    /**
    * POST request to the server to insert a new task added clicking on plus button
    * this effect set state variable 'dirty' that trigger previous useEffect (that call API.getAllTasks)
    * If addNewTask catch internal a POST error, setting dirty to true guarantee that local state (tasks) is rollbacked
    */
    setLoading(true);
    API.addNewTask(task).then(() => { setDirty(true); });
  }

  const deleteTask = (id) => {
    setTasks(oldTasks => oldTasks.filter(task => task.id !== id));
    setLoading(true);
    API.deleteTask(id).then(() => { setDirty(true); });
  }

  const editTask = (task) => {
    setTasks(oldTasks => {
      return oldTasks.map((tk) => {
        if (tk.id === task.id)
          return { id: task.id, description: task.description, date: task.date, urgent: task.urgent, private: task.private, completed: task.completed };
        else
          return tk;
      });
    })
    setLoading(true);
    API.editTask(task).then(() => { setDirty(true); });
  }

  const setCompletedTask = (id, isCompleted) => {

    setTasks(oldTasks => {
      return oldTasks.map((tk) => {
        if (tk.id === id)
          return { id: tk.id, description: tk.description, date: tk.date, urgent: tk.urgent, private: tk.private, completed: isCompleted };
        else
          return tk;
      });
    })
    setLoading(true);
    API.setCompletedTask(id, isCompleted).then(() => { setDirty(true); });
  }

  const doLogIn = async (credentials) => {
    try {
      const user = await API.logIn(credentials);
      setLoggedIn(true);
      setMessage({ msg: `Welcome, ${user}!`, type: 'success' });
    } catch (err) {
      setMessage({ msg: err, type: 'danger' });
      throw "Incorrect username and/or password";
    }
  }

  const doLogOut = async () => {
    await API.logOut();
    setLoggedIn(false);
    // clean up everything
    setTasks([]);
    setLastId(0);
  }

  return (
    <Router>
      <MyNavbar setOpen={setOpen} open={open} message={message} logout={doLogOut} loggedIn={loggedIn}/>
      <Container fluid>
        <Row className="row-height">
          <>
            {loggedIn ? <MyAside open={open} setSelectedFilter={setSelectedFilter} setDirty={setDirty} setLoading={setLoading} /> : <></>}
          </>
          <Switch>

            {/* in order to use the redirect to login in other paths I've to define first the login route */}
            <Route exact path="/login">
              <>{loggedIn ? <Redirect to="/" /> : <LoginForm login={doLogIn} />}</>
            </Route>
            <Route path="/:filterName" render={({ match }) =>
              <>
                {loggedIn ?
                  <MyMainContent tasks={tasks} filter={match.params.filterName} deleteTask={deleteTask} editTask={editTask} setCompletedTask={setCompletedTask} loading={loading} />
                  : <Redirect to="/login" />
                }
              </>
            } />
            <Route exact path="/" render={() =>
              <>
                {loggedIn ? <MyMainContent tasks={tasks} filter={"All"} deleteTask={deleteTask} editTask={editTask} setCompletedTask={setCompletedTask} loading={loading} /> : <Redirect to="/login" />
                }
              </>
            } />
          </Switch>
        </Row>
        <>
          {loggedIn ? <><MyModal show={show} handleClose={handleClose} addTask={addTask} lastId={lastId} setLastId={setLastId} />
            <button className="btn btn-lg btn-primary rounded-circle radius" variant="primary" onClick={() => { handleShow() }}>+</button></> : <></>}
        </>
      </Container>
    </Router>

  );
}


export default App;
