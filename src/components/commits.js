import React, { useEffect, useState } from "react";
import { Table, Alert } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useLocation } from "react-router-dom";
import dayjs from "dayjs";
import moment from "moment";

const CommitPage = () => {
  const [commits, setCommits] = useState([]);
  const [originalCommits, setOriginalCommits] = useState([]);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const repo = queryParams.get("repo") || "";
  const branchName = queryParams.get("branchName") || "";
  const avtarUrl = queryParams.get("avtarUrl") || "";
  const [searchQuery, setSearchQuery] = useState("");
  const user = JSON.parse(localStorage.getItem("user"));

  const filterCommits = (searchString) => {
    setSearchQuery(searchString);
    const lowerSearchString = searchString.toLowerCase();
    const filteredCommits = originalCommits.filter((item) => {
      return (
        item.commit.message.toLowerCase().includes(lowerSearchString) ||
        // branchName.toLowerCase().includes(lowerSearchString) ||
        item.commit.committer.name.toLowerCase().includes(lowerSearchString) ||
        item.commit.abbreviatedOid.toLowerCase().includes(lowerSearchString)
      );
    });
    setCommits(filteredCommits);
  };

  const handleCommitClick = (event, url) => {
    event.stopPropagation();
    window.open(url, "_blank");
  };

  const handleBranchClick = (event, username, repo_name, baseRefName) => {
    event.stopPropagation();
    const branchUrl = `https://github.com/${username}/${repo_name}/tree/${baseRefName}`;
    window.open(branchUrl, "_blank");
  };

  useEffect(() => {
    const storedCommits = localStorage.getItem("commits");
    if (storedCommits) {
      const parsedCommits = JSON.parse(storedCommits);
      parsedCommits.sort((a, b) => {
        return new Date(b.commit.authoredDate) - new Date(a.commit.authoredDate);
      });
      setCommits(parsedCommits);
      setOriginalCommits(parsedCommits);
    }
  }, []);

  return (
    <div>
      <Alert key="warning" variant="warning">
        Commits for{" "}
        <b>
          <u>{repo}</u>
        </b>{" "}
        on branch{" "}
        <b>
          <u>{branchName}</u>
        </b>
      </Alert>

      <div className="container mt-5">
        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search by title..."
            value={searchQuery}
            onChange={(e) => filterCommits(e.target.value)}
          />
          <div className="input-group-append">
            <button
              className="btn btn-outline-danger"
              type="button"
              onClick={() => filterCommits("")}
            >
              Clear Filter
            </button>
          </div>
        </div>
      </div>

      <Table striped hover>
        <thead>
          <tr>
            <th>Title</th>
            <th>Branch Name</th>
            <th>Commit Message</th>
            <th>Commit Date</th>
            <th>Commit Author</th>
          </tr>
        </thead>
        <tbody>
          {commits.map((item) => (
            <tr key={item.id}>
              <td>
                {repo}
                <div className="text-muted" style={{ fontSize: "10px" }}>
                 <span style={{ backgroundColor: "#ADD8E6", borderRadius: "5px" }}> # {item.commit.abbreviatedOid}</span>
                </div>
              </td>
              <td
                onClick={(event) =>
                  handleBranchClick(event, user, repo, branchName)
                }
                style={{
                  cursor: "pointer",
                  color: "#0366d6",
                }}
              >
                <span style={{ backgroundColor: "#ADD8E6", borderRadius: "5px" }}>
                {branchName}
                </span>
              </td>
              <td
                onClick={(event) =>
                  handleCommitClick(event, item.commit.commitUrl)
                }
                style={{
                  cursor: "pointer",
                  color: "#0366d6",
                }}
              >
                <span style={{ backgroundColor: "#ADD8E6", borderRadius: "5px" }} >{item.commit.message}</span>
              </td>
              <td
                title={dayjs(item.commit.authoredDate).format(
                  "DD MMM YYYY HH:mm:ss"
                )}
                style={{ cursor: "pointer" }}
              >
                {/* {item.commit.authoredDate} " " */}
                {moment(item.commit.authoredDate)
                  .locale("en")
                  .to(moment(), true)}{" "}
              </td>
              <td>{item.commit.committer.name}</td>
              <td>
                <a href={avtarUrl} target="_blank" rel="noopener noreferrer">
                  <img
                    src={item.commit.committer.avatarUrl}
                    alt="Avatar"
                    className="rounded-circle"
                    style={{ height: "25px", width: "25px" }}
                  />
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default CommitPage;