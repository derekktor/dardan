import { useDispatch, useSelector } from "react-redux";
import {
  deleteUserThunk,
  selectAllUsers,
} from "./usersSlice";
import { Link, useNavigate } from "react-router-dom";

const UsersList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const users = useSelector(selectAllUsers);
  let content = null;

  const handleDelete = (userId) => {
    dispatch(deleteUserThunk(userId));
    navigate(`/users`);
  };

  const usersElement = users.length === 0 ? (<h1>There are no users!</h1>) : users.map((user) => (
    <div key={user._id} className="users">
      <h4>{user.name}</h4>
      <p>{user.role ? user.role : user.roles}</p>
      <Link to={`/users/${user._id}`}>More</Link>
      <Link to={`/users/edit/${user._id}`}>Edit</Link>
      <button onClick={() => handleDelete(user._id)}>Delete</button>
    </div>

  ));

  content = (
    <>
      <h1>Users</h1>
      <div>{usersElement}</div>
    </>
  );

  return content;
};

export default UsersList;
