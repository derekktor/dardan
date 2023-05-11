import { useEffect, useState } from "react";
import { useCreateOrderMutation } from "./ordersApiSlice";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const TRUCKNUM_REGEX = /^[0-9]{4}$/;
const TRUCKLET_REGEX = /^[а-яА-Я]{3}$/;

const AddOrderForm = () => {
  const { name } = useAuth();

  const navigate = useNavigate();
  const [createOrder, { isLoading }] = useCreateOrderMutation();

  const [truckNumValid, setTruckNumValid] = useState(false);
  const [truckLetValid, setTruckLetValid] = useState(false);
  const [orderData, setOrderData] = useState({
    date_entered: new Date(),
    truck_id_digits: "",
    truck_id_letters: "",
    load_name: "",
    load_weight: 0,
    stage: 0,
  });

  useEffect(() => {
    setTruckNumValid(TRUCKNUM_REGEX.test(orderData.truck_id_digits));
  }, [orderData.truck_id_digits]);

  useEffect(() => {
    setTruckLetValid(TRUCKLET_REGEX.test(orderData.truck_id_letters));
  }, [orderData.truck_id_letters]);

  useEffect(() => {
    console.log(`
      ${orderData.load_name}
      ${truckLetValid}
      ${truckNumValid}
    `)
  }, [orderData.load_name, truckLetValid, truckNumValid]);

  const canSave =
    [orderData.load_name, truckLetValid, truckNumValid].every(Boolean) &&
    !isLoading;

  const onChange = (e) => {
    setOrderData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (canSave) {
      try {
        const orderDataComplete = {
          ...orderData,
          created_by_name: name,
        };
        await createOrder(orderDataComplete).unwrap();
        navigate("/dash/orders");
      } catch (error) {
        console.error("Бүртгэлийг илгээж чадсангүй", error);
      }
    }
  };
  return (
    <div className="add-order-form-container">
      <h2>Бүртгэл нэмэх</h2>
      <form onSubmit={onSubmit}>
        <div>
          <label htmlFor="date_entered">Орсон огноо:</label>
          <input
            type="date"
            name="date_entered"
            value={orderData.date_entered}
            onChange={onChange}
          />
        </div>
        <div>
          <label htmlFor="truck_id_digits">Арлын дугаар(тоо):</label>
          <input
            type="text"
            placeholder="1234"
            name="truck_id_digits"
            value={orderData.truck_id_digits}
            onChange={onChange}
          />
        </div>
        <div>
          <label htmlFor="truck_id_letters">Арлын дугаар(үсэг):</label>
          <input
            type="text"
            placeholder="УБА"
            name="truck_id_letters"
            value={orderData.truck_id_letters}
            onChange={onChange}
          />
        </div>
        <div>
          <label htmlFor="load_name">Ачаа, барааны нэр:</label>
          <input
            type="text"
            name="load_name"
            value={orderData.load_name}
            onChange={onChange}
          />
        </div>
        <div>
          <label htmlFor="load_weight">Ачааны жин(тонноор):</label>
          <input
            type="number"
            name="load_weight"
            min={0}
            value={orderData.load_weight}
            onChange={onChange}
          />
        </div>
        <button type="submit" disabled={!canSave}>
          Илгээх
        </button>
      </form>
    </div>
  );
};

export default AddOrderForm;

// TODO
// 1. automatically set date entered and date left to today
// 2. show ₮ at the end of currency input
// garsan orson ognoo
// teevriin heregsliin dugaar
// forklift variable price
// search
