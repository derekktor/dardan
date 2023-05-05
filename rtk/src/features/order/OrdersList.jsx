import { useSelector } from "react-redux";
import { selectOrderIds } from "./ordersSlice";
import { useGetOrdersQuery } from "./ordersSlice";
import OrderExcerpt from "./OrderExcerpt";

const OrdersList = () => {
  const { isLoading, isSuccess, isError, error } = useGetOrdersQuery();

  // const orders = useSelector(selectAllOrders);
  const orderIds = useSelector(selectOrderIds);

  let content;
  if (isLoading) {
    content = <h3>Loading...</h3>;
  } else if (isSuccess) {
    content = orderIds.map((orderId) => (
      <OrderExcerpt key={orderId} orderId={orderId}/>
    ));
  } else if (isError) {
    content = <h3>{error}</h3>
  }


  return (
    <div>
      <h1>Бүртгэлүүд</h1>
      {content}
    </div>
  );
};

export default OrdersList;
