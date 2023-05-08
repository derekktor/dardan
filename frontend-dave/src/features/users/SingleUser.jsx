import { useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { selectUserById, useDeleteUserMutation } from "./usersApiSlice";
// import { useGetOrdersByUserIdQuery } from "../orders/ordersApiSlice";

const SingleUser = () => {
  const navigate = useNavigate();
  const [deleteUser] = useDeleteUserMutation();

  const { userId } = useParams();
  const user = useSelector((state) => selectUserById(state, userId));

  // const {
  //   data: ordersByUser,
  //   isLoading,
  //   isSuccess,
  //   isError,
  //   error,
  // } = useGetOrdersByUserIdQuery(userId);

  const handleDelete = async () => {
    try {
      await deleteUser(userId).unwrap();
      navigate("/dash/users");
    } catch (error) {
      console.error("Хэрэглэгчийн мэдээллийг устгаж чадсангүй", error);
    }
  };

  // let content;
  // if (isLoading) {
  //   content = <h4>Loading...</h4>;
  // } else if (isSuccess) {
  //   const { ids, entities } = ordersByUser;
  //   content = ids.map((userId) => (
  //     <li key={userId}>
  //       <Link to={`/orders/${userId}`}>{entities[userId].client_name}</Link>
  //     </li>
  //   ));
  // } else if (isError) {
  //   content = <h4>{error}</h4>;
  // }

  if (user) {
    return (
      <div>
        <h2>
          <span style={{ fontSize: "14px" }}>Хэрэглэгчийн нэр: </span>
          {user.name}
        </h2>
        <p>{user.roles}</p>
        <p>Үүсгэсэн: {user.createdAt}</p>
        <p>Шинэчилсэн: {user.updatedAt}</p>
        <div className="buttons">
          <Link to={`/dash/users/edit/${userId}`}>Edit</Link>
          <button onClick={() => handleDelete(userId)}>Delete</button>
        </div>
        {/* <div>{content}</div> */}
      </div>
    );
  } else return null;
};

export default SingleUser;
