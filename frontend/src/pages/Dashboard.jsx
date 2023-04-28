import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import OrderForm from "../components/OrderForm";

const Dashboard = () => {
  const navigate = useNavigate();
  const {user} = useSelector((state) => state.auth);

  useEffect(() => {
    // if not logged in, navigate to login page
    if (!user) {
      navigate("/login");
    }

    
  }, [user, navigate])

  return <>
  <section className="heading">
    <h1>Welcome {user && user.name}</h1>
    <p>Orders</p>
  </section>

  <OrderForm />
  
  </>
};

export default Dashboard;
