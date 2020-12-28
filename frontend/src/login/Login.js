import {Button, Col, Container, Form, Row} from "react-bootstrap";
import './Login.css';

export default function Login() {
    return (
        <Container>
            <Row className="justify-content-center">
                <Form>
                    <Form.Row className="align-items-center">
                        <Col xs="auto">
                            <Form.Label>Username</Form.Label>
                            <Form.Control type="text" placeholder="Enter username"/>
                            <Form.Text className="text-muted">
                                Very cool text below the login.
                            </Form.Text>
                        </Col>
                        <Col xs="auto">
                            <Button type="submit">Login</Button>
                        </Col>
                    </Form.Row>
                </Form>
            </Row>
        </Container>
    );
}