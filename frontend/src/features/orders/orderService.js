import axios from "axios";

// create order
const createOrder = async (orderData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  console.log(orderData);

  const response = await axios.post(
    "http://localhost:5000/orders",
    orderData,
    config
  );

  return response.data;
};

const orderService = {
  createOrder,
};

export default orderService;
