import { useGetOrdersQuery } from "../orders/ordersApiSlice";
import { useState } from "react";
import moment from "moment";
import ReportList from "./ReportList";
import { downloadCSV } from "../orders/OrdersExport";
import { useSelector } from "react-redux";
import { selectCurrentToken } from "../auth/authSlice";

const ReportAnnual = () => {
  const { data: orders } = useGetOrdersQuery();
  const token = useSelector(selectCurrentToken)

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
        <ReportList date={moment(`${year}-01-01`).endOf("year")} type={"y"} />
      </div>
      <div>
        <h3>Хэвлэх</h3>
        <button className="button" onClick={() => downloadCSV(token, year, 0, "eh")}>Эхний үлдэгдэл</button>
        <button className="button" onClick={() => downloadCSV(token, year, 0, "orson")}>Орсон</button>
        <button className="button" onClick={() => downloadCSV(token, year, 0, "garsan")}>Гарсан</button>
        <button className="button" onClick={() => downloadCSV(token, year, 0, "ets")}>Эцсийн үлдэгдэл</button>
      </div>
    </div>
  );
};

export default ReportAnnual;
