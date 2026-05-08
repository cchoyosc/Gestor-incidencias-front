import React, { useState, useEffect } from "react";
import SidebarMantenimiento from "./components/SidebarMantenimiento";
import type { EstadoIncidencia } from "./components/SidebarMantenimiento";
import TopBar from "./components/TopBar";
import "./IncidenciasMantenimiento.css";
import {
  getIncidencias,
  ponerEnEspera,
  resolverIncidencia,
} from "./service/api";

export interface Incidencia {
  id: string;
  titulo: string;
  descripcion: string;
  estado: string;
  foto?: any;
  creado_en: string;
  asignado_id?: string;
}
const estadoMap: Record<EstadoIncidencia, string> = {
  Nuevas: "pendiente",
  Cerradas: "resuelto",
  Pendientes: "en_proceso",
};

const IncidenciasMantenimiento: React.FC = () => {
  const [filtro, setFiltro] = useState<EstadoIncidencia>("Nuevas");
  const [incidencias, setIncidencias] = useState<Incidencia[]>([]);
  const [loading, setLoading] = useState(true);
  const [seleccionadas, setSeleccionadas] = useState<string[]>([]);
  const [detalle, setDetalle] = useState<Incidencia | null>(null);

  useEffect(() => {
    getIncidencias()
      .then((data) => {
        console.log("📦 Incidencias:", data); // 👈
        setIncidencias(data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtradas = incidencias.filter((i) => i.estado === estadoMap[filtro]);

  const toggleTodas = () => {
    if (seleccionadas.length === filtradas.length) {
      setSeleccionadas([]);
    } else {
      setSeleccionadas(filtradas.map((i) => i.id));
    }
  };

  const toggleUna = (id: string) => {
    setSeleccionadas((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const todasSeleccionadas =
    filtradas.length > 0 && seleccionadas.length === filtradas.length;

  const getFotoSrc = (foto: any) => {
    if (!foto) return null;
    if (typeof foto === "string") return foto;
    if (foto?.data) {
      const bytes = new Uint8Array(foto.data);
      const binary = bytes.reduce((acc, b) => acc + String.fromCharCode(b), "");
      return `data:image/jpeg;base64,${btoa(binary)}`;
    }
    return null;
  };

  return (
    <div className="dashboard-root d-flex">
      <SidebarMantenimiento
        filtro={filtro}
        onFiltroChange={(f) => {
          setFiltro(f);
          setSeleccionadas([]);
          setDetalle(null);
        }}
      />
      <div className="dashboard-main d-flex flex-column">
        <TopBar />
        <div className="dashboard-content flex-grow-1 p-4">
          <div className="im-breadcrumb mb-3">
            <span>Incidencias</span>
            <span className="im-breadcrumb-sep">/</span>
            <span className="im-breadcrumb-active">Gestión de Incidencias</span>
          </div>

          <div className="im-filtro-titulo mb-3">
            <span>{filtro.toUpperCase()}</span>
          </div>

          {loading ? (
            <p>Cargando...</p>
          ) : (
            <div className="im-tabla-wrapper">
              <table className="im-tabla">
                <thead>
                  <tr>
                    <th>
                      <input
                        type="checkbox"
                        checked={todasSeleccionadas}
                        onChange={toggleTodas}
                        className="im-checkbox"
                      />
                    </th>
                    <th>Fecha</th>
                    <th>ID</th>
                    <th>Título</th>
                    <th>Descripción</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {filtradas.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="im-empty">
                        No hay incidencias {filtro.toLowerCase()}.
                      </td>
                    </tr>
                  ) : (
                    filtradas.map((inc) => (
                      <tr
                        key={inc.id}
                        className={
                          seleccionadas.includes(inc.id)
                            ? "im-fila-seleccionada"
                            : ""
                        }
                      >
                        <td>
                          <input
                            type="checkbox"
                            checked={seleccionadas.includes(inc.id)}
                            onChange={() => toggleUna(inc.id)}
                            className="im-checkbox"
                          />
                        </td>
                        <td>
                          {new Date(inc.creado_en).toLocaleDateString("es-CO")}
                        </td>
                        <td>{inc.id}</td>
                        <td>{inc.titulo}</td>
                        <td>{inc.descripcion}</td>
                        <td>
                          <button
                            className="im-btn-ver"
                            onClick={() =>
                              setDetalle(detalle?.id === inc.id ? null : inc)
                            }
                          >
                            {detalle?.id === inc.id ? "Cerrar" : "Ver detalle"}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {detalle && (
            <div className="im-detalle-panel">
              <div className="im-detalle-body">
                <div className="im-detalle-izq">
                  <span className="im-detalle-label">Imagen / Pruebas</span>
                  <div className="im-detalle-imagen">
                    {getFotoSrc(detalle.foto) ? (
                      <img src={getFotoSrc(detalle.foto)!} alt="evidencia" />
                    ) : (
                      <div className="im-detalle-imagen-placeholder">
                        <svg
                          width="48"
                          height="48"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#bbb"
                          strokeWidth="1.2"
                        >
                          <rect x="3" y="3" width="18" height="18" rx="2" />
                          <line x1="3" y1="3" x2="21" y2="21" />
                          <line x1="21" y1="3" x2="3" y2="21" />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
                <div className="im-detalle-der">
                  <span className="im-detalle-label">Descripción</span>
                  <p className="im-detalle-descripcion">
                    {detalle.descripcion}
                  </p>
                </div>
              </div>
              <div className="im-detalle-acciones">
                {detalle.estado !== "resuelto" && (
                  <>
                    <button
                      className="im-btn-espera"
                      onClick={async () => {
                        await ponerEnEspera(detalle.id);
                        setIncidencias((prev) =>
                          prev.map((i) =>
                            i.id === detalle.id
                              ? {
                                  ...i,
                                  estado: "en_proceso",
                                  asignado_id:
                                    localStorage.getItem("userId") ?? "",
                                }
                              : i,
                          ),
                        );
                        setDetalle(null);
                      }}
                    >
                      En espera
                    </button>
                    <button
                      className="im-btn-cerrar"
                      onClick={async () => {
                        await resolverIncidencia(detalle.id);
                        setIncidencias((prev) =>
                          prev.map((i) =>
                            i.id === detalle.id
                              ? { ...i, estado: "resuelto" }
                              : i,
                          ),
                        );
                        setDetalle(null);
                      }}
                    >
                      RESUELTO
                    </button>
                  </>
                )}
              </div>
            </div>
          )}

          {seleccionadas.length > 0 && (
            <div className="im-acciones-barra">
              <span>{seleccionadas.length} seleccionada(s)</span>
              <button
                className="im-btn-accion"
                onClick={() => setSeleccionadas([])}
              >
                Limpiar selección
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IncidenciasMantenimiento;
