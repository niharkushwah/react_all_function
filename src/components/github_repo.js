import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getPullRequestsForUser } from "../auth/auth.service";
import { Card, Table } from "react-bootstrap";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

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

  const handleRowClick = (item) => {
    console.log(item.github_pull_metadata.commits.nodes, "item????????");
    const commits = item.github_pull_metadata.commits.nodes;
    localStorage.setItem("commits", JSON.stringify(commits));
    const queryParams = new URLSearchParams();
    queryParams.append("title", item.title);
    queryParams.append("branchName", item.github_pull_metadata.headRefName);
    navigate(`/commits?${queryParams.toString()}`);
  };

  const handleBranchClick = (event, username, repo_name, baseRefName) => {
    event.stopPropagation();
    const branchUrl = `https://github.com/${username}/${repo_name}/tree/${baseRefName}`;
    window.open(branchUrl, "_blank");
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
              <th>Branch Name</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            {pullRequests.map((item) => (
              <tr key={item.id}>
                <td>
                  <div
                    onClick={(event) => handleTitleClick(event, item.url)}
                    style={{
                      cursor: "pointer",
                    }}
                  >
                    <span
                      style={{
                        color: "#0366d6",
                        textDecoration: "underline",
                      }}
                    >
                      {item.title}
                    </span>
                    <div className="text-muted" style={{ fontSize: "10px" }}>
                      # {item.number} synchronized by {item.repo_owner}
                    </div>
                  </div>
                </td>
                <td
                  onClick={(event) =>
                    handleBranchClick(
                      event,
                      user,
                      item.repo_name,
                      item.github_pull_metadata.headRefName
                    )
                  }
                  style={{
                    cursor: "pointer",
                    color: "#0366d6",
                    textDecoration: "underline",
                  }}
                >
                  {item.github_pull_metadata.headRefName}
                </td>

                <td>{dayjs(item.createdAt).locale("en").fromNow()}</td>
                <td>
                  <a
                    href={item.github_pull_metadata.author.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src={item.github_pull_metadata.author.avatarUrl}
                      alt="Avatar"
                      className="rounded-circle"
                      style={{ height: "25px", width: "25px" }}
                    />
                  </a>
                </td>

                <td
                  onClick={() => handleRowClick(item)}
                  style={{ cursor: "pointer" }}
                >
                  <i className="fa fa-chevron-right btn btn-warning">Commits</i>
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
