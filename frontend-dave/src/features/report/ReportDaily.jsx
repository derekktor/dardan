import { useState } from "react";
import { useGetOrdersQuery } from "../orders/ordersApiSlice";
import ReportList from "./ReportList";
import moment from "moment";

const ReportDaily = () => {
  const { data: orders } = useGetOrdersQuery();

  const today = new Date();
  const [date, setDate] = useState(today);

  let ids;
  if (orders) {
    ids = orders.ids.filter((id) => {
      const dInput = moment(date).startOf("day");
      const dOrder = moment(orders.entities[id].date_entered).startOf("day");

      const same = dInput.isSame(dOrder, "day");

      return same;
    });
  }

  const handleDate = (e) => {
    const date = moment(new Date(e.target.value)).format("YYYY-MM-DD");
    setDate(date);
  };

  return (
    <div>
      <div>
        <label htmlFor="dateInput">Өдөр</label>
        <input
          type="date"
          name="dateInput"
          value={moment(date).format("YYYY-MM-DD")}
          onChange={handleDate}
        />
      </div>

      <div>
        <ReportList orderIds={ids} />
      </div>
    </div>
  );
};

export default ReportDaily;
