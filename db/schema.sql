CREATE DATABASE IF NOT EXISTS pulse CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE pulse;

CREATE TABLE IF NOT EXISTS admin (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  nama VARCHAR(100) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS pengaduan (
  id INT AUTO_INCREMENT PRIMARY KEY,
  tracking_code CHAR(12) NOT NULL UNIQUE,
  nama VARCHAR(100) NOT NULL,
  angkatan SMALLINT NOT NULL,
  kategori ENUM('Akademik','Fasilitas','Organisasi','Keuangan','Lainnya') NOT NULL,
  judul VARCHAR(150) NOT NULL,
  isi TEXT NOT NULL,
  lampiran VARCHAR(255) NULL,
  status ENUM('Dikirim','Dibaca','Diproses','Selesai') NOT NULL DEFAULT 'Dikirim',
  tanggapan TEXT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_status (status),
  INDEX idx_kategori (kategori)
);

CREATE TABLE IF NOT EXISTS riwayat_status (
  id INT AUTO_INCREMENT PRIMARY KEY,
  pengaduan_id INT NOT NULL,
  status ENUM('Dikirim','Dibaca','Diproses','Selesai') NOT NULL,
  admin_id INT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (pengaduan_id) REFERENCES pengaduan(id) ON DELETE CASCADE,
  FOREIGN KEY (admin_id) REFERENCES admin(id)
);

CREATE TABLE IF NOT EXISTS rate_limit (
  id INT AUTO_INCREMENT PRIMARY KEY,
  kunci VARCHAR(100) NOT NULL,
  waktu DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_kunci_waktu (kunci, waktu)
);