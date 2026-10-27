import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";

const { ADMIN_USERNAME, ADMIN_PASSWORD, ADMIN_NAMA } = process.env;
if (!ADMIN_USERNAME || !ADMIN_PASSWORD) {
  console.error("Isi ADMIN_USERNAME dan ADMIN_PASSWORD di .env.local dulu.");
  process.exit(1);
}
if (ADMIN_PASSWORD.length < 8) {
  console.error("ADMIN_PASSWORD minimal 8 karakter.");
  process.exit(1);
}

const hash = await bcrypt.hash(ADMIN_PASSWORD, 12);
const conn = await mysql.createConnection({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// username sudah ada = password dan nama diperbarui
await conn.execute(
  `INSERT INTO admin (username, password_hash, nama) VALUES (?, ?, ?)
   ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash), nama = VALUES(nama)`,
  [ADMIN_USERNAME, hash, ADMIN_NAMA || ADMIN_USERNAME]
);
console.log("Admin siap:", ADMIN_USERNAME);
await conn.end();