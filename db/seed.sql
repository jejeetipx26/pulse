-- Data contoh untuk tes panel admin. Hapus nanti kalau sudah live.
USE pulse;
INSERT INTO pengaduan (tracking_code, nama, angkatan, kategori, judul, isi) VALUES
('ASP-AB23CD45','Contoh Satu',2023,'Fasilitas','AC ruang kuliah B2 mati','AC di ruang B2 sudah mati dua minggu, ruangan panas saat kuliah siang.'),
('ASP-EF67GH89','Contoh Dua',2024,'Akademik','Jadwal praktikum bentrok','Jadwal praktikum keperawatan dasar bentrok dengan kuliah wajib hari Rabu.'),
('ASP-JK23LM45','Contoh Tiga',2022,'Organisasi','Info kegiatan terlambat','Info kegiatan himpunan sering diumumkan H-1 sehingga sulit menyesuaikan jadwal.'),
('ASP-NP67QR89','Contoh Empat',2025,'Keuangan','Pembayaran UKT','Mohon kejelasan jadwal dan mekanisme pembayaran UKT semester depan.'),
('ASP-ST23UV45','Contoh Lima',2023,'Lainnya','Saran kotak saran fisik','Usul menambah kotak saran fisik di lobi prodi.');
INSERT INTO riwayat_status (pengaduan_id, status) SELECT id, 'Dikirim' FROM pengaduan;