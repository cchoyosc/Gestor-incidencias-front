import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar";
import UserDetailModal from "./components/UserDetailModal";
import EditUserModal from "./components/EditUserModal";
import "./Dashboard.css";

export type UserRole = "admin" | "mantenimiento";

export interface User {
  id: number;
  nombre: string;
  identificacion: string;
  rol: UserRole;
}

const USERS: User[] = [
  {
    id: 1,
    nombre: "Carlos Mendoza",
    identificacion: "1023456789",
    rol: "admin",
  },
  {
    id: 2,
    nombre: "Laura Gómez",
    identificacion: "1045678901",
    rol: "mantenimiento",
  },
  {
    id: 3,
    nombre: "Andrés Torres",
    identificacion: "1067890123",
    rol: "mantenimiento",
  },
  {
    id: 4,
    nombre: "María Rodríguez",
    identificacion: "1089012345",
    rol: "admin",
  },
  {
    id: 5,
    nombre: "Juan Pérez",
    identificacion: "1001234567",
    rol: "mantenimiento",
  },
  {
    id: 6,
    nombre: "Sofía Herrera",
    identificacion: "1012345678",
    rol: "admin",
  },
];

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>(USERS);
  const [detailUser, setDetailUser] = useState<User | null>(null);
  const [editUser, setEditUser] = useState<User | null>(null);

  const handleDelete = (id: number) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  const handleSave = (updated: User) => {
    setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
    setEditUser(null);
  };

  return (
    <div className="dashboard-root d-flex">
      <Sidebar />
      <div className="dashboard-main d-flex flex-column">
        <TopBar />
        <div className="dashboard-content flex-grow-1 p-4">
          <div className="mb-4">
            <h2
              style={{
                fontSize: "1.3rem",
                fontWeight: 600,
                color: "#333",
                margin: 0,
              }}
            >
              Usuarios
            </h2>
          </div>

          <div className="tabla-wrapper">
            <table className="usuarios-tabla">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Identificación</th>
                  <th>Rol</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.nombre}</td>
                    <td>{user.identificacion}</td>
                    <td>
                      <span className={`rol-badge ${user.rol}`}>
                        {user.rol}
                      </span>
                    </td>
                    <td>
                      <div className="acciones">
                        <button
                          className="btn-accion ver"
                          onClick={() => setDetailUser(user)}
                        >
                          Ver
                        </button>
                        <button
                          className="btn-accion editar"
                          onClick={() => setEditUser(user)}
                        >
                          Editar
                        </button>
                        <button
                          className="btn-accion eliminar"
                          onClick={() => handleDelete(user.id)}
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {detailUser && (
        <UserDetailModal
          user={detailUser}
          onClose={() => setDetailUser(null)}
        />
      )}
      {editUser && (
        <EditUserModal
          user={editUser}
          onClose={() => setEditUser(null)}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default Users;
