import {Button, Col, Container, Form, Row} from "react-bootstrap";
import {Redirect} from "react-router-dom";
import './Login.css';
import {useState} from "react";

export default function Login(props) {
    const [name, setName] = useState("");
    const {isAuthenticated, setAuthenticated, role, setRole, setUID, uid} = props;

    const socket = props.socket.current;

    if (isAuthenticated) {
        return <Redirect to="/"/>;
    }

    async function login(event) {
        event.preventDefault();

        fetch(`/api/login`,
            {
                method: 'POST',
                body: JSON.stringify({
                    name: name
                })
            })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                const {uuid, role} = data;

                socket.send(JSON.stringify({
                    message: "login",
                    data: {
                        uid: uuid
                    }
                }));
                setUID(uuid);
                setRole(role);
                setAuthenticated(true);
            });
    }

    return (
        <Container>
            <Row className="justify-content-center">
                <Form onSubmit={login}>
                    <Form.Row className="align-items-center">
                        <Col xs="auto">
                            <Form.Label>Username</Form.Label>
                            <Form.Control type="text" placeholder="Enter username" value={name}
                                          onChange={e => setName(e.target.value)}/>
                            <Form.Text className="text-muted">
                                Very cool text below the login.
                            </Form.Text>
                        </Col>
                        <Col xs="auto">
                            <Button type="submit" disabled={name === ''}>Login</Button>
                        </Col>
                    </Form.Row>
                </Form>
            </Row>
        </Container>
    );
}
