import axios from "axios";
const API_URL = "http://localhost:3000/graphql";

export const login = (email, password) => {
  return axios
    .post(API_URL + "/graphql", {
      query: `
        mutation {
          login(email: "${email}", password: "${password}")
        }
      `,
    })
    .then((response) => {
      return response.data;
    });
};

const signup = async (payload) => {
  console.log(payload, "payload");
  const {
    name,
    username,
    age,
    mobileNumber,
    countryCode,
    mainAddress,
    city,
    pincode,
    email,
    password,
  } = payload;

  return axios
    .post(API_URL, {
      query: `
        mutation {
          createUser(
            payload: {
              name: "${name}",
              username: "${username}",
              age: ${age},
              mobileNumber: ${mobileNumber},
              countryCode: "${countryCode}",
              email: "${email}",
              password: "${password}",
              address: {
                mainAddress: "${mainAddress}",
                city: "${city}",
                pincode: ${pincode},
              },
            }
          ) {
            name
            username
            email
            address {
              mainAddress
              city
              pincode
            }
            age
          }
        }
      `,
    })
    .then((response) => {
      if (response.data.accessToken) {
        localStorage.setItem("user", JSON.stringify(response.data));
      }
      return response.data;
    });
};

export const fetchUsers = async (role, minAge, maxAge) => {
  try {
    const response = await axios.post(API_URL, {
      query: `
        query {
          findAllUser(role: "${role}", minAge: ${minAge}, maxAge: ${maxAge}) {
            _id
            name
            username
            email
            age
            address {
              mainAddress
              city
              pincode
            }
          }
        }
      `,
    });

    return response.data.data.findAllUser;
  } catch (error) {
    throw new Error("Failed to fetch users");
  }
};

export const deleteUser = async (userId) => {
  try {
    const response = await axios.post(API_URL, {
      query: `
        mutation {
          deleteUser(id: "${userId}") {
            _id
            name
          }
        }
      `,
    });
    return response.data.data.deleteUser;
  } catch (error) {
    throw new Error("Failed to delete user");
  }
};

export const updateUser = async (email, payload) => {
  try {
    const response = await axios.post(API_URL, {
      query: `
        mutation {
          updateUser(email: "${email}", payload: {
            name: "${payload.name}",
            age: ${payload.age},
            username: "${payload.username}",
            
          }) {
            name
            age
            username
          }
        }
      `,
    });

    return response.data.data.updateUser;
  } catch (error) {
    throw new Error("Failed to update user");
  }
};

export const checkEmail = async (email) => {
  try {
    const response = await axios.post(API_URL, {
      query: `
        query {
          findEmail(email: "${email}") {
            email
          }
        }
      `,
    });
    if (response.data.errors) {
      return false;
    }
    return response.data.data.findEmail;
  } catch (error) {
    throw new Error("Failed to check email");
  }
};

export const githubLogin = async (url) => {
  try {
    const response = await axios.post(API_URL, {
      query: `
      mutation {
      githubLogin{
        githubAuthUrl
      }
    }
      `,
    });
    console.log(response, "response");
    return response.data.data.githubLogin;
  } catch (error) {
    throw new Error("Failed to login with github");
  }
};

export const githubCodeExchange = async (code) => {
  try {
    const response = await axios.post(API_URL, {
      query: `
      mutation {
        githubCodeExchange(code: "${code}") {
          token_type
          access_token
          refresh_token
          expires_in
          username
        }
      }
      `,
    });

    localStorage.setItem(
      "user",
      JSON.stringify(response.data.data.githubCodeExchange.username)
    );
    return response.data.data.githubCodeExchange.username;
  } catch (error) {
    console.error("Error in githubCodeExchange:", error);
    throw new Error("Failed to exchange GitHub code for access token");
  }
};

export const getPullRequestsForUser = async (username) => {
  try {
    const response = await axios.post(API_URL, {
      query: `
        query {
          getPullRequestFromDb(username: "${username}") {
            title
            url
            number
            repo_owner
            repo_name
            createdAt
            repo_id
            user_id
            author_id
            github_pull_metadata
          }
        }
      `,
    });

    console.log(response, "response");
    return response.data.data.getPullRequestFromDb;
  } catch (error) {
    throw new Error("Failed to fetch pull requests for user");
  }
};

export const SearchPullRequests = async (searchKeyword, username) => {
  try {
    const response = await axios.post(API_URL, {
      query: `
        query {
          searchPullRequests(searchKeyword: "${searchKeyword}" username: "${username}") {
            title
            url
            number
            repo_owner
            repo_name
            createdAt
            repo_id
            user_id
            author_id
            github_pull_metadata
          }
        }
      `,
    });
    console.log(response, "response");
    return response.data.data.searchPullRequests;
  } catch (error) {
    throw new Error("Failed to search pull requests");
  }
};

const AuthService = {
  signup,
  checkEmail,
  login,
  githubLogin,
  githubCodeExchange,
  getPullRequestsForUser,
  SearchPullRequests,
};

export default AuthService;
