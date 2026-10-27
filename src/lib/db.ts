import mysql from "mysql2/promise";

const g = globalThis as unknown as { pulsePool?: mysql.Pool };

export const db =
  g.pulsePool ??
  mysql.createPool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 5,
    charset: "utf8mb4",
  });

if (process.env.NODE_ENV !== "production") g.pulsePool = db;
