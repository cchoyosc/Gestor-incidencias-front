import express from "express";
import cors from "cors";
import { pool } from "./db";
import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import multer from "multer";

const upload = multer();
const app = express();
app.use(cors());
app.use(express.json());

const rolMap: Record<string, string> = {
  Admin: "R1",
  Mantenimiento: "R4",
};
// GET stats para pie chart
app.get("/incidencias/stats", async (_req: Request, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT
        COUNT(*) FILTER (WHERE estado = 'pendiente') AS pendiente,
        COUNT(*) FILTER (WHERE estado = 'en_proceso') AS en_proceso,
        COUNT(*) FILTER (WHERE estado = 'resuelto') AS resuelto,
        COUNT(*) AS total
      FROM incidencias
    `);
    res.json(result.rows[0]);
  } catch {
    res.status(500).json({ message: "Error al obtener stats" });
  }
});

// GET stats por personal de mantenimiento
app.get("/incidencias/personal", async (_req: Request, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT
        u.nombre,
        COUNT(*) FILTER (WHERE i.estado = 'en_proceso') AS en_proceso,
        COUNT(*) FILTER (WHERE i.estado = 'resuelto') AS resuelto
      FROM users u
      LEFT JOIN incidencias i ON i.asignado_id = u.id
      WHERE u.rol_id = 'R4' AND u.activo = true
      GROUP BY u.nombre
      ORDER BY u.nombre
    `);
    res.json(result.rows);
  } catch {
    res.status(500).json({ message: "Error al obtener personal" });
  }
});
// GET todas las incidencias
app.get("/incidencias", async (req: Request, res: Response) => {
  try {
    const { userId, rol } = req.query;
    let result;
    if (rol === "R4") {
      result = await pool.query(
        `SELECT * FROM incidencias WHERE asignado_id=$1 OR estado='pendiente' ORDER BY creado_en DESC`,
        [userId],
      );
    } else {
      result = await pool.query(
        "SELECT * FROM incidencias ORDER BY creado_en DESC",
      );
    }
    res.json(result.rows);
  } catch {
    res.status(500).json({ message: "Error al obtener incidencias" });
  }
});
// PUT en espera
app.put("/incidencias/:id/espera", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const result = await pool.query(
      `UPDATE incidencias SET estado='en_proceso', asignado_id=$1, actualizado_en=NOW() WHERE id=$2 RETURNING *`,
      [userId, id],
    );
    res.json(result.rows[0]);
  } catch {
    res.status(500).json({ message: "Error al actualizar incidencia" });
  }
});

// PUT resuelto
app.put("/incidencias/:id/resuelto", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `UPDATE incidencias SET estado='resuelto', actualizado_en=NOW(), fecha_cierre=NOW() WHERE id=$1 RETURNING *`,
      [id],
    );
    res.json(result.rows[0]);
  } catch {
    res.status(500).json({ message: "Error al actualizar incidencia" });
  }
});
//POST incidencias
app.post(
  "/incidencias",
  upload.single("imagen"),
  async (req: Request, res: Response) => {
    try {
      const { titulo, descripcion } = req.body;
      const imagen = req.file?.buffer ?? null;

      const result = await pool.query(
        `INSERT INTO incidencias (titulo, descripcion, estado, foto, creado_en)
   VALUES ($1, $2, 'pendiente', $3, NOW())
   RETURNING *`,
        [titulo, descripcion, imagen],
      );
      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error("❌ Error POST /incidencias:", error);
      res
        .status(500)
        .json({ message: "Error al crear incidencia", detail: String(error) });
    }
  },
);
// GET todos usuarios
app.get("/usuarios", async (_req: Request, res: Response) => {
  try {
    const result = await pool.query("SELECT * FROM users ORDER BY id");
    res.json(result.rows);
  } catch {
    res.status(500).json({ message: "Error al obtener usuarios" });
  }
});

// GET usuarios por ID
app.get("/usuarios/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
    if (result.rows.length === 0) {
      res.status(404).json({ message: "Usuario no encontrado" });
      return;
    }
    res.json(result.rows[0]);
  } catch {
    res.status(500).json({ message: "Error al obtener usuario" });
  }
});

// POST crear
app.post("/usuarios", async (req: Request, res: Response) => {
  try {
    const { nombre, contacto, email, rol, password } = req.body;
    const rol_id = rolMap[rol];

    if (!rol_id) {
      res.status(400).json({ message: "Rol inválido" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10); // 👈

    const result = await pool.query(
      `INSERT INTO users (nombre, contacto, email, rol_id, password)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [nombre, contacto, email, rol_id, hashedPassword], // 👈
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("❌ Error POST:", error);
    res
      .status(500)
      .json({ message: "Error al crear usuario", detail: String(error) });
  }
});

// PUT actualizar
app.put("/usuarios/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { nombre, contacto, email, rol } = req.body;
    console.log("📦 Body recibido:", req.body);
    const rol_id = rolMap[rol];

    if (!rol_id) {
      res.status(400).json({ message: "Rol inválido" });
      return;
    }

    const result = await pool.query(
      `UPDATE users SET nombre=$1, contacto=$2, email=$3, rol_id=$4 WHERE id=$5 RETURNING *`,
      [nombre, contacto, email, rol_id, id],
    );
    if (result.rows.length === 0) {
      res.status(404).json({ message: "Usuario no encontrado" });
      return;
    }
    res.json(result.rows[0]);
  } catch {
    res.status(500).json({ message: "Error al actualizar usuario" });
  }
  console.log("📦 Body PUT recibido:", req.body);
});

// DELETE eliminar
app.put("/usuarios/:id/desactivar", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `UPDATE users SET activo=false WHERE id=$1 RETURNING *`,
      [id],
    );
    if (result.rows.length === 0) {
      res.status(404).json({ message: "Usuario no encontrado" });
      return;
    }
    res.json(result.rows[0]);
  } catch {
    res.status(500).json({ message: "Error al desactivar usuario" });
  }
});

(async () => {
  try {
    await pool.query("SELECT 1");
    console.log("✅ Base de datos conectada");
    app.listen(3000, () => {
      console.log("🚀 API en http://localhost:3000");
    });
  } catch (error) {
    console.error("❌ Error conectando a la base de datos", error);
  }
})();
// POST login
app.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const result = await pool.query(
      `SELECT * FROM users WHERE email=$1 AND activo=true`,
      [email],
    );

    if (result.rows.length === 0) {
      res.status(401).json({ message: "Credenciales incorrectas" });
      return;
    }

    const user = result.rows[0];
    const match = await bcrypt.compare(password, user.password); // 👈

    if (!match) {
      res.status(401).json({ message: "Credenciales incorrectas" });
      return;
    }

    res.json({ user });
  } catch {
    res.status(500).json({ message: "Error al iniciar sesión" });
  }
});
app.put("/incidencias/:id/espera", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const result = await pool.query(
      `UPDATE incidencias SET estado='en_proceso', asignado_id=$1 WHERE id=$2 RETURNING *`,
      [userId, id],
    );
    res.json(result.rows[0]);
  } catch {
    res.status(500).json({ message: "Error al actualizar incidencia" });
  }
});
