import { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import dayjs from 'dayjs';

function AddTaskForm(props) {
    const [validated, setValidated] = useState(false);

    const handleSubmit = (event) => {
        event.preventDefault();

        const form = event.currentTarget;

        if (form.checkValidity() === false) {
            event.stopPropagation();
        }
        else{
             props.handleAddOrEdit();
         }
        setValidated(true);
        
    };
    

    return (
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Form.Row>
                <Form.Group as={Col} controlId="formBasicDescrption">
                    <Form.Label>Task description</Form.Label>
                    <Form.Control
                        required
                        type="description"
                        placeholder="Enter task description"
                        value={props.description}
                        onChange={td => props.setDescription(td.target.value)}
                    />
                    <Form.Control.Feedback>ok</Form.Control.Feedback>
                </Form.Group>
            </Form.Row>

            {/**
             * The value displayed in the date form is resetted (to undefined) if props.date is == ''
             * This is the case of the Add Modal or Edit modal of a task with Missing Date
             */}
            <Form.Row>
                <Form.Group as={Col} md="8" controlId="formBasicDate">
                    <Form.Label>Date</Form.Label>
                    <Form.Control
                        type="date"
                        placeholder="date"
                        value={props.date!=='' ? dayjs(props.date).format('YYYY-MM-DD').toString() : undefined}
                        onChange={td => props.setDate(td.target.value)}
                    />
                </Form.Group>
                <Form.Group as={Col} md="8" controlId="formBasicHours">
                    <Form.Label>Hours</Form.Label>
                    <Form.Control
                        type="time"
                        placeholder="time"
                        value={props.hours}
                        onChange={td => props.setHours(td.target.value)}
                    />
                </Form.Group>
                </Form.Row>
                <Form.Row>
                    
                <Form.Group as={Col} md="4" controlId="privateCheckbox">
                    <Form.Check type="checkbox" label="Private" onChange={props.changePrivate} checked={props.taskprivate}/>
                </Form.Group>
                <Form.Group as={Col} md="4" controlId="urgentCheckbox">
                    <Form.Check type="checkbox" label="Urgent" onChange={props.changeUrgent} checked={props.urgent}/>
                </Form.Group>
                </Form.Row>
            <Button type="submit">Add task</Button>

        </Form>
    );
}


export default AddTaskForm;