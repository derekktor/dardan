import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { formatDate } from "./SingleOrder";
import { useParams } from "react-router-dom";
import { useGetOrdersQuery } from "./ordersApiSlice";

const OrderPrint = () => {
  const componentRef = useRef();
  const {orderId} = useParams();

   const { order } = useGetOrdersQuery("ordersList", {
    selectFromResult: ({ data }) => ({
      order: data?.entities[orderId],
    }),
  });

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Гарах хуудас",
    onAfterPrint: () => alert("Хэвлэж байна..."),
  });

  let garahHuudas;
  if (order) {
    garahHuudas = (
      <div ref={componentRef} className="garah-huudas">
        <h3>Гаалийн хяналтын бүсээс гарах зөвшөөрөл</h3>
        <div>
          <h4>Орсон огноо</h4>
          <p>{formatDate(order.date_entered)}</p>
        </div>
        <div>
          <h4>Гарсан огноо</h4>
          <p>{formatDate(order.date_left)}</p>
        </div>
        <div>
          <h4>Гаалийн мэдүүлгийн дугаар</h4>
          <p>{order.gaaliin_meduulgiin_dugaar ? order.gaaliin_meduulgiin_dugaar : "..."}</p>
        </div>
        <div>
          <h4>Тээврийн хэрэгслийн дугаар</h4>
          <p>
            {order.truck_id_digits} {order.truck_id_letters}
          </p>
        </div>
        <div>
          <h4>ГУАБ</h4>
          <p>...</p>
        </div>
        <div>
          <h4>ХМХА-ны улсын байцаагч</h4>
          <p>...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {garahHuudas}
      <button onClick={handlePrint}>Хэвлэх</button>
    </>
  );
};

export default OrderPrint;
