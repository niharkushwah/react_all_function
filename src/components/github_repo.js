import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import { getPullRequestsForUser } from "../auth/auth.service";
import { Card, Table } from "react-bootstrap";
import { formatDistanceToNow } from "date-fns";

const PullRequests = () => {
  const [pullRequests, setPullRequests] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  async function getData() {
    const response = await getPullRequestsForUser(user);
    response.sort((a, b) => {
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
    console.log(response, "response??????????");
    setPullRequests(response);
  }

  useEffect(() => {
    getData();
  }, []);

  const handleTitleClick = (event, url) => {
    event.stopPropagation();
    window.open(url, "_blank");
  };

  const handleRowClick = (repoName) => {
    navigate(`/commits/${repoName}`);
  };

  return (
    <div>
      <h1>Pull Requests</h1>
      <Card>
        <Card.Header>{pullRequests.length} workflow</Card.Header>
        <Table striped hover>
          <thead>
            <tr>
              <th>Title</th>
              <th>Repository</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            {pullRequests.map((item) => (
              <tr key={item.id} onClick={() => handleRowClick(item.repo_name)}>
                <td>
                  <div
                    onClick={(event) => handleTitleClick(event, item.url)}
                    style={{ cursor: "pointer" }}
                  >
                    {item.title}
                    <div className="text-muted" style={{ fontSize: '10px' }}>
                      # {item.number} synchronized by {item.repo_owner}
                    </div>
                  </div>
                </td>
                <td>{item.repo_name}</td>
                <td>{formatDistanceToNow(new Date(item.createdAt))} ago</td>
                <td>
                  <img
                    src={item.github_pull_metadata.author.avatarUrl}
                    alt="Avatar"
                    className="rounded-circle"
                    style={{ height: "25px", width: "25px" }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>
    </div>
  );
};


export default PullRequests;
