import { useEffect, useState } from "react";
import { useCreateOrderMutation } from "./ordersApiSlice";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { TRUCKLET_REGEX, TRUCKNUM_REGEX, FORKLIFT_REGEX } from "./EditOrderForm";
import moment from "moment";
import { toast } from "react-toastify";

const AddOrderForm = () => {
  const { userId } = useAuth();

  const navigate = useNavigate();
  const [createOrder, { isLoading }] = useCreateOrderMutation();

  // // VARIABLES
  const [truckNumValid, setTruckNumValid] = useState(false);
  const [truckLetValid, setTruckLetValid] = useState(false);
  const [orderData, setOrderData] = useState({
    date_entered: new Date(),
    truck_id_digits: "",
    truck_id_letters: "",
    truck_type: 0,
    puulelt: 0,
    others: 0,
    load_name: "",
    description: "",
    load_weight: 0,
    stage: 0,
  });

  const canSave =
    [orderData.truck_id_digits, truckLetValid, truckNumValid].every(Boolean) &&
    !isLoading;

  // // FUNCTIONS
  const onChange = (e) => {
    setOrderData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    console.log(userId)

    if (canSave) {
      try {
        const orderDataComplete = {
          ...orderData,
          created_by: userId,
        };

        await createOrder(orderDataComplete).unwrap();
        navigate("/dash/orders");
      } catch (error) {
        console.error("Бүртгэлийг илгээж чадсангүй", error);
      }
    } else {
      if (!truckNumValid) {
        toast.error("Арлын дугаар хэтэрхий урт эсвэл богино байна!");
        // navigate(`/dash/orders/edit/${orderId}`);
      }
      if (!truckLetValid) {
        toast.error("Арлын дугаарын үсэг кирилл 3 үсэг байх ёстой!");
        // navigate(`/dash/orders/edit/${orderId}`);
      }
      if (!orderData.truck_id_digits) {
        toast.error("Арлын дугаар заавал байх ёстой!");
        // navigate(`/dash/orders/edit/${orderId}`);
      }
    }
  };

  // // COMPONENTS
  let inputsComp = (
    <>
      <div>
        <label htmlFor="date_entered">Орсон огноо:</label>
        <input
          type="date"
          name="date_entered"
          value={moment(orderData.date_entered).format("YYYY-MM-DD")}
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
        <span className="hint">Кирилл 3 үсэг байх шаардлагатай</span>
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
        <label htmlFor="description">Тайлбар:</label>
        <input
          type="text"
          name="description"
          value={orderData.description}
          onChange={onChange}
        />
      </div>
      <div>
        <label htmlFor="truck_type">Төрөл:</label>
        <select
          name="truck_type"
          id="truck_type"
          onChange={onChange}
          value={orderData.truck_type}
          defaultValue={0}
          disabled={parseInt(orderData.others) !== 0}
        >
          <option value={0}>Энгийн</option>
          <option value={1}>Чиргүүлтэй</option>
        </select>
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
    </>
  );

  let puuleltComp = (
    <div>
      <label htmlFor="puulelt">Зөвхөн Пүүлэлт:</label>
      <select
        name="puulelt"
        id="puulelt"
        onChange={onChange}
        value={orderData.puulelt}
        defaultValue={0}
        disabled={parseInt(orderData.others) !== 0}
      >
        <option value={0}>Ашиглаагүй</option>
        <option value={1}>Суудлын машин</option>
        <option value={2}>Бусад</option>
      </select>
    </div>
  );

  let othersComp = (
    <div>
      <label htmlFor="others">Бусад:</label>
      <select
        name="others"
        id="others"
        onChange={onChange}
        value={orderData.others}
        defaultValue={0}
        disabled={parseInt(orderData.puulelt) !== 0}
      >
        <option value={0}>Үгүй</option>
        <option value={1}>7.1 - кран</option>
        <option value={2}>7.2 - бусад</option>
      </select>
    </div>
  );

  let extrasComp = (
    <>
      {puuleltComp}
      {othersComp}
    </>
  );

  let button = (
    <button className="button" type="submit">
      Илгээх
    </button>
  );

  useEffect(() => {
    setTruckNumValid(TRUCKNUM_REGEX.test(orderData.truck_id_digits));
    setTruckLetValid(TRUCKLET_REGEX.test(orderData.truck_id_letters));
  }, [orderData.truck_id_digits, orderData.truck_id_letters]);

  let content = (
    <div className="add-order-form-container">
      <h2>Бүртгэл нэмэх</h2>
      <form onSubmit={onSubmit}>
        {extrasComp} {inputsComp} {button}
      </form>
    </div>
  );

  return content;
};

export default AddOrderForm;
