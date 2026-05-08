import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import { loginUser } from "./service/api";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Por favor completa todos los campos.");
      return;
    }
    try {
      const { user } = await loginUser(email, password);
      localStorage.setItem("userName", user.nombre);
      localStorage.setItem("userRol", user.rol_id);
      localStorage.setItem("userId", user.id);

      if (user.rol_id === "R1") {
        navigate("/dashboard");
      } else if (user.rol_id === "R4") {
        navigate("/mantenimiento");
      } else {
        setError("Rol no reconocido.");
      }
    } catch {
      setError("Correo o contraseña incorrectos.");
    }
  };

  return (
    <div className="login-root">
      <div className="login-card">
        <div className="login-logo">
          <svg width="40" height="40" viewBox="0 0 36 36" fill="none">
            <circle cx="12" cy="12" r="6" fill="#e8540a" opacity="0.9" />
            <circle cx="24" cy="12" r="6" fill="#e8540a" opacity="0.7" />
            <circle cx="12" cy="24" r="6" fill="#e8540a" opacity="0.7" />
            <circle cx="24" cy="24" r="6" fill="#e8540a" opacity="0.5" />
          </svg>
          <div className="login-logo-text">
            <span className="login-logo-main">compensar</span>
            <span className="login-logo-sub">fundación universitaria</span>
          </div>
        </div>

        <h2 className="login-title">Iniciar sesión</h2>
        <p className="login-subtitle">
          Ingresa tus credenciales para continuar
        </p>

        <div className="login-field">
          <label className="login-label">Correo electrónico</label>
          <input
            className="login-input"
            type="email"
            placeholder="correo@ucompensar.edu.co"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError("");
            }}
          />
        </div>

        <div className="login-field">
          <label className="login-label">Contraseña</label>
          <input
            className="login-input"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError("");
            }}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          />
        </div>

        {error && <p className="login-error">{error}</p>}

        <button
          className="create-ins"
          onClick={() => navigate("/crear-incidencia")}
        >
          Crear incidencia
        </button>
        <button className="login-btn" onClick={handleLogin}>
          Ingresar
        </button>
      </div>
    </div>
  );
};

export default Login;
