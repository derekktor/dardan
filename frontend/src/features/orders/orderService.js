import axios from "axios";

// create order
const createOrder = async (orderData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const { truckNum, loadName } = orderData;
  const digits = truckNum[0];
  const letters = truckNum[1];

  const orderData2 = {
    truck_num_letters: letters,
    truck_num_digits: digits,
    load_name: loadName,
  };

  console.log(orderData2);

  const response = await axios.post(
    "http://localhost:5000/orders",
    orderData2,
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

  const response = await axios.get("http://localhost:5000/orders", config);

  return response.data;
};

const orderService = {
  createOrder,
  getOrders,
};

export default orderService;
