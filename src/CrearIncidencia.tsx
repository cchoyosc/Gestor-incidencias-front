import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./CrearIncidencia.css";
import { createIncidencia } from "./service/api";
const CrearIncidencia: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [imagen, setImagen] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [exito, setExito] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImagen(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setImagen(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleCrear = async () => {
    if (!titulo || !descripcion) return;
    try {
      const formData = new FormData();
      formData.append("titulo", titulo);
      formData.append("descripcion", descripcion);
      if (imagen) formData.append("imagen", imagen);

      await createIncidencia(formData);

      setExito(true);
      setTimeout(() => {
        setExito(false);
        navigate("/login");
      }, 2000);
    } catch {
      alert("Error al crear la incidencia");
    }
  };

  return (
    <div className="ci-root">
      {/* Toast notificación */}
      {exito && (
        <div className="ci-toast">✓ Incidencia creada correctamente</div>
      )}

      {/* Header */}
      <div className="ci-page-header">
        <h2 className="ci-page-title">Incidencias</h2>
      </div>

      {/* Card */}
      <div className="ci-card">
        {/* Fecha */}
        <div className="ci-fecha-row">
          <span className="ci-fecha-label">Fecha</span>
          <span className="ci-fecha-value">
            {new Date().toLocaleDateString("es-CO", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </span>
        </div>

        {/* Título */}
        <div className="ci-section ci-titulo-section">
          <input
            className="ci-titulo-input"
            type="text"
            placeholder="Título de la incidencia"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
          />
        </div>

        {/* Imagen */}
        <div
          className="ci-section ci-imagen-section"
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
        >
          {preview ? (
            <img src={preview} alt="preview" className="ci-imagen-preview" />
          ) : (
            <div className="ci-imagen-placeholder">
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#aaa"
                strokeWidth="1.5"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <path d="M21 15l-5-5L5 21" />
              </svg>
              <span className="ci-imagen-hint">
                Haz clic o arrastra una imagen aquí
              </span>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleImageChange}
          />
        </div>

        {/* Descripción */}
        <div className="ci-section ci-descripcion-section">
          <textarea
            className="ci-descripcion-input"
            placeholder="Describe la incidencia con el mayor detalle posible..."
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            rows={5}
          />
        </div>
      </div>

      {/* Botones */}
      <div className="ci-actions">
        <button className="ci-btn-cancelar" onClick={() => navigate("/login")}>
          Cancelar
        </button>
        <button
          className={`ci-btn-crear ${!titulo || !descripcion ? "disabled" : ""}`}
          onClick={handleCrear}
          disabled={!titulo || !descripcion}
        >
          Crear incidencia
        </button>
      </div>
    </div>
  );
};

export default CrearIncidencia;
