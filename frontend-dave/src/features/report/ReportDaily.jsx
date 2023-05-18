import { useState } from "react";
import { useGetOrdersQuery } from "../orders/ordersApiSlice";
import ReportList from "./ReportList";
import moment from "moment";

const ReportDaily = () => {
  const { data: orders } = useGetOrdersQuery();

  const [selectedDate, setSelectedDate] = useState(moment());

  const handleDateChange = (e) => {
    let y = selectedDate.format("YYYY");
    let m = selectedDate.format("MM");
    let d = selectedDate.format("DD");

    if (e.target.name === "date") {
      d = e.target.value;
    } else if (e.target.name === "month") {
      m = e.target.value;
    } else if (e.target.name === "year") {
      y = e.target.value;
    }

    const newDate = moment(`${y}-${m}-${d}`, "YYYY-MM-DD");
    setSelectedDate(newDate);
  };

  const previousDate = selectedDate.clone().subtract(1, "day");

  let ids;
  let idsPrev;

  if (orders) {
    ids = orders.ids.filter((id) => {
      const dOrder = moment(orders.entities[id].date_entered);
      const orderDateFormatted = dOrder.format("YYYY-MM-DD");

      return orderDateFormatted === selectedDate.format("YYYY-MM-DD");
    });

    idsPrev = orders.ids.filter((id) => {
      const dOrder = moment(orders.entities[id].date_entered);
      const orderDateFormatted = dOrder.format("YYYY-MM-DD");

      return orderDateFormatted === previousDate.format("YYYY-MM-DD");
    });
  }

  return (
    <div>
      <div className="flex-row gap10">
        <div>
          <label htmlFor="dayInput">Өдөр</label>
          <input
            type="number"
            name="date"
            min={1}
            max={31}
            value={selectedDate.date()}
            onChange={handleDateChange}
          />
        </div>
        <div>
          <label htmlFor="monthInput">Сар</label>
          <input
            type="number"
            name="month"
            min={1}
            max={12}
            value={selectedDate.month() + 1}
            onChange={handleDateChange}
          />
        </div>
        <div>
          <label htmlFor="yearInput">Жил</label>
          <input
            type="number"
            name="year"
            min={2000}
            max={3000}
            value={selectedDate.year()}
            onChange={handleDateChange}
          />
        </div>
      </div>

      <div>
        <ReportList orderIds={ids} orderIdsPrev={idsPrev} />
      </div>
    </div>
  );
};

export default ReportDaily;