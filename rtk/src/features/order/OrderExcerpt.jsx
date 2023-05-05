import { useDispatch, useSelector } from "react-redux";
import { selectOrderById } from "./ordersSlice";
import { useNavigate } from "react-router-dom";
import { useDeleteOrderMutation } from "./ordersSlice";
import { Link } from "react-router-dom";

const OrderExcerpt = ({ orderId }) => {
  const [deleteOrder] = useDeleteOrderMutation();
  const navigate = useNavigate();

  const order = useSelector((state) => selectOrderById(state, orderId));

  const handleDelete = async (orderId) => {
    try {
      await deleteOrder(orderId).unwrap();
      navigate("/orders");
    } catch (error) {
        console.error("Бүртгэлийг устгаж чадсангүй", error);
    }
  };

  return (
    <div className="orders">
      <h3>Client: {order.client_name}</h3>
      <p>Load: {order.load_name}</p>
      <Link to={`${orderId}`}>More</Link>
      <Link to={`edit/${orderId}`}>Edit</Link>
      <button onClick={() => handleDelete(orderId)}>Delete</button>
    </div>
  );
};

export default OrderExcerpt;
