import { useState } from "react";
import { useDispatch } from "react-redux";
import { createOrderThunk } from "./ordersSlice";
import { useNavigate } from "react-router-dom";
import { useCreateOrderMutation } from "./ordersSlice";

const AddOrderForm = () => {
  // const [createOrder] = useCreateOrderMutation();

  const [createOrder, { isLoading }] = useCreateOrderMutation();

  const [orderData, setOrderData] = useState({
    client_name: "",
    load_name: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

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
        await createOrder(orderData).unwrap();
        navigate("/orders");
      } catch (error) {
        console.error("Бүртгэлийг илгээж чадсангүй", error);
      }
    }
  };

  return (
    <div>
      <h2>Бүртгэл нэмэх</h2>
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

export default AddOrderForm;
