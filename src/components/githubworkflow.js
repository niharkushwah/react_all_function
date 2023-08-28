import React, { useEffect, useState } from "react";
import { Table, Alert } from "react-bootstrap";
import { getWorkflowRunFromDb } from "../auth/auth.service";
import dayjs from "dayjs";
import "@fortawesome/fontawesome-free/css/all.css";
import { apolloClient } from "../auth/apolloClient";
import { useSubscription } from "@apollo/client";
import { GET_WORKFLOW_RUN } from "../auth/auth.service";

const GitHubWorkflowPage = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [workflowRuns, setWorkflowRuns] = useState([]);

  const fetchData = async () => {
    try {
      const runsResponse = await getWorkflowRunFromDb(user);
      setWorkflowRuns(runsResponse);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchRun = async () => {
    try {
      const runsResponse = await getWorkflowRunFromDb(user);
      setWorkflowRuns(runsResponse);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleTitleClick = (event, url) => {
    event.stopPropagation();
    window.open(url, "_blank");
  };

  const handleRepoClick = (event, url) => {
    event.stopPropagation();
    window.open(url, "_blank");
  };

  const { data: WorkFlowDataRun } = useSubscription(GET_WORKFLOW_RUN, {
    client: apolloClient,
  });

  console.log("WorkFlowDataRun", WorkFlowDataRun);

  useEffect(() => {
    if (WorkFlowDataRun) {
      fetchRun();
    } else {
      fetchData();
    }
  }, [WorkFlowDataRun]);

  return (
    <div>
      <Alert variant="success">
        <h2 className="text-center">GitHub Workflow</h2>
        <p className="text-center">
          <strong>GitHub Workflow</strong> GitHub Workflow is a free,
          open-source CI/CD solution that automates software development
          workflows, deploying in various environments for consistent
          development and production processes.
        </p>
      </Alert>

      <div>
        <Alert variant="warning">
          <h3 className="text-center">GitHub Workflow Runs</h3>
          <p className="text-center">
            <strong>GitHub Workflow Runs</strong> is an open-source CI/CD
            solution automating software development workflows for consistent
            deployment in diverse environments.
          </p>
        </Alert>

        <Table striped hover>
          <thead>
            <tr>
              <th>Title</th>
              <th>Repository</th>
              <th>Created At</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {workflowRuns.map((run, index) => (
              <tr key={index}>
                <td>
                  <div
                    onClick={(event) => handleTitleClick(event, run.url)}
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
                      {run.title}
                    </span>
                    <div className="text-muted" style={{ fontSize: "10px" }}>
                      <span
                        style={{
                          backgroundColor: "#ADD8E6",
                          borderRadius: "5px",
                        }}
                      >
                        # {run.id} synchronized by {run.repo_owner}
                      </span>
                    </div>
                  </div>
                </td>
                <td
                  onClick={(event) =>
                    handleRepoClick(event, run.GitHubWorkflowJob.repository.url)
                  }
                  style={{
                    cursor: "pointer",
                    color: "#0366d6",
                  }}
                >
                  <span
                    style={{ backgroundColor: "#ADD8E6", borderRadius: "5px" }}
                  >
                    {run.GitHubWorkflowJob.repository.name}
                  </span>
                </td>
                <td
                  title={dayjs(run.createdAt).format("DD MMM YYYY HH:mm:ss")}
                  style={{ cursor: "pointer" }}
                >
                  {dayjs(run.createdAt).locale("en").fromNow()}
                </td>
                <td>
                  {run.Status === "queued" && (
                    <div>
                      <i className="fa-regular fa-clock"></i>{" "}
                    </div>
                  )}
                  {run.Status === "in_progress" && (
                    <div>
                      <i
                        className="fas fa-circle-notch fa-spin"
                        style={{ color: "#b3ad00" }}
                      ></i>
                    </div>
                  )}
                  {run.Status === "completed" &&
                    run.GitHubWorkflowJob.workflow_run.conclusion ===
                      "success" && (
                      <div>
                        <i
                          className="fa-regular fa-circle-check"
                          style={{ color: "#2ad56c" }}
                        ></i>{" "}
                      </div>
                    )}
                  {run.Status === "completed" &&
                    run.GitHubWorkflowJob.workflow_run.conclusion ===
                      "failure" && (
                      <div>
                        <i
                          className="far fa-times-circle"
                          style={{ color: "#cb2431" }}
                        ></i>{" "}
                      </div>
                    )}
                </td>

                <td>
                  <a
                    href={run.GitHubWorkflowJob.sender.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src={run.GitHubWorkflowJob.sender.avatar_url}
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
    </div>
  );
};

export default GitHubWorkflowPage;
