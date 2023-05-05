import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { deleteUserThunk, selectUserById } from "./usersSlice";
import { useGetOrdersByUserIdQuery } from "../order/ordersSlice";

const SingleUser = () => {
  const { userId } = useParams();
  const {
    data: ordersByUser,
    isLoading, 
    isSuccess,
    isError,
    error
  } = useGetOrdersByUserIdQuery(userId);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector(state => selectUserById(state, userId));


  const handleDelete = () => {
    dispatch(deleteUserThunk(userId));
    navigate("/users");
  }

  let content;
  if (isLoading) {
    content = <h4>Loading...</h4>
  } else if (isSuccess) {
    const {ids, entities} = ordersByUser;
    content = ids.map(orderId => (
      <li key={orderId}>
          <Link to={`/orders/${orderId}`}>{entities[orderId].client_name}</Link>
      </li>
    ))
  } else if (isError) {
    content = <h4>{error}</h4>
  }

  return (
    <div>
      <h2>Хэрэглэгчийн нэр: {user.name}</h2>
      <p>{user.roles}</p>
      <Link to={`/users/edit/${user._id}`}>Edit</Link>
      <button onClick={handleDelete}>Delete</button>
      <section>
        {content}
      </section>
    </div>
  );
};

export default SingleUser;
