import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Sidebar.css";
import { type FilterOption } from "./FilterDropdown";

interface SidebarProps {
  filter?: FilterOption;
  onFilterChange?: (val: FilterOption) => void;
}

interface NavItemProps {
  label: string;
  icon?: string;
  children?: string[];
  active?: boolean;
  selectedChild?: string;
  onChildSelect?: (val: string) => void;
  onClick?: () => void;
}

const NavItem: React.FC<NavItemProps> = ({
  label,
  icon,
  children,
  active,
  selectedChild,
  onChildSelect,
  onClick,
}) => {
  const [open, setOpen] = useState(active || false);

  return (
    <div className="nav-item-wrapper">
      <div
        className={`nav-item ${active ? "active" : ""}`}
        onClick={() => {
          if (children) setOpen(!open);
          onClick?.();
        }}
      >
        {icon && <span className="nav-icon">{icon}</span>}
        <span>{label}</span>
        {children && (
          <span className="nav-arrow ms-auto">{open ? "▾" : "▸"}</span>
        )}
      </div>
      {children && open && (
        <div className="nav-subitems">
          {children.map((child) => (
            <div
              key={child}
              className={`nav-subitem ${child === selectedChild ? "subitem-active" : ""}`}
              onClick={() => onChildSelect?.(child)}
            >
              {child}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ filter, onFilterChange }) => {
  const navigate = useNavigate();

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
            <div className="user-name">(Hombre de usuario)</div>
          </div>
          <span className="ms-auto sidebar-menu-icon">☰</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="sidebar-nav px-2 flex-grow-1">
        <div className="nav-section-label px-2 mb-1">Dashboards</div>
        <NavItem
          label="Home"
          icon="🏠"
          onClick={() => navigate("/dashboard")}
        />
        <NavItem
          label="Incidencias"
          icon="⚑"
          active={true}
          children={["Activas", "Finalizadas", "Pendientes"]}
          selectedChild={filter}
          onChildSelect={(val) => onFilterChange?.(val as FilterOption)}
          onClick={() => navigate("/dashboard")}
        />
        <NavItem
          label="Usuários"
          icon="👥"
          onClick={() => navigate("/usuarios")}
        />
      </nav>

      {/* Footer */}
      <div className="sidebar-footer text-center py-3">
        <span className="footer-logo">uCompensar</span>
      </div>
    </div>
  );
};

export default Sidebar;
