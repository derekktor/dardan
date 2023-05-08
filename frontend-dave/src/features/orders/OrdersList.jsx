import { useSelector } from "react-redux";
import { selectOrderIds, useGetOrdersQuery } from "./ordersApiSlice";
import OrderExcerpt from "./OrderExcerpt";
import useAuth from "../../hooks/useAuth";

const OrdersList = () => {
  const {name, isAdmin} = useAuth();
  const fetchOptions = {
    // refetch user data every 2m
    pollingInterval: 120000,
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
    const { ids, entities } = orders ? orders : { ids: [] };

    let filteredIds;
    if (isAdmin) {
      filteredIds = [...ids];
    } else {
      filteredIds = ids.filter(orderId => entities[orderId].created_by_name === name)
    }

    content = filteredIds?.length && filteredIds.map((orderId) => (
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
