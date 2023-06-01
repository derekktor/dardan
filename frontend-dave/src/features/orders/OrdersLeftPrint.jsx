import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { useParams } from "react-router-dom";
import { useGetOrdersQuery } from "./ordersApiSlice";
import moment from "moment";

const OrdersLeftPrint = () => {
  const componentRef = useRef();
  const { date } = useParams();
  const { data: orders } = useGetOrdersQuery("ordersList");


  let orderIdsEts;
  // etssiin uldegdel
  orderIdsEts = orders.ids.filter((id) => {
    const orderDB = orders.entities[id];

    const dateEntered = moment(orderDB.date_entered).startOf("day");
    let dateLeft;
    const today = date.startOf("day");
    let leftAfter, enteredBefore;

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
  });

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `${moment(date).format("YYYY-MM-DD")}`,
    onAfterPrint: () => alert("Хэвлэж байна..."),
  });

  let ordersList = orderIdsEts.map((id) => (
    <div key={id}>
      {orders.entities[id].truck_id_digits}
      {orders.entities[id].truck_id_letters}
    </div>
  ));

  let ordersPrint;
  if (orders) {
    ordersPrint = (
      <div ref={componentRef} className="">
        {ordersList}
      </div>
    );
  }

  return (
    <>
      <h4>Hello</h4>
      {ordersPrint}
      <button onClick={handlePrint}>Хэвлэх</button>
    </>
  );
};

export default OrdersLeftPrint;
