import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import "./IncidenciasChart.css";

export type FilterOption = "Activas" | "Finalizadas" | "Pendientes";

interface IncidenciasChartProps {
  filter: FilterOption;
}

const pieData = {
  Activas: [
    { name: "Tipo A", value: 40 },
    { name: "Tipo B", value: 30 },
    { name: "Tipo C", value: 15 },
    { name: "Tipo D", value: 10 },
    { name: "Tipo E", value: 5 },
  ],
  Finalizadas: [
    { name: "Tipo A", value: 50 },
    { name: "Tipo B", value: 25 },
    { name: "Tipo C", value: 15 },
    { name: "Tipo D", value: 10 },
  ],
  Pendientes: [
    { name: "Tipo A", value: 35 },
    { name: "Tipo B", value: 35 },
    { name: "Tipo C", value: 20 },
    { name: "Tipo D", value: 10 },
  ],
};

const barData = {
  Activas: [
    { month: "Jan", value1: 75, value2: 55 },
    { month: "Feb", value1: 85, value2: 65 },
    { month: "Mar", value1: 95, value2: 70 },
    { month: "Apr", value1: 65, value2: 45 },
    { month: "May", value1: 80, value2: 60 },
    { month: "Jun", value1: 70, value2: 55 },
    { month: "Jul", value1: 60, value2: 40 },
    { month: "Aug", value1: 65, value2: 45 },
    { month: "Sep", value1: 50, value2: 35 },
    { month: "Oct", value1: 60, value2: 42 },
    { month: "Nov", value1: 70, value2: 50 },
    { month: "Dec", value1: 68, value2: 48 },
  ],
  Finalizadas: [
    { month: "Jan", value1: 60, value2: 40 },
    { month: "Feb", value1: 70, value2: 50 },
    { month: "Mar", value1: 80, value2: 55 },
    { month: "Apr", value1: 55, value2: 38 },
    { month: "May", value1: 65, value2: 45 },
    { month: "Jun", value1: 60, value2: 42 },
    { month: "Jul", value1: 50, value2: 35 },
    { month: "Aug", value1: 55, value2: 38 },
    { month: "Sep", value1: 45, value2: 30 },
    { month: "Oct", value1: 50, value2: 35 },
    { month: "Nov", value1: 60, value2: 42 },
    { month: "Dec", value1: 55, value2: 38 },
  ],
  Pendientes: [
    { month: "Jan", value1: 40, value2: 28 },
    { month: "Feb", value1: 48, value2: 32 },
    { month: "Mar", value1: 55, value2: 38 },
    { month: "Apr", value1: 35, value2: 22 },
    { month: "May", value1: 42, value2: 28 },
    { month: "Jun", value1: 38, value2: 25 },
    { month: "Jul", value1: 30, value2: 20 },
    { month: "Aug", value1: 35, value2: 22 },
    { month: "Sep", value1: 28, value2: 18 },
    { month: "Oct", value1: 32, value2: 21 },
    { month: "Nov", value1: 40, value2: 27 },
    { month: "Dec", value1: 36, value2: 24 },
  ],
};

const PIE_COLORS = ["#5a5a5a", "#8a8a8a", "#b0b0b0", "#cecece", "#e5e5e5"];

const IncidenciasChart: React.FC<IncidenciasChartProps> = ({ filter }) => {
  const currentPie = pieData[filter];
  const currentBar = barData[filter];

  return (
    <div className="chart-panel d-flex align-items-center gap-4">
      {/* Pie Chart */}
      <div className="pie-wrapper">
        <ResponsiveContainer width={260} height={280}>
          <PieChart>
            <Pie
              data={currentPie}
              cx="50%"
              cy="50%"
              outerRadius={120}
              innerRadius={0}
              dataKey="value"
              strokeWidth={2}
              stroke="#fff"
            >
              {currentPie.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={PIE_COLORS[index % PIE_COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value, name) => [value as number, name as string]}
              contentStyle={{ fontSize: "0.75rem", borderRadius: "6px" }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Horizontal Bar Chart */}
      <div className="bar-wrapper flex-grow-1">
        <ResponsiveContainer width="100%" height={320}>
          <BarChart
            layout="vertical"
            data={currentBar}
            margin={{ top: 0, right: 20, left: 10, bottom: 0 }}
            barCategoryGap="30%"
            barGap={3}
          >
            <CartesianGrid horizontal={false} stroke="#f0f0f0" />
            <XAxis type="number" hide />
            <YAxis
              type="category"
              dataKey="month"
              tick={{ fontSize: 11, fill: "#888" }}
              axisLine={false}
              tickLine={false}
              width={30}
            />
            <Tooltip
              contentStyle={{ fontSize: "0.75rem", borderRadius: "6px" }}
            />
            <Bar
              dataKey="value1"
              fill="#7a7a7a"
              radius={[0, 3, 3, 0]}
              barSize={9}
            />
            <Bar
              dataKey="value2"
              fill="#c8c8c8"
              radius={[0, 3, 3, 0]}
              barSize={9}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default IncidenciasChart;
