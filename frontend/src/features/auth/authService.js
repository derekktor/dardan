import axios from "axios"

const API_URL = "/users/";

// register user
const register = async (userData) => {
    // make post request with user's info(name, password)
    const response = await axios.post(API_URL, userData);

    // save user's info in localstorage(name, password, token)
    if (response.data) {
        localStorage.setItem("user", JSON.stringify(response.data))
    }

    return response.data;
}

const authService = {
    register
}

export default authService;