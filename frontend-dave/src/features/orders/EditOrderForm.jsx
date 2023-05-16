import { useNavigate, useParams } from "react-router-dom";
import { useUpdateOrderMutation, useGetOrdersQuery } from "./ordersApiSlice";
import { useState } from "react";
import useAuth from "../../hooks/useAuth";
import moment from "moment";
import { useEffect } from "react";

export const TRUCKNUM_REGEX = /^[0-9]{4,10}$/;
export const TRUCKLET_REGEX = /^([а-яА-ЯөӨүҮ]{3})?$/;

const EditOrderForm = () => {
  const { name } = useAuth();

  const navigate = useNavigate();
  const [updateOrder, { isLoading }] = useUpdateOrderMutation();

  const { orderId } = useParams();
  const { order } = useGetOrdersQuery("ordersList", {
    selectFromResult: ({ data }) => ({
      order: data?.entities[orderId],
    }),
  });

  const [orderData, setOrderData] = useState({
    ...order,
    date_left: order?.date_left ? order?.date_left : "",
    tavtsan_usage: order?.tavtsan_usage ? order?.tavtsan_usage : "",
    puulelt: order?.puulelt ? order?.puulelt : "",
    forklift_usage: order?.forklift_usage ? order?.forklift_usage : "",
    crane_usage: order?.crane_usage ? order?.crane_usage : "",
    fine1: order?.fine1 ? order?.fine1 : "",
    fine2: order?.fine2 ? order?.fine2 : "",
    other1: order?.other1 ? order?.other1 : "",
    other2: order?.other2 ? order?.other2 : "",
    invoice_to_302: order?.invoice_to_302 ? order?.invoice_to_302 : "",
    invoice_to_601: order?.invoice_to_601 ? order?.invoice_to_601 : "",
    amount_w_noat: order?.amount_w_noat ? order?.amount_w_noat : "",
    amount_wo_noat: order?.amount_wo_noat ? order?.amount_wo_noat : "",
    client_name: order?.client_name ? order?.client_name : "",
  });

  const [truckNumValid, setTruckNumValid] = useState(false);
  const [truckLetValid, setTruckLetValid] = useState(false);

  useEffect(() => {
    setTruckNumValid(TRUCKNUM_REGEX.test(orderData.truck_id_digits));
  }, [orderData.truck_id_digits]);

  useEffect(() => {
    setTruckLetValid(TRUCKLET_REGEX.test(orderData.truck_id_letters));
  }, [orderData.truck_id_letters]);

  useEffect(() => {
    // console.log(orderData.tavtsan_usage)
  }, [orderData.tavtsan_usage]);

  const onChange = (e) => {
    setOrderData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // const handleTavtsanChange = (e) => {
  //   setTavtsan(e.target.value);
  // };

  // const handleCraneChange = (e) => {
  //   setCrane(e.target.value);
  // };

  const handleDateChange = (e) => {
    const date = moment(new Date(e.target.value)).format("YYYY-MM-DD");
    setOrderData({ ...orderData, [e.target.name]: date });
  };

  const canSave = [truckLetValid, truckNumValid].every(Boolean) && !isLoading;

  const onSubmit = async (e) => {
    e.preventDefault();

    const sendingData = {
      ...orderData,
      stage: 1,
      last_edited_by: name,
    };

    if (new Date(orderData.date_entered) > new Date(orderData.date_left)) {
      alert("Гарсан огноо орсноосоо эрт байна");
      setOrderData({ ...orderData, date_left: "" });
      return;
    }

    if (canSave) {
      try {
        await updateOrder(sendingData);
        navigate(`/dash/orders/${orderId}`);
      } catch (error) {
        console.error("Бүртгэлийг өөрчилж чадсангүй", error);
      }
    }
  };

  return (
    <div>
      <h2>Бүртгэлийн мэдээллийг өөрчлөх</h2>
      <form className="edit-order-form" onSubmit={onSubmit}>
        <div>
          <label htmlFor="date_entered">Орсон огноо:</label>
          <input
            type="date"
            name="date_entered"
            value={moment(new Date(orderData.date_entered)).format(
              "YYYY-MM-DD"
            )}
            onChange={handleDateChange}
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
        <div>
          <label htmlFor="date_left">Гарсан огноо:</label>
          <input
            type="date"
            name="date_left"
            value={moment(new Date(orderData.date_left)).format("YYYY-MM-DD")}
            onChange={handleDateChange}
          />
        </div>
        <div>
          <label htmlFor="tavtsan_usage">Тавцан ашиглалт:</label>
          <select
            name="tavtsan_usage"
            id="tavtsan_usage"
            onChange={onChange}
            value={orderData.tavtsan_usage}
          >
            <option value="0">Ашиглаагүй</option>
            <option value="gadna_tavtsan">Гадна тавцан</option>
            <option value="aguulah_tavtsan">Агуулахын тавцан</option>
          </select>
        </div>
        <div>
          <label htmlFor="puulelt">Пүүлэлт:</label>
          <select
            name="puulelt"
            id="puulelt"
            onChange={onChange}
            value={orderData.puulelt}
          >
            <option value={0}>Ашиглаагүй</option>
            <option value={1}>Суудлын машин</option>
            <option value={2}>Бусад</option>
          </select>
        </div>
        <div>
          <label htmlFor="forklift_usage">Сэрээт өргөгч:</label>
          <div className="hint">
            <p>neg, нэг - нэг удаагийн өргөлт</p>
            <p>1, 2, 3... - ашигласан цагийн тоо</p>
          </div>
          <input
            type="text"
            placeholder="neg, 1, 2, 3..."
            name="forklift_usage"
            value={orderData.forklift_usage}
            onChange={onChange}
          />
        </div>
        <div>
          <label htmlFor="crane_usage">Авто кран ашиглалт:</label>
          <select
            name="crane_usage"
            id="crane_usage"
            onChange={onChange}
            value={orderData.crane_usage}
          >
            <option value={0}>Ашиглаагүй</option>
            <option value={1}>Хоосон өргөлт</option>
            <option value={2}>Ачаатай өргөлт</option>
          </select>
        </div>
        <div>
          <label htmlFor="fine1">Торгууль 1:</label>
          <input
            type="checkbox"
            name="fine1"
            checked={orderData.fine1}
            onChange={() =>
              setOrderData({ ...orderData, fine1: !orderData.fine1 })
            }
          />
        </div>
        <div>
          <label htmlFor="fine2">Торгууль 2:</label>
          <input
            type="checkbox"
            name="fine2"
            checked={orderData.fine2}
            onChange={() =>
              setOrderData({ ...orderData, fine2: !orderData.fine2 })
            }
          />
        </div>
        <div>
          <label htmlFor="other1">Бусад 1:</label>
          <input
            type="checkbox"
            name="other1"
            checked={orderData.other1}
            onChange={() =>
              setOrderData({ ...orderData, other1: !orderData.other1 })
            }
          />
        </div>
        <div>
          <label htmlFor="other2">Бусад 2:</label>
          <input
            type="checkbox"
            name="other2"
            checked={orderData.other2}
            onChange={() =>
              setOrderData({ ...orderData, other2: !orderData.other2 })
            }
          />
        </div>
        <div>
          <label htmlFor="invoice_to_302">
            5131240302 дансанд шилжүүлсэн дүн:
          </label>
          <input
            type="number"
            name="invoice_to_302"
            value={orderData.invoice_to_302}
            onChange={onChange}
          />
        </div>
        <div>
          <label htmlFor="invoice_to_601">
            5212124601 дансанд шилжүүлсэн дүн:
          </label>
          <input
            type="number"
            name="invoice_to_601"
            value={orderData.invoice_to_601}
            onChange={onChange}
          />
        </div>
        <div>
          <label htmlFor="amount_w_noat">НӨАТ падаан бичсэн дүн:</label>
          <input
            type="number"
            name="amount_w_noat"
            value={orderData.amount_w_noat}
            onChange={onChange}
          />
        </div>
        <div>
          <label htmlFor="amount_wo_noat">НӨАТ падаан бичээгүй дүн:</label>
          <input
            type="number"
            name="amount_wo_noat"
            value={orderData.amount_wo_noat}
            onChange={onChange}
          />
        </div>
        <div>
          <label htmlFor="client_name">Байгууллага, хувь хүний нэр:</label>
          <input
            type="text"
            name="client_name"
            value={orderData.client_name}
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

export default EditOrderForm;
