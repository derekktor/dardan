import React, { useRef } from "react";
import { useParams } from "react-router-dom";
import { useGetOrdersQuery } from "./ordersApiSlice";
import moment from "moment";
import { useReactToPrint } from "react-to-print";

const OrdersTest = () => {
  const { date } = useParams();
  const componentRef = useRef();
  const { data: orders } = useGetOrdersQuery("getOrdersForPrint");
  let orderIds;

  if (orders) {
    orderIds = orders.ids.filter((id) => {
      const orderDB = orders.entities[id];

      const dateEntered = moment(orderDB.date_entered).startOf("day");
      let dateLeft;
      const today = moment(date).startOf("day");
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
  }

  // // COMPONENTS
  let ordersComp;
  if (orderIds) {
    ordersComp = orderIds.map((id) => (
      <div>
        {orders.entities[id].truck_id_digits}
        {orders.entities[id].truck_id_letters}
      </div>
    ));
  }

  // // FUNCTIONS
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `${moment(date).format("YYYY-MM-DD")}`,
    onAfterPrint: () => alert("Хэвлэж байна..."),
  });

  return (
    <div>
      <h4>Бүртгэлүүд</h4>
      <p>{moment(date).format("YYYY-MM-DD")}</p>
      <div className="orders-print" ref={componentRef}>
        {ordersComp}
      </div>
      <button onClick={handlePrint}>Хэвлэх</button>
    </div>
  );
};

export default OrdersTest;
