import { useSelector } from "react-redux";
import { selectUserById } from "./usersApiSlice";
import { useNavigate, Link } from "react-router-dom";
import { useDeleteUserMutation } from "./usersApiSlice";

const UserExcerpt = ({ userId }) => {
  const navigate = useNavigate;
  const [deleteUser] = useDeleteUserMutation();
  const user = useSelector((state) => selectUserById(state, userId));

  const handleDelete = async (userId) => {
    try {
      await deleteUser(userId);
      navigate(`/dash/users`);
    } catch (error) {}
  };

  if (user) {
    const userRolesString = user.roles.toString().replaceAll(",", ", ");
    return (
      <div className="blocks">
        <h4>{user.name}</h4>
        <p>{userRolesString}</p>
        <div className="buttons">
          <Link to={`/dash/users/${userId}`}>More</Link>
          <Link to={`/dash/users/edit/${userId}`}>Edit</Link>
          <button onClick={() => handleDelete(userId)}>Delete</button>
        </div>
      </div>
    );
  } else return null;
};

export default UserExcerpt;
