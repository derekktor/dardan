import { useNavigate, useParams } from "react-router-dom";
import { updateOrderThunk, selectOrderById } from "./ordersSlice";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useState } from "react";

const EditOrderForm = () => {
  const { orderId } = useParams();
  const order = useSelector((state) => selectOrderById(state, String(orderId)));

  const [orderData, setOrderData] = useState({
    id: order._id,
    client_name: order.client_name,
    load_name: order.load_name,
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onChange = (e) => {
    setOrderData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();

    dispatch(updateOrderThunk(orderData));
    navigate(`/orders/${orderId}`)

  };

  return (
    <div>
      <h2>Бүртгэлийн мэдээллийг өөрчлөх</h2>
      <form onSubmit={onSubmit}>
        <div>
          <label htmlFor="client_name">Client:</label>
          <input
            type="text"
            name="client_name"
            value={orderData.client_name}
            onChange={onChange}
          />
        </div>
        <div>
          <label htmlFor="load_name">Load:</label>
          <input
            type="text"
            name="load_name"
            value={orderData.load_name}
            onChange={onChange}
          />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default EditOrderForm;
