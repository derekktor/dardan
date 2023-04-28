import { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { createOrderThunk } from "../features/orders/orderSlice";

const OrderForm = () => {
  const [orderData, setOrderData] = useState({
    truck_num_digits: "",
    truck_num_letters: "",
    load_name: "",
  });

  const { truck_num_digits, truck_num_letters, load_name } = orderData;

  const dispatch = useDispatch();

  const onChange = (e) => {
    setOrderData((prevState) => ({
      ...orderData,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();

    toast.success("Order submitted!");

    dispatch(createOrderThunk(orderData));

    // clear the form
    setOrderData({
      truck_num_digits: "",
      truck_num_letters: "",
      load_name: "",
    });
  };

  return (
    <section className="form">
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="text">Arliin dugaar</label>
          <input
            type="text"
            name="truck_num_digits"
            id="truck_num_digits"
            value={truck_num_digits}
            placeholder="1234"
            onChange={onChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="text">Arliin dugaariin useg</label>
          <input
            type="text"
            name="truck_num_letters"
            id="truck_num_letters"
            value={truck_num_letters}
            placeholder="UBA"
            onChange={onChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="text">Achaanii ner</label>
          <input
            type="text"
            name="load_name"
            id="load_name"
            value={load_name}
            placeholder="cements"
            onChange={onChange}
          />
        </div>
        <button className="btn btn-block" type="submit">
          Submit
        </button>
      </form>
    </section>
  );
};

export default OrderForm;
