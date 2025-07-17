import React, { useContext, useEffect, useState } from "react";
import { GlobalState } from "../../GlobalState";
import axios from "../../utils/AxiosConfig";

const OrderManager = () => {
  const state = useContext(GlobalState);
  const [token] = state.token;
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (token) {
      const fetchOrders = async () => {
        try {
          const res = await axios.get("/api/orders", {
            headers: { Authorization: token },
          });
          setOrders(res.data);
        } catch (error) {
          console.error("Error fetching orders:", error);
        }
      };
      fetchOrders();
    }
  }, [token]);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Order Manager</h2>
      {orders.length === 0 ? (
        <p>No orders found or loading...</p>
      ) : (
        <ul className="space-y-2">
          {orders.map((order) => (
            <li key={order._id} className="p-4 bg-gray-800 rounded">
              <p className="text-sm">Order ID: {order._id}</p>
              <p>Total: ₹{order.total}</p>
              <p>Status: {order.status}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default OrderManager;
