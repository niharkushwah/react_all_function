import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useLocation } from "react-router-dom";
import { Alert } from "react-bootstrap";
import dayjs from "dayjs";

const CommitPage = () => {
  const [commits, setCommits] = useState([]);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const title = queryParams.get("title") || "";
  const branchName = queryParams.get("branchName") || "";
  const avtarUrl = queryParams.get("avtarUrl") || "";

  const handleCommitClick = (event, url) => {
    event.stopPropagation();
    window.open(url, "_blank");
  };

  useEffect(() => {
    const storedCommits = localStorage.getItem("commits");
    if (storedCommits) {
      setCommits(JSON.parse(storedCommits));
    }
  }, []);

  return (
    <div>
      <Alert key="warning" variant="warning">
        Commits for{" "}
        <b>
          <u>{title}</u>
        </b>{" "}
        on branch{" "}
        <b>
          <u>{branchName}</u>
        </b>
      </Alert>
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
                {title}
                <div className="text-muted" style={{ fontSize: "10px" }}>
                  # {item.commit.abbreviatedOid}
                </div>
              </td>
              <td>{branchName}</td>
              <td
                onClick={(event) =>
                  handleCommitClick(event, item.commit.commitUrl)
                }
                style={{
                  cursor: "pointer",
                  color: "#0366d6",
                  textDecoration: "underline",
                }}
              >
                {item.commit.message}
              </td>
              <td>{dayjs(item.commit.authoredDate).locale("en").fromNow()}</td>
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
