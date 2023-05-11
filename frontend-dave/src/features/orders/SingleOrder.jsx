import { useDeleteOrderMutation, useGetOrdersQuery } from "./ordersApiSlice";
import { useParams, Link, useNavigate } from "react-router-dom";
import { memo } from "react";
import useAuth from "../../hooks/useAuth";

const getForkliftData = (data) => {
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
      default:
        forklift.text = "Ойлгомжгүй";
        forklift.price = 0;
    }
  } else {
    forklift.type = "hourly";
    forklift.text = `${forkliftHours} цаг ашигласан`;
    forklift.price = 100000 * forkliftHours;
  }

  return forklift;
};

const getCraneData = (craneData) => {
  let crane = { text: "", price: 0 };

  switch (craneData) {
    case 0:
      crane.text = "Ашиглаагүй";
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
  }

  return crane;
};

const getTavtsan = (tavtsanData) => {
  let tavtsan = { text: "", price: 0 };

  switch (tavtsanData) {
    case "gadna_tavtsan":
      tavtsan.text = "Гадна тавцан";
      tavtsan.price = 20000;
      break;
    case "aguulah_tavtsan":
      tavtsan.text = "Гадна тавцан";
      tavtsan.price = 40000;
      break;
    case "no":
      tavtsan.text = "Ашиглаагүй";
      tavtsan.price = 0;
      break;
  }

  return tavtsan;
};

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  });
};

const extra_infos = {
  puulelt: {
    price: 10000,
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

const getNumDays = (dateStr1, dateStr2) => {
  const d1 = new Date(dateStr1);
  const d2 = new Date(dateStr2);

  const diffInTime = d2.getTime() - d1.getTime();
  const diffInDays = diffInTime / (24 * 3600 * 1000);

  return diffInDays;
};

const calculateParkingPrice = (numDays) => {
  let priceParking;
  if (numDays >= 1) {
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
  if (numDays >= 1) {
    contentDays.push(
      `${extra_infos.days.one.text} ${extra_infos.days.one.price}₮`
    );
  }

  if (numDays >= 2) {
    contentDays.push(
      `${extra_infos.days.two.text} ${extra_infos.days.two.price}₮`
    );
  }

  if (numDays >= 3) {
    contentDays.push(
      `\n${extra_infos.days.three.text} ${extra_infos.days.three.price}₮`
    );
  }

  if (numDays >= 4) {
    contentDays.push(
      `\n${extra_infos.days.four.text} ${extra_infos.days.four.price}₮`
    );
  }

  return contentDays;
};

const getTotalPrice = (order) => {
  const numDays = getNumDays(order?.date_entered, order?.date_left);
  const parkingPrice = calculateParkingPrice(numDays);

  const { price: tavtsanPrice } = getTavtsan(order?.tavtsan_ashiglalt);
  const { price: forkliftPrice } = getForkliftData(order?.forklift_usage);
  const { price: cranePrice } = getCraneData(order?.crane_usage);
  const puuleltPrice = order?.puulelt ? extra_infos.puulelt.price : 0;

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

  const tavtsan = getTavtsan(order?.tavtsan_ashiglalt);
  const forklift = getForkliftData(order?.forklift_usage);
  const crane = getCraneData(order?.crane_usage);

  const numDays = getNumDays(order?.date_entered, order?.date_left);
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
            {order?.truck_id.digits} {order?.truck_id.letters}
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
              {order?.truck_id.digits} {order?.truck_id.letters}
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
            <h4>Байгууллага, хувь хүний нэр</h4>
            <p>{order?.client_name}</p>
          </div>
          <div>
            <h4>Тавцан ашиглалт</h4>
            <p>{tavtsan.text ? tavtsan.text : "Ашиглаагүй"}</p>
          </div>
          <div>
            <h4>Пүүлэлт</h4>
            <p>{order?.puulelt ? "Тийм" : "Үгүй"}</p>
          </div>
          <div>
            <h4>Сэрээт өргөгч</h4>
            <p>{forklift.text}</p>
          </div>
          <div>
            <h4>Авто кран ашиглалт</h4>
            <p>{crane.text}</p>
          </div>
          <div>
            <h4>Торгууль</h4>
            <p>
              {order?.fine1 ? extra_infos.fine1 : "Үгүй"}
              <br />
              {order?.fine2 ? extra_infos.fine2 : "Үгүй"}
            </p>
          </div>
          <div>
            <h4>Бусад</h4>
            <p>
              {order?.other1 ? extra_infos.other1 : "Үгүй"}
              <br />
              {order?.other2 ? extra_infos.other2 : "Үгүй"}
            </p>
          </div>
          <div>
            <h4>5131240302 дансанд шилжүүлсэн дүн</h4>
            <p>{order?.invoice_to_302.toLocaleString("de-CH")} ₮</p>
          </div>
          <div>
            <h4>5212124601 дансанд шилжүүлсэн дүн</h4>
            <p>{order?.invoice_to_601.toLocaleString("de-CH")} ₮</p>
          </div>
          <div>
            <h4>НӨАТ падаан бичсэн дүн</h4>
            <p>{order?.amount_w_noat.toLocaleString("de-CH")} ₮</p>
          </div>
          <div>
            <h4>НӨАТ падаан бичээгүй дүн</h4>
            <p>{order?.amount_wo_noat.toLocaleString("de-CH")} ₮</p>
          </div>
        </div>
        <div className="numbers">
          <div>
            <h4>Талбайд хоносон хоног</h4>
            <p>{numDays}</p>
          </div>
          <div>
            <h4>Талбайн хадгалалт /ачаатай ачаагүй машин, чингэлэг/</h4>
            <div className="flex-row align-center space-between">
              <div>
                {contentForDays.map((d) => (
                  <p>{d}</p>
                ))}
              </div>
              <div>
                <p>{parkingPrice}₮</p>
              </div>
            </div>
          </div>
          {tavtsan.text ? (
            <div>
              <h4>Тавцан ашиглалт</h4>
              <div className="flex-row space-between">
                <p>{tavtsan.text}</p>
                <p>{tavtsan.price}₮</p>
              </div>
            </div>
          ) : (
            ""
          )}
          {order?.puulelt && (
            <div>
              <h4>Автомашин пүүлэлт</h4>
              <div className="flex-row space-between">
                <p>Пүүлэлт</p>
                <p>{extra_infos.puulelt.price}₮</p>
              </div>
            </div>
          )}
          <div>
            <h4>Техник ашиглалтын тариф</h4>
            <div>
              <div className="flex-row align-center space-between">
                <h5>Сэрээт өргөгч</h5>
                <div>
                  <p>{forklift.text}</p>
                  <p className="float-right">{forklift.price}₮</p>
                </div>
              </div>
              <div className="flex-row align-center space-between">
                <h5>Авто кран</h5>
                <div>
                  <p>{crane.text}</p>
                  <p className="float-right">{crane.price}₮</p>
                </div>
              </div>
            </div>
          </div>
          <div>
            <h4>Торгууль</h4>
            {order?.fine1 && (
              <div className="flex-row align-center space-between">
                <p>{extra_infos.fine.one.text}</p>
                <p>{extra_infos.fine.one.price}₮</p>
              </div>
            )}
            {order?.fine2 && (
              <div className="flex-row align-center space-between">
                <p>{extra_infos.fine.two.text}</p>
                <p>{extra_infos.fine.two.price}₮</p>
              </div>
            )}
          </div>
          <div>
            <h4>Бусад</h4>
            {order?.other1 && (
              <div className="flex-row align-center space-between">
                <p>{extra_infos.other.one.text}</p>
                <p>{extra_infos.other.one.price}₮</p>
              </div>
            )}
            {order?.other2 && (
              <div className="flex-row align-center space-between">
                <p>{extra_infos.other.two.text}</p>
                <p>{extra_infos.other.two.price}₮</p>
              </div>
            )}
          </div>
          <div>
            <h3>Нийт дүн</h3>
            <p>{getTotalPrice(order)}₮</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <div>
      <div className="order-info-container">{orderContent}</div>
      <p>Created by: {order?.created_by_name}</p>
      <p>Created at: {formatDate(order?.createdAt)}</p>
      <p>Updated at: {formatDate(order?.updatedAt)}</p>
      <div className="buttons">
        <Link to={`/dash/orders/edit/${orderId}`}>Edit</Link>
        {isAdmin && (
          <button onClick={() => handleDelete(orderId)}>Delete</button>
        )}
      </div>
    </div>
  );
};

const memoizedOrder = memo(SingleOrder);
export default memoizedOrder;
