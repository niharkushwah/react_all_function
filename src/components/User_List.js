import React, { useEffect, useState } from "react";
import { fetchUsers } from "../auth/auth.service";
import { Table, Modal, Form, Button } from "react-bootstrap";
import { updateUser } from "../auth/auth.service";
import { deleteUser } from "../auth/auth.service";

function UserList() {
  const [users, setUsers] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState({});
  const [updatedName, setUpdatedName] = useState("");
  const [updatedAge, setUpdatedAge] = useState("");
  const [updatedUsername, setUpdatedUsername] = useState("");
  const [ageError, setAgeError] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setSelectedUser({});
    setUpdatedName("");
    setUpdatedAge("");
    setUpdatedUsername("");
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
    setUpdatedUsername(user.username);
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
        username: updatedUsername,
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
  }, []);

  return (
    <div>
      <h2 className="text-center pt-3 pb-3">User List</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Username</th>
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
              <td>{user.username}</td>
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
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              value={updatedUsername}
              onChange={(e) => setUpdatedUsername(e.target.value)}
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
    </div>
  );
}
export default UserList;
