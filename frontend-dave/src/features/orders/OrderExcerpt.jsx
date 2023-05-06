import { useDispatch, useSelector } from "react-redux";
import { selectOrderById, useDeleteOrderMutation } from "./ordersApiSlice";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const OrderExcerpt = ({ orderId }) => {
  const [deleteOrder] = useDeleteOrderMutation();
  const navigate = useNavigate();

  const order = useSelector((state) => selectOrderById(state, orderId));

  const handleDelete = async (orderId) => {
    try {
      await deleteOrder(orderId).unwrap();
      navigate("/dash/orders");
    } catch (error) {
      console.error("Бүртгэлийг устгаж чадсангүй", error);
    }
  };

  if (order) {
    return (
      <div className="blocks">
        <h3>Client: {order.client_name}</h3>
        <p>Load: {order.load_name}</p>
        <div className="buttons">
          <Link to={`${orderId}`}>More</Link>
          <Link to={`edit/${orderId}`}>Edit</Link>
          <button onClick={() => handleDelete(orderId)}>Delete</button>
        </div>
      </div>
    );
  } else return null;
};

export default OrderExcerpt;
