import React from 'react';
import MonthlyChart from './MonthlyChart';
import TopSales from './TopSales';
import WeeklyChart from './WeklyChart';
import NewUserCahart from './NewUserCahart';

const SalesChart = () => {
  return (
    <div className="container mt-4">
      <div className="row">
        {/* Monthly Sales Chart */}
        <div className="col-lg-8 col-md-12 mb-4">
          <MonthlyChart />
        </div>

        {/* Top Selling Products */}
        <div className="col-lg-4 col-md-12 mb-4">
          <TopSales />
        </div>
      </div>

      <div className="row">
        {/* Weekly Sales Chart */}
        <div className="col-lg-8 col-md-12 mb-4">
          <WeeklyChart />
        </div>
      
        {/* Weekly Sales Chart */}
        <div className="col-lg-4 col-md-12 mb-4">
          <NewUserCahart />
        </div>
      </div>
    </div>
  );
};

export default SalesChart;
