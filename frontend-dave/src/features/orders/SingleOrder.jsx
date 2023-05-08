import { useDeleteOrderMutation, useGetOrdersQuery } from "./ordersApiSlice";
import { useParams, Link, useNavigate } from "react-router-dom";
import { memo } from "react";
import useAuth from "../../hooks/useAuth";

const SingleOrder = () => {
  const { isAdmin } = useAuth();

  const [deleteOrder] = useDeleteOrderMutation();
  const navigate = useNavigate();

  const { orderId } = useParams();
  // const order = useSelector((state) => selectOrderById(state, String(orderId)));

  const { order } = useGetOrdersQuery("ordersList", {
    selectFromResult: ({ data }) => ({
      order: data?.entities[orderId],
    }),
  });

  // TODO
  // const createdAt = new Date(order?.createdAt).toLocaleString("en-US", {})
  // const updatedAt = new Date(order?.updatedAt).toLocaleString("en-US", {})

  const handleDelete = async (orderId) => {
    try {
      await deleteOrder(orderId).unwrap();
      navigate("/dash/orders");
    } catch (error) {
      console.error("Бүртгэлийг устгаж чадсангүй", error);
    }
  };

  return (
    <div>
      <h1>{orderId}</h1>
      <h1>{order?.client_name}</h1>
      <p>Load: {order?.load_name}</p>
      <p>Created by: {order?.created_by_name}</p>
      <p>Created at: {order?.createdAt}</p>
      <p>Updated at: {order?.updatedAt}</p>
      <div className="buttons">
        <Link to={`/dash/orders/edit/${orderId}`}>Edit</Link>
        {isAdmin && (
          <button onClick={() => handleDelete(orderId)}>Delete</button>
        )}
      </div>
    </div>
  );
};

const memoizedOrder = memo(SingleOrder);
export default memoizedOrder;
