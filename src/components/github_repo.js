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
  const [searchQuery, setSearchQuery] = useState("");

  async function getData() {
    const response = await getPullRequestsForUser(user);
    response.sort((a, b) => {
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
    console.log(response, "response??????????");
    setPullRequests(response);
  }

  // async function getSearchData(searchKeyword) {
  //   setSearchQuery(searchKeyword);
  //   const response = await SearchPullRequests(searchKeyword, user);
  //   console.log("response from search query", response);
  //   response.sort((a, b) => {
  //     return new Date(b.createdAt) - new Date(a.createdAt);
  //   });
  //   console.log("response from search query", response);
  //   setPullRequests(response);
  // }

  useEffect(() => {
    getData();
    // getSearchData("test");
  }, []);

  const handleTitleClick = (event, url) => {
    event.stopPropagation();
    window.open(url, "_blank");
  };

  const filteredPullRequests = pullRequests.filter((item) => {
    const searchString = searchQuery.toLowerCase();
    // console.log((item.number), "number")
    return (
      item.title.toLowerCase().includes(searchString) ||
      item.github_pull_metadata.headRefName
        .toLowerCase()
        .includes(searchString) ||
      item.repo_name.toLowerCase().includes(searchString) ||
      item.number === Number(searchString)
    );
  });

  const handleRowClick = (item) => {
    console.log(item.github_pull_metadata.commits.nodes, "item????????");
    const commits = item.github_pull_metadata.commits.nodes;
    localStorage.setItem("commits", JSON.stringify(commits));
    const queryParams = new URLSearchParams();
    queryParams.append("repo", item.repo_name);
    queryParams.append("branchName", item.github_pull_metadata.headRefName);
    queryParams.append("avtarUrl", item.github_pull_metadata.author.url);
    navigate(`/commits?${queryParams.toString()}`);
  };

  const handleBranchClick = (event, username, repo_name, baseRefName) => {
    event.stopPropagation();
    const branchUrl = `https://github.com/${username}/${repo_name}/tree/${baseRefName}`;
    window.open(branchUrl, "_blank");
  };

  const handleRepoClick = (event, username, repo_name) => {
    event.stopPropagation();
    const branchUrl = `https://github.com/${username}/${repo_name}`;
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
      {/* 
    <div className="container mt-5">
      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search by title..."
          value={searchQuery}
          onChange={(e) => getSearchData(e.target.value)}
        />
        <div className="input-group-append">
          <button
            className="btn btn-outline-secondary"
            type="button"
            onClick={() => setSearchQuery('')}
          >
            Clear Filter
          </button>
        </div>
      </div>
    </div>
     */}

      <Card>
        <Card.Header>{pullRequests.length} workflow</Card.Header>
        <Table striped hover>
          <thead>
            <tr>
              <th>Title</th>
              <th>Branch Name</th>
              <th>Created At</th>
              <th>Repository Name</th>
            </tr>
          </thead>
          <tbody>
            {console.log(filteredPullRequests)}
            {filteredPullRequests.map((item) => (
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

                <td
                  title={dayjs(item.createdAt).format(
                    "DD MMM YYYY HH:mm:ss"
                  )}
                >
                  {dayjs(item.createdAt).locale("en").fromNow()}
                </td>
                <td
                  onClick={(event) =>
                    handleRepoClick(event, user, item.repo_name)
                  }
                  style={{
                    cursor: "pointer",
                    color: "#0366d6",
                    textDecoration: "underline",
                  }}
                >
                  {item.repo_name}
                </td>
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
