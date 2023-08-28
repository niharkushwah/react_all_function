import React, { useEffect, useState } from "react";
import { Table, Alert } from "react-bootstrap";
import {
  getWorkflowRunFromDb,
  getWorkflowJobfromDb,
} from "../auth/auth.service";
import dayjs from "dayjs";
import "@fortawesome/fontawesome-free/css/all.css";
import { apolloClient } from "../auth/apolloClient";
import { useSubscription } from "@apollo/client";
import { GET_WORKFLOW_RUN, GET_WORKFLOW_JOB } from "../auth/auth.service";
import {
  CDBSidebar,
  CDBSidebarContent,
  CDBSidebarHeader,
  CDBSidebarMenu,
  CDBSidebarMenuItem,
} from "cdbreact";
import { Row, Col } from "react-bootstrap";

const GitHubWorkflowPage = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [workflowRuns, setWorkflowRuns] = useState([]);
  const [workflowJobs, setWorkflowJobs] = useState([]);
  const [showWorkflowRuns, setShowWorkflowRuns] = useState(true);
  const [showWorkflowJobs, setShowWorkflowJobs] = useState(false);

  const fetchData = async () => {
    try {
      const runsResponse = await getWorkflowRunFromDb(user);
      const jobsResponse = await getWorkflowJobfromDb(user);
      setWorkflowRuns(runsResponse);
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

  const fetchRun = async () => {
    try {
      const runsResponse = await getWorkflowRunFromDb(user);
      setWorkflowRuns(runsResponse);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  console.log("workflowRuns", workflowRuns);

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

  const { data: WorkFlowDataJob } = useSubscription(GET_WORKFLOW_JOB, {
    client: apolloClient,
  });

  console.log("WorkFlowDataJob", WorkFlowDataJob);

  useEffect(() => {
    if (WorkFlowDataRun) {
      fetchRun();
    }
    if (WorkFlowDataJob) {
      fetchJob();
    } else {
      fetchData();
    }
  }, [WorkFlowDataRun]);

  const handleCommitClick = (event, commit, url) => {
    event.stopPropagation();
    window.open(url + "/commit/" + commit.id);
  };

  const removeApiAndRepoFromUrl = (url) => {
    const modifiedUrl = url
      .replace("https://api.", "https://")
      .replace("/repos/", "/")
      .replace("/pulls/", "/pull/");
    return modifiedUrl;
  };

  const handlePullClick = (event, url) => {
    event.stopPropagation();
    window.open(removeApiAndRepoFromUrl(url), "_blank");
  };

  const handleWorkflowRunClick = () => {
    fetchRun();
    setShowWorkflowRuns(true);
    setShowWorkflowJobs(false);
  };

  const handleWorkflowJobClick = () => {
    fetchJob();
    setShowWorkflowRuns(false);
    setShowWorkflowJobs(true);
  };

  return (
    <div className="container-fluid">
      <Row>
        <CDBSidebar
          textColor="white"
          backgroundColor="black"
          style={{ flex: "0 0 auto", height: "auto" }}
        >
          <CDBSidebarHeader prefix={<i className="fa fa-bars fa-large"></i>}>
            <a
              href="/getpullrequest"
              className="text-decoration-none"
              style={{ color: "inherit" }}
            >
              GitHub Workflow
            </a>
          </CDBSidebarHeader>

          <CDBSidebarContent className="sidebar-content">
            <CDBSidebarMenu>
              <CDBSidebarMenuItem
                icon="columns"
                onClick={handleWorkflowRunClick}
                style={{
                  color:
                  showWorkflowRuns === false ? "white" : "yellow",
                }}
              >
                GithubWorkFlow Run
              </CDBSidebarMenuItem>
              <CDBSidebarMenuItem icon="table" onClick={handleWorkflowJobClick} style={{
                  color:
                  showWorkflowJobs === false ? "white" : "yellow",
                }}>
                GithubWorkFlow Job
              </CDBSidebarMenuItem>
            </CDBSidebarMenu>
          </CDBSidebarContent>
        </CDBSidebar>

        <div style={{ flex: 1, overflow: "auto", padding: "20px" }}>
          {showWorkflowRuns && (
            <div>
              <Alert variant="warning">
                <h3 className="text-center">GitHub Workflow Runs</h3>
                <p className="text-center">
                  <strong>GitHub Workflow Runs</strong> is an open-source CI/CD
                  solution automating software development workflows for
                  consistent deployment in diverse environments.
                </p>
              </Alert>
              <div>
                <Table striped hover>
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Repository</th>
                      <th>Pull Request</th>
                      <th>Commit</th>
                      <th>Created At</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {workflowRuns.map((run, index) => (
                      <tr key={index}>
                        <td>
                          <div
                            onClick={(event) =>
                              handleTitleClick(
                                event,
                                run.GitHubWorkflowJob.workflow_run.html_url
                              )
                            }
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
                            <div
                              className="text-muted"
                              style={{ fontSize: "10px" }}
                            >
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
                            handleRepoClick(
                              event,
                              run.GitHubWorkflowJob.repository.html_url
                            )
                          }
                          style={{
                            cursor: "pointer",
                            color: "#0366d6",
                          }}
                        >
                          <span
                            style={{
                              backgroundColor: "#ADD8E6",
                              borderRadius: "5px",
                            }}
                          >
                            {run.GitHubWorkflowJob.repository.name}
                          </span>
                        </td>
                        <td
                          style={{
                            cursor: "pointer",
                            color: "#0366d6",
                          }}
                        >
                          {run.GitHubWorkflowJob.workflow_run.pull_requests.map(
                            (pullRequest, index) => (
                              <div
                                key={index}
                                onClick={(event) =>
                                  handlePullClick(event, pullRequest.url)
                                }
                                style={{ marginBottom: "8px" }}
                              >
                                <div>{pullRequest.head.ref}</div>
                                <div
                                  className="text-muted"
                                  style={{ fontSize: "10px" }}
                                >
                                  <span
                                    style={{
                                      backgroundColor: "#ADD8E6",
                                      borderRadius: "5px",
                                      padding: "2px 5px",
                                    }}
                                  >
                                    #{pullRequest.number}
                                  </span>
                                </div>
                              </div>
                            )
                          )}
                        </td>

                        <td
                          onClick={(event) =>
                            handleCommitClick(
                              event,
                              run.GitHubWorkflowJob.workflow_run.head_commit,
                              run.GitHubWorkflowJob.repository.html_url
                            )
                          }
                          style={{
                            cursor: "pointer",
                            color: "#0366d6",
                          }}
                        >
                          <span
                            style={{
                              backgroundColor: "#ADD8E6",
                              borderRadius: "5px",
                            }}
                          >
                            {run.GitHubWorkflowJob.workflow_run.head_commit.id.slice(
                              0,
                              7
                            )}
                          </span>
                        </td>

                        <td
                          title={dayjs(run.createdAt).format(
                            "DD MMM YYYY HH:mm:ss"
                          )}
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
          )}

          {showWorkflowJobs && (
            <div>
              <Alert variant="warning">
                <h3 className="text-center">GitHub Workflow Jobs</h3>
                <p className="text-center">
                  <strong>GitHub Workflow Jobs</strong> is an open-source CI/CD
                  solution automating software development workflows for
                  consistent deployment in diverse environments.
                </p>
              </Alert>

              <div>
                <div>
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
                              onClick={(event) =>
                                handleTitleClick(
                                  event,
                                  job.GitHubWorkflowJob.workflow_job.html_url
                                )
                              }
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
                              <div
                                className="text-muted"
                                style={{ fontSize: "10px" }}
                              >
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
                              handleRepoClick(
                                event,
                                job.GitHubWorkflowJob.repository.html_url
                              )
                            }
                            style={{
                              cursor: "pointer",
                              color: "#0366d6",
                            }}
                          >
                            <span
                              style={{
                                backgroundColor: "#ADD8E6",
                                borderRadius: "5px",
                              }}
                            >
                              {job.GitHubWorkflowJob.repository.name}
                            </span>
                          </td>
                          <td
                            title={dayjs(job.createdAt).format(
                              "DD MMM YYYY HH:mm:ss"
                            )}
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
            </div>
          )}
        </div>
      </Row>
    </div>
  );
};

export default GitHubWorkflowPage;
