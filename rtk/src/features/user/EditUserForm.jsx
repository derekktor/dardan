import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { selectUserById, updateUserThunk } from "./usersSlice";

const EditUserForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { id } = useParams();
  const user = useSelector((state) => selectUserById(state, id));

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

  const onSubmit = (e) => {
    e.preventDefault();

    console.log(userData);
    dispatch(updateUserThunk(userData));
    navigate(`/users/${id}`);
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
