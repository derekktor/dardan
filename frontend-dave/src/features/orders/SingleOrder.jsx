import { useDeleteOrderMutation, useGetOrdersQuery } from "./ordersApiSlice";
import { useParams, useNavigate } from "react-router-dom";
import { memo } from "react";
import useAuth from "../../hooks/useAuth";
import moment from "moment";

export const getForkliftData = (data) => {
  let forklift = {
    text: "",
    price: 0,
    type: "",
    info: {
      once: {
        text: "Нэг удаагийн",
        price: 20000,
      },
      hourly: {
        text: "Цагийн",
        price: 100000,
      },
    },
  };

  let forkliftHours = parseInt(data);

  if (!forkliftHours) {
    forklift.type = "once";
    switch (data) {
      case "neg":
        forklift.text = "Нэг удаагийн өргөлт";
        forklift.price = 20000;
        break;
      case "нэг":
        forklift.text = "Нэг удаагийн өргөлт";
        forklift.price = 20000;
        break;
      case "0":
        forklift.text = "-";
        forklift.price = 0;
        break;
      default:
        forklift.text = "-";
        forklift.price = 0;
    }
  } else {
    forklift.type = "hourly";
    forklift.text = `${forkliftHours} цаг`;
    forklift.price = 100000 * forkliftHours;
  }

  return forklift;
};

export const getCraneData = (craneData) => {
  let crane = { text: "", price: 0 };

  switch (craneData) {
    case 0:
      crane.text = "Үгүй";
      crane.price = 0;
      break;
    case 1:
      crane.text = "Хоосон өргөлт";
      crane.price = 100000;
      break;
    case 2:
      crane.text = "Ачаатай өргөлт";
      crane.price = 250000;
      break;
    default:
      crane.text = "-";
      crane.price = 0;
  }

  return crane;
};

export const getTavtsan = (tavtsanData) => {
  let tavtsan = { text: "", price: 0 };

  switch (tavtsanData) {
    case "gadna_tavtsan":
      tavtsan.text = "Гадна тавцан";
      tavtsan.price = 20000;
      break;
    case "aguulah_tavtsan":
      tavtsan.text = "Агуулахын тавцан";
      tavtsan.price = 40000;
      break;
    case "0":
      tavtsan.text = "Ашиглаагүй";
      tavtsan.price = 0;
      break;
  }

  return tavtsan;
};

export const getPuulelt = (puuleltData) => {
  let puulelt = { text: "", price: 0 };

  switch (puuleltData) {
    case 0:
      puulelt.text = "-";
      puulelt.price = 0;
      break;
    case 1:
      puulelt.text = "Суудлын машин";
      puulelt.price = 10000;
      break;
    case 2:
      puulelt.text = "Бусад";
      puulelt.price = 20000;
      break;
    default:
      puulelt.text = "Ойлгомжгүй";
      puulelt.price = 0;
      break;
  }

  return puulelt;
};

export const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  });
};

export const formatCurrency = (amount) => {
  if (!amount) {
    amount = 0;
  }
  return `${amount.toLocaleString("de-CH")}₮`;
};

export const extra_infos = {
  puulelt: {
    sedan: {
      price: 10000,
    },
    others: {
      price: 20000,
    },
  },
  fine: {
    one: {
      text: "6.1 гаалийн үзлэг хийгдсэний дараа талбай чөлөөлөөгүй ТХ",
      price: 50000,
    },
    two: {
      text: "6.2 Агуулахаар үзлэгт хамрагдсаны дараа хаалга чөлөөлөөгүй",
      price: 25000,
    },
  },
  other: {
    one: {
      text: "7.1 Хүлээн авагч өөрийн  авто кран ГХБ рүү оруулахад",
      price: 20000,
    },
    two: {
      text: "7.2 Хүлээн авагч өөрийн  ачааны ба бусад машин ГХБ рүү оруулахад",
      price: 10000,
    },
  },
  days: {
    one: {
      text: "Эхний хоног",
      price: 25000,
    },
    two: {
      text: "2 дахь хоног",
      price: 20000,
    },
    three: {
      text: "3 дахь хоног",
      price: 15000,
    },
    four: {
      text: "4+ хоног",
      price: 10000,
    },
  },
};

export const getNumDays = (order) => {
  const d1 = moment(order.date_entered).startOf("day");
  const d2 = moment(order.date_left).startOf("day");

  return d2.diff(d1, "days")
};

export const calculateParkingPrice = (numDays) => {
  let priceParking;
  if (numDays >= 1 || numDays === 0) {
    priceParking = 25000;
  }

  if (numDays >= 2) {
    priceParking += 20000;
  }

  if (numDays >= 3) {
    priceParking += 15000;
  }

  if (numDays >= 4) {
    priceParking += 10000 * (numDays - 3);
  }
  return priceParking;
};

const getContentForDaysStayed = (numDays) => {
  let contentDays = [];
  if (numDays >= 1 || numDays === 0) {
    contentDays.push(
      `${extra_infos.days.one.text} ${extra_infos.days.one.price.toLocaleString(
        "de-CH"
      )}₮`
    );
  }

  if (numDays >= 2) {
    contentDays.push(
      `${extra_infos.days.two.text} ${extra_infos.days.two.price.toLocaleString(
        "de-CH"
      )}₮`
    );
  }

  if (numDays >= 3) {
    contentDays.push(
      `\n${
        extra_infos.days.three.text
      } ${extra_infos.days.three.price.toLocaleString("de-CH")}₮`
    );
  }

  if (numDays >= 4) {
    contentDays.push(
      `\n${
        extra_infos.days.four.text
      } ${extra_infos.days.four.price.toLocaleString("de-CH")}₮`
    );
  }

  return contentDays;
};

export const getTotalPrice = (order) => {
  const numDays = getNumDays(order);
  const parkingPrice = calculateParkingPrice(numDays);

  const { price: tavtsanPrice } = getTavtsan(order?.tavtsan_usage);
  const { price: forkliftPrice } = getForkliftData(order?.forklift_usage);
  const { price: cranePrice } = getCraneData(order?.crane_usage);
  const { price: puuleltPrice } = getPuulelt(order?.puulelt);

  let finePrice = 0;
  if (order?.fine1) {
    finePrice += extra_infos.fine.one.price;
  }
  if (order?.fine2) {
    finePrice += extra_infos.fine.two.price;
  }

  let otherPrice = 0;
  if (order?.other1) {
    otherPrice += extra_infos.other.one.price;
  }
  if (order?.other2) {
    otherPrice += extra_infos.other.two.price;
  }

  return (
    parkingPrice +
    tavtsanPrice +
    forkliftPrice +
    cranePrice +
    puuleltPrice +
    finePrice +
    otherPrice
  );
};

const SingleOrder = () => {
  const { isAdmin } = useAuth();

  const [deleteOrder] = useDeleteOrderMutation();
  const navigate = useNavigate();

  const { orderId } = useParams();
  const { order } = useGetOrdersQuery("ordersList", {
    selectFromResult: ({ data }) => ({
      order: data?.entities[orderId],
    }),
  });

  const tavtsan = getTavtsan(order?.tavtsan_usage);
  const forklift = getForkliftData(order?.forklift_usage);
  const crane = getCraneData(order?.crane_usage);
  const puulelt = getPuulelt(order?.puulelt);

  const numDays = getNumDays(order);
  const contentForDays = getContentForDaysStayed(numDays);
  const parkingPrice = calculateParkingPrice(numDays);

  const handleDelete = async (orderId) => {
    try {
      await deleteOrder(orderId).unwrap();
      navigate("/dash/orders");
    } catch (error) {
      console.error("Бүртгэлийг устгаж чадсангүй", error);
    }
  };

  const handleEdit = (orderId) => {
    navigate(`/dash/orders/edit/${orderId}`);
  };

  const handlePrint = () => {
    navigate(`/dash/orders/print/${orderId}`);
  };

  let orderContent;
  if (order?.stage === 0) {
    orderContent = (
      <>
        <div>
          <h4>Орсон огноо</h4>
          <p>{formatDate(order?.date_entered)}</p>
        </div>
        <div>
          <h4>Арлын дугаар</h4>
          <p>
            {order?.truck_id_digits} {order?.truck_id_letters}
          </p>
        </div>
        <div>
          <h4>Ачаа, барааны нэр</h4>
          <p>{order?.load_name}</p>
        </div>
        <div>
          <h4>Ачааны жин</h4>
          <p>{order?.load_weight} тн</p>
        </div>
      </>
    );
  } else if (order?.stage === 1) {
    orderContent = (
      <>
        <div className="informational">
          <div>
            <h4>Орсон огноо</h4>
            <p>{formatDate(order?.date_entered)}</p>
          </div>
          <div>
            <h4>Гарсан огноо</h4>
            <p>{formatDate(order?.date_left)}</p>
          </div>
          <div>
            <h4>Арлын дугаар</h4>
            <p>
              {order?.truck_id_digits} {order?.truck_id_letters}
            </p>
          </div>
          <div>
            <h4>Ачаа, барааны нэр</h4>
            <p>{order?.load_name}</p>
          </div>
          <div>
            <h4>Ачааны жин</h4>
            <p>{order?.load_weight} тн</p>
          </div>
          <div>
            <h4>Тавцан ашиглалт</h4>
            <p>{tavtsan.text ? tavtsan.text : "Ашиглаагүй"}</p>
          </div>
          <div>
            <h4>Пүүлэлт</h4>
            <p>{puulelt.text ? puulelt.text : "Ашиглаагүй"}</p>
          </div>
          <div>
            <h4>Сэрээт өргөгч</h4>
            <p>{forklift.text}</p>
          </div>
          <div>
            <h4>Авто кран ашиглалт</h4>
            <p>{crane.text !== "" ? crane.text : "Оруулаагүй"}</p>
          </div>
          <div>
            <h4>Торгууль</h4>
            <p>
              {order?.fine1 ? extra_infos.fine.one.text : "Үгүй"}
              <br />
              {order?.fine2 ? extra_infos.fine.two.text : "Үгүй"}
            </p>
          </div>
          <div>
            <h4>Бусад</h4>
            <p>
              {order?.other1 ? extra_infos.other.one.text : "Үгүй"}
              <br />
              {order?.other2 ? extra_infos.other.two.text : "Үгүй"}
            </p>
          </div>
          <div>
            <h4>5131240302 дансанд шилжүүлсэн дүн</h4>
            <p>
              {order?.invoice_to_302
                ? formatCurrency(order.invoice_to_302)
                : "Оруулаагүй"}
            </p>
          </div>
          <div>
            <h4>5212124601 дансанд шилжүүлсэн дүн</h4>
            <p>
              {order?.invoice_to_601
                ? formatCurrency(order.invoice_to_601)
                : "Оруулаагүй"}
            </p>
          </div>
          <div>
            <h4>НӨАТ падаан бичсэн дүн</h4>
            <p>
              {order?.amount_w_noat
                ? formatCurrency(order.amount_w_noat)
                : "Оруулаагүй"}
            </p>
          </div>
          <div>
            <h4>НӨАТ падаан бичээгүй дүн</h4>
            <p>
              {order?.amount_wo_noat
                ? formatCurrency(order.amount_wo_noat)
                : "Оруулаагүй"}
            </p>
          </div>
          <div>
            <h4>Байгууллага, хувь хүний нэр</h4>
            <p>{order?.client_name ? order?.client_name : "Оруулаагүй"}</p>
          </div>
          <div>
            <h4>Гаалийн мэдүүлгийн дугаар</h4>
            <p>{order?.gaaliin_meduulgiin_dugaar ? order?.gaaliin_meduulgiin_dugaar : "Оруулаагүй"}</p>
          </div>
        </div>
        <div className="numbers">
          <div>
            <h4>Талбайд хоносон хоног</h4>
            <p>{numDays === 0 ? 1 : numDays}</p>
          </div>
          <div>
            <h4>Талбайн хадгалалт /ачаатай ачаагүй машин, чингэлэг/</h4>
            <div className="flex-row align-center space-between">
              <div>
                {contentForDays.map((d, idx) => (
                  <p key={idx}>{d}</p>
                ))}
              </div>
              <div>
                <p>
                  {parkingPrice ? formatCurrency(parkingPrice) : "Оруулаагүй"}
                </p>
              </div>
            </div>
          </div>
          {tavtsan.text ? (
            <div>
              <h4>Тавцан ашиглалт</h4>
              <div className="flex-row space-between">
                <p>{tavtsan.text}</p>
                <p>
                  {tavtsan.price ? formatCurrency(tavtsan.price) : "Оруулаагүй"}
                </p>
              </div>
            </div>
          ) : (
            ""
          )}
          <div>
            <h4>Автомашин пүүлэлт</h4>
            <div className="flex-row space-between">
              <p>{puulelt.text}</p>
              <p>{formatCurrency(puulelt.price)}</p>
            </div>
          </div>
          <div>
            <h4>Техник ашиглалтын тариф</h4>
            <div>
              <div className="flex-row align-center space-between">
                <h5>Сэрээт өргөгч</h5>
                {forklift.text === "Ойлгомжгүй" ? (
                  <div>
                    <p>{forklift.text}</p>
                  </div>
                ) : (
                  <div>
                    <p>{forklift.text}</p>
                    <p className="float-right">
                      <p>{formatCurrency(forklift.price)}</p>
                    </p>
                  </div>
                )}
              </div>
              <div className="flex-row align-center space-between">
                <h5>Авто кран</h5>
                <div>
                  <p>{crane.text}</p>
                  <div className="float-right">
                    <p>
                      {crane.price ? formatCurrency(crane.price) : "Оруулаагүй"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div>
            <h4>Торгууль</h4>
            {order?.fine1 ? (
              <div className="flex-row align-center space-between">
                <p>{extra_infos.fine.one.text}</p>
                <p>{formatCurrency(extra_infos.fine.one.price)}</p>
              </div>
            ) : (
              <div className="flex-row align-center space-between">
                <p>{extra_infos.fine.one.text}</p>
                <p>Байхгүй</p>
              </div>
            )}
            {order?.fine2 ? (
              <div className="flex-row align-center space-between">
                <p>{extra_infos.fine.two.text}</p>
                <p>{formatCurrency(extra_infos.fine.two.price)}</p>
              </div>
            ) : (
              <div className="flex-row align-center space-between">
                <p>{extra_infos.fine.two.text}</p>
                <p>Байхгүй</p>
              </div>
            )}
          </div>
          <div>
            <h4>Бусад</h4>
            {order?.other1 ? (
              <div className="flex-row align-center space-between">
                <p>{extra_infos.other.one.text}</p>
                <p>{formatCurrency(extra_infos.other.two.price)}</p>

              </div>
            ) : (
              <div className="flex-row align-center space-between">
                <p>{extra_infos.other.one.text}</p>
                <p>Байхгүй</p>
              </div>
            )}
            {order?.other2 ? (
              <div className="flex-row align-center space-between">
                <p>{extra_infos.other.two.text}</p>
                <p>{formatCurrency(extra_infos.other.two.price)}</p>
              </div>
            ) : (
              <div className="flex-row align-center space-between">
                <p>{extra_infos.other.two.text}</p>
                <p>Байхгүй</p>
              </div>
            )}
          </div>
          <div>
            <h3>Нийт дүн</h3>
            <p>
              {getTotalPrice(order)
                ? formatCurrency(getTotalPrice(order))
                : "Оруулаагүй"}
            </p>
          </div>
        </div>
      </>
    );
  }


  return (
    <div>
      <div className="order-info-container">{orderContent}</div>
      <div className="buttons">
        <button onClick={() => handleEdit(orderId)}>Өөрчлөх</button>
        <button onClick={() => handlePrint(orderId)}>Хэвлэх</button>
        {isAdmin && (
          <button onClick={() => handleDelete(orderId)}>Устгах</button>
        )}
      </div>
    </div>
  );
};

const memoizedOrder = memo(SingleOrder);
export default memoizedOrder;
