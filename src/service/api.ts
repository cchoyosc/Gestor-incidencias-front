import axios from "axios";

const API = axios.create({
  baseURL: "https://gestor-incidencias-back-production.up.railway.app",
});

export const getUsers = async () => {
  const res = await API.get("/usuarios");
  return res.data;
};

export const createUser = async (user: {
  nombre: string;
  contacto: string;
  rol_id: string;
}) => {
  const res = await API.post("/usuarios", user);
  return res.data;
};

export const updateUser = async (
  id: string,
  user: {
    nombre: string;
    contacto: string;
    rol_id: string;
  },
) => {
  const res = await API.put(`/usuarios/${id}`, user);
  return res.data;
};

export const deleteUser = async (id: string) => {
  await API.delete(`/usuarios/${id}`);
};
export const loginUser = async (email: string, password: string) => {
  const res = await API.post("/login", { email, password });
  return res.data;
};
export const createIncidencia = async (formData: FormData) => {
  const res = await API.post("/incidencias", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};
export const getIncidencias = async () => {
  const userId = localStorage.getItem("userId");
  const rol = localStorage.getItem("userRol");
  const res = await API.get("/incidencias", { params: { userId, rol } });
  return res.data;
};
export const ponerEnEspera = async (id: string) => {
  const userId = localStorage.getItem("userId");
  const res = await API.put(`/incidencias/${id}/espera`, { userId });
  return res.data;
};

export const resolverIncidencia = async (id: string) => {
  const res = await API.put(`/incidencias/${id}/resuelto`);
  return res.data;
};
