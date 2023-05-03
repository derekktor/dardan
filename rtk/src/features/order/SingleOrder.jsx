import { useDispatch, useSelector } from "react-redux";
import { deleteOrderThunk, selectOrderById } from "./ordersSlice";
import { useParams, Link, useNavigate } from "react-router-dom";

const SingleOrder = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { orderId } = useParams();
  const order = useSelector((state) => selectOrderById(state, String(orderId)));

  const handleDelete = () => {
    dispatch(deleteOrderThunk(orderId));
    navigate("/orders")
  }

  return (
    <div>
      <h1>{orderId}</h1>
      <h1>{order.client_name}</h1>
      <p>Load: {order.load_name}</p>
      <Link to={`/orders/edit/${orderId}`}>Edit</Link>
      <button onClick={handleDelete}>Delete</button>
    </div>
  );
};

export default SingleOrder;
