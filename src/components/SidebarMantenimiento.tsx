import React, { useState } from "react";

import "./Sidebar.css";
export type EstadoIncidencia = "Nuevas" | "Cerradas" | "Pendientes";

interface SidebarMantenimientoProps {
  filtro: EstadoIncidencia;
  onFiltroChange: (f: EstadoIncidencia) => void;
}

const OPCIONES: EstadoIncidencia[] = ["Nuevas", "Cerradas", "Pendientes"];

const SidebarMantenimiento: React.FC<SidebarMantenimientoProps> = ({
  filtro,
  onFiltroChange,
}) => {
  const [incidenciasOpen, setIncidenciasOpen] = useState(true);
  const userName = localStorage.getItem("userName") ?? "Usuario";
  return (
    <div className="sidebar d-flex flex-column">
      {/* Logo */}
      <div className="sidebar-logo text-center py-3">
        <div className="logo-icon mb-1">
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
            <circle cx="12" cy="12" r="6" fill="white" opacity="0.9" />
            <circle cx="24" cy="12" r="6" fill="white" opacity="0.7" />
            <circle cx="12" cy="24" r="6" fill="white" opacity="0.7" />
            <circle cx="24" cy="24" r="6" fill="white" opacity="0.5" />
          </svg>
        </div>
        <div className="logo-text">
          <span className="logo-main">compensar</span>
          <div className="logo-sub">
            fundación
            <br />
            universitaria
          </div>
        </div>
      </div>

      <hr className="sidebar-divider" />

      {/* User */}
      <div className="sidebar-user px-3 pb-2">
        <div className="d-flex align-items-center gap-2">
          <span className="user-dot">●</span>
          <div>
            <div className="user-greeting">Bienvenido</div>
            <div className="user-name">{userName}</div>
          </div>
          <span className="ms-auto sidebar-menu-icon">☰</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="sidebar-nav px-2 flex-grow-1">
        <div className="nav-section-label px-2 mb-1">Dashboards</div>

        {/* Incidencias */}
        <div className="nav-item-wrapper">
          <div
            className="nav-item active"
            onClick={() => setIncidenciasOpen(!incidenciasOpen)}
          >
            <span className="nav-icon">⚑</span>
            <span>Incidencias</span>
            <span className="nav-arrow ms-auto">
              {incidenciasOpen ? "▾" : "▸"}
            </span>
          </div>
          {incidenciasOpen && (
            <div className="nav-subitems">
              {OPCIONES.map((op) => (
                <div
                  key={op}
                  className={`nav-subitem ${filtro === op ? "subitem-active" : ""}`}
                  onClick={() => onFiltroChange(op)}
                >
                  {op}
                </div>
              ))}
            </div>
          )}
        </div>
      </nav>

      {/* Footer */}
      <div className="sidebar-footer text-center py-3">
        <span className="footer-logo">uCompensar</span>
      </div>
    </div>
  );
};

export default SidebarMantenimiento;
