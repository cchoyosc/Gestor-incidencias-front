import React from "react";
import type { User } from "../Users";
import "./UserDetailModal.css";

interface Props {
  user: User;
  onClose: () => void;
}

const UserDetailModal: React.FC<Props> = ({ user, onClose }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-title">Detalle de usuario</span>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="modal-body">
          <div className="modal-field">
            <span className="modal-label">ID</span>
            <span className="modal-value">{user.id}</span>
          </div>
          <div className="modal-field">
            <span className="modal-label">Nombre</span>
            <span className="modal-value">{user.nombre}</span>
          </div>
          <div className="modal-field">
            <span className="modal-label">Identificación</span>
            <span className="modal-value">{user.identificacion}</span>
          </div>
          <div className="modal-field">
            <span className="modal-label">Rol</span>
            <span className={`modal-badge ${user.rol}`}>{user.rol}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetailModal;
