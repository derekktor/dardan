import { useNavigate } from "react-router-dom";
import {
  calculateParkingPrice,
  extra_infos,
  getCraneData,
  getForkliftData,
  getNumDays,
  getPuulelt,
  getTavtsan,
  getTotalPrice,
  formatCurrency,
} from "../orders/SingleOrder";
import { useGetOrdersQuery } from "../orders/ordersApiSlice";
import moment from "moment";

const ReportExcerpt = ({ orderId }) => {
  const navigate = useNavigate();
  const { data: orders } = useGetOrdersQuery();

  const order = orders.entities[orderId];

  const containerClass = `round-border ${
    order.stage === 1 ? "order-finished" : "order-unfinished"
  }`;

  const tavtsan = getTavtsan(order.tavtsan_usage);
  const puulelt = getPuulelt(order.puulelt);
  const forklift = getForkliftData(order.forklift_usage);
  const crane = getCraneData(order.crane_usage);

  let fine = { one: null, two: null };
  if (order.fine1) {
    fine.one = extra_infos.fine.one.price;
  }
  if (order.fine2) {
    fine.two = extra_infos.fine.two.price;
  }

  let other = { one: null, two: null };
  if (order.other1) {
    other.one = extra_infos.other.one.price;
  }
  if (order.other2) {
    other.two = extra_infos.other.two.price;
  }

  const handleNavigateToEdit = () => {
    navigate(`/dash/orders/${orderId}`);
  };

  return (
    <div onDoubleClick={handleNavigateToEdit} className={containerClass}>
      <p>{moment(order.date_entered).format("YYYY-MM-DD")}</p>
      <p>{moment(order.date_left).format("YYYY-MM-DD")}</p>
      <p>
        {order.truck_id_digits}{" "}
        {order.truck_id_letters ? order.truck_id_letters : ""}
      </p>
      <p>{order.load_name}</p>
      <p>{order.load_weight} тн</p>
      <p>
        {tavtsan.text} <br /> {formatCurrency(tavtsan.price)}
      </p>
      <p>
        {puulelt.text} <br /> {formatCurrency(puulelt.price)}
      </p>
      <p>
        {forklift.text} <br /> {formatCurrency(forklift.price)}
      </p>
      <p>
        {crane.text} <br /> {formatCurrency(crane.price)}
      </p>
      <p>
        {fine.one ? `6.1 - ${formatCurrency(fine.one)}` : ""}
        <br />
        {fine.two ? `6.2 - ${formatCurrency(fine.two)}` : ""}
      </p>
      <p>
        {other.one ? `7.1 - ${formatCurrency(other.one)}` : ""}
        <br />
        {other.two ? `7.2 - ${formatCurrency(other.two)}` : ""}
      </p>
      <p>
        {getNumDays(order)} хоног /{" "}
        {formatCurrency(calculateParkingPrice(getNumDays(order)))}
      </p>
      <p>{formatCurrency(getTotalPrice(order))}</p>
      <p>{formatCurrency(order.invoice_to_302)}</p>
      <p>{formatCurrency(order.invoice_to_601)}</p>
      <p>{formatCurrency(order.amount_w_noat)}</p>
      <p>{formatCurrency(order.amount_wo_noat)}</p>
      <p>{order.client_name}</p>
    </div>
  );
};

export default ReportExcerpt;
