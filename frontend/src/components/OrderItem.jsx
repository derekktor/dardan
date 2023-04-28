import { useDispatch } from "react-redux";
import { deleteOrderThunk } from "../features/orders/orderSlice";

const OrderItem = ({ order }) => {
  const dispatch = useDispatch();

  return (
    <div className="goal">
      <div>
        {new Date(order.createdAt).toLocaleString("en-US")}
        <h2>{order.load_name}</h2>
        <p>{order.created_by_name}</p>
        <button
          onClick={() => dispatch(deleteOrderThunk(order._id))}
          className="close"
        >
          X
        </button>
      </div>
    </div>
  );
};

export default OrderItem;
