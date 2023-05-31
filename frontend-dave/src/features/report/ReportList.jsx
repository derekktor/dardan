import { useGetOrdersQuery } from "../orders/ordersApiSlice";
import ReportExcerpt from "./ReportExcerpt";
import { formatCurrency, getTotalPrice } from "../orders/SingleOrder";
import moment from "moment";
import { useState, useEffect } from "react";

const ReportList = ({ date, type }) => {
  const [sticky, setSticky] = useState(false);
  const { data: orders } = useGetOrdersQuery();

  useEffect(() => {
    console.log(`reportslist: ${type} - ${date}`);
  }, [type]);

  // // VARIABLES
  const [classForStayed, setClassForStayed] = useState(true);
  const [classForEntered, setClassForEntered] = useState();
  const [classForLeft, setClassForLeft] = useState();
  const [classForCurrent, setClassForCurrent] = useState();

  let orderIdsEntered;
  let orderIdsEh;
  let orderIdsEts;
  let orderIdsLeft;

  let renderedOrders;
  let [orderIdsVar, setOrderIdsVar] = useState([]);
  let stats = {
    totalRevenue: 0,
    totalRevenuePrev: 0,
    totalWeight: 0,
    totalAmt302: 0,
    totalAmt601: 0,
    totalAmtWNoat: 0,
    totalAmtWoNoat: 0,
    tavtsan: {
      gadna: 0,
      aguulah: 0,
    },
    puulelt: {
      suudliin: 0,
      busad: 0,
    },
    forklift: {
      neg: 0,
      hours: 0,
    },
    crane: {
      hooson: 0,
      achaatai: 0,
    },
  };

  if (orders) {
    // orson
    orderIdsEntered = orders.ids.filter((id) => {
      const orderDB = orders.entities[id];

      const dateEntered = moment(orderDB.date_entered).startOf("day");
      const today = date.startOf("day");
      let isSame;

      // when day
      if (type === "d") {
        isSame = dateEntered.isSame(today);

        if (isSame) {
          return true;
        }
      }
      // when month
      else if (type === "m") {
        isSame = dateEntered.month() === today.month();

        if (isSame) {
          return true;
        }
      }
      // when year
      else if (type === "y") {
        isSame = dateEntered.year() === today.year();

        if (isSame) {
          return true;
        }
      }
    });

    // garsan
    orderIdsLeft = orders.ids.filter((id) => {
      const orderDB = orders.entities[id];

      let dateLeft, isSame;
      const today = date.startOf("day");

      if (orderDB.date_left) {
        dateLeft = moment(orderDB.date_left).startOf("day");

        if (type === "d") {
          isSame = dateLeft.isSame(today);

          if (isSame) {
            return true;
          }
        } else if (type === "m") {
          isSame = dateLeft.month() === today.month();

          if (isSame) {
            return true;
          }
        } else if (type === "y") {
          isSame = dateLeft.year() === today.year();

          if (isSame) {
            return true;
          }
        }
      }
    });

    // ehnii uldegdel
    orderIdsEh = orders.ids.filter((id) => {
      const orderDB = orders.entities[id];

      const dateEntered = moment(orderDB.date_entered).startOf("day");
      let dateLeft;
      const today = date.startOf("day");
      let enteredBefore, leftLater;

      // when date
      if (type === "d") {
        enteredBefore = dateEntered.isBefore(today);

        // already left
        if (orderDB.date_left) {
          dateLeft = moment(orderDB.date_left).startOf("day");
          leftLater = dateLeft.isSameOrAfter(today);

          if (enteredBefore) {
            if (leftLater) {
              return true;
            }
          }
        }
        // didn't leave
        else {
          if (enteredBefore) {
            return true;
          }
        }
      }
      // when month
      else if (type === "m") {
        enteredBefore = dateEntered.month() < today.month();

        // already left
        if (orderDB.date_left) {
          dateLeft = moment(orderDB.date_left).startOf("day");
          leftLater = dateLeft.month() >= today.month();

          if (enteredBefore) {
            if (leftLater) {
              return true;
            }
          }
        }
        // didn't leave
        else {
          if (enteredBefore) {
            return true;
          }
        }
      }
      // when year
      else if (type === "y") {
        enteredBefore = dateEntered.year() < today.year();

        // already left
        if (orderDB.date_left) {
          dateLeft = moment(orderDB.date_left).startOf("day");
          leftLater = dateLeft.year() >= today.year();

          if (enteredBefore) {
            if (leftLater) {
              return true;
            }
          }
        }
        // didn't leave
        else {
          if (enteredBefore) {
            return true;
          }
        }
      }
    });

    // etssiin uldegdel
    orderIdsEts = orders.ids.filter((id) => {
      const orderDB = orders.entities[id];

      const dateEntered = moment(orderDB.date_entered).startOf("day");
      let dateLeft;
      const today = date.startOf("day");
      let leftAfter, enteredBefore;

      if (type === "d") {
        enteredBefore = dateEntered.isSameOrBefore(today);

        if (enteredBefore) {
          if (orderDB.date_left) {
            dateLeft = moment(orderDB.date_left).startOf("day");
            leftAfter = dateLeft.isAfter(today);

            if (leftAfter) {
              return true;
            }
          } else {
            return true;
          }
        }
      } else if (type === "m") {
        enteredBefore = dateEntered.month() <= today.month();

        if (enteredBefore) {
          if (orderDB.date_left) {
            dateLeft = moment(orderDB.date_left).startOf("day");
            leftAfter = dateLeft.month() > today.month();

            if (leftAfter) {
              return true;
            }
          } else {
            return true;
          }
        }
      } else if (type === "y") {
        enteredBefore = dateEntered.year() <= today.year();

        if (enteredBefore) {
          if (orderDB.date_left) {
            dateLeft = moment(orderDB.date_left).startOf("day");
            leftAfter = dateLeft.year() > today.year();

            if (leftAfter) {
              return true;
            }
          } else {
            return true;
          }
        }
      }
    });
  }

  // calculate stats for orders entered
  orderIdsEntered.forEach((id) => {
    const thisOrder = orders.entities[id];

    if (thisOrder.tavtsan_usage === "aguulah_tavtsan") {
      stats.tavtsan.aguulah += 1;
    } else if (thisOrder.tavtsan_usage === "gadna_tavtsan") {
      stats.tavtsan.gadna += 1;
    }

    if (thisOrder.puulelt === 1) {
      stats.puulelt.suudliin += 1;
    } else if (thisOrder.puulelt === 2) {
      stats.puulelt.busad += 1;
    }

    if (
      thisOrder.forklift_usage === "neg" ||
      thisOrder.forklift_usage === "нэг"
    ) {
      stats.forklift.neg += 1;
    } else if (parseInt(thisOrder.forklift_usage)) {
      stats.forklift.hours += parseInt(thisOrder.forklift_usage);
    }

    if (thisOrder.crane_usage === 1) {
      stats.crane.hooson += 1;
    } else if (thisOrder.crane_usage === 2) {
      stats.crane.achaatai += 1;
    }

    stats.totalWeight += thisOrder.load_weight;
  });

  // calculate stats for orders left
  orderIdsLeft.forEach((id) => {
    const thisOrder = orders.entities[id];

    console.log("orders left: ", thisOrder.truck_id_digits, getTotalPrice(thisOrder), stats.totalRevenue)

    if (!thisOrder.invoice_to_302) {
      stats.totalAmt302 += 0;
    } else {
      stats.totalAmt302 += thisOrder.invoice_to_302;
    }

    if (!thisOrder.invoice_to_601) {
      stats.totalAmt302 += 0;
    } else {
      stats.totalAmt601 += thisOrder.invoice_to_601;
    }

    stats.totalRevenue += getTotalPrice(thisOrder)

    if (!thisOrder.amount_w_noat) {
      stats.totalAmt302 += 0;
    } else {
      stats.totalAmtWNoat += thisOrder.amount_w_noat;
    }

    if (!thisOrder.amount_wo_noat) {
      stats.totalAmt302 += 0;
    } else {
      stats.totalAmtWoNoat += thisOrder.amount_wo_noat;
    }
  });

  // calculate remainder from the d/m/y before
  orderIdsEh.forEach((id) => {
    const thisOrder = orders.entities[id];

    if (thisOrder.invoice_to_302) {
      stats.totalRevenuePrev += thisOrder.invoice_to_302;
    }

    if (thisOrder.invoice_to_601) {
      stats.totalRevenuePrev += thisOrder.invoice_to_601;
    }
  });

  useEffect(() => {
    setOrderIdsVar(orderIdsEh);
  }, []);

  useEffect(() => {
    if (classForStayed) {
      setOrderIdsVar(orderIdsEh);
    } else if (classForEntered) {
      setOrderIdsVar(orderIdsEntered);
    } else if (classForLeft) {
      setOrderIdsVar(orderIdsLeft);
    } else if (classForCurrent) {
      setOrderIdsVar(orderIdsEts);
    }
  }, [classForStayed, classForEntered, classForLeft, classForCurrent]);

  // // FUNCTIONS
  const logOrderInfo = (ids) => {
    ids.forEach((id) => {
      const orderDB = orders.entities[id];

      const dateEntered = moment(orderDB.date_entered).startOf("day");
      let dateLeft;
      const today = date.startOf("day");

      if (orderDB.date_left) {
        dateLeft = moment(orderDB.date_left).startOf("day");

        console.log(
          `${orderDB.truck_id_digits} - ${dateEntered.format(
            "YYYY-MM-DD"
          )} - ${dateLeft.format("YYYY-MM-DD")} - ${today.format(
            "YYYY-MM-DD"
          )} - ${orderDB.stage}`
        );
      } else {
        console.log(
          `${orderDB.truck_id_digits} - ${dateEntered.format(
            "YYYY-MM-DD"
          )} - not leave - ${today.format("YYYY-MM-DD")} - ${orderDB.stage}`
        );
      }
    });
  };

  const handleFilterStayed = () => {
    setClassForStayed(true);
    setClassForLeft(false);
    setClassForEntered(false);
    setClassForCurrent(false);

    logOrderInfo(orderIdsEh);
    setOrderIdsVar(orderIdsEh);
  };

  const handleFilterEntered = () => {
    setClassForStayed(false);
    setClassForLeft(false);
    setClassForEntered(true);
    setClassForCurrent(false);

    logOrderInfo(orderIdsEntered);
    setOrderIdsVar(orderIdsEntered);
  };

  const handleFilterLeft = () => {
    setClassForStayed(false);
    setClassForLeft(true);
    setClassForEntered(false);
    setClassForCurrent(false);

    logOrderInfo(orderIdsLeft);
    setOrderIdsVar(orderIdsLeft);
  };

  const handleFilterCurrent = () => {
    setClassForStayed(false);
    setClassForLeft(false);
    setClassForEntered(false);
    setClassForCurrent(true);

    logOrderInfo(orderIdsEts);
    setOrderIdsVar(orderIdsEts);
  };

  // // COMPONENTS
  const statsContent = (
    <div className="stats-grid not-selectable">
      <div
        className={classForStayed ? "pointer" : "pointer inactive"}
        onDoubleClick={handleFilterStayed}
      >
        <h4>Эхний үлдэгдэл:</h4>
        <h4>{orderIdsEh.length}</h4>
      </div>
      <div
        className={classForEntered ? "pointer" : "pointer inactive"}
        onDoubleClick={handleFilterEntered}
      >
        <h4>Орсон:</h4>
        <h4>{orderIdsEntered.length}</h4>
      </div>
      <div
        className={classForLeft ? "pointer" : "pointer inactive"}
        onDoubleClick={handleFilterLeft}
      >
        <h4>Гарсан:</h4>
        <h4>{orderIdsLeft.length}</h4>
      </div>
      <div
        className={classForCurrent ? "pointer" : "pointer inactive"}
        onDoubleClick={handleFilterCurrent}
      >
        <h4>Эцсийн үлдэгдэл:</h4>
        <h4>{orderIdsEts.length}</h4>
      </div>
      <div>
        <h4>Үлдэгдэл:</h4>
        <h4>{formatCurrency(stats.totalRevenuePrev)}</h4>
      </div>
      <div>
        <h4>Орлого:</h4>
        <h4>{formatCurrency(stats.totalRevenue)}</h4>
      </div>
    </div>
  );

  const header = (
    <>
      <h4>Орсон огноо</h4>
      <h4>Гарсан огноо</h4>
      <h4>Арлын дугаар</h4>
      <h4>Ачаа, барааны нэр</h4>
      <h4>Ачааны жин</h4>
      <h4>Тавцан ашиглалт</h4>
      <h4>Пүүлэлт</h4>
      <h4>Сэрээт өргөгч</h4>
      <h4>Авто кран ашиглалт</h4>
      <h4>Торгууль</h4>
      <h4>Бусад</h4>
      <h4>Талбайн хадгалалт</h4>
      <h4>Нийт дүн</h4>
      <h4>
        5131240302 <br />
        дансанд шилжүүлсэн <br />
        дүн
      </h4>
      <h4>
        5212124601 <br />
        дансанд шилжүүлсэн <br />
        дүн
      </h4>
      <h4>
        НӨАТ падаан <br />
        бичсэн дүн
      </h4>
      <h4>
        НӨАТ падаан <br />
        бичээгүй дүн
      </h4>
      <h4>
        Байгууллага, <br />
        хувь хүний <br />
        нэр
      </h4>
    </>
  );

  const footer = (
    <>
      <h4></h4> {/* Орсон огноо */}
      <h4></h4> {/* Гарсан огноо */}
      <h4></h4>
      {/* Арлын дугаар */}
      <h4></h4>
      {/* Ачаа, барааны нэр */}
      <h4>{stats.totalWeight} тн</h4>
      <h4>
        <p>Гадна тавцан - {stats.tavtsan.gadna}</p>
        <p>Агуулах тавцан - {stats.tavtsan.aguulah}</p>
      </h4>
      <h4>
        <p>Суудлын машин - {stats.tavtsan.gadna}</p>
        <p>Бусад - {stats.tavtsan.aguulah}</p>
      </h4>
      <h4>
        <p>Нэг удаагийн өргөлт - {stats.forklift.neg}</p>
        <p>Нийт цаг - {stats.forklift.hours}</p>
      </h4>
      <h4>
        <p>Хоосон өргөлт - {stats.crane.hooson}</p>
        <p>Ачаатай өргөлт - {stats.crane.achaatai}</p>
      </h4>
      <h4></h4>
      {/* Торгууль */}
      <h4></h4>
      {/* Бусад */}
      <h4>{formatCurrency(stats.totalAmt302)}</h4>
      <h4>{formatCurrency(stats.totalAmt601)}</h4>
      <h4>{formatCurrency(stats.totalAmtWNoat)}</h4>
      <h4>{formatCurrency(stats.totalAmtWoNoat)}</h4>
      <h4></h4>
    </>
  );

  renderedOrders = orderIdsVar.map((id) => (
    <ReportExcerpt key={id} orderId={id} />
  ));

  return (
    <div>
      {statsContent}
      <div className="report-container">
        <div className={sticky && "sticky"}>{header}</div>
        <div className="report-list">{renderedOrders}</div>
        <div>{footer}</div>
      </div>
    </div>
  );
};

export default ReportList;
