import { useGetOrdersQuery } from "../orders/ordersApiSlice";
import { useState } from "react";
import moment from "moment";
import ReportList from "./ReportList";

const ReportMonthly = () => {
  const { data: orders } = useGetOrdersQuery();

  const todayMonth = Number(new Date().getMonth() + 1);
  const todayYear = Number(new Date().getFullYear());
  const [month, setMonth] = useState(todayMonth);
  const [year, setYear] = useState(todayYear);

  let ids;
  if (orders) {
    ids = orders.ids.filter((id) => {
      const dOrder = moment(orders.entities[id].date_entered);
      const mOrder = parseInt(dOrder.format("MM"));
      const yOrder = parseInt(dOrder.format("YYYY"));

      const same = month === mOrder && year === yOrder;

      return same;
    });
  }

  const handleMonth = (e) => {
    setMonth(parseInt(e.target.value));
  };

  const handleYear = (e) => {
    setYear(parseInt(e.target.value));
  };

  return (
    <div>
      <div className="flex-row gap10">
        <div>
          <label htmlFor="monthInput">Сар</label>
          <input
            type="number"
            name="monthInput"
            min={1}
            max={12}
            value={month}
            onChange={handleMonth}
          />
        </div>
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
      </div>
      <div>
        <ReportList orderIds={ids} />
      </div>
    </div>
  );
};

export default ReportMonthly;
