import { useSelector } from "react-redux";
import { selectUserById } from "./usersApiSlice";
import { useNavigate, Link } from "react-router-dom";
import { useDeleteUserMutation } from "./usersApiSlice";

const UserExcerpt = ({ userId }) => {
  const navigate = useNavigate();
  const [deleteUser] = useDeleteUserMutation();
  const user = useSelector((state) => selectUserById(state, userId));

  const handleDelete = async (userId) => {
    try {
      await deleteUser(userId);
      navigate(`/dash/users`);
    } catch (error) {}
  };

  const handleEdit = (userId) => {
    navigate(`/dash/users/edit/${userId}`);
  };

  const handleMore = (userId) => {
    navigate(`/dash/users/${userId}`);
  };

  if (user) {
    const userRolesString = user.roles.toString().replaceAll(",", ", ");
    return (
      <>
        <h4>{user.name}</h4>
        <p>{userRolesString}</p>
        <div className="buttons">
          <button onClick={() => handleMore(userId)}>Дэлгэрэнгүй</button>
          <button onClick={() => handleEdit(userId)}>Өөрчлөх</button>
          <button onClick={() => handleDelete(userId)}>Устгах</button>
        </div>
      </>
    );
  } else return null;
};

export default UserExcerpt;
