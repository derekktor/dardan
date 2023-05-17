import { useGetOrdersQuery } from "../orders/ordersApiSlice";
import { useState } from "react";
import moment from "moment";
import ReportList from "./ReportList";

const ReportAnnual = () => {
  const { data: orders } = useGetOrdersQuery();

  const todayYear = Number(new Date().getFullYear());
  const [year, setYear] = useState(todayYear);

  let ids;
  if (orders) {
    ids = orders.ids.filter((id) => {
      const dOrder = moment(orders.entities[id].date_entered);
      const yOrder = parseInt(dOrder.format("YYYY"));

      const same = year === yOrder;

      return same;
    });
  }

  const handleYear = (e) => {
    setYear(parseInt(e.target.value));
  };

  return (
    <div>
      <div>
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
        <ReportList orderIds={ids} />
      </div>
    </div>
  );
};

export default ReportAnnual;
