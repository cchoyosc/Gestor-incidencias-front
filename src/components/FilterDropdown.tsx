import React, { useState, useRef, useEffect } from "react";
import "./FilterDropdown.css";

export type FilterOption = "Activas" | "Finalizadas" | "Pendientes";

interface FilterDropdownProps {
  selected: FilterOption;
  onChange: (option: FilterOption) => void;
}

const options: FilterOption[] = ["Activas", "Finalizadas", "Pendientes"];

const FilterDropdown: React.FC<FilterDropdownProps> = ({
  selected,
  onChange,
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="filter-dropdown" ref={ref}>
      <button className="filter-btn" onClick={() => setOpen(!open)}>
        Filtro <span className="filter-arrow">▾</span>
      </button>
      {open && (
        <div className="filter-menu shadow-sm">
          {options.map((opt) => (
            <div
              key={opt}
              className={`filter-option ${selected === opt ? "selected" : ""}`}
              onClick={() => {
                onChange(opt);
                setOpen(false);
              }}
            >
              <span className="filter-bullet">•</span> {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FilterDropdown;
