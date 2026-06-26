import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const NewUserChart = () => {
  const navigate = useNavigate();
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/admin-login");
      return;
    }

    setLoading(true);

    fetch("https://softworktech.com/asad_ecom/api/weekly_user_registrations/", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) {
          if (res.status === 401) localStorage.removeItem("adminToken");
          throw new Error("Unauthorized or fetch error");
        }
        return res.json();
      })
      .then((data) => {
        const labels = data.map((item) =>
          new Date(item.week).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })
        );
        const counts = data.map((item) => item.user_count);

        setChartData({
          labels,
          datasets: [
            {
              label: "Weekly Users",
              data: counts,
              fill: false,
              borderColor: "rgba(75,192,192,1)",
              backgroundColor: "rgba(75,192,192,0.2)",
              tension: 0.3,
              pointRadius: 5,
            },
          ],
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load weekly user data");
        setLoading(false);
      });
  }, [navigate]);

  if (loading)
    return (
      <div className="text-center my-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );

  if (error)
    return <div className="alert alert-danger text-center my-3">{error}</div>;

  return (
    <div className="card p-3 shadow-sm">
      <h5 className="mb-3">Weekly User Registrations</h5>
      <div style={{ overflowX: "auto" }}>
        <div style={{ minWidth: chartData.labels.length * 80, height: 400 }}>
          <Line
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { position: "top" },
                title: { display: true, text: "Weekly Users Chart" },
                tooltip: { mode: "index", intersect: false },
              },
              scales: {
                x: {
                  title: {
                    display: true,
                    text: "Week Start",
                    font: { size: 14, weight: "bold" },
                  },
                },
                y: {
                  beginAtZero: true,
                  title: {
                    display: true,
                    text: "Number of Users",
                    font: { size: 14, weight: "bold" },
                  },
                  ticks: {
                    stepSize: 1,
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

export default NewUserChart;
