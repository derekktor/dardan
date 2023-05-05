import { useSelector } from "react-redux";
import { selectUserById } from "./usersSlice";
import { useNavigate, Link } from "react-router-dom";
import { useDeleteUserMutation } from "./usersSlice";

const UserExcerpt = ({ userId }) => {
  const navigate = useNavigate
  const [deleteUser] = useDeleteUserMutation();
  const user = useSelector((state) => selectUserById(state, userId));

  const handleDelete = async (userId) => {
    try {
      await deleteUser(userId);
      navigate(`/users`);
    } catch (error) {}
  };

  return (
    <div className="users">
      <h4>{user.name}</h4>
      <p>{user.roles}</p>
      <Link to={`/users/${userId}`}>More</Link>
      <Link to={`/users/edit/${userId}`}>Edit</Link>
      <button onClick={() => handleDelete(userId)}>Delete</button>
    </div>
  );
};

export default UserExcerpt;
