import axios from 'axios';

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
      if (response.data.accessToken) {
        localStorage.setItem("user", JSON.stringify(response.data));
      }
      return response.data;
    });
};

const signup = (email, password) => {
  return axios
    .post(API_URL + "/graphql", {
      query: `
        mutation {
          createUser(payload: {
            email: "${email}",
            password: "${password}"
          }) {
            email
            password
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
    throw new Error('Failed to fetch users');
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
    throw new Error('Failed to delete user');
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
    throw new Error('Failed to update user');
  }
};



const AuthService = {
  signup,
  login
};

export default AuthService;
