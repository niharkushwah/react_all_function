import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getPullRequestsForUser } from "../auth/auth.service";
import { Badge, Card, Table } from "react-bootstrap";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { SUBSCRIBE_PULL_REQUESTS } from "../auth/auth.service";
import { apolloClient } from "../auth/apolloClient";
import { useSubscription } from "@apollo/client";
dayjs.extend(relativeTime);

const PullRequests = () => {
  const [pullRequests, setPullRequests] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const { data: subscriptionData } = useSubscription(SUBSCRIBE_PULL_REQUESTS, {
    client: apolloClient,
  });
  console.log(subscriptionData, "subscriptionData?????????????");

  async function getData() {
    const response = await getPullRequestsForUser(user);
    response.sort((a, b) => {
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
    if (subscriptionData) {
      setPullRequests(subscriptionData.newPullRequest);
    } else {
      setPullRequests(response);
    }
  }

  useEffect(() => {
    if (subscriptionData && subscriptionData.newPullRequest) {
      setPullRequests(subscriptionData.newPullRequest);
    } else {
      getData();
    }
  }, [subscriptionData]);

  const handleTitleClick = (event, url) => {
    event.stopPropagation();
    window.open(url, "_blank");
  };

  const filteredPullRequests = pullRequests.filter((item) => {
    const searchString = searchQuery.toLowerCase();
    return (
      item.title.toLowerCase().includes(searchString) ||
      item.githubPullMetadata.headRefName
        .toLowerCase()
        .includes(searchString) ||
      item.repoName.toLowerCase().includes(searchString) ||
      item.number === Number(searchString)
    );
  });

  const handleRowClick = (item) => {
    console.log(item.githubPullMetadata.commits.nodes, "item????????");
    const commits = item.githubPullMetadata.commits.nodes;
    localStorage.setItem("commits", JSON.stringify(commits));
    const queryParams = new URLSearchParams();
    queryParams.append("repo", item.repoName);
    queryParams.append("branchName", item.githubPullMetadata.headRefName);
    queryParams.append("avtarUrl", item.githubPullMetadata.author.url);
    queryParams.append("url", item.commits.nodes[0].url);
    navigate(`/commits?${queryParams.toString()}`);
  };

  const handleBranchClick = (event, userName, repoName, baseRefName) => {
    event.stopPropagation();
    const branchUrl = `https://github.com/${userName}/${repoName}/tree/${baseRefName}`;
    window.open(branchUrl, "_blank");
  };

  const handleRepoClick = (event, userName, repoName) => {
    event.stopPropagation();
    const branchUrl = `https://github.com/${userName}/${repoName}`;
    window.open(branchUrl, "_blank");
  };

  return (
    <div>
      <h1>Pull Requests</h1>
      <div className="container mt-5">
        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="input-group-append">
            <button
              className="btn btn-outline-danger"
              type="button"
              onClick={() => setSearchQuery("")}
            >
              Clear Filter
            </button>
          </div>
        </div>
      </div>
      <Card>
        <Card.Header>{pullRequests.length} workflow</Card.Header>
        <Table striped hover>
          <thead>
            <tr>
              <th>Title</th>
              <th>Status</th>
              <th>Branch Name</th>
              <th>Created At</th>
              <th>Repository Name</th>
            </tr>
          </thead>
          <tbody>
            {console.log(filteredPullRequests)}
            {filteredPullRequests.map((item, index) => (
              <tr key={index}>
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
                      <span
                        style={{
                          backgroundColor: "#ADD8E6",
                          borderRadius: "5px",
                        }}
                      >
                        # {item.number} synchronized by {item.repoOwner}
                      </span>
                    </div>
                  </div>
                </td>
                <td>
                  {console.log(
                    item.githubPullMetadata.closed,
                    "item????????"
                  )}
                  {item.githubPullMetadata.closed === false ? (
                    <Badge bg="success">
                      <span>OPEN</span>
                    </Badge>
                  ) : (
                    <Badge bg="danger">
                      <span>CLOSED</span>
                    </Badge>
                  )}
                </td>
                <td
                  onClick={(event) =>
                    handleBranchClick(
                      event,
                      user,
                      item.repoName,
                      item.githubPullMetadata.headRefName
                    )
                  }
                  style={{
                    cursor: "pointer",
                    color: "#0366d6",
                  }}
                >
                  <span
                    style={{ backgroundColor: "#ADD8E6", borderRadius: "5px" }}
                  >
                    {item.githubPullMetadata.headRefName}
                  </span>
                </td>

                <td
                  title={dayjs(item.createdAt).format("DD MMM YYYY HH:mm:ss")}
                  style={{ cursor: "pointer" }}
                >
                  {dayjs(item.createdAt).locale("en").fromNow()}
                </td>
                <td
                  onClick={(event) =>
                    handleRepoClick(event, user, item.repoName)
                  }
                  style={{
                    cursor: "pointer",
                    color: "#0366d6",
                    textDecoration: "underline",
                  }}
                >
                  {item.repoName}
                </td>
                <td>
                  <a
                    href={item.githubPullMetadata.author.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src={item.githubPullMetadata.author.avatarUrl}
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
                  <i className="fa btn btn-warning">Commits</i>
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
