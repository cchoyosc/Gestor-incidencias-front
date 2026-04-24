import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000",
});

// GET
export const getUsers = async () => {
  const res = await API.get("/usuarios");
  return res.data;
};

// POST
export const createUser = async (user: {
  nombre: string;
  identificacion: string;
  rol: string;
}) => {
  const res = await API.post("/usuarios", user);
  return res.data;
};

// PUT
export const updateUser = async (id: number, user: any) => {
  const res = await API.put(`/usuarios/${id}`, user);
  return res.data;
};

// DELETE
export const deleteUser = async (id: number) => {
  await API.delete(`/usuarios/${id}`);
};
