import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { deleteUserThunk, selectUserById } from "./usersSlice";

const SingleUser = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { id } = useParams();
  const user = useSelector((state) => selectUserById(state, id));

  const handleDelete = () => {
    dispatch(deleteUserThunk(id));
    navigate("/users");
  }

  return (
    <div>
      <h2>User Info: {user.name}</h2>
      <p>{user.role ? user.role : user.roles}</p>
      <Link to={`/users/edit/${user._id}`}>Edit</Link>
      <button onClick={handleDelete}>Delete</button>
    </div>
  );
};

export default SingleUser;
