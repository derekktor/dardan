import { useNavigate, useParams } from "react-router-dom";
import { useUpdateOrderMutation, useGetOrdersQuery } from "./ordersApiSlice";
import { useState } from "react";
import useAuth from "../../hooks/useAuth";
import moment from "moment";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { getTotalPrice, formatCurrency } from "./SingleOrder";

export const TRUCKNUM_REGEX = /^[0-9]{4,10}$/;
export const TRUCKLET_REGEX = /^([а-яА-ЯөӨүҮёЁ]{3})?$/;
export const FORKLIFT_REGEX = /^(neg|нэг|\d+)$/i;

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

  // console.log("editorder: from db - ", order)

  // // VARIABLES
  const [orderData, setOrderData] = useState({
    ...order,
    date_left: order?.date_left ? order?.date_left : new Date(),
    tavtsan_usage: order?.tavtsan_usage ? order?.tavtsan_usage : "0",
    puulelt: order?.puulelt ? order?.puulelt : 0,
    forklift_usage: order?.forklift_usage ? order?.forklift_usage : "0",
    crane_usage: order?.crane_usage ? order?.crane_usage : 0,
    fine1: order?.fine1 ? order?.fine1 : false,
    fine2: order?.fine2 ? order?.fine2 : false,
    other1: order?.other1 ? order?.other1 : false,
    other2: order?.other2 ? order?.other2 : false,
    transfer: order?.transfer ? order?.transfer : false,
    invoice_to_302: order?.invoice_to_302 ? order?.invoice_to_302 : 0,
    invoice_to_601: order?.invoice_to_601 ? order?.invoice_to_601 : 0,
    amount_w_noat: order?.amount_w_noat ? order?.amount_w_noat : 0,
    amount_wo_noat: order?.amount_wo_noat ? order?.amount_wo_noat : 0,
    client_name: order?.client_name ? order?.client_name : "",
    gaaliin_meduulgiin_dugaar: order?.gaaliin_meduulgiin_dugaar
      ? order?.gaaliin_meduulgiin_dugaar
      : "",
  });
  let content,
    title = "";

  const [truckNumValid, setTruckNumValid] = useState(false);
  const [truckLetValid, setTruckLetValid] = useState(false);
  const [forkliftValid, setForkliftValid] = useState(false);

  // verify inputs
  useEffect(() => {
    setTruckNumValid(TRUCKNUM_REGEX.test(orderData.truck_id_digits));
    setTruckLetValid(TRUCKLET_REGEX.test(orderData.truck_id_letters));
    setForkliftValid(FORKLIFT_REGEX.test(orderData.forklift_usage));
  }, [
    orderData.truck_id_digits,
    orderData.truck_id_letters,
    orderData.forklift_usage,
  ]);

  const canSave =
    [truckLetValid, truckNumValid, forkliftValid].every(Boolean) && !isLoading;

  // // FUNCTIONS
  const handleReallyLeft = async () => {
    toast.warning("Хашаанаас гарж байна...");

    let sendingData = {
      ...orderData,
      stage: 5,
      last_edited_by: name,
    };

    // console.log("editorder: sendingData - ", sendingData);

    if (
      moment(orderData.date_entered).startOf("day") >
      moment(orderData.date_left).startOf("day")
    ) {
      alert("Гарсан огноо орсноосоо эрт байна");
      setOrderData({ ...orderData, date_left: new Date() });
      return;
    }

    if (canSave) {
      try {
        await updateOrder(sendingData);
        navigate(`/dash/orders/${orderId}`);
      } catch (error) {
        console.error("Бүртгэлийг өөрчилж чадсангүй", error);
      }
    } else {
      if (!truckNumValid) {
        toast.error("Арлын дугаар зөвхөн тоо байх ёстой!");
      }
      if (!truckLetValid) {
        toast.error("Арлын дугаарын үсэг 3 кирилл үсэг байх ёстой!");
      }
      if (!forkliftValid) {
        toast.error("Сэрээт өргөгчийн утга алдаатай байна!");
      }
    }
  };

  const handleClearDateLeft = async (e) => {
    setOrderData({ ...orderData, date_left: null, stage: 0 });
  };

  const onChange = (e) => {
    setOrderData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleDateChange = (e) => {
    let date;
    if (e.target.value === "") {
      date = null;
    } else {
      date = moment(new Date(e.target.value)).format("YYYY-MM-DD");
    }
    setOrderData({ ...orderData, [e.target.name]: date });
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    let sendingData = {
      ...orderData,
      stage: 1,
      last_edited_by: name,
    };

    // when entering tech usage
    if (orderData.stage === 0) {

    }
    // when getting paid
    else if (orderData.stage === 1) {
      // console.log(orderData.invoice_to_302, orderData.invoice_to_601)
      sendingData = { ...orderData, stage: 4 };
    } 
    // when handling only puulelt
    else if (orderData.stage === 2) {
      sendingData = { ...orderData, stage: 2 };
    } 
    // when handling only others
    else if (orderData.stage === 3) {
      sendingData = { ...orderData, stage: 3 };
    }

    if (orderData.date_left === null) {
      sendingData = { ...sendingData, stage: 0 };
    }

    // console.log("editorder: sendingData - ", sendingData);

    if (
      moment(orderData.date_entered).startOf("day") >
      moment(orderData.date_left).startOf("day")
    ) {
      alert("Гарсан огноо орсноосоо эрт байна");
      setOrderData({ ...orderData, date_left: new Date() });
      return;
    }

    if (canSave) {
      try {
        await updateOrder(sendingData);
        navigate(`/dash/orders/${orderId}`);
      } catch (error) {
        console.error("Бүртгэлийг өөрчилж чадсангүй", error);
      }
    } else {
      if (!truckNumValid) {
        toast.error("Арлын дугаар зөвхөн тоо байх ёстой!");
      }
      if (!truckLetValid) {
        toast.error("Арлын дугаарын үсэг 3 кирилл үсэг байх ёстой!");
      }
      if (!forkliftValid) {
        toast.error("Сэрээт өргөгчийн утга алдаатай байна!");
      }
    }
  };

  // // COMPONENTS
  const paymentComp = (
    <div className="mt">
      <div className="flex-col">
        <h3>Тооцоо</h3>
        <p>{formatCurrency(getTotalPrice(orderData))}</p>
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
    </div>
  );

  let loadInfoComp = (
    <div className="mt">
      <h4>Ачааны мэдээлэл</h4>
      <div>
        <label htmlFor="date_entered">Орсон огноо:</label>
        <input
          type="date"
          name="date_entered"
          value={moment(new Date(orderData.date_entered)).format("YYYY-MM-DD")}
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
        <label htmlFor="description">Тайлбар:</label>
        <input
          type="text"
          name="description"
          value={orderData.description}
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
        <button className="button" onClick={handleClearDateLeft}>
          Арилгах
        </button>
      </div>
    </div>
  );

  let techUsageComp = (
    <div className="mt">
      <h4>Техник ашиглалт</h4>
      <div>
        <label htmlFor="tavtsan_usage">Тавцан ашиглалт:</label>
        <select
          name="tavtsan_usage"
          id="tavtsan_usage"
          onChange={onChange}
          value={orderData.tavtsan_usage}
          defaultValue={"0"}
        >
          <option value="0">Ашиглаагүй</option>
          <option value="gadna_tavtsan">Гадна тавцан (20'000₮)</option>
          <option value="aguulah_tavtsan">Агуулахын тавцан (40'000₮)</option>
        </select>
      </div>
      <div>
        <label htmlFor="puulelt">Пүүлэлт:</label>
        <select
          name="puulelt"
          id="puulelt"
          onChange={onChange}
          value={orderData.puulelt}
          defaultValue={0}
        >
          <option value={0}>Ашиглаагүй</option>
          <option value={1}>Суудлын машин</option>
          <option value={2}>Бусад</option>
        </select>
      </div>
      <div>
        <label htmlFor="forklift_usage">Сэрээт өргөгч:</label>
        <span className="hint">
          <p>neg, нэг - нэг удаагийн өргөлт</p>
          <p>1, 2, 3... - ашигласан цагийн тоо</p>
        </span>
        <input
          type="text"
          placeholder="neg, 1, 2, 3..."
          name="forklift_usage"
          value={orderData.forklift_usage}
          defaultValue={0}
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
          // defaultValue={0}
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
          defaultChecked={false}
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
        <label htmlFor="other1" title="Хүлээн авагч өөрийн авто кран оруулахад">
          Бусад 1:
        </label>
        <input
          type="checkbox"
          name="other1"
          checked={orderData.other1}
          onChange={() =>
            setOrderData({
              ...orderData,
              other1: !orderData.other1,
            })
          }
        />
      </div>
      <div>
        <label
          htmlFor="other2"
          title="Хүлээн авагч өөрийн ачааны ба бусад машин оруулахад"
        >
          Бусад 2:
        </label>
        <input
          type="checkbox"
          name="other2"
          checked={orderData.other2}
          onChange={() =>
            setOrderData({
              ...orderData,
              other2: !orderData.other2,
            })
          }
        />
      </div>
      <div>
        <label
          htmlFor="transfer"
          title="Шилжүүлэн ачилт"
        >
          Шилжүүлэн ачилт:
        </label>
        <input
          type="checkbox"
          name="transfer"
          checked={orderData.transfer}
          onChange={() =>
            setOrderData({
              ...orderData,
              transfer: !orderData.transfer,
            })
          }
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
      <div>
        <label htmlFor="gaaliin_meduulgiin_dugaar">
          Гаалийн мэдүүлгийн дугаар:
        </label>
        <input
          type="text"
          name="gaaliin_meduulgiin_dugaar"
          value={orderData.gaaliin_meduulgiin_dugaar}
          onChange={onChange}
        />
      </div>
    </div>
  );

  let onlyPuuleltComp = (
    <div className="mt">
      <h4>Техник ашиглалт</h4>
      <div>
        <label htmlFor="puulelt">Пүүлэлт:</label>
        <select
          name="puulelt"
          id="puulelt"
          onChange={onChange}
          value={orderData.puulelt}
          defaultValue={0}
        >
          <option value={0}>Ашиглаагүй</option>
          <option value={1}>Суудлын машин</option>
          <option value={2}>Бусад</option>
        </select>
      </div>
    </div>
  );

  let onlyOthersComp = (
    <div className="mt">
      <h4>Техник ашиглалт</h4>
      <div>
        <label htmlFor="others">Бусад:</label>
        <select
          name="others"
          id="others"
          onChange={onChange}
          value={orderData.others}
          defaultValue={0}
        >
          <option value={0}>Үгүй</option>
          <option value={1}>7.1 - кран</option>
          <option value={2}>7.2 - бусад</option>
        </select>
      </div>
    </div>
  );

  // // CONDITIONS
  // only puulelt
  if (orderData.stage === 2) {
    techUsageComp = onlyPuuleltComp;
  }

  // only others
  if (orderData.stage === 3) {
    techUsageComp = onlyOthersComp;
  }

  // entered
  if (orderData.stage === 0) {
    title = "Гарах мэдээлэл бүрдүүлэх";
    content = (
      <>
        {techUsageComp}
        {loadInfoComp}
      </>
    );
  } else {
    // left
    title = "Тооцоо хийх";
    content = (
      <>
        {paymentComp}
        {loadInfoComp}
        {techUsageComp}
      </>
    );
  }

  // console.log("editorder: ", order);

  return (
    <div>
      <h2>{title}</h2>
      <form className="edit-order-form" onSubmit={onSubmit}>
        {content}
        <div>
          <button className="button" type="submit">
            Хадгалах
          </button>
          <button className="button" onClick={handleReallyLeft}>
            Хашаанаас гарсан
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditOrderForm;
