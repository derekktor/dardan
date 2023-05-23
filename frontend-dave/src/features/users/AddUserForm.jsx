import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateUserMutation } from "./usersApiSlice";
import { ROLES } from "../../config/roles";

const NAME_REGEX = /^[A-z]{2,20}$/;

const AddUserForm = () => {
  const navigate = useNavigate();
  const [createUser, { isLoading, isSuccess, isError, error }] =
    useCreateUserMutation();

  const [userData, setUserData] = useState({
    name: "",
    password: "",
  });
  const [isNameValid, setIsNameValid] = useState(false);
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    setIsNameValid(NAME_REGEX.test(userData.name));
  }, [userData.name]);

  useEffect(() => {
    if (isSuccess) {
      setUserData({
        name: "",
        password: "",
      });
      setRoles([]);
      navigate("/dash/users");
    }
  }, [isSuccess, navigate]);

  const onChange = (e) => {
    setUserData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleRoles = (e) => {
    const values = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setRoles(values);
  };

  // const canSave = userData.name || userData.password;
  const canSave = [roles.length, isNameValid].every(Boolean) && !isLoading;

  const onSubmit = async (e) => {
    e.preventDefault();

    if (canSave) {
      try {
        await createUser({ ...userData, roles }).unwrap();
        navigate("/dash/users");
      } catch (error) {
        console.error("Хэрэглэгчийг үүсгэж чадсангүй", error);
      }
    }
  };

  const rolesOptions = Object.values(ROLES).map((role) => {
    return (
      <option key={role} value={role}>
        {role}
      </option>
    );
  });

  return (
    <div>
      {error ? <p>{error?.data?.message}</p> : null}
      <h2>Хэрэглэгч нэмэх</h2>
      <form onSubmit={onSubmit}>
        <div>
          <label htmlFor="name">Name:</label>
          <input
            id="name"
            type="text"
            name="name"
            autoComplete="off"
            value={userData.name}
            onChange={onChange}
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            id="password"
            type="password"
            name="password"
            value={userData.password}
            onChange={onChange}
          />
        </div>
        <div>
          <label htmlFor="roles">Roles:</label>
          <select
            name="roles"
            id="roles"
            multiple={true}
            size={2}
            value={roles}
            onChange={handleRoles}
          >
            {rolesOptions}
          </select>
        </div>
        <button type="submit" disabled={!canSave}>
          Submit
        </button>
      </form>
    </div>
  );
};

export default AddUserForm;
