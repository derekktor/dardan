import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import OrderForm from "../components/OrderForm";
import Spinner from "../components/Spinner";
import { getOrdersThunk, reset } from "../features/orders/orderSlice";
import OrderItem from "../components/OrderItem";

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {user} = useSelector((state) => state.auth);
  const {orders, isLoading, isError, message} = useSelector((state) => state.orders);

  useEffect(() => {
    // if not logged in, navigate to login page
    if (!user) {
      navigate("/login");
    }

    dispatch(getOrdersThunk());

    return () => {
      dispatch(reset())
    }
    
  }, [user, navigate, dispatch])

  if (isLoading) {
    return <Spinner></Spinner>
  }

  return <>
  <section className="heading">
    <h1>Welcome {user && user.name}</h1>
    <p>Orders</p>
  </section>

  <OrderForm />
  
  <section className="content">
    {orders.length > 0 ? (
      <div className="goals">
        {orders.map(order => (
          <OrderItem key={order._id} order={order}/>
        ))}
      </div>
    ) : (<h3>You don't have any orders</h3>)}
  </section>
  </>
};

export default Dashboard;
