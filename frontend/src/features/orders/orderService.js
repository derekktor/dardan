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

// get orders
const getOrders = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get(
    "http://localhost:5000/orders",
    config
  );

  return response.data;
};

// delete order
const deleteOrder = async (orderId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.delete(
    "http://localhost:5000/orders/" + orderId,
    config
  );

  return response.data;
};


const orderService = {
  createOrder,
  getOrders,
  deleteOrder
};

export default orderService;
