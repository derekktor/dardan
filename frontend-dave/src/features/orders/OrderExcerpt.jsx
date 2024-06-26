import { useDispatch, useSelector } from "react-redux";
import { selectOrderById, useDeleteOrderMutation } from "./ordersApiSlice";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { formatDate } from "./SingleOrder";

const OrderExcerpt = ({ orderId }) => {
  const { isAdmin } = useAuth();

  const [deleteOrder] = useDeleteOrderMutation();
  const navigate = useNavigate();

  const order = useSelector((state) => selectOrderById(state, orderId));

  const handleDelete = async (orderId) => {
    if (window.confirm("Та устгахдаа итгэлтэй байна уу?")) {
      try {
        await deleteOrder(orderId).unwrap();
        navigate("/dash/orders");
      } catch (error) {
        console.error("Бүртгэлийг устгаж чадсангүй", error);
      }
    }
  };

  const handleEdit = (orderId) => {
    navigate(`/dash/orders/edit/${orderId}`);
  };

  const handleMore = (orderId) => {
    navigate(`/dash/orders/${orderId}`);
  };

  if (order) {
    return (
      <div
        className={
          order.stage === 0
            ? "order-unfinished orders-grid"
            : "order-finished orders-grid"
        }
      >
        <div>
          {order.truck_id_digits} {order.truck_id_letters}
        </div>
        <div>{formatDate(order.date_entered)}</div>
        <div>{order.load_name}</div>
        <div>{order.description}</div>
        <div>
          <div className="buttons">
            <button onClick={() => handleMore(orderId)}>Дэлгэрэнгүй</button>
            <button onClick={() => handleEdit(orderId)}>Өөрчлөх</button>
            <button onClick={() => handleDelete(orderId)}>Устгах</button>
          </div>
        </div>
      </div>
    );
  } else return null;
};

export default OrderExcerpt;
