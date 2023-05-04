import { useDispatch, useSelector } from "react-redux";
import {
  selectAllOrders,
} from "./ordersSlice";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { deleteOrderThunk } from "./ordersSlice";

const OrdersList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const orders = useSelector(selectAllOrders);

  const handleDelete = (orderId) => {
    dispatch(deleteOrderThunk(orderId));
    navigate("/orders");
  };


  let ordersElement;

  if (orders.length === 0) {
    ordersElement = <h4>Ямар ч бүртгэл байхгүй байна</h4>;
  } else {
    ordersElement = orders.map((order) => (
      <div key={order._id}>
        <div className="orders" key={order._id}>
          <h3>Client: {order.client_name}</h3>
          <p>Load: {order.load_name}</p>
          <Link to={`${order._id}`}>More</Link>
          <Link to={`edit/${order._id}`}>Edit</Link>
          <button onClick={() => handleDelete(order._id)}>Delete</button>
        </div>
      </div>
    ));
  }

  return (
    <div>
      <h1>Бүртгэлүүд</h1>
      {ordersElement}
    </div>
  );
};

export default OrdersList;
