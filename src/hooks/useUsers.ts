import { useEffect, useState } from "react";
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../service/api";

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
    const newUser = await createUser(user);
    setUsers((prev) => [...prev, newUser]);
  };

  const editUser = async (user: any) => {
    const updated = await updateUser(user.id, user);
    setUsers((prev) =>
      prev.map((u) => (u.id === updated.id ? updated : u))
    );
  };

  const removeUser = async (id: number) => {
    await deleteUser(id);
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  return {
    users,
    loading,
    addUser,
    editUser,
    removeUser,
  };
};