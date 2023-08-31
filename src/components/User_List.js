import React, { useEffect, useState } from "react";
import { fetchUsers } from "../auth/auth.service";
import { Table, Modal, Form, Button } from "react-bootstrap";
import { updateUser } from "../auth/auth.service";
import { deleteUser } from "../auth/auth.service";
import 'bootstrap-icons/font/bootstrap-icons.css';
import { githubCodeExchange } from "../auth/auth.service";

function UserList() {
  const [users, setUsers] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState({});
  const [updatedName, setUpdatedName] = useState("");
  const [updatedAge, setUpdatedAge] = useState("");
  const [updateduserName, setUpdateduserName] = useState("");
  const [ageError, setAgeError] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setSelectedUser({});
    setUpdatedName("");
    setUpdatedAge("");
    setUpdateduserName("");
    setAgeError("");
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedUser({});
  };

  const handleShowEditModal = (user) => {
    setSelectedUser(user);
    setUpdatedName(user.name);
    setUpdatedAge(user.age);
    setUpdateduserName(user.userName);
    setShowEditModal(true);
  };

  const handleShowDeleteModal = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirmed = () => {
    handleDelete(selectedUser._id);
    handleCloseDeleteModal();
  };

  const handleUpdate = async () => {
    try {
      setAgeError("");
      const parsedAge = parseInt(updatedAge);
      if (parsedAge < 18 || parsedAge > 99) {
        setAgeError("Age must be between 18 and 99.");
        return;
      }

      const payload = {
        name: updatedName,
        age: parseInt(updatedAge),
        email: selectedUser.email,
        userName: updateduserName,
      };

      const updatedUser = await updateUser(selectedUser.email, payload);
      const updatedUsers = users.map((user) =>
        user._id === selectedUser._id ? { ...user, ...updatedUser } : user
      );
      setUsers(updatedUsers);
      handleCloseEditModal();
    } catch (error) {
      console.error("Failed to update user:", error);
    }
  };

  const handleDelete = async (userId) => {
    try {
      await deleteUser(userId);
      fetchUsers("user", 18, 35)
        .then((data) => setUsers(data))
        .catch((error) => console.error("Failed to fetch users:", error));
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
  };

  useEffect(() => {
    fetchUsers("user", 18, 85)
      .then((data) => setUsers(data))
      .catch((error) => console.error("Failed to fetch users:", error));
    const urlParams = new URLSearchParams(window.location.search);
    const codeValue = urlParams.get("code");

    if (codeValue) {
      console.log("GitHub authentication successful. Code:", codeValue);

      githubCodeExchange(codeValue)
        .then((accessTokenData) => {
          console.log("Access Token Data:", accessTokenData);
        })
        .catch((error) => {
          console.error("Failed to exchange GitHub code:", error);
        });
    } else {
      console.log("GitHub authentication failed or no 'code' parameter found.");
    }
  }, []);


  return (
    <div>
      <h2 className="text-center pt-3 pb-3">User List</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>userName</th>
            <th>Age</th>
            <th>Address</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.userName}</td>
              <td>{user.age}</td>
              <td>
                {user.address.mainAddress}, {user.address.city},{" "}
                {user.address.pincode}
              </td>
              <td>
                <button
                  className="btn btn-warning me-2"
                  onClick={() => handleShowEditModal(user)}
                >
                  Update
                </button>
                <button
                  className="btn btn-danger ms-2"
                  onClick={() => handleShowDeleteModal(user)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showEditModal} onHide={handleCloseEditModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              value={updatedName}
              onChange={(e) => setUpdatedName(e.target.value)}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Age</Form.Label>
            <Form.Control
              type="number"
              value={updatedAge}
              onChange={(e) => setUpdatedAge(e.target.value)}
            />
            {ageError && <p className="text-danger">{ageError}</p>}
          </Form.Group>
          <Form.Group>
            <Form.Label>userName</Form.Label>
            <Form.Control
              type="text"
              value={updateduserName}
              onChange={(e) => setUpdateduserName(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button className="btn btn-danger" onClick={handleCloseEditModal}>
            Close
          </Button>
          <Button className="btn btn-success" onClick={handleUpdate}>
            Update
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
        <Modal.Header closeButton>
          <Modal.Title>Delete User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Are you sure you want to delete this user?</Form.Label>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Modal.Footer>
            <Button className="btn btn-danger" onClick={handleCloseDeleteModal}>
              Close
            </Button>
            <Button className="btn btn-success" onClick={handleDeleteConfirmed}>
              Delete
            </Button>
          </Modal.Footer>
        </Modal.Footer>
      </Modal>

      <div className="scroll-to-top position-absolute end-0">
        <button className="btn btn-danger align-right" onClick={scrollToTop}>
          <i className="bi bi-arrow-up-circle"></i> Scroll Up
        </button>
      </div>
    </div>
  );
}
export default UserList;
