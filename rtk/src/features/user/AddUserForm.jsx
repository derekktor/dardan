import { useState } from "react"
import { useNavigate } from "react-router-dom";
import { useCreateUserMutation } from "./usersSlice";

const AddUserForm = () => {
  const navigate = useNavigate();
  const [createUser] = useCreateUserMutation();

  const [userData, setUserData] = useState({
    name: "",
    password: "",
    roles: "",
  });
  
  const onChange = (e) => {
    setUserData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }
  
  const canSave = userData.name || userData.roles;
  
  const onSubmit = async (e) => {
    e.preventDefault();

    if (canSave) {
      try {
        await createUser(userData).unwrap();
        navigate("/users");
      } catch (error) {
        console.error("Хэрэглэгчийг үүсгэж чадсангүй", error);
      }
    }
  }

  return (
    <div>
      <h2>Хэрэглэгч нэмэх</h2>
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
          <input type="text" name="roles" value={userData.roles} onChange={onChange}/>
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  )
}

export default AddUserForm