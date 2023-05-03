import { useState } from "react"
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createUserThunk } from "./usersSlice";

const AddUserForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [userData, setUserData] = useState({
    name: "",
    password: "",
    role: "",
  });
  
  const onChange = (e) => {
    setUserData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }
  
  const onSubmit = (e) => {
    e.preventDefault();

    dispatch(createUserThunk(userData))
    navigate("/users");
  }

  return (
    <div>
      <h1>Add User</h1>
      <form onSubmit={onSubmit}>
        <div>
          <label htmlFor="name">Name:</label>
          <input type="text" name="name" value={userData.name} onChange={onChange}/>
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input type="text" name="password" value={userData.password} onChange={onChange}/>
        </div>
        <div>
          <label htmlFor="roles">Roles:</label>
          <input type="text" name="role" value={userData.role} onChange={onChange}/>
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  )
}

export default AddUserForm