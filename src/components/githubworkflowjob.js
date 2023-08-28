import React, { useEffect, useState } from "react";
import { Table, Alert } from "react-bootstrap";
import { getWorkflowJobfromDb } from "../auth/auth.service";
import dayjs from "dayjs";
import "@fortawesome/fontawesome-free/css/all.css";
import { apolloClient } from "../auth/apolloClient";
import { useSubscription } from "@apollo/client";
import { GET_WORKFLOW_RUN, GET_WORKFLOW_JOB } from "../auth/auth.service";

const GitHubWorkflowPageJob = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [workflowJobs, setWorkflowJobs] = useState([]);

  const fetchData = async () => {
    try {
      const jobsResponse = await getWorkflowJobfromDb(user);
      setWorkflowJobs(jobsResponse);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchJob = async () => {
    try {
      const jobsResponse = await getWorkflowJobfromDb(user);
      setWorkflowJobs(jobsResponse);
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

  const { data: WorkFlowDataJob } = useSubscription(GET_WORKFLOW_JOB, {
    client: apolloClient,
  });

  console.log("WorkFlowDataJob", WorkFlowDataJob);

  useEffect(() => {
    if (WorkFlowDataJob) {
      fetchJob();
    } else {
      fetchData();
    }
  }, [WorkFlowDataJob]);

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
          <h3 className="text-center">GitHub Workflow Jobs</h3>
          <p className="text-center">
            <strong>GitHub Workflow Jobs</strong> is an open-source CI/CD
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
            {workflowJobs.map((job, index) => (
              <tr key={index}>
                <td>
                  <div
                    onClick={(event) => handleTitleClick(event, job.GitHubWorkflowJob.workflow_job.html_url)}
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
                      {job.GitHubWorkflowJob.workflow_job.name}
                    </span>
                    <div className="text-muted" style={{ fontSize: "10px" }}>
                      <span
                        style={{
                          backgroundColor: "#ADD8E6",
                          borderRadius: "5px",
                        }}
                      >
                        # {job.id} synchronized by {job.repo_owner}
                      </span>
                    </div>
                  </div>
                </td>
                <td
                  onClick={(event) =>
                    handleRepoClick(event, job.GitHubWorkflowJob.repository.html_url)
                  }
                  style={{
                    cursor: "pointer",
                    color: "#0366d6",
                  }}
                >
                  <span
                    style={{ backgroundColor: "#ADD8E6", borderRadius: "5px" }}
                  >
                    {job.GitHubWorkflowJob.repository.name}
                  </span>
                </td>
                <td
                  title={dayjs(job.createdAt).format("DD MMM YYYY HH:mm:ss")}
                  style={{ cursor: "pointer" }}
                >
                  {dayjs(job.createdAt).locale("en").fromNow()}
                </td>
                <td>
                  {job.Status === "queued" && (
                    <div>
                      <i className="fa-regular fa-clock"></i>{" "}
                    </div>
                  )}
                  {job.Status === "in_progress" && (
                    <div>
                      <i
                        className="fas fa-circle-notch fa-spin"
                        style={{ color: "#b3ad00" }}
                      ></i>
                    </div>
                  )}
                  {job.Status === "completed" &&
                    job.GitHubWorkflowJob.workflow_job.conclusion ===
                      "success" && (
                      <div>
                        <i
                          className="fa-regular fa-circle-check"
                          style={{ color: "#2ad56c" }}
                        ></i>{" "}
                      </div>
                    )}
                  {job.Status === "completed" &&
                    job.GitHubWorkflowJob.workflow_job.conclusion ===
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
                    href={job.GitHubWorkflowJob.sender.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src={job.GitHubWorkflowJob.sender.avatar_url}
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

export default GitHubWorkflowPageJob;



