import { useSelector } from "react-redux";
import { selectOrderById, useDeleteOrderMutation } from "./ordersApiSlice";
import { useParams, Link, useNavigate } from "react-router-dom";

const SingleOrder = () => {
  const [deleteOrder] = useDeleteOrderMutation();
  const navigate = useNavigate();

  const { orderId } = useParams();
  const order = useSelector((state) => selectOrderById(state, String(orderId)));

  const handleDelete = async (orderId) => {
    try {
      await deleteOrder(orderId).unwrap();
      navigate("/dash/orders");
    } catch (error) {
      console.error("Бүртгэлийг устгаж чадсангүй", error);
    }
  };

  return (
    <div>
      <h1>{orderId}</h1>
      <h1>{order?.client_name}</h1>
      <p>Load: {order?.load_name}</p>
      <p>Created by: {order?.created_by_name}</p>
      <p>Created at: {order?.createdAt}</p>
      <p>Updated at: {order?.updatedAt}</p>
      <div className="buttons">
        <Link to={`/dash/orders/edit/${orderId}`}>Edit</Link>
        <button onClick={() => handleDelete(orderId)}>Delete</button>
      </div>
    </div>
  );
};

export default SingleOrder;
