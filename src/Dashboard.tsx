import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar";
import FilterDropdown, { type FilterOption } from "./components/FilterDropdown";
import IncidenciasChart from "./components/IncidenciasChart";
import "./Dashboard.css";

const Dashboard: React.FC = () => {
  const [filter, setFilter] = useState<FilterOption>("Activas");

  return (
    <div className="dashboard-root d-flex">
      <Sidebar filter={filter} onFilterChange={setFilter} /> {/* 👈 */}
      <div className="dashboard-main d-flex flex-column">
        <TopBar />
        <div className="dashboard-content flex-grow-1">
          {/* Filter */}
          <div className="content-filter px-3 pt-3 pb-1">
            <FilterDropdown selected={filter} onChange={setFilter} />
          </div>

          {/* Section Header */}
          <div className="section-header mx-3 mt-2 mb-4">
            <span className="section-title">{filter.toUpperCase()}</span>
          </div>

          {/* Charts */}
          <IncidenciasChart filter={filter} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
