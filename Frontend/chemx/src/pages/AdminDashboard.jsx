import React, { useState } from "react";
import {
  LineChart, Line,
  BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from "recharts";

const sampleData = {
  "past week": [
    { label: "Mon", orders: 20, revenue: 1000 },
    { label: "Tue", orders: 35, revenue: 1500 },
    { label: "Wed", orders: 25, revenue: 1200 },
    { label: "Thu", orders: 45, revenue: 2200 },
    { label: "Fri", orders: 30, revenue: 1800 },
    { label: "Sat", orders: 50, revenue: 2500 },
    { label: "Sun", orders: 40, revenue: 2000 },
  ],
  "past month": [
    { label: "Week 1", orders: 120, revenue: 6000 },
    { label: "Week 2", orders: 150, revenue: 7500 },
    { label: "Week 3", orders: 170, revenue: 8200 },
    { label: "Week 4", orders: 140, revenue: 7000 },
  ],
  "past year": [
    { label: "Jan", orders: 500, revenue: 20000 },
    { label: "Feb", orders: 520, revenue: 21000 },
    { label: "Mar", orders: 610, revenue: 24000 },
    { label: "Apr", orders: 450, revenue: 18000 },
    { label: "May", orders: 670, revenue: 25000 },
    { label: "Jun", orders: 590, revenue: 22000 },
  ],
};

const productSales = [
  { name: "Hydrochloric Acid", quantity: 300 },
  { name: "Sodium Hydroxide", quantity: 450 },
  { name: "Ammonium Nitrate", quantity: 200 },
  { name: "Acetone", quantity: 150 },
  { name: "Sulfuric Acid", quantity: 500 },
  { name: "Ethanol", quantity: 350 },
];

const COLORS = ["#0ea5e9", "#22c55e", "#facc15", "#ef4444"];

const AdminDashboard = () => {
  const [filter, setFilter] = useState("past week");
  const data = sampleData[filter];

  const totalOrders = data.reduce((acc, curr) => acc + curr.orders, 0);
  const totalRevenue = data.reduce((acc, curr) => acc + curr.revenue, 0);

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <h1 className="dashboard-title">Admin Dashboard</h1>
        <select
          className="dashboard-dropdown"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="past week">Past Week</option>
          <option value="past month">Past Month</option>
          <option value="past year">Past Year</option>
        </select>
      </header>

      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="card">
          <h2>Total Orders</h2>
          <p className="card-value">{totalOrders}</p>
        </div>
        <div className="card">
          <h2>Total Revenue</h2>
          <p className="card-value">₹{totalRevenue}</p>
        </div>
        <div className="card">
          <h2>Avg Order Value</h2>
          <p className="card-value">₹{(totalRevenue / totalOrders).toFixed(2)}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="charts">
        <div className="chart-card">
          <h3>Orders Overview</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="orders" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3>Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" stroke="#10b981" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3>Product Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={[
                  { name: "Acids", value: 400 },
                  { name: "Bases", value: 300 },
                  { name: "Salts", value: 200 },
                  { name: "Solvents", value: 100 },
                ]}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {COLORS.map((color, index) => (
                  <Cell key={index} fill={color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card full-width">
          <h3>Top Selling Products</h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={productSales}
              layout="vertical"
              margin={{ top: 20, right: 30, left: 100, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" />
              <Tooltip />
              <Bar dataKey="quantity" fill="#6366f1" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
