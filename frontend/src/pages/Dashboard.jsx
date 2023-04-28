import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const Dashboard = () => {
  const navigate = useNavigate();
  const {user} = useSelector((state) => state.auth);

  useEffect(() => {
    // if not logged in, navigate to login page
    if (!user) {
      navigate("/login");
    }

    
  }, [user, navigate])

  return <div>Dashboard</div>;
};

export default Dashboard;
