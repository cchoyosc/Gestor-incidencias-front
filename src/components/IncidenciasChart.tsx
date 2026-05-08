import React, { useEffect, useState } from "react";
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
import { getIncidenciasStats, getPersonalStats } from "../service/api";

export type FilterOption = "Activas" | "Finalizadas" | "Pendientes";

interface IncidenciasChartProps {
  filter: FilterOption;
}

const PIE_COLORS = ["#5a5a5a", "#8a8a8a", "#b0b0b0", "#cecece", "#e5e5e5"];

const IncidenciasChart: React.FC<IncidenciasChartProps> = ({ filter }) => {
  const [stats, setStats] = useState<any>(null);
  const [personal, setPersonal] = useState<any[]>([]);

  useEffect(() => {
    getIncidenciasStats().then(setStats).catch(console.error);
    getPersonalStats().then(setPersonal).catch(console.error);
  }, []);

  const pieData = stats
    ? filter === "Activas"
      ? [
          { name: "En proceso", value: Number(stats.en_proceso) },
          { name: "Pendientes", value: Number(stats.pendiente) },
          { name: "Resueltas", value: Number(stats.resuelto) },
        ]
      : filter === "Pendientes"
        ? [
            { name: "Pendientes", value: Number(stats.pendiente) },
            { name: "En proceso", value: Number(stats.en_proceso) },
          ]
        : [{ name: "Resueltas", value: Number(stats.resuelto) }]
    : [];

  const barData = personal.map((p) => ({
    nombre: p.nombre.split(" ")[0],
    en_proceso: filter !== "Finalizadas" ? Number(p.en_proceso) : 0,
    resuelto:
      filter === "Activas" || filter === "Finalizadas" ? Number(p.resuelto) : 0,
  }));

  return (
    <div className="chart-panel d-flex align-items-center gap-4">
      {/* Pie Chart */}
      <div className="pie-wrapper">
        <p
          style={{
            fontWeight: 600,
            fontSize: "0.85rem",
            color: "#555",
            marginBottom: 4,
          }}
        >
          INCIDENCIAS
        </p>
        <ResponsiveContainer width={260} height={280}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              outerRadius={120}
              innerRadius={0}
              dataKey="value"
              strokeWidth={2}
              stroke="#fff"
            >
              {pieData.map((_, index) => (
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

      {/* Bar Chart */}
      <div className="bar-wrapper flex-grow-1">
        <p
          style={{
            fontWeight: 600,
            fontSize: "0.85rem",
            color: "#555",
            marginBottom: 4,
          }}
        >
          PERSONAL
        </p>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart
            layout="vertical"
            data={barData}
            margin={{ top: 0, right: 20, left: 10, bottom: 0 }}
            barCategoryGap="30%"
            barGap={3}
          >
            <CartesianGrid horizontal={false} stroke="#f0f0f0" />
            <XAxis type="number" hide />
            <YAxis
              type="category"
              dataKey="nombre"
              tick={{ fontSize: 11, fill: "#888" }}
              axisLine={false}
              tickLine={false}
              width={60}
            />
            <Tooltip
              contentStyle={{ fontSize: "0.75rem", borderRadius: "6px" }}
            />
            {filter !== "Finalizadas" && (
              <Bar
                dataKey="en_proceso"
                name="En proceso"
                fill="#7a7a7a"
                radius={[0, 3, 3, 0]}
                barSize={9}
              />
            )}
            {filter !== "Pendientes" && (
              <Bar
                dataKey="resuelto"
                name="Resueltas"
                fill="#c8c8c8"
                radius={[0, 3, 3, 0]}
                barSize={9}
              />
            )}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default IncidenciasChart;
