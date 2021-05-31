import { Form, Button, Alert, Col, Row, Container } from 'react-bootstrap';
import { useState } from 'react';
//import { Redirect } from 'react-router';

function LoginForm(props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [validated, setValidated] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    setErrorMessage('');
    const credentials = { username, password };

    // SOME VALIDATION, ADD MORE!!!
    let valid = true;
    if (username === '' || password === '' || password.length < 6)
      valid = false;

    if (valid) {
      props.login(credentials).catch( (err) => {setErrorMessage(err)});
    }
    else {
        // show a better error message...
        setErrorMessage('Error(s) in the form, please try again.')
    }
    setValidated(true);   // "I've completed my works, please show me your validation result"
  };

  return (
    <>
      <Container>
          <Row className="justify-content-md-center mt-5 pt-5 ml-3">
            <h1>Hello guest!</h1>
          </Row>
        <Row className="justify-content-md-center pt-5 ml-3">
          <Form noValidate validated={validated}>
            {errorMessage ? <Alert variant='danger'>{errorMessage}</Alert> : ''}
            <Form.Group controlId='username'>
              <Form.Label>email</Form.Label>
              <Form.Control required type='email' placeholder="Insert email here" value={username} onChange={ev => setUsername(ev.target.value)} />
            </Form.Group>
            <Form.Group controlId='password'>
              <Form.Label>Password</Form.Label>
              <Form.Control required type='password' placeholder="Insert password here" value={password} onChange={ev => setPassword(ev.target.value)} />
            </Form.Group>
            <Button onClick={handleSubmit}>Login</Button>
          </Form>
        </Row>
      </Container>
    </>)
}

function LogoutButton(props) {
  return (
    <Col>
      <Button variant="outline-primary" onClick={props.logout}>Logout</Button>
    </Col>
  )
}

export { LoginForm, LogoutButton };