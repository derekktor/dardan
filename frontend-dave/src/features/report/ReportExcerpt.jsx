import { useNavigate } from "react-router-dom";
import { getCraneData, getForkliftData, getPuulelt, getTavtsan } from "../orders/SingleOrder";
import { useGetOrdersQuery } from "../orders/ordersApiSlice";
import moment from "moment";
import { formatCurrency } from "../orders/SingleOrder";

const ReportExcerpt = ({ orderId }) => {
  const navigate = useNavigate();
  const { data: orders } = useGetOrdersQuery();

  const order = orders.entities[orderId];

  const containerClass = `round-border ${order.stage === 1 ? "order-finished" : "order-unfinished"}`

  const tavtsan = getTavtsan(order.tavtsan_usage)
  const puulelt = getPuulelt(order.puulelt)
  const forklift = getForkliftData(order.forklift_usage)
  const crane = getCraneData(order.crane_usage)
  
  console.log(crane)
  
  const handleNavigateToEdit = () => {
    navigate(`/dash/orders/edit/${orderId}`)
  }

  console.log(order);
  
  return (
    <div onDoubleClick={handleNavigateToEdit} className={containerClass}>
      <p>{moment(order.date_entered).format("YYYY-MM-DD")}</p>
      <p>{moment(order.date_left).format("YYYY-MM-DD")}</p>
      <p>
        {order.truck_id_digits} {order.truck_id_letters
          ? order.truck_id_letters
          : ""}
      </p>
      <p>{order.load_name}</p>
      <p>{order.load_weight} тн</p>
      <p>{tavtsan.text}</p>
      <p>{puulelt.text}</p>
      <p>{forklift.text}</p>
      <p>{crane.text}</p>
      <p>{order.fine1 ? "6.1" : ""} {order.fine2 ? "6.2" : ""}</p>
      <p>{order.other1 ? "7.1" : ""} {order.other2 ? "7.2" : ""}</p>
      <p>{formatCurrency(order.invoice_to_302)}</p>
      <p>{formatCurrency(order.invoice_to_601)}</p>
      <p>{formatCurrency(order.amount_w_noat)}</p>
      <p>{formatCurrency(order.amount_wo_noat)}</p>
      <p>{order.client_name}</p>
    </div>
  );
};

export default ReportExcerpt;
