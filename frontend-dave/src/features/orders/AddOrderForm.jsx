import { useState } from "react";
import { useCreateOrderMutation } from "./ordersApiSlice";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const AddOrderForm = () => {
  const {name} = useAuth();

  const navigate = useNavigate();
  const [createOrder, { isLoading }] = useCreateOrderMutation();

  const [orderData, setOrderData] = useState({
    client_name: "",
    load_name: "",
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
        const orderDataWithCreator = {...orderData, created_by_name: name}
        await createOrder(orderDataWithCreator).unwrap();
        navigate("/dash/orders");
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
