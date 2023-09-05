import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Navbar, Nav } from "react-bootstrap";
import { Link, BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import UserList from "./components/User_List";
import PullRequests from "./components/github_repo";
import CommitPage from "./components/commits";
import { ApolloProvider } from "@apollo/client";
import { apolloClient } from "./auth/apolloClient";
import GithubWorkflowPage from "./components/githubworkflow";
import Stripe from "./components/stripe";

function App() {
  return (
    <ApolloProvider client={apolloClient}>
    <Router>
      <div className="App">
        <Navbar bg="dark" variant="dark" expand="lg">
          <Navbar.Brand as={Link} to="/">My App</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              <Nav.Link as={Link} to="/login">Login</Nav.Link>
              <Nav.Link as={Link} to="/signup">Signup</Nav.Link>
              <Nav.Link as={Link} to="/userlist">User List</Nav.Link>
              <Nav.Link as={Link} to="/getpullrequest">Github Pull Request</Nav.Link>
              <Nav.Link as={Link} to="/action">Action</Nav.Link>
              <Nav.Link as={Link} to="/Stripe">Stripe</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Navbar>

        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/userlist" element={<UserList />} />
          <Route path="/getpullrequest" element={<PullRequests />} />
          <Route path="/commits" element={<CommitPage/>} />
          <Route path="/action" element={<GithubWorkflowPage/>} />
          <Route path="/stripe" element={<Stripe/>} />
        </Routes>
      </div>
    </Router>
    </ApolloProvider>
  );
}

export default App;
