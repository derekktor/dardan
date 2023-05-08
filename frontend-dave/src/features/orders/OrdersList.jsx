import { useSelector } from "react-redux";
import { selectOrderIds, useGetOrdersQuery } from "./ordersApiSlice";
import OrderExcerpt from "./OrderExcerpt";

const OrdersList = () => {
  const fetchOptions = {
    // refetch user data every 15s
    pollingInterval: 15000,
    // when focus on another window and return, refetch user data
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true
  }

  const {
    data: orders,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetOrdersQuery("ordersQuery", fetchOptions);

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
