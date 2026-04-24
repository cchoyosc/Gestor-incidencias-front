import { Pool } from "pg";

export const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "usuarios",
  password: "Aglea1006*",
  port: 5432,
});