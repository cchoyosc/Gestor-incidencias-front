import React, { useState } from "react";
import type { User, UserRole } from "../Users";
import "./UserDetailModal.css";

interface Props {
  user: User;
  onClose: () => void;
  onSave: (updated: User) => void;
}

const EditUserModal: React.FC<Props> = ({ user, onClose, onSave }) => {
  const [form, setForm] = useState<User>({ ...user });

  const handleChange = (field: keyof User, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-title">Editar usuario</span>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="modal-body">
          <div className="modal-field-col">
            <span className="modal-label">Nombre</span>
            <input
              className="modal-input"
              value={form.nombre}
              onChange={(e) => handleChange("nombre", e.target.value)}
            />
          </div>
          <div className="modal-field-col">
            <span className="modal-label">Identificación</span>
            <input
              className="modal-input"
              value={form.identificacion}
              onChange={(e) => handleChange("identificacion", e.target.value)}
            />
          </div>
          <div className="modal-field-col">
            <span className="modal-label">Rol</span>
            <select
              className="modal-input"
              value={form.rol}
              onChange={(e) => handleChange("rol", e.target.value as UserRole)}
            >
              <option value="admin">admin</option>
              <option value="mantenimiento">mantenimiento</option>
            </select>
          </div>
          <div className="modal-actions">
            <button className="btn-cancel" onClick={onClose}>
              Cancelar
            </button>
            <button className="btn-save" onClick={() => onSave(form)}>
              Guardar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditUserModal;
