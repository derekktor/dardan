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
  let idsPrev;
  if (orders) {
    ids = orders.ids.filter((id) => {
      const dOrder = moment(orders.entities[id].date_entered);
      const mOrder = parseInt(dOrder.format("MM"));
      const yOrder = parseInt(dOrder.format("YYYY"));

      return month === mOrder && year === yOrder;
    });

    idsPrev = orders.ids.filter((id) => {
      const dOrder = moment(orders.entities[id].date_entered);
      const mOrder = parseInt(dOrder.format("MM")) + 1;
      const yOrder = parseInt(dOrder.format("YYYY"));

      return month === mOrder && year === yOrder;
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
      <div className="report-monthly-grid">
        <div>
          <label htmlFor="monthInput">Сар</label>
          <label htmlFor="yearInput">Жил</label>
        </div>
        <div>
          <input
            type="number"
            name="monthInput"
            min={1}
            max={12}
            value={month}
            onChange={handleMonth}
          />
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
        <ReportList orderIds={ids} orderIdsPrev={idsPrev} />
      </div>
    </div>
  );
};

export default ReportMonthly;
