import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; 

const CommitPage = () => {
  const { repoName } = useParams(); 
  const [commits, setCommits] = useState([]);


  useEffect(() => {
  }, [repoName]);

  return (
    <div>
      <h1>Commits for {repoName}</h1>
    </div>
  );
};

export default CommitPage;
