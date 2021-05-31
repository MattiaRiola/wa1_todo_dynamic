import 'bootstrap/dist/css/bootstrap.min.css';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import dayjs from 'dayjs';
import { useState, useEffect } from 'react';
import MyModal from './MyModal.js';
//import API from './API.js';

let isToday = require('dayjs/plugin/isToday')
dayjs.extend(isToday)

function MyMainContent(props) {
  return (
    <>
      <Col className="py-2 px-lg-3 border bg-light" id="menu-filter">
        <Title filter={props.filter} loading={props.loading} />
        {props.loading ? "" :
          (<TaskTable tasks={props.tasks} deleteTask={props.deleteTask} editTask={props.editTask} setCompletedTask={props.setCompletedTask} />)}

      </Col>
    </>
  );
}

function Title(props) {
  return (<h1>{props.filter} {props.loading ? (<div className="spinner-border text-primary" role="status">
  <span className="sr-only">Loading...</span>
</div>) : ""}</h1>);
}


function TaskTable(props) {
  return (
    <>
      <ListGroup as="ul" variant="flush">
        {props.tasks.map(task => <TaskRow
          key={task.id}
          id={task.id}
          description={task.description}
          date={task.date}
          urgent={task.urgent}
          private={task.private}
          completed={task.completed}
          deleteTask={props.deleteTask}
          editTask={props.editTask}
          setCompletedTask={props.setCompletedTask} />)}
      </ListGroup>

    </>
  );
}

function TaskRow(props) {
  return (
    <>
      <ListGroup.Item as="li" className="transparent-bg ">
        <Container>
          <Row>
            <Col sm lg="5" >
              <TaskDescription description={props.description} urgent={props.urgent} completed={props.completed}
                id={props.id} setCompletedTask={props.setCompletedTask} />
            </Col>
            <Col>
              <TaskPrivate private={props.private} />
            </Col>
            <Col md="auto">
              <TaskDate date={props.date} />
            </Col>
            <Col md="auto">
              <TaskEditing id={props.id} description={props.description} urgent={props.urgent} private={props.private} date={props.date} editTask={props.editTask} />
              <TaskRemove id={props.id} deleteTask={props.deleteTask} />
            </Col>
          </Row>
        </Container>
      </ListGroup.Item>
    </>
  );
}

function TaskEditing(props) {
  /**
   * State variable for the edit task modal, which is created/destroyed on each single task
   */
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);

  let currentTask = { id: props.id, description: props.description, date: props.date, urgent: props.urgent, private: props.private };
  return (
    <>
      <span onClick={() => {
        setShow(true);
      }}>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-fill" viewBox="0 0 16 16">
          <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z" />
        </svg>
      </span>
      <MyModal show={show} handleClose={handleClose} currentTask={currentTask} editTask={props.editTask} />
    </>
  );
}

function TaskRemove(props) {
  return (
    <>
      <span onClick={() => props.deleteTask(props.id)}>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash2-fill" viewBox="0 0 16 16">
          <path d="M2.037 3.225A.703.703 0 0 1 2 3c0-1.105 2.686-2 6-2s6 .895 6 2a.702.702 0 0 1-.037.225l-1.684 10.104A2 2 0 0 1 10.305 15H5.694a2 2 0 0 1-1.973-1.671L2.037 3.225zm9.89-.69C10.966 2.214 9.578 2 8 2c-1.58 0-2.968.215-3.926.534-.477.16-.795.327-.975.466.18.14.498.307.975.466C5.032 3.786 6.42 4 8 4s2.967-.215 3.926-.534c.477-.16.795-.327.975-.466-.18-.14-.498-.307-.975-.466z" />
        </svg>
      </span>
    </>
  );
}

function TaskDescription(props) {
  //let currentTask = { id: props.id, description: props.description, date: props.date, urgent: props.urgent, private: props.private, completed: props.complete };
  let [completed, setCompleted] = useState(props.completed);
  let [modified, setModified] = useState(false);
  useEffect(() => {
    if (modified) {
      props.setCompletedTask(props.id, completed);
      setModified(false);
    }
  }, [completed, modified, props]);

  return (
    <>
      <span className="p-0">
        <Form.Check inline type="checkbox" id="gridCheck3" onChange={() => {
          setCompleted((old) => !old);
          setModified((old) => !old);
        }}
          checked={completed} ></Form.Check>
        {(props.urgent) ? (<span className="important-text">{props.description}</span>) : props.description}
      </span>
    </>
  );
}

function TaskPrivate(props) {
  return (
    <>
      {(props.private) ? (
        <span className="p-0">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-person-circle" viewBox="0 0 16 16">
            <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
            <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z" />
          </svg>
        </span>
      ) : (<></>)}
    </>
  );
}

function TaskDate(props) {
  return (
    <>
      <span className="p-0">
        {(props.date === undefined) ? "Missing date" : props.date.format('dddd D MMMM YYYY [at] HH:mm')}
      </span>
    </>
  );
}

export default MyMainContent;