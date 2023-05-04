import { useState } from "react";
import { useDispatch } from "react-redux";
import { createOrderThunk } from "./ordersSlice";
import { useNavigate } from "react-router-dom";

const AddOrderForm = () => {
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

  const onSubmit = (e) => {
    e.preventDefault();

    dispatch(createOrderThunk(orderData));
    navigate("/orders")
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
