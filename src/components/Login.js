import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../auth/auth.service";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await AuthService.login(email, password);
      const { data } = response;
      if (data && data.login) {
        navigate("/userlist");
      } else {
        setError("Invalid email or password");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Container>
      <Row className="justify-content-center mt-5">
        <Col md={6}>
          <Form onSubmit={handleLogin}>
            <h3 className="mb-4">Login</h3>
            <Form.Group controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>

            <Button type="submit" className="btn btn-success mt-3">
              Log in
            </Button>
            {error && <p className="text-danger mt-3">{error}</p>}
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
