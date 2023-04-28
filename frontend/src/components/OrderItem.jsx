import { useDispatch } from "react-redux";
import { deleteOrderThunk } from "../features/orders/orderSlice";

const OrderItem = ({ order }) => {
  const dispatch = useDispatch();

  return (
    <div className="goal">
      <div>
        <p>
          {new Date(order.date_entered).toLocaleDateString("en-US", {
            month: "2-digit",
            day: "2-digit",
            year: "numeric",
          })}
        </p>
        <p>
          {new Date(order.date_left).toLocaleDateString("en-US", {
            month: "2-digit",
            day: "2-digit",
            year: "numeric",
          })}
        </p>
        <h2>{order.client_name}</h2>
        <p>
          {order.truck_num.digits} {order.truck_num.letters}
        </p>
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
