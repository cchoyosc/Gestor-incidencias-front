import { useState } from "react";
import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar";
import UserDetailModal from "./components/UserDetailModal";
import EditUserModal from "./components/EditUserModal";
import CreateUserModal from "./components/CreateUserModal";
import "./Dashboard.css";
import { useUsers } from "./hooks/useUsers";

export type UserRole = "Admin" | "Mantenimiento";

export interface User {
  email: string;
  rol_id: string;
  id: number;
  nombre: string;
  contacto: string;
  rol: UserRole;
  password: string;
  activo: boolean;
}

const Users = () => {
  const { users, loading, removeUser, editUser, addUser } = useUsers();
  const [editUserData, setEditUserData] = useState<User | null>(null);
  const [detailUser, setDetailUser] = useState<User | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const activeUsers = users.filter((u) => u.activo === true);
  const [confirmUser, setConfirmUser] = useState<User | null>(null);
  if (loading) return <p>Cargando...</p>;

  const handleDelete = (id: number) => {
    removeUser(id);
  };

  const handleSave = (updated: User) => {
    editUser(updated);
    setEditUserData(null);
  };
  const handleCreate = async (user: any) => {
    const ok = await addUser(user);
    console.log("✅ ok recibido:", ok);
    return ok;
  };

  return (
    <div className="dashboard-root d-flex">
      <Sidebar />
      <div className="dashboard-main d-flex flex-column">
        <TopBar />
        <div className="dashboard-content flex-grow-1 p-4">
          <div className="mb-4 d-flex justify-content-between align-items-center">
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
            <button
              className="btn-accion editar"
              onClick={() => setShowCreateModal(true)}
            >
              + Crear usuario
            </button>
          </div>

          <div className="tabla-wrapper">
            <table className="usuarios-tabla">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Contacto</th>
                  <th>Email</th>
                  <th>Rol</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {activeUsers.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.nombre}</td>
                    <td>{user.contacto}</td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`rol-badge ${user.rol_id}`}>
                        {user.rol_id === "R1" ? "Admin" : "Mantenimiento"}
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
                          onClick={() => setEditUserData(user)}
                        >
                          Editar
                        </button>
                        <button
                          className="btn-accion eliminar"
                          onClick={() => setConfirmUser(user)}
                        >
                          Eliminar
                        </button>
                        {confirmUser && (
                          <div
                            className="modal-overlay"
                            onClick={() => setConfirmUser(null)}
                          >
                            <div
                              className="modal-card"
                              onClick={(e) => e.stopPropagation()}
                              style={{ maxWidth: 380 }}
                            >
                              <div className="modal-header">
                                <span className="modal-title">
                                  Confirmar eliminacion
                                </span>
                                <button
                                  className="modal-close"
                                  onClick={() => setConfirmUser(null)}
                                >
                                  ✕
                                </button>
                              </div>
                              <div className="modal-body">
                                <p style={{ margin: 0, color: "#333" }}>
                                  ¿Estás seguro que deseas{" "}
                                  <strong>{"ELIMINAR"}</strong> a{" "}
                                  <strong>{confirmUser.nombre}</strong>?
                                </p>
                              </div>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "flex-end",
                                  gap: 8,
                                  padding: "0 1.2rem 1.2rem",
                                }}
                              >
                                <button
                                  className="btn-accion ver"
                                  onClick={() => setConfirmUser(null)}
                                >
                                  Cancelar
                                </button>
                                <button
                                  className="btn-accion eliminar"
                                  onClick={() => {
                                    handleDelete(confirmUser.id);
                                    setConfirmUser(null);
                                  }}
                                >
                                  Confirmar
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
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

      {editUserData && (
        <EditUserModal
          user={editUserData}
          onClose={() => setEditUserData(null)}
          onSave={handleSave}
        />
      )}

      {showCreateModal && (
        <CreateUserModal
          onClose={() => setShowCreateModal(false)}
          onSave={handleCreate}
        />
      )}
    </div>
  );
};

export default Users;
