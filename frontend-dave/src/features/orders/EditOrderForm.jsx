import { useNavigate, useParams } from "react-router-dom";
import { updateOrderThunk, selectOrderById, useUpdateOrderMutation } from "./ordersApiSlice";
import { useSelector } from "react-redux";
import { useState } from "react";

const EditOrderForm = () => {
  const navigate = useNavigate();
  const [updateOrder, { isLoading }] = useUpdateOrderMutation();

  const { orderId } = useParams();
  const order = useSelector((state) => {
    return selectOrderById(state, orderId);
  });


  const [orderData, setOrderData] = useState({
    id: order?._id || "",
    client_name: order?.client_name || "",
    load_name: order?.load_name || "",
  });


  const onChange = (e) => {
    setOrderData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const canSave =
    [orderData.client_name, orderData.load_name].some(Boolean) && !isLoading;

  const onSubmit = async (e) => {
    e.preventDefault();

    if (canSave) {
      try {
        await updateOrder(orderData);
        navigate(`/dash/orders/${orderId}`);
      } catch (error) {
        console.error("Бүртгэлийг өөрчилж чадсангүй", error);
      }
    }
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
