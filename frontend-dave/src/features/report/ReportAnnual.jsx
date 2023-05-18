import { useGetOrdersQuery } from "../orders/ordersApiSlice";
import { useState } from "react";
import moment from "moment";
import ReportList from "./ReportList";

const ReportAnnual = () => {
  const { data: orders } = useGetOrdersQuery();

  const todayYear = Number(new Date().getFullYear());
  const [year, setYear] = useState(todayYear);

  let ids;
  let idsPrev;
  if (orders) {
    ids = orders.ids.filter((id) => {
      const dOrder = moment(orders.entities[id].date_entered);
      const yOrder = parseInt(dOrder.format("YYYY"));

      return year === yOrder;
    });

    idsPrev = orders.ids.filter((id) => {
      const dOrder = moment(orders.entities[id].date_entered);
      const yOrder = parseInt(dOrder.format("YYYY")) + 1;

      return year === yOrder;;
    });
  }

  const handleYear = (e) => {
    setYear(parseInt(e.target.value));
  };

  return (
    <div>
      <div className="flex-row gap10 align-center">
        <label htmlFor="yearInput">Жил</label>
        <input
          type="number"
          name="yearInput"
          min={2000}
          max={3000}
          value={year}
          onChange={handleYear}
        />
      </div>
      <div>
        <ReportList orderIds={ids} orderIdsPrev={idsPrev}/>
      </div>
    </div>
  );
};

export default ReportAnnual;
