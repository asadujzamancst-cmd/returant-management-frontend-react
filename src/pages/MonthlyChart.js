import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const MonthlyChart = () => {
  const navigate = useNavigate();
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");

    if (!token) {
      navigate("/admin-login");
      return;
    }

    setLoading(true);

    fetch("https://softworktech.com/asad_ecom/api/monthly_sales/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized or fetch error");
        return res.json();
      })
      .then((data) => {
        const labels = data.map((item) =>
          new Date(item.month).toLocaleString("default", { month: "short" })
        );
        const sales = data.map((item) => item.monthly_sales);

        setChartData({
          labels: labels,
          datasets: [
            {
              label: "Monthly Sales",
              data: sales,
              backgroundColor: "rgba(54, 162, 235, 0.7)",
              borderRadius: 5,
            },
          ],
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load chart data");
        setLoading(false);
      });
  }, [navigate]);

  if (loading) {
    return (
      <div className="text-center my-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger text-center my-3">{error}</div>
    );
  }

  return (
    <div className="card p-3 shadow-sm">
      <h5 className="mb-3">Monthly Sales</h5>
      {/* Wrapper with horizontal scroll */}
      <div style={{ overflowX: "auto" }}>
        <div style={{ minWidth: chartData.labels.length * 80, height: 400 }}>
          <Bar
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false, // allow custom height
              plugins: {
                legend: { position: "top" },
                title: { display: true, text: "Monthly Sales Chart" },
                tooltip: { mode: "index", intersect: false },
              },
              scales: {
                x: {
                  title: {
                    display: true,
                    text: "Month",
                    font: { size: 14, weight: "bold" },
                  },
                },
                y: {
                  beginAtZero: true,
                  title: {
                    display: true,
                    text: "Sales Amount ($)",
                    font: { size: 14, weight: "bold" },
                  },
                  ticks: {
                    callback: function (value) {
                      return value.toLocaleString();
                    },
                  },
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default MonthlyChart;
