import { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import dayjs from 'dayjs';
import AddTaskForm  from './AddTaskForm';

function MyModal(props) {
  /**
   * Distinguish between Modal opened for editing (currentTask setted) or for adding a new Task 
   */

  const [description, setDescription] = useState(props.currentTask ? props.currentTask.description : '');
  /**
   * In editing mode check if the task had a previous setted date
   */
  const [date, setDate] = useState(props.currentTask ? 
    (props.currentTask.date ? dayjs(props.currentTask.date) : '' )
    : '') ;
  const [taskprivate, setTaskprivate] = useState(props.currentTask ? props.currentTask.private : false);
  const [urgent, setUrgent] = useState(props.currentTask ? props.currentTask.urgent : false);

  const [hours, setHours] = useState(props.currentTask ? (props.currentTask.date ? dayjs(props.currentTask.date).format('HH:mm').toString() : '') : '');

  const handleAdd = (event) => {
    /**
     * Retrieved hours and minuted from state hours setted by the form
     */
    const time = hours ? hours.split(":") : "23:59".split(":");
    const hour = time[0];
    const minutes = time[1];

    const task = {id: props.lastId+1, description: description, date:( dayjs(date).isValid()) ?  dayjs(date).set('h',hour).set('m',minutes) : undefined , urgent: urgent, private: taskprivate};

    
    props.addTask(task);

  /**
   * Clean up the field of the modal for next task to add
   */
    setDescription('');
    setDate('');
    setHours('');
    setTaskprivate(false);
    setUrgent(false);

    props.handleClose();
    
    props.setLastId((old) => old+1);
  };

  const handleEdit = (event) => {
    const time = hours.split(":");
    const hour = time[0];
    const minutes = time[1];
    
    const task = {id: props.currentTask.id, description: description, date:( dayjs(date).isValid()) ?  dayjs(date).set('h',hour).set('m',minutes) : undefined , urgent: urgent, private: taskprivate};
    
    props.editTask(task);
    props.handleClose();
    
  };
  /**
   * DEPRECATED: (it was used by the close button in modal footer )
   * close the modal in a clean way
   */
  // const handleCancel = (event) => {
  //   props.handleClose();
  //   setDescription('');
  //   setDate('');
  //   setTaskprivate(false);
  //   setUrgent(false);
  // }

  /**
   * setter to change state based on their previous value
   */
  
  const changePrivate = () => setTaskprivate(!taskprivate);
  const changeUrgent = () => setUrgent(!urgent);

  /**
   * AddTaskForm receive as a prop the callback to use in the correct situation
   * hanleEdit if the modal is a edit one, handleAdd if the modal is actived by pression of the '+' button
   */
  return (
    <>
      <Modal show={props.show} onHide={props.handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{props.currentTask ? "Edit task" : "Add a new task"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <AddTaskForm handleAddOrEdit={props.currentTask ? handleEdit : handleAdd} setDescription={setDescription} setDate={setDate} changePrivate={changePrivate} changeUrgent={changeUrgent} setHours={setHours} hours={hours} description={description} date={date} taskprivate={taskprivate} urgent={urgent}/>
        </Modal.Body>
        
      </Modal>
    </>
  );
}

export default MyModal;