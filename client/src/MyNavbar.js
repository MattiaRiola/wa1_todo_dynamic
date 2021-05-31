import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import todo from './todo.svg';
import Button from 'react-bootstrap/Button';

function MyNavbar(props) {
    return (
        <>
            <Navbar bg="primary" variant="dark" expand="lg" className="sticky-top">
                <Navbar.Toggle onClick={() => props.setOpen(oldOpen => !oldOpen)} aria-controls="menu-filter" aria-expanded={props.open} />
                <Navbar.Brand href="/" className="d-inline-block align-top">
                    <img alt="" src={todo} width="30" height="30" className="d-inline-block align-top" />{' '} Manager
                </Navbar.Brand>

                <Form inline className="m-lg-auto d-none d-sm-block">
                    <FormControl type="text" placeholder="Search" className="mr-sm-2 mt-1 mt-sm-0" />
                    <Button variant="outline-light" className="my-2 my-sm-0">Search</Button>
                </Form>
                <Navbar.Text className="mr-2 text-white">
                    {props.loggedIn ? props.message.msg : ""}
                </Navbar.Text>
                <>
                {props.loggedIn ? <Button variant="outline-light" className="my-2 my-sm-0 mr-2" onClick={props.logout}>Logout</Button> : <></>}
                </>
                <Nav className="mt-0 mt-lg-0 user-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="white" className="bi bi-person-circle" viewBox="0 0 16 16">
                        <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                        <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z" />
                    </svg>
                </Nav>
            </Navbar>
        </>
    );
}

export default MyNavbar;