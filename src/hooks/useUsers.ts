import { useEffect, useState } from "react";
import { getUsers } from "../service/api";
import API from "../service/api";

export const useUsers = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const addUser = async (user: any) => {
    try {
      const res = await API.post("/usuarios", {
        nombre: user.nombre,
        contacto: user.contacto,
        email: user.email,
        rol: user.rol,
        password: user.password,
      });
      setUsers((prev) => [...prev, res.data]);
      return true;
    } catch (error) {
      console.error("ERROR BACKEND:", error);
      return false;
    }
  };

  const editUser = async (user: any) => {
    try {
      const res = await API.put(`/usuarios/${user.id}`, {
        nombre: user.nombre,
        contacto: user.contacto,
        email: user.email,
        rol: user.rol,
        password: user.password,
      });
      setUsers((prev) => prev.map((u) => (u.id === user.id ? res.data : u)));
    } catch (error) {
      console.error("ERROR BACKEND:", error);
    }
  };

  const removeUser = async (id: number) => {
    await API.put(`/usuarios/${id}/desactivar`);
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, activo: false } : u)),
    );
  };

  return {
    users,
    loading,
    addUser,
    editUser,
    removeUser,
  };
};
