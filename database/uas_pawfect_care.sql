-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Waktu pembuatan: 02 Jan 2026 pada 05.40
-- Versi server: 10.4.32-MariaDB
-- Versi PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

-- NOTE:
-- All data in this file is DUMMY / SEED DATA
-- No real user information is stored here

--
-- Database: `uas_pawfect_care`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `auth_user`
--

CREATE TABLE `auth_user` (
  `id_user` int(11) NOT NULL,
  `full_name` varchar(100) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `auth_user`
--

INSERT INTO `auth_user` (`id_user`, `full_name`, `phone`, `email`, `password`, `created_at`) VALUES
(2, 'Masako', '0800000000', 'masakobakso@example.com', '$2b$10$dummyhash', '2025-12-21 07:24:33'),
(3, 'Sama Aja', '0800000001', 'samaajalah@example.com', '$2b$10$dummyhash1', '2025-12-21 08:58:57'),
(4, 'Joko', '0800000002', 'joko@example.com', '$2b$10$dummyhash2', '2025-12-21 09:16:24'),
(5, 'coba aja', '0800000003', 'cobaja@example.com', '$2b$10$dummyhash3', '2025-12-21 09:18:37'),
(6, 'coba coba', '0800000004', 'cobaaja@example.com', '$2b$10$dummyhash4', '2025-12-23 00:44:35'),
(7, 'test 123', '0800000005', 'test2@example.com', '$2b$10$dummyhash5', '2025-12-23 01:10:52'),
(8, 'Testing1', '0800000006', 'testingnumber1@example.com', '$2b$10$dummyhash6', '2025-12-28 09:15:16'),
(9, 'testing2', '0800000007', 'testingnumber2@example.com', '$2b$10$dummyhash7', '2026-01-01 05:53:28'),
(10, 'testing3', '0800000008', 'testingnumber3@example.com', '$2b$10$dummyhash8', '2026-01-02 04:38:51');

-- --------------------------------------------------------

--
-- Struktur dari tabel `booking`
--

CREATE TABLE `booking` (
  `id_booking` int(11) NOT NULL,
  `id_user` int(11) NOT NULL,
  `owner_name` varchar(100) NOT NULL,
  `owner_phone` varchar(20) NOT NULL,
  `pet_name` varchar(100) NOT NULL,
  `date` date NOT NULL,
  `time` time NOT NULL,
  `notes` text DEFAULT NULL,
  `status` enum('not-started','on-going','done') DEFAULT 'not-started',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `booking`
--

INSERT INTO `booking` (`id_booking`, `id_user`, `owner_name`, `owner_phone`, `pet_name`, `date`, `time`, `notes`, `status`, `created_at`) VALUES
(1, 8, 'Testing1', '0800000006', 'asd', '2026-01-23', '09:00:00', 'asassaa', 'not-started', '2026-01-01 05:49:10');

-- --------------------------------------------------------

--
-- Struktur dari tabel `booking_services`
--

CREATE TABLE `booking_services` (
  `id` int(11) NOT NULL,
  `id_booking` int(11) NOT NULL,
  `id_service` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `booking_services`
--

INSERT INTO `booking_services` (`id`, `id_booking`, `id_service`) VALUES
(1, 1, 2),
(2, 1, 3);

-- --------------------------------------------------------

--
-- Struktur dari tabel `services`
--

CREATE TABLE `services` (
  `id_service` int(11) NOT NULL,
  `service_name` varchar(100) NOT NULL,
  `duration` int(11) NOT NULL,
  `service_price` int(11) NOT NULL,
  `description` text DEFAULT NULL,
  `long_desc` text DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `services`
--

INSERT INTO `services` (`id_service`, `service_name`, `duration`, `service_price`, `description`, `long_desc`, `image`) VALUES
(1, 'Basic Grooming', 45, 75000, 'Mandi, pengeringan, dan penyisiran ringan. Cocok untuk hewan dengan bulu pendek.', 'Layanan Basic Grooming kami dirancang khusus untuk hewan peliharaan dengan bulu pendek. Mencakup mandi menggunakan shampoo khusus yang aman, pengeringan dengan blow dryer suhu rendah, dan penyisiran untuk menghilangkan bulu mati.', 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400'),
(2, 'Full Grooming', 90, 150000, 'Termasuk potong kuku, pembersihan telinga, gunting bulu, dan parfum khusus.', 'Paket Full Grooming adalah layanan premium kami yang mencakup perawatan menyeluruh dari ujung hidung hingga ujung ekor.', 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400'),
(3, 'Flea Treatment', 60, 120000, 'Mandi dengan sampo anti-kutu dan perawatan kulit khusus.', 'Treatment khusus untuk mengatasi masalah kutu dan tungau pada hewan peliharaan Anda.', 'https://images.unsplash.com/photo-1615751072497-5f5169febe17?w=400'),
(4, 'Spa & Massage', 60, 130000, 'Relaksasi untuk hewan menggunakan aromaterapi dan pijatan lembut.', 'Manjakan hewan kesayangan Anda dengan spa treatment yang menenangkan.', 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400'),
(5, 'Paw & Nail Care', 30, 50000, 'Potong kuku, perawatan telapak kaki, dan lotion pelembab.', 'Perawatan khusus untuk cakar dan telapak kaki hewan peliharaan Anda.', 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400'),
(6, 'Fur Styling (Custom Cut)', 90, 180000, 'Potongan gaya sesuai permintaan pemilik.', 'Layanan styling premium dengan groomer ahli sesuai keinginan Anda.', 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=400'),
(7, 'Teeth Cleaning', 30, 60000, 'Pembersihan gigi dengan alat khusus untuk mencegah bau mulut.', 'Perawatan kesehatan gigi profesional untuk mencegah masalah dental.', 'https://images.unsplash.com/photo-1541599468348-e96984315921?w=400'),
(8, 'Cat Exclusive Grooming', 75, 140000, 'Grooming khusus kucing dengan sampo dan alat bebas stres.', 'Layanan grooming yang dirancang khusus untuk kucing dengan pendekatan stress-free.', 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400'),
(9, 'Puppy Starter Grooming', 45, 100000, 'Grooming lembut untuk anak anjing yang baru pertama kali.', 'Introduction to grooming untuk puppy dengan pendekatan extra gentle.', 'https://images.unsplash.com/photo-1477884213360-7e9d7dcc1e48?w=400');

-- --------------------------------------------------------

--
-- Struktur dari tabel `service_testimoni`
--

CREATE TABLE `service_testimoni` (
  `id_testimoni` int(11) NOT NULL,
  `id_service` int(11) NOT NULL,
  `user_name` varchar(100) DEFAULT NULL,
  `rating` tinyint(4) NOT NULL CHECK (`rating` between 1 and 5),
  `user_comment` text DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `service_testimoni`
--

INSERT INTO `service_testimoni` (`id_testimoni`, `id_service`, `user_name`, `rating`, `user_comment`, `created_at`) VALUES
(1, 1, 'Sarah Williams', 5, 'Anjing saya sangat bersih dan harum setelah grooming!', '2024-10-15 00:00:00'),
(2, 1, 'Michael Chen', 4, 'Hasil bagus, hanya saja perlu menunggu sedikit lebih lama.', '2024-10-10 00:00:00'),
(3, 1, 'Linda Martinez', 5, 'Perfect untuk anjing bulu pendek saya.', '2024-10-05 00:00:00'),
(4, 2, 'David Thompson', 5, 'Anjing saya terlihat seperti bintang!', '2024-10-20 00:00:00'),
(5, 2, 'Emma Rodriguez', 5, 'Best grooming service ever!', '2024-10-18 00:00:00'),
(6, 2, 'James Wilson', 4, 'Sedikit pricey tapi worth it.', '2024-10-12 00:00:00'),
(7, 3, 'Patricia Lee', 5, 'Kutu hilang total setelah treatment!', '2024-10-22 00:00:00'),
(8, 3, 'Robert Kim', 5, 'Sangat efektif dan edukatif.', '2024-10-16 00:00:00'),
(9, 3, 'Jessica Brown', 4, 'Aromanya agak kuat tapi efektif.', '2024-10-08 00:00:00'),
(10, 4, 'Amanda Foster', 5, 'Hewan saya jadi sangat rileks!', '2024-10-25 00:00:00'),
(11, 4, 'Daniel Park', 5, 'Anjing saya jadi kalem.', '2024-10-19 00:00:00'),
(12, 4, 'Sophia Garcia', 5, 'Worth every penny!', '2024-10-14 00:00:00'),
(13, 5, 'Christopher White', 4, 'Quick and professional service.', '2024-10-23 00:00:00'),
(14, 5, 'Michelle Taylor', 5, 'Perfect nail trim!', '2024-10-17 00:00:00'),
(15, 5, 'Kevin Anderson', 4, 'Harga affordable.', '2024-10-11 00:00:00'),
(16, 6, 'Nicole Johnson', 5, 'Looks like a celebrity!', '2024-10-24 00:00:00'),
(17, 6, 'Brandon Miller', 5, 'Custom cut sesuai request.', '2024-10-21 00:00:00'),
(18, 6, 'Rachel Davis', 4, 'Butuh waktu agak lama.', '2024-10-13 00:00:00'),
(19, 7, 'Steven Martinez', 5, 'No more bad breath!', '2024-10-26 00:00:00'),
(20, 7, 'Laura Hernandez', 4, 'Dog breath much better.', '2024-10-20 00:00:00'),
(21, 7, 'Gregory Moore', 5, 'Professional dan gentle.', '2024-10-15 00:00:00'),
(22, 8, 'Olivia Jackson', 5, 'No stress grooming!', '2024-10-27 00:00:00'),
(23, 8, 'Matthew Wilson', 5, 'Sangat gentle.', '2024-10-22 00:00:00'),
(24, 8, 'Isabella Thomas', 4, 'Bersih dan fluffy.', '2024-10-18 00:00:00'),
(25, 9, 'Jennifer Clark', 5, 'Perfect first grooming experience!', '2024-10-28 00:00:00'),
(26, 9, 'Andrew Lewis', 5, 'Sangat sabar dengan puppy.', '2024-10-24 00:00:00'),
(27, 9, 'Samantha Walker', 5, 'Positive experience!', '2024-10-19 00:00:00');

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `auth_user`
--
ALTER TABLE `auth_user`
  ADD PRIMARY KEY (`id_user`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indeks untuk tabel `booking`
--
ALTER TABLE `booking`
  ADD PRIMARY KEY (`id_booking`),
  ADD KEY `id_user` (`id_user`);

--
-- Indeks untuk tabel `booking_services`
--
ALTER TABLE `booking_services`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_booking_services_booking` (`id_booking`),
  ADD KEY `fk_booking_services_service` (`id_service`);

--
-- Indeks untuk tabel `services`
--
ALTER TABLE `services`
  ADD PRIMARY KEY (`id_service`);

--
-- Indeks untuk tabel `service_testimoni`
--
ALTER TABLE `service_testimoni`
  ADD PRIMARY KEY (`id_testimoni`),
  ADD KEY `id_service` (`id_service`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `auth_user`
--
ALTER TABLE `auth_user`
  MODIFY `id_user` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT untuk tabel `booking`
--
ALTER TABLE `booking`
  MODIFY `id_booking` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT untuk tabel `booking_services`
--
ALTER TABLE `booking_services`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT untuk tabel `services`
--
ALTER TABLE `services`
  MODIFY `id_service` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT untuk tabel `service_testimoni`
--
ALTER TABLE `service_testimoni`
  MODIFY `id_testimoni` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- Ketidakleluasaan untuk tabel pelimpahan (Dumped Tables)
--

--
-- Ketidakleluasaan untuk tabel `booking`
--
ALTER TABLE `booking`
  ADD CONSTRAINT `booking_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `auth_user` (`id_user`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `booking_services`
--
ALTER TABLE `booking_services`
  ADD CONSTRAINT `booking_services_ibfk_1` FOREIGN KEY (`id_booking`) REFERENCES `booking` (`id_booking`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_booking_services_booking` FOREIGN KEY (`id_booking`) REFERENCES `booking` (`id_booking`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_booking_services_service` FOREIGN KEY (`id_service`) REFERENCES `services` (`id_service`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `service_testimoni`
--
ALTER TABLE `service_testimoni`
  ADD CONSTRAINT `service_testimoni_ibfk_1` FOREIGN KEY (`id_service`) REFERENCES `services` (`id_service`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
