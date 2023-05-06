import { useSelector } from "react-redux";
import { selectOrderIds, useGetOrdersQuery } from "./ordersApiSlice";
import OrderExcerpt from "./OrderExcerpt";

const OrdersList = () => {
  const {
    data: orders,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetOrdersQuery();

  // const orders = useSelector(selectAllOrders);

  let content;
  if (isLoading) {
    content = <h3>Loading...</h3>;
  } else if (isSuccess) {
    const { ids } = orders ? orders : { ids: [] };
    content = ids.map((orderId) => (
      <OrderExcerpt key={orderId} orderId={orderId} />
    ));
  } else if (isError) {
    content = <h3>{error?.data?.message}</h3>;
  }

  return (
    <div>
      <h1>Бүртгэлүүд</h1>
      {content}
    </div>
  );
};

export default OrdersList;
