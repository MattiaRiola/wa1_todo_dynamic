import { ListGroup, Col, Collapse } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function MyAside(props) {
    /**
     * Aside contains links which are routes for filters (final version)
     */
    return (
        <>
            <Collapse in={props.open}>
                <Col lg={4} as="aside" className="d-lg-block py-2 px-lg-3 aside-bg" id="menu-filter">
                    <ListGroup as="ul" defaultActiveKey="#filter-all" variant="flush">
                        <Link to={"/All"}>
                            <ListGroup.Item as="li" action href="#filter-all" onClick = {() => {props.setSelectedFilter("all");
                                                                                                        props.setDirty(true)}}>All</ListGroup.Item>
                        </Link>
                        <Link to={"/Important"}>
                            <ListGroup.Item as="li" action href="#filter-important" onClick = {() => {props.setSelectedFilter("important");
                                                                                                        props.setDirty(true)}} >Important</ListGroup.Item>
                        </Link>
                        <Link to={"/Today"}>
                            <ListGroup.Item as="li" action href="#filter-today" onClick = {() => {props.setSelectedFilter("today");
                                                                                                        props.setDirty(true)}}>Today</ListGroup.Item>
                        </Link>
                        <Link to={"/Next 7 Days"}>
                            <ListGroup.Item as="li" action href="#filter-next7days" onClick = {() => {props.setSelectedFilter("next7days");
                                                                                                        props.setDirty(true)}}>Next 7 Days</ListGroup.Item>
                        </Link>
                        <Link to={"/Private"}>
                            <ListGroup.Item as="li" action href="#filter-private" onClick = {() => {props.setSelectedFilter("private");
                                                                                                        props.setDirty(true)}}>Private</ListGroup.Item>
                        </Link>
                    </ListGroup>
                </Col>
            </Collapse>
        </>
    );
}

export default MyAside;