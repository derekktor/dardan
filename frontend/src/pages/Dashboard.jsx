import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {toast} from "react-toastify";
import OrderForm from "../components/OrderForm";
import Spinner from "../components/Spinner";
import { getOrdersThunk, reset } from "../features/orders/orderSlice";

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {user} = useSelector((state) => state.auth);
  const {orders, isLoading, isError, message} = useSelector((state) => state.orders);

  useEffect(() => {
    if (isError) {
      toast.error(message)
    }

    // if not logged in, navigate to login page
    if (!user) {
      navigate("/login");
    }

    dispatch(getOrdersThunk())

    return () => {
      dispatch(reset())
    }
  }, [user, navigate, isError, message, dispatch])

  if (isLoading) {
    return <Spinner></Spinner>
  }

  return <>
  <section className="heading">
    <h1>Welcome {user && user.name}</h1>
    <p>Orders</p>
  </section>

  <OrderForm />
  
  </>
};

export default Dashboard;
