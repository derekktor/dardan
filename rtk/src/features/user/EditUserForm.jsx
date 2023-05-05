import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { selectUserById } from "./usersSlice";
import { useUpdateUserMutation } from "./usersSlice";

const EditUserForm = () => {
  const navigate = useNavigate();
  const [updateUser, { isLoading }] = useUpdateUserMutation();

  const { userId } = useParams();
  const user = useSelector((state) => {
    return selectUserById(state, userId)
  }
  );

  const [userData, setUserData] = useState({
    id: user._id,
    name: user.name,
    password: user.password,
  });

  const [roles, setRoles] = useState([user.roles]);

  const onChange = (e) => {
    setUserData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const canSave = (userData.name || roles) && !isLoading;

  const onSubmit = async (e) => {
    e.preventDefault();

    if (canSave) {
      try {
        console.log(userData)
        await updateUser(userData);
        navigate(`/users/${userId}`);
      } catch (error) {
        console.error("Хэрэглэгчийн мэдээллийг өөрчилж чадсангүй", error);
      }
    }
  };

  return (
    <div>
      <h2>Хэрэглэгчийн мэдээллийг өөрчлөх</h2>
      <form onSubmit={onSubmit}>
        <div>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            name="name"
            value={userData.name}
            onChange={onChange}
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="text"
            name="password"
            value={userData.password}
            onChange={onChange}
          />
        </div>
        <div>
          <label htmlFor="roles">Role:</label>
          <input
            type="text"
            name="roles"
            value={roles}
            onChange={(e) => setRoles([e.target.value])}
          />
        </div>

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default EditUserForm;
