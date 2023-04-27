import axios from "axios";

// register user
const register = async (userData) => {
  // make post request with user's info(name, password)
  const response = await axios.post("http://localhost:5000/users/", userData);

  // save user's info in localstorage(name, password, token)
  if (response.data) {
    localStorage.setItem("user", JSON.stringify(response.data));
  }

  return response.data;
};

// log in user
const login = async (userData) => {
  const response = await axios.post("http://localhost:5000/users/login", userData);

  if (response.data) {
    localStorage.setItem("user", JSON.stringify(response.data));
  }
  
  return response.data;
}

// log out
const logout = async () => {
  localStorage.removeItem("user")
}

const authService = {
  register,
  login,
  logout
};

export default authService;
