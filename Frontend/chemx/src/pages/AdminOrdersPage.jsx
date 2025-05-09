import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { axiosClient } from '../axios/AxiosSetup';
import './AdminOrdersPage.css';
const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axiosClient.get('/adminorders', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data && Array.isArray(response.data.orders)) {
          setOrders(response.data.orders);
        } else {
          setError('Orders data is not in the expected format.');
        }
      } catch (err) {
        setError('Failed to fetch orders.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return <div className="text-center p-4">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 p-4">{error}</div>;
  }

  const goToBillPage = (order) => {
    navigate("/bill", { state: { order } });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Orders</h1>

      <table className="table-auto w-full border-collapse border border-gray-200">
        <thead>
          <tr>
            <th className="px-4 py-2 border-b">Order ID</th>
            <th className="px-4 py-2 border-b">Customer</th>
            <th className="px-4 py-2 border-b">Order Date</th>
            <th className="px-4 py-2 border-b">Items</th>
            <th className="px-4 py-2 border-b">Total Price</th>
            <th className="px-4 py-2 border-b">Action</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id}>
              <td className="px-4 py-2 border-b">{order._id}</td>
              <td className="px-4 py-2 border-b">
                {order.userId && order.userId.name ? order.userId.name : 'N/A'}
              </td>
              <td className="px-4 py-2 border-b">{new Date(order.orderDate).toLocaleDateString()}</td>
              <td className="px-4 py-2 border-b">
                {Array.isArray(order.items) && order.items.length > 0
                  ? order.items.map((item, index) => (
                      <div key={item.productId?._id || index}>
                        {item.productId?.name || 'Unknown Product'} x{item.quantity}
                      </div>
                    ))
                  : 'No items'}
              </td>
              <td className="px-4 py-2 border-b">
                {Array.isArray(order.items) && order.items.length > 0
                  ? order.items.reduce(
                      (total, item) => total + (item.productId?.price || 0) * item.quantity,
                      0
                    ).toFixed(2)
                  : '0.00'}
              </td>
              <td className="px-4 py-2 border-b">
                <button
                  className="generate-bill-btn"
                  onClick={() => goToBillPage(order)}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#2563eb',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  Generate Bill
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminOrdersPage;
