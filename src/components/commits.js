import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useLocation } from "react-router-dom";

const CommitPage = () => {
  const [commits, setCommits] = useState([]);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const [title, setTitle] = useState(queryParams.get("title") || "");
  const [branchName, setBranchName] = useState(queryParams.get("branchName") || "");

  useEffect(() => {
    const storedCommits = localStorage.getItem("commits");
    if (storedCommits) {
      setCommits(JSON.parse(storedCommits));
    }
  }, []);

  return (
    <div>
      <h1>Commits </h1>
      <h1>Commits for {title} - Branch: {branchName}</h1>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Commit Message</th>
            <th>Commit Url</th>
            <th>Commit Author</th>
          </tr>
        </thead>
        <tbody>
          {commits.map((item) => (
            <tr key={item.id}>
              <td>{item.commit.message}</td>
              <td>{item.commit.commitUrl}</td>
              <td>{item.commit.committer.name}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default CommitPage;
