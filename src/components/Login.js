import React, { useState } from "react";                                       
import AuthService from "../auth/auth.service";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import EmailValidator from "email-validator";
import { checkEmail } from "../auth/auth.service";
import { useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MarkGithubIcon } from '@primer/octicons-react';

const Login = () => {
  const { state } = useLocation();
  const [email, setEmail] = useState(state?.userEmail ?? "");
  const [password, setPassword] = useState(state?.userPassword ?? "");
  const [error, setError] = useState("");
  const notify = () => toast("Login Successful!!!!!!!!!!!");

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!EmailValidator.validate(email)) {
      setError("Invalid email format.");
      return;
    }

    try {
      const emailData = await checkEmail(email);
      if (!emailData) {
        setError("Email does not exist.");
        return;
      }

      const response = await AuthService.login(email, password);
      const { data } = response;
      if (data && data.login) {
        // navigate("/userlist");
        notify();
      } else {
        setError("Invalid password");
      }
    } catch (err) {
      console.log(err);
      setError("Failed to check email");
    }
  };

const handleGithubLogin = async () => {
  try {
    const response = await AuthService.githubLogin();
    console.log(response);
    if (response && response.githubAuthUrl) {
      window.location.href = response.githubAuthUrl;
    } else {
      console.log("GitHub login failed or no URL received.");
    }
  } catch (err) {
    console.log("Error during GitHub login:", err.message);
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
          {/* login with github */}
          <div className="mt-3">
          
              <Button className="btn btn-danger" onClick={handleGithubLogin}>
                <MarkGithubIcon size={24} className="mr-2" /> Login with GitHub
              </Button>
          
          </div>
        </Col>
      </Row>
      <ToastContainer />
    </Container>
  );
};

export default Login;
