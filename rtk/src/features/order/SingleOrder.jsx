import { useSelector } from "react-redux";
import { selectOrderById } from "./ordersSlice";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDeleteOrderMutation } from "./ordersSlice";

const SingleOrder = () => {
  const [deleteOrder] = useDeleteOrderMutation();
  const navigate = useNavigate();

  const { orderId } = useParams();
  const order = useSelector((state) => selectOrderById(state, String(orderId)));

  const handleDelete = async (orderId) => {
    try {
      await deleteOrder(orderId).unwrap();
      navigate("/orders");
    } catch (error) {
        console.error("Бүртгэлийг устгаж чадсангүй", error);
    }
  };

  return (
    <div>
      <h1>{orderId}</h1>
      <h1>{order?.client_name}</h1>
      <p>Load: {order?.load_name}</p>
      <Link to={`/orders/edit/${orderId}`}>Edit</Link>
      <button onClick={() => handleDelete(orderId)}>Delete</button>
    </div>
  );
};

export default SingleOrder;
