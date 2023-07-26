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

const signup = async (payload) => {
  console.log(payload,"payload");
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

  // console.log('AGE ---------------> ', age, mobileNumber, city)

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

// auth.js
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
      throw new Error('Email not found in the database.');
    }

    return response.data.data.findEmail;
  } catch (error) {
    throw new Error('Email not found in the database.');
  }
};






const AuthService = {
  signup,
  checkEmail,
  login
};

export default AuthService;
