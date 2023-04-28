import { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { createOrderThunk } from "../features/orders/orderSlice";

const OrderForm = () => {
  const [truckNum, setTruckNum] = useState("");
  const [loadName, setLoadName] = useState("");

  const dispatch = useDispatch();

  const onSubmit = (e) => {
    e.preventDefault();

    toast.success("Order submitted!");

    dispatch(createOrderThunk({loadName, truckNum}))

    // clear the form
    setLoadName("");
  };

  return (
    <section className="form">
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="text">Arliin dugaar</label>
          <input
            type="text"
            name="truckNum"
            id="truckNum"
            value={truckNum}
            onChange={(e) => setTruckNum(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="text">Achaanii ner</label>
          <input
            type="text"
            name="loadName"
            id="loadName"
            value={loadName}
            onChange={(e) => setLoadName(e.target.value)}
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
