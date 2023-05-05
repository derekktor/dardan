import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { deleteUserThunk, selectUserById } from "./usersSlice";
// import { useGetOrdersByUserIdQuery } from "../order/ordersSlice";
import { useDeleteUserMutation } from "./usersSlice";

const SingleUser = () => {
  const navigate = useNavigate();
  const [deleteUser] = useDeleteUserMutation();
  // const {
    //   data: ordersByUser,
  //   isLoading, 
  //   isSuccess,
  //   isError,
  //   error
  // } = useGetOrdersByUserIdQuery(userId);
  
  const { userId } = useParams();
  const user = useSelector(state => selectUserById(state, userId));

  const handleDelete = async () => {
    try {
      await deleteUser(userId).unwrap();
      navigate("/users");
    } catch (error) {
        console.error("Хэрэглэгчийн мэдээллийг устгаж чадсангүй", error);
    }
  }

  // let content;
  // if (isLoading) {
  //   content = <h4>Loading...</h4>
  // } else if (isSuccess) {
  //   const {ids, entities} = ordersByUser;
  //   content = ids.map(userId => (
  //     <li key={userId}>
  //         <Link to={`/orders/${userId}`}>{entities[userId].client_name}</Link>
  //     </li>
  //   ))
  // } else if (isError) {
  //   content = <h4>{error}</h4>
  // }

  return (
    <div>
      <h2>Хэрэглэгчийн нэр: {user.name}</h2>
      <p>{user.roles}</p>
      <Link to={`/users/edit/${userId}`}>Edit</Link>
      <button onClick={() => handleDelete(userId)}>Delete</button>
      {/* <section>
        {content}
      </section> */}
    </div>
  );
};

export default SingleUser;
