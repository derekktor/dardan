import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { selectUserById } from "./usersApiSlice";
import { useUpdateUserMutation, useDeleteUserMutation } from "./usersApiSlice";
import { ROLES } from "../../config/roles";

const NAME_REGEX = /^[A-z]{2,20}$/;

const EditUserForm = () => {
  const navigate = useNavigate();
  const [updateUser, { isLoading, isSuccess, isError, error }] =
    useUpdateUserMutation();
  const [
    deleteUser,
    {
      isLoading: isDelLoading,
      isSuccess: isDelSuccess,
      isError: isDelError,
      error: delError,
    },
  ] = useDeleteUserMutation();

  const { userId } = useParams();
  const user = useSelector((state) => {
    return selectUserById(state, userId);
  });

  const [userData, setUserData] = useState({
    id: user._id,
    name: user.name,
    password: user.password,
  });
  const [isNameValid, setIsNameValid] = useState(false);
  const [roles, setRoles] = useState(user.roles);

  // validate user name
  useEffect(() => {
    setIsNameValid(NAME_REGEX.test(userData.name));
  }, [userData.name]);

  useEffect(() => {
    if (isSuccess || isDelSuccess) {
      setUserData({
        name: "",
        password: "",
      });
      setRoles([]);
      navigate("/dash/users");
    }
  }, [isSuccess, isDelSuccess, navigate]);

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

  const handleDelete = async () => {
    await deleteUser(userId);
    navigate(`/dash/users/${userId}`);
  };

  // const canSave = (userData.name || roles) && !isLoading;
  const canSave = [roles.length, isNameValid].every(Boolean) && !isLoading;

  const onSubmit = async (e) => {
    e.preventDefault();

    if (canSave) {
      try {
        console.log(userData);
        await updateUser(userData);
        navigate(`/dash/users/${userId}`);
      } catch (error) {
        console.error("Хэрэглэгчийн мэдээллийг өөрчилж чадсангүй", error);
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

  if (user) {
    return (
      <>
        {error ? <p>UpdateError: {error?.data?.message}</p> : null}
        {delError ? <p>DeleteError: {delError?.data?.message}</p> : null}
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
      </>
    );
  } else return <p>Уншиж байна...</p>;
};

export default EditUserForm;
