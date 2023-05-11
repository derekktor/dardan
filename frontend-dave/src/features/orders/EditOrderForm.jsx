import { useNavigate, useParams } from "react-router-dom";
import { useUpdateOrderMutation, useGetOrdersQuery } from "./ordersApiSlice";
import { useState } from "react";
import useAuth from "../../hooks/useAuth";

const convertDate = (inputDate) => {
  const date = new Date(inputDate);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const EditOrderForm = () => {
  const {name} = useAuth();

  const navigate = useNavigate();
  const [updateOrder, { isLoading }] = useUpdateOrderMutation();

  const { orderId } = useParams();
  const { order } = useGetOrdersQuery("ordersList", {
    selectFromResult: ({ data }) => ({
      order: data?.entities[orderId],
    }),
  });

  const [orderData, setOrderData] = useState({ ...order });
  const [tavtsan, setTavtsan] = useState("");
  const [crane, setCrane] = useState(0);
  const [puulelt, setPuulelt] = useState(false);
  const [fine1, setFine1] = useState(false);
  const [fine2, setFine2] = useState(false);
  const [other1, setOther1] = useState(false);
  const [other2, setOther2] = useState(false);

  const onChange = (e) => {
    setOrderData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleTavtsanChange = (e) => {
    setTavtsan(e.target.value);
  };

  const handleCraneChange = (e) => {
    setCrane(e.target.value);
  };

  // const canSave =
  //   [orderData.client_name, orderData.load_name].some(Boolean) && !isLoading;

  const onSubmit = async (e) => {
    e.preventDefault();

    const sendingData = {
      ...orderData,
      tavtsan_ashiglalt: tavtsan,
      puulelt,
      crane_usage: crane,
      fine1,
      fine2,
      other1,
      other2,
      stage: 1,
      last_edited_by: name
    }

    console.log(sendingData);

    // if (canSave) {
      try {
        await updateOrder(sendingData);
        navigate(`/dash/orders/${orderId}`);
      } catch (error) {
        console.error("Бүртгэлийг өөрчилж чадсангүй", error);
      }
    // }
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
            value={convertDate(orderData.date_entered)}
            onChange={onChange}
          />
        </div>
        <div>
          <label htmlFor="truck_id_digits">Арлын дугаар(тоо):</label>
          <input
            type="text"
            placeholder="1234"
            name="truck_id_digits"
            value={orderData.truck_id.digits}
            onChange={onChange}
          />
        </div>
        <div>
          <label htmlFor="truck_id_letters">Арлын дугаар(үсэг):</label>
          <input
            type="text"
            placeholder="УБА"
            name="truck_id_letters"
            value={orderData.truck_id.letters}
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
            value={orderData.date_left}
            onChange={onChange}
          />
        </div>
        <div>
          <label htmlFor="tavtsan_ashiglalt">Тавцан ашиглалт:</label>
          <select
            name="tavtsan_ashiglalt"
            id="tavtsan_ashiglalt"
            onChange={handleTavtsanChange}
            value={tavtsan}
          >
            <option value="no">Ашиглаагүй</option>
            <option value="gadna_tavtsan">Гадна тавцан</option>
            <option value="aguulah_tavtsan">Агуулахын тавцан</option>
          </select>
        </div>
        <div>
          <label htmlFor="puulelt">Пүүлэлт:</label>
          <input
            type="checkbox"
            name="puulelt"
            checked={puulelt}
            onChange={() => setPuulelt(!puulelt)}
          />
        </div>
        <div>
          <label htmlFor="forklift_usage">Сэрээт өргөгч:</label>
          <div className="hint">
            <p>neg - нэг удаагийн өргөлт</p>
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
          <label htmlFor="crane">Авто кран ашиглалт:</label>
          <select
            name="crane"
            id="crane"
            onChange={handleCraneChange}
            value={crane}
          >
            <option value="no">Ашиглаагүй</option>
            <option value="hooson">Хоосон өргөлт</option>
            <option value="achaatai">Ачаатай өргөлт</option>
          </select>
        </div>
        <div>
          <label htmlFor="fine">Торгууль 1:</label>
          <input
            type="checkbox"
            name="fine1"
            checked={fine1}
            onChange={() => setFine1(!fine1)}
          />
        </div>
        <div>
          <label htmlFor="fine2">Торгууль 2:</label>
          <input
            type="checkbox"
            name="fine2"
            checked={fine2}
            onChange={() => setFine2(!fine2)}
          />
        </div>
        <div>
          <label htmlFor="other1">Бусад 1:</label>
          <input
            type="checkbox"
            name="other1"
            checked={other1}
            onChange={() => setOther1(!other1)}
          />
        </div>
        <div>
          <label htmlFor="other2">Бусад 2:</label>
          <input
            type="checkbox"
            name="other2"
            checked={other2}
            onChange={() => setOther2(!other2)}
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
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default EditOrderForm;
