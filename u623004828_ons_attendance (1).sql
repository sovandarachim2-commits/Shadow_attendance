-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Jun 27, 2026 at 06:53 AM
-- Server version: 11.8.8-MariaDB-log
-- PHP Version: 7.2.34

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+07:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `u623004828_ons_attendance`
--

-- --------------------------------------------------------

--
-- Table structure for table `attendance`
--

CREATE TABLE `attendance` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `employee_id` bigint(20) UNSIGNED NOT NULL,
  `branch_id` bigint(20) UNSIGNED DEFAULT NULL,
  `attendance_date` date NOT NULL,
  `type` varchar(255) NOT NULL DEFAULT 'office',
  `status` varchar(255) NOT NULL DEFAULT 'present',
  `check_in_at` timestamp NULL DEFAULT NULL,
  `check_out_at` timestamp NULL DEFAULT NULL,
  `check_in_latitude` decimal(10,7) DEFAULT NULL,
  `check_in_longitude` decimal(10,7) DEFAULT NULL,
  `check_in_address` text DEFAULT NULL,
  `check_out_latitude` decimal(10,7) DEFAULT NULL,
  `check_out_longitude` decimal(10,7) DEFAULT NULL,
  `check_out_address` text DEFAULT NULL,
  `check_in_photo_path` varchar(255) DEFAULT NULL,
  `check_out_photo_path` varchar(255) DEFAULT NULL,
  `qr_code` varchar(255) DEFAULT NULL,
  `late_minutes` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `deduction_amount` decimal(10,2) DEFAULT NULL,
  `deduction_reason` varchar(200) DEFAULT NULL,
  `work_minutes` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `notes` text DEFAULT NULL,
  `offline_sync_uuid` char(36) DEFAULT NULL,
  `synced_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `attendance`
--

INSERT INTO `attendance` (`id`, `employee_id`, `branch_id`, `attendance_date`, `type`, `status`, `check_in_at`, `check_out_at`, `check_in_latitude`, `check_in_longitude`, `check_in_address`, `check_out_latitude`, `check_out_longitude`, `check_out_address`, `check_in_photo_path`, `check_out_photo_path`, `qr_code`, `late_minutes`, `deduction_amount`, `deduction_reason`, `work_minutes`, `notes`, `offline_sync_uuid`, `synced_at`, `created_at`, `updated_at`) VALUES
(1, 1, NULL, '2026-05-18', 'office', 'late', '2026-05-18 20:38:32', '2026-05-18 21:48:30', 11.6483830, 104.9074592, NULL, 11.6192375, 104.8874152, 'Sangkat Kilomaetr Lekh Prammuoy, Phnom Penh', NULL, NULL, NULL, 744, NULL, 'Late > 60 Minutes (Half Day)', 70, 'Submitted from web attendance.', NULL, '2026-05-18 20:38:32', '2026-05-18 20:38:32', '2026-05-18 21:48:30'),
(2, 4, NULL, '2026-05-20', 'office', 'late', '2026-05-20 13:07:00', '2026-05-20 17:32:00', 11.6484283, 104.9074720, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 293, NULL, 'Late > 60 Minutes (Half Day)', 265, 'Submitted from web attendance.', NULL, '2026-05-20 13:07:13', '2026-05-20 13:07:13', '2026-05-21 21:32:59'),
(3, 14, NULL, '2026-05-20', 'office', 'late', '2026-05-20 13:22:56', '2026-05-20 17:36:24', 11.6483751, 104.9074687, NULL, 11.6483750, 104.9074689, 'Sangkat Prek Liep, Phnom Penh', NULL, NULL, NULL, 308, NULL, 'Late > 60 Minutes (Half Day)', 253, 'Submitted from web attendance.', NULL, '2026-05-20 13:22:56', '2026-05-20 13:22:56', '2026-05-20 17:36:24'),
(4, 3, NULL, '2026-05-20', 'office', 'late', '2026-05-20 13:23:07', '2026-05-20 17:19:54', 11.6483865, 104.9074603, NULL, 11.6483996, 104.9074654, NULL, NULL, NULL, NULL, 309, NULL, 'Late > 60 Minutes (Half Day)', 237, 'Submitted from web attendance.', NULL, '2026-05-20 13:23:07', '2026-05-20 13:23:07', '2026-05-20 17:19:54'),
(5, 5, NULL, '2026-05-20', 'office', 'late', '2026-05-20 13:23:18', '2026-05-20 17:06:54', 11.6484188, 104.9074630, NULL, 11.6484188, 104.9074630, NULL, NULL, NULL, NULL, 309, NULL, 'Late > 60 Minutes (Half Day)', 224, 'Submitted from web attendance.', NULL, '2026-05-20 13:23:18', '2026-05-20 13:23:18', '2026-05-20 17:06:54'),
(6, 6, NULL, '2026-05-20', 'office', 'late', '2026-05-20 13:23:24', '2026-05-20 17:05:46', 11.6483776, 104.9074761, NULL, 11.6483899, 104.9074452, 'Sangkat Prek Liep, Phnom Penh', NULL, NULL, NULL, 309, NULL, 'Late > 60 Minutes (Half Day)', 222, 'Submitted from web attendance.', NULL, '2026-05-20 13:23:24', '2026-05-20 13:23:24', '2026-05-20 17:05:46'),
(7, 8, NULL, '2026-05-20', 'office', 'late', '2026-05-20 13:23:36', '2026-05-20 17:08:39', 11.6484185, 104.9074416, 'Sangkat Prek Liep, Phnom Penh', 11.6484135, 104.9074419, 'Sangkat Prek Liep, Phnom Penh', NULL, NULL, NULL, 309, NULL, 'Late > 60 Minutes (Half Day)', 225, 'Submitted from web attendance.', NULL, '2026-05-20 13:23:36', '2026-05-20 13:23:36', '2026-05-20 17:08:39'),
(8, 16, NULL, '2026-05-20', 'office', 'late', '2026-05-20 13:23:41', '2026-05-20 17:08:51', 11.6484166, 104.9074617, 'Sangkat Prek Liep, Phnom Penh', 11.6484173, 104.9074600, 'Sangkat Prek Liep, Phnom Penh', NULL, NULL, NULL, 309, NULL, 'Late > 60 Minutes (Half Day)', 225, 'Submitted from web attendance.', NULL, '2026-05-20 13:23:41', '2026-05-20 13:23:41', '2026-05-20 17:08:51'),
(9, 9, NULL, '2026-05-20', 'office', 'late', '2026-05-20 13:23:48', '2026-05-20 19:47:32', 11.6483764, 104.9075036, 'Sangkat Prek Liep, Phnom Penh', 11.6483567, 104.9074349, 'Sangkat Prek Liep, Phnom Penh', NULL, NULL, NULL, 309, NULL, 'Late > 60 Minutes (Half Day)', 384, 'Submitted from web attendance.', NULL, '2026-05-20 13:23:48', '2026-05-20 13:23:48', '2026-05-20 19:47:32'),
(10, 12, NULL, '2026-05-20', 'office', 'late', '2026-05-20 13:24:49', '2026-05-20 20:00:18', 11.6482756, 104.9075084, NULL, 11.6482756, 104.9075084, NULL, NULL, NULL, NULL, 310, NULL, 'Late > 60 Minutes (Half Day)', 395, 'Submitted from web attendance.', NULL, '2026-05-20 13:24:49', '2026-05-20 13:24:49', '2026-05-20 20:00:18'),
(11, 10, NULL, '2026-05-20', 'office', 'late', '2026-05-20 14:36:51', '2026-05-20 20:00:48', 11.6483593, 104.9074466, 'Sangkat Prek Liep, Phnom Penh', 11.6483764, 104.9074491, 'Sangkat Prek Liep, Phnom Penh', NULL, NULL, NULL, 382, NULL, 'Late > 60 Minutes (Half Day)', 324, 'Submitted from web attendance.', NULL, '2026-05-20 14:36:51', '2026-05-20 14:36:51', '2026-05-20 20:00:48'),
(12, 13, NULL, '2026-05-20', 'office', 'late', '2026-05-20 14:39:06', '2026-05-20 19:55:43', 11.6482851, 104.9074741, NULL, 11.6484077, 104.9074732, 'Sangkat Prek Liep, Phnom Penh', NULL, NULL, NULL, 385, NULL, 'Late > 60 Minutes (Half Day)', 317, 'Submitted from web attendance.', NULL, '2026-05-20 14:39:06', '2026-05-20 14:39:06', '2026-05-20 19:55:43'),
(13, 16, NULL, '2026-05-21', 'office', 'present', '2026-05-21 07:58:53', '2026-05-21 17:08:06', 11.6484331, 104.9074705, NULL, 11.6483985, 104.9074618, NULL, NULL, NULL, NULL, 0, NULL, NULL, 549, 'Submitted from web attendance.', NULL, '2026-05-21 07:58:53', '2026-05-21 07:58:53', '2026-05-21 17:08:06'),
(14, 14, NULL, '2026-05-21', 'office', 'present', '2026-05-21 08:13:57', '2026-05-21 17:22:29', 11.6484172, 104.9075014, NULL, 11.6484173, 104.9075001, NULL, NULL, NULL, NULL, 0, NULL, NULL, 549, 'Submitted from web attendance.', NULL, '2026-05-21 08:13:57', '2026-05-21 08:13:57', '2026-05-21 17:22:29'),
(15, 9, NULL, '2026-05-21', 'office', 'late', '2026-05-21 08:16:55', '2026-05-21 18:50:55', 11.6485486, 104.9075078, 'Sangkat Prek Liep, Phnom Penh', 11.6485350, 104.9074730, 'Sangkat Prek Liep, Phnom Penh', NULL, NULL, NULL, 2, 0.00, 'Late 1–15 Minutes', 634, 'Submitted from web attendance.', NULL, '2026-05-21 08:16:55', '2026-05-21 08:16:55', '2026-05-21 18:50:55'),
(16, 8, NULL, '2026-05-21', 'office', 'late', '2026-05-21 08:21:18', '2026-05-21 17:48:15', 11.6484220, 104.9074394, NULL, 11.6484230, 104.9074446, NULL, NULL, NULL, NULL, 7, 0.00, 'Late 1–15 Minutes', 567, 'Submitted from web attendance.', NULL, '2026-05-21 08:21:18', '2026-05-21 08:21:18', '2026-05-21 17:48:15'),
(17, 10, NULL, '2026-05-21', 'office', 'late', '2026-05-21 08:37:11', '2026-05-21 17:47:16', 11.6484133, 104.9074670, NULL, 11.6483928, 104.9074390, 'Sangkat Prek Liep, Phnom Penh', NULL, NULL, NULL, 23, NULL, NULL, 550, 'Submitted from web attendance.', NULL, '2026-05-21 08:37:11', '2026-05-21 08:37:11', '2026-05-21 17:47:16'),
(18, 6, NULL, '2026-05-21', 'office', 'present', '2026-05-21 08:53:11', '2026-05-21 17:04:07', 11.6484078, 104.9075211, NULL, 11.6483776, 104.9074761, NULL, NULL, NULL, NULL, 0, NULL, NULL, 491, 'Submitted from web attendance.', NULL, '2026-05-21 08:53:11', '2026-05-21 08:53:11', '2026-05-21 17:04:07'),
(19, 13, NULL, '2026-05-21', 'office', 'present', '2026-05-21 08:55:36', '2026-05-21 18:53:01', 11.6484515, 104.9074319, 'Sangkat Prek Liep, Phnom Penh', 11.6484385, 104.9074764, NULL, NULL, NULL, NULL, 0, NULL, NULL, 597, 'Submitted from web attendance.', NULL, '2026-05-21 08:55:36', '2026-05-21 08:55:36', '2026-05-21 18:53:01'),
(20, 3, NULL, '2026-05-21', 'office', 'present', '2026-05-21 08:59:37', '2026-05-21 17:18:43', 11.6483879, 104.9074596, NULL, 11.6483695, 104.9074530, 'Sangkat Prek Liep, Phnom Penh', NULL, NULL, NULL, 0, NULL, NULL, 499, 'Submitted from web attendance.', NULL, '2026-05-21 08:59:37', '2026-05-21 08:59:37', '2026-05-21 17:18:43'),
(21, 12, NULL, '2026-05-21', 'office', 'late', '2026-05-21 09:04:06', '2026-05-21 18:47:29', 11.6482756, 104.9075084, NULL, 11.6482756, 104.9075084, 'Sangkat Prek Liep, Phnom Penh', NULL, NULL, NULL, 5, 0.00, 'Late 1–15 Minutes', 583, 'Submitted from web attendance.', NULL, '2026-05-21 09:04:06', '2026-05-21 09:04:06', '2026-05-21 18:47:29'),
(22, 5, NULL, '2026-05-21', 'office', 'late', '2026-05-21 09:04:32', '2026-05-21 17:18:08', 11.6483949, 104.9074630, NULL, 11.6484188, 104.9074630, NULL, NULL, NULL, NULL, 5, 0.00, 'Late 1–15 Minutes', 494, 'Submitted from web attendance.', NULL, '2026-05-21 09:04:32', '2026-05-21 09:04:32', '2026-05-21 17:18:08'),
(23, 15, NULL, '2026-05-21', 'office', 'late', '2026-05-21 09:05:30', '2026-05-21 17:24:13', 11.6483402, 104.9074307, 'Sangkat Prek Liep, Phnom Penh', 11.6483412, 104.9074324, 'Sangkat Prek Liep, Phnom Penh', NULL, NULL, NULL, 6, 0.00, 'Late 1–15 Minutes', 499, 'Submitted from web attendance.', NULL, '2026-05-21 09:05:30', '2026-05-21 09:05:30', '2026-05-21 17:24:13'),
(24, 4, NULL, '2026-05-21', 'office', 'late', '2026-05-21 11:21:59', '2026-05-21 17:37:01', 11.6483799, 104.9074516, NULL, 11.6483757, 104.9073735, NULL, NULL, NULL, NULL, 202, 3.00, 'Late 2hours', 375, 'Submitted from web attendance.', NULL, '2026-05-21 11:21:59', '2026-05-21 11:21:59', '2026-05-21 17:37:01'),
(25, 16, 1, '2026-05-22', 'office', 'present', '2026-05-22 08:03:21', '2026-05-22 17:07:18', 11.6484133, 104.9074521, '11.648413, 104.907452', 11.6483979, 104.9074617, '11.648398, 104.907462', NULL, NULL, NULL, 0, NULL, NULL, 544, 'Submitted from web attendance.', NULL, '2026-05-22 08:03:21', '2026-05-22 08:03:21', '2026-05-22 17:07:18'),
(26, 8, 1, '2026-05-22', 'office', 'present', '2026-05-22 08:14:48', '2026-05-22 17:22:10', 11.6484185, 104.9074293, '11.648418, 104.907429', 11.6484212, 104.9074271, '11.648421, 104.907427', NULL, NULL, NULL, 0, NULL, NULL, 547, 'Submitted from web attendance.', NULL, '2026-05-22 08:14:48', '2026-05-22 08:14:48', '2026-05-22 17:22:10'),
(27, 14, 1, '2026-05-22', 'office', 'present', '2026-05-22 08:17:46', '2026-05-22 17:33:43', 11.6483726, 104.9074740, '11.648373, 104.907474', 11.6483733, 104.9074756, '11.648373, 104.907476', NULL, NULL, NULL, 0, NULL, NULL, 556, 'Submitted from web attendance.', NULL, '2026-05-22 08:17:46', '2026-05-22 08:17:46', '2026-05-22 17:33:43'),
(28, 9, 1, '2026-05-22', 'office', 'present', '2026-05-22 08:19:33', '2026-05-22 18:14:33', 11.6485350, 104.9074730, '11.648535, 104.907473', 11.6485350, 104.9074729, '11.648535, 104.907473', NULL, NULL, NULL, 0, NULL, NULL, 595, 'Submitted from web attendance.', NULL, '2026-05-22 08:19:33', '2026-05-22 08:19:33', '2026-05-22 18:14:33'),
(29, 10, 1, '2026-05-22', 'office', 'present', '2026-05-22 08:27:43', NULL, 11.6483577, 104.9074781, 'Sangkat Prek Liep, Phnom Penh', NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, 0, 'Submitted from web attendance.', NULL, '2026-05-22 08:27:43', '2026-05-22 08:27:43', '2026-05-22 08:27:43'),
(30, 6, 1, '2026-05-22', 'office', 'present', '2026-05-22 08:47:52', '2026-05-22 17:02:02', 11.6483776, 104.9074761, '11.648378, 104.907476', 11.6483908, 104.9074385, 'Sangkat Prek Liep, Phnom Penh', NULL, NULL, NULL, 0, NULL, NULL, 494, 'Submitted from web attendance.', NULL, '2026-05-22 08:47:52', '2026-05-22 08:47:52', '2026-05-22 17:02:02'),
(31, 15, 1, '2026-05-22', 'office', 'present', '2026-05-22 08:50:34', '2026-05-22 17:33:14', 11.6483413, 104.9074324, 'Sangkat Prek Liep, Phnom Penh', 11.6483397, 104.9074355, NULL, NULL, NULL, NULL, 0, NULL, NULL, 523, 'Submitted from web attendance.', NULL, '2026-05-22 08:50:34', '2026-05-22 08:50:34', '2026-05-22 17:33:14'),
(32, 5, 1, '2026-05-22', 'office', 'present', '2026-05-22 08:55:44', '2026-05-22 17:02:36', 11.6484545, 104.9074644, 'Sangkat Prek Liep, Phnom Penh', 11.6484155, 104.9074631, '11.648415, 104.907463', NULL, NULL, NULL, 0, NULL, NULL, 487, 'Submitted from web attendance.', NULL, '2026-05-22 08:55:44', '2026-05-22 08:55:44', '2026-05-22 17:02:36'),
(33, 13, 1, '2026-05-22', 'office', 'late', '2026-05-22 09:00:51', '2026-05-22 20:11:37', 11.6484220, 104.9074955, '11.648422, 104.907495', 11.6484345, 104.9074598, '11.648434, 104.907460', NULL, NULL, NULL, 1, NULL, NULL, 671, 'Submitted from web attendance.', NULL, '2026-05-22 09:00:51', '2026-05-22 09:00:51', '2026-05-22 20:11:37'),
(34, 12, 1, '2026-05-22', 'office', 'late', '2026-05-22 09:01:13', '2026-05-22 20:12:20', 11.6482756, 104.9075084, '11.648276, 104.907508', 11.6482151, 104.9075296, '11.648215, 104.907530', NULL, NULL, NULL, 2, NULL, NULL, 671, 'Submitted from web attendance.', NULL, '2026-05-22 09:01:13', '2026-05-22 09:01:13', '2026-05-22 20:12:20'),
(35, 3, NULL, '2026-05-22', 'office', 'late', '2026-05-22 09:14:04', '2026-05-22 17:13:12', 11.6483862, 104.9074581, '11.648386, 104.907458', 11.6483853, 104.9074602, '11.648385, 104.907460', NULL, NULL, NULL, 15, NULL, NULL, 479, 'Submitted from web attendance.', NULL, '2026-05-22 09:14:04', '2026-05-22 09:14:04', '2026-05-22 17:13:12'),
(36, 4, 1, '2026-05-22', 'office', 'late', '2026-05-22 11:21:14', '2026-05-22 17:33:58', 11.6483951, 104.9074341, '11.648395, 104.907434', 11.6483855, 104.9074502, '11.648385, 104.907450', NULL, NULL, NULL, 142, 3.00, 'Late 1hours', 373, 'Submitted from web attendance.', NULL, '2026-05-22 11:21:14', '2026-05-22 11:21:14', '2026-05-22 17:33:58'),
(37, 16, 1, '2026-05-23', 'office', 'present', '2026-05-23 08:03:20', '2026-05-23 17:12:19', 11.6484442, 104.9074577, '11.648444, 104.907458', 11.6484142, 104.9074665, '11.648414, 104.907466', NULL, NULL, NULL, 0, NULL, NULL, 549, 'Submitted from web attendance.', NULL, '2026-05-23 08:03:20', '2026-05-23 08:03:20', '2026-05-23 17:12:19'),
(38, 14, 1, '2026-05-23', 'office', 'present', '2026-05-23 08:15:29', '2026-05-23 17:30:47', 11.6484201, 104.9074960, 'Sangkat Prek Liep, Phnom Penh', 11.6483716, 104.9074755, '11.648372, 104.907476', NULL, NULL, NULL, 0, NULL, NULL, 555, 'Submitted from web attendance.', NULL, '2026-05-23 08:15:29', '2026-05-23 08:15:29', '2026-05-23 17:30:47'),
(39, 9, 1, '2026-05-23', 'office', 'present', '2026-05-23 08:21:58', '2026-05-23 23:02:03', 11.6485173, 104.9074672, 'Sangkat Prek Liep, Phnom Penh', 11.6484041, 104.9074551, 'Sangkat Prek Liep, Phnom Penh', NULL, NULL, NULL, 0, NULL, NULL, 880, 'Submitted from web attendance.', NULL, '2026-05-23 08:21:58', '2026-05-23 08:21:58', '2026-05-23 23:02:03'),
(40, 10, 1, '2026-05-23', 'office', 'present', '2026-05-23 08:38:01', '2026-05-23 23:01:26', 11.6483710, 104.9074535, '11.648371, 104.907453', 11.6483711, 104.9074535, 'Sangkat Prek Liep, Phnom Penh', NULL, NULL, NULL, 0, NULL, NULL, 863, 'Submitted from web attendance.', NULL, '2026-05-23 08:38:01', '2026-05-23 08:38:01', '2026-05-23 23:01:26'),
(41, 6, 1, '2026-05-23', 'office', 'present', '2026-05-23 08:41:58', '2026-05-23 17:04:29', 11.6483932, 104.9074310, '11.648393, 104.907431', 11.6483857, 104.9074592, 'Sangkat Prek Liep, Phnom Penh', NULL, NULL, NULL, 0, NULL, NULL, 503, 'Submitted from web attendance.', NULL, '2026-05-23 08:41:58', '2026-05-23 08:41:58', '2026-05-23 17:04:29'),
(42, 15, 1, '2026-05-23', 'office', 'present', '2026-05-23 08:49:04', '2026-05-23 17:15:46', 11.6483381, 104.9074358, NULL, 11.6483426, 104.9074318, NULL, NULL, NULL, NULL, 0, NULL, NULL, 507, 'Submitted from web attendance.', NULL, '2026-05-23 08:49:04', '2026-05-23 08:49:04', '2026-05-23 17:15:46'),
(43, 13, 1, '2026-05-23', 'office', 'present', '2026-05-23 08:51:04', '2026-05-23 23:01:31', 11.6484414, 104.9074193, '11.648441, 104.907419', 11.6484302, 104.9074446, '11.648430, 104.907445', NULL, NULL, NULL, 0, NULL, NULL, 850, 'Submitted from web attendance.', NULL, '2026-05-23 08:51:04', '2026-05-23 08:51:04', '2026-05-23 23:01:31'),
(44, 12, 1, '2026-05-23', 'office', 'present', '2026-05-23 08:51:42', '2026-05-23 23:02:16', 11.6482473, 104.9075084, '11.648247, 104.907508', 11.6482151, 104.9075296, 'Sangkat Prek Liep, Phnom Penh', NULL, NULL, NULL, 0, NULL, NULL, 851, 'Submitted from web attendance.', NULL, '2026-05-23 08:51:42', '2026-05-23 08:51:42', '2026-05-23 23:02:16'),
(45, 5, 1, '2026-05-23', 'office', 'late', '2026-05-23 09:00:46', '2026-05-23 17:03:39', 11.6484132, 104.9074458, '11.648413, 104.907446', 11.6484145, 104.9074630, '11.648414, 104.907463', NULL, NULL, NULL, 1, NULL, NULL, 483, 'Submitted from web attendance.', NULL, '2026-05-23 09:00:46', '2026-05-23 09:00:46', '2026-05-23 17:03:39'),
(46, 3, NULL, '2026-05-23', 'office', 'late', '2026-05-23 09:12:30', '2026-05-23 17:15:38', 11.6483849, 104.9074599, '11.648385, 104.907460', 11.6483846, 104.9074548, 'Sangkat Prek Liep, Phnom Penh', NULL, NULL, NULL, 13, NULL, NULL, 483, 'Submitted from web attendance.', NULL, '2026-05-23 09:12:30', '2026-05-23 09:12:30', '2026-05-23 17:15:38'),
(47, 4, 1, '2026-05-23', 'office', 'present', '2026-05-23 10:03:33', '2026-05-23 21:31:27', 11.6483845, 104.9074384, '11.648385, 104.907438', 11.6485074, 104.9073905, '11.648507, 104.907391', NULL, NULL, NULL, 0, NULL, NULL, 688, 'Submitted from web attendance.', NULL, '2026-05-23 10:03:33', '2026-05-23 10:03:33', '2026-05-23 21:31:27'),
(48, 8, 1, '2026-05-24', 'office', 'present', '2026-05-24 08:09:40', '2026-05-24 17:15:57', 11.6484171, 104.9074189, 'Sangkat Prek Liep, Phnom Penh', 11.6484158, 104.9074253, '11.648416, 104.907425', NULL, NULL, NULL, 0, NULL, NULL, 546, 'Submitted from web attendance.', NULL, '2026-05-24 08:09:40', '2026-05-24 08:09:40', '2026-05-24 17:15:57'),
(49, 16, 1, '2026-05-24', 'office', 'present', '2026-05-24 08:17:41', '2026-05-24 17:00:02', 11.6483596, 104.9074566, '11.648360, 104.907457', 11.6484108, 104.9074656, '11.648411, 104.907466', NULL, NULL, NULL, 0, NULL, NULL, 522, 'Submitted from web attendance.', NULL, '2026-05-24 08:17:41', '2026-05-24 08:17:41', '2026-05-24 17:00:03'),
(50, 10, 1, '2026-05-24', 'office', 'present', '2026-05-24 09:26:22', '2026-05-24 17:37:41', 11.6483711, 104.9074535, 'Sangkat Prek Liep, Phnom Penh', 11.6483190, 104.9075034, '11.648319, 104.907503', NULL, NULL, NULL, 0, NULL, NULL, 491, 'Submitted from web attendance.', NULL, '2026-05-24 09:26:22', '2026-05-24 09:26:22', '2026-05-24 17:37:41'),
(51, 12, 1, '2026-05-24', 'office', 'present', '2026-05-24 09:32:13', '2026-05-24 17:41:06', 11.6482696, 104.9074712, '11.648270, 104.907471', 11.6482151, 104.9075296, 'Sangkat Prek Liep, Phnom Penh', NULL, NULL, NULL, 0, NULL, NULL, 489, 'Submitted from web attendance.', NULL, '2026-05-24 09:32:13', '2026-05-24 09:32:13', '2026-05-24 17:41:06'),
(52, 19, 1, '2026-05-24', 'office', 'present', '2026-05-24 09:41:34', '2026-05-24 17:38:52', 11.6483654, 104.9074812, 'Sangkat Prek Liep, Phnom Penh', 11.6483654, 104.9074812, 'Sangkat Prek Liep, Phnom Penh', NULL, NULL, NULL, 0, NULL, NULL, 477, 'Submitted from web attendance.', NULL, '2026-05-24 09:41:34', '2026-05-24 09:41:34', '2026-05-24 17:38:52'),
(53, 13, 1, '2026-05-24', 'office', 'present', '2026-05-24 09:56:30', '2026-05-24 17:39:20', 11.6484455, 104.9074502, '11.648445, 104.907450', 11.6484442, 104.9074508, '11.648444, 104.907451', NULL, NULL, NULL, 0, NULL, NULL, 463, 'Submitted from web attendance.', NULL, '2026-05-24 09:56:30', '2026-05-24 09:56:30', '2026-05-24 17:39:20'),
(54, 9, 1, '2026-05-24', 'office', 'present', '2026-05-24 10:41:10', '2026-05-24 17:40:18', 11.6484047, 104.9074551, '11.648405, 104.907455', 11.6484008, 104.9074536, 'Sangkat Prek Liep, Phnom Penh', NULL, NULL, NULL, 0, NULL, NULL, 419, 'Submitted from web attendance.', NULL, '2026-05-24 10:41:10', '2026-05-24 10:41:10', '2026-05-24 17:40:18'),
(55, 20, 1, '2026-05-24', 'office', 'late', '2026-05-24 20:31:07', '2026-05-24 20:39:26', 11.6483368, 104.9074758, 'Sangkat Prek Liep, Phnom Penh', 11.6483786, 104.9074561, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/bUu2XDHoKMDTBomctDPpPw9CnLDyf5ra5ejembyt.jpg', 'attendance/checkouts/zyQelQgUwdLy3x44eymdkZxoqsEcZ8VusS7TBPkz.jpg', NULL, 542, 0.00, '1 h 30', 8, 'Submitted from web attendance.', NULL, '2026-05-24 20:31:08', '2026-05-24 20:31:08', '2026-05-24 20:39:26'),
(56, 9, 1, '2026-05-25', 'office', 'present', '2026-05-25 08:57:08', '2026-05-25 19:02:43', 11.6483881, 104.9074819, 'Sangkat Prek Liep, Phnom Penh', 11.6483881, 104.9074819, '11.648388, 104.907482', 'attendance/selfies/PFYMPu9nMByCgH6SuIgTo3WuaCeKRFZw8SbYNNpo.jpg', NULL, NULL, 0, NULL, NULL, 606, 'Submitted from web attendance.', NULL, '2026-05-25 08:57:09', '2026-05-25 08:57:09', '2026-05-25 19:02:43'),
(57, 13, 1, '2026-05-25', 'office', 'present', '2026-05-25 08:57:14', '2026-05-25 19:05:09', 11.6484439, 104.9074503, 'Sangkat Prek Liep, Phnom Penh', 11.6484463, 104.9074491, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/lifD6FnWkL0k2pxnp8tnCzQmfNaO293iaKgxVu59.jpg', NULL, NULL, 0, NULL, NULL, 608, 'Submitted from web attendance.', NULL, '2026-05-25 08:57:14', '2026-05-25 08:57:14', '2026-05-25 19:05:09'),
(58, 10, 1, '2026-05-25', 'office', 'present', '2026-05-25 08:58:14', '2026-05-25 18:56:38', 11.6483709, 104.9074536, 'Sangkat Prek Liep, Phnom Penh', 11.6482963, 104.9074886, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/lGFmDNO5DMPazgzSeEpyACEM7wIf1VisOHXbT4Dd.jpg', NULL, NULL, 0, NULL, NULL, 598, 'Submitted from web attendance.', NULL, '2026-05-25 08:58:14', '2026-05-25 08:58:14', '2026-05-25 18:56:38'),
(59, 16, 1, '2026-05-25', 'office', 'present', '2026-05-25 08:58:17', NULL, 11.6484103, 104.9074602, 'Sangkat Prek Liep, Phnom Penh', NULL, NULL, NULL, 'attendance/selfies/Gxw6VXhXlXiSpzgqcAdzGUy7Q4B3L0MzikpS5u22.jpg', NULL, NULL, 0, NULL, NULL, 0, 'Submitted from web attendance.', NULL, '2026-05-25 08:58:17', '2026-05-25 08:58:17', '2026-05-25 08:58:17'),
(60, 19, 1, '2026-05-25', 'office', 'present', '2026-05-25 08:58:58', '2026-05-25 17:06:52', 11.6483548, 104.9074912, 'Sangkat Prek Liep, Phnom Penh', 11.6483548, 104.9074912, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/repjhavKFD1hfcbD7yTMBhS5qJQsP74DgwF5kD46.jpg', NULL, NULL, 0, NULL, NULL, 488, 'Submitted from web attendance.', NULL, '2026-05-25 08:59:00', '2026-05-25 08:59:00', '2026-05-25 17:06:52'),
(61, 14, 1, '2026-05-25', 'office', 'present', '2026-05-25 08:59:37', '2026-05-25 17:29:53', 11.6484408, 104.9074620, 'Sangkat Prek Liep, Phnom Penh', 11.6483778, 104.9074698, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/M46mdZOjGpYSapntu3YzZOOJLYT1XiPN2AjeFW3R.jpg', NULL, NULL, 0, NULL, NULL, 510, 'Submitted from web attendance.', NULL, '2026-05-25 08:59:38', '2026-05-25 08:59:38', '2026-05-25 17:29:53'),
(62, 6, 1, '2026-05-25', 'office', 'late', '2026-05-25 09:16:49', '2026-05-25 17:05:57', 11.6483787, 104.9074758, 'Sangkat Prek Liep, Phnom Penh', 11.6483725, 104.9074656, '11.648373, 104.907466', NULL, NULL, NULL, 17, NULL, NULL, 469, 'Submitted from web attendance.', NULL, '2026-05-25 09:16:49', '2026-05-25 09:16:49', '2026-05-25 17:05:57'),
(63, 12, 1, '2026-05-25', 'office', 'late', '2026-05-25 09:17:46', '2026-05-25 18:57:51', 11.6482151, 104.9075296, 'Sangkat Prek Liep, Phnom Penh', 11.6482151, 104.9075296, '11.648215, 104.907530', NULL, NULL, NULL, 18, NULL, NULL, 580, 'Submitted from web attendance.', NULL, '2026-05-25 09:17:46', '2026-05-25 09:17:46', '2026-05-25 18:57:51'),
(64, 15, 1, '2026-05-25', 'office', 'late', '2026-05-25 09:18:03', '2026-05-25 17:28:27', 11.6483468, 104.9074308, NULL, 11.6483476, 104.9074400, NULL, NULL, NULL, NULL, 19, NULL, NULL, 490, 'Submitted from web attendance.', NULL, '2026-05-25 09:18:03', '2026-05-25 09:18:03', '2026-05-25 17:28:27'),
(65, 8, 1, '2026-05-25', 'office', 'late', '2026-05-25 09:18:20', '2026-05-25 17:06:33', 11.6484193, 104.9074334, '11.648419, 104.907433', 11.6484145, 104.9074155, '11.648414, 104.907416', NULL, NULL, NULL, 19, NULL, NULL, 468, 'Submitted from web attendance.', NULL, '2026-05-25 09:18:20', '2026-05-25 09:18:20', '2026-05-25 17:06:33'),
(66, 3, NULL, '2026-05-25', 'office', 'late', '2026-05-25 09:20:26', '2026-05-25 17:16:08', 11.6483855, 104.9074578, '11.648386, 104.907458', 11.6483736, 104.9074402, 'Sangkat Prek Liep, Phnom Penh', NULL, NULL, NULL, 21, NULL, NULL, 476, 'Submitted from web attendance.', NULL, '2026-05-25 09:20:26', '2026-05-25 09:20:26', '2026-05-25 17:16:08'),
(67, 5, 1, '2026-05-25', 'office', 'late', '2026-05-25 09:21:12', '2026-05-25 17:13:37', 11.6484108, 104.9075714, 'Sangkat Prek Liep, Phnom Penh', 11.6484145, 104.9074630, 'Sangkat Prek Liep, Phnom Penh', NULL, NULL, NULL, 22, NULL, NULL, 472, 'Submitted from web attendance.', NULL, '2026-05-25 09:21:12', '2026-05-25 09:21:12', '2026-05-25 17:13:37'),
(68, 21, 1, '2026-05-25', 'outdoor', 'late', '2026-05-25 10:44:37', '2026-05-25 18:39:26', 12.3135545, 105.2759499, 'Chamkar Leu, Kampong Cham', 11.8924971, 105.7673939, 'Sralap, Tboung Khmum', 'attendance/selfies/cSx2t8hpJiqPpY1CEMJOOPS7JuDv3AGL3ebjvccZ.jpg', 'attendance/checkouts/yVmlUFfnJIWn6fiJ5eNZNcmFtR14aJvJCvCQJxiP.jpg', NULL, 105, NULL, NULL, 475, 'Submitted from outdoor sales attendance.', NULL, '2026-05-25 10:44:38', '2026-05-25 10:44:38', '2026-05-25 18:39:27'),
(69, 4, 1, '2026-05-25', 'office', 'present', '2026-05-25 11:28:56', '2026-05-25 17:24:53', 11.6483958, 104.9074432, '11.648396, 104.907443', 11.6484133, 104.9074527, 'Sangkat Prek Liep, Phnom Penh', NULL, 'attendance/checkouts/tpAbh1NZqNtBl72BgseLQipS7xGNP2JCp413yWZZ.jpg', NULL, 0, NULL, NULL, 356, 'Submitted from web attendance.', NULL, '2026-05-25 11:28:56', '2026-05-25 11:28:56', '2026-05-25 17:24:54'),
(70, 17, 1, '2026-05-25', 'outdoor', 'late', '2026-05-25 19:52:01', NULL, 11.8928433, 105.7672000, 'Sralap, Tboung Khmum', NULL, NULL, NULL, 'attendance/selfies/Y3zM0FuusnOpcyjZ8zlkH2zqE2tee1pJsEwLw8XV.jpg', NULL, NULL, 653, NULL, NULL, 0, 'Submitted from outdoor sales attendance.', NULL, '2026-05-25 19:52:02', '2026-05-25 19:52:02', '2026-05-25 19:52:02'),
(71, 16, 1, '2026-05-26', 'office', 'present', '2026-05-26 08:06:00', '2026-05-26 17:10:00', 11.6484723, 104.9074599, 'Sangkat Prek Liep, Phnom Penh', NULL, NULL, NULL, 'attendance/selfies/eyWtpDRWr5AST7BgDLlcn6E1oynWkOFXs6avIBMF.jpg', NULL, NULL, 0, NULL, NULL, 544, 'Submitted from web attendance.', NULL, '2026-05-26 08:06:56', '2026-05-26 08:06:56', '2026-05-26 19:01:32'),
(72, 8, 1, '2026-05-26', 'office', 'present', '2026-05-26 08:21:36', '2026-05-26 17:13:06', 11.6483566, 104.9074282, 'Sangkat Prek Liep, Phnom Penh', 11.6484034, 104.9074220, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/u9VRML8x8wcTCxJ7EzvBkdJF2U0jykdTRu2wfUbJ.jpg', 'attendance/checkouts/GqAqRWsf4tKtaftIwhHGi9HVKD9S46hs5iPCXwbU.jpg', NULL, 0, NULL, NULL, 532, 'Submitted from web attendance.', NULL, '2026-05-26 08:21:37', '2026-05-26 08:21:37', '2026-05-26 17:13:07'),
(73, 10, 1, '2026-05-26', 'office', 'present', '2026-05-26 08:22:42', '2026-05-26 18:59:57', 11.6483711, 104.9074535, 'Sangkat Prek Liep, Phnom Penh', 11.6483711, 104.9074535, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/P7N4SRgpm6a9YHsYC0Ii4r6VAFxVipROzYp7RS2C.jpg', 'attendance/checkouts/vMrnaKV9jZi1x3hX3qYDSlxqFXqhz3xQFZnyOm4M.jpg', NULL, 0, NULL, NULL, 637, 'Submitted from web attendance.', NULL, '2026-05-26 08:22:43', '2026-05-26 08:22:43', '2026-05-26 18:59:57'),
(74, 9, 1, '2026-05-26', 'office', 'present', '2026-05-26 08:23:09', '2026-05-26 19:45:57', 11.6483961, 104.9074532, 'Sangkat Prek Liep, Phnom Penh', 11.6483885, 104.9074812, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/EAQ9N17vfNk6GxGl8c9AMJefBbWcYZOlXMXpC346.jpg', 'attendance/checkouts/SP8LktmfWir6E2aL6mxKeTcx1h2QWY1tTEXgNMxq.jpg', NULL, 0, NULL, NULL, 683, 'Submitted from web attendance.', NULL, '2026-05-26 08:23:10', '2026-05-26 08:23:10', '2026-05-26 19:45:58'),
(75, 14, 1, '2026-05-26', 'office', 'present', '2026-05-26 08:25:19', '2026-05-26 17:59:47', 11.6484407, 104.9074621, 'Sangkat Prek Liep, Phnom Penh', 11.6483786, 104.9074691, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/ftSM7eViUzlVG5CbyKLZnaoxCuqKQA2BIVTKn5dO.jpg', 'attendance/checkouts/z2DikfNcosWsWe69XEAA7jWe8LQtIIbdVhoIDNJu.jpg', NULL, 0, NULL, NULL, 574, 'Submitted from web attendance.', NULL, '2026-05-26 08:25:20', '2026-05-26 08:25:20', '2026-05-26 17:59:47'),
(76, 13, 1, '2026-05-26', 'office', 'present', '2026-05-26 08:30:01', '2026-05-26 18:59:15', 11.6484468, 104.9074476, 'Sangkat Prek Liep, Phnom Penh', 11.6484471, 104.9074475, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/eAV1j4T5cHoLuWl48LVxnCDqt9TSbh5B9txf5QJJ.jpg', 'attendance/checkouts/wz6nqqEnb5uYgEQ9b0P3wrQ4lvEOKhCNLODBsxxe.jpg', NULL, 0, NULL, NULL, 629, 'Submitted from web attendance.', NULL, '2026-05-26 08:30:02', '2026-05-26 08:30:02', '2026-05-26 18:59:15'),
(77, 15, 1, '2026-05-26', 'office', 'present', '2026-05-26 08:30:17', '2026-05-26 19:41:51', 11.6483874, 104.9074549, 'Sangkat Prek Liep, Phnom Penh', 11.6483480, 104.9074488, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/FbSAvvGYtc8WW1NOfmgHhSjAJONX14I3ScYcwXqC.jpg', 'attendance/checkouts/SU1wuq5QDtMgbOs4iHWNG1AIMPi5pfZQZMbAXg7H.jpg', NULL, 0, NULL, NULL, 672, 'Submitted from web attendance.', NULL, '2026-05-26 08:30:18', '2026-05-26 08:30:18', '2026-05-26 19:41:52'),
(78, 19, 1, '2026-05-26', 'office', 'present', '2026-05-26 08:47:44', '2026-05-26 17:10:17', 11.6483737, 104.9074914, 'Sangkat Prek Liep, Phnom Penh', 11.6483710, 104.9074794, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/dfer9M3ju1bjzHbf3pXnGJEYJ9KFTsGYZmaAjHJV.jpg', 'attendance/checkouts/iq2jcMlVgV8GCRHwTaSMYz0c2FiPxEVlQbehy8K3.jpg', NULL, 0, NULL, NULL, 503, 'Submitted from web attendance.', NULL, '2026-05-26 08:47:45', '2026-05-26 08:47:45', '2026-05-26 17:10:18'),
(79, 11, 1, '2026-05-26', 'outdoor', 'present', '2026-05-26 08:58:21', NULL, 11.6483508, 104.9074716, 'Sangkat Prek Liep, Phnom Penh', NULL, NULL, NULL, 'attendance/selfies/PX5tB0XWSHJY0Mv4AjB34sUWn77b1HtrCFiF3pRw.jpg', NULL, NULL, 0, NULL, NULL, 0, 'Submitted from outdoor sales attendance.', NULL, '2026-05-26 08:58:22', '2026-05-26 08:58:22', '2026-05-26 08:58:22'),
(80, 3, NULL, '2026-05-26', 'office', 'late', '2026-05-26 09:12:49', '2026-05-26 17:21:40', 11.6484049, 104.9074644, 'Sangkat Prek Liep, Phnom Penh', 11.6483739, 104.9074700, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/9fE3k9erRec3jxMvjTSwKRYEVW2LsrcLR4CnzxMP.jpg', 'attendance/checkouts/D9YMq96nnoSZfD0LqzeQqCuSMPoYSLhxFMZQgHXI.jpg', NULL, 13, NULL, NULL, 489, 'Submitted from web attendance.', NULL, '2026-05-26 09:12:50', '2026-05-26 09:12:50', '2026-05-26 17:21:40'),
(81, 6, 1, '2026-05-26', 'office', 'late', '2026-05-26 09:13:47', '2026-05-26 17:03:29', 11.6483397, 104.9075394, 'Sangkat Prek Liep, Phnom Penh', 11.6484022, 104.9074310, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/f1U5ZevkJVdV8lZ5k4HwH0StoH7O9f5vpJACDYvD.jpg', 'attendance/checkouts/pgGonwcEq5tPhOkhBhChHddEUN3vQksL24tq91Hb.jpg', NULL, 14, NULL, NULL, 470, 'Submitted from web attendance.', NULL, '2026-05-26 09:13:48', '2026-05-26 09:13:48', '2026-05-26 17:03:30'),
(82, 5, 1, '2026-05-26', 'office', 'late', '2026-05-26 09:36:11', '2026-05-26 17:20:18', 11.6484138, 104.9074675, 'Sangkat Prek Liep, Phnom Penh', 11.6483966, 104.9074652, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/ETqGly8HWYj8zaOLYQeXupQ3nKtpw3GkqMjpFneb.jpg', 'attendance/checkouts/O3J3UKdbq5UCyUan7xjgbn0Yeq6rW79sX0Eaac1Z.jpg', NULL, 37, 1.50, 'Late 30min', 464, 'Submitted from web attendance.', NULL, '2026-05-26 09:36:12', '2026-05-26 09:36:12', '2026-05-26 17:20:18'),
(83, 12, 1, '2026-05-26', 'office', 'late', '2026-05-26 11:12:01', '2026-05-26 19:46:47', 11.6483566, 104.9074595, 'Sangkat Prek Liep, Phnom Penh', 11.6483561, 104.9074540, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/xs9cbyBEqEub2sMmWfrvSPECQAixyKkfUqE0eGJ6.jpg', 'attendance/checkouts/HPS6eEeXKK4CB2Z2c33ZR0UOxIM5mC0Q51GIBwFD.jpg', NULL, 133, 0.00, '1 h 30', 515, 'Submitted from web attendance.', NULL, '2026-05-26 11:12:02', '2026-05-26 11:12:02', '2026-05-26 19:46:48'),
(84, 4, 1, '2026-05-26', 'office', 'present', '2026-05-26 11:24:10', '2026-05-26 17:19:39', 11.6484122, 104.9074504, 'Sangkat Prek Liep, Phnom Penh', 11.6484039, 104.9074499, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/KdkJafVrH8c4otAOBjQtxBRcX4Vh3ohInYpwa7oy.jpg', 'attendance/checkouts/8Hk0JrEQRtP8McemJfLx5XYt2bu7B9duQRbfWGvb.jpg', NULL, 0, NULL, NULL, 355, 'Submitted from web attendance.', NULL, '2026-05-26 11:24:10', '2026-05-26 11:24:10', '2026-05-26 17:19:40'),
(85, 17, 1, '2026-05-26', 'outdoor', 'late', '2026-05-26 12:17:45', NULL, 11.9230894, 105.5757378, 'Mream Teak, Tboung Khmum', NULL, NULL, NULL, 'attendance/selfies/lp6oHRtnhdxTANpynnqBGg7x8EUxRQcONfYpcMQ1.jpg', NULL, NULL, 198, NULL, NULL, 0, 'Submitted from outdoor sales attendance.', NULL, '2026-05-26 12:17:46', '2026-05-26 12:17:46', '2026-05-26 12:17:46'),
(86, 21, 1, '2026-05-26', 'outdoor', 'late', '2026-05-26 19:51:24', NULL, 11.8910571, 105.7832787, 'Tboung Khmum', NULL, NULL, NULL, 'attendance/selfies/5wAT4sVh8RNkwp8bapVXCDp3RytDN9XgIwsU2XO7.jpg', NULL, NULL, 652, NULL, NULL, 0, 'Submitted from outdoor sales attendance.', NULL, '2026-05-26 19:51:25', '2026-05-26 19:51:25', '2026-05-26 19:51:25'),
(87, 16, 1, '2026-05-27', 'office', 'present', '2026-05-27 08:01:59', '2026-05-27 17:20:06', 11.6484247, 104.9074637, 'Sangkat Prek Liep, Phnom Penh', 11.6484209, 104.9074552, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/pZlDWwjVL5O7NMQLKP0kOhQ0JnYluwA8KHgPaHKU.jpg', 'attendance/checkouts/20q9l63AczsoxDOe5wPluOpITr0HWXsoDQXkBOE7.jpg', NULL, 0, NULL, NULL, 558, 'Submitted from web attendance.', NULL, '2026-05-27 08:02:00', '2026-05-27 08:02:00', '2026-05-27 17:20:07'),
(88, 9, 1, '2026-05-27', 'office', 'present', '2026-05-27 08:09:37', '2026-05-27 21:58:19', 11.6483889, 104.9074810, 'Sangkat Prek Liep, Phnom Penh', 11.6483889, 104.9074810, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/V5slSbDSSBvqZn5REwZH39dptl9falY0IJnWtADY.jpg', 'attendance/checkouts/33TKF2odPstTAQruqy6TWKY3yEagGIlCrynX8sjv.jpg', NULL, 0, NULL, NULL, 829, 'Submitted from web attendance.', NULL, '2026-05-27 08:09:38', '2026-05-27 08:09:38', '2026-05-27 21:58:20'),
(89, 8, 1, '2026-05-27', 'office', 'present', '2026-05-27 08:11:03', '2026-05-27 17:31:04', 11.6483976, 104.9074003, 'Sangkat Prek Liep, Phnom Penh', 11.6484148, 104.9074199, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/xVzn18rZsOnDV8z9qs4JdI8vpKplnbCrw5nKgtKt.jpg', 'attendance/checkouts/WWjtQSk0A3k4m9PvGTPrCUnc9AC7b53XJMf1HDrN.jpg', NULL, 0, NULL, NULL, 560, 'Submitted from web attendance.', NULL, '2026-05-27 08:11:03', '2026-05-27 08:11:03', '2026-05-27 17:31:05'),
(90, 14, 1, '2026-05-27', 'office', 'present', '2026-05-27 08:28:43', '2026-05-27 17:10:11', 11.6484471, 104.9074577, 'Sangkat Prek Liep, Phnom Penh', 11.6483782, 104.9074706, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/7s867pBt2fnn5eFI8PXrOmsYdhQPsvlMZgEzdL5o.jpg', 'attendance/checkouts/ZI8WU2JILtZN6wiJ8GUdtBI4t6uRkVtlfwWz6bs9.jpg', NULL, 0, NULL, NULL, 521, 'Submitted from web attendance.', NULL, '2026-05-27 08:28:44', '2026-05-27 08:28:44', '2026-05-27 17:10:12'),
(91, 13, 1, '2026-05-27', 'office', 'present', '2026-05-27 08:38:10', '2026-05-27 21:50:21', 11.6484442, 104.9074484, 'Sangkat Prek Liep, Phnom Penh', 11.6484472, 104.9074479, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/w040MRz6sL1gWGNu9x9uHxOKNtQWuBHrlWPTYqIL.jpg', 'attendance/checkouts/9hIONULkKvwF9gmYJF162Ai7z2gj7yW3gtAPCbye.jpg', NULL, 0, NULL, NULL, 792, 'Submitted from web attendance.', NULL, '2026-05-27 08:38:10', '2026-05-27 08:38:10', '2026-05-27 21:50:21'),
(92, 10, 1, '2026-05-27', 'office', 'present', '2026-05-27 08:40:08', '2026-05-27 20:10:23', 11.6483305, 104.9074762, 'Sangkat Prek Liep, Phnom Penh', 11.6483711, 104.9074535, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/ecP3SE3P9VLZ1gIIAW3ejA0cFH6jcvj17UolVvWV.jpg', 'attendance/checkouts/Sy5EauifyyF8mvaIdY2dKKeI4HNwmQjpdQLZ5vP3.jpg', NULL, 0, NULL, NULL, 690, 'Submitted from web attendance.', NULL, '2026-05-27 08:40:09', '2026-05-27 08:40:09', '2026-05-27 20:10:24'),
(93, 5, 1, '2026-05-27', 'office', 'present', '2026-05-27 08:40:51', '2026-05-27 17:15:25', 11.6483964, 104.9074650, 'Sangkat Prek Liep, Phnom Penh', 11.6484093, 104.9074648, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/OTSUqip39aHCYBhfbxBnv8D3mNZKIpoXEBNW2A6f.jpg', 'attendance/checkouts/LXd0HjP3FLGNEhkso7soVQgWXXduw2qy2BfecWa0.jpg', NULL, 0, NULL, NULL, 515, 'Submitted from web attendance.', NULL, '2026-05-27 08:40:52', '2026-05-27 08:40:52', '2026-05-27 17:15:25'),
(94, 19, 1, '2026-05-27', 'office', 'present', '2026-05-27 08:58:57', '2026-05-27 17:10:05', 11.6483718, 104.9074914, 'Sangkat Prek Liep, Phnom Penh', 11.6483710, 104.9074794, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/XpQXZ3zBDzn8oWlSM2aOrezFM3lb358KhQBbt710.jpg', 'attendance/checkouts/oQbLWoudOHr1a91NmPWiJMjUvDtdzkzjxeq2k9jm.jpg', NULL, 0, NULL, NULL, 491, 'Submitted from web attendance.', NULL, '2026-05-27 08:58:57', '2026-05-27 08:58:57', '2026-05-27 17:10:06'),
(95, 6, 1, '2026-05-27', 'office', 'late', '2026-05-27 09:00:29', '2026-05-27 17:04:45', 11.6483635, 104.9074908, 'Sangkat Prek Liep, Phnom Penh', 11.6483584, 104.9074677, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/eUSKkimMVFxb8d7Gsbg87rgXdGe7y8Ek2mADuHBK.jpg', 'attendance/checkouts/gSMGidBaTFuYKVsvu5GdisDXntUIiNxjYZe1YFCs.jpg', NULL, 1, NULL, NULL, 484, 'Submitted from web attendance.', NULL, '2026-05-27 09:00:30', '2026-05-27 09:00:30', '2026-05-27 17:04:45'),
(96, 12, 1, '2026-05-27', 'office', 'late', '2026-05-27 09:13:22', '2026-05-27 21:59:07', 11.6483563, 104.9074600, 'Sangkat Prek Liep, Phnom Penh', 11.6483494, 104.9074500, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/GI3EOhSwBgeBRUoxvZfpu3gzGxkWiviwIvdgjOR0.jpg', 'attendance/checkouts/0iMFVQZCmqoKWfoJz1sh3HFvMbqatVluO1lBWlwP.jpg', NULL, 14, NULL, NULL, 766, 'Submitted from web attendance.', NULL, '2026-05-27 09:13:22', '2026-05-27 09:13:22', '2026-05-27 21:59:08'),
(97, 11, 1, '2026-05-27', 'outdoor', 'late', '2026-05-27 09:17:11', NULL, 11.5736054, 104.9264673, 'Sangkat Srah Chak, Phnom Penh', NULL, NULL, NULL, 'attendance/selfies/6sb0uuZfB2JTR0MYiFJ8Zpcefje7qdCYgr9Zu4xN.jpg', NULL, NULL, 18, NULL, NULL, 0, 'Submitted from outdoor sales attendance.', NULL, '2026-05-27 09:17:11', '2026-05-27 09:17:11', '2026-05-27 09:17:11'),
(98, 3, NULL, '2026-05-27', 'office', 'late', '2026-05-27 09:21:18', '2026-05-27 17:20:42', 11.6483958, 104.9074626, 'Sangkat Prek Liep, Phnom Penh', 11.6483981, 104.9074621, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/7C07mHa0t9c9mPBE2dRQ0hHsqMSze0or6ePGDS8C.jpg', 'attendance/checkouts/HJkp6aqp1JUBcDmKW07FOT6uxp9r2P4GBc594k5m.jpg', NULL, 22, NULL, NULL, 479, 'Submitted from web attendance.', NULL, '2026-05-27 09:21:18', '2026-05-27 09:21:18', '2026-05-27 17:20:44'),
(99, 17, 1, '2026-05-27', 'outdoor', 'late', '2026-05-27 10:49:58', '2026-05-27 17:39:29', 11.9910820, 105.4651118, 'Kampong Cham, Kampong Cham', 12.5669150, 105.0544683, 'Tang Krasang, Kampong Thom', 'attendance/selfies/51RBvnOnTENLEUYmBOnt16ynwlKOHwp2sCgekQTj.jpg', 'attendance/checkouts/4YvsNcYlyor31deQ2hqiuLj00BSzUcYSWx4JccLe.jpg', NULL, 110, NULL, NULL, 410, 'Submitted from outdoor sales attendance.', NULL, '2026-05-27 10:49:59', '2026-05-27 10:49:59', '2026-05-27 17:39:29'),
(100, 21, 1, '2026-05-27', 'outdoor', 'late', '2026-05-27 11:04:24', '2026-05-27 17:39:48', 11.9970802, 105.4623733, 'Kampong Cham, Kampong Cham', 12.5669952, 105.0545406, 'Tang Krasang, Kampong Thom', 'attendance/selfies/xcfZ8xPpaHQCUY8cSdrDVqxjXkDrwsoN4eQv9vBf.jpg', 'attendance/checkouts/deOutcRBjRx90CCSEVkLNNyfOq2tNwEnWn31F7Dn.jpg', NULL, 125, NULL, NULL, 395, 'Submitted from outdoor sales attendance.', NULL, '2026-05-27 11:04:24', '2026-05-27 11:04:24', '2026-05-27 17:39:49'),
(101, 4, 1, '2026-05-27', 'office', 'present', '2026-05-27 11:25:00', '2026-05-27 17:44:39', 11.6484334, 104.9074681, 'Sangkat Prek Liep, Phnom Penh', 11.6484091, 104.9074517, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/bbZw6Zjc4IWAO0ZJvGrx8lkFp3bhduVtof9Ka3Nl.jpg', 'attendance/checkouts/ZLrIUAXpJ8R00ITo5zDFyKMULygaa2wnZsszhLX9.jpg', NULL, 0, NULL, NULL, 380, 'Submitted from web attendance.', NULL, '2026-05-27 11:25:00', '2026-05-27 11:25:00', '2026-05-27 17:44:40'),
(102, 16, 1, '2026-05-28', 'office', 'present', '2026-05-28 08:09:26', '2026-05-28 17:05:43', 11.6484289, 104.9074794, 'Sangkat Prek Liep, Phnom Penh', 11.6484179, 104.9074493, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/PfTRizJnj4ZioHrD1hdXBYVWsDjkzOFNsUypdeGo.jpg', 'attendance/checkouts/Ux0g90nfTjWFPMb8vM3J9c6RRaF4i6Fi12UDbD7Q.jpg', NULL, 0, NULL, NULL, 536, 'Submitted from web attendance.', NULL, '2026-05-28 08:09:26', '2026-05-28 08:09:26', '2026-05-28 17:05:44'),
(103, 14, 1, '2026-05-28', 'office', 'present', '2026-05-28 08:18:23', '2026-05-28 17:11:59', 11.6484490, 104.9074565, 'Sangkat Prek Liep, Phnom Penh', 11.6483755, 104.9074739, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/yRhrO4bC8DMlNixqXdjpqFby1R7Z9uLaQPgZ1VNp.jpg', 'attendance/checkouts/dIavfJ3AwmTni6guJjY3ZauhQiz0gH3RMTKaxrZZ.jpg', NULL, 0, NULL, NULL, 534, 'Submitted from web attendance.', NULL, '2026-05-28 08:18:23', '2026-05-28 08:18:23', '2026-05-28 17:11:59'),
(104, 9, 1, '2026-05-28', 'office', 'present', '2026-05-28 08:27:20', '2026-05-28 22:09:12', 11.6483961, 104.9074532, 'Sangkat Prek Liep, Phnom Penh', 11.6483970, 104.9074754, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/haf4dN2PAxXbMWFCsKuDp2y1c11conxBq9NatIFs.jpg', 'attendance/checkouts/CIGnMfq32jIvyKZrn7ToGEyPMYPWMGZJFKEh74yx.jpg', NULL, 0, NULL, NULL, 822, 'Submitted from web attendance.', NULL, '2026-05-28 08:27:20', '2026-05-28 08:27:20', '2026-05-28 22:09:13'),
(105, 8, 1, '2026-05-28', 'office', 'present', '2026-05-28 08:37:47', '2026-05-28 17:58:44', 11.6483841, 104.9073896, 'Sangkat Prek Liep, Phnom Penh', 11.6483867, 104.9073913, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/1W5UAUy1bVt7ekUBZy6zNsajcC5ICpRp8501zErl.jpg', 'attendance/checkouts/To5POjogMSqU670j7IfP54rJoRCynLo3abHlbnCw.jpg', NULL, 0, NULL, NULL, 561, 'Submitted from web attendance.', NULL, '2026-05-28 08:37:47', '2026-05-28 08:37:47', '2026-05-28 17:58:45'),
(106, 5, 1, '2026-05-28', 'office', 'present', '2026-05-28 08:39:45', '2026-05-28 17:04:44', 11.6484093, 104.9074648, 'Sangkat Prek Liep, Phnom Penh', 11.6484084, 104.9074654, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/CxNEzSASCI92NQ7w3O1G9s60k9RZ2d9QFuH4MCII.jpg', 'attendance/checkouts/7De8RxH4H5I1MX0wXFoZ4XFBwc1jee0IcWZUxNzi.jpg', NULL, 0, NULL, NULL, 505, 'Submitted from web attendance.', NULL, '2026-05-28 08:39:46', '2026-05-28 08:39:46', '2026-05-28 17:04:45'),
(107, 6, 1, '2026-05-28', 'office', 'present', '2026-05-28 08:50:06', '2026-05-28 17:04:09', 11.6484030, 104.9074580, 'Sangkat Prek Liep, Phnom Penh', 11.6483559, 104.9075089, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/kkWuBfRwlmvemn3v4M0P1MWk9AmRdYXeD39ZfEMv.jpg', 'attendance/checkouts/wpgCGBd2yIswuYcpzqBGM37BbKZoIWT9g2dNKwZd.jpg', NULL, 0, NULL, NULL, 494, 'Submitted from web attendance.', NULL, '2026-05-28 08:50:06', '2026-05-28 08:50:06', '2026-05-28 17:04:10'),
(108, 15, 1, '2026-05-28', 'office', 'present', '2026-05-28 08:50:40', NULL, 11.6484179, 104.9074399, 'Sangkat Prek Liep, Phnom Penh', NULL, NULL, NULL, 'attendance/selfies/iBG2wcCfissGEEQ0j4HlG0Xkm98U20hdEiMZXGiI.jpg', NULL, NULL, 0, NULL, NULL, 0, 'Submitted from web attendance.', NULL, '2026-05-28 08:50:41', '2026-05-28 08:50:41', '2026-05-28 08:50:41'),
(109, 19, 1, '2026-05-28', 'office', 'present', '2026-05-28 08:51:04', '2026-05-28 17:10:30', 11.6483712, 104.9074894, 'Sangkat Prek Liep, Phnom Penh', 11.6483698, 104.9074802, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/RwATwgeReCQlYcvAunizn7jjGwXUu61l5sCKJ5UL.jpg', 'attendance/checkouts/oDgGWoRmaEA0BqqPQM9VmXCPdgVGpVYOgrzrQx1X.jpg', NULL, 0, NULL, NULL, 499, 'Submitted from web attendance.', NULL, '2026-05-28 08:51:05', '2026-05-28 08:51:05', '2026-05-28 17:10:31'),
(110, 10, 1, '2026-05-28', 'office', 'present', '2026-05-28 08:51:47', NULL, 11.6483128, 104.9074820, 'Sangkat Prek Liep, Phnom Penh', NULL, NULL, NULL, 'attendance/selfies/C11iUDr9ovKJmhKk5kb22tChwlR9cG59seBRyHsC.jpg', NULL, NULL, 0, NULL, NULL, 0, 'Submitted from web attendance.', NULL, '2026-05-28 08:51:48', '2026-05-28 08:51:48', '2026-05-28 08:51:48'),
(111, 13, 1, '2026-05-28', 'office', 'present', '2026-05-28 08:52:42', '2026-05-28 21:03:52', 11.6484474, 104.9074492, 'Sangkat Prek Liep, Phnom Penh', 11.6484468, 104.9074492, '11.648447, 104.907449', 'attendance/selfies/wq1QouJZctE9IiOhBDNdM42SKSJ7MS7djc9LPeHi.jpg', 'attendance/checkouts/YE31qUnT5O015klLzIeXiOCUxvye9l7rXHJrZV1o.jpg', NULL, 0, NULL, NULL, 731, 'Submitted from web attendance.', NULL, '2026-05-28 08:52:42', '2026-05-28 08:52:42', '2026-05-28 21:03:53'),
(112, 12, 1, '2026-05-28', 'office', 'present', '2026-05-28 08:53:18', '2026-05-28 22:08:28', 11.6483494, 104.9074500, 'Sangkat Prek Liep, Phnom Penh', 11.6483494, 104.9074500, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/zvaCD7tAGPWvnn8YVJnUrn0ahIpjIsC7IAwhFdB6.jpg', 'attendance/checkouts/8qPFeCHrsLjwAEDBafVS5zjX4FFOCOZytBmBD5h2.jpg', NULL, 0, NULL, NULL, 795, 'Submitted from web attendance.', NULL, '2026-05-28 08:53:19', '2026-05-28 08:53:19', '2026-05-28 22:08:28'),
(113, 3, NULL, '2026-05-28', 'office', 'late', '2026-05-28 09:15:27', '2026-05-28 17:10:02', 11.6484141, 104.9074718, 'Sangkat Prek Liep, Phnom Penh', 11.6484061, 104.9074681, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/dEIcI8lczuJCBZsEPd8SMxERSliFpWkgEZq5sfAB.jpg', 'attendance/checkouts/iTnK8I74jQCebzEPDcmOwaHIxLeDNSEMGlEAlXrZ.jpg', NULL, 16, NULL, NULL, 475, 'Submitted from web attendance.', NULL, '2026-05-28 09:15:27', '2026-05-28 09:15:27', '2026-05-28 17:10:03'),
(114, 4, 1, '2026-05-28', 'office', 'present', '2026-05-28 11:36:01', '2026-05-28 17:27:01', 11.6484080, 104.9074474, 'Sangkat Prek Liep, Phnom Penh', 11.6484017, 104.9074421, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/mDUBthlLNydiwoeZoWfJkWnA5jUKmPCtDXlnsidY.jpg', 'attendance/checkouts/JodLRoG2NrK99hmznerIAhWNKpQQTgyNDDdfE86O.jpg', NULL, 0, NULL, NULL, 351, 'Submitted from web attendance.', NULL, '2026-05-28 11:36:02', '2026-05-28 11:36:02', '2026-05-28 17:27:02'),
(115, 17, 1, '2026-05-28', 'outdoor', 'late', '2026-05-28 12:15:06', '2026-05-28 17:49:22', 12.2524914, 105.9766080, 'Chhlong, Kratie', 12.4911683, 106.0157800, 'Kracheh, Kratié', 'attendance/selfies/hIK7CH7bGLpg9LWJ7rdBVHfeGoeXwPfwJTq5MQcc.jpg', 'attendance/checkouts/sALX7XPr3RJabVyljgeJ7MoAwwFralg7SLXsrasX.jpg', NULL, 196, NULL, NULL, 334, 'Submitted from outdoor sales attendance.', NULL, '2026-05-28 12:15:06', '2026-05-28 12:15:06', '2026-05-28 17:49:23'),
(116, 16, 1, '2026-05-29', 'office', 'present', '2026-05-29 08:13:50', '2026-05-29 17:06:02', 11.6484255, 104.9074706, 'Sangkat Prek Liep, Phnom Penh', 11.6484194, 104.9074496, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/Ul6OBf6bj7nOIVqxs5yVMcqxuHIdfeoJBpjPd9lT.jpg', 'attendance/checkouts/bn0OWsAS6kMaNr8tJweHXYDzFvedyrFBnrhXpSzA.jpg', NULL, 0, NULL, NULL, 532, 'Submitted from web attendance.', NULL, '2026-05-29 08:13:51', '2026-05-29 08:13:51', '2026-05-29 17:06:02'),
(117, 8, 1, '2026-05-29', 'office', 'present', '2026-05-29 08:14:01', '2026-05-29 17:26:23', 11.6484107, 104.9074067, 'Sangkat Prek Liep, Phnom Penh', 11.6483923, 104.9074114, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/owIoFxpLqdBx335snlLqFWXHzXh1P2MKva8Z36tR.jpg', 'attendance/checkouts/AM8j3OZT1fHormkrFqJgk6emkP1u84CnsbzECneW.jpg', NULL, 0, NULL, NULL, 552, 'Submitted from web attendance.', NULL, '2026-05-29 08:14:02', '2026-05-29 08:14:02', '2026-05-29 17:26:23'),
(118, 14, 1, '2026-05-29', 'office', 'present', '2026-05-29 08:25:53', '2026-05-29 17:24:45', 11.6483755, 104.9074739, 'Sangkat Prek Liep, Phnom Penh', 11.6483766, 104.9074732, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/0HuFLXdAiY2hyDc2DNhDEMePcIJsMs3N9WWRvjdF.jpg', 'attendance/checkouts/lKI1lGMYK9SK39PpCPh2UQsI19yiU7NSaZQyFWbK.jpg', NULL, 0, NULL, NULL, 539, 'Submitted from web attendance.', NULL, '2026-05-29 08:25:54', '2026-05-29 08:25:54', '2026-05-29 17:24:45'),
(119, 5, 1, '2026-05-29', 'office', 'present', '2026-05-29 08:32:48', '2026-05-29 17:21:56', 11.6484080, 104.9074654, 'Sangkat Prek Liep, Phnom Penh', 11.6484080, 104.9074654, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/u7T23SeSWAgOIJSITusvckbcbc7DbofXjlPw1aIh.jpg', 'attendance/checkouts/WW7vqo6dBQrBG9P4k0AKyOxX4upeAfC8htbz9IRL.jpg', NULL, 0, NULL, NULL, 529, 'Submitted from web attendance.', NULL, '2026-05-29 08:32:48', '2026-05-29 08:32:48', '2026-05-29 17:21:57'),
(120, 9, 1, '2026-05-29', 'office', 'present', '2026-05-29 08:44:41', NULL, 11.6483907, 104.9074531, 'Sangkat Prek Liep, Phnom Penh', NULL, NULL, NULL, 'attendance/selfies/BqMi80As3Y9tP5rMwCi3icQrRhh52B6VaYqwNf43.jpg', NULL, NULL, 0, NULL, NULL, 0, 'Submitted from web attendance.', NULL, '2026-05-29 08:44:42', '2026-05-29 08:44:42', '2026-05-29 08:44:42'),
(121, 15, 1, '2026-05-29', 'office', 'present', '2026-05-29 08:51:07', '2026-05-29 17:22:43', 11.6483651, 104.9074486, 'Sangkat Prek Liep, Phnom Penh', 11.6483519, 104.9074549, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/G0KZmP9rkVpgN9j80ZxSgAN8GBnFxQbO55SZJriV.jpg', 'attendance/checkouts/tRyfnM4GtujKZqW1wqqvDKua5b2i6JpFmi3hVOKE.jpg', NULL, 0, NULL, NULL, 512, 'Submitted from web attendance.', NULL, '2026-05-29 08:51:07', '2026-05-29 08:51:07', '2026-05-29 17:22:43'),
(122, 10, 1, '2026-05-29', 'office', 'present', '2026-05-29 08:56:48', '2026-05-29 17:43:40', 11.6485681, 104.9074844, 'Sangkat Prek Liep, Phnom Penh', 11.6485678, 104.9074845, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/HA3h3s9cZL9M66lxfMjNPqouU0LDZFqjgLdtI8jN.jpg', 'attendance/checkouts/XmoCrmZcHpqGrwY7Rll3Vr0P3Vg6L7DOvqVCDhJh.jpg', NULL, 0, NULL, NULL, 527, 'Submitted from web attendance.', NULL, '2026-05-29 08:56:49', '2026-05-29 08:56:49', '2026-05-29 17:43:40'),
(123, 19, 1, '2026-05-29', 'office', 'late', '2026-05-29 09:04:31', '2026-05-29 17:07:44', 11.6483717, 104.9074894, 'Sangkat Prek Liep, Phnom Penh', 11.6483699, 104.9074803, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/kjeWerbWnpPbvPoXagEXCVyPn2ZXXNdeSAEodI76.jpg', 'attendance/checkouts/rTHUHxBI6ldcuHy0rVEVv1RioTuIP2gcvKJAHD5w.jpg', NULL, 5, NULL, NULL, 483, 'Submitted from web attendance.', NULL, '2026-05-29 09:04:32', '2026-05-29 09:04:32', '2026-05-29 17:07:45'),
(124, 6, 1, '2026-05-29', 'office', 'late', '2026-05-29 09:07:59', '2026-05-29 17:00:38', 11.6484478, 104.9074949, 'Sangkat Prek Liep, Phnom Penh', 11.6483776, 104.9074761, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/llWv1JhBXHr5FgdoW7yuqhEyHSg52PxZisNWINys.jpg', 'attendance/checkouts/N8QGyqzcV7jknpx1VtCcDs3cxeJkUjjMj1oTUN5g.jpg', NULL, 8, NULL, NULL, 473, 'Submitted from web attendance.', NULL, '2026-05-29 09:07:59', '2026-05-29 09:07:59', '2026-05-29 17:00:39');
INSERT INTO `attendance` (`id`, `employee_id`, `branch_id`, `attendance_date`, `type`, `status`, `check_in_at`, `check_out_at`, `check_in_latitude`, `check_in_longitude`, `check_in_address`, `check_out_latitude`, `check_out_longitude`, `check_out_address`, `check_in_photo_path`, `check_out_photo_path`, `qr_code`, `late_minutes`, `deduction_amount`, `deduction_reason`, `work_minutes`, `notes`, `offline_sync_uuid`, `synced_at`, `created_at`, `updated_at`) VALUES
(125, 3, NULL, '2026-05-29', 'office', 'late', '2026-05-29 09:26:29', '2026-05-29 17:24:20', 11.6484130, 104.9074761, 'Sangkat Prek Liep, Phnom Penh', 11.6484056, 104.9074675, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/EyCEjhQwsI8POizqUzidVMswBsyts1ZLi9ovgxG0.jpg', 'attendance/checkouts/t76vD7irVEMv4bbjoGf1GdU2SRzJxn1zRnTnPP6G.jpg', NULL, 27, NULL, NULL, 478, 'Submitted from web attendance.', NULL, '2026-05-29 09:26:30', '2026-05-29 09:26:30', '2026-05-29 17:24:21'),
(126, 13, 1, '2026-05-29', 'office', 'late', '2026-05-29 09:28:54', '2026-05-29 17:44:10', 11.6484283, 104.9074652, 'Sangkat Prek Liep, Phnom Penh', 11.6484466, 104.9074494, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/kLX3XNARZJewYbGL4roLIG4uJaJeCJve2nNQXV8F.jpg', 'attendance/checkouts/U36X40tr1QVRU3cYHZr8qwYYWp2GvUrBRHgWvjMM.jpg', NULL, 29, NULL, NULL, 495, 'Submitted from web attendance.', NULL, '2026-05-29 09:28:55', '2026-05-29 09:28:55', '2026-05-29 17:44:10'),
(127, 12, 1, '2026-05-29', 'office', 'late', '2026-05-29 09:30:17', '2026-05-29 17:45:51', 11.6483501, 104.9074512, 'Sangkat Prek Liep, Phnom Penh', 11.6483501, 104.9074512, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/vdV9wUfYH4qpYDruwk0NzagRvkF7gep86kPiRWNL.jpg', 'attendance/checkouts/XkuDZzOKCVk1erXiqTO7dr1W6WlgCR7UMsKyuUID.jpg', NULL, 31, 1.50, '30 min', 496, 'Submitted from web attendance.', NULL, '2026-05-29 09:30:17', '2026-05-29 09:30:17', '2026-05-29 17:45:52'),
(128, 17, 1, '2026-05-29', 'outdoor', 'late', '2026-05-29 10:24:48', '2026-05-29 18:02:13', 12.4908077, 106.0170391, 'Kracheh, Kratié', 13.5262780, 105.9708525, 'Stueng Traeng, Stung Treng', 'attendance/selfies/JN5CRLeAVYoxo2u3pGkobjOpcRcg2lpR1L5bPUMw.jpg', 'attendance/checkouts/U2SsD8U4SdLqKh5n07cfGL1bv3vJpozPJByxV4PN.jpg', NULL, 85, NULL, NULL, 457, 'Submitted from outdoor sales attendance.', NULL, '2026-05-29 10:24:49', '2026-05-29 10:24:49', '2026-05-29 18:02:14'),
(129, 4, 1, '2026-05-29', 'office', 'present', '2026-05-29 11:40:30', '2026-05-29 22:23:43', 11.6483834, 104.9074621, 'Sangkat Prek Liep, Phnom Penh', 11.6484024, 104.9074448, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/pe2iOaAsPb6VmpbVTfXAYo774aek1dlBQPPcsF4y.jpg', 'attendance/checkouts/7J2dGyOYAXVkrlsU5t7pkqVUZ6oeyS7qzif95BsK.jpg', NULL, 0, NULL, NULL, 643, 'Submitted from web attendance.', NULL, '2026-05-29 11:40:30', '2026-05-29 11:40:30', '2026-05-29 22:23:44'),
(130, 16, 1, '2026-05-30', 'office', 'present', '2026-05-30 08:14:32', '2026-05-30 17:00:33', 11.6483837, 104.9074507, 'Sangkat Prek Liep, Phnom Penh', 11.6484184, 104.9074490, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/pfsgSxISAjQdiMKvHAl49KaSMevyA4kEXRL9jJq4.jpg', 'attendance/checkouts/7xTSGsVlQgLwB28FplB8Tt3EBnW8wntiMa6i7Avu.jpg', NULL, 0, NULL, NULL, 526, 'Submitted from web attendance.', NULL, '2026-05-30 08:14:33', '2026-05-30 08:14:33', '2026-05-30 17:00:34'),
(131, 9, 1, '2026-05-30', 'office', 'present', '2026-05-30 08:26:29', '2026-05-30 18:32:06', 11.6483970, 104.9074754, 'Sangkat Prek Liep, Phnom Penh', 11.6483970, 104.9074754, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/Qxj00Z0h1HVSmRTMQJTfvKVLTbKLABFHLXgnYH3P.jpg', 'attendance/checkouts/evE7LPdu1TPppeJtWEYgHLnPLYBYv1BeTu3xoqXj.jpg', NULL, 0, NULL, NULL, 606, 'Submitted from web attendance.', NULL, '2026-05-30 08:26:30', '2026-05-30 08:26:30', '2026-05-30 18:32:07'),
(132, 14, 1, '2026-05-30', 'office', 'present', '2026-05-30 08:27:14', '2026-05-30 17:35:15', 11.6483780, 104.9074728, 'Sangkat Prek Liep, Phnom Penh', 11.6483908, 104.9074819, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/hyAP0Mrvddo9NEZe3UkjrC6RQFyEhfctHnVrLAOd.jpg', 'attendance/checkouts/Y58bA7FqpwPSRoF5OWLeb98EHaaWN31QmtJbzGrf.jpg', NULL, 0, NULL, NULL, 548, 'Submitted from web attendance.', NULL, '2026-05-30 08:27:14', '2026-05-30 08:27:14', '2026-05-30 17:35:15'),
(133, 15, 1, '2026-05-30', 'office', 'present', '2026-05-30 08:37:40', '2026-05-30 17:32:18', 11.6483519, 104.9074549, 'Sangkat Prek Liep, Phnom Penh', 11.6483341, 104.9074621, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/601dMuI4m2lAmjAKd3339yHTprI2D4jkF5LTDDGs.jpg', 'attendance/checkouts/e4grYHj444pgx4kEEhuNFbv6XdoXeluO1MCYQ5p5.jpg', NULL, 0, NULL, NULL, 535, 'Submitted from web attendance.', NULL, '2026-05-30 08:37:40', '2026-05-30 08:37:40', '2026-05-30 17:32:19'),
(134, 5, 1, '2026-05-30', 'office', 'present', '2026-05-30 08:37:41', '2026-05-30 17:30:33', 11.6484080, 104.9074654, 'Sangkat Prek Liep, Phnom Penh', 11.6484080, 104.9074654, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/C47szeoBcrx6DpX2I4wLfevcon7jzBWXiQppk9ft.jpg', 'attendance/checkouts/46ofeB1KG364ohO2OobPyHNBVgbC5OmyIPvEsfZ6.jpg', NULL, 0, NULL, NULL, 533, 'Submitted from web attendance.', NULL, '2026-05-30 08:37:41', '2026-05-30 08:37:41', '2026-05-30 17:30:33'),
(135, 12, 1, '2026-05-30', 'office', 'present', '2026-05-30 08:40:54', '2026-05-30 19:47:39', 11.6483501, 104.9074512, 'Sangkat Prek Liep, Phnom Penh', 11.6483501, 104.9074512, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/8KjjJGNilBbr7vXUlfN20j2BSGhp8d16uzrI3Juo.jpg', 'attendance/checkouts/izEM1salk4826CBCJ4mwhJr85EnWmDbv38J3IGl3.jpg', NULL, 0, NULL, NULL, 667, 'Submitted from web attendance.', NULL, '2026-05-30 08:40:54', '2026-05-30 08:40:54', '2026-05-30 19:47:39'),
(136, 13, 1, '2026-05-30', 'office', 'present', '2026-05-30 08:51:58', '2026-05-30 19:43:58', 11.6484425, 104.9074518, 'Sangkat Prek Liep, Phnom Penh', 11.6484424, 104.9074518, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/jJJj240WIgzRPqelJvznTDeuB0MpC54zjCfFLpIm.jpg', 'attendance/checkouts/LGrc6rMGJ6ZquhIMfTdU1EqYqggCMSNZa8pgEi7M.jpg', NULL, 0, NULL, NULL, 652, 'Submitted from web attendance.', NULL, '2026-05-30 08:51:58', '2026-05-30 08:51:58', '2026-05-30 19:43:59'),
(137, 10, 1, '2026-05-30', 'office', 'present', '2026-05-30 08:54:31', '2026-05-30 17:19:21', 11.6483331, 104.9074751, 'Sangkat Prek Liep, Phnom Penh', 11.6485348, 104.9074693, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/Icpr4a5L2pJ0IKhfeQTlWTbZ3x37I0ERTTcMdA4u.jpg', 'attendance/checkouts/3v5RFxAgWm4PU1kVBefk2btX5Jokub7fFzeXcbc3.jpg', NULL, 0, NULL, NULL, 505, 'Submitted from web attendance.', NULL, '2026-05-30 08:54:32', '2026-05-30 08:54:32', '2026-05-30 17:19:21'),
(138, 6, 1, '2026-05-30', 'office', 'present', '2026-05-30 08:56:04', '2026-05-30 17:11:54', 11.6483776, 104.9074761, 'Sangkat Prek Liep, Phnom Penh', 11.6483934, 104.9074190, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/15NcF595FIMObLAWlzNPmgrG3fuleGn4fk0pquz6.jpg', 'attendance/checkouts/OQtpBVrllGlmRP0K9ofbettdqSOcxw7EEGNKR7yG.jpg', NULL, 0, NULL, NULL, 496, 'Submitted from web attendance.', NULL, '2026-05-30 08:56:05', '2026-05-30 08:56:05', '2026-05-30 17:11:55'),
(139, 3, NULL, '2026-05-30', 'office', 'late', '2026-05-30 09:24:16', '2026-05-30 17:13:10', 11.6483955, 104.9074935, 'Sangkat Prek Liep, Phnom Penh', 11.6484056, 104.9074703, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/Enbop90nSFdBanB1OAxZmY4cW39y2KBaqyzL7QED.jpg', 'attendance/checkouts/LCT9AJ5Qu0TlSpj4VdE8RfsxyGz1hZz0NK1b1neW.jpg', NULL, 25, NULL, NULL, 469, 'Submitted from web attendance.', NULL, '2026-05-30 09:24:16', '2026-05-30 09:24:16', '2026-05-30 17:13:11'),
(140, 4, 1, '2026-05-30', 'office', 'present', '2026-05-30 10:21:25', NULL, 11.6484375, 104.9074412, 'Sangkat Prek Liep, Phnom Penh', NULL, NULL, NULL, 'attendance/selfies/9NQvGftkTYOnFjTBK5qD3e4UcILRtI1Bm9lyUyFu.jpg', NULL, NULL, 0, NULL, NULL, 0, 'Submitted from web attendance.', NULL, '2026-05-30 10:21:26', '2026-05-30 10:21:26', '2026-05-30 10:21:26'),
(141, 21, 1, '2026-05-30', 'outdoor', 'late', '2026-05-30 10:52:57', NULL, 13.5301403, 105.9722400, 'Stueng Traeng, Stung Treng', NULL, NULL, NULL, 'attendance/selfies/anOCCyzw6Iow26oqPmYJyrTlc3wlN8JxUiT6ANh6.jpg', NULL, NULL, 113, NULL, NULL, 0, 'Submitted from outdoor sales attendance.', NULL, '2026-05-30 10:52:58', '2026-05-30 10:52:58', '2026-05-30 10:52:58'),
(142, 17, 1, '2026-05-30', 'outdoor', 'late', '2026-05-30 10:53:03', '2026-05-30 17:30:06', 13.5300276, 105.9724107, 'Stueng Traeng, Stung Treng', 11.8238504, 106.1867146, 'Memot, Tbong Khmum', 'attendance/selfies/fnQIyIclBV1V8Fz9rqnZUs7TGqj3EtMIdnz9kec3.jpg', 'attendance/checkouts/b8BNw80Rl83Xb0DTefuHHBvXmuzPqNvuFlK2GGXJ.jpg', NULL, 114, NULL, NULL, 397, 'Submitted from outdoor sales attendance.', NULL, '2026-05-30 10:53:04', '2026-05-30 10:53:04', '2026-05-30 17:30:06'),
(143, 16, 1, '2026-05-31', 'office', 'present', '2026-05-31 08:14:27', '2026-05-31 17:37:29', 11.6484048, 104.9072326, 'Sangkat Prek Liep, Phnom Penh', 11.6484046, 104.9074497, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/uQl3DCUI3APmNcsiR9d9m2qrJGvacHON7YkXouYI.jpg', 'attendance/checkouts/VhdTRiSUGH8Mk78DAnC9Bwzi94NxaYWkAlq0wSYM.jpg', NULL, 0, NULL, NULL, 563, 'Submitted from web attendance.', NULL, '2026-05-31 08:14:27', '2026-05-31 08:14:27', '2026-05-31 17:37:30'),
(144, 8, 1, '2026-05-31', 'office', 'present', '2026-05-31 08:21:54', '2026-05-31 17:29:56', 11.6484022, 104.9074088, 'Sangkat Prek Liep, Phnom Penh', 11.6484035, 104.9074216, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/RGh7RfznOftcQDki4jVTH3jCQ8zhXSMfiNsY2vB7.jpg', 'attendance/checkouts/CJiIFlaqZmMStT4TB0STAAMSFfpBYF50jGhLjhNS.jpg', NULL, 0, NULL, NULL, 548, 'Submitted from web attendance.', NULL, '2026-05-31 08:21:54', '2026-05-31 08:21:54', '2026-05-31 17:29:57'),
(145, 10, 1, '2026-05-31', 'office', 'present', '2026-05-31 09:01:00', '2026-05-31 19:04:19', 11.6483361, 104.9074739, 'Sangkat Prek Liep, Phnom Penh', 11.6483387, 104.9074719, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/cK2rMuxT6GWI3ub9kUF0zfE78gd1aNh4JbxwkcZ9.jpg', 'attendance/checkouts/BVOPlzOJrdfDoWLvNzn70alZ6Y0dipKFlBcrVoHx.jpg', NULL, 0, NULL, NULL, 603, 'Submitted from web attendance.', NULL, '2026-05-31 09:01:01', '2026-05-31 09:01:01', '2026-05-31 19:04:20'),
(146, 19, 1, '2026-05-31', 'office', 'present', '2026-05-31 09:28:54', '2026-05-31 17:19:02', 11.6483930, 104.9074812, 'Sangkat Prek Liep, Phnom Penh', 11.6483699, 104.9074803, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/630PXiA21jWPJxl2sIJPfVUl6cUslRpMeh495oXl.jpg', 'attendance/checkouts/ZafnmPxtRpAAiRcMTubDIgxwvaG6VgTqjxpNqqf1.jpg', NULL, 0, NULL, NULL, 470, 'Submitted from web attendance.', NULL, '2026-05-31 09:28:55', '2026-05-31 09:28:55', '2026-05-31 17:19:03'),
(147, 21, 1, '2026-05-31', 'outdoor', 'late', '2026-05-31 09:33:15', NULL, 11.8276688, 106.1809447, 'Memot, Tbong Khmum', NULL, NULL, NULL, 'attendance/selfies/S6e8sAAPV0XT8HBXASCEWrU38K5BqVvcebOE9p8I.jpg', NULL, NULL, 34, NULL, NULL, 0, 'Submitted from outdoor sales attendance.', NULL, '2026-05-31 09:33:15', '2026-05-31 09:33:15', '2026-05-31 09:33:15'),
(148, 17, 1, '2026-05-31', 'outdoor', 'late', '2026-05-31 09:33:40', NULL, 11.8275872, 106.1810685, 'Memot, Tbong Khmum', NULL, NULL, NULL, 'attendance/selfies/2oMhFka7RTHusu6mJz4MWbfdIJNFsJ5v5QT731P0.jpg', NULL, NULL, 34, NULL, NULL, 0, 'Submitted from outdoor sales attendance.', NULL, '2026-05-31 09:33:40', '2026-05-31 09:33:40', '2026-05-31 09:33:40'),
(149, 12, 1, '2026-05-31', 'office', 'present', '2026-05-31 10:16:31', '2026-05-31 19:06:48', 11.6483513, 104.9074515, 'Sangkat Prek Liep, Phnom Penh', 11.6483513, 104.9074515, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/pNEVFv46jv1DgRR3u2c9zw0Whxalb40TG3BkTUG6.jpg', 'attendance/checkouts/0L3Kip7TCx4YNkiuSuE6QMrZSrXSGXR5rwZbfP9b.jpg', NULL, 0, NULL, NULL, 530, 'Submitted from web attendance.', NULL, '2026-05-31 10:16:31', '2026-05-31 10:16:31', '2026-05-31 19:06:49'),
(150, 13, 1, '2026-05-31', 'office', 'present', '2026-05-31 10:45:14', '2026-05-31 19:04:30', 11.6485068, 104.9074807, 'Sangkat Prek Liep, Phnom Penh', 11.6484390, 104.9074591, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/VqhwqnCo9FlKRfUxeQL5rOnkT25VgWpWCKMIO9ct.jpg', 'attendance/checkouts/SMAzOgVXO5SEY9219TYgMy3uQk0Ak8z8As1bIQV3.jpg', NULL, 0, NULL, NULL, 499, 'Submitted from web attendance.', NULL, '2026-05-31 10:45:14', '2026-05-31 10:45:14', '2026-05-31 19:04:31'),
(151, 9, 1, '2026-05-31', 'office', 'late', '2026-05-31 11:33:02', '2026-05-31 19:06:48', 11.6483987, 104.9074742, 'Sangkat Prek Liep, Phnom Penh', 11.6483987, 104.9074742, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/j7F2yT0a3a41gG2NDZms9QwMDc406jQEuTpttr93.jpg', 'attendance/checkouts/y2dQbqZAebVwqDXQSwx48xOl6DILgurCfOkXjDjJ.jpg', NULL, 4, NULL, NULL, 454, 'Submitted from web attendance.', NULL, '2026-05-31 11:33:03', '2026-05-31 11:33:03', '2026-05-31 19:06:48'),
(152, 8, 1, '2026-06-01', 'office', 'present', '2026-06-01 08:10:33', '2026-06-01 17:23:05', 11.6484015, 104.9074273, 'Sangkat Prek Liep, Phnom Penh', 11.6483899, 104.9074294, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/nV5DdC0wmMDVcICsisqIZhZSpctePfMCJe9QEemL.jpg', 'attendance/checkouts/LX2covR5vwb5BKjTPQlKTR6qbvD6skBI7aDgjEnW.jpg', NULL, 0, NULL, NULL, 553, 'Submitted from web attendance.', NULL, '2026-06-01 08:10:33', '2026-06-01 08:10:33', '2026-06-01 17:23:05'),
(153, 9, 1, '2026-06-01', 'office', 'present', '2026-06-01 08:15:25', '2026-06-01 20:06:19', 11.6484327, 104.9074370, 'Sangkat Prek Liep, Phnom Penh', 11.6483987, 104.9074742, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/ISQjqp9LxQz3MR0ybTqvjMz0ezYpvhsmBVXA6Rfc.jpg', 'attendance/checkouts/QVLvzd4TPAvoUgtoR5Yczd9qnIj1DaYqkMKk5OEK.jpg', NULL, 0, NULL, NULL, 711, 'Submitted from web attendance.', NULL, '2026-06-01 08:15:25', '2026-06-01 08:15:25', '2026-06-01 20:06:19'),
(154, 16, 1, '2026-06-01', 'office', 'present', '2026-06-01 08:16:31', '2026-06-01 17:00:54', 11.6484426, 104.9074631, 'Sangkat Prek Liep, Phnom Penh', 11.6484108, 104.9074527, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/29vEUEdefn25Fe7W4ngv3dJOIZji6eIHpMJteR1q.jpg', 'attendance/checkouts/q15VXC5yvrjWKthoUmel0fTc6bijz79aFerl8QK3.jpg', NULL, 0, NULL, NULL, 524, 'Submitted from web attendance.', NULL, '2026-06-01 08:16:31', '2026-06-01 08:16:31', '2026-06-01 17:00:54'),
(155, 14, 1, '2026-06-01', 'office', 'present', '2026-06-01 08:22:17', '2026-06-01 17:37:35', 11.6483914, 104.9074821, 'Sangkat Prek Liep, Phnom Penh', 11.6483914, 104.9074821, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/B0miNciNrNYbGWMX44TXA5nvXkNCKoA1r1AFMDVf.jpg', 'attendance/checkouts/IFUnP233XkY6G16YRTGHwHCpbo62Zcay3hSoI9ql.jpg', NULL, 0, NULL, NULL, 555, 'Submitted from web attendance.', NULL, '2026-06-01 08:22:18', '2026-06-01 08:22:18', '2026-06-01 17:37:37'),
(156, 10, 1, '2026-06-01', 'office', 'present', '2026-06-01 08:39:56', '2026-06-01 19:21:53', 11.6483397, 104.9074716, 'Sangkat Prek Liep, Phnom Penh', 11.6483463, 104.9074686, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/T82cpiTGO0L4F31Ek0ShV1fbRb7hB3e6j6brYM0b.jpg', 'attendance/checkouts/ZTRKAPcS1U0Sk7rWJ5FaX5T5U10aQrcnYVH5dLPa.jpg', NULL, 0, NULL, NULL, 642, 'Submitted from web attendance.', NULL, '2026-06-01 08:39:56', '2026-06-01 08:39:56', '2026-06-01 19:21:54'),
(157, 15, 1, '2026-06-01', 'office', 'present', '2026-06-01 08:45:35', NULL, 11.6483341, 104.9074621, 'Sangkat Prek Liep, Phnom Penh', NULL, NULL, NULL, 'attendance/selfies/XR9FphLcY4ciCj9nKWdXPOSET692BVMqkVHOgKo9.jpg', NULL, NULL, 0, NULL, NULL, 0, 'Submitted from web attendance.', NULL, '2026-06-01 08:45:36', '2026-06-01 08:45:36', '2026-06-01 08:45:36'),
(158, 6, 1, '2026-06-01', 'office', 'present', '2026-06-01 08:55:14', '2026-06-01 17:16:27', 11.6484241, 104.9074379, 'Sangkat Prek Liep, Phnom Penh', 11.6484165, 104.9074173, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/R0IngOu5jp9rVcWHtAPSj7PaYh6uWx1oU9rL2Qr0.jpg', 'attendance/checkouts/leYeecEdcjHQWFoUhqoG7XIx8ZcOfpfbo5cu4RcK.jpg', NULL, 0, NULL, NULL, 501, 'Submitted from web attendance.', NULL, '2026-06-01 08:55:15', '2026-06-01 08:55:15', '2026-06-01 17:16:28'),
(159, 5, 1, '2026-06-01', 'office', 'present', '2026-06-01 08:57:18', '2026-06-01 17:27:47', 11.6484067, 104.9074663, 'Sangkat Prek Liep, Phnom Penh', 11.6484067, 104.9074663, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/XyZWmzLKKMucYjNDBybH3Lq0R2LqTt7FZhPbgRs8.jpg', 'attendance/checkouts/uBJ87ID91DMnT5ceuoQDtSurySn2Fs0WF7GLhlur.jpg', NULL, 0, NULL, NULL, 510, 'Submitted from web attendance.', NULL, '2026-06-01 08:57:18', '2026-06-01 08:57:18', '2026-06-01 17:27:48'),
(160, 12, 1, '2026-06-01', 'office', 'late', '2026-06-01 09:03:40', '2026-06-01 20:03:08', 11.6484063, 104.9074253, 'Sangkat Prek Liep, Phnom Penh', 11.6483513, 104.9074515, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/NpDy5q2XNT0bYTA2rdImSxlSeawEIeXcsIGQyLwL.jpg', 'attendance/checkouts/AwJXNadk9A1znlJCCZt0OVrYr5FoOQnAaRlDnKYp.jpg', NULL, 4, NULL, NULL, 659, 'Submitted from web attendance.', NULL, '2026-06-01 09:03:41', '2026-06-01 09:03:41', '2026-06-01 20:03:09'),
(161, 19, 1, '2026-06-01', 'office', 'late', '2026-06-01 09:08:00', '2026-06-01 16:31:00', 11.6483886, 104.9074745, 'Sangkat Prek Liep, Phnom Penh', NULL, NULL, NULL, 'attendance/selfies/omRxFKeWEAqjTVKBuv9VmIhlfV3l5ozS8qMIv1fy.jpg', NULL, NULL, 9, NULL, NULL, 443, 'Submitted from web attendance.', NULL, '2026-06-01 09:08:58', '2026-06-01 09:08:58', '2026-06-01 16:32:24'),
(162, 3, NULL, '2026-06-01', 'office', 'late', '2026-06-01 09:29:49', '2026-06-01 17:40:52', 11.6484062, 104.9074709, 'Sangkat Prek Liep, Phnom Penh', 11.6484074, 104.9074732, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/mguaji6pUBXj2TVKBztvifJQD7ulK8Wx4fOwUbCq.jpg', 'attendance/checkouts/CHPICT4MRC05VS1AimxEY8Sq2JqbvP588d0ygcA5.jpg', NULL, 30, NULL, NULL, 491, 'Submitted from web attendance.', NULL, '2026-06-01 09:29:49', '2026-06-01 09:29:49', '2026-06-01 17:40:52'),
(163, 13, 1, '2026-06-01', 'office', 'present', '2026-06-01 10:46:46', '2026-06-01 19:19:05', 11.6484157, 104.9074555, 'Sangkat Prek Liep, Phnom Penh', 11.6484157, 104.9074555, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/WhAjW7inyjerTDK93736fDlaQ2BzQiBlSDtJvKA9.jpg', 'attendance/checkouts/qYYVNekMk5reHF72xE1UDf6kRR9BkB8X1L0v3wll.jpg', NULL, 0, NULL, NULL, 512, 'Submitted from web attendance.', NULL, '2026-06-01 10:46:46', '2026-06-01 10:46:46', '2026-06-01 19:19:06'),
(164, 4, 1, '2026-06-01', 'office', 'present', '2026-06-01 11:59:38', '2026-06-01 17:54:43', 11.6484281, 104.9074368, 'Sangkat Prek Liep, Phnom Penh', 11.6484003, 104.9074616, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/32zlqwo8QW9OndwUYuNoiRjX4wPj7qljVLd4hhVo.jpg', 'attendance/checkouts/rdc06BjCeol7jWDftfestuIUi2B0JfxwVq90YEUJ.jpg', NULL, 0, NULL, NULL, 355, 'Submitted from web attendance.', NULL, '2026-06-01 11:59:39', '2026-06-01 11:59:39', '2026-06-01 17:54:44'),
(165, 17, 1, '2026-06-01', 'outdoor', 'late', '2026-06-01 12:23:52', '2026-06-01 17:13:22', 11.6483495, 104.9074710, 'Sangkat Prek Liep, Phnom Penh', 11.6191093, 104.8871987, 'Sangkat Kilomaetr Lekh Prammuoy, Phnom Penh', 'attendance/selfies/qfbwzNZBlnCdWaEEDeSInMbC8HZ94Vofuz557iLC.jpg', 'attendance/checkouts/MiOnz03VlZz5MWiDi6NpoUWLR3rABtLhgy080RDG.jpg', NULL, 204, NULL, NULL, 290, 'Submitted from outdoor sales attendance.', NULL, '2026-06-01 12:23:53', '2026-06-01 12:23:53', '2026-06-01 17:13:23'),
(166, 21, 1, '2026-06-01', 'outdoor', 'late', '2026-06-01 12:23:57', NULL, 11.6483846, 104.9074355, 'Sangkat Prek Liep, Phnom Penh', NULL, NULL, NULL, 'attendance/selfies/GL4hfD1X71wTxRb7k42KBIflFJZMga5wnp5kdI7H.jpg', NULL, NULL, 204, NULL, NULL, 0, 'Submitted from outdoor sales attendance.', NULL, '2026-06-01 12:23:58', '2026-06-01 12:23:58', '2026-06-01 12:23:58'),
(167, 8, 1, '2026-06-02', 'office', 'present', '2026-06-02 08:07:48', '2026-06-02 17:57:19', 11.6484082, 104.9074218, 'Sangkat Prek Liep, Phnom Penh', 11.6484100, 104.9074173, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/VlkbQO6FgTr2EiKryQOFUNWhbVAs86k5vqzy3abx.jpg', 'attendance/checkouts/Bj5lO8BMzHyRXxY7DPfuYHVI2AZqkQIx9HJvLZXs.jpg', NULL, 0, NULL, NULL, 590, 'Submitted from web attendance.', NULL, '2026-06-02 08:07:49', '2026-06-02 08:07:49', '2026-06-02 17:57:20'),
(168, 9, 1, '2026-06-02', 'office', 'present', '2026-06-02 08:17:32', '2026-06-02 18:17:43', 11.6483987, 104.9074742, 'Sangkat Prek Liep, Phnom Penh', 11.6483987, 104.9074742, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/jasi6nJSBB8hiDKPeH49EOlc5HmwR4Q0m1axU7Ft.jpg', 'attendance/checkouts/0ypOqWGMnXADc0OD923d88dvztH8ipc9oYw7elw8.jpg', NULL, 0, NULL, NULL, 600, 'Submitted from web attendance.', NULL, '2026-06-02 08:17:32', '2026-06-02 08:17:32', '2026-06-02 18:17:43'),
(169, 10, 1, '2026-06-02', 'office', 'present', '2026-06-02 08:32:33', '2026-06-02 18:21:38', 11.6483483, 104.9074674, 'Sangkat Prek Liep, Phnom Penh', 11.6483520, 104.9074649, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/GCPGgMCEqbXvMiuBGPGezuJnjR2OAdB3gMj8LCS0.jpg', 'attendance/checkouts/b8ZG5mhiEmwKPDJ4EVMAYqlewSotVCDlYaLz2L6X.jpg', NULL, 0, NULL, NULL, 589, 'Submitted from web attendance.', NULL, '2026-06-02 08:32:34', '2026-06-02 08:32:34', '2026-06-02 18:21:39'),
(170, 14, 1, '2026-06-02', 'office', 'present', '2026-06-02 08:33:06', '2026-06-02 17:21:26', 11.6484471, 104.9074529, 'Sangkat Prek Liep, Phnom Penh', 11.6483802, 104.9074323, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/LQ3zYymRl4g3RNKVCDGP4BNd5FCreQmL2zsYSG7L.jpg', 'attendance/checkouts/VMXFb0twMWRzOtowiDzFsjiPMzL1lO7DJ0XE3r9z.jpg', NULL, 0, NULL, NULL, 528, 'Submitted from web attendance.', NULL, '2026-06-02 08:33:07', '2026-06-02 08:33:07', '2026-06-02 17:21:27'),
(171, 16, 1, '2026-06-02', 'office', 'present', '2026-06-02 08:35:57', '2026-06-02 17:01:42', 11.6483990, 104.9074687, 'Sangkat Prek Liep, Phnom Penh', 11.6484092, 104.9074422, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/kRr4nVT3vgocBwdVjNFVPUj7pQvdCi54FYqYghhx.jpg', 'attendance/checkouts/07QWxMzRS2SoJ6mbGE9zSLAZSRb6tgAsbHueS6GX.jpg', NULL, 0, NULL, NULL, 506, 'Submitted from web attendance.', NULL, '2026-06-02 08:35:57', '2026-06-02 08:35:57', '2026-06-02 17:01:43'),
(172, 15, 1, '2026-06-02', 'office', 'present', '2026-06-02 08:42:20', '2026-06-02 18:30:53', 11.6483562, 104.9074542, 'Sangkat Prek Liep, Phnom Penh', 11.6483474, 104.9074399, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/i8lORb7QvYbySD60GxOAPJ7C3IaMr9JTpJyShYFr.jpg', 'attendance/checkouts/MUhZtBlLHtmEZqSyJoQ2QKmnBaODioPpcBvRrAcl.jpg', NULL, 0, NULL, NULL, 589, 'Submitted from web attendance.', NULL, '2026-06-02 08:42:21', '2026-06-02 08:42:21', '2026-06-02 18:30:53'),
(173, 13, 1, '2026-06-02', 'office', 'present', '2026-06-02 08:52:33', '2026-06-02 20:19:51', 11.6484157, 104.9074555, 'Sangkat Prek Liep, Phnom Penh', 11.6484157, 104.9074555, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/UFyUxVo1cvyHOYxOrombZBnXRiORJVsjq3HADChe.jpg', 'attendance/checkouts/ozbuCSM5SzwKWblfaGkoDC8ko7fV1KjdlMbCMUPR.jpg', NULL, 0, NULL, NULL, 687, 'Submitted from web attendance.', NULL, '2026-06-02 08:52:34', '2026-06-02 08:52:34', '2026-06-02 20:19:52'),
(174, 19, 1, '2026-06-02', 'office', 'present', '2026-06-02 08:52:00', '2026-06-02 16:20:00', 11.6484184, 104.9074263, 'Sangkat Prek Liep, Phnom Penh', NULL, NULL, NULL, 'attendance/selfies/KfL6VMQWhdXoYM2W9WSSFprvDOEr094FKTHbIyP6.jpg', NULL, NULL, 0, NULL, NULL, 448, 'Submitted from web attendance.', NULL, '2026-06-02 08:52:39', '2026-06-02 08:52:39', '2026-06-02 15:56:13'),
(175, 5, 1, '2026-06-02', 'office', 'present', '2026-06-02 08:55:17', '2026-06-02 17:09:04', 11.6484083, 104.9074573, 'Sangkat Prek Liep, Phnom Penh', 11.6484012, 104.9074679, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/obk4lZIGmqiz9ebddRH7aVVMcoKwwAC190kgs2qE.jpg', 'attendance/checkouts/AHPL2J63WKgOCMW6ZyOoL7z04LOWoj2agDuDQsdm.jpg', NULL, 0, NULL, NULL, 494, 'Submitted from web attendance.', NULL, '2026-06-02 08:55:18', '2026-06-02 08:55:18', '2026-06-02 17:09:04'),
(176, 6, 1, '2026-06-02', 'office', 'late', '2026-06-02 09:07:09', '2026-06-02 17:10:54', 11.6483792, 104.9074786, 'Sangkat Prek Liep, Phnom Penh', 11.6483987, 104.9074771, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/LIAOMiAqF4RS5AMYFvZNv489rWswohVz5xdbTR7u.jpg', 'attendance/checkouts/LhzWWnz8oFu7uSWkP1jywL2F95RJ9tb21br4EXbs.jpg', NULL, 8, NULL, NULL, 484, 'Submitted from web attendance.', NULL, '2026-06-02 09:07:10', '2026-06-02 09:07:10', '2026-06-02 17:10:55'),
(177, 3, NULL, '2026-06-02', 'office', 'late', '2026-06-02 09:29:03', '2026-06-02 17:36:39', 11.6484227, 104.9074367, 'Sangkat Prek Liep, Phnom Penh', 11.6483894, 104.9074281, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/hUJlFuqJXEUQbpj1vxP0oCbPnH4dS0CtvBiOa56P.jpg', 'attendance/checkouts/CQtxpMHT7Lh7hgHnblegbz8FBKJjABtcIZKBBYjP.jpg', NULL, 30, NULL, NULL, 488, 'Submitted from web attendance.', NULL, '2026-06-02 09:29:04', '2026-06-02 09:29:04', '2026-06-02 17:36:39'),
(178, 17, 1, '2026-06-02', 'outdoor', 'late', '2026-06-02 11:23:13', '2026-06-02 17:01:52', 11.9381894, 104.7147259, 'Kampong Tralach, Kampong Chhnang', 12.5296300, 104.2201585, 'Krakor, Pursat', 'attendance/selfies/55mR2PEoJf5fVYttzdGEm0CsHz1SDr6Px1Nt1Wct.jpg', 'attendance/checkouts/WpdC24gg2SZZbq2ANEVKNTiF1AKBVdAEKU0kYfxf.jpg', NULL, 144, NULL, NULL, 339, 'Submitted from outdoor sales attendance.', NULL, '2026-06-02 11:23:13', '2026-06-02 11:23:13', '2026-06-02 17:01:53'),
(179, 4, 1, '2026-06-02', 'office', 'present', '2026-06-02 12:10:15', NULL, 11.6484003, 104.9074616, 'Sangkat Prek Liep, Phnom Penh', NULL, NULL, NULL, 'attendance/selfies/1ZR2otFYsRgfZizWFaUCU3HvCkThRVSf15vbDlNO.jpg', NULL, NULL, 0, NULL, NULL, 0, 'Submitted from web attendance.', NULL, '2026-06-02 12:10:16', '2026-06-02 12:10:16', '2026-06-02 12:10:16'),
(180, 21, 1, '2026-06-02', 'outdoor', 'late', '2026-06-02 18:09:06', '2026-06-02 18:09:36', 12.5299635, 104.2202755, 'Krakor, Pursat', 12.5299635, 104.2202755, 'Krakor, Pursat', 'attendance/selfies/b14osk0tQy0QFgVbhrnfJjFUIHZW1KEgFnTsLFRb.jpg', 'attendance/checkouts/ThWuvrCUv1yWQZCeqAfPmi63yaLCRYYQG2jHG5G7.jpg', NULL, 550, NULL, NULL, 1, 'Submitted from outdoor sales attendance.', NULL, '2026-06-02 18:09:06', '2026-06-02 18:09:06', '2026-06-02 18:09:36'),
(181, 12, 1, '2026-06-02', 'office', 'late', '2026-06-02 18:16:13', NULL, 11.6483513, 104.9074515, 'Sangkat Prek Liep, Phnom Penh', NULL, NULL, NULL, 'attendance/selfies/sIsq9JZ6FoSCHr6Qf4BdAPkcoFljVmmBPnMzoDma.jpg', NULL, NULL, 557, 0.00, '1 h 30', 0, 'Submitted from web attendance.', NULL, '2026-06-02 18:16:13', '2026-06-02 18:16:13', '2026-06-02 18:16:13'),
(182, 10, 1, '2026-06-03', 'office', 'present', '2026-06-03 08:16:50', '2026-06-03 17:09:28', 11.6483546, 104.9074632, 'Sangkat Prek Liep, Phnom Penh', 11.6483694, 104.9074532, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/TWiWQ4XqLAJirVVYosQB8912cbEcO30KYVil3W0M.jpg', 'attendance/checkouts/ccbAnsp4wjNGBxLIXoqjoMK75QPqQqXnSpk63wLZ.jpg', NULL, 0, NULL, NULL, 533, 'Submitted from web attendance.', NULL, '2026-06-03 08:16:50', '2026-06-03 08:16:50', '2026-06-03 17:09:29'),
(183, 8, 1, '2026-06-03', 'office', 'present', '2026-06-03 08:20:43', '2026-06-03 17:05:47', 11.6484195, 104.9074338, 'Sangkat Prek Liep, Phnom Penh', 11.6484182, 104.9074370, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/NvrhMOztW2Cxfzk4c5iyeRTa2flMmOVC7d61ifpG.jpg', 'attendance/checkouts/kqNZFexa4wqKojf4bJKCzvZfVgb1PWzb0yiVBldP.jpg', NULL, 0, NULL, NULL, 525, 'Submitted from web attendance.', NULL, '2026-06-03 08:20:43', '2026-06-03 08:20:43', '2026-06-03 17:05:48'),
(184, 9, 1, '2026-06-03', 'office', 'present', '2026-06-03 08:21:54', '2026-06-03 18:45:09', 11.6484021, 104.9074708, 'Sangkat Prek Liep, Phnom Penh', 11.6484021, 104.9074708, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/UABLhiz7mt1fLpYzrNWLgpLA8KLD2L6GXu0HzJLc.jpg', 'attendance/checkouts/XZ3Aegv40Ocz7Un7iOrvK73vTkNs9P1OJUiVf2jc.jpg', NULL, 0, NULL, NULL, 623, 'Submitted from web attendance.', NULL, '2026-06-03 08:21:55', '2026-06-03 08:21:55', '2026-06-03 18:45:10'),
(185, 16, 1, '2026-06-03', 'office', 'present', '2026-06-03 08:27:31', '2026-06-03 17:02:51', 11.6484213, 104.9074385, 'Sangkat Prek Liep, Phnom Penh', 11.6484112, 104.9074398, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/adCpr1JJXqI0GZAmxBgP56bCGR0fW4qi920Dk3cj.jpg', 'attendance/checkouts/pntwBje0YekesZf1DE1Qq0GiZexaPoCElS7rXNik.jpg', NULL, 0, NULL, NULL, 515, 'Submitted from web attendance.', NULL, '2026-06-03 08:27:31', '2026-06-03 08:27:31', '2026-06-03 17:02:52'),
(186, 13, 1, '2026-06-03', 'office', 'present', '2026-06-03 08:42:04', '2026-06-03 18:45:50', 11.6483742, 104.9074471, 'Sangkat Prek Liep, Phnom Penh', 11.6484378, 104.9074557, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/fuT9Uyswsg9ZJYrGXtuOAWIsfCvN2rd8KafLL5vr.jpg', 'attendance/checkouts/Z3fYJLQPCfy6HL1y8D2iDHF2MDv1V1Rc5zLtJurA.jpg', NULL, 0, NULL, NULL, 604, 'Submitted from web attendance.', NULL, '2026-06-03 08:42:04', '2026-06-03 08:42:04', '2026-06-03 18:45:51'),
(187, 15, 1, '2026-06-03', 'office', 'present', '2026-06-03 08:43:07', '2026-06-03 17:59:57', 11.6483474, 104.9074399, 'Sangkat Prek Liep, Phnom Penh', 11.6483453, 104.9074412, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/UlXGRILnbwInkwBZplT5pBsqs914dR0wwAv2skGM.jpg', 'attendance/checkouts/6HoODJgGfz0aCCrdTURgP58M99GYIFOjGpePG8T9.jpg', NULL, 0, NULL, NULL, 557, 'Submitted from web attendance.', NULL, '2026-06-03 08:43:07', '2026-06-03 08:43:07', '2026-06-03 17:59:57'),
(188, 14, 1, '2026-06-03', 'office', 'present', '2026-06-03 08:50:47', '2026-06-03 17:59:56', 11.6483964, 104.9074830, 'Sangkat Prek Liep, Phnom Penh', 11.6483886, 104.9074887, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/TdApj1Vp3MKWKd8EE8ZcrBJ1e4fOEtEqJsJdLpKk.jpg', 'attendance/checkouts/K9eKAo1hrgJAvqvpZdkrQQFDxeYUg8CLihRPLpAF.jpg', NULL, 0, NULL, NULL, 549, 'Submitted from web attendance.', NULL, '2026-06-03 08:50:47', '2026-06-03 08:50:47', '2026-06-03 17:59:57'),
(189, 5, 1, '2026-06-03', 'office', 'present', '2026-06-03 08:57:22', '2026-06-03 17:06:25', 11.6484012, 104.9074679, 'Sangkat Prek Liep, Phnom Penh', 11.6484068, 104.9074699, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/534Z3K7AtKQWMDxkdaAoW3ye9smnio955n9GASlj.jpg', 'attendance/checkouts/nmDJbP2lEeI5l48kxylZRgfw70uT17ZP9ABBGKva.jpg', NULL, 0, NULL, NULL, 489, 'Submitted from web attendance.', NULL, '2026-06-03 08:57:23', '2026-06-03 08:57:23', '2026-06-03 17:06:26'),
(190, 19, 1, '2026-06-03', 'office', 'present', '2026-06-03 08:59:24', '2026-06-03 17:13:25', 11.6483946, 104.9074638, 'Sangkat Prek Liep, Phnom Penh', 11.6483959, 104.9074659, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/PS4I94dx3bQ1gpWgCRyNzIvHweknErTK9SGTzLju.jpg', 'attendance/checkouts/0v0wFgLa1q20tf2DPPECXfPVioS2239NK9IW4vpl.jpg', NULL, 0, NULL, NULL, 494, 'Submitted from web attendance.', NULL, '2026-06-03 08:59:25', '2026-06-03 08:59:25', '2026-06-03 17:13:26'),
(191, 12, 1, '2026-06-03', 'office', 'late', '2026-06-03 09:02:37', '2026-06-03 18:47:22', 11.6483513, 104.9074515, 'Sangkat Prek Liep, Phnom Penh', 11.6483513, 104.9074515, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/YkazGzm3pNXjB0o1o1WmIAsKxgyUUHNdIrl8CnWg.jpg', 'attendance/checkouts/JVoirVr8SL2qlOlGPwcXc0NbZWTktD4hbU8E25NF.jpg', NULL, 3, NULL, NULL, 585, 'Submitted from web attendance.', NULL, '2026-06-03 09:02:38', '2026-06-03 09:02:38', '2026-06-03 18:47:23'),
(192, 6, 1, '2026-06-03', 'office', 'late', '2026-06-03 09:22:37', '2026-06-03 17:04:33', 11.6483792, 104.9074786, 'Sangkat Prek Liep, Phnom Penh', 11.6484287, 104.9074524, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/jxsykfDt3fNHpTIrwQkToXUayNi0jXMOup7uh8oz.jpg', 'attendance/checkouts/f150ghW4g1rAaGp467wEKhzJlJ6647Egtr5PHEqG.jpg', NULL, 23, NULL, NULL, 462, 'Submitted from web attendance.', NULL, '2026-06-03 09:22:37', '2026-06-03 09:22:37', '2026-06-03 17:04:33'),
(193, 3, NULL, '2026-06-03', 'office', 'late', '2026-06-03 09:27:14', '2026-06-03 17:24:27', 11.6483832, 104.9074725, 'Sangkat Prek Liep, Phnom Penh', 11.6484072, 104.9074706, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/FuukQmaDuWLnurYWCHVFmNGGJAO4tRkXNFAaxDsV.jpg', 'attendance/checkouts/6KyyxoMotckxD4SXcVNNV1ODg8CdtcAQ2cS10BGg.jpg', NULL, 28, NULL, NULL, 477, 'Submitted from web attendance.', NULL, '2026-06-03 09:27:14', '2026-06-03 09:27:14', '2026-06-03 17:24:28'),
(194, 4, 1, '2026-06-03', 'office', 'present', '2026-06-03 11:26:38', NULL, 11.6484119, 104.9074471, 'Sangkat Prek Liep, Phnom Penh', NULL, NULL, NULL, 'attendance/selfies/1izFU71MgV5TOnw7aJO6mnzsxKAGRCoMOJNZ2NIB.jpg', NULL, NULL, 0, NULL, NULL, 0, 'Submitted from web attendance.', NULL, '2026-06-03 11:26:38', '2026-06-03 11:26:38', '2026-06-03 11:26:38'),
(195, 17, 1, '2026-06-03', 'outdoor', 'late', '2026-06-03 11:30:50', NULL, 12.5004799, 104.4546260, 'ឆ្នុកទ្រូ, Kampong Chhnang', NULL, NULL, NULL, 'attendance/selfies/aqrkK0EseDIoOh9rqVKZNTKpphVdTAzylJLeCgG6.jpg', NULL, NULL, 151, NULL, NULL, 0, 'Submitted from outdoor sales attendance.', NULL, '2026-06-03 11:30:50', '2026-06-03 11:30:50', '2026-06-03 11:30:50'),
(196, 21, 1, '2026-06-03', 'outdoor', 'late', '2026-06-03 11:38:44', '2026-06-03 21:36:29', 12.5004067, 104.4545877, 'ឆ្នុកទ្រូ, Kampong Chhnang', 12.2893854, 104.1747159, 'Bamnak, Pursat', 'attendance/selfies/Ku9wAZfdlTATtsuYlRFdNj6p7MxD0LNSXCnamx55.jpg', 'attendance/checkouts/97yd8TaOgKmNW8SNmGeU1xqPLibezyOoDuM5uDps.jpg', NULL, 159, NULL, NULL, 598, 'Submitted from outdoor sales attendance.', NULL, '2026-06-03 11:38:45', '2026-06-03 11:38:45', '2026-06-03 21:36:30'),
(197, 9, 1, '2026-06-04', 'office', 'present', '2026-06-04 08:19:59', '2026-06-04 18:51:15', 11.6484418, 104.9074448, 'Sangkat Prek Liep, Phnom Penh', 11.6484021, 104.9074708, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/YzOFaUnd76jc8DPj4eIGjAogpzvnenNo51nJdgap.jpg', 'attendance/checkouts/84oFwTLu5Hv4pfsQBcnztsYvF1TPmbFf4tG92Dl6.jpg', NULL, 0, NULL, NULL, 631, 'Submitted from web attendance.', NULL, '2026-06-04 08:20:00', '2026-06-04 08:20:00', '2026-06-04 18:51:17'),
(198, 16, 1, '2026-06-04', 'office', 'present', '2026-06-04 08:20:10', NULL, 11.6484192, 104.9074357, 'Sangkat Prek Liep, Phnom Penh', NULL, NULL, NULL, 'attendance/selfies/OArF10WKh6jFyXdCRfqcQjrTJOPwPBNkQlsvBYk6.jpg', NULL, NULL, 0, NULL, NULL, 0, 'Submitted from web attendance.', NULL, '2026-06-04 08:20:10', '2026-06-04 08:20:10', '2026-06-04 08:20:10'),
(199, 8, 1, '2026-06-04', 'office', 'present', '2026-06-04 08:22:34', '2026-06-04 17:23:44', 11.6483727, 104.9074561, 'Sangkat Prek Liep, Phnom Penh', 11.6484049, 104.9074440, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/7aQxq988dJ1cfvGQ49I0LbhnPsSYdu1KjrnrqqOu.jpg', 'attendance/checkouts/296prZ8VCN5vvxp5Bw6N9JhzTOOwZ9TQsrcoOBiH.jpg', NULL, 0, NULL, NULL, 541, 'Submitted from web attendance.', NULL, '2026-06-04 08:22:35', '2026-06-04 08:22:35', '2026-06-04 17:23:44'),
(200, 10, 1, '2026-06-04', 'office', 'present', '2026-06-04 08:27:06', '2026-06-04 18:48:57', 11.6485292, 104.9074674, 'Sangkat Prek Liep, Phnom Penh', 11.6485288, 104.9074676, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/fJnS5kOBXY4FQH1hkIyIKU8W2Sh4QBrOGyymI0r7.jpg', 'attendance/checkouts/W489WUk2VniX4BeRR5THv9mWHnbI9QtHZvpC6u4Y.jpg', NULL, 0, NULL, NULL, 622, 'Submitted from web attendance.', NULL, '2026-06-04 08:27:06', '2026-06-04 08:27:06', '2026-06-04 18:48:57'),
(201, 14, 1, '2026-06-04', 'office', 'present', '2026-06-04 08:41:49', '2026-06-04 17:55:17', 11.6484449, 104.9074537, 'Sangkat Prek Liep, Phnom Penh', 11.6483893, 104.9074895, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/OE1QPt8NuVqKqBhkCdJ7ucxYbDWiK5DzMPAxHHOo.jpg', 'attendance/checkouts/P1mbRaVtXdZE3gYfH0IKCwy7zu8q3fCqPBZj0QDo.jpg', NULL, 0, NULL, NULL, 553, 'Submitted from web attendance.', NULL, '2026-06-04 08:41:50', '2026-06-04 08:41:50', '2026-06-04 17:55:18'),
(202, 19, 1, '2026-06-04', 'office', 'present', '2026-06-04 08:54:52', '2026-06-04 17:12:51', 11.6484011, 104.9074492, 'Sangkat Prek Liep, Phnom Penh', 11.6483738, 104.9074789, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/GYY6CLYV3115V6adqBO7rZ7XkWJwfK3QBpiK4lal.jpg', 'attendance/checkouts/ZF0Oj5Hd6JErucyN07lfwcvtX7EUjj9cQYCmuRXG.jpg', NULL, 0, NULL, NULL, 498, 'Submitted from web attendance.', NULL, '2026-06-04 08:54:53', '2026-06-04 08:54:53', '2026-06-04 17:12:51'),
(203, 5, 1, '2026-06-04', 'office', 'present', '2026-06-04 08:55:19', '2026-06-04 17:44:01', 11.6484060, 104.9074702, 'Sangkat Prek Liep, Phnom Penh', 11.6484060, 104.9074702, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/3ZBURpik6htdIevene3rF9kalWuRt3KKWKefEZAb.jpg', 'attendance/checkouts/ryM9IS8tBRyxvmxyXTfefYhtqLQgcGB8n6ALyiEF.jpg', NULL, 0, NULL, NULL, 529, 'Submitted from web attendance.', NULL, '2026-06-04 08:55:20', '2026-06-04 08:55:20', '2026-06-04 17:44:01'),
(204, 6, 1, '2026-06-04', 'office', 'present', '2026-06-04 08:55:45', '2026-06-04 17:40:09', 11.6483786, 104.9075079, 'Sangkat Prek Liep, Phnom Penh', 11.6483792, 104.9074786, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/C0XQBdkci1XBE2n3e99tuJWIx2LI15sPUReQ3ywF.jpg', 'attendance/checkouts/1a8MxpQuOfVpyJxG3FP3Kinkb2RtnW2YpfwWJ6f6.jpg', NULL, 0, NULL, NULL, 524, 'Submitted from web attendance.', NULL, '2026-06-04 08:55:46', '2026-06-04 08:55:46', '2026-06-04 17:40:10'),
(205, 13, 1, '2026-06-04', 'office', 'present', '2026-06-04 08:56:03', '2026-06-04 18:51:48', 11.6484352, 104.9074627, 'Sangkat Prek Liep, Phnom Penh', 11.6484157, 104.9074555, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/eojOIBROW5vVIyPdzboM5KozFJcWMjQfR91NwcLk.jpg', 'attendance/checkouts/jJECklRXBwZuqQyMkNc0lzPu3D1kpJmW9MgRSGM7.jpg', NULL, 0, NULL, NULL, 596, 'Submitted from web attendance.', NULL, '2026-06-04 08:56:03', '2026-06-04 08:56:03', '2026-06-04 18:51:48'),
(206, 15, 1, '2026-06-04', 'office', 'late', '2026-06-04 09:00:27', NULL, 11.6483416, 104.9074413, 'Sangkat Prek Liep, Phnom Penh', NULL, NULL, NULL, 'attendance/selfies/cyBlajNvVluJf9wUv4fZN8WGdYhbDviOR3XWiB7x.jpg', NULL, NULL, 1, NULL, NULL, 0, 'Submitted from web attendance.', NULL, '2026-06-04 09:00:28', '2026-06-04 09:00:28', '2026-06-04 09:00:28'),
(207, 12, 1, '2026-06-04', 'office', 'late', '2026-06-04 09:17:36', '2026-06-04 18:49:25', 11.6483507, 104.9074493, 'Sangkat Prek Liep, Phnom Penh', 11.6483507, 104.9074493, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/Ndtgep1oKwAUdnVf6n82hJBWM657g5URYQ5ODXpF.jpg', 'attendance/checkouts/WF9gBS7ZU7aJpXxvvYi5VPqBPi95yGeXBW4ftMbL.jpg', NULL, 18, NULL, NULL, 572, 'Submitted from web attendance.', NULL, '2026-06-04 09:17:36', '2026-06-04 09:17:36', '2026-06-04 18:49:25'),
(208, 3, NULL, '2026-06-04', 'office', 'late', '2026-06-04 09:27:32', '2026-06-04 17:44:41', 11.6484115, 104.9074824, 'Sangkat Prek Liep, Phnom Penh', 11.6484053, 104.9074719, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/HGlKzP4EcMW1plg3ENabYnVrAHEpOF5kG47uTxOE.jpg', 'attendance/checkouts/Mmkew5q5LGqloXSgqgvPw95YFLnVJb8BxKbxd0xU.jpg', NULL, 28, NULL, NULL, 497, 'Submitted from web attendance.', NULL, '2026-06-04 09:27:33', '2026-06-04 09:27:33', '2026-06-04 17:44:42'),
(209, 21, 1, '2026-06-04', 'outdoor', 'late', '2026-06-04 09:35:30', '2026-06-04 18:38:20', 12.5296441, 104.2203815, 'Krakor, Pursat', 12.3260818, 104.1723231, 'ស្វាយស, Pursat', 'attendance/selfies/FSp3LTiwcBelFmYaBToymcSIZVAdtI0cJYSjqrDx.jpg', 'attendance/checkouts/xP9OjnSKolCGCCWnYPM1xii1F1Bm4NFF4jPraW3v.jpg', NULL, 36, NULL, NULL, 543, 'Submitted from outdoor sales attendance.', NULL, '2026-06-04 09:35:30', '2026-06-04 09:35:30', '2026-06-04 18:38:21'),
(210, 17, 1, '2026-06-04', 'outdoor', 'late', '2026-06-04 10:46:50', NULL, 12.5291233, 104.1718500, 'វាលសម្តេចយស, Pursat', NULL, NULL, NULL, 'attendance/selfies/n3ofaw40cWwZSY0DnvyPr50rElrb4aENbjEsrz0v.jpg', NULL, NULL, 107, NULL, NULL, 0, 'Submitted from outdoor sales attendance.', NULL, '2026-06-04 10:46:50', '2026-06-04 10:46:50', '2026-06-04 10:46:50'),
(211, 8, 1, '2026-06-05', 'office', 'present', '2026-06-05 08:17:51', '2026-06-05 18:08:33', 11.6483651, 104.9074207, 'Sangkat Prek Liep, Phnom Penh', 11.6484097, 104.9074268, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/cb5PUnQyLBwJlr3IoXru01nThip2StXMksxRQFYr.jpg', 'attendance/checkouts/rzSU1DS0iuTxF2EYa0qF4yAqy8XFc8d88A7hYqLQ.jpg', NULL, 0, NULL, NULL, 591, 'Submitted from web attendance.', NULL, '2026-06-05 08:17:51', '2026-06-05 08:17:51', '2026-06-05 18:08:33'),
(212, 9, 1, '2026-06-05', 'office', 'present', '2026-06-05 08:19:54', '2026-06-05 17:52:22', 11.6483817, 104.9074189, 'Sangkat Prek Liep, Phnom Penh', 11.6484021, 104.9074708, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/sWwth91utahchfThvLnZGDNAiq9FKNE2nS1Wu0Ns.jpg', 'attendance/checkouts/2cnVpLArm9cxYpxBT33uekMRLbGDffJXisDEmkaS.jpg', NULL, 0, NULL, NULL, 572, 'Submitted from web attendance.', NULL, '2026-06-05 08:19:55', '2026-06-05 08:19:55', '2026-06-05 17:52:22'),
(213, 10, 1, '2026-06-05', 'office', 'present', '2026-06-05 08:25:55', '2026-06-05 17:55:31', 11.6483738, 104.9074497, 'Sangkat Prek Liep, Phnom Penh', 11.6483751, 104.9074499, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/uzwNuIztQvYUWbqwZ4HXUPMKz9Adb9vd5MuqTKCo.jpg', 'attendance/checkouts/x5p8ZszDJr0WLgQieK0qN3muP1vv2Eb6lskesa2o.jpg', NULL, 0, NULL, NULL, 570, 'Submitted from web attendance.', NULL, '2026-06-05 08:25:56', '2026-06-05 08:25:56', '2026-06-05 17:55:31'),
(214, 14, 1, '2026-06-05', 'office', 'present', '2026-06-05 08:33:20', '2026-06-05 17:38:16', 11.6483897, 104.9074897, 'Sangkat Prek Liep, Phnom Penh', 11.6483897, 104.9074897, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/LObr9krmGla60gJ1uQPXB2o5ethanSjgRM4gh4Z8.jpg', 'attendance/checkouts/pMsjq1I01kGToJTMM4qeS9TpjO1KgzZWkxF0DZGB.jpg', NULL, 0, NULL, NULL, 545, 'Submitted from web attendance.', NULL, '2026-06-05 08:33:20', '2026-06-05 08:33:20', '2026-06-05 17:38:17'),
(215, 16, 1, '2026-06-05', 'office', 'present', '2026-06-05 08:36:26', '2026-06-05 17:04:57', 11.6484277, 104.9074850, 'Sangkat Prek Liep, Phnom Penh', 11.6484118, 104.9074251, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/4r5lo1qohEDEDXGgnToxPaBeyaaGLUnGxx4wJc1m.jpg', 'attendance/checkouts/VWKqyHSMbmCfjLCfi2pQRpoIZvT3tSbhdLZuCqPr.jpg', NULL, 0, NULL, NULL, 509, 'Submitted from web attendance.', NULL, '2026-06-05 08:36:26', '2026-06-05 08:36:26', '2026-06-05 17:04:58'),
(216, 6, 1, '2026-06-05', 'office', 'present', '2026-06-05 08:40:08', '2026-06-05 17:21:16', 11.6484129, 104.9074692, 'Sangkat Prek Liep, Phnom Penh', 11.6483985, 104.9074996, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/2JrxvJx5FSnEsD5Nw9ZndJAtgZLyXO4QW2C7JWyC.jpg', 'attendance/checkouts/Gvpzs0HejWdmUTUoB7aD85FvAjrl2nb2P1clp8aT.jpg', NULL, 0, NULL, NULL, 521, 'Submitted from web attendance.', NULL, '2026-06-05 08:40:09', '2026-06-05 08:40:09', '2026-06-05 17:21:17'),
(217, 17, 1, '2026-06-05', 'outdoor', 'present', '2026-06-05 08:40:41', NULL, 12.5338700, 104.2035367, 'Krakor, Pursat', NULL, NULL, NULL, 'attendance/selfies/1pDNuhpiQ0das0mcBJrfEn0I6RPkfwdpqHQETYXg.jpg', NULL, NULL, 0, NULL, NULL, 0, 'Submitted from outdoor sales attendance.', NULL, '2026-06-05 08:40:42', '2026-06-05 08:40:42', '2026-06-05 08:40:42'),
(218, 15, 1, '2026-06-05', 'office', 'present', '2026-06-05 08:44:26', '2026-06-05 18:18:49', 11.6483510, 104.9074313, 'Sangkat Prek Liep, Phnom Penh', 11.6482958, 104.9074343, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/Y6LjZP4kEMYfA9pSsKd5uWUNgZLyo6c88bZkNDWk.jpg', 'attendance/checkouts/wr38mOP0udnmQ3Ot7t28Q0LfJxXGy67bVMqrbO6g.jpg', NULL, 0, NULL, NULL, 574, 'Submitted from web attendance.', NULL, '2026-06-05 08:44:26', '2026-06-05 08:44:26', '2026-06-05 18:18:50'),
(219, 12, 1, '2026-06-05', 'office', 'present', '2026-06-05 08:45:13', '2026-06-05 18:08:09', 11.6483507, 104.9074493, 'Sangkat Prek Liep, Phnom Penh', 11.6483507, 104.9074493, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/afaig7MFj7z0zHxfoP3RFXSeGMEsJfXtvfTHtj1j.jpg', 'attendance/checkouts/v7vUkLeMeBsL3NEqdNKevEvSQqHUKYGuZLWSYI7i.jpg', NULL, 0, NULL, NULL, 563, 'Submitted from web attendance.', NULL, '2026-06-05 08:45:13', '2026-06-05 08:45:13', '2026-06-05 18:08:10'),
(220, 5, 1, '2026-06-05', 'office', 'present', '2026-06-05 08:53:53', '2026-06-05 17:13:43', 11.6484070, 104.9074598, 'Sangkat Prek Liep, Phnom Penh', 11.6484057, 104.9074697, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/Fy8DGIwJ6iAQd8mZI6e1FCtO8lsB1v7OSDe6pWwl.jpg', 'attendance/checkouts/xelXrHEjtzMuMN1Q2PpfgSRBD1ZUf6z8cdnapw2X.jpg', NULL, 0, NULL, NULL, 500, 'Submitted from web attendance.', NULL, '2026-06-05 08:53:54', '2026-06-05 08:53:54', '2026-06-05 17:13:44'),
(221, 13, 1, '2026-06-05', 'office', 'present', '2026-06-05 08:59:03', NULL, 11.6484157, 104.9074555, 'Sangkat Prek Liep, Phnom Penh', NULL, NULL, NULL, 'attendance/selfies/dFK2PS2vkVD9zLSBwg1zwrbzg9v404fcDijvXsOc.jpg', NULL, NULL, 0, NULL, NULL, 0, 'Submitted from web attendance.', NULL, '2026-06-05 08:59:03', '2026-06-05 08:59:03', '2026-06-05 08:59:03'),
(222, 21, 1, '2026-06-05', 'outdoor', 'late', '2026-06-05 09:04:41', '2026-06-05 19:47:33', 12.5292039, 104.1718917, 'វាលសម្តេចយស, Pursat', 12.4917501, 104.1830902, 'ខ្លាក្រពើ, Pursat', 'attendance/selfies/oxncqtzOzy0aJ0R36SRKnTFGOxgphYzbxIRugxr4.jpg', 'attendance/checkouts/bjJFNLyqrddlEnrfPHCuZ0WuTA6NLhgOqtAJDQD7.jpg', NULL, 5, NULL, NULL, 643, 'Submitted from outdoor sales attendance.', NULL, '2026-06-05 09:04:42', '2026-06-05 09:04:42', '2026-06-05 19:47:34'),
(223, 3, NULL, '2026-06-05', 'office', 'late', '2026-06-05 09:27:58', '2026-06-05 17:29:52', 11.6484565, 104.9074440, 'Sangkat Prek Liep, Phnom Penh', 11.6484017, 104.9074681, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/Fp7D4w3fKf7SDeEyRpIKs04xnB8orK2MooQBtCD3.jpg', 'attendance/checkouts/g3c0agJwotGMbxqXmUr2Lhww9ev0iwSJD2vTFFzU.jpg', NULL, 28, NULL, NULL, 482, 'Submitted from web attendance.', NULL, '2026-06-05 09:27:58', '2026-06-05 09:27:58', '2026-06-05 17:29:52'),
(224, 4, 1, '2026-06-05', 'office', 'present', '2026-06-05 11:46:59', NULL, 11.6484057, 104.9074465, 'Sangkat Prek Liep, Phnom Penh', NULL, NULL, NULL, 'attendance/selfies/g6RjN2acOzNjJPVtMeRbVzrZpktfT1Cuf3dtSblU.jpg', NULL, NULL, 0, NULL, NULL, 0, 'Submitted from web attendance.', NULL, '2026-06-05 11:47:00', '2026-06-05 11:47:00', '2026-06-05 11:47:00'),
(225, 8, 1, '2026-06-06', 'office', 'present', '2026-06-06 08:19:45', '2026-06-06 17:19:21', 11.6484105, 104.9074324, 'Sangkat Prek Liep, Phnom Penh', 11.6484037, 104.9074367, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/NnOUyvAQkprebh39i1fHSJPBSCb507XyIX4pjLxQ.jpg', 'attendance/checkouts/rjPPwyc1qrh6KhSfi1ZBls1Oa9OroRCee5XnDbo1.jpg', NULL, 0, NULL, NULL, 540, 'Submitted from web attendance.', NULL, '2026-06-06 08:19:46', '2026-06-06 08:19:46', '2026-06-06 17:19:22'),
(226, 16, 1, '2026-06-06', 'office', 'present', '2026-06-06 08:22:12', '2026-06-06 17:00:31', 11.6484179, 104.9074253, 'Sangkat Prek Liep, Phnom Penh', 11.6483860, 104.9074456, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/esXkOFWHwAOqVWWU1EovsjdCEynLdKV2yFFelqmg.jpg', 'attendance/checkouts/6nPSnqBBkLBOhPRyNTwqr54n6jCM7bc1ztnPcESt.jpg', NULL, 0, NULL, NULL, 518, 'Submitted from web attendance.', NULL, '2026-06-06 08:22:13', '2026-06-06 08:22:13', '2026-06-06 17:00:32'),
(227, 9, 1, '2026-06-06', 'office', 'present', '2026-06-06 08:23:35', '2026-06-06 18:54:46', 11.6484030, 104.9074687, 'Sangkat Prek Liep, Phnom Penh', 11.6484038, 104.9074681, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/SW3nHMucYgXLjKxAQQmr0blB1jFTy7KucuqIYXnz.jpg', 'attendance/checkouts/eRdJAUNTPzgm38HfOHCxbwBIcCAQZyCsjwIJMcLE.jpg', NULL, 0, NULL, NULL, 631, 'Submitted from web attendance.', NULL, '2026-06-06 08:23:35', '2026-06-06 08:23:35', '2026-06-06 18:54:46'),
(228, 14, 1, '2026-06-06', 'office', 'present', '2026-06-06 08:30:45', '2026-06-06 17:55:17', 11.6483907, 104.9074887, 'Sangkat Prek Liep, Phnom Penh', 11.6483762, 104.9074863, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/3y8kXjpMlO3cz86Z78pPg5WGMAl1hWpOzSTNThDs.jpg', 'attendance/checkouts/4ohxafAAnWARmLJRA0CZNikJXTN6sj6mF5VNy2kf.jpg', NULL, 0, NULL, NULL, 565, 'Submitted from web attendance.', NULL, '2026-06-06 08:30:46', '2026-06-06 08:30:46', '2026-06-06 17:55:17'),
(229, 5, 1, '2026-06-06', 'office', 'present', '2026-06-06 08:31:09', '2026-06-06 17:08:44', 11.6484057, 104.9074697, 'Sangkat Prek Liep, Phnom Penh', 11.6483964, 104.9074579, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/g10VnW4kZG2hWHKtHyvWsXhdSC1kI64X6MzZyH2G.jpg', 'attendance/checkouts/iTy6sS64UeIFhuvxe3abtrvYghsPDkMzSdygnHgO.jpg', NULL, 0, NULL, NULL, 518, 'Submitted from web attendance.', NULL, '2026-06-06 08:31:09', '2026-06-06 08:31:09', '2026-06-06 17:08:45'),
(230, 10, 1, '2026-06-06', 'office', 'present', '2026-06-06 08:48:32', '2026-06-06 18:33:43', 11.6483848, 104.9074295, 'Sangkat Prek Liep, Phnom Penh', 11.6484097, 104.9074618, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/4gXXrFTBlF88Pzcaj0elZHrQsZrnpOGA5pN3RTQi.jpg', 'attendance/checkouts/IMeScYjcxkRfkTtM3WKNATxgDMMtXB0D3boRHAn0.jpg', NULL, 0, NULL, NULL, 585, 'Submitted from web attendance.', NULL, '2026-06-06 08:48:32', '2026-06-06 08:48:32', '2026-06-06 18:33:44'),
(231, 15, 1, '2026-06-06', 'office', 'late', '2026-06-06 09:00:22', '2026-06-06 18:55:13', 11.6482958, 104.9074343, 'Sangkat Prek Liep, Phnom Penh', 11.6482978, 104.9074304, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/KDpsFfWrFQtyPjRAWPZ17FJEE7oRsYdl8ZwGk8th.jpg', 'attendance/checkouts/TF9Ws93SWqi6eo2TTHoJfFO7IYWlFj8WHhNLV4x0.jpg', NULL, 1, NULL, NULL, 595, 'Submitted from web attendance.', NULL, '2026-06-06 09:00:23', '2026-06-06 09:00:23', '2026-06-06 18:55:13'),
(232, 4, 1, '2026-06-06', 'office', 'present', '2026-06-06 09:03:56', NULL, 11.6484780, 104.9074336, 'Sangkat Prek Liep, Phnom Penh', NULL, NULL, NULL, 'attendance/selfies/KsYnRXNpq5VppQ1DuEodKpmLazbMeC2i2DUuwbQW.jpg', NULL, NULL, 0, NULL, NULL, 0, 'Submitted from web attendance.', NULL, '2026-06-06 09:03:57', '2026-06-06 09:03:57', '2026-06-06 09:03:57');
INSERT INTO `attendance` (`id`, `employee_id`, `branch_id`, `attendance_date`, `type`, `status`, `check_in_at`, `check_out_at`, `check_in_latitude`, `check_in_longitude`, `check_in_address`, `check_out_latitude`, `check_out_longitude`, `check_out_address`, `check_in_photo_path`, `check_out_photo_path`, `qr_code`, `late_minutes`, `deduction_amount`, `deduction_reason`, `work_minutes`, `notes`, `offline_sync_uuid`, `synced_at`, `created_at`, `updated_at`) VALUES
(233, 13, 1, '2026-06-06', 'office', 'late', '2026-06-06 09:09:02', '2026-06-06 18:52:55', 11.6484268, 104.9074177, 'Sangkat Prek Liep, Phnom Penh', 11.6484157, 104.9074555, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/opWjcFe8NlorIKWLjXqKboazyksIT0bSGlNdqNky.jpg', 'attendance/checkouts/OVxrMVIWIyg2d9MEzLb6rOCY8ZAI3s7ZfNehZctQ.jpg', NULL, 10, NULL, NULL, 584, 'Submitted from web attendance.', NULL, '2026-06-06 09:09:02', '2026-06-06 09:09:02', '2026-06-06 18:52:56'),
(234, 12, 1, '2026-06-06', 'office', 'late', '2026-06-06 09:09:54', '2026-06-06 18:54:49', 11.6483902, 104.9074835, 'Sangkat Prek Liep, Phnom Penh', 11.6483507, 104.9074493, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/mPbr0S0R6Y3cq6WFu6gHnDBvTj4UWKUScgc4hiHO.jpg', 'attendance/checkouts/AZZqlewQKGsIYZT4RrDoavQGjmwtGytr9TJjUWMA.jpg', NULL, 10, NULL, NULL, 585, 'Submitted from web attendance.', NULL, '2026-06-06 09:09:55', '2026-06-06 09:09:55', '2026-06-06 18:54:49'),
(235, 3, NULL, '2026-06-06', 'office', 'late', '2026-06-06 09:34:39', '2026-06-06 17:14:49', 11.6484009, 104.9074712, 'Sangkat Prek Liep, Phnom Penh', 11.6483999, 104.9074692, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/N8Pu01L5wb44SfC9MPISFd08iozJDbYyEV16dEuu.jpg', 'attendance/checkouts/OTIJQpjZUIVud1e6Y7wu7gpH9iy3oQaYikN9v9At.jpg', NULL, 35, 1.50, '30 min', 460, 'Submitted from web attendance.', NULL, '2026-06-06 09:34:40', '2026-06-06 09:34:40', '2026-06-06 17:14:49'),
(236, 21, 1, '2026-06-06', 'outdoor', 'late', '2026-06-06 10:04:42', '2026-06-06 19:19:03', 12.5331199, 104.2067231, 'Krakor, Pursat', 12.5309792, 104.2210464, 'Krakor, Pursat', 'attendance/selfies/bP4BGPSor5byZuTh6t08kFMcFRURVOjwq9g6Priu.jpg', 'attendance/checkouts/jNDMX7piQ8JH715WKZoyIJcS8cXeuMVVAPzeODO0.jpg', NULL, 65, NULL, NULL, 554, 'Submitted from outdoor sales attendance.', NULL, '2026-06-06 10:04:43', '2026-06-06 10:04:43', '2026-06-06 19:19:03'),
(237, 17, 1, '2026-06-06', 'outdoor', 'late', '2026-06-06 11:04:54', NULL, 12.5848703, 103.9566674, 'វត្តពោធិ៍, Pursat', NULL, NULL, NULL, 'attendance/selfies/110nLSvSwS18pvDPZ8bf8ETtcvmbt9h5b5WfRD5s.jpg', NULL, NULL, 125, NULL, NULL, 0, 'Submitted from outdoor sales attendance.', NULL, '2026-06-06 11:04:55', '2026-06-06 11:04:55', '2026-06-06 11:04:55'),
(238, 17, 1, '2026-06-07', 'outdoor', 'present', '2026-06-07 07:39:09', NULL, 12.5296045, 104.2201251, 'Krakor, Pursat', NULL, NULL, NULL, 'attendance/selfies/WWQCytBw7p1ey2py8pDgsA3BJQm0kDC0zpSOdxzX.jpg', NULL, NULL, 0, NULL, NULL, 0, 'Submitted from outdoor sales attendance.', NULL, '2026-06-07 07:39:09', '2026-06-07 07:39:09', '2026-06-07 07:39:09'),
(239, 8, 1, '2026-06-07', 'office', 'present', '2026-06-07 08:21:42', '2026-06-07 17:03:11', 11.6484715, 104.9074524, 'Sangkat Prek Liep, Phnom Penh', 11.6484230, 104.9074401, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/RflfpE939xFgCcR5OmNCWFYoaGaepiZbGHAhjYDd.jpg', 'attendance/checkouts/Ux4ZNy8oSfC37LilD8qV04ORt8MMLZHYRc4CxFN0.jpg', NULL, 0, NULL, NULL, 521, 'Submitted from web attendance.', NULL, '2026-06-07 08:21:43', '2026-06-07 08:21:43', '2026-06-07 17:03:12'),
(240, 16, 1, '2026-06-07', 'office', 'present', '2026-06-07 08:31:56', '2026-06-07 17:00:35', 11.6484420, 104.9072688, 'Sangkat Prek Liep, Phnom Penh', 11.6484043, 104.9074357, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/FuJKN47GDkuPNzBShRUQQxIvhooCeDYf158uZFjV.jpg', 'attendance/checkouts/l93snNTH4xp03EguL5lqnug2HLxnIfUVcsid4XAy.jpg', NULL, 0, NULL, NULL, 509, 'Submitted from web attendance.', NULL, '2026-06-07 08:31:57', '2026-06-07 08:31:57', '2026-06-07 17:00:35'),
(241, 9, 1, '2026-06-07', 'office', 'present', '2026-06-07 09:20:29', '2026-06-07 17:18:18', 11.6484258, 104.9074449, 'Sangkat Prek Liep, Phnom Penh', 11.6484038, 104.9074681, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/TKBDFwQMPVy86XQmMfdc2pvWWDhzm3lnEb66Dlob.jpg', 'attendance/checkouts/b3UyW9DniQrPRCZ3Gq3kHZd6Y06nuKFDFYBD8c8k.jpg', NULL, 0, NULL, NULL, 478, 'Submitted from web attendance.', NULL, '2026-06-07 09:20:30', '2026-06-07 09:20:30', '2026-06-07 17:18:19'),
(242, 21, 1, '2026-06-07', 'outdoor', 'late', '2026-06-07 09:48:46', '2026-06-07 18:39:26', 12.5290124, 104.1682775, 'វាលសម្តេចយស, Pursat', 12.9003598, 103.3692781, 'Prey Toch, Battambang', 'attendance/selfies/hFK9eOxlEx9UyW9pfSLwfFsmqPSD0yKfPCPKtmaH.jpg', 'attendance/checkouts/xUnxcBovh3sD6PZGcx0lXAR4VjSIIyLG6EI3JhKa.jpg', NULL, 49, NULL, NULL, 531, 'Submitted from outdoor sales attendance.', NULL, '2026-06-07 09:48:47', '2026-06-07 09:48:47', '2026-06-07 18:39:26'),
(243, 19, 1, '2026-06-07', 'office', 'present', '2026-06-07 10:59:23', '2026-06-07 17:01:21', 11.6484197, 104.9074511, 'Sangkat Prek Liep, Phnom Penh', 11.6483726, 104.9074783, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/JfaIZAjmUQjmlbGtijVLkkAKcKnQhFvujN73GldE.jpg', 'attendance/checkouts/Gaij8RzvNgdnpf8xggJuTYYT02hgwHvhEU8W0hym.jpg', NULL, 0, NULL, NULL, 362, 'Submitted from web attendance.', NULL, '2026-06-07 10:59:24', '2026-06-07 10:59:24', '2026-06-07 17:01:22'),
(244, 13, 1, '2026-06-07', 'office', 'present', '2026-06-07 11:05:43', '2026-06-07 17:17:53', 11.6484157, 104.9074555, 'Sangkat Prek Liep, Phnom Penh', 11.6484157, 104.9074555, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/bE4YTguSUq8Is2WkIlqVKkTJ1ym41vHa7OcDk12v.jpg', 'attendance/checkouts/XYngxXC0Z5lSaqKnGr2Fp47ZnlvEhVMFagkhVaTR.jpg', NULL, 0, NULL, NULL, 372, 'Submitted from web attendance.', NULL, '2026-06-07 11:05:43', '2026-06-07 11:05:43', '2026-06-07 17:17:54'),
(245, 16, 1, '2026-06-08', 'office', 'present', '2026-06-08 08:00:41', '2026-06-08 17:06:43', 11.6484416, 104.9074802, 'Sangkat Prek Liep, Phnom Penh', 11.6483916, 104.9074411, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/v9CU9ZtIDTfWc3pR1Ho9YkGkomPzQNbr261Exdl3.jpg', 'attendance/checkouts/I2i9vZ7Hh775oEvKiiktvNI1k6YD6DpHDoXNcusK.jpg', NULL, 0, NULL, NULL, 546, 'Submitted from web attendance.', NULL, '2026-06-08 08:00:42', '2026-06-08 08:00:42', '2026-06-08 17:06:44'),
(246, 8, 1, '2026-06-08', 'office', 'present', '2026-06-08 08:28:00', '2026-06-08 17:09:08', 11.6484296, 104.9074503, 'Sangkat Prek Liep, Phnom Penh', 11.6484167, 104.9074350, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/bBi2J1l8g8UCd9ix8cM8oNUfa8uuZMqSpEGB0uUb.jpg', 'attendance/checkouts/qkZQJWoTAm08g9BVpB9bAOXV1Uq3rigCMS2HpuZa.jpg', NULL, 0, NULL, NULL, 521, 'Submitted from web attendance.', NULL, '2026-06-08 08:28:00', '2026-06-08 08:28:00', '2026-06-08 17:09:09'),
(247, 21, 1, '2026-06-08', 'outdoor', 'present', '2026-06-08 08:29:49', '2026-06-08 17:32:43', 12.9124019, 103.3646921, 'Koun Khlong, Battambang', 13.1014045, 103.1629001, 'Phum Ou Char, Battambang', 'attendance/selfies/jxCHDkseVYVJHQ0u1s0xXLcLoIa81QVC9yKz3t8S.jpg', 'attendance/checkouts/3hlcSskGUcz4idQPc56WuhfQh0x0fMbVuiyFaD4U.jpg', NULL, 0, NULL, NULL, 543, 'Submitted from outdoor sales attendance.', NULL, '2026-06-08 08:29:49', '2026-06-08 08:29:49', '2026-06-08 17:32:44'),
(248, 9, 1, '2026-06-08', 'office', 'present', '2026-06-08 08:35:15', '2026-06-08 17:08:27', 11.6484038, 104.9074681, 'Sangkat Prek Liep, Phnom Penh', 11.6484038, 104.9074681, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/jcUljalTzWNS5qYJPCZbBPvrW54yHxsCSYWguLJ1.jpg', 'attendance/checkouts/FEU7FtbcRITZxxkKS91DLh4RMANWk16R3Na6w58P.jpg', NULL, 0, NULL, NULL, 513, 'Submitted from web attendance.', NULL, '2026-06-08 08:35:16', '2026-06-08 08:35:16', '2026-06-08 17:08:28'),
(249, 5, 1, '2026-06-08', 'office', 'present', '2026-06-08 08:39:12', '2026-06-08 17:13:24', 11.6483960, 104.9074600, 'Sangkat Prek Liep, Phnom Penh', 11.6484020, 104.9074580, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/pbnxhPGW9uX2Nf8lbC50l2iet5oTdWmah9kKbDIX.jpg', 'attendance/checkouts/esKED0vwTDMTSHcYOyCSnu40XinZxHZWMylFaxAl.jpg', NULL, 0, NULL, NULL, 514, 'Submitted from web attendance.', NULL, '2026-06-08 08:39:12', '2026-06-08 08:39:12', '2026-06-08 17:13:24'),
(250, 14, 1, '2026-06-08', 'office', 'present', '2026-06-08 08:41:01', '2026-06-08 17:43:53', 11.6483762, 104.9074862, 'Sangkat Prek Liep, Phnom Penh', 11.6483760, 104.9074865, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/xScFKCTEne2Gc2BVeHgXmZbkUVZPFPr6uYfAv5fK.jpg', 'attendance/checkouts/Od9b8PcHKHXTquKuUhklncX2uFsdfR8MydDF0aon.jpg', NULL, 0, NULL, NULL, 543, 'Submitted from web attendance.', NULL, '2026-06-08 08:41:02', '2026-06-08 08:41:02', '2026-06-08 17:43:53'),
(251, 12, 1, '2026-06-08', 'office', 'present', '2026-06-08 08:51:42', '2026-06-08 19:27:28', 11.6483484, 104.9074483, 'Sangkat Prek Liep, Phnom Penh', 11.6483484, 104.9074483, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/H0bijuhF5pKAgF9OjAUKEnoaLRijcOcEouP7EefA.jpg', 'attendance/checkouts/GrlPzMpAlXUA5ZqjwK6PaXl8BN4ZBlnBXyLWsZPY.jpg', NULL, 0, NULL, NULL, 636, 'Submitted from web attendance.', NULL, '2026-06-08 08:51:42', '2026-06-08 08:51:42', '2026-06-08 19:27:29'),
(252, 15, 1, '2026-06-08', 'office', 'present', '2026-06-08 08:57:01', '2026-06-08 17:42:48', 11.6483662, 104.9074134, 'Sangkat Prek Liep, Phnom Penh', 11.6483100, 104.9074173, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/HTxlt1HPXBXkOqxLoLMaKuaTllNSp3SJqBq6xq8s.jpg', 'attendance/checkouts/DktlL4LqC3BXxf8pm0cDfRYjq6tVdA9zrKdubZ0b.jpg', NULL, 0, NULL, NULL, 526, 'Submitted from web attendance.', NULL, '2026-06-08 08:57:01', '2026-06-08 08:57:01', '2026-06-08 17:42:48'),
(253, 13, 1, '2026-06-08', 'office', 'late', '2026-06-08 09:02:08', '2026-06-08 19:26:16', 11.6484175, 104.9074186, 'Sangkat Prek Liep, Phnom Penh', 11.6484157, 104.9074555, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/f9Y28xyS7457F4pwDbjEytcrLTYqV8fD9eOF8MO8.jpg', 'attendance/checkouts/ulMrUE7WJILK2yBK5FYN8ID0kfoW3QUk02YFk6kV.jpg', NULL, 3, NULL, NULL, 624, 'Submitted from web attendance.', NULL, '2026-06-08 09:02:09', '2026-06-08 09:02:09', '2026-06-08 19:26:17'),
(254, 19, 1, '2026-06-08', 'office', 'late', '2026-06-08 09:07:00', '2026-06-08 16:40:00', 11.6484044, 104.9074528, 'Sangkat Prek Liep, Phnom Penh', NULL, NULL, NULL, 'attendance/selfies/MrGFWXKoTBSn5UrNmpsxP2lLOhNRSufvFghmK6WF.jpg', NULL, NULL, 8, NULL, NULL, 453, 'Submitted from web attendance.', NULL, '2026-06-08 09:07:53', '2026-06-08 09:07:53', '2026-06-08 16:38:53'),
(255, 6, 1, '2026-06-08', 'office', 'late', '2026-06-08 09:14:30', '2026-06-08 17:19:07', 11.6483696, 104.9075509, 'Sangkat Prek Liep, Phnom Penh', 11.6483792, 104.9074786, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/XGwJHiK8DvykqmtO3UUxUxVnOPpVJy07e3pKQkPC.jpg', 'attendance/checkouts/q7pmsHwEUyaTevjq5MzlnsiSdTsvQBNaW2CpMeTC.jpg', NULL, 15, NULL, NULL, 485, 'Submitted from web attendance.', NULL, '2026-06-08 09:14:30', '2026-06-08 09:14:30', '2026-06-08 17:19:08'),
(256, 3, NULL, '2026-06-08', 'office', 'late', '2026-06-08 09:33:05', '2026-06-08 17:27:21', 11.6483999, 104.9074685, 'Sangkat Prek Liep, Phnom Penh', 11.6483978, 104.9074668, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/pXUo46AjzhLKtBYdcNjXHjbkWipYBLgXIBo0C9EG.jpg', 'attendance/checkouts/brAH1FpP31otZj05hyv7poRE5ONte6O7mfn339Oj.jpg', NULL, 34, 1.50, '30 min', 474, 'Submitted from web attendance.', NULL, '2026-06-08 09:33:05', '2026-06-08 09:33:05', '2026-06-08 17:27:21'),
(257, 4, 1, '2026-06-08', 'office', 'present', '2026-06-08 11:31:53', '2026-06-08 17:27:39', 11.6484343, 104.9074408, 'Sangkat Prek Liep, Phnom Penh', 11.6484014, 104.9074589, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/UwcJQofVerPkhtp9XqQGdT6kdxQCqzSLuuUboAgx.jpg', 'attendance/checkouts/CMPXWylu6VsRcDBnHxHk281NYUzfLdeseU350dnw.jpg', NULL, 0, NULL, NULL, 356, 'Submitted from web attendance.', NULL, '2026-06-08 11:31:54', '2026-06-08 11:31:54', '2026-06-08 17:27:39'),
(258, 17, 1, '2026-06-08', 'outdoor', 'late', '2026-06-08 14:22:52', NULL, 13.1013801, 103.1628435, 'Phum Ou Char, Battambang', NULL, NULL, NULL, 'attendance/selfies/fUyJyTZzIeH42n2YEnOleLCQXzLAMSengx2N8LBM.jpg', NULL, NULL, 323, NULL, NULL, 0, 'Submitted from outdoor sales attendance.', NULL, '2026-06-08 14:22:52', '2026-06-08 14:22:52', '2026-06-08 14:22:52'),
(259, 8, 1, '2026-06-09', 'office', 'present', '2026-06-09 08:20:58', '2026-06-09 17:07:29', 11.6484242, 104.9074491, 'Sangkat Prek Liep, Phnom Penh', 11.6483999, 104.9074235, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/cE7qRBSn4rTjVL5nKjhoIpQIDmrE4D2nZDhm79wU.jpg', 'attendance/checkouts/pi12b1mgYzjwAZsHvVWYcDzZQ2T1PYWDtKxSX3C3.jpg', NULL, 0, NULL, NULL, 527, 'Submitted from web attendance.', NULL, '2026-06-09 08:20:58', '2026-06-09 08:20:58', '2026-06-09 17:07:30'),
(260, 9, 1, '2026-06-09', 'office', 'present', '2026-06-09 08:29:48', '2026-06-09 19:32:30', 11.6484056, 104.9074416, 'Sangkat Prek Liep, Phnom Penh', 11.6484038, 104.9074681, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/v1o5tb4MDfiEulrR6zaM2nFcJ167aC2W1g1LgUmX.jpg', 'attendance/checkouts/7nTYo0zwT5d3bu4AL8WGF3on8i0pbuf3SswnsEBG.jpg', NULL, 0, NULL, NULL, 663, 'Submitted from web attendance.', NULL, '2026-06-09 08:29:49', '2026-06-09 08:29:49', '2026-06-09 19:32:31'),
(261, 16, 1, '2026-06-09', 'office', 'present', '2026-06-09 08:32:17', '2026-06-09 17:01:19', 11.6484178, 104.9074329, 'Sangkat Prek Liep, Phnom Penh', 11.6484015, 104.9074427, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/10XdcinI2QXcYEamT5qjh7TMzUKpPPOzZreGcrFQ.jpg', 'attendance/checkouts/xr2XcYfg9pZlur8P3oQ1CMPqm6BmGW3wYy7YOCZs.jpg', NULL, 0, NULL, NULL, 509, 'Submitted from web attendance.', NULL, '2026-06-09 08:32:18', '2026-06-09 08:32:18', '2026-06-09 17:01:19'),
(262, 15, 1, '2026-06-09', 'office', 'present', '2026-06-09 08:44:34', '2026-06-09 18:25:00', 11.6483980, 104.9074494, 'Sangkat Prek Liep, Phnom Penh', 11.6483542, 104.9074238, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/Q1lJ8sEGu5Qe6c4jLmnk3k7ArPChxajBZbyUN7O9.jpg', 'attendance/checkouts/PzXijduRhYTRktzCm0jyIawqlKsflQrortbFOsSy.jpg', NULL, 0, NULL, NULL, 580, 'Submitted from web attendance.', NULL, '2026-06-09 08:44:34', '2026-06-09 08:44:34', '2026-06-09 18:25:00'),
(263, 19, 1, '2026-06-09', 'office', 'present', '2026-06-09 08:53:12', '2026-06-09 17:06:42', 11.6483782, 104.9075181, 'Sangkat Prek Liep, Phnom Penh', 11.6483726, 104.9074783, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/GACzqWXGxNkIdncJQxrCyCptCJaOxlwjpQqkXeiZ.jpg', 'attendance/checkouts/x8iMlFX9DogId7jKcesBL3MZDXY5RA9vVSQJEnyD.jpg', NULL, 0, NULL, NULL, 494, 'Submitted from web attendance.', NULL, '2026-06-09 08:53:12', '2026-06-09 08:53:12', '2026-06-09 17:06:42'),
(264, 13, 1, '2026-06-09', 'office', 'present', '2026-06-09 08:55:44', '2026-06-09 19:35:36', 11.6484517, 104.9074953, 'Sangkat Prek Liep, Phnom Penh', 11.6484157, 104.9074555, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/lmBuBsGEdFMEI2TFHr3CmOlT8cHWgTVJhhs7EASy.jpg', 'attendance/checkouts/mMAXPy98QmYchIc7hVS5yNHBzlv8SClgpCtKs7Pd.jpg', NULL, 0, NULL, NULL, 640, 'Submitted from web attendance.', NULL, '2026-06-09 08:55:45', '2026-06-09 08:55:45', '2026-06-09 19:35:37'),
(265, 5, 1, '2026-06-09', 'office', 'present', '2026-06-09 08:59:18', '2026-06-09 17:43:08', 11.6484018, 104.9074581, 'Sangkat Prek Liep, Phnom Penh', 11.6484041, 104.9074697, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/Fp8yZNLY4ZaBw9NLIdDRep9fvAQuRJ4Q8hbAiR4S.jpg', 'attendance/checkouts/mtYHsPxMAAQMfK8pLCj5pTGM8SE2ZPmhXaUazk1v.jpg', NULL, 0, NULL, NULL, 524, 'Submitted from web attendance.', NULL, '2026-06-09 08:59:19', '2026-06-09 08:59:19', '2026-06-09 17:43:08'),
(266, 6, 1, '2026-06-09', 'office', 'present', '2026-06-09 08:59:25', '2026-06-09 17:27:56', 11.6483968, 104.9074808, 'Sangkat Prek Liep, Phnom Penh', 11.6483968, 104.9074808, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/20GjIXzERDXmRbaCwyTbdaLtjjHVlnXDIpliKv3j.jpg', 'attendance/checkouts/ldQpwXDbj0CCQmgIybaAPBqxsZf3OLtgG5Out9lW.jpg', NULL, 0, NULL, NULL, 509, 'Submitted from web attendance.', NULL, '2026-06-09 08:59:26', '2026-06-09 08:59:26', '2026-06-09 17:27:56'),
(267, 12, 1, '2026-06-09', 'office', 'late', '2026-06-09 09:00:58', '2026-06-09 19:36:07', 11.6483749, 104.9074483, 'Sangkat Prek Liep, Phnom Penh', 11.6483492, 104.9074488, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/DgsiEzSavQzwV3adsHzeAHSIl3RyKDyDOO06Mo8e.jpg', 'attendance/checkouts/qwKSoufAD2KDDOYQ4qJ40PFDVpySrpfETzuXa4Lq.jpg', NULL, 1, NULL, NULL, 635, 'Submitted from web attendance.', NULL, '2026-06-09 09:00:59', '2026-06-09 09:00:59', '2026-06-09 19:36:07'),
(268, 14, 1, '2026-06-09', 'office', 'late', '2026-06-09 09:14:00', '2026-06-09 18:24:30', 11.6483761, 104.9074866, 'Sangkat Prek Liep, Phnom Penh', 11.6483759, 104.9074867, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/RFeZVyLlY6ye7d008Aiv63rfLlffyuBxmVm8OvB6.jpg', 'attendance/checkouts/JdHT0zJG0UBSPDcm6UJGUTZoSKI3K5waO7wduixW.jpg', NULL, 14, NULL, NULL, 551, 'Submitted from web attendance.', NULL, '2026-06-09 09:14:01', '2026-06-09 09:14:01', '2026-06-09 18:24:30'),
(269, 3, NULL, '2026-06-09', 'office', 'late', '2026-06-09 09:19:39', '2026-06-09 17:46:26', 11.6484071, 104.9074549, 'Sangkat Prek Liep, Phnom Penh', 11.6484037, 104.9074634, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/DrdLgCbL3n1UR1njR3PFjVcDcGQffe1gzQpOklX2.jpg', 'attendance/checkouts/N663bwnF8RXbSSVkdWELrOR1vknyUA7IjqgYCLNc.jpg', NULL, 20, NULL, NULL, 507, 'Submitted from web attendance.', NULL, '2026-06-09 09:19:40', '2026-06-09 09:19:40', '2026-06-09 17:46:27'),
(270, 21, 1, '2026-06-09', 'outdoor', 'late', '2026-06-09 10:02:24', '2026-06-09 19:47:57', 13.1014087, 103.1629031, 'Phum Ou Char, Battambang', 13.1014038, 103.1628991, 'Phum Ou Char, Battambang', 'attendance/selfies/NBj2fclsZ1VoVWvYSwRTd0p40doNxC608f44TMkx.jpg', 'attendance/checkouts/4noPaRTq0vz7SqVzv358DpJAF75nKlEFRdx7fjF8.jpg', NULL, 63, NULL, NULL, 586, 'Submitted from outdoor sales attendance.', NULL, '2026-06-09 10:02:24', '2026-06-09 10:02:24', '2026-06-09 19:47:58'),
(271, 17, 1, '2026-06-09', 'outdoor', 'late', '2026-06-09 10:39:10', NULL, 13.1005766, 103.1625855, 'Phum Ou Char, Battambang', NULL, NULL, NULL, 'attendance/selfies/wXbh8na4YgVR7lautQBhMDeHcTXjsuxX55lijSIz.jpg', NULL, NULL, 100, NULL, NULL, 0, 'Submitted from outdoor sales attendance.', NULL, '2026-06-09 10:39:10', '2026-06-09 10:39:10', '2026-06-09 10:39:10'),
(272, 4, 1, '2026-06-09', 'office', 'present', '2026-06-09 11:22:53', '2026-06-09 17:25:18', 11.6484649, 104.9075363, 'Sangkat Prek Liep, Phnom Penh', 11.6484014, 104.9074589, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/OAwKDOo1euydxTvc69jhYQz2lggZAzREY4sIDrWr.jpg', 'attendance/checkouts/JYnhoSyFQs51vtWxIsyDva2iL0HlnLayWsdJoEZK.jpg', NULL, 0, NULL, NULL, 362, 'Submitted from web attendance.', NULL, '2026-06-09 11:22:53', '2026-06-09 11:22:53', '2026-06-09 17:25:19'),
(273, 9, 1, '2026-06-10', 'office', 'present', '2026-06-10 08:14:42', '2026-06-10 18:32:44', 11.6484036, 104.9074677, 'Sangkat Prek Liep, Phnom Penh', 11.6484037, 104.9074675, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/RazIDk6gxOcym9LBqOUTTtuVOPIAdEFFcQfS0Atg.jpg', 'attendance/checkouts/E8sQCYjdWUCaH5vlYVu4idMwVZZ9fqHqPKlVcNfJ.jpg', NULL, 0, NULL, NULL, 618, 'Submitted from web attendance.', NULL, '2026-06-10 08:14:43', '2026-06-10 08:14:43', '2026-06-10 18:32:45'),
(274, 8, 1, '2026-06-10', 'office', 'present', '2026-06-10 08:23:50', '2026-06-10 17:16:56', 11.6483812, 104.9074607, 'Sangkat Prek Liep, Phnom Penh', 11.6483806, 104.9074239, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/NMaWNUMxGKOQHXcoTexbDZuFFKe5JBXFZFokPswN.jpg', 'attendance/checkouts/USkZR9810W9wLHMVJ8YPjfrQV83ykG9a6iH6xs5i.jpg', NULL, 0, NULL, NULL, 533, 'Submitted from web attendance.', NULL, '2026-06-10 08:23:51', '2026-06-10 08:23:51', '2026-06-10 17:16:57'),
(275, 15, 1, '2026-06-10', 'office', 'present', '2026-06-10 08:45:41', '2026-06-10 17:50:54', 11.6484021, 104.9074596, 'Sangkat Prek Liep, Phnom Penh', 11.6483084, 104.9074234, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/7OVAb9ZnAVxYX8gaVPdYu90D9P0HW8uFCdpoVXiV.jpg', 'attendance/checkouts/keDbrv5V8kReBjLS71KTU4kNHrAPuy6UWOwL1OgD.jpg', NULL, 0, NULL, NULL, 545, 'Submitted from web attendance.', NULL, '2026-06-10 08:45:42', '2026-06-10 08:45:42', '2026-06-10 17:50:55'),
(276, 12, 1, '2026-06-10', 'office', 'present', '2026-06-10 08:48:29', '2026-06-10 17:28:47', 11.6482917, 104.9074894, 'Sangkat Prek Liep, Phnom Penh', 11.6483492, 104.9074488, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/n1C9SVZBBHqoCD9pYQaWJQF3oKQQCzhtLVcMCTBo.jpg', 'attendance/checkouts/GdGWIxCs2xxsf9Lbf61zkrxljnOv6nFFDgCPnb9h.jpg', NULL, 0, NULL, NULL, 520, 'Submitted from web attendance.', NULL, '2026-06-10 08:48:30', '2026-06-10 08:48:30', '2026-06-10 17:28:47'),
(277, 13, 1, '2026-06-10', 'office', 'present', '2026-06-10 08:49:27', '2026-06-10 18:31:29', 11.6483696, 104.9074658, 'Sangkat Prek Liep, Phnom Penh', 11.6484157, 104.9074555, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/MzRILuAIjUoc7TaNo9G8US25bUyBvLDMPAUk4WDU.jpg', 'attendance/checkouts/iJkKNybuj2yVzaLjRUZHTVUjhAblPXzUt2siktWn.jpg', NULL, 0, NULL, NULL, 582, 'Submitted from web attendance.', NULL, '2026-06-10 08:49:27', '2026-06-10 08:49:27', '2026-06-10 18:31:30'),
(278, 19, 1, '2026-06-10', 'office', 'present', '2026-06-10 08:55:42', '2026-06-10 17:15:37', 11.6484165, 104.9074480, 'Sangkat Prek Liep, Phnom Penh', 11.6483761, 104.9074768, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/hli8Cr8xVTJ5UGdNGDQXRI5CdFgOJcD93rGzdjOL.jpg', 'attendance/checkouts/LPTW5A25xabjZ4cmQ3vyXMVfaZzbcH3LfAUqyHfF.jpg', NULL, 0, NULL, NULL, 500, 'Submitted from web attendance.', NULL, '2026-06-10 08:55:43', '2026-06-10 08:55:43', '2026-06-10 17:15:38'),
(279, 5, 1, '2026-06-10', 'office', 'present', '2026-06-10 08:58:28', '2026-06-10 17:15:52', 11.6484044, 104.9074291, 'Sangkat Prek Liep, Phnom Penh', 11.6484041, 104.9074697, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/rfNT0oWkO4TwDWDR6tr30bxkLi79VuS4jGbgaY5e.jpg', 'attendance/checkouts/W18knYN17zBi5Ghb4cNcLBynlpMSkTu3Sz4hx15p.jpg', NULL, 0, NULL, NULL, 497, 'Submitted from web attendance.', NULL, '2026-06-10 08:58:29', '2026-06-10 08:58:29', '2026-06-10 17:15:53'),
(280, 6, 1, '2026-06-10', 'office', 'present', '2026-06-10 08:59:29', '2026-06-10 17:02:42', 11.6484293, 104.9074225, 'Sangkat Prek Liep, Phnom Penh', 11.6483711, 104.9074626, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/eNIfX0Wn4Q1036NXW6SWSKu8Vealr1L5aGXQEOI0.jpg', 'attendance/checkouts/hzUD5sW8J0XyM5r86OZYJxlZNeAdzWEjUw6xMylX.jpg', NULL, 0, NULL, NULL, 483, 'Submitted from web attendance.', NULL, '2026-06-10 08:59:30', '2026-06-10 08:59:30', '2026-06-10 17:02:42'),
(281, 3, NULL, '2026-06-10', 'office', 'present', '2026-06-10 08:59:49', '2026-06-10 17:20:28', 11.6484090, 104.9074942, 'Sangkat Prek Liep, Phnom Penh', 11.6483927, 104.9074671, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/sASfVer4xyI808VvAc5UJpixbu7BlKKYt6ZxRUbT.jpg', 'attendance/checkouts/0gOiCNmB8nAAFUIRb1fiv423VwGFI9i6QA81E4HI.jpg', NULL, 0, NULL, NULL, 501, 'Submitted from web attendance.', NULL, '2026-06-10 08:59:49', '2026-06-10 08:59:49', '2026-06-10 17:20:29'),
(282, 14, 1, '2026-06-10', 'office', 'late', '2026-06-10 09:00:34', '2026-06-10 17:20:49', 11.6484044, 104.9074291, 'Sangkat Prek Liep, Phnom Penh', 11.6483921, 104.9074226, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/D45TVgTkwKSVynGAZieuvyHhvABBCE8vmn66iicM.jpg', 'attendance/checkouts/QrDXr1yfnxl92mnFARneqf02GTZwSaaT7yKZchoM.jpg', NULL, 1, NULL, NULL, 500, 'Submitted from web attendance.', NULL, '2026-06-10 09:00:34', '2026-06-10 09:00:34', '2026-06-10 17:20:49'),
(283, 17, 1, '2026-06-10', 'outdoor', 'late', '2026-06-10 09:23:09', '2026-06-10 18:40:56', 13.1090300, 103.1451336, 'Phum Ou Char, Battambang', 13.5966763, 102.9684328, 'Sangkat Kampong Svay, Bantey Meanchey', 'attendance/selfies/S2syVNXBNcHmV6n9x8zEnpjFe74nVp2lD6LDVl6m.jpg', 'attendance/checkouts/EyeImGJjDhBY3I2kGhP6JHOtoEa5wvh92i1iD5pc.jpg', NULL, 24, NULL, NULL, 558, 'Submitted from outdoor sales attendance.', NULL, '2026-06-10 09:23:09', '2026-06-10 09:23:09', '2026-06-10 18:40:57'),
(284, 21, 1, '2026-06-10', 'outdoor', 'late', '2026-06-10 09:58:37', NULL, 12.9315115, 103.0135219, 'O Svay, Battambang', NULL, NULL, NULL, 'attendance/selfies/0SX3sTcjzZcqhBkuOHIZ0n55s0CyMoQccm9nHaIl.jpg', NULL, NULL, 59, NULL, NULL, 0, 'Submitted from outdoor sales attendance.', NULL, '2026-06-10 09:58:38', '2026-06-10 09:58:38', '2026-06-10 09:58:38'),
(285, 4, 1, '2026-06-10', 'office', 'present', '2026-06-10 11:17:55', '2026-06-10 18:22:59', 11.6484014, 104.9074589, 'Sangkat Prek Liep, Phnom Penh', 11.6483894, 104.9074573, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/IWJgDFprPZMRr8e2zunq7GR9NzLPVICsFZUsceF0.jpg', 'attendance/checkouts/zbXGvRCZ7AbFXcEIhNrQcqbibveAUq7jbttQL61u.jpg', NULL, 0, NULL, NULL, 425, 'Submitted from web attendance.', NULL, '2026-06-10 11:17:56', '2026-06-10 11:17:56', '2026-06-10 18:23:00'),
(286, 8, 1, '2026-06-11', 'office', 'present', '2026-06-11 08:21:47', '2026-06-11 17:22:01', 11.6484139, 104.9074233, 'Sangkat Prek Liep, Phnom Penh', 11.6484048, 104.9074198, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/SCn50b2OWIOBGeopADkh6CVAzSJkLvh4Z5eTk7OJ.jpg', 'attendance/checkouts/8dTcEKLkBmRJJkuD3m2ntpmx0TQwTGDo3RV44nHD.jpg', NULL, 0, NULL, NULL, 540, 'Submitted from web attendance.', NULL, '2026-06-11 08:21:48', '2026-06-11 08:21:48', '2026-06-11 17:22:01'),
(287, 9, 1, '2026-06-11', 'office', 'present', '2026-06-11 08:22:41', '2026-06-11 17:52:29', 11.6484056, 104.9074416, 'Sangkat Prek Liep, Phnom Penh', 11.6484037, 104.9074675, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/TGvvv6LiL0mlGaMAh5FHm9GRQOWhMar5EG5CssYy.jpg', 'attendance/checkouts/tQKrqFKbY6J98gZGMsF4Mv8QK4cmtScQiFE4KEQr.jpg', NULL, 0, NULL, NULL, 570, 'Submitted from web attendance.', NULL, '2026-06-11 08:22:41', '2026-06-11 08:22:41', '2026-06-11 17:52:30'),
(288, 16, 1, '2026-06-11', 'office', 'present', '2026-06-11 08:33:05', '2026-06-11 17:01:57', 11.6484254, 104.9074161, 'Sangkat Prek Liep, Phnom Penh', 11.6483994, 104.9074142, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/Xsv1GHLjHWVfaDlS9MFASOTUklQlgQE0PYcD4VKs.jpg', 'attendance/checkouts/49C8P5ijNrMweH4xGHQK3NAGdZoGvf6466rc2wp1.jpg', NULL, 0, NULL, NULL, 509, 'Submitted from web attendance.', NULL, '2026-06-11 08:33:05', '2026-06-11 08:33:05', '2026-06-11 17:01:57'),
(289, 13, 1, '2026-06-11', 'office', 'present', '2026-06-11 08:48:43', '2026-06-11 20:09:08', 11.6484157, 104.9074555, 'Sangkat Prek Liep, Phnom Penh', 11.6484157, 104.9074555, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/2nZtsVdw07r8ftNAcWoAyB8Vuc6DsOIsXtmUAGec.jpg', 'attendance/checkouts/6kSrukDF4mZf7BkajCCwEZV5CFpXJopMD05UwE4t.jpg', NULL, 0, NULL, NULL, 680, 'Submitted from web attendance.', NULL, '2026-06-11 08:48:43', '2026-06-11 08:48:43', '2026-06-11 20:09:09'),
(290, 14, 1, '2026-06-11', 'office', 'present', '2026-06-11 08:52:25', '2026-06-11 17:41:40', 11.6484235, 104.9074496, 'Sangkat Prek Liep, Phnom Penh', 11.6484027, 104.9074321, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/TdXIMsWyfGW5JN7efRyYtcpQ18RQbUPAgKACeXcg.jpg', 'attendance/checkouts/B0NDp8zfkDMd5vRsfbimZCOcAHCrBpBduppivrFA.jpg', NULL, 0, NULL, NULL, 529, 'Submitted from web attendance.', NULL, '2026-06-11 08:52:25', '2026-06-11 08:52:25', '2026-06-11 17:41:41'),
(291, 5, 1, '2026-06-11', 'office', 'present', '2026-06-11 08:57:27', '2026-06-11 17:11:59', 11.6484041, 104.9074697, 'Sangkat Prek Liep, Phnom Penh', 11.6484057, 104.9074583, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/ieowDI489JDNEKy7k3S0QwVUso8lGutiIK1orw99.jpg', 'attendance/checkouts/w6ZFziT4tNin4JCOZpDqjhrActLVOLF6hZHqmq2t.jpg', NULL, 0, NULL, NULL, 495, 'Submitted from web attendance.', NULL, '2026-06-11 08:57:28', '2026-06-11 08:57:28', '2026-06-11 17:11:59'),
(292, 19, 1, '2026-06-11', 'office', 'present', '2026-06-11 08:58:02', '2026-06-11 20:10:59', 11.6483360, 104.9074928, 'Sangkat Prek Liep, Phnom Penh', 11.6483762, 104.9074767, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/rqyZagMQyLl013UtSsttUgv0XUKRl2jlhFbJkRM1.jpg', 'attendance/checkouts/EcB60O3IHblFUUMpcpALQZ1cng2YiJ0IxNmZ87Xc.jpg', NULL, 0, NULL, NULL, 673, 'Submitted from web attendance.', NULL, '2026-06-11 08:58:02', '2026-06-11 08:58:02', '2026-06-11 20:11:00'),
(293, 15, 1, '2026-06-11', 'office', 'present', '2026-06-11 08:59:23', '2026-06-11 17:44:09', 11.6484154, 104.9074465, 'Sangkat Prek Liep, Phnom Penh', 11.6483181, 104.9074159, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/cIHyz89MtgDodonNhy18B8lTnurG6ZRwoOThlWzB.jpg', 'attendance/checkouts/wyT9k77EuQzJ7ObF9gzelDD8VQDVdOl6lsbZ2O7x.jpg', NULL, 0, NULL, NULL, 525, 'Submitted from web attendance.', NULL, '2026-06-11 08:59:23', '2026-06-11 08:59:23', '2026-06-11 17:44:10'),
(294, 12, 1, '2026-06-11', 'office', 'late', '2026-06-11 09:15:26', '2026-06-11 20:11:48', 11.6483492, 104.9074488, 'Sangkat Prek Liep, Phnom Penh', 11.6483492, 104.9074488, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/BlA9EmDxFdAetDvr6u0EL9YdhFa9jRfINSDV8Whl.jpg', 'attendance/checkouts/eE5j4k6yQfsXsYVSSU0pZtUFNoRyBZyzeB23vPsf.jpg', NULL, 16, NULL, NULL, 656, 'Submitted from web attendance.', NULL, '2026-06-11 09:15:27', '2026-06-11 09:15:27', '2026-06-11 20:11:48'),
(295, 3, NULL, '2026-06-11', 'office', 'late', '2026-06-11 09:34:17', '2026-06-11 17:32:01', 11.6483924, 104.9074671, 'Sangkat Prek Liep, Phnom Penh', 11.6483890, 104.9074665, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/4hHKs1YDsD10uOu7f1dyWWDznL1HwnMpaa0enrt8.jpg', 'attendance/checkouts/jSBqyfWrjVuX7fXITbD0PtNWZxYsFIdp846TdMs8.jpg', NULL, 35, 1.50, '30 min', 478, 'Submitted from web attendance.', NULL, '2026-06-11 09:34:18', '2026-06-11 09:34:18', '2026-06-11 17:32:02'),
(296, 17, 1, '2026-06-11', 'outdoor', 'late', '2026-06-11 10:10:35', NULL, 13.5513570, 102.9876259, 'Khum Bat Trang, Bantey Meanchey', NULL, NULL, NULL, 'attendance/selfies/GkAax3qCKfKqZ8H5LjuyOPlMyt4RUcNklrhrEeW0.jpg', NULL, NULL, 71, NULL, NULL, 0, 'Submitted from outdoor sales attendance.', NULL, '2026-06-11 10:10:36', '2026-06-11 10:10:36', '2026-06-11 10:10:36'),
(297, 6, 1, '2026-06-11', 'office', 'late', '2026-06-11 10:19:38', '2026-06-11 17:09:33', 11.6484494, 104.9075319, 'Sangkat Prek Liep, Phnom Penh', 11.6483968, 104.9074808, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/0RABT2k8tzlnXjBcwSxOF6kqCsjkBVYAht2NihsU.jpg', 'attendance/checkouts/ljEY98vtGkYl9rwbbeeOatLs6BtC5Ff6j3ptLewo.jpg', NULL, 80, 0.00, '1 h 30', 410, 'Submitted from web attendance.', NULL, '2026-06-11 10:19:38', '2026-06-11 10:19:38', '2026-06-11 17:09:34'),
(298, 21, 1, '2026-06-11', 'outdoor', 'late', '2026-06-11 10:41:32', '2026-06-11 17:33:58', 13.5080649, 102.9889775, 'Khum Bat Trang, Bantey Meanchey', 13.5968400, 102.9699368, 'Sangkat Kampong Svay, Bantey Meanchey', 'attendance/selfies/hFMmd1MnbmXHNayWd6xsqzZp2be7eYtKqc0lXLiq.jpg', 'attendance/checkouts/VG8ISpDPEOwhNjDNBLDwZagmleEzPYRnGYTA8F52.jpg', NULL, 102, NULL, NULL, 412, 'Submitted from outdoor sales attendance.', NULL, '2026-06-11 10:41:33', '2026-06-11 10:41:33', '2026-06-11 17:33:59'),
(299, 4, 1, '2026-06-11', 'office', 'present', '2026-06-11 11:29:13', '2026-06-11 20:03:15', 11.6484515, 104.9074391, 'Sangkat Prek Liep, Phnom Penh', 11.6484014, 104.9074589, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/5ht1aasZ5R3yJzOulpU8gHKpO3469XK3vi6Xw53o.jpg', 'attendance/checkouts/xyvGuKCAEZfd1U9mdxHhWVIUAoZA3d1hlvuKwLm9.jpg', NULL, 0, NULL, NULL, 514, 'Submitted from web attendance.', NULL, '2026-06-11 11:29:13', '2026-06-11 11:29:13', '2026-06-11 20:03:16'),
(300, 8, 1, '2026-06-12', 'office', 'present', '2026-06-12 08:17:50', '2026-06-12 17:17:17', 11.6484092, 104.9074310, 'Sangkat Prek Liep, Phnom Penh', 11.6484111, 104.9074307, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/9J0hMNL9djk0cEHg888zmZB3rCTIgtZd1JMIa7uh.jpg', 'attendance/checkouts/O2o7Lfox7Xo4jujuD8xCszDNkknRkRV7CTSriid9.jpg', NULL, 0, NULL, NULL, 539, 'Submitted from web attendance.', NULL, '2026-06-12 08:17:50', '2026-06-12 08:17:50', '2026-06-12 17:17:17'),
(301, 9, 1, '2026-06-12', 'office', 'present', '2026-06-12 08:26:14', '2026-06-12 18:44:29', 11.6484035, 104.9074672, 'Sangkat Prek Liep, Phnom Penh', 11.6484035, 104.9074672, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/NL994pK72a4cR6cB4fWO0XVV4xCh5Qpz5ZNB7cbZ.jpg', 'attendance/checkouts/VjhtPV1LcJOimDLwLBBxstIhLUIzswYD7EWLWYig.jpg', NULL, 0, NULL, NULL, 618, 'Submitted from web attendance.', NULL, '2026-06-12 08:26:15', '2026-06-12 08:26:15', '2026-06-12 18:44:30'),
(302, 16, 1, '2026-06-12', 'office', 'present', '2026-06-12 08:32:37', '2026-06-12 17:06:14', 11.6484155, 104.9074512, 'Sangkat Prek Liep, Phnom Penh', 11.6484087, 104.9074347, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/9b9CKKHxzEh0uYHSNk50PE2ccke8JzXWrxkBD7ap.jpg', 'attendance/checkouts/3egzraIToSw4i0sHe91257U9H6qxnl75vhW4f5CT.jpg', NULL, 0, NULL, NULL, 514, 'Submitted from web attendance.', NULL, '2026-06-12 08:32:38', '2026-06-12 08:32:38', '2026-06-12 17:06:15'),
(303, 14, 1, '2026-06-12', 'office', 'present', '2026-06-12 08:47:07', '2026-06-12 18:09:54', 11.6484034, 104.9074315, 'Sangkat Prek Liep, Phnom Penh', 11.6484031, 104.9074310, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/h3CnxGA6guuMVeoXy0E25pFbAqrch11vbnqEIz8s.jpg', 'attendance/checkouts/7vjOjLatxpIWfKKS5gEWYeT3QowF3e6ESMykdG5l.jpg', NULL, 0, NULL, NULL, 563, 'Submitted from web attendance.', NULL, '2026-06-12 08:47:08', '2026-06-12 08:47:08', '2026-06-12 18:09:54'),
(304, 6, 1, '2026-06-12', 'office', 'late', '2026-06-12 09:02:44', '2026-06-12 17:02:36', 11.6483968, 104.9074808, 'Sangkat Prek Liep, Phnom Penh', 11.6483968, 104.9074808, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/TWWmwqalNJ1SY1jTbOUWrohl1toTJeGFPSFMR4l8.jpg', 'attendance/checkouts/OVKms0Snr7PLOTRSTrBRvR1MyncbILSTYLLWXTN5.jpg', NULL, 3, NULL, NULL, 480, 'Submitted from web attendance.', NULL, '2026-06-12 09:02:45', '2026-06-12 09:02:45', '2026-06-12 17:02:37'),
(305, 5, 1, '2026-06-12', 'office', 'late', '2026-06-12 09:10:50', '2026-06-12 17:04:03', 11.6484041, 104.9074697, 'Sangkat Prek Liep, Phnom Penh', 11.6484041, 104.9074697, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/9GyCqAeum9C2DyZfpfBzGwFH5ZZUdpGSh6Vj1g3t.jpg', 'attendance/checkouts/vTOjtU3PmacNLWjMmTJgJvbL1a1nG3E1mikgaDB8.jpg', NULL, 11, NULL, NULL, 473, 'Submitted from web attendance.', NULL, '2026-06-12 09:10:50', '2026-06-12 09:10:50', '2026-06-12 17:04:04'),
(306, 13, 1, '2026-06-12', 'office', 'late', '2026-06-12 09:13:15', '2026-06-12 18:47:56', 11.6484157, 104.9074555, 'Sangkat Prek Liep, Phnom Penh', 11.6484157, 104.9074555, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/YnHstPMo9L3qhDhuCweP1YjSfhZ8XBoFIwvH7JnE.jpg', 'attendance/checkouts/ehYyl9g2U15SPsjfHaYoJ4tDfYheTuIwUhVEJnJe.jpg', NULL, 14, NULL, NULL, 575, 'Submitted from web attendance.', NULL, '2026-06-12 09:13:16', '2026-06-12 09:13:16', '2026-06-12 18:47:56'),
(307, 3, NULL, '2026-06-12', 'office', 'late', '2026-06-12 09:19:31', '2026-06-12 17:08:09', 11.6483947, 104.9074682, 'Sangkat Prek Liep, Phnom Penh', 11.6483871, 104.9074684, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/uorEczc9106yxKRyYGR3G7tX8aSqC6kpU3NSpHFt.jpg', 'attendance/checkouts/CpecHMQKcIiLa52Xd2FdKViDEo3ZCjj2fPYdaITh.jpg', NULL, 20, NULL, NULL, 469, 'Submitted from web attendance.', NULL, '2026-06-12 09:19:31', '2026-06-12 09:19:31', '2026-06-12 17:08:10'),
(308, 21, 1, '2026-06-12', 'outdoor', 'late', '2026-06-12 11:15:27', '2026-06-12 18:13:02', 14.1854282, 103.5263572, 'Samraong, Samraong', 14.1880632, 103.5262169, 'Samraong, Samraong', 'attendance/selfies/eqrqhJp3B9UPJyBWIGNSj533ScpfESvkg8NPFd29.jpg', 'attendance/checkouts/uNZ5UQftTEi0ETmpi7VTvrr9OTHukZU9XRFBSR2f.jpg', NULL, 136, NULL, NULL, 418, 'Submitted from outdoor sales attendance.', NULL, '2026-06-12 11:15:28', '2026-06-12 11:15:28', '2026-06-12 18:13:03'),
(309, 4, 1, '2026-06-12', 'office', 'present', '2026-06-12 11:24:13', NULL, 11.6484014, 104.9074589, 'Sangkat Prek Liep, Phnom Penh', NULL, NULL, NULL, 'attendance/selfies/Yh1waPtC04iQOfolftNyww4qiRUvLQMQGswmUVy6.jpg', NULL, NULL, 0, NULL, NULL, 0, 'Submitted from web attendance.', NULL, '2026-06-12 11:24:14', '2026-06-12 11:24:14', '2026-06-12 11:24:14'),
(310, 17, 1, '2026-06-12', 'outdoor', 'late', '2026-06-12 14:01:49', NULL, 13.8277023, 103.5156253, 'Srei Snam, Siem Reap', NULL, NULL, NULL, 'attendance/selfies/3CG8hVJHUkdqFRNn9eNZc4vhQpaBkX6QyFv7Leih.jpg', NULL, NULL, 302, NULL, NULL, 0, 'Submitted from outdoor sales attendance.', NULL, '2026-06-12 14:01:50', '2026-06-12 14:01:50', '2026-06-12 14:01:50'),
(311, 16, 1, '2026-06-13', 'office', 'present', '2026-06-13 08:20:11', '2026-06-13 17:05:15', 11.6484093, 104.9074344, 'Sangkat Prek Liep, Phnom Penh', 11.6483978, 104.9074464, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/78S19VBIo4yVp1U7OTVIv8PjTXknrBMKDRF0Pr2s.jpg', 'attendance/checkouts/xbfbHcaJUDYYoEzV36Yi9APdh3t7c97IhMWF5DPV.jpg', NULL, 0, NULL, NULL, 525, 'Submitted from web attendance.', NULL, '2026-06-13 08:20:12', '2026-06-13 08:20:12', '2026-06-13 17:05:16'),
(312, 8, 1, '2026-06-13', 'office', 'present', '2026-06-13 08:22:08', '2026-06-13 17:11:49', 11.6484893, 104.9073522, 'Sangkat Prek Liep, Phnom Penh', 11.6484210, 104.9074287, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/SnV54S2w0tT1kpXjy4dO3utU6R4fwNlmWfRRG02b.jpg', 'attendance/checkouts/KYUx9TIMz1Nmv0MKJWmVs2Rvh54gNtrzt1MHNLiQ.jpg', NULL, 0, NULL, NULL, 530, 'Submitted from web attendance.', NULL, '2026-06-13 08:22:08', '2026-06-13 08:22:08', '2026-06-13 17:11:50'),
(313, 9, 1, '2026-06-13', 'office', 'present', '2026-06-13 08:34:26', '2026-06-13 20:27:47', 11.6484042, 104.9074664, 'Sangkat Prek Liep, Phnom Penh', 11.6484042, 104.9074664, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/ncG0EXs8CAfeLXLHTulwcBIP3fDEdnWc5054INhD.jpg', 'attendance/checkouts/92mOvLmzYWKLqahE24ODHDbhSexqbOC55G33Lhh7.jpg', NULL, 0, NULL, NULL, 713, 'Submitted from web attendance.', NULL, '2026-06-13 08:34:26', '2026-06-13 08:34:26', '2026-06-13 20:27:48'),
(314, 3, NULL, '2026-06-13', 'office', 'present', '2026-06-13 08:45:32', '2026-06-13 17:01:38', 11.6483816, 104.9074686, 'Sangkat Prek Liep, Phnom Penh', 11.6483780, 104.9074677, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/4lJWghZhyhzr0md41ZGbaJAU1GpEOrKUkZmltuQk.jpg', 'attendance/checkouts/mpdiX6S5gkLkhCCrsYNuqktGWKXKPX2KON9urNky.jpg', NULL, 0, NULL, NULL, 496, 'Submitted from web attendance.', NULL, '2026-06-13 08:45:32', '2026-06-13 08:45:32', '2026-06-13 17:01:38'),
(315, 14, 1, '2026-06-13', 'office', 'present', '2026-06-13 08:45:42', '2026-06-13 18:17:51', 11.6483729, 104.9074861, 'Sangkat Prek Liep, Phnom Penh', 11.6484017, 104.9074306, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/T32plMgOeXlwsQy4ZD4yJkzLvULsBzxY6rjJdCRX.jpg', 'attendance/checkouts/DK3z3SQRXpeBlRbGFK66b9VJ7yMUmLW4TCwDY0n0.jpg', NULL, 0, NULL, NULL, 572, 'Submitted from web attendance.', NULL, '2026-06-13 08:45:43', '2026-06-13 08:45:43', '2026-06-13 18:17:51'),
(316, 5, 1, '2026-06-13', 'office', 'present', '2026-06-13 08:54:00', '2026-06-13 17:05:31', 11.6484039, 104.9074693, 'Sangkat Prek Liep, Phnom Penh', 11.6484056, 104.9074692, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/3DNvDECp4Lw93g8yqJxqgP5bqDMYNkbkXoBn8qVV.jpg', 'attendance/checkouts/3XMdEd27EBBxCQvDvZcrgM1vLz2TCcd04WSS5IUy.jpg', NULL, 0, NULL, NULL, 492, 'Submitted from web attendance.', NULL, '2026-06-13 08:54:00', '2026-06-13 08:54:00', '2026-06-13 17:05:32'),
(317, 15, 1, '2026-06-13', 'office', 'late', '2026-06-13 09:05:19', '2026-06-13 18:30:54', 11.6483185, 104.9074102, 'Sangkat Prek Liep, Phnom Penh', 11.6483070, 104.9074016, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/fRHIXMtGypRk0A9BAOCXS9L8buzPwdKUtNbLibzB.jpg', 'attendance/checkouts/PZQ4n0FXbbHpAVDz1IWSPvzOhGHVky6GnwSHNV8r.jpg', NULL, 6, NULL, NULL, 566, 'Submitted from web attendance.', NULL, '2026-06-13 09:05:20', '2026-06-13 09:05:20', '2026-06-13 18:30:55'),
(318, 4, 1, '2026-06-13', 'office', 'present', '2026-06-13 09:22:37', NULL, 11.6484680, 104.9074642, 'Sangkat Prek Liep, Phnom Penh', NULL, NULL, NULL, 'attendance/selfies/15k1NKUrer94bv7msRxJt4cTKC3sNvN3qu1vqyIm.jpg', NULL, NULL, 0, NULL, NULL, 0, 'Submitted from web attendance.', NULL, '2026-06-13 09:22:37', '2026-06-13 09:22:37', '2026-06-13 09:22:37'),
(319, 21, 1, '2026-06-13', 'outdoor', 'late', '2026-06-13 09:25:29', NULL, 14.1729388, 103.5049222, 'Samraong, Samraong', NULL, NULL, NULL, 'attendance/selfies/BWmYzO7ihx7L6wndom59HyoPtacxZgtFzvPxe24Y.jpg', NULL, NULL, 26, NULL, NULL, 0, 'Submitted from outdoor sales attendance.', NULL, '2026-06-13 09:25:29', '2026-06-13 09:25:29', '2026-06-13 09:25:29'),
(320, 13, 1, '2026-06-13', 'office', 'late', '2026-06-13 09:28:52', '2026-06-13 19:44:24', 11.6484157, 104.9074555, 'Sangkat Prek Liep, Phnom Penh', 11.6484094, 104.9074493, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/KZR3jQkRLVT3C1QgUD51rA81aEQS3Z6NQFhXDWOS.jpg', 'attendance/checkouts/GMt9ShoKwkkSYn1ulcujpXMi4nqupQcRMRWf2GSk.jpg', NULL, 29, NULL, NULL, 616, 'Submitted from web attendance.', NULL, '2026-06-13 09:28:53', '2026-06-13 09:28:53', '2026-06-13 19:44:25'),
(321, 6, 1, '2026-06-13', 'office', 'late', '2026-06-13 09:41:34', '2026-06-13 17:07:15', 11.6483970, 104.9074310, 'Sangkat Prek Liep, Phnom Penh', 11.6483968, 104.9074808, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/8NHAKdUP2g4GMBAoqK3NoYkb6G87ac9Kxc0MGT3o.jpg', 'attendance/checkouts/FvNCTx0s0q70iJFr3l85pb4ykhqWqFxN384Wi23b.jpg', NULL, 42, 1.50, '30 min', 446, 'Submitted from web attendance.', NULL, '2026-06-13 09:41:34', '2026-06-13 09:41:34', '2026-06-13 17:07:16'),
(322, 17, 1, '2026-06-13', 'outdoor', 'late', '2026-06-13 10:25:41', NULL, 14.1623530, 103.2864206, 'Kouk Moan, Oddar Meanchey', NULL, NULL, NULL, 'attendance/selfies/uo8RsH3WYS6tyV919z9MkdsgZypWI1LTGpjqNjvB.jpg', NULL, NULL, 86, NULL, NULL, 0, 'Submitted from outdoor sales attendance.', NULL, '2026-06-13 10:25:41', '2026-06-13 10:25:41', '2026-06-13 10:25:41'),
(323, 16, 1, '2026-06-14', 'office', 'present', '2026-06-14 08:20:32', '2026-06-14 17:23:32', 11.6483960, 104.9074114, 'Sangkat Prek Liep, Phnom Penh', 11.6484103, 104.9074379, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/0niBbBhlMnH3gMKsZdDuyDzvUYxGmGsnOgkWjNkC.jpg', 'attendance/checkouts/L8ZKrjxwZuSQH9LVBlEWf4geMZut4ZMupWoTVO9M.jpg', NULL, 0, NULL, NULL, 543, 'Submitted from web attendance.', NULL, '2026-06-14 08:20:33', '2026-06-14 08:20:33', '2026-06-14 17:23:33'),
(324, 8, 1, '2026-06-14', 'office', 'present', '2026-06-14 08:36:28', '2026-06-14 18:30:15', 11.6484770, 104.9073751, 'Sangkat Prek Liep, Phnom Penh', 11.6484202, 104.9074220, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/4Ud1fsWKiS0ofzMwXgXRQD1CBgxU0jYiXOcl7fUt.jpg', 'attendance/checkouts/1xr3iyNk9PJPtuyAZkLpyLTHbkh50aKYgHSRVDxN.jpg', NULL, 0, NULL, NULL, 594, 'Submitted from web attendance.', NULL, '2026-06-14 08:36:29', '2026-06-14 08:36:29', '2026-06-14 18:30:15'),
(325, 21, 1, '2026-06-14', 'outdoor', 'present', '2026-06-14 08:47:23', NULL, 14.1972732, 103.5316793, 'Samraong, Samraong', NULL, NULL, NULL, 'attendance/selfies/Q6Ts8kevwN4FxaEZ7zw1PN7I620r8NIuUq6xKOLE.jpg', NULL, NULL, 0, NULL, NULL, 0, 'Submitted from outdoor sales attendance.', NULL, '2026-06-14 08:47:23', '2026-06-14 08:47:23', '2026-06-14 08:47:23'),
(326, 17, 1, '2026-06-14', 'outdoor', 'late', '2026-06-14 10:29:39', NULL, 14.1558462, 103.2584789, 'Kouk Moan, Oddar Meanchey', NULL, NULL, NULL, 'attendance/selfies/pR2tkdeyL73qHpIDIsjHq1TTj6OTP93FWCde9twu.jpg', NULL, NULL, 90, NULL, NULL, 0, 'Submitted from outdoor sales attendance.', NULL, '2026-06-14 10:29:40', '2026-06-14 10:29:40', '2026-06-14 10:29:40'),
(327, 9, 1, '2026-06-14', 'office', 'present', '2026-06-14 10:49:43', '2026-06-14 18:29:37', 11.6484042, 104.9074664, 'Sangkat Prek Liep, Phnom Penh', 11.6484042, 104.9074664, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/H89Q0m5JbROCFV5pPTWzU731PJRPAqjHLNhIOU6u.jpg', 'attendance/checkouts/CEE0TBjQh3fqqNlGGZNHfbfOYWOnv3FWkJNPXAVS.jpg', NULL, 0, NULL, NULL, 460, 'Submitted from web attendance.', NULL, '2026-06-14 10:49:43', '2026-06-14 10:49:43', '2026-06-14 18:29:37'),
(328, 8, 1, '2026-06-15', 'office', 'present', '2026-06-15 08:26:43', '2026-06-15 18:31:35', 11.6484225, 104.9074202, 'Sangkat Prek Liep, Phnom Penh', 11.6484147, 104.9074249, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/eylrFrLt6kjUfKKkcIRTSFTeVK1sCixe97tftdF0.jpg', 'attendance/checkouts/6V0G8IvySrUj3U3ABGzGGpvJZ2AFqhleypSTtdl2.jpg', NULL, 0, NULL, NULL, 605, 'Submitted from web attendance.', NULL, '2026-06-15 08:26:43', '2026-06-15 08:26:43', '2026-06-15 18:31:35'),
(329, 9, 1, '2026-06-15', 'office', 'present', '2026-06-15 08:34:35', '2026-06-15 20:35:57', 11.6484053, 104.9074656, 'Sangkat Prek Liep, Phnom Penh', 11.6484059, 104.9074655, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/aaU0zA0n22FuBfRviijjlzDqBDPkYPPxKrm1mrtG.jpg', 'attendance/checkouts/ZS4sFSbhpQWuta2Z3taU4UFliHMyGm7qpPS4yML5.jpg', NULL, 0, NULL, NULL, 721, 'Submitted from web attendance.', NULL, '2026-06-15 08:34:36', '2026-06-15 08:34:36', '2026-06-15 20:35:58'),
(330, 14, 1, '2026-06-15', 'office', 'present', '2026-06-15 08:50:48', '2026-06-15 18:22:44', 11.6483652, 104.9074797, 'Sangkat Prek Liep, Phnom Penh', 11.6484017, 104.9074306, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/PibwWD3uU8iTdRmE6RB2S1b96o5CXuWlGDcAFiKt.jpg', 'attendance/checkouts/g0LnxTQxniW18Djx7KA7WRhucwMNnFnwnO8fKoh6.jpg', NULL, 0, NULL, NULL, 572, 'Submitted from web attendance.', NULL, '2026-06-15 08:50:50', '2026-06-15 08:50:50', '2026-06-15 18:22:45'),
(331, 5, 1, '2026-06-15', 'office', 'present', '2026-06-15 08:53:24', '2026-06-15 17:01:42', 11.6484061, 104.9074588, 'Sangkat Prek Liep, Phnom Penh', 11.6484056, 104.9074692, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/HJ8nirHxqfBp5k3xvBSr8Ga8tyno1k8SF4aAzuap.jpg', 'attendance/checkouts/SuBrCrzdCrxnwt0eZcaGDKISA4C0SzW472PAFjPN.jpg', NULL, 0, NULL, NULL, 488, 'Submitted from web attendance.', NULL, '2026-06-15 08:53:24', '2026-06-15 08:53:24', '2026-06-15 17:01:43'),
(332, 13, 1, '2026-06-15', 'office', 'late', '2026-06-15 09:04:05', '2026-06-15 17:39:57', 11.6484094, 104.9074418, 'Sangkat Prek Liep, Phnom Penh', 11.6484157, 104.9074555, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/bpvLQkqCFT9QozA7w6HzaaIva6qmb2wfKqIWu5ok.jpg', 'attendance/checkouts/vvoOjz90VrukQsHpjiyKIfOngs4RsKmA2EfDrYKj.jpg', NULL, 5, NULL, NULL, 516, 'Submitted from web attendance.', NULL, '2026-06-15 09:04:06', '2026-06-15 09:04:06', '2026-06-15 17:39:57'),
(333, 21, 1, '2026-06-15', 'outdoor', 'late', '2026-06-15 09:08:33', NULL, 14.1904805, 103.5294575, 'Samraong, Samraong', NULL, NULL, NULL, 'attendance/selfies/SfhEGTk0XyKGjEQIN24Z4HFXk1Dawn3NLy3XIBa2.jpg', NULL, NULL, 9, NULL, NULL, 0, 'Submitted from outdoor sales attendance.', NULL, '2026-06-15 09:08:33', '2026-06-15 09:08:33', '2026-06-15 09:08:33'),
(334, 6, 1, '2026-06-15', 'office', 'late', '2026-06-15 09:19:02', '2026-06-15 17:01:46', 11.6483950, 104.9074413, 'Sangkat Prek Liep, Phnom Penh', 11.6483968, 104.9074808, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/nNS2tUUZQrbEsau6phWczApCwqfo40vQeufiEuSr.jpg', 'attendance/checkouts/rjtfh5Oftag8kK3Qzc2cVIVKcWYYh7uF92spp8U6.jpg', NULL, 20, NULL, NULL, 463, 'Submitted from web attendance.', NULL, '2026-06-15 09:19:03', '2026-06-15 09:19:03', '2026-06-15 17:01:47'),
(335, 3, NULL, '2026-06-15', 'office', 'late', '2026-06-15 09:23:58', '2026-06-15 17:14:48', 11.6483695, 104.9074895, 'Sangkat Prek Liep, Phnom Penh', 11.6483835, 104.9074693, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/rCF65Yhxj7ihtbM2UdTyijdNMdMACYL5kMJYpHKU.jpg', 'attendance/checkouts/xhKhJhKA0IItDliJISbBjxOfQGx4xEcUJTghj2CV.jpg', NULL, 24, NULL, NULL, 471, 'Submitted from web attendance.', NULL, '2026-06-15 09:23:58', '2026-06-15 09:23:58', '2026-06-15 17:14:49'),
(336, 17, 1, '2026-06-15', 'outdoor', 'late', '2026-06-15 09:31:41', NULL, 14.1745504, 103.5055976, 'Samraong, Samraong', NULL, NULL, NULL, 'attendance/selfies/ZS4PzbVbxROcSAJgBJZpt4HaF8yAdFZM1lGuqgXI.jpg', NULL, NULL, 32, NULL, NULL, 0, 'Submitted from outdoor sales attendance.', NULL, '2026-06-15 09:31:41', '2026-06-15 09:31:41', '2026-06-15 09:31:41'),
(337, 4, 1, '2026-06-15', 'office', 'present', '2026-06-15 11:27:06', '2026-06-15 20:40:52', 11.6484484, 104.9074503, 'Sangkat Prek Liep, Phnom Penh', 11.6484014, 104.9074589, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/OANMDUPQsT5u0se3EB230HxiOgFKR8mFHF9r4abJ.jpg', 'attendance/checkouts/qB5i2oqLyoHoiSIetwmcMLoMX7SOFvG16RuQqtEO.jpg', NULL, 0, NULL, NULL, 554, 'Submitted from web attendance.', NULL, '2026-06-15 11:27:07', '2026-06-15 11:27:07', '2026-06-15 20:40:52'),
(338, 16, 1, '2026-06-16', 'office', 'present', '2026-06-16 08:21:30', '2026-06-16 17:48:28', 11.6484119, 104.9074300, 'Sangkat Prek Liep, Phnom Penh', 11.6483715, 104.9074649, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/NuWBcatez2PAcSdkpVMSah67FpacwhyhTyAnNuQm.jpg', 'attendance/checkouts/3MnUBwf8aMHqyYK9fcy8rLstHlKuxo4jH3CqCdIz.jpg', NULL, 0, NULL, NULL, 567, 'Submitted from web attendance.', NULL, '2026-06-16 08:21:30', '2026-06-16 08:21:30', '2026-06-16 17:48:29'),
(339, 8, 1, '2026-06-16', 'office', 'present', '2026-06-16 08:25:22', '2026-06-16 17:50:23', 11.6484326, 104.9074279, 'Sangkat Prek Liep, Phnom Penh', 11.6484278, 104.9074292, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/N4KcaDb8vEKvLJmJkeRuFhgVaIBreUUwapczRdq4.jpg', 'attendance/checkouts/8lBImRL3dbV4ZBL7vQR487V1K1rGE9zrtDCsVtSi.jpg', NULL, 0, NULL, NULL, 565, 'Submitted from web attendance.', NULL, '2026-06-16 08:25:23', '2026-06-16 08:25:23', '2026-06-16 17:50:24');
INSERT INTO `attendance` (`id`, `employee_id`, `branch_id`, `attendance_date`, `type`, `status`, `check_in_at`, `check_out_at`, `check_in_latitude`, `check_in_longitude`, `check_in_address`, `check_out_latitude`, `check_out_longitude`, `check_out_address`, `check_in_photo_path`, `check_out_photo_path`, `qr_code`, `late_minutes`, `deduction_amount`, `deduction_reason`, `work_minutes`, `notes`, `offline_sync_uuid`, `synced_at`, `created_at`, `updated_at`) VALUES
(340, 9, 1, '2026-06-16', 'office', 'present', '2026-06-16 08:37:05', '2026-06-16 20:42:40', 11.6484058, 104.9074654, 'Sangkat Prek Liep, Phnom Penh', 11.6484057, 104.9074654, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/aRS53UazDyInmwHAZsPmoUkBpDbyS9YWIWCkr083.jpg', 'attendance/checkouts/TOuDDhnNH7oWGgV7rOB3Kk3XKjMz4IOzk4dtvpRJ.jpg', NULL, 0, NULL, NULL, 726, 'Submitted from web attendance.', NULL, '2026-06-16 08:37:06', '2026-06-16 08:37:06', '2026-06-16 20:42:41'),
(341, 14, 1, '2026-06-16', 'office', 'present', '2026-06-16 08:51:11', '2026-06-16 18:11:36', 11.6484012, 104.9074289, 'Sangkat Prek Liep, Phnom Penh', 11.6484001, 104.9074279, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/tbdgNxCpPxD3iFSMutCCFGdsyYXaIKgbZdR4whCx.jpg', 'attendance/checkouts/VhjF0ceMcjXyqRFonJHz39TxNChR4id6wj8ShzcX.jpg', NULL, 0, NULL, NULL, 560, 'Submitted from web attendance.', NULL, '2026-06-16 08:51:12', '2026-06-16 08:51:12', '2026-06-16 18:11:36'),
(342, 6, 1, '2026-06-16', 'office', 'late', '2026-06-16 09:00:50', NULL, 11.6484291, 104.9074256, 'Sangkat Prek Liep, Phnom Penh', NULL, NULL, NULL, 'attendance/selfies/3JkvAzuibHLHPJBJh6D9klZjCqDINQPX0tCPqemD.jpg', NULL, NULL, 1, NULL, NULL, 0, 'Submitted from web attendance.', NULL, '2026-06-16 09:00:51', '2026-06-16 09:00:51', '2026-06-16 09:00:51'),
(343, 5, 1, '2026-06-16', 'office', 'late', '2026-06-16 09:18:44', '2026-06-16 17:52:36', 11.6484070, 104.9074666, 'Sangkat Prek Liep, Phnom Penh', 11.6484070, 104.9074666, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/4qWIGtPqgr6rgRhHHQP0FotSmbIbA0riAyInwjmh.jpg', 'attendance/checkouts/6ABLB3nlR6IJFJoxtIqS2wOWzAB1u2BouNRfz1gb.jpg', NULL, 19, NULL, NULL, 514, 'Submitted from web attendance.', NULL, '2026-06-16 09:18:44', '2026-06-16 09:18:44', '2026-06-16 17:52:36'),
(344, 3, NULL, '2026-06-16', 'office', 'late', '2026-06-16 09:34:59', '2026-06-16 18:12:05', 11.6483810, 104.9074707, 'Sangkat Prek Liep, Phnom Penh', 11.6483797, 104.9074709, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/JYht3JBbas9PHM7Ou7bpvUzjhjAxBhS4XwPlNuKV.jpg', 'attendance/checkouts/eav2UF4WnGxpaKTrZqLbSuK31Aq1uX94ohBE0wot.jpg', NULL, 35, 1.50, '30 min', 517, 'Submitted from web attendance.', NULL, '2026-06-16 09:34:59', '2026-06-16 09:34:59', '2026-06-16 18:12:06'),
(345, 17, 1, '2026-06-16', 'outdoor', 'late', '2026-06-16 09:38:17', NULL, 14.1872683, 103.5376967, 'Samraong, Samraong', NULL, NULL, NULL, 'attendance/selfies/Ob7Gn7YCy8jriPBd3xsun57Sejhuzha3nwToIElf.jpg', NULL, NULL, 39, NULL, NULL, 0, 'Submitted from outdoor sales attendance.', NULL, '2026-06-16 09:38:18', '2026-06-16 09:38:18', '2026-06-16 09:38:18'),
(346, 21, 1, '2026-06-16', 'outdoor', 'late', '2026-06-16 09:44:33', '2026-06-16 18:08:14', 14.1874489, 103.5377061, 'Samraong, Samraong', 14.2406934, 104.1156843, 'Anlong Veaeng, Oddar Meanchey', 'attendance/selfies/fMpeDwwixYZxp8IcznzaZEFPq6t4hRvUGsDszcqY.jpg', 'attendance/checkouts/lvqlatIOz4s8S0fKGi7CPjxuKYJcH3lCTTcc0zTr.jpg', NULL, 45, NULL, NULL, 504, 'Submitted from outdoor sales attendance.', NULL, '2026-06-16 09:44:34', '2026-06-16 09:44:34', '2026-06-16 18:08:15'),
(347, 12, 1, '2026-06-16', 'office', 'late', '2026-06-16 09:48:17', '2026-06-16 20:39:29', 11.6483490, 104.9074494, 'Sangkat Prek Liep, Phnom Penh', 11.6483478, 104.9074518, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/0BLD8V1OzctnEf2RqaSMZ8kaKEBJ4Vy5EOaKxb4D.jpg', 'attendance/checkouts/HYR5Wb2tlRwIREAoJYfha3rA8PxbpG5AH8iO38of.jpg', NULL, 49, 1.50, '30 min', 651, 'Submitted from web attendance.', NULL, '2026-06-16 09:48:18', '2026-06-16 09:48:18', '2026-06-16 20:39:29'),
(348, 13, 1, '2026-06-16', 'office', 'late', '2026-06-16 09:48:57', '2026-06-16 20:38:14', 11.6484054, 104.9074382, 'Sangkat Prek Liep, Phnom Penh', 11.6484157, 104.9074555, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/JbNWMnrMjpl2eVLoLdBmhFT1udpMOWdStDzYjsoV.jpg', 'attendance/checkouts/bWrgRsJGAGzTXqjZtM4Yi4SR68Dr9njgIospGmLU.jpg', NULL, 49, 1.50, '30 min', 649, 'Submitted from web attendance.', NULL, '2026-06-16 09:48:59', '2026-06-16 09:48:59', '2026-06-16 20:38:15'),
(349, 4, 1, '2026-06-16', 'office', 'present', '2026-06-16 11:30:26', '2026-06-16 17:34:18', 11.6484420, 104.9074332, 'Sangkat Prek Liep, Phnom Penh', 11.6484014, 104.9074589, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/Mf7RkM47SZc1tItxnk9OLje8JvylgsLneOIoRRLU.jpg', 'attendance/checkouts/4UUz02nMgIWC5Q2qZMbftCDMOkrd6tCeklyrThMb.jpg', NULL, 0, NULL, NULL, 364, 'Submitted from web attendance.', NULL, '2026-06-16 11:30:26', '2026-06-16 11:30:26', '2026-06-16 17:34:19'),
(350, 8, 1, '2026-06-17', 'office', 'present', '2026-06-17 08:26:33', '2026-06-17 18:38:11', 11.6484357, 104.9074268, 'Sangkat Prek Liep, Phnom Penh', 11.6484282, 104.9074308, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/H4M5vxebu80ICfbJUokeOhPzuh9Ui2YmtDValTAi.jpg', 'attendance/checkouts/oTb2uGiqVont4BHvrsPb37otqxDGT5WcSy67S4tu.jpg', NULL, 0, NULL, NULL, 612, 'Submitted from web attendance.', NULL, '2026-06-17 08:26:33', '2026-06-17 08:26:33', '2026-06-17 18:38:11'),
(351, 16, 1, '2026-06-17', 'office', 'present', '2026-06-17 08:31:39', '2026-06-17 17:01:49', 11.6484010, 104.9074605, 'Sangkat Prek Liep, Phnom Penh', 11.6484081, 104.9074589, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/qPhVszAeDNl3vG74ySEyRTsvyMZjgrpHpLj5mGMV.jpg', 'attendance/checkouts/rMYlXfESbPG0JrNycYbykhflcJHHJFVJ6128A1fV.jpg', NULL, 0, NULL, NULL, 510, 'Submitted from web attendance.', NULL, '2026-06-17 08:31:40', '2026-06-17 08:31:40', '2026-06-17 17:01:49'),
(352, 9, 1, '2026-06-17', 'office', 'present', '2026-06-17 08:33:16', '2026-06-17 18:57:33', 11.6484057, 104.9074654, 'Sangkat Prek Liep, Phnom Penh', 11.6484057, 104.9074654, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/onnEsqs8pDxICP0QXwylqdYUtGQvrhyOkVYR4HEI.jpg', 'attendance/checkouts/OasVwuB1wc2k3lGLq6eoAjhexzTOmufniu2rjiAh.jpg', NULL, 0, NULL, NULL, 624, 'Submitted from web attendance.', NULL, '2026-06-17 08:33:17', '2026-06-17 08:33:17', '2026-06-17 18:57:33'),
(353, 14, 1, '2026-06-17', 'office', 'present', '2026-06-17 08:47:26', '2026-06-17 18:12:04', 11.6484002, 104.9074278, 'Sangkat Prek Liep, Phnom Penh', 11.6483999, 104.9074272, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/zqo7lUTvr5AAI9kAOUCOcws7xxYfO9R1ZURGEzL7.jpg', 'attendance/checkouts/Oinl0glDwDvNiPrXVlNWEVUXVOOvfRToKtJ6pxAs.jpg', NULL, 0, NULL, NULL, 565, 'Submitted from web attendance.', NULL, '2026-06-17 08:47:26', '2026-06-17 08:47:26', '2026-06-17 18:12:04'),
(354, 15, 1, '2026-06-17', 'office', 'present', '2026-06-17 08:56:01', '2026-06-17 18:11:40', 11.6483092, 104.9074027, 'Sangkat Prek Liep, Phnom Penh', 11.6483570, 104.9073989, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/4Sf7GOfYYGN7381SMT8wFDZVDS7t6grdIEqLpYGr.jpg', 'attendance/checkouts/p2uuGXPTabZQTzMkfx5RK4YOdGbyqPr3Ad2mJXDv.jpg', NULL, 0, NULL, NULL, 556, 'Submitted from web attendance.', NULL, '2026-06-17 08:56:01', '2026-06-17 08:56:01', '2026-06-17 18:11:40'),
(355, 17, 1, '2026-06-17', 'outdoor', 'late', '2026-06-17 09:13:39', NULL, 14.2416064, 104.1157035, 'Anlong Veaeng, Oddar Meanchey', NULL, NULL, NULL, 'attendance/selfies/DPIsxcEcjLgt6pa28N4puovQItvYjijJUX2i1qSC.jpg', NULL, NULL, 14, NULL, NULL, 0, 'Submitted from outdoor sales attendance.', NULL, '2026-06-17 09:13:40', '2026-06-17 09:13:40', '2026-06-17 09:13:40'),
(356, 5, 1, '2026-06-17', 'office', 'late', '2026-06-17 09:13:57', '2026-06-17 17:00:29', 11.6484087, 104.9074427, 'Sangkat Prek Liep, Phnom Penh', 11.6484072, 104.9074687, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/GUcVevttfpI4Aofmer4fQldRkcggGNxCWEqZutXa.jpg', 'attendance/checkouts/1sSjViejPtOvTW1TKR6iL0TCDVMdBKvBzdPEH4tf.jpg', NULL, 14, NULL, NULL, 467, 'Submitted from web attendance.', NULL, '2026-06-17 09:13:58', '2026-06-17 09:13:58', '2026-06-17 17:00:29'),
(357, 21, 1, '2026-06-17', 'outdoor', 'late', '2026-06-17 09:16:51', NULL, 14.2433786, 104.1205366, 'Anlong Veaeng, Oddar Meanchey', NULL, NULL, NULL, 'attendance/selfies/0W5HxeNT1e0g5jNe5jIkjhjvF9NdNMkWxAIWK9mw.jpg', NULL, NULL, 17, NULL, NULL, 0, 'Submitted from outdoor sales attendance.', NULL, '2026-06-17 09:16:51', '2026-06-17 09:16:51', '2026-06-17 09:16:51'),
(358, 6, 1, '2026-06-17', 'office', 'late', '2026-06-17 09:26:43', '2026-06-17 17:00:28', 11.6484260, 104.9075006, 'Sangkat Prek Liep, Phnom Penh', 11.6483968, 104.9074808, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/xzGcEO38HLZIJMgCGBPNSncNFaq4WHzMDdTSlfvI.jpg', 'attendance/checkouts/7J5hYVFw5JiLMtAYxBVg92UiOdWYv4l9PiVMumnW.jpg', NULL, 27, NULL, NULL, 454, 'Submitted from web attendance.', NULL, '2026-06-17 09:26:43', '2026-06-17 09:26:43', '2026-06-17 17:00:28'),
(359, 3, NULL, '2026-06-17', 'office', 'late', '2026-06-17 09:27:31', '2026-06-17 17:11:25', 11.6483846, 104.9074689, 'Sangkat Prek Liep, Phnom Penh', 11.6483794, 104.9074684, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/9Ac5IGQy3c104R6N1vxM3vXImCJh1RfUrqpCoeTS.jpg', 'attendance/checkouts/aX0V3SW3fVK6tUPsDaLCCrpDsCqWX7m2ZMwIoFRM.jpg', NULL, 28, NULL, NULL, 464, 'Submitted from web attendance.', NULL, '2026-06-17 09:27:31', '2026-06-17 09:27:31', '2026-06-17 17:11:27'),
(360, 13, 1, '2026-06-17', 'office', 'late', '2026-06-17 09:35:56', '2026-06-17 19:00:45', 11.6487340, 104.9074114, 'Sangkat Prek Liep, Phnom Penh', 11.6484406, 104.9074294, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/MJxtrSxNNI97oRjtXiOc1I4t7scdVVMeCxKjurSy.jpg', 'attendance/checkouts/EqbcRI8TOWUYPAwwDOAMClGK4MyhByhTeLQ0nUTV.jpg', NULL, 36, 1.50, '30 min', 565, 'Submitted from web attendance.', NULL, '2026-06-17 09:35:57', '2026-06-17 09:35:57', '2026-06-17 19:00:46'),
(361, 12, 1, '2026-06-17', 'office', 'late', '2026-06-17 09:42:20', '2026-06-17 19:02:22', 11.6483478, 104.9074518, 'Sangkat Prek Liep, Phnom Penh', 11.6483478, 104.9074518, '11.648348, 104.907452', 'attendance/selfies/EgbdOLXlp7705Pj91X9oAidc2dOlNwxGizQ7qHyi.jpg', 'attendance/checkouts/GhViNWja9vbSrlogYu8FhOPe8uGaDgfZg8gcG4vJ.jpg', NULL, 43, 1.50, '30 min', 560, 'Submitted from web attendance.', NULL, '2026-06-17 09:42:21', '2026-06-17 09:42:21', '2026-06-17 19:02:23'),
(362, 9, 1, '2026-06-18', 'office', 'present', '2026-06-18 08:18:39', '2026-06-18 18:44:33', 11.6484055, 104.9074655, 'Sangkat Prek Liep, Phnom Penh', 11.6484055, 104.9074655, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/UeLPpyY269KWvqyt0wmV75L0dMUBC64NtKyquJnf.jpg', 'attendance/checkouts/PgNDwsdVRNvEJxD27GqxzHAeibtOlYDnXBxgPV3C.jpg', NULL, 0, NULL, NULL, 626, 'Submitted from web attendance.', NULL, '2026-06-18 08:18:40', '2026-06-18 08:18:40', '2026-06-18 18:44:34'),
(363, 16, 1, '2026-06-18', 'office', 'present', '2026-06-18 08:33:38', '2026-06-18 17:03:06', 11.6484086, 104.9074604, 'Sangkat Prek Liep, Phnom Penh', 11.6484078, 104.9074607, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/1RiiMFRTTcPnAFj4ELzaXcpAXtrokRSv2swWbpZC.jpg', 'attendance/checkouts/Kfn5QJrqXJNLQOU9j6i1YoBDWrHtc3QGqLOphn0P.jpg', NULL, 0, NULL, NULL, 509, 'Submitted from web attendance.', NULL, '2026-06-18 08:33:38', '2026-06-18 08:33:38', '2026-06-18 17:03:07'),
(364, 15, 1, '2026-06-18', 'office', 'present', '2026-06-18 08:56:10', '2026-06-18 17:16:46', 11.6483537, 104.9073962, 'Sangkat Prek Liep, Phnom Penh', 11.6483594, 104.9074034, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/BChMeJtAIlJotzQa3l3cc1vLHGDIrw5qqEyUFeY3.jpg', 'attendance/checkouts/vbXho0HUMsgm6dUMWzpLAGtyW5qithFUunNMA4rD.jpg', NULL, 0, NULL, NULL, 501, 'Submitted from web attendance.', NULL, '2026-06-18 08:56:11', '2026-06-18 08:56:11', '2026-06-18 17:16:47'),
(365, 13, 1, '2026-06-18', 'office', 'late', '2026-06-18 09:04:51', '2026-06-18 18:46:20', 11.6484404, 104.9074294, 'Sangkat Prek Liep, Phnom Penh', 11.6484157, 104.9074555, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/5yL9RqfvxGpbDBZnVZ6IRs5Om1LTshZDcihegOgM.jpg', 'attendance/checkouts/U0iue5oLgPYXO8Y2rCXCporo0npiMxgprC3DkJXc.jpg', NULL, 5, NULL, NULL, 581, 'Submitted from web attendance.', NULL, '2026-06-18 09:04:51', '2026-06-18 09:04:51', '2026-06-18 18:46:21'),
(366, 12, 1, '2026-06-18', 'office', 'late', '2026-06-18 09:05:04', '2026-06-18 18:50:43', 11.6483444, 104.9074744, 'Sangkat Prek Liep, Phnom Penh', 11.6483526, 104.9074683, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/dk8S9i7Ss6Gz00nsq2jMApMtJwbnGkF3dPHqV8bx.jpg', 'attendance/checkouts/6MIRayNzle3AJs8EBTEaXmCz8cZhwUBL4kkdTgMN.jpg', NULL, 6, NULL, NULL, 586, 'Submitted from web attendance.', NULL, '2026-06-18 09:05:05', '2026-06-18 09:05:05', '2026-06-18 18:50:43'),
(367, 14, 1, '2026-06-18', 'office', 'late', '2026-06-18 09:09:37', '2026-06-18 18:22:03', 11.6483999, 104.9074296, 'Sangkat Prek Liep, Phnom Penh', 11.6483835, 104.9074350, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/EY4vXGdV5Qas7wV5GDi5avMSfeTJNf5Kl8QxryUj.jpg', 'attendance/checkouts/60KSDcY4MC2EfspCm3IaEYq072s06OCgYk9XTveE.jpg', NULL, 10, NULL, NULL, 552, 'Submitted from web attendance.', NULL, '2026-06-18 09:09:38', '2026-06-18 09:09:38', '2026-06-18 18:22:04'),
(368, 6, 1, '2026-06-18', 'office', 'late', '2026-06-18 09:16:20', '2026-06-18 17:02:27', 11.6484860, 104.9074317, 'Sangkat Prek Liep, Phnom Penh', 11.6483836, 104.9074772, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/0FnyURWamft6drVQXWHLRctcZoItWUtOQtNlXduC.jpg', 'attendance/checkouts/KwyrAYGTXgDKHbsGqLf4KSjGI44kqUZNOQsaQG8B.jpg', NULL, 17, NULL, NULL, 466, 'Submitted from web attendance.', NULL, '2026-06-18 09:16:20', '2026-06-18 09:16:20', '2026-06-18 17:02:27'),
(369, 3, NULL, '2026-06-18', 'office', 'late', '2026-06-18 09:27:25', '2026-06-18 17:13:51', 11.6483649, 104.9074694, 'Sangkat Prek Liep, Phnom Penh', 11.6483676, 104.9074622, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/RdpEMUXgkeu17I48Z3aH48AAJCTLB8DmuX90AF9D.jpg', 'attendance/checkouts/MSmdBYkFyegqAC08Xe7U7lWUwz30yeHrLu7YKveq.jpg', NULL, 28, NULL, NULL, 466, 'Submitted from web attendance.', NULL, '2026-06-18 09:27:25', '2026-06-18 09:27:25', '2026-06-18 17:13:52'),
(370, 17, 1, '2026-06-18', 'outdoor', 'late', '2026-06-18 10:29:53', NULL, 14.0795482, 104.0956564, 'Anlong Veaeng, Oddar Meanchey', NULL, NULL, NULL, 'attendance/selfies/VWK0d96jVbDyU4sBO0d6vvWxpowRfVUf1HSWjnbr.jpg', NULL, NULL, 90, NULL, NULL, 0, 'Submitted from outdoor sales attendance.', NULL, '2026-06-18 10:29:54', '2026-06-18 10:29:54', '2026-06-18 10:29:54'),
(371, 21, 1, '2026-06-18', 'outdoor', 'late', '2026-06-18 10:47:31', '2026-06-18 19:05:10', 14.0743649, 104.0982534, 'Anlong Veaeng, Oddar Meanchey', 13.5978235, 103.5167523, 'Kralanh, Siem Reap', 'attendance/selfies/79OCgHSiHMKgv1JsIvha1scQsXbH0q8ERw8Z5Zjw.jpg', 'attendance/checkouts/UTo7p8D4V4PsaDgwOIqG0VxdT47vSjZ9MI9h6rlz.jpg', NULL, 108, NULL, NULL, 498, 'Submitted from outdoor sales attendance.', NULL, '2026-06-18 10:47:32', '2026-06-18 10:47:32', '2026-06-18 19:05:10'),
(372, 16, 1, '2026-06-19', 'office', 'present', '2026-06-19 08:15:51', '2026-06-19 17:07:34', 11.6484108, 104.9074800, 'Sangkat Prek Liep, Phnom Penh', 11.6483992, 104.9074602, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/BZ3ZrSWumxn4OwJD4T9dPTEWciS5qPlel8T3w41n.jpg', 'attendance/checkouts/uJK35WCkvasDSyW35EPHDUNlajGsu1TcjXbWnHIJ.jpg', NULL, 0, NULL, NULL, 532, 'Submitted from web attendance.', NULL, '2026-06-19 08:15:51', '2026-06-19 08:15:51', '2026-06-19 17:07:35'),
(373, 8, 1, '2026-06-19', 'office', 'present', '2026-06-19 08:20:07', '2026-06-19 17:36:41', 11.6484411, 104.9074303, 'Sangkat Prek Liep, Phnom Penh', 11.6484432, 104.9074288, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/Tcc3mbg5QWYoSuC5FvKyYSbcBlJfXDU9VFl8qj9A.jpg', 'attendance/checkouts/pGtEiBwFTqlWqQ50BdkIQpJiCdBR0a7dQL9pxa2U.jpg', NULL, 0, NULL, NULL, 557, 'Submitted from web attendance.', NULL, '2026-06-19 08:20:07', '2026-06-19 08:20:07', '2026-06-19 17:36:41'),
(374, 9, 1, '2026-06-19', 'office', 'present', '2026-06-19 08:24:32', '2026-06-19 18:38:37', 11.6484055, 104.9074655, 'Sangkat Prek Liep, Phnom Penh', 11.6484055, 104.9074655, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/haDnU9ehhQtDqcQW1wvJHkhMfYVgGuU6YL27IC6v.jpg', 'attendance/checkouts/6GSaMlKXsH84ZuKLTkrT9n4h2e3CBP3YJGgdYMk4.jpg', NULL, 0, NULL, NULL, 614, 'Submitted from web attendance.', NULL, '2026-06-19 08:24:33', '2026-06-19 08:24:33', '2026-06-19 18:38:37'),
(375, 15, 1, '2026-06-19', 'office', 'present', '2026-06-19 08:54:18', '2026-06-19 17:26:38', 11.6483587, 104.9074009, 'Sangkat Prek Liep, Phnom Penh', 11.6483872, 104.9074357, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/ZZCk5VkeXbj2H9ZGxojhkoQhyZh2sEAXvNU0IraM.jpg', 'attendance/checkouts/sBV6t4S5obBfVFCt3nvH0nJYT2h8znHhQCNpavKc.jpg', NULL, 0, NULL, NULL, 512, 'Submitted from web attendance.', NULL, '2026-06-19 08:54:18', '2026-06-19 08:54:18', '2026-06-19 17:26:38'),
(376, 12, 1, '2026-06-19', 'office', 'present', '2026-06-19 08:54:38', '2026-06-19 18:38:30', 11.6484309, 104.9075093, 'Sangkat Prek Liep, Phnom Penh', 11.6484302, 104.9075092, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/uQhaZ8higpxd3QqjOpKckaEdQUXkPe7GZ1BiKziT.jpg', 'attendance/checkouts/idA3Sh6I7oojXQU46U7rbY5KrtMwyfj5PiPVo2gU.jpg', NULL, 0, NULL, NULL, 584, 'Submitted from web attendance.', NULL, '2026-06-19 08:54:39', '2026-06-19 08:54:39', '2026-06-19 18:38:31'),
(377, 14, 1, '2026-06-19', 'office', 'present', '2026-06-19 08:59:34', '2026-06-19 17:26:16', 11.6483840, 104.9074347, 'Sangkat Prek Liep, Phnom Penh', 11.6483763, 104.9074947, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/rlrHgpUmgCXofPz1AtnQJJcSIJgVtM82Dvr1fZwJ.jpg', 'attendance/checkouts/9G2VE8ru2Gu4U8EER2uE1WpJG8ERKopOEnDZtVAl.jpg', NULL, 0, NULL, NULL, 507, 'Submitted from web attendance.', NULL, '2026-06-19 08:59:35', '2026-06-19 08:59:35', '2026-06-19 17:26:17'),
(378, 13, 1, '2026-06-19', 'office', 'late', '2026-06-19 09:08:16', '2026-06-19 18:39:03', 11.6484157, 104.9074555, 'Sangkat Prek Liep, Phnom Penh', 11.6484157, 104.9074555, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/NdB2OFKR2Cic1FlCJvfg079bLOy63EEg3petlqBQ.jpg', 'attendance/checkouts/zTAsgUhiC5BPt5mfa41SgC6hkWwC4h2Pr2sSaLm2.jpg', NULL, 9, NULL, NULL, 571, 'Submitted from web attendance.', NULL, '2026-06-19 09:08:17', '2026-06-19 09:08:17', '2026-06-19 18:39:04'),
(379, 21, 1, '2026-06-19', 'outdoor', 'late', '2026-06-19 09:11:58', NULL, 13.5875410, 103.4163755, 'Kralanh, Siem Reap', NULL, NULL, NULL, 'attendance/selfies/GJtErRSiqrhp78mBfulnBvoai0X3MiaKG1hrHFFY.jpg', NULL, NULL, 12, NULL, NULL, 0, 'Submitted from outdoor sales attendance.', NULL, '2026-06-19 09:11:58', '2026-06-19 09:11:58', '2026-06-19 09:11:58'),
(380, 5, 1, '2026-06-19', 'office', 'late', '2026-06-19 09:16:51', '2026-06-19 17:07:06', 11.6484124, 104.9074402, 'Sangkat Prek Liep, Phnom Penh', 11.6484127, 104.9074400, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/DPvsX82ELkODtsnTvpQWv6Tfp1xu95vC3fkkpLzi.jpg', 'attendance/checkouts/i22dNrXJcbvJ52HAEpHHbpjoD1XknxRVvazpbZBI.jpg', NULL, 17, NULL, NULL, 470, 'Submitted from web attendance.', NULL, '2026-06-19 09:16:51', '2026-06-19 09:16:51', '2026-06-19 17:07:07'),
(381, 6, 1, '2026-06-19', 'office', 'late', '2026-06-19 09:33:44', '2026-06-19 17:01:32', 11.6483874, 104.9074283, 'Sangkat Prek Liep, Phnom Penh', 11.6483836, 104.9074772, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/eoIBzN2H7aLBwKtZYnaxoskkQnGpcKB87HAmq7Hx.jpg', 'attendance/checkouts/NZzCo9vM15aMKwQFGR6Dfs1OcFphKS75vvNEcSqk.jpg', NULL, 34, 1.50, '30 min', 448, 'Submitted from web attendance.', NULL, '2026-06-19 09:33:44', '2026-06-19 09:33:44', '2026-06-19 17:01:33'),
(382, 3, NULL, '2026-06-19', 'office', 'late', '2026-06-19 09:37:37', '2026-06-19 17:25:51', 11.6483807, 104.9074632, 'Sangkat Prek Liep, Phnom Penh', 11.6483749, 104.9074649, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/pGQgMKhLDFdsM7303aXeAeJ7ANUvQocr05ArRoS4.jpg', 'attendance/checkouts/IAbyWKoNDIUk6YhYL1ZlJkieXBL833p40vd5ygDw.jpg', NULL, 38, 1.50, '30 min', 468, 'Submitted from web attendance.', NULL, '2026-06-19 09:37:38', '2026-06-19 09:37:38', '2026-06-19 17:25:52'),
(383, 4, 1, '2026-06-19', 'office', 'present', '2026-06-19 11:28:34', NULL, 11.6484482, 104.9074599, 'Sangkat Prek Liep, Phnom Penh', NULL, NULL, NULL, 'attendance/selfies/wgOgWYCyD8lmhMYnoqQYJhWnmji36J3tgokRNDnW.jpg', NULL, NULL, 0, NULL, NULL, 0, 'Submitted from web attendance.', NULL, '2026-06-19 11:28:35', '2026-06-19 11:28:35', '2026-06-19 11:28:35'),
(384, 16, 1, '2026-06-20', 'office', 'present', '2026-06-20 08:09:12', '2026-06-20 17:01:06', 11.6484100, 104.9074641, 'Sangkat Prek Liep, Phnom Penh', 11.6484134, 104.9074619, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/vakQdX17OCCe59AW1iWKczLYpJXlcvuC2HZnKvmm.jpg', 'attendance/checkouts/mExZeBkx5UkuaWTCxyCacLGNTEcRTBgxJZkGS2Yb.jpg', NULL, 0, NULL, NULL, 532, 'Submitted from web attendance.', NULL, '2026-06-20 08:09:12', '2026-06-20 08:09:12', '2026-06-20 17:01:06'),
(385, 8, 1, '2026-06-20', 'office', 'present', '2026-06-20 08:21:09', '2026-06-20 17:47:17', 11.6484380, 104.9074365, 'Sangkat Prek Liep, Phnom Penh', 11.6484404, 104.9074310, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/kqyDAGSHP7pHNe0DtI2w2O0ObiPlJ4JYmb2Z8uBK.jpg', 'attendance/checkouts/7MOJYpZUXhwcxsTmX0Oe7Cw4rwXBiqqEowseR9Yo.jpg', NULL, 0, NULL, NULL, 566, 'Submitted from web attendance.', NULL, '2026-06-20 08:21:10', '2026-06-20 08:21:10', '2026-06-20 17:47:18'),
(386, 14, 1, '2026-06-20', 'office', 'present', '2026-06-20 08:51:26', '2026-06-20 17:27:52', 11.6483837, 104.9074348, 'Sangkat Prek Liep, Phnom Penh', 11.6483723, 104.9075020, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/Qkv4J3NHyTN94MkscOsnGA8lKhfBlLCaodcX5gFN.jpg', 'attendance/checkouts/9RbIckFgwOcs5VMmUSgMq5vS9TWxfNrw6rVkZGKe.jpg', NULL, 0, NULL, NULL, 516, 'Submitted from web attendance.', NULL, '2026-06-20 08:51:27', '2026-06-20 08:51:27', '2026-06-20 17:27:52'),
(387, 4, 1, '2026-06-20', 'office', 'present', '2026-06-20 09:04:28', '2026-06-20 17:32:28', 11.6484511, 104.9074675, 'Sangkat Prek Liep, Phnom Penh', 11.6484594, 104.9074697, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/83HGIBWGteG1dmDB2ojEBwoGTlTghsmzQkMxck8y.jpg', 'attendance/checkouts/1Wd7g32UJNaHYAj7WARZlh6kCaZo5MgfUS9Fztch.jpg', NULL, 0, NULL, NULL, 508, 'Submitted from web attendance.', NULL, '2026-06-20 09:04:28', '2026-06-20 09:04:28', '2026-06-20 17:32:28'),
(388, 5, 1, '2026-06-20', 'office', 'late', '2026-06-20 09:20:21', '2026-06-20 17:01:24', 11.6484075, 104.9074666, 'Sangkat Prek Liep, Phnom Penh', 11.6484075, 104.9074666, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/N4iEk2MEHzzRisW3lKMZoXvhDf4WfYEqIj4w7GxU.jpg', 'attendance/checkouts/JPDRLBDEDvGrhQlQFdEV1KxiNWBX0CeAR8DZPMXQ.jpg', NULL, 21, NULL, NULL, 461, 'Submitted from web attendance.', NULL, '2026-06-20 09:20:22', '2026-06-20 09:20:22', '2026-06-20 17:01:25'),
(389, 6, 1, '2026-06-20', 'office', 'late', '2026-06-20 09:22:27', '2026-06-20 17:00:32', 11.6483506, 104.9073741, 'Sangkat Prek Liep, Phnom Penh', 11.6483836, 104.9074772, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/bE5hih6XD3Py6PotkxIeC4RWya8faYdua9997cFU.jpg', 'attendance/checkouts/Zh0aK7i0CPdgS1CxYGaqYLeYoaHdd1ibDBNSeZbg.jpg', NULL, 23, NULL, NULL, 458, 'Submitted from web attendance.', NULL, '2026-06-20 09:22:28', '2026-06-20 09:22:28', '2026-06-20 17:00:32'),
(390, 3, NULL, '2026-06-20', 'office', 'late', '2026-06-20 09:31:21', '2026-06-20 17:02:36', 11.6483934, 104.9073969, 'Sangkat Prek Liep, Phnom Penh', 11.6483826, 104.9074645, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/XQMtj2XSiRAbeEs0qVjvBUcmVyycEl2mDQnbI0In.jpg', 'attendance/checkouts/wFTQit8GD9VcF3e22ovKpqVrpeYUBNJIo47NZwtJ.jpg', NULL, 32, 1.50, '30 min', 451, 'Submitted from web attendance.', NULL, '2026-06-20 09:31:21', '2026-06-20 09:31:21', '2026-06-20 17:02:37'),
(391, 21, 1, '2026-06-20', 'outdoor', 'late', '2026-06-20 10:08:04', NULL, 13.3902332, 103.8661692, 'Siem Reap, Siem Reap', NULL, NULL, NULL, 'attendance/selfies/X6lGnW6IvqJJPdJfF9nq8ZdCzxTToT3MYVAFjolJ.jpg', NULL, NULL, 69, NULL, NULL, 0, 'Submitted from outdoor sales attendance.', NULL, '2026-06-20 10:08:05', '2026-06-20 10:08:05', '2026-06-20 10:08:05'),
(392, 17, 1, '2026-06-20', 'outdoor', 'late', '2026-06-20 10:19:02', NULL, 13.3702557, 103.8528765, 'Krous, Siem Reap', NULL, NULL, NULL, 'attendance/selfies/ZsFjjnaQpigA8YoRM1poZegYViEqE8Y5yXq8gGfx.jpg', NULL, NULL, 80, NULL, NULL, 0, 'Submitted from outdoor sales attendance.', NULL, '2026-06-20 10:19:02', '2026-06-20 10:19:02', '2026-06-20 10:19:02'),
(393, 8, 1, '2026-06-21', 'office', 'present', '2026-06-21 08:25:24', '2026-06-21 17:47:28', 11.6484233, 104.9074611, 'Sangkat Prek Liep, Phnom Penh', 11.6484193, 104.9074755, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/vO4f0c1S7tZ1AKS5d76uHUi9YHZZ05l4ubHLceRj.jpg', 'attendance/checkouts/30o1uSlUSKbGj7vkGLpjhxjoLZlH5E8E1DbzkT0c.jpg', NULL, 0, NULL, NULL, 562, 'Submitted from web attendance.', NULL, '2026-06-21 08:25:24', '2026-06-21 08:25:24', '2026-06-21 17:47:29'),
(394, 16, 1, '2026-06-21', 'office', 'present', '2026-06-21 08:30:45', NULL, 11.6483464, 104.9074347, 'Sangkat Prek Liep, Phnom Penh', NULL, NULL, NULL, 'attendance/selfies/qhlHMPVuspKg7rgHzzS4YzsXSRi57QyoGnIMbhlS.jpg', NULL, NULL, 0, NULL, NULL, 0, 'Submitted from web attendance.', NULL, '2026-06-21 08:30:45', '2026-06-21 08:30:45', '2026-06-21 08:30:45'),
(395, 17, 1, '2026-06-21', 'outdoor', 'late', '2026-06-21 10:31:28', NULL, 13.3703029, 103.8530388, 'Krous, Siem Reap', NULL, NULL, NULL, 'attendance/selfies/ZvDyAj4gxVsnJDDulsZ7Jc2u9cPHVTwfCj8owO7O.jpg', NULL, NULL, 92, NULL, NULL, 0, 'Submitted from outdoor sales attendance.', NULL, '2026-06-21 10:31:28', '2026-06-21 10:31:28', '2026-06-21 10:31:28'),
(396, 21, 1, '2026-06-21', 'outdoor', 'late', '2026-06-21 10:42:11', '2026-06-21 18:35:30', 13.3710207, 103.8502470, 'Krous, Siem Reap', 13.3837444, 103.8754646, 'Siem Reap, Siem Reap', 'attendance/selfies/3zftfxz6SfHXrvtyRxU3pZ8bojcSyDbNBJ3sxUZD.jpg', 'attendance/checkouts/cypqSh5FrBgfxbd1MrCbkGGf5k5OrSsIGouO3Pb5.jpg', NULL, 103, NULL, NULL, 473, 'Submitted from outdoor sales attendance.', NULL, '2026-06-21 10:42:11', '2026-06-21 10:42:11', '2026-06-21 18:35:30'),
(397, 8, 1, '2026-06-22', 'office', 'present', '2026-06-22 08:13:57', '2026-06-22 17:19:51', 11.6484465, 104.9074625, 'Sangkat Prek Liep, Phnom Penh', 11.6484344, 104.9074061, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/pxkszo5khN07xyx00JjOU5yardikKUTeibbzpOvL.jpg', 'attendance/checkouts/88fgshhN8Xh0hW11jUxcO7DPr5u3Axmf6wnUuciB.jpg', NULL, 0, NULL, NULL, 546, 'Submitted from web attendance.', NULL, '2026-06-22 08:13:58', '2026-06-22 08:13:58', '2026-06-22 17:19:52'),
(398, 16, 1, '2026-06-22', 'office', 'present', '2026-06-22 08:33:44', '2026-06-22 17:00:37', 11.6483904, 104.9074713, 'Sangkat Prek Liep, Phnom Penh', 11.6483836, 104.9074715, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/4Qb4PYO7vAZH2quPsYtZayJq1yPMiJLe6zRtpYLP.jpg', 'attendance/checkouts/NMU0ZdNNcSnVBObImElFwiXEQxPNSHvXEOPFauAb.jpg', NULL, 0, NULL, NULL, 507, 'Submitted from web attendance.', NULL, '2026-06-22 08:33:45', '2026-06-22 08:33:45', '2026-06-22 17:00:38'),
(399, 13, 1, '2026-06-22', 'office', 'present', '2026-06-22 08:41:34', '2026-06-22 18:15:04', 11.6484759, 104.9075129, 'Sangkat Prek Liep, Phnom Penh', 11.6484157, 104.9074555, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/qCJxm9bLkGYAVpI8loQSJnUHxVV7Owo0HQozXksS.jpg', 'attendance/checkouts/62zlGVhAA8FvbT27DChAPqgqGy907hg0kze7JPTM.jpg', NULL, 0, NULL, NULL, 574, 'Submitted from web attendance.', NULL, '2026-06-22 08:41:34', '2026-06-22 08:41:34', '2026-06-22 18:15:05'),
(400, 15, 1, '2026-06-22', 'office', 'present', '2026-06-22 08:45:02', '2026-06-22 18:54:30', 11.6483784, 104.9074032, 'Sangkat Prek Liep, Phnom Penh', 11.6483688, 104.9074162, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/jfkr0gKVonPYcpVyStSSWHqEJ1CZi6YclyCk68po.jpg', 'attendance/checkouts/tuXjYb4GVkmvkKsHlcNNdT0CsgpRLueXWUKGT7bL.jpg', NULL, 0, NULL, NULL, 609, 'Submitted from web attendance.', NULL, '2026-06-22 08:45:03', '2026-06-22 08:45:03', '2026-06-22 18:54:31'),
(401, 21, 1, '2026-06-22', 'outdoor', 'present', '2026-06-22 08:47:48', '2026-06-22 19:53:57', 14.1818732, 103.5236621, 'Samraong, Samraong', 14.1914029, 103.5268337, 'Samraong, Samraong', 'attendance/selfies/xjSistntVRvI6krgrClYXhJxv3i7ce21vlosf0EI.jpg', 'attendance/checkouts/3Weg9mLWcTC5lTKKuXVK9nnUI6v2K3XjAj0iMlSz.jpg', NULL, 0, NULL, NULL, 666, 'Submitted from outdoor sales attendance.', NULL, '2026-06-22 08:47:49', '2026-06-22 08:47:49', '2026-06-22 19:53:58'),
(402, 12, 1, '2026-06-22', 'office', 'present', '2026-06-22 08:48:37', '2026-06-22 18:14:49', 11.6483255, 104.9074806, 'Sangkat Prek Liep, Phnom Penh', 11.6483478, 104.9074518, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/B8bmsoLyoIxC0EjTIWFhb2jMZwWzjSIshTeQk698.jpg', 'attendance/checkouts/a3mm71yJVXE7fV3sC1bUaU4XAbpsBFDJebryTjPw.jpg', NULL, 0, NULL, NULL, 566, 'Submitted from web attendance.', NULL, '2026-06-22 08:48:38', '2026-06-22 08:48:38', '2026-06-22 18:14:50'),
(403, 14, 1, '2026-06-22', 'office', 'present', '2026-06-22 08:59:53', '2026-06-22 18:56:59', 11.6483990, 104.9074560, 'Sangkat Prek Liep, Phnom Penh', 11.6483703, 104.9075086, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/BlPGbuOK3e6nuS1UpKZPMT50OHTnx6VD1aeRwhyo.jpg', 'attendance/checkouts/R0JD1TGS5yBgtLIwsxi64lzZ707qtd7n0GGmjzPd.jpg', NULL, 0, NULL, NULL, 597, 'Submitted from web attendance.', NULL, '2026-06-22 08:59:53', '2026-06-22 08:59:53', '2026-06-22 18:56:59'),
(404, 6, 1, '2026-06-22', 'office', 'late', '2026-06-22 09:12:08', '2026-06-22 17:06:19', 11.6483690, 104.9074524, 'Sangkat Prek Liep, Phnom Penh', 11.6483836, 104.9074772, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/04TzpWMUN3JdJFKXPDjB5Mf13enUDxBkFQuzoL0Z.jpg', 'attendance/checkouts/W7EfNLIcw2jn44qEK0rQB6Ib9ZBavT7ORV3lUGTt.jpg', NULL, 13, NULL, NULL, 474, 'Submitted from web attendance.', NULL, '2026-06-22 09:12:08', '2026-06-22 09:12:08', '2026-06-22 17:06:20'),
(405, 5, 1, '2026-06-22', 'office', 'late', '2026-06-22 09:20:19', '2026-06-22 17:04:57', 11.6484075, 104.9074666, 'Sangkat Prek Liep, Phnom Penh', 11.6484075, 104.9074666, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/2d163U0BAAfwFNMI0fphqAq6OVgtTSezR9LEaIta.jpg', 'attendance/checkouts/Ys4rXq24QDH3D0Mcn9daaAzgF4lQSTM9HE1OoQHG.jpg', NULL, 21, NULL, NULL, 465, 'Submitted from web attendance.', NULL, '2026-06-22 09:20:20', '2026-06-22 09:20:20', '2026-06-22 17:04:58'),
(406, 3, NULL, '2026-06-22', 'office', 'late', '2026-06-22 09:20:54', '2026-06-22 18:07:21', 11.6483813, 104.9074647, 'Sangkat Prek Liep, Phnom Penh', 11.6483757, 104.9074604, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/gCWOQnrCt1VoxJoddW64kJFc8L4mByjKas5sNDzO.jpg', 'attendance/checkouts/Qi6MnfX5wbhsVjkmA7jgbvAkhtzVtwg4dRAwQwkO.jpg', NULL, 21, NULL, NULL, 526, 'Submitted from web attendance.', NULL, '2026-06-22 09:20:54', '2026-06-22 09:20:54', '2026-06-22 18:07:21'),
(407, 9, 1, '2026-06-22', 'office', 'late', '2026-06-22 09:58:41', '2026-06-22 18:14:18', 11.6484968, 104.9075284, 'Sangkat Prek Liep, Phnom Penh', 11.6484050, 104.9074676, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/NpYip9mNg3pL6DsGLaQniREZEDU7iTJ5bzyheYZX.jpg', 'attendance/checkouts/RCbm8yrqBKNcleATIJEoejhNzgEERmX5I9DEsk4B.jpg', NULL, 59, 1.50, '30 min', 496, 'Submitted from web attendance.', NULL, '2026-06-22 09:58:42', '2026-06-22 09:58:42', '2026-06-22 18:14:18'),
(408, 17, 1, '2026-06-22', 'outdoor', 'late', '2026-06-22 10:08:59', NULL, 13.6016395, 103.4162897, 'Kralanh, Siem Reap', NULL, NULL, NULL, 'attendance/selfies/SI1mnOrM9FbyghOhzxaj45SdtH0rLys21CxR5rZp.jpg', NULL, NULL, 69, NULL, NULL, 0, 'Submitted from outdoor sales attendance.', NULL, '2026-06-22 10:09:01', '2026-06-22 10:09:01', '2026-06-22 10:09:01'),
(409, 4, 1, '2026-06-22', 'office', 'present', '2026-06-22 11:20:19', '2026-06-22 17:08:44', 11.6484579, 104.9074522, 'Sangkat Prek Liep, Phnom Penh', 11.6484156, 104.9074553, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/TGLNsnLwiflYEN1Z8FrvAby1l0VatFXWox47JLG9.jpg', 'attendance/checkouts/1BTvClp4CFITx5G9MaOzQxMwxTVmylaLKsWoTNqR.jpg', NULL, 0, NULL, NULL, 348, 'Submitted from web attendance.', NULL, '2026-06-22 11:20:19', '2026-06-22 11:20:19', '2026-06-22 17:08:44'),
(410, 8, 1, '2026-06-23', 'office', 'present', '2026-06-23 08:23:28', '2026-06-23 17:22:29', 11.6484221, 104.9074738, 'Sangkat Prek Liep, Phnom Penh', 11.6484291, 104.9074687, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/ZEFC46ENPZV6tYGW9PPKCKHMc1laoMm4dco75lv8.jpg', 'attendance/checkouts/5hUSFJjr146ENHnL0vkfCk8Fhbn8xmt0xQlBvK8A.jpg', NULL, 0, NULL, NULL, 539, 'Submitted from web attendance.', NULL, '2026-06-23 08:23:29', '2026-06-23 08:23:29', '2026-06-23 17:22:30'),
(411, 9, 1, '2026-06-23', 'office', 'present', '2026-06-23 08:35:48', '2026-06-23 19:55:55', 11.6484057, 104.9074673, 'Sangkat Prek Liep, Phnom Penh', 11.6484057, 104.9074673, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/SBT4X3b5K6WobICVkdS1EREwQeWOPbBZG1uhVJBW.jpg', 'attendance/checkouts/soAKBOYOlh7ZH2XqF3IXYD8Tq7mleNXdbWjWQ9vM.jpg', NULL, 0, NULL, NULL, 680, 'Submitted from web attendance.', NULL, '2026-06-23 08:35:49', '2026-06-23 08:35:49', '2026-06-23 19:55:56'),
(412, 14, 1, '2026-06-23', 'office', 'present', '2026-06-23 08:45:59', '2026-06-23 18:13:52', 11.6483703, 104.9075084, 'Sangkat Prek Liep, Phnom Penh', 11.6483703, 104.9075086, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/vVy9G292SOGcEvdRpUJZafFu4Q4ZjnkSvpmhVUQ4.jpg', 'attendance/checkouts/attR7k9lIDiYUkYtrOuKS7Z4rfQETYTxfB1WsIYw.jpg', NULL, 0, NULL, NULL, 568, 'Submitted from web attendance.', NULL, '2026-06-23 08:46:00', '2026-06-23 08:46:00', '2026-06-23 18:13:52'),
(413, 15, 1, '2026-06-23', 'office', 'late', '2026-06-23 09:09:16', '2026-06-23 18:05:44', 11.6484199, 104.9074403, 'Sangkat Prek Liep, Phnom Penh', 11.6483692, 104.9074174, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/7chwdEEsnJ9BJruo4jz0md9wY04XkqPE6s4Gh6Gf.jpg', 'attendance/checkouts/c9kLvs2AItHhfp4sopMnT9zp9G7c825PfpfGESgk.jpg', NULL, 10, NULL, NULL, 536, 'Submitted from web attendance.', NULL, '2026-06-23 09:09:16', '2026-06-23 09:09:16', '2026-06-23 18:05:44'),
(414, 4, 1, '2026-06-23', 'office', 'present', '2026-06-23 09:12:08', '2026-06-23 18:14:01', 11.6484156, 104.9074553, 'Sangkat Prek Liep, Phnom Penh', 11.6484156, 104.9074553, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/ArCiUUrfz6lM1WtUnUigxXCuaunRmDgXnGqqjpbV.jpg', 'attendance/checkouts/9tfw1ILqPAofX5wojzG9CuEV9KRbSzSC9PszFnFP.jpg', NULL, 0, NULL, NULL, 542, 'Submitted from web attendance.', NULL, '2026-06-23 09:12:09', '2026-06-23 09:12:09', '2026-06-23 18:14:02'),
(415, 19, 1, '2026-06-23', 'office', 'late', '2026-06-23 09:14:53', '2026-06-23 17:13:31', 11.6483727, 104.9074797, 'Sangkat Prek Liep, Phnom Penh', 11.6483727, 104.9074797, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/MzGGyrDwEKO0bCZhRk0kzfUtYmkoIDX8fFseqooE.jpg', 'attendance/checkouts/Be7T4wIJgMwDtRbU9HyjqI8bPAPAEplu9sXZbmId.jpg', NULL, 15, NULL, NULL, 479, 'Submitted from web attendance.', NULL, '2026-06-23 09:14:53', '2026-06-23 09:14:53', '2026-06-23 17:13:31'),
(416, 6, 1, '2026-06-23', 'office', 'late', '2026-06-23 09:17:41', '2026-06-23 17:23:18', 11.6484093, 104.9075071, 'Sangkat Prek Liep, Phnom Penh', 11.6483836, 104.9074772, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/zUpL9fNJ8NarBrtWH1oZSrmFzWUpMuo4dAjiUQk3.jpg', 'attendance/checkouts/EMrEFNP6uKFaceLkA4CRBzgDFx7gLvZPCHWBWGRo.jpg', NULL, 18, NULL, NULL, 486, 'Submitted from web attendance.', NULL, '2026-06-23 09:17:41', '2026-06-23 09:17:41', '2026-06-23 17:23:19'),
(417, 13, 1, '2026-06-23', 'office', 'late', '2026-06-23 09:19:57', '2026-06-23 19:54:34', 11.6484554, 104.9074484, 'Sangkat Prek Liep, Phnom Penh', 11.6484622, 104.9074500, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/nRXzN7hVPS6novhTSbNIZZ8krAaG7jxBP6wHAvK1.jpg', 'attendance/checkouts/ljnnyBIL8LDWs3S1snOCHTdfIOec0XvvQ8KTFmjK.jpg', NULL, 20, NULL, NULL, 635, 'Submitted from web attendance.', NULL, '2026-06-23 09:19:57', '2026-06-23 09:19:57', '2026-06-23 19:54:35'),
(418, 12, 1, '2026-06-23', 'office', 'late', '2026-06-23 09:19:58', '2026-06-23 19:54:50', 11.6483478, 104.9074518, 'Sangkat Prek Liep, Phnom Penh', 11.6483478, 104.9074518, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/xMDAQtk2CKYW7pm3Myh8KNjOeUDsMiAdRMIwbtoo.jpg', 'attendance/checkouts/LNb0hF28wQnwbOP1BRN0wONAnvF6ZLCoZKxRdrft.jpg', NULL, 20, NULL, NULL, 635, 'Submitted from web attendance.', NULL, '2026-06-23 09:19:59', '2026-06-23 09:19:59', '2026-06-23 19:54:51'),
(419, 5, 1, '2026-06-23', 'office', 'late', '2026-06-23 09:23:00', '2026-06-23 17:17:48', 11.6483904, 104.9074574, 'Sangkat Prek Liep, Phnom Penh', 11.6483976, 104.9074443, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/ezwppBJ3zfUkhV7jOvBOAYgsi1NFmAvGL1eQdkLS.jpg', 'attendance/checkouts/eCJPa2fE6CAWGU3e3CpulrUVDHPxkTumDopz6Go5.jpg', NULL, 23, NULL, NULL, 475, 'Submitted from web attendance.', NULL, '2026-06-23 09:23:00', '2026-06-23 09:23:00', '2026-06-23 17:17:48'),
(420, 3, NULL, '2026-06-23', 'office', 'late', '2026-06-23 09:51:00', '2026-06-23 18:04:42', 11.6483747, 104.9074595, 'Sangkat Prek Liep, Phnom Penh', 11.6483390, 104.9075000, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/T0IBhXOSHsom7jxtOBDW0QYLwEEgtMJpjgNyLjQa.jpg', 'attendance/checkouts/S8xNZt1qwi1eOvhzGcet0CrkChRyA7fTbFGvHari.jpg', NULL, 51, 1.50, '30 min', 494, 'Submitted from web attendance.', NULL, '2026-06-23 09:51:00', '2026-06-23 09:51:00', '2026-06-23 18:04:42'),
(421, 8, 1, '2026-06-24', 'office', 'present', '2026-06-24 08:17:43', NULL, 11.6484335, 104.9074710, 'Sangkat Prek Liep, Phnom Penh', NULL, NULL, NULL, 'attendance/selfies/6u947YhMSqazeQuD4HPFG868cWLOqKj07RbAgLm1.jpg', NULL, NULL, 0, NULL, NULL, 0, 'Submitted from web attendance.', NULL, '2026-06-24 08:17:43', '2026-06-24 08:17:43', '2026-06-24 08:17:43'),
(422, 16, 1, '2026-06-24', 'office', 'present', '2026-06-24 08:19:20', NULL, 11.6483878, 104.9074594, 'Sangkat Prek Liep, Phnom Penh', NULL, NULL, NULL, 'attendance/selfies/X1kvqyuIhsQiK8dzEaJirEumRy5JTnVytrv4BVq5.jpg', NULL, NULL, 0, NULL, NULL, 0, 'Submitted from web attendance.', NULL, '2026-06-24 08:19:21', '2026-06-24 08:19:21', '2026-06-24 08:19:21'),
(423, 17, 1, '2026-06-24', 'outdoor', 'present', '2026-06-24 08:21:46', NULL, 14.1884365, 103.5218983, 'Samraong, Samraong', NULL, NULL, NULL, 'attendance/selfies/sKMWgMBFXRue7k9FlqjyrnDya9gTXjKrCDiOKJIx.jpg', NULL, NULL, 0, NULL, NULL, 0, 'Submitted from outdoor sales attendance.', NULL, '2026-06-24 08:21:48', '2026-06-24 08:21:48', '2026-06-24 08:21:48'),
(424, 15, 1, '2026-06-24', 'office', 'present', '2026-06-24 08:54:06', NULL, 11.6483687, 104.9074165, 'Sangkat Prek Liep, Phnom Penh', NULL, NULL, NULL, 'attendance/selfies/FEAN4H5OblIAt0OtbpGQea3VAXo6FwJriBcur3cd.jpg', NULL, NULL, 0, NULL, NULL, 0, 'Submitted from web attendance.', NULL, '2026-06-24 08:54:07', '2026-06-24 08:54:07', '2026-06-24 08:54:07'),
(425, 14, 1, '2026-06-24', 'office', 'present', '2026-06-24 08:58:33', NULL, 11.6484203, 104.9074672, 'Sangkat Prek Liep, Phnom Penh', NULL, NULL, NULL, 'attendance/selfies/WM3uCTqweVslYSn5MNAVTgoBKyjKVUjYWxhJ2zsG.jpg', NULL, NULL, 0, NULL, NULL, 0, 'Submitted from web attendance.', NULL, '2026-06-24 08:58:34', '2026-06-24 08:58:34', '2026-06-24 08:58:34'),
(426, 12, 1, '2026-06-24', 'office', 'late', '2026-06-24 09:13:33', NULL, 11.6483972, 104.9074177, 'Sangkat Prek Liep, Phnom Penh', NULL, NULL, NULL, 'attendance/selfies/vvFeFWAyLhnWOLovPplBpkOpPnvRftZto15CtxbB.jpg', NULL, NULL, 14, NULL, NULL, 0, 'Submitted from web attendance.', NULL, '2026-06-24 09:13:34', '2026-06-24 09:13:34', '2026-06-24 09:13:34'),
(427, 13, 1, '2026-06-24', 'office', 'late', '2026-06-24 09:13:33', NULL, 11.6484356, 104.9073996, 'Sangkat Prek Liep, Phnom Penh', NULL, NULL, NULL, 'attendance/selfies/uXcJ3O19QJgkwRTg8ecYqdpCMhMfttFz7yR4MBWX.jpg', NULL, NULL, 14, NULL, NULL, 0, 'Submitted from web attendance.', NULL, '2026-06-24 09:13:34', '2026-06-24 09:13:34', '2026-06-24 09:13:34'),
(428, 9, 1, '2026-06-24', 'office', 'late', '2026-06-24 09:14:27', NULL, 11.6484058, 104.9074674, 'Sangkat Prek Liep, Phnom Penh', NULL, NULL, NULL, 'attendance/selfies/7UPB7RMDeAfnsahv9TBI3yAb9AnMBIFlelOKpa4H.jpg', NULL, NULL, 15, NULL, NULL, 0, 'Submitted from web attendance.', NULL, '2026-06-24 09:14:28', '2026-06-24 09:14:28', '2026-06-24 09:14:28'),
(429, 5, 1, '2026-06-24', 'office', 'late', '2026-06-24 09:18:59', NULL, 11.6484420, 104.9075268, 'Sangkat Prek Liep, Phnom Penh', NULL, NULL, NULL, 'attendance/selfies/txS5vDgOTDjVkvHeg0sWyHECIlLKAEO2YBKakDta.jpg', NULL, NULL, 19, NULL, NULL, 0, 'Submitted from web attendance.', NULL, '2026-06-24 09:19:00', '2026-06-24 09:19:00', '2026-06-24 09:19:00'),
(430, 21, 1, '2026-06-24', 'outdoor', 'late', '2026-06-24 09:24:34', '2026-06-24 21:31:43', 14.1758169, 103.5174961, 'Samraong, Samraong', 13.3970137, 103.8640671, 'Siem Reap, Siem Reap', 'attendance/selfies/INqoxSobb879wIU7ZE4u7ZsQAlE9DDnteuKTht8c.jpg', 'attendance/checkouts/g8gpeTH5Tjx8z7aCQ6O0WtLsmE4SQignAYn3Lf5W.jpg', NULL, 25, NULL, NULL, 727, 'Submitted from outdoor sales attendance.', NULL, '2026-06-24 09:24:35', '2026-06-24 09:24:35', '2026-06-24 21:31:44'),
(431, 6, 1, '2026-06-24', 'office', 'late', '2026-06-24 09:28:23', NULL, 11.6483836, 104.9074772, 'Sangkat Prek Liep, Phnom Penh', NULL, NULL, NULL, 'attendance/selfies/TxUblckrRzebixWeUbyalUcJ1MZdr4hY48xDkI7b.jpg', NULL, NULL, 29, NULL, NULL, 0, 'Submitted from web attendance.', NULL, '2026-06-24 09:28:24', '2026-06-24 09:28:24', '2026-06-24 09:28:24'),
(432, 3, NULL, '2026-06-24', 'office', 'late', '2026-06-24 09:30:34', NULL, 11.6483763, 104.9074583, 'Sangkat Prek Liep, Phnom Penh', NULL, NULL, NULL, 'attendance/selfies/p1kPjPSRBK2quPdvmlFeLCz3KwNs7igFQpC7f4Kv.jpg', NULL, NULL, 31, 1.50, '30 min', 0, 'Submitted from web attendance.', NULL, '2026-06-24 09:30:35', '2026-06-24 09:30:35', '2026-06-24 09:30:35'),
(433, 16, 1, '2026-06-25', 'office', 'present', '2026-06-25 08:28:24', '2026-06-25 17:01:16', 11.6483858, 104.9074582, 'Sangkat Prek Liep, Phnom Penh', 11.6483475, 104.9074660, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/phXJ5REryXcQxNXCgoh1tB4AsZwhrah3r8g9vFBc.jpg', 'attendance/checkouts/KUS2wEtokL9CPImrJsYd5REILnB1JyJHTZ6rtSyd.jpg', NULL, 0, NULL, NULL, 513, 'Submitted from web attendance.', NULL, '2026-06-25 08:28:24', '2026-06-25 08:28:24', '2026-06-25 17:01:17'),
(434, 8, 1, '2026-06-25', 'office', 'present', '2026-06-25 08:29:45', '2026-06-25 17:26:51', 11.6483701, 104.9074860, 'Sangkat Prek Liep, Phnom Penh', 11.6484344, 104.9074061, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/veNZEZSVUbhcRXEJs5TbViPtaLAx9nBp3LGEMCet.jpg', 'attendance/checkouts/iTY0TOSJKLVcqYjgcCpFIXpx2eKhAGxIQuJOA6NW.jpg', NULL, 0, NULL, NULL, 537, 'Submitted from web attendance.', NULL, '2026-06-25 08:29:46', '2026-06-25 08:29:46', '2026-06-25 17:26:51'),
(435, 9, 1, '2026-06-25', 'office', 'present', '2026-06-25 08:30:03', '2026-06-25 18:39:57', 11.6484099, 104.9074669, 'Sangkat Prek Liep, Phnom Penh', 11.6484099, 104.9074669, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/WB6J8u4EXxXHBX1TJMYh8l8neFYtMBEzjETQGN8t.jpg', 'attendance/checkouts/1QoibJ18k61EHZUzpdkZzun21WXxnKO1ZJhnGPLK.jpg', NULL, 0, NULL, NULL, 610, 'Submitted from web attendance.', NULL, '2026-06-25 08:30:03', '2026-06-25 08:30:03', '2026-06-25 18:39:57'),
(436, 14, 1, '2026-06-25', 'office', 'present', '2026-06-25 08:56:23', '2026-06-25 18:00:36', 11.6482889, 104.9075324, 'Sangkat Prek Liep, Phnom Penh', 11.6484010, 104.9074561, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/KmxpZFVNjnrpJwWXu5f9kvZyTkNvQydRyQIeTcch.jpg', 'attendance/checkouts/u5GXAOtNZJir361Sa7mK3iqoaBBkm4nUvu04RhKh.jpg', NULL, 0, NULL, NULL, 544, 'Submitted from web attendance.', NULL, '2026-06-25 08:56:23', '2026-06-25 08:56:23', '2026-06-25 18:00:36'),
(437, 15, 1, '2026-06-25', 'office', 'late', '2026-06-25 09:10:17', '2026-06-25 17:21:30', 11.6484210, 104.9073946, 'Sangkat Prek Liep, Phnom Penh', 11.6484091, 104.9074487, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/qByHDmaXhePvGd0CFF1RU12Ruscx3WsdiO5DXkHa.jpg', 'attendance/checkouts/W2sWo4EcCbncyWEO2hx2bdoUml0COMF8IVskrwdZ.jpg', NULL, 11, NULL, NULL, 491, 'Submitted from web attendance.', NULL, '2026-06-25 09:10:18', '2026-06-25 09:10:18', '2026-06-25 17:21:30'),
(438, 13, 1, '2026-06-25', 'office', 'late', '2026-06-25 09:11:45', '2026-06-25 17:14:25', 11.6484319, 104.9074448, 'Sangkat Prek Liep, Phnom Penh', 11.6484319, 104.9074448, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/l7qONqyRLDzU2msu1natUYcUxrcJzE1CZIttZPoO.jpg', 'attendance/checkouts/kuDQAIGLsoOI54bwe8NralpgKzRlt7bsbYNzU3Fg.jpg', NULL, 12, NULL, NULL, 483, 'Submitted from web attendance.', NULL, '2026-06-25 09:11:46', '2026-06-25 09:11:46', '2026-06-25 17:14:26'),
(439, 12, 1, '2026-06-25', 'office', 'late', '2026-06-25 09:12:16', '2026-06-25 18:27:31', 11.6484123, 104.9074235, 'Sangkat Prek Liep, Phnom Penh', 11.6483497, 104.9074545, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/pvTcFCKnc6w1r4qe8XaSxN9oRv7JDZQX3cuiQ5ei.jpg', 'attendance/checkouts/yLJNICAe1SVGXQRsEuEgfU5i3EdPAUYG4FSALb4M.jpg', NULL, 13, NULL, NULL, 555, 'Submitted from web attendance.', NULL, '2026-06-25 09:12:17', '2026-06-25 09:12:17', '2026-06-25 18:27:31'),
(440, 6, 1, '2026-06-25', 'office', 'late', '2026-06-25 09:19:38', '2026-06-25 17:13:19', 11.6483836, 104.9074772, 'Sangkat Prek Liep, Phnom Penh', 11.6483836, 104.9074772, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/UUmf948amlW5KLU8BCLeyqdH5n5pH4tVhOgr2u6d.jpg', 'attendance/checkouts/YNylZxfwUdixrN8sygrsJ2YMmPBVA0vHsH18zvZF.jpg', NULL, 20, NULL, NULL, 474, 'Submitted from web attendance.', NULL, '2026-06-25 09:19:38', '2026-06-25 09:19:38', '2026-06-25 17:13:20'),
(441, 5, 1, '2026-06-25', 'office', 'late', '2026-06-25 09:23:53', '2026-06-25 17:12:49', 11.6484062, 104.9074610, 'Sangkat Prek Liep, Phnom Penh', 11.6484006, 104.9074554, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/7yP7I9RbA7oUbcnILzbZCefsEK7IZfzoBrJTHCsD.jpg', 'attendance/checkouts/JjfDTMXRibCHNvKrjE4TNBHgGnA5y3DM3JaCIzGN.jpg', NULL, 24, NULL, NULL, 469, 'Submitted from web attendance.', NULL, '2026-06-25 09:23:54', '2026-06-25 09:23:54', '2026-06-25 17:12:50'),
(442, 3, NULL, '2026-06-25', 'office', 'late', '2026-06-25 09:26:17', '2026-06-25 17:23:49', 11.6483814, 104.9074624, 'Sangkat Prek Liep, Phnom Penh', 11.6483815, 104.9074617, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/HpaHtMyWRBfjU1EZXJoQFPdkTT6ZdEy9t322GkDL.jpg', 'attendance/checkouts/fYC2EgQjBqse7Bah0eg9D7IQRLu8Er3baPTux8It.jpg', NULL, 27, NULL, NULL, 478, 'Submitted from web attendance.', NULL, '2026-06-25 09:26:18', '2026-06-25 09:26:18', '2026-06-25 17:23:49'),
(443, 21, 1, '2026-06-25', 'outdoor', 'late', '2026-06-25 09:51:47', NULL, 13.3894972, 103.8687385, 'Siem Reap, Siem Reap', NULL, NULL, NULL, 'attendance/selfies/PG3VYkT7c8GeEl6opD7DGPHRZ2SVNn2SASZZle2D.jpg', NULL, NULL, 52, NULL, NULL, 0, 'Submitted from outdoor sales attendance.', NULL, '2026-06-25 09:51:47', '2026-06-25 09:51:47', '2026-06-25 09:51:47'),
(444, 17, 1, '2026-06-25', 'outdoor', 'late', '2026-06-25 10:58:55', NULL, 13.2880550, 103.8121250, 'Siem Reap, Siem Reap', NULL, NULL, NULL, 'attendance/selfies/s2Oy7FMRXoQYanAO3in5j3G1iacv4QxAFBoRkwht.jpg', NULL, NULL, 119, NULL, NULL, 0, 'Submitted from outdoor sales attendance.', NULL, '2026-06-25 10:58:56', '2026-06-25 10:58:56', '2026-06-25 10:58:56'),
(445, 4, 1, '2026-06-25', 'office', 'present', '2026-06-25 12:18:59', '2026-06-25 17:21:22', 11.6484156, 104.9074553, 'Sangkat Prek Liep, Phnom Penh', 11.6484156, 104.9074553, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/oSw3ARb6O6O1Jwz60d78nGBsVxMlAmyT0dae2C4L.jpg', 'attendance/checkouts/SDO69n2cWut9DaJWaxQZxwN88C1RW37N8wSteCcf.jpg', NULL, 0, NULL, NULL, 302, 'Submitted from web attendance.', NULL, '2026-06-25 12:19:00', '2026-06-25 12:19:00', '2026-06-25 17:21:23'),
(446, 16, 1, '2026-06-26', 'office', 'present', '2026-06-26 08:03:35', '2026-06-26 17:03:54', 11.6483886, 104.9074602, 'Sangkat Prek Liep, Phnom Penh', 11.6483811, 104.9074567, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/bfKW6M0tJoS2kdeX5yKvHZOod9aCMILtvrg8zvgx.jpg', 'attendance/checkouts/y1ZF4rcH7AhOZdOzac3qFfuzoaxqzalUjPTMnbDz.jpg', NULL, 0, NULL, NULL, 540, 'Submitted from web attendance.', NULL, '2026-06-26 08:03:37', '2026-06-26 08:03:37', '2026-06-26 17:03:55'),
(447, 8, 1, '2026-06-26', 'office', 'present', '2026-06-26 08:19:54', '2026-06-26 17:12:23', 11.6484344, 104.9074061, 'Sangkat Prek Liep, Phnom Penh', 11.6484344, 104.9074061, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/0XAjcpLAifzr16rUbiDFr0OPINUbPeGn6TisMWM7.jpg', 'attendance/checkouts/xkCrqP67QXavYb58BhVDPf8UgEw0PVMWNt5Tr3ZW.jpg', NULL, 0, NULL, NULL, 532, 'Submitted from web attendance.', NULL, '2026-06-26 08:19:55', '2026-06-26 08:19:55', '2026-06-26 17:12:24'),
(448, 9, 1, '2026-06-26', 'office', 'present', '2026-06-26 08:30:53', '2026-06-26 18:13:08', 11.6484099, 104.9074669, 'Sangkat Prek Liep, Phnom Penh', 11.6484099, 104.9074669, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/DDL4MRxv53o785xT5uouMl8rumcKG9hHlclXkdGs.jpg', 'attendance/checkouts/cJzt92Slm6TMNgW4bkXqy9MWChUcgJJ2Ud609WCh.jpg', NULL, 0, NULL, NULL, 582, 'Submitted from web attendance.', NULL, '2026-06-26 08:30:54', '2026-06-26 08:30:54', '2026-06-26 18:13:09');
INSERT INTO `attendance` (`id`, `employee_id`, `branch_id`, `attendance_date`, `type`, `status`, `check_in_at`, `check_out_at`, `check_in_latitude`, `check_in_longitude`, `check_in_address`, `check_out_latitude`, `check_out_longitude`, `check_out_address`, `check_in_photo_path`, `check_out_photo_path`, `qr_code`, `late_minutes`, `deduction_amount`, `deduction_reason`, `work_minutes`, `notes`, `offline_sync_uuid`, `synced_at`, `created_at`, `updated_at`) VALUES
(449, 15, 1, '2026-06-26', 'office', 'present', '2026-06-26 08:49:35', '2026-06-26 17:42:32', 11.6483346, 104.9074466, 'Sangkat Prek Liep, Phnom Penh', 11.6483897, 104.9074386, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/7uPKReERoZWVFBqIofU6r6m4VGMETjaFMLLUorv7.jpg', 'attendance/checkouts/OkX9XrXgypYLYHYss4iDO6KvByvZwy6bdsHkvD3X.jpg', NULL, 0, NULL, NULL, 533, 'Submitted from web attendance.', NULL, '2026-06-26 08:49:35', '2026-06-26 08:49:35', '2026-06-26 17:42:33'),
(450, 12, 1, '2026-06-26', 'office', 'late', '2026-06-26 09:06:21', '2026-06-26 18:12:17', 11.6483497, 104.9074545, 'Sangkat Prek Liep, Phnom Penh', 11.6483497, 104.9074545, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/eC9UkGAI39S2D3ebcNTrVS9nqoF8AGA0yjvRd8k8.jpg', 'attendance/checkouts/HVTF7YKEAmhXSAxwLfmRXqg4lrYMmy9rKfdPm7VC.jpg', NULL, 7, NULL, NULL, 546, 'Submitted from web attendance.', NULL, '2026-06-26 09:06:23', '2026-06-26 09:06:23', '2026-06-26 18:12:18'),
(451, 14, 1, '2026-06-26', 'office', 'late', '2026-06-26 09:07:34', '2026-06-26 18:05:41', 11.6483708, 104.9075101, 'Sangkat Prek Liep, Phnom Penh', 11.6483706, 104.9075105, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/5T7czFdxNmpqNSrrrRRBCBpEZevNDXSxEr73fLdC.jpg', 'attendance/checkouts/DvrReIsWeyWY6zsOfix1TOkX7WqO7rkcOsiFMt6e.jpg', NULL, 8, NULL, NULL, 538, 'Submitted from web attendance.', NULL, '2026-06-26 09:07:35', '2026-06-26 09:07:35', '2026-06-26 18:05:42'),
(452, 13, 1, '2026-06-26', 'office', 'late', '2026-06-26 09:07:35', '2026-06-26 18:11:35', 11.6484508, 104.9074436, 'Sangkat Prek Liep, Phnom Penh', 11.6484319, 104.9074448, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/ZXBd6Rs16utl2pqoKRn0PxbWO7eag3KepftMTNwt.jpg', 'attendance/checkouts/h6tRL4zHI9yahLMctQnwjYL82zz4ODw9yat5ucul.jpg', NULL, 8, NULL, NULL, 544, 'Submitted from web attendance.', NULL, '2026-06-26 09:07:36', '2026-06-26 09:07:36', '2026-06-26 18:11:36'),
(453, 17, 1, '2026-06-26', 'outdoor', 'late', '2026-06-26 09:16:29', NULL, 13.3585426, 103.8852193, 'Siem Reap, Siem Reap', NULL, NULL, NULL, 'attendance/selfies/J4RyNNFnQj9nP6ahiZoXKiSjqzHO4FLHeoPLOUvj.jpg', NULL, NULL, 17, NULL, NULL, 0, 'Submitted from outdoor sales attendance.', NULL, '2026-06-26 09:16:30', '2026-06-26 09:16:30', '2026-06-26 09:16:30'),
(454, 5, 1, '2026-06-26', 'office', 'late', '2026-06-26 09:18:07', '2026-06-26 17:34:44', 11.6484062, 104.9074610, 'Sangkat Prek Liep, Phnom Penh', 11.6484062, 104.9074610, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/zU4uwvEcChK2EhlxMJCeIm1Xozig9nfAtccNQLFV.jpg', 'attendance/checkouts/4UK7jaXqAnHzt8fzGpUDdS70QpCm0kfrhzl789kJ.jpg', NULL, 19, NULL, NULL, 497, 'Submitted from web attendance.', NULL, '2026-06-26 09:18:08', '2026-06-26 09:18:08', '2026-06-26 17:34:45'),
(455, 19, 1, '2026-06-26', 'office', 'late', '2026-06-26 09:21:52', '2026-06-26 18:12:45', 11.6483955, 104.9074308, 'Sangkat Prek Liep, Phnom Penh', 11.6483727, 104.9074793, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/mAk8qVQw05iYUEUEM1pr8kKQeJ2YFZQx67Rbftl8.jpg', 'attendance/checkouts/yf0UcvsilvQUwIox64IWhBsVBwSh1PMjzotp9Wbl.jpg', NULL, 22, NULL, NULL, 531, 'Submitted from web attendance.', NULL, '2026-06-26 09:21:52', '2026-06-26 09:21:52', '2026-06-26 18:12:46'),
(456, 6, 1, '2026-06-26', 'office', 'late', '2026-06-26 09:35:43', '2026-06-26 17:07:19', 11.6483836, 104.9074772, 'Sangkat Prek Liep, Phnom Penh', 11.6483836, 104.9074772, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/PvPSo8JUpFyC8wXcnVeZHFVomSLMzp84UcsqoSCw.jpg', 'attendance/checkouts/uxZwCoqLORjNgEiB0RJ9vosHQivmyhPNQwU8FXm1.jpg', NULL, 36, 1.50, '30 min', 452, 'Submitted from web attendance.', NULL, '2026-06-26 09:35:44', '2026-06-26 09:35:44', '2026-06-26 17:07:20'),
(457, 3, NULL, '2026-06-26', 'office', 'late', '2026-06-26 09:42:02', '2026-06-26 17:45:20', 11.6483852, 104.9074631, 'Sangkat Prek Liep, Phnom Penh', 11.6483818, 104.9074768, 'Sangkat Prek Liep, Phnom Penh', 'attendance/selfies/ep6NSSoj9IsjHIfXvMotJmSea9Wx8srvYyVI7Z7P.jpg', 'attendance/checkouts/SO3D3oV7cudsNn25sJ5PsyNmqCf8oOgWZ6BFl5Y1.jpg', NULL, 43, 1.50, '30 min', 483, 'Submitted from web attendance.', NULL, '2026-06-26 09:42:03', '2026-06-26 09:42:03', '2026-06-26 17:45:20'),
(458, 21, 1, '2026-06-26', 'outdoor', 'late', '2026-06-26 10:11:49', NULL, 13.3512202, 103.9361516, 'Svay Thom, Siem Reap', NULL, NULL, NULL, 'attendance/selfies/SURotJH0EOex55oogF6ONjgw2xM0JoOEgwrw4eCu.jpg', NULL, NULL, 72, NULL, NULL, 0, 'Submitted from outdoor sales attendance.', NULL, '2026-06-26 10:11:50', '2026-06-26 10:11:50', '2026-06-26 10:11:50'),
(459, 16, 1, '2026-06-27', 'office', 'present', '2026-06-27 08:32:03', NULL, 11.6483935, 104.9074730, 'Sangkat Prek Liep, Phnom Penh', NULL, NULL, NULL, 'attendance/selfies/xWu1BSMBdT10ekeYe4h1sVI3NDMv92CNcPfcPsQE.jpg', NULL, NULL, 0, NULL, NULL, 0, 'Submitted from web attendance.', NULL, '2026-06-27 08:32:04', '2026-06-27 08:32:04', '2026-06-27 08:32:04'),
(460, 9, 1, '2026-06-27', 'office', 'present', '2026-06-27 08:41:37', NULL, 11.6484099, 104.9074669, '11.648410, 104.907467', NULL, NULL, NULL, 'attendance/selfies/rZCliiPGawmLAsZFMitkOJjyl8XD2HpNpomYuV6e.jpg', NULL, NULL, 0, NULL, NULL, 0, 'Submitted from web attendance.', NULL, '2026-06-27 08:41:37', '2026-06-27 08:41:37', '2026-06-27 08:41:37'),
(461, 8, 1, '2026-06-27', 'office', 'late', '2026-06-27 09:01:07', NULL, 11.6484085, 104.9074657, 'Sangkat Prek Liep, Phnom Penh', NULL, NULL, NULL, 'attendance/selfies/qIrHPyqQ4s20v6LQfqMrp8ckCFlVBmXLRE1gVBoU.jpg', NULL, NULL, 2, NULL, NULL, 0, 'Submitted from web attendance.', NULL, '2026-06-27 09:01:08', '2026-06-27 09:01:08', '2026-06-27 09:01:08'),
(462, 14, 1, '2026-06-27', 'office', 'late', '2026-06-27 09:16:37', NULL, 11.6484086, 104.9074208, 'Sangkat Prek Liep, Phnom Penh', NULL, NULL, NULL, 'attendance/selfies/925Wtf9rbFm9Ve2BkNLSV6LsUj3fDZty6up6XQ5y.jpg', NULL, NULL, 17, NULL, NULL, 0, 'Submitted from web attendance.', NULL, '2026-06-27 09:16:38', '2026-06-27 09:16:38', '2026-06-27 09:16:38'),
(463, 5, 1, '2026-06-27', 'office', 'late', '2026-06-27 09:23:21', NULL, 11.6483871, 104.9074993, 'Sangkat Prek Liep, Phnom Penh', NULL, NULL, NULL, 'attendance/selfies/EkuEsjwiOF8G5iTJ9XmIQbbM4WgxbVvGsqWnOEvg.jpg', NULL, NULL, 24, NULL, NULL, 0, 'Submitted from web attendance.', NULL, '2026-06-27 09:23:21', '2026-06-27 09:23:21', '2026-06-27 09:23:21'),
(464, 4, 1, '2026-06-27', 'office', 'present', '2026-06-27 09:24:40', NULL, 11.6484534, 104.9074464, 'Sangkat Prek Liep, Phnom Penh', NULL, NULL, NULL, 'attendance/selfies/KWAUOQ87pWOHxLq8OlnlvwTMmCPvI1r6G7HmAmo4.jpg', NULL, NULL, 0, NULL, NULL, 0, 'Submitted from web attendance.', NULL, '2026-06-27 09:24:41', '2026-06-27 09:24:41', '2026-06-27 09:24:41'),
(465, 3, NULL, '2026-06-27', 'office', 'late', '2026-06-27 09:29:37', NULL, 11.6483809, 104.9074688, 'Sangkat Prek Liep, Phnom Penh', NULL, NULL, NULL, 'attendance/selfies/PRI9HnEVkyYFBjGW5KeCV5DFQdTVtlA6r58Fm1Qy.jpg', NULL, NULL, 30, NULL, NULL, 0, 'Submitted from web attendance.', NULL, '2026-06-27 09:29:38', '2026-06-27 09:29:38', '2026-06-27 09:29:38'),
(466, 12, 1, '2026-06-27', 'office', 'late', '2026-06-27 09:33:18', NULL, 11.6484059, 104.9074090, 'Sangkat Prek Liep, Phnom Penh', NULL, NULL, NULL, 'attendance/selfies/z4EKfM3bvYiwmYCb2nMxwdmChW7DrQgLC6lpxpR6.jpg', NULL, NULL, 34, 1.50, '30 min', 0, 'Submitted from web attendance.', NULL, '2026-06-27 09:33:18', '2026-06-27 09:33:18', '2026-06-27 09:33:18'),
(467, 13, 1, '2026-06-27', 'office', 'late', '2026-06-27 09:33:56', NULL, 11.6483762, 104.9074405, 'Sangkat Prek Liep, Phnom Penh', NULL, NULL, NULL, 'attendance/selfies/BmMNYvV7T1pO1gucVUhv264nDhGUxQfQJk4BR6tp.jpg', NULL, NULL, 34, 1.50, '30 min', 0, 'Submitted from web attendance.', NULL, '2026-06-27 09:33:57', '2026-06-27 09:33:57', '2026-06-27 09:33:57'),
(468, 15, 1, '2026-06-27', 'office', 'late', '2026-06-27 09:35:00', NULL, 11.6483833, 104.9074355, 'Sangkat Prek Liep, Phnom Penh', NULL, NULL, NULL, 'attendance/selfies/dkwmNzxaLgkrT7kGz13rqFxs28NX3kuIBDTPSlTS.jpg', NULL, NULL, 35, 1.50, '30 min', 0, 'Submitted from web attendance.', NULL, '2026-06-27 09:35:00', '2026-06-27 09:35:00', '2026-06-27 09:35:00'),
(469, 21, 1, '2026-06-27', 'outdoor', 'late', '2026-06-27 09:39:44', NULL, 13.3895481, 103.8715598, 'Siem Reap, Siem Reap', NULL, NULL, NULL, 'attendance/selfies/OVMJuaNtQWhNBezQ0etRrBJOhCcYKe812dCilsd8.jpg', NULL, NULL, 40, NULL, NULL, 0, 'Submitted from outdoor sales attendance.', NULL, '2026-06-27 09:39:45', '2026-06-27 09:39:45', '2026-06-27 09:39:45'),
(470, 17, 1, '2026-06-27', 'outdoor', 'late', '2026-06-27 11:11:09', NULL, 13.3895317, 103.8709783, 'Siem Reap, Siem Reap', NULL, NULL, NULL, 'attendance/selfies/tg2opISmfg3yOHooG7HvYfYYKAIT8eBHo4fWX6fV.jpg', NULL, NULL, 132, NULL, NULL, 0, 'Submitted from outdoor sales attendance.', NULL, '2026-06-27 11:11:09', '2026-06-27 11:11:09', '2026-06-27 11:11:09');

-- --------------------------------------------------------

--
-- Table structure for table `attendance_logs`
--

CREATE TABLE `attendance_logs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `attendance_id` bigint(20) UNSIGNED NOT NULL,
  `edited_by` bigint(20) UNSIGNED DEFAULT NULL,
  `field_name` varchar(255) NOT NULL,
  `previous_value` text DEFAULT NULL,
  `new_value` text DEFAULT NULL,
  `reason` text NOT NULL,
  `ip_address` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `attendance_logs`
--

INSERT INTO `attendance_logs` (`id`, `attendance_id`, `edited_by`, `field_name`, `previous_value`, `new_value`, `reason`, `ip_address`, `created_at`, `updated_at`) VALUES
(1, 2, 1, 'attendance_date', '2026-05-20 00:00:00', '2026-05-20', 'user forgot to check out attendance', '136.228.131.67', '2026-05-21 21:32:58', '2026-05-21 21:32:58'),
(2, 2, 1, 'check_in_at', '2026-05-20 13:07:13', '2026-05-20 13:07:00', 'user forgot to check out attendance', '136.228.131.67', '2026-05-21 21:32:59', '2026-05-21 21:32:59'),
(3, 2, 1, 'check_out_at', '', '2026-05-20 17:32:00', 'user forgot to check out attendance', '136.228.131.67', '2026-05-21 21:32:59', '2026-05-21 21:32:59'),
(4, 2, 1, 'status', 'late', 'late', 'user forgot to check out attendance', '136.228.131.67', '2026-05-21 21:32:59', '2026-05-21 21:32:59'),
(5, 2, 1, 'type', 'office', 'office', 'user forgot to check out attendance', '136.228.131.67', '2026-05-21 21:32:59', '2026-05-21 21:32:59'),
(6, 71, 1, 'attendance_date', '2026-05-26 00:00:00', '2026-05-26', 'check out not allow', '136.228.131.67', '2026-05-26 19:01:32', '2026-05-26 19:01:32'),
(7, 71, 1, 'check_in_at', '2026-05-26 08:06:55', '2026-05-26 08:06:00', 'check out not allow', '136.228.131.67', '2026-05-26 19:01:32', '2026-05-26 19:01:32'),
(8, 71, 1, 'check_out_at', '', '2026-05-26 17:10:00', 'check out not allow', '136.228.131.67', '2026-05-26 19:01:32', '2026-05-26 19:01:32'),
(9, 71, 1, 'status', 'present', 'present', 'check out not allow', '136.228.131.67', '2026-05-26 19:01:32', '2026-05-26 19:01:32'),
(10, 71, 1, 'type', 'office', 'office', 'check out not allow', '136.228.131.67', '2026-05-26 19:01:32', '2026-05-26 19:01:32'),
(11, 161, 1, 'attendance_date', '2026-06-01 00:00:00', '2026-06-01', 'som jenh mun', '203.144.76.9', '2026-06-01 16:32:24', '2026-06-01 16:32:24'),
(12, 161, 1, 'check_in_at', '2026-06-01 09:08:58', '2026-06-01 09:08:00', 'som jenh mun', '203.144.76.9', '2026-06-01 16:32:24', '2026-06-01 16:32:24'),
(13, 161, 1, 'check_out_at', '', '2026-06-01 16:31:00', 'som jenh mun', '203.144.76.9', '2026-06-01 16:32:24', '2026-06-01 16:32:24'),
(14, 161, 1, 'status', 'late', 'late', 'som jenh mun', '203.144.76.9', '2026-06-01 16:32:24', '2026-06-01 16:32:24'),
(15, 161, 1, 'type', 'office', 'office', 'som jenh mun', '203.144.76.9', '2026-06-01 16:32:24', '2026-06-01 16:32:24'),
(16, 174, 1, 'attendance_date', '2026-06-02 00:00:00', '2026-06-02', 'leave early', '203.95.199.47', '2026-06-02 15:56:13', '2026-06-02 15:56:13'),
(17, 174, 1, 'check_in_at', '2026-06-02 08:52:38', '2026-06-02 08:52:00', 'leave early', '203.95.199.47', '2026-06-02 15:56:13', '2026-06-02 15:56:13'),
(18, 174, 1, 'check_out_at', '', '2026-06-02 16:20:00', 'leave early', '203.95.199.47', '2026-06-02 15:56:13', '2026-06-02 15:56:13'),
(19, 174, 1, 'status', 'present', 'present', 'leave early', '203.95.199.47', '2026-06-02 15:56:13', '2026-06-02 15:56:13'),
(20, 174, 1, 'type', 'office', 'office', 'leave early', '203.95.199.47', '2026-06-02 15:56:13', '2026-06-02 15:56:13'),
(21, 254, 1, 'attendance_date', '2026-06-08 00:00:00', '2026-06-08', 'som jenh mun', '203.144.76.9', '2026-06-08 16:38:53', '2026-06-08 16:38:53'),
(22, 254, 1, 'check_in_at', '2026-06-08 09:07:52', '2026-06-08 09:07:00', 'som jenh mun', '203.144.76.9', '2026-06-08 16:38:53', '2026-06-08 16:38:53'),
(23, 254, 1, 'check_out_at', '', '2026-06-08 16:40:00', 'som jenh mun', '203.144.76.9', '2026-06-08 16:38:53', '2026-06-08 16:38:53'),
(24, 254, 1, 'status', 'late', 'late', 'som jenh mun', '203.144.76.9', '2026-06-08 16:38:53', '2026-06-08 16:38:53'),
(25, 254, 1, 'type', 'office', 'office', 'som jenh mun', '203.144.76.9', '2026-06-08 16:38:53', '2026-06-08 16:38:53'),
(26, 348, 1, 'attendance_date', '2026-06-16 00:00:00', '2026-06-16', 'ជួយបិទsticker b rong', '203.95.199.47', '2026-06-16 09:54:34', '2026-06-16 09:54:34'),
(27, 348, 1, 'check_in_at', '2026-06-16 09:48:57', '2026-06-16 09:48:00', 'ជួយបិទsticker b rong', '203.95.199.47', '2026-06-16 09:54:34', '2026-06-16 09:54:34'),
(28, 348, 1, 'check_out_at', '', '', 'ជួយបិទsticker b rong', '203.95.199.47', '2026-06-16 09:54:34', '2026-06-16 09:54:34'),
(29, 348, 1, 'status', 'late', 'present', 'ជួយបិទsticker b rong', '203.95.199.47', '2026-06-16 09:54:34', '2026-06-16 09:54:34'),
(30, 348, 1, 'type', 'office', 'office', 'ជួយបិទsticker b rong', '203.95.199.47', '2026-06-16 09:54:34', '2026-06-16 09:54:34'),
(31, 348, 1, 'attendance_date', '2026-06-16 00:00:00', '2026-06-16', 'ជួយបិទsticker b rong', '203.95.199.47', '2026-06-16 09:54:48', '2026-06-16 09:54:48'),
(32, 348, 1, 'check_in_at', '2026-06-16 09:48:57', '2026-06-16 09:48:00', 'ជួយបិទsticker b rong', '203.95.199.47', '2026-06-16 09:54:48', '2026-06-16 09:54:48'),
(33, 348, 1, 'check_out_at', '', '', 'ជួយបិទsticker b rong', '203.95.199.47', '2026-06-16 09:54:48', '2026-06-16 09:54:48'),
(34, 348, 1, 'status', 'late', 'present', 'ជួយបិទsticker b rong', '203.95.199.47', '2026-06-16 09:54:48', '2026-06-16 09:54:48'),
(35, 348, 1, 'type', 'office', 'office', 'ជួយបិទsticker b rong', '203.95.199.47', '2026-06-16 09:54:48', '2026-06-16 09:54:48'),
(36, 348, 1, 'attendance_date', '2026-06-16 00:00:00', '2026-06-16', 'ជួយបិទsticker b rong', '203.95.199.47', '2026-06-16 09:54:48', '2026-06-16 09:54:48'),
(37, 348, 1, 'check_in_at', '2026-06-16 09:48:57', '2026-06-16 09:48:00', 'ជួយបិទsticker b rong', '203.95.199.47', '2026-06-16 09:54:48', '2026-06-16 09:54:48'),
(38, 348, 1, 'check_out_at', '', '', 'ជួយបិទsticker b rong', '203.95.199.47', '2026-06-16 09:54:48', '2026-06-16 09:54:48'),
(39, 348, 1, 'status', 'late', 'present', 'ជួយបិទsticker b rong', '203.95.199.47', '2026-06-16 09:54:48', '2026-06-16 09:54:48'),
(40, 348, 1, 'type', 'office', 'office', 'ជួយបិទsticker b rong', '203.95.199.47', '2026-06-16 09:54:48', '2026-06-16 09:54:48'),
(41, 348, 1, 'attendance_date', '2026-06-16 00:00:00', '2026-06-16', 'ជួយបិទsticker b rong', '203.95.199.47', '2026-06-16 09:54:49', '2026-06-16 09:54:49'),
(42, 348, 1, 'check_in_at', '2026-06-16 09:48:57', '2026-06-16 09:48:00', 'ជួយបិទsticker b rong', '203.95.199.47', '2026-06-16 09:54:49', '2026-06-16 09:54:49'),
(43, 348, 1, 'check_out_at', '', '', 'ជួយបិទsticker b rong', '203.95.199.47', '2026-06-16 09:54:49', '2026-06-16 09:54:49'),
(44, 348, 1, 'status', 'late', 'present', 'ជួយបិទsticker b rong', '203.95.199.47', '2026-06-16 09:54:49', '2026-06-16 09:54:49'),
(45, 348, 1, 'type', 'office', 'office', 'ជួយបិទsticker b rong', '203.95.199.47', '2026-06-16 09:54:49', '2026-06-16 09:54:49'),
(46, 348, 1, 'attendance_date', '2026-06-16 00:00:00', '2026-06-16', 'ជួយបិទsticker b rong', '203.95.199.47', '2026-06-16 09:54:49', '2026-06-16 09:54:49'),
(47, 348, 1, 'check_in_at', '2026-06-16 09:48:57', '2026-06-16 09:48:00', 'ជួយបិទsticker b rong', '203.95.199.47', '2026-06-16 09:54:49', '2026-06-16 09:54:49'),
(48, 348, 1, 'check_out_at', '', '', 'ជួយបិទsticker b rong', '203.95.199.47', '2026-06-16 09:54:49', '2026-06-16 09:54:49'),
(49, 348, 1, 'status', 'late', 'present', 'ជួយបិទsticker b rong', '203.95.199.47', '2026-06-16 09:54:49', '2026-06-16 09:54:49'),
(50, 348, 1, 'type', 'office', 'office', 'ជួយបិទsticker b rong', '203.95.199.47', '2026-06-16 09:54:49', '2026-06-16 09:54:49'),
(51, 348, 1, 'attendance_date', '2026-06-16 00:00:00', '2026-06-16', 'ជួយបិទsticker b rong', '203.95.199.47', '2026-06-16 09:54:50', '2026-06-16 09:54:50'),
(52, 348, 1, 'check_in_at', '2026-06-16 09:48:57', '2026-06-16 09:48:00', 'ជួយបិទsticker b rong', '203.95.199.47', '2026-06-16 09:54:50', '2026-06-16 09:54:50'),
(53, 348, 1, 'check_out_at', '', '', 'ជួយបិទsticker b rong', '203.95.199.47', '2026-06-16 09:54:50', '2026-06-16 09:54:50'),
(54, 348, 1, 'status', 'late', 'present', 'ជួយបិទsticker b rong', '203.95.199.47', '2026-06-16 09:54:50', '2026-06-16 09:54:50'),
(55, 348, 1, 'type', 'office', 'office', 'ជួយបិទsticker b rong', '203.95.199.47', '2026-06-16 09:54:50', '2026-06-16 09:54:50');

-- --------------------------------------------------------

--
-- Table structure for table `attendance_rules`
--

CREATE TABLE `attendance_rules` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `office_name` varchar(255) NOT NULL DEFAULT 'Main Office',
  `office_latitude` decimal(10,7) DEFAULT NULL,
  `office_longitude` decimal(10,7) DEFAULT NULL,
  `allowed_radius` int(11) NOT NULL DEFAULT 100,
  `gps_verification` tinyint(1) NOT NULL DEFAULT 1,
  `work_start_time` time NOT NULL DEFAULT '08:00:00',
  `work_end_time` time NOT NULL DEFAULT '17:00:00',
  `earliest_checkin_time` time NOT NULL DEFAULT '07:00:00',
  `allow_early_checkin` tinyint(1) NOT NULL DEFAULT 1,
  `minimum_work_hours` decimal(4,2) NOT NULL DEFAULT 8.00,
  `late_grace_minutes` int(11) NOT NULL DEFAULT 15,
  `auto_mark_late` tinyint(1) NOT NULL DEFAULT 1,
  `notify_admin_late` tinyint(1) NOT NULL DEFAULT 0,
  `allow_outdoor_checkin` tinyint(1) NOT NULL DEFAULT 1,
  `require_gps` tinyint(1) NOT NULL DEFAULT 1,
  `require_customer_photo` tinyint(1) NOT NULL DEFAULT 0,
  `require_customer_location` tinyint(1) NOT NULL DEFAULT 0,
  `require_selfie` tinyint(1) NOT NULL DEFAULT 0,
  `save_selfie` tinyint(1) NOT NULL DEFAULT 1,
  `face_verification` tinyint(1) NOT NULL DEFAULT 0,
  `enable_qr` tinyint(1) NOT NULL DEFAULT 0,
  `qr_expiration_minutes` int(11) NOT NULL DEFAULT 5,
  `dynamic_qr_rotation` tinyint(1) NOT NULL DEFAULT 0,
  `auto_missing_checkout` tinyint(1) NOT NULL DEFAULT 1,
  `auto_telegram_alerts` tinyint(1) NOT NULL DEFAULT 0,
  `auto_check_in_reminder` tinyint(1) NOT NULL DEFAULT 0,
  `check_in_reminder_time` time NOT NULL DEFAULT '08:00:00',
  `auto_check_out_reminder` tinyint(1) NOT NULL DEFAULT 0,
  `check_out_reminder_time` time NOT NULL DEFAULT '17:00:00',
  `auto_daily_summary` tinyint(1) NOT NULL DEFAULT 0,
  `missing_checkout_detection_time` time NOT NULL DEFAULT '18:00:00',
  `daily_summary_time` time NOT NULL DEFAULT '18:30:00',
  `auto_apply_deduction` tinyint(1) NOT NULL DEFAULT 0,
  `notify_employee_late` tinyint(1) NOT NULL DEFAULT 0,
  `include_in_payroll` tinyint(1) NOT NULL DEFAULT 1,
  `auto_mark_half_day` tinyint(1) NOT NULL DEFAULT 0,
  `auto_mark_absent` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `attendance_rules`
--

INSERT INTO `attendance_rules` (`id`, `office_name`, `office_latitude`, `office_longitude`, `allowed_radius`, `gps_verification`, `work_start_time`, `work_end_time`, `earliest_checkin_time`, `allow_early_checkin`, `minimum_work_hours`, `late_grace_minutes`, `auto_mark_late`, `notify_admin_late`, `allow_outdoor_checkin`, `require_gps`, `require_customer_photo`, `require_customer_location`, `require_selfie`, `save_selfie`, `face_verification`, `enable_qr`, `qr_expiration_minutes`, `dynamic_qr_rotation`, `auto_missing_checkout`, `auto_telegram_alerts`, `auto_check_in_reminder`, `check_in_reminder_time`, `auto_check_out_reminder`, `check_out_reminder_time`, `auto_daily_summary`, `missing_checkout_detection_time`, `daily_summary_time`, `auto_apply_deduction`, `notify_employee_late`, `include_in_payroll`, `auto_mark_half_day`, `auto_mark_absent`, `created_at`, `updated_at`) VALUES
(1, 'Main Office', 0.0000000, NULL, 200, 1, '08:00:00', '17:00:00', '07:00:00', 1, 0.00, 15, 1, 0, 1, 1, 1, 1, 0, 1, 0, 0, 5, 0, 1, 1, 0, '08:00:00', 0, '17:00:00', 1, '18:00:00', '18:30:00', 0, 0, 1, 0, 0, '2026-05-18 18:36:54', '2026-05-26 11:41:04');

-- --------------------------------------------------------

--
-- Table structure for table `bonus_rules`
--

CREATE TABLE `bonus_rules` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `rule_name` varchar(255) NOT NULL,
  `bonus_type` varchar(255) NOT NULL,
  `condition_type` varchar(255) NOT NULL,
  `condition_value` decimal(12,2) DEFAULT NULL,
  `bonus_amount` decimal(12,2) NOT NULL DEFAULT 0.00,
  `frequency` varchar(255) NOT NULL DEFAULT 'monthly',
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `bonus_rules`
--

INSERT INTO `bonus_rules` (`id`, `rule_name`, `bonus_type`, `condition_type`, `condition_value`, `bonus_amount`, `frequency`, `start_date`, `end_date`, `status`, `created_at`, `updated_at`) VALUES
(1, 'Perfect Attendance Bonus', 'perfect_attendance', 'full_attendance', NULL, 20.00, 'monthly', NULL, NULL, 0, '2026-05-18 18:36:59', '2026-05-18 22:52:31'),
(2, 'No Late Attendance', 'no_late', 'no_late', NULL, 10.00, 'monthly', NULL, NULL, 0, '2026-05-18 18:36:59', '2026-05-18 22:52:27');

-- --------------------------------------------------------

--
-- Table structure for table `bonus_settings`
--

CREATE TABLE `bonus_settings` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `auto_calculate_bonus` tinyint(1) NOT NULL DEFAULT 1,
  `include_in_payroll` tinyint(1) NOT NULL DEFAULT 1,
  `notify_employee` tinyint(1) NOT NULL DEFAULT 1,
  `notify_admin` tinyint(1) NOT NULL DEFAULT 1,
  `auto_approve_bonus` tinyint(1) NOT NULL DEFAULT 0,
  `bonus_expiration` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `bonus_settings`
--

INSERT INTO `bonus_settings` (`id`, `auto_calculate_bonus`, `include_in_payroll`, `notify_employee`, `notify_admin`, `auto_approve_bonus`, `bonus_expiration`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 1, 1, 0, 0, '2026-05-18 18:36:59', '2026-05-18 18:36:59');

-- --------------------------------------------------------

--
-- Table structure for table `branches`
--

CREATE TABLE `branches` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `code` varchar(255) NOT NULL,
  `address` text DEFAULT NULL,
  `latitude` decimal(10,7) NOT NULL,
  `longitude` decimal(10,7) NOT NULL,
  `attendance_radius_meters` int(10) UNSIGNED NOT NULL DEFAULT 100,
  `status` varchar(255) NOT NULL DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `branches`
--

INSERT INTO `branches` (`id`, `name`, `code`, `address`, `latitude`, `longitude`, `attendance_radius_meters`, `status`, `created_at`, `updated_at`) VALUES
(1, 'Head Office', 'head_office001', 'Phnom Penh', 11.6484200, 104.9075000, 200, '1', '2026-05-21 21:40:05', '2026-05-21 21:41:28');

-- --------------------------------------------------------

--
-- Table structure for table `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `cache`
--

INSERT INTO `cache` (`key`, `value`, `expiration`) VALUES
('shadow-attendance-cache-system_settings.all', 'O:29:\"Illuminate\\Support\\Collection\":2:{s:8:\"\0*\0items\";a:52:{s:12:\"company_name\";s:12:\"Shadow Group\";s:8:\"timezone\";s:15:\"Asia/Phnom_Penh\";s:8:\"language\";s:7:\"English\";s:8:\"currency\";s:3:\"USD\";s:11:\"date_format\";s:10:\"DD/MM/YYYY\";s:10:\"theme_mode\";s:6:\"System\";s:13:\"check_in_time\";s:5:\"08:00\";s:14:\"check_out_time\";s:5:\"17:00\";s:12:\"late_minutes\";s:2:\"15\";s:17:\"attendance_radius\";s:3:\"100\";s:14:\"overtime_rules\";s:19:\"After checkout time\";s:13:\"weekend_rules\";s:19:\"Allow with approval\";s:15:\"work_start_time\";s:5:\"08:00\";s:13:\"work_end_time\";s:5:\"17:00\";s:10:\"break_time\";s:13:\"12:00 - 13:00\";s:12:\"working_days\";s:15:\"Monday - Friday\";s:17:\"flexible_schedule\";s:1:\"1\";s:21:\"gps_location_tracking\";s:1:\"1\";s:18:\"gps_fake_detection\";s:1:\"1\";s:23:\"gps_background_tracking\";s:1:\"0\";s:17:\"gps_live_tracking\";s:1:\"1\";s:14:\"jwt_expiration\";s:3:\"120\";s:19:\"login_attempt_limit\";s:1:\"5\";s:15:\"session_timeout\";s:2:\"60\";s:18:\"device_restriction\";s:1:\"0\";s:15:\"two_factor_auth\";s:1:\"0\";s:20:\"telegram_bot_enabled\";s:1:\"1\";s:18:\"telegram_bot_token\";s:46:\"8852050624:AAHUN09RfXfQPwZoy_HGV1pwuflGVcRZwg4\";s:24:\"telegram_default_chat_id\";s:14:\"-1003789239970\";s:20:\"telegram_webhook_url\";s:81:\"https://lightgoldenrodyellow-mantis-338653.hostingersite.com/api/telegram/webhook\";s:31:\"telegram_alert_check_in_success\";s:1:\"1\";s:32:\"telegram_alert_check_out_success\";s:1:\"1\";s:28:\"telegram_alert_late_check_in\";s:1:\"1\";s:32:\"telegram_alert_missing_check_out\";s:1:\"1\";s:32:\"telegram_alert_attendance_edited\";s:1:\"1\";s:29:\"telegram_alert_permission_new\";s:1:\"1\";s:34:\"telegram_alert_permission_approved\";s:1:\"1\";s:34:\"telegram_alert_permission_rejected\";s:1:\"1\";s:30:\"telegram_alert_manual_check_in\";s:1:\"1\";s:40:\"telegram_alert_missing_check_out_request\";s:1:\"1\";s:31:\"telegram_alert_outdoor_check_in\";s:1:\"1\";s:28:\"telegram_alert_visit_started\";s:1:\"1\";s:30:\"telegram_alert_visit_completed\";s:1:\"1\";s:27:\"telegram_alert_daily_report\";s:1:\"1\";s:29:\"telegram_alert_route_tracking\";s:1:\"1\";s:32:\"telegram_late_notify_admin_group\";s:1:\"1\";s:29:\"telegram_late_notify_employee\";s:1:\"1\";s:38:\"telegram_late_include_deduction_amount\";s:1:\"1\";s:34:\"telegram_late_include_late_minutes\";s:1:\"1\";s:10:\"site_title\";s:9:\"Shadow HR\";s:16:\"company_logo_url\";s:111:\"https://pub-de34c1d3461e406ea04e01a3ea45ce97.r2.dev/branding/logos/4BaP5ysIkgXFYIqsU3XhTQbM4GG3y3EqKgjznEAn.jpg\";s:16:\"company_icon_url\";s:111:\"https://pub-de34c1d3461e406ea04e01a3ea45ce97.r2.dev/branding/icons/vzAMGDKoBUFHGxpxVPD010g6mklVEJsoio2tSSwT.jpg\";}s:28:\"\0*\0escapeWhenCastingToString\";b:0;}', 1782543450),
('shadow-attendance-cache-system_settings.branding', 'O:29:\"Illuminate\\Support\\Collection\":2:{s:8:\"\0*\0items\";a:4:{s:16:\"company_icon_url\";s:111:\"https://pub-de34c1d3461e406ea04e01a3ea45ce97.r2.dev/branding/icons/vzAMGDKoBUFHGxpxVPD010g6mklVEJsoio2tSSwT.jpg\";s:16:\"company_logo_url\";s:111:\"https://pub-de34c1d3461e406ea04e01a3ea45ce97.r2.dev/branding/logos/4BaP5ysIkgXFYIqsU3XhTQbM4GG3y3EqKgjznEAn.jpg\";s:12:\"company_name\";s:12:\"Shadow Group\";s:10:\"site_title\";s:9:\"Shadow HR\";}s:28:\"\0*\0escapeWhenCastingToString\";b:0;}', 1782543449);

-- --------------------------------------------------------

--
-- Table structure for table `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `customer_visits`
--

CREATE TABLE `customer_visits` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `employee_id` bigint(20) UNSIGNED NOT NULL,
  `customer_name` varchar(255) NOT NULL,
  `store_name` varchar(255) DEFAULT NULL,
  `contact_person` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `province` varchar(120) DEFAULT NULL,
  `latitude` decimal(10,7) NOT NULL,
  `longitude` decimal(10,7) NOT NULL,
  `check_in_at` timestamp NULL DEFAULT NULL,
  `check_out_at` timestamp NULL DEFAULT NULL,
  `duration_minutes` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `selfie_path` varchar(255) DEFAULT NULL,
  `store_photo_path` varchar(255) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'open',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `deduction_rules`
--

CREATE TABLE `deduction_rules` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `rule_name` varchar(255) NOT NULL,
  `deduction_type` enum('late','absent','missing_checkout','manual_penalty','salary_advance') NOT NULL,
  `threshold_minutes` int(10) UNSIGNED DEFAULT NULL,
  `amount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `amount_type` enum('fixed','daily_salary') NOT NULL DEFAULT 'fixed',
  `status` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `departments`
--

CREATE TABLE `departments` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `code` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `departments`
--

INSERT INTO `departments` (`id`, `name`, `code`, `description`, `status`, `created_at`, `updated_at`) VALUES
(1, 'Sale Online', 'sa001', 'Online', 'active', '2026-05-18 21:22:35', '2026-05-18 21:23:54'),
(2, 'Sale Offline', 'sale002', 'Offline', 'active', '2026-05-18 21:23:47', '2026-05-18 21:23:47'),
(3, 'Sale Province', 'sale003', 'Province', 'active', '2026-05-18 21:24:29', '2026-05-18 21:24:29'),
(4, 'Finance', 'fin_001', NULL, 'active', '2026-05-18 21:24:57', '2026-05-18 21:24:57'),
(5, 'Accountant', 'Acc_001', NULL, 'active', '2026-05-18 21:25:09', '2026-05-18 21:25:09'),
(6, 'Delivery', 'Del_001', NULL, 'active', '2026-05-18 21:25:27', '2026-05-18 21:25:27'),
(7, 'Digital Marketing', 'dig_001', NULL, 'active', '2026-05-18 21:25:53', '2026-05-18 21:25:53'),
(8, 'Stock Controller', 'st0001', NULL, 'active', '2026-05-18 21:30:31', '2026-05-18 21:30:44');

-- --------------------------------------------------------

--
-- Table structure for table `employees`
--

CREATE TABLE `employees` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `department_id` bigint(20) UNSIGNED DEFAULT NULL,
  `position_id` bigint(20) UNSIGNED DEFAULT NULL,
  `branch_id` bigint(20) UNSIGNED DEFAULT NULL,
  `employee_code` varchar(255) NOT NULL,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `telegram_chat_id` varchar(32) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `photo_path` varchar(255) DEFAULT NULL,
  `hire_date` date DEFAULT NULL,
  `employment_type` varchar(255) NOT NULL DEFAULT 'full_time',
  `status` varchar(255) NOT NULL DEFAULT 'active',
  `face_template_status` varchar(255) NOT NULL DEFAULT 'not_enrolled',
  `require_face_verification` tinyint(1) NOT NULL DEFAULT 0,
  `require_gps` tinyint(1) NOT NULL DEFAULT 0,
  `require_ip_restriction` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `employees`
--

INSERT INTO `employees` (`id`, `department_id`, `position_id`, `branch_id`, `employee_code`, `first_name`, `last_name`, `phone`, `telegram_chat_id`, `address`, `photo_path`, `hire_date`, `employment_type`, `status`, `face_template_status`, `require_face_verification`, `require_gps`, `require_ip_restriction`, `created_at`, `updated_at`) VALUES
(1, NULL, NULL, NULL, 'SUPER-0001', 'Super', 'Admin', '077322921', '1793795246', 'Phnom Penh', 'employees/photos/XosWV586dYzID1vVWdiK5GqA9fVlkULGD4KgFikj.jpg', NULL, 'full_time', 'active', 'not_enrolled', 1, 1, 1, '2026-05-18 18:36:32', '2026-05-26 12:42:11'),
(2, NULL, NULL, NULL, 'ADMIN-0001', 'Admin', 'User', NULL, NULL, NULL, NULL, NULL, 'full_time', 'active', 'not_enrolled', 0, 0, 1, '2026-05-18 18:36:32', '2026-05-18 18:36:32'),
(3, 7, 10, NULL, 'DSI003', 'Po', 'Tilino', NULL, '6746099343', 'Phnom Penh', 'employees/photos/SAQHWnLasITSkXAbB9eGjju2nPw1XbCLSM50v5Me.jpg', '2026-05-18', 'full_time', 'active', 'not_enrolled', 1, 1, 1, '2026-05-18 21:51:56', '2026-06-23 09:50:47'),
(4, 7, 9, 1, 'AI001', 'Tha', 'Sopheak', NULL, '6596098986', 'Phnom Penh', 'employees/photos/DrnHr39wJteOTyjx6Nfw2O0OqhbnTRbmvSJVjMTB.jpg', '2026-05-18', 'full_time', 'active', 'not_enrolled', 1, 1, 1, '2026-05-18 21:57:09', '2026-05-29 11:41:24'),
(5, 7, 14, 1, 'MK002', 'Sorn', 'Pugnavan', NULL, '938533927', 'Phnom Penh', 'employees/photos/F6CejMvxSBXDDbYrFy1GnvlaH3RSRifaD4I56gLE.jpg', '2026-05-18', 'full_time', 'active', 'not_enrolled', 1, 1, 1, '2026-05-18 22:00:49', '2026-06-19 09:40:26'),
(6, 7, 10, 1, 'DSI004', 'Gak', 'Vicheka', '+855966289758', '1002120257472', 'Phnom Penh', 'employees/photos/mOXzj86xOvlSNlImVqc7Kc2vW0XnYVbzaMdGnH4m.jpg', '2026-05-18', 'full_time', 'active', 'not_enrolled', 1, 1, 1, '2026-05-18 22:02:14', '2026-06-22 10:34:51'),
(7, 7, 7, 1, 'GM002', 'Heng', 'Saivmey', NULL, NULL, 'Phnom Penh', NULL, '2026-05-18', 'full_time', 'active', 'not_enrolled', 0, 1, 1, '2026-05-18 22:03:13', '2026-05-21 21:48:23'),
(8, 1, 5, 1, 'IS006', 'Yorn', 'Lyna', NULL, '894549556', NULL, 'employees/photos/d0tAuaQUBTHTHt03w74ped7mzEmLCeHbeNnFRi3z.jpg', '2026-05-18', 'full_time', 'active', 'not_enrolled', 1, 1, 1, '2026-05-18 22:04:20', '2026-05-26 11:22:31'),
(9, 1, 5, 1, 'IS001', 'Phol', 'Sokkhe', NULL, '5334530422', NULL, 'employees/photos/xJHn6yUzEOcwCvrQKHfg1XuBK5sxqp6OMBKfdPb8.jpg', '2026-05-18', 'full_time', 'active', 'not_enrolled', 1, 1, 1, '2026-05-18 22:05:04', '2026-06-04 09:28:59'),
(10, 1, 5, 1, 'PS002', 'Oem', 'Sreyleak', NULL, '5537666604', 'Phnom Penh', NULL, NULL, 'outdoor_sales', 'active', 'not_enrolled', 1, 1, 1, '2026-05-18 22:06:00', '2026-06-08 17:07:42'),
(11, 2, 16, 1, 'DL001', 'Pov', 'Chan Rong', NULL, NULL, 'Phnom Penh', NULL, '2026-05-18', 'outdoor_sales', 'active', 'not_enrolled', 1, 1, 1, '2026-05-18 22:09:55', '2026-05-24 20:22:21'),
(12, 8, 12, 1, 'ACC005', 'Chu', 'Kimhorng', '016964740', '5869212522', 'Phnom Penh', 'employees/photos/XwalZaCUSo1fU3Xw8InOIeBMtDccsOxV2KbLR30y.jpg', '2026-05-18', 'full_time', 'active', 'not_enrolled', 1, 1, 1, '2026-05-18 22:11:54', '2026-05-26 11:21:19'),
(13, 4, 3, 1, 'ACC003', 'Chean', 'Aleav', NULL, '660935966', 'Phnom Penh', 'employees/photos/FP7reyj4Nxd3v2ner420MYxmTZL0g7LOEWHyVgTN.jpg', '2026-05-18', 'full_time', 'active', 'not_enrolled', 1, 1, 1, '2026-05-18 22:14:15', '2026-06-05 09:31:14'),
(14, 7, 14, 1, 'MK001', 'Outh', 'Kimnai', NULL, '868622720', 'Phnom Penh', 'employees/photos/15dhtFxFqNr7uhsOMOn6sAkkswcdMjQ0jJgtLf5v.jpg', '2026-05-18', 'full_time', 'active', 'not_enrolled', 1, 1, 1, '2026-05-18 22:15:13', '2026-06-19 09:43:52'),
(15, 5, 1, 1, 'ACC006', 'Mang', 'Leanghort', NULL, '850898801', 'Phnom Penh', NULL, '2026-05-18', 'full_time', 'active', 'not_enrolled', 1, 1, 1, '2026-05-18 22:16:28', '2026-05-25 20:05:30'),
(16, 8, 17, 1, 'ACC007', 'Chou', 'Hao', NULL, '6100514095', 'Phnom Penh', 'employees/photos/Ficmmgr3N4U3TPJxbH2AjNKKTNuAFQfx1kgB4j1o.jpg', '2026-05-18', 'full_time', 'active', 'not_enrolled', 1, 1, 1, '2026-05-18 22:17:38', '2026-05-26 11:23:27'),
(17, 2, 16, 1, 'DL002', 'Phal', 'Panha', NULL, '8852145063', 'Phnom Penh', 'employees/photos/5sMwFfzlr6yWoQnNvH6SQYANlGgL7vSoVm9x4zJ1.jpg', '2026-05-18', 'outdoor_sales', 'active', 'not_enrolled', 1, 1, 1, '2026-05-18 22:23:36', '2026-06-02 15:57:47'),
(18, 2, 16, 1, 'PG002', 'Hiem', 'Sreynich', NULL, NULL, 'Phnom Penh', NULL, '2026-05-21', 'outdoor_sales', 'active', 'not_enrolled', 0, 1, 1, '2026-05-21 21:38:48', '2026-05-21 21:41:46'),
(19, 5, 1, 1, 'acc008', 'Heng', 'Laiheang', NULL, '1648055771', 'Phnom Penh', NULL, '2026-05-24', 'full_time', 'active', 'not_enrolled', 1, 1, 1, '2026-05-24 09:35:24', '2026-05-27 12:07:10'),
(20, 2, 16, 1, 'test123', 'test', NULL, NULL, NULL, NULL, 'employees/photos/NCOT4k990sDH7XxVgVe2zy6qqkA3JZ4HrXmepJ3L.jpg', NULL, 'full_time', 'active', 'not_enrolled', 1, 1, 1, '2026-05-24 20:10:15', '2026-05-29 22:45:38'),
(21, 2, 16, 1, 'DL003', 'Van', NULL, NULL, '8712511263', NULL, 'employees/photos/vCEMI1a35KRtVULLRKSc5p0xz5BqOAkabYRFkdQm.jpg', '2026-05-24', 'outdoor_sales', 'active', 'not_enrolled', 1, 1, 1, '2026-05-24 20:21:44', '2026-06-02 15:58:38');

-- --------------------------------------------------------

--
-- Table structure for table `employee_bonuses`
--

CREATE TABLE `employee_bonuses` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `employee_id` bigint(20) UNSIGNED NOT NULL,
  `bonus_rule_id` bigint(20) UNSIGNED DEFAULT NULL,
  `month` date NOT NULL,
  `bonus_amount` decimal(12,2) NOT NULL DEFAULT 0.00,
  `bonus_type` varchar(255) DEFAULT NULL,
  `reason` text DEFAULT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'pending',
  `approved_by` bigint(20) UNSIGNED DEFAULT NULL,
  `approved_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `employee_schedules`
--

CREATE TABLE `employee_schedules` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `employee_id` bigint(20) UNSIGNED NOT NULL,
  `schedule_id` bigint(20) UNSIGNED NOT NULL,
  `effective_date` date NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `employee_schedules`
--

INSERT INTO `employee_schedules` (`id`, `employee_id`, `schedule_id`, `effective_date`, `created_at`, `updated_at`) VALUES
(1, 14, 2, '2026-05-18', '2026-05-18 22:24:39', '2026-05-18 22:24:39'),
(2, 6, 2, '2026-05-18', '2026-05-18 22:24:56', '2026-05-18 22:24:56'),
(3, 15, 2, '2026-05-18', '2026-05-18 22:25:09', '2026-05-18 22:25:09'),
(4, 3, 2, '2026-05-18', '2026-05-18 22:25:20', '2026-05-18 22:25:20'),
(5, 5, 2, '2026-05-18', '2026-05-18 22:25:36', '2026-05-18 22:25:36'),
(6, 4, 3, '2026-05-18', '2026-05-21 21:03:12', '2026-05-21 21:03:12'),
(7, 21, 4, '2026-05-24', '2026-05-24 20:33:29', '2026-05-24 20:33:29'),
(8, 20, 4, '2026-05-24', '2026-05-24 20:33:41', '2026-05-24 20:33:41'),
(9, 11, 4, '2026-05-24', '2026-05-24 20:33:52', '2026-05-24 20:33:52'),
(10, 17, 4, '2026-05-24', '2026-05-24 20:34:07', '2026-05-24 20:34:07');

-- --------------------------------------------------------

--
-- Table structure for table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `gps_locations`
--

CREATE TABLE `gps_locations` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `employee_id` bigint(20) UNSIGNED NOT NULL,
  `attendance_id` bigint(20) UNSIGNED DEFAULT NULL,
  `customer_visit_id` bigint(20) UNSIGNED DEFAULT NULL,
  `latitude` decimal(10,7) NOT NULL,
  `longitude` decimal(10,7) NOT NULL,
  `accuracy` decimal(8,2) DEFAULT NULL,
  `speed` decimal(8,2) DEFAULT NULL,
  `recorded_at` timestamp NOT NULL,
  `source` varchar(255) NOT NULL DEFAULT 'mobile',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `gps_locations`
--

INSERT INTO `gps_locations` (`id`, `employee_id`, `attendance_id`, `customer_visit_id`, `latitude`, `longitude`, `accuracy`, `speed`, `recorded_at`, `source`, `created_at`, `updated_at`) VALUES
(1, 1, 1, NULL, 11.6483830, 104.9074592, 14.23, 0.00, '2026-05-18 20:38:32', 'check_in', '2026-05-18 20:38:32', '2026-05-18 20:38:32'),
(2, 1, 1, NULL, 11.6192375, 104.8874152, 36.00, 0.00, '2026-05-18 21:48:30', 'check_out', '2026-05-18 21:48:30', '2026-05-18 21:48:30'),
(3, 4, 2, NULL, 11.6484283, 104.9074720, 16.54, 0.00, '2026-05-20 13:07:13', 'check_in', '2026-05-20 13:07:13', '2026-05-20 13:07:13'),
(4, 14, 3, NULL, 11.6483751, 104.9074687, 17.50, 0.00, '2026-05-20 13:22:56', 'check_in', '2026-05-20 13:22:56', '2026-05-20 13:22:56'),
(5, 3, 4, NULL, 11.6483865, 104.9074603, 10.27, 0.00, '2026-05-20 13:23:07', 'check_in', '2026-05-20 13:23:07', '2026-05-20 13:23:07'),
(6, 5, 5, NULL, 11.6484188, 104.9074630, 12.93, 0.00, '2026-05-20 13:23:18', 'check_in', '2026-05-20 13:23:18', '2026-05-20 13:23:18'),
(7, 6, 6, NULL, 11.6483776, 104.9074761, 10.25, 0.00, '2026-05-20 13:23:24', 'check_in', '2026-05-20 13:23:24', '2026-05-20 13:23:24'),
(8, 8, 7, NULL, 11.6484185, 104.9074416, 19.90, 0.00, '2026-05-20 13:23:36', 'check_in', '2026-05-20 13:23:36', '2026-05-20 13:23:36'),
(9, 16, 8, NULL, 11.6484166, 104.9074617, 17.53, 0.00, '2026-05-20 13:23:41', 'check_in', '2026-05-20 13:23:41', '2026-05-20 13:23:41'),
(10, 9, 9, NULL, 11.6483764, 104.9075036, 19.97, 0.00, '2026-05-20 13:23:48', 'check_in', '2026-05-20 13:23:48', '2026-05-20 13:23:48'),
(11, 12, 10, NULL, 11.6482756, 104.9075084, 17.19, 0.00, '2026-05-20 13:24:49', 'check_in', '2026-05-20 13:24:49', '2026-05-20 13:24:49'),
(12, 10, 11, NULL, 11.6483593, 104.9074466, 21.96, 0.00, '2026-05-20 14:36:51', 'check_in', '2026-05-20 14:36:51', '2026-05-20 14:36:51'),
(13, 13, 12, NULL, 11.6482851, 104.9074741, 23.82, 0.00, '2026-05-20 14:39:06', 'check_in', '2026-05-20 14:39:06', '2026-05-20 14:39:06'),
(14, 6, 6, NULL, 11.6483899, 104.9074452, 40.00, 0.00, '2026-05-20 17:05:46', 'check_out', '2026-05-20 17:05:46', '2026-05-20 17:05:46'),
(15, 5, 5, NULL, 11.6484188, 104.9074630, 12.93, 0.00, '2026-05-20 17:06:54', 'check_out', '2026-05-20 17:06:54', '2026-05-20 17:06:54'),
(16, 8, 7, NULL, 11.6484135, 104.9074419, 17.58, 0.00, '2026-05-20 17:08:39', 'check_out', '2026-05-20 17:08:39', '2026-05-20 17:08:39'),
(17, 16, 8, NULL, 11.6484173, 104.9074600, 19.94, 0.00, '2026-05-20 17:08:51', 'check_out', '2026-05-20 17:08:51', '2026-05-20 17:08:51'),
(18, 3, 4, NULL, 11.6483996, 104.9074654, 15.67, 0.00, '2026-05-20 17:19:54', 'check_out', '2026-05-20 17:19:54', '2026-05-20 17:19:54'),
(19, 14, 3, NULL, 11.6483750, 104.9074689, 18.53, 0.00, '2026-05-20 17:36:24', 'check_out', '2026-05-20 17:36:24', '2026-05-20 17:36:24'),
(20, 9, 9, NULL, 11.6483567, 104.9074349, 16.98, 0.00, '2026-05-20 19:47:32', 'check_out', '2026-05-20 19:47:32', '2026-05-20 19:47:32'),
(21, 13, 12, NULL, 11.6484077, 104.9074732, 21.97, 0.00, '2026-05-20 19:55:43', 'check_out', '2026-05-20 19:55:43', '2026-05-20 19:55:43'),
(22, 12, 10, NULL, 11.6482756, 104.9075084, 17.19, 0.00, '2026-05-20 20:00:18', 'check_out', '2026-05-20 20:00:18', '2026-05-20 20:00:18'),
(23, 10, 11, NULL, 11.6483764, 104.9074491, 21.64, 0.00, '2026-05-20 20:00:48', 'check_out', '2026-05-20 20:00:48', '2026-05-20 20:00:48'),
(24, 16, 13, NULL, 11.6484331, 104.9074705, 4.47, 0.01, '2026-05-21 07:58:53', 'check_in', '2026-05-21 07:58:53', '2026-05-21 07:58:53'),
(25, 14, 14, NULL, 11.6484172, 104.9075014, 19.91, 0.00, '2026-05-21 08:13:57', 'check_in', '2026-05-21 08:13:57', '2026-05-21 08:13:57'),
(26, 9, 15, NULL, 11.6485486, 104.9075078, 14.00, 0.52, '2026-05-21 08:16:55', 'check_in', '2026-05-21 08:16:55', '2026-05-21 08:16:55'),
(27, 8, 16, NULL, 11.6484220, 104.9074394, 19.35, 0.00, '2026-05-21 08:21:18', 'check_in', '2026-05-21 08:21:18', '2026-05-21 08:21:18'),
(28, 10, 17, NULL, 11.6484133, 104.9074670, 23.97, 0.00, '2026-05-21 08:37:11', 'check_in', '2026-05-21 08:37:11', '2026-05-21 08:37:11'),
(29, 6, 18, NULL, 11.6484078, 104.9075211, 14.00, 0.00, '2026-05-21 08:53:11', 'check_in', '2026-05-21 08:53:11', '2026-05-21 08:53:11'),
(30, 13, 19, NULL, 11.6484515, 104.9074319, 19.98, 0.00, '2026-05-21 08:55:36', 'check_in', '2026-05-21 08:55:36', '2026-05-21 08:55:36'),
(31, 3, 20, NULL, 11.6483879, 104.9074596, 14.63, 0.00, '2026-05-21 08:59:37', 'check_in', '2026-05-21 08:59:37', '2026-05-21 08:59:37'),
(32, 12, 21, NULL, 11.6482756, 104.9075084, 17.19, 0.00, '2026-05-21 09:04:06', 'check_in', '2026-05-21 09:04:06', '2026-05-21 09:04:06'),
(33, 5, 22, NULL, 11.6483949, 104.9074630, 20.00, 0.00, '2026-05-21 09:04:32', 'check_in', '2026-05-21 09:04:32', '2026-05-21 09:04:32'),
(34, 15, 23, NULL, 11.6483402, 104.9074307, 35.00, 0.00, '2026-05-21 09:05:30', 'check_in', '2026-05-21 09:05:30', '2026-05-21 09:05:30'),
(35, 4, 24, NULL, 11.6483799, 104.9074516, 14.16, 0.00, '2026-05-21 11:21:59', 'check_in', '2026-05-21 11:21:59', '2026-05-21 11:21:59'),
(36, 6, 18, NULL, 11.6483776, 104.9074761, 10.25, 0.00, '2026-05-21 17:04:07', 'check_out', '2026-05-21 17:04:07', '2026-05-21 17:04:07'),
(37, 16, 13, NULL, 11.6483985, 104.9074618, 10.58, 0.00, '2026-05-21 17:08:06', 'check_out', '2026-05-21 17:08:06', '2026-05-21 17:08:06'),
(38, 5, 22, NULL, 11.6484188, 104.9074630, 13.09, 0.00, '2026-05-21 17:18:08', 'check_out', '2026-05-21 17:18:08', '2026-05-21 17:18:08'),
(39, 3, 20, NULL, 11.6483695, 104.9074530, 19.68, 0.00, '2026-05-21 17:18:43', 'check_out', '2026-05-21 17:18:43', '2026-05-21 17:18:43'),
(40, 14, 14, NULL, 11.6484173, 104.9075001, 17.88, 0.00, '2026-05-21 17:22:29', 'check_out', '2026-05-21 17:22:29', '2026-05-21 17:22:29'),
(41, 15, 23, NULL, 11.6483412, 104.9074324, 35.00, 0.00, '2026-05-21 17:24:13', 'check_out', '2026-05-21 17:24:13', '2026-05-21 17:24:13'),
(42, 4, 24, NULL, 11.6483757, 104.9073735, 25.34, 0.00, '2026-05-21 17:37:01', 'check_out', '2026-05-21 17:37:01', '2026-05-21 17:37:01'),
(43, 10, 17, NULL, 11.6483928, 104.9074390, 23.59, 0.00, '2026-05-21 17:47:16', 'check_out', '2026-05-21 17:47:16', '2026-05-21 17:47:16'),
(44, 8, 16, NULL, 11.6484230, 104.9074446, 17.07, 0.00, '2026-05-21 17:48:15', 'check_out', '2026-05-21 17:48:15', '2026-05-21 17:48:15'),
(45, 12, 21, NULL, 11.6482756, 104.9075084, 17.19, 0.00, '2026-05-21 18:47:29', 'check_out', '2026-05-21 18:47:29', '2026-05-21 18:47:29'),
(46, 9, 15, NULL, 11.6485350, 104.9074730, 19.36, 0.00, '2026-05-21 18:50:55', 'check_out', '2026-05-21 18:50:55', '2026-05-21 18:50:55'),
(47, 13, 19, NULL, 11.6484385, 104.9074764, 7.92, 0.00, '2026-05-21 18:53:01', 'check_out', '2026-05-21 18:53:01', '2026-05-21 18:53:01'),
(48, 16, 25, NULL, 11.6484133, 104.9074521, 8.55, 0.00, '2026-05-22 08:03:21', 'check_in', '2026-05-22 08:03:21', '2026-05-22 08:03:21'),
(49, 8, 26, NULL, 11.6484185, 104.9074293, 19.90, 0.11, '2026-05-22 08:14:48', 'check_in', '2026-05-22 08:14:48', '2026-05-22 08:14:48'),
(50, 14, 27, NULL, 11.6483726, 104.9074740, 18.44, 0.00, '2026-05-22 08:17:46', 'check_in', '2026-05-22 08:17:46', '2026-05-22 08:17:46'),
(51, 9, 28, NULL, 11.6485350, 104.9074730, 20.00, 0.00, '2026-05-22 08:19:33', 'check_in', '2026-05-22 08:19:33', '2026-05-22 08:19:33'),
(52, 10, 29, NULL, 11.6483577, 104.9074781, 12.71, 0.00, '2026-05-22 08:27:43', 'check_in', '2026-05-22 08:27:43', '2026-05-22 08:27:43'),
(53, 6, 30, NULL, 11.6483776, 104.9074761, 10.25, 0.00, '2026-05-22 08:47:52', 'check_in', '2026-05-22 08:47:52', '2026-05-22 08:47:52'),
(54, 15, 31, NULL, 11.6483413, 104.9074324, 35.00, 0.00, '2026-05-22 08:50:34', 'check_in', '2026-05-22 08:50:34', '2026-05-22 08:50:34'),
(55, 5, 32, NULL, 11.6484545, 104.9074644, 4.95, 0.24, '2026-05-22 08:55:44', 'check_in', '2026-05-22 08:55:44', '2026-05-22 08:55:44'),
(56, 13, 33, NULL, 11.6484220, 104.9074955, 8.41, 0.00, '2026-05-22 09:00:51', 'check_in', '2026-05-22 09:00:51', '2026-05-22 09:00:51'),
(57, 12, 34, NULL, 11.6482756, 104.9075084, 17.19, 0.00, '2026-05-22 09:01:13', 'check_in', '2026-05-22 09:01:13', '2026-05-22 09:01:13'),
(58, 3, 35, NULL, 11.6483862, 104.9074581, 13.63, 0.00, '2026-05-22 09:14:04', 'check_in', '2026-05-22 09:14:04', '2026-05-22 09:14:04'),
(59, 4, 36, NULL, 11.6483951, 104.9074341, 19.80, 0.00, '2026-05-22 11:21:14', 'check_in', '2026-05-22 11:21:14', '2026-05-22 11:21:14'),
(60, 6, 30, NULL, 11.6483908, 104.9074385, 40.00, 0.00, '2026-05-22 17:02:02', 'check_out', '2026-05-22 17:02:02', '2026-05-22 17:02:02'),
(61, 5, 32, NULL, 11.6484155, 104.9074631, 13.17, 0.00, '2026-05-22 17:02:36', 'check_out', '2026-05-22 17:02:36', '2026-05-22 17:02:36'),
(62, 16, 25, NULL, 11.6483979, 104.9074617, 10.71, 0.00, '2026-05-22 17:07:18', 'check_out', '2026-05-22 17:07:18', '2026-05-22 17:07:18'),
(63, 3, 35, NULL, 11.6483853, 104.9074602, 12.52, 0.00, '2026-05-22 17:13:12', 'check_out', '2026-05-22 17:13:12', '2026-05-22 17:13:12'),
(64, 8, 26, NULL, 11.6484212, 104.9074271, 19.47, 0.00, '2026-05-22 17:22:10', 'check_out', '2026-05-22 17:22:10', '2026-05-22 17:22:10'),
(65, 15, 31, NULL, 11.6483397, 104.9074355, 35.00, 0.00, '2026-05-22 17:33:14', 'check_out', '2026-05-22 17:33:14', '2026-05-22 17:33:14'),
(66, 14, 27, NULL, 11.6483733, 104.9074756, 18.31, 0.00, '2026-05-22 17:33:43', 'check_out', '2026-05-22 17:33:43', '2026-05-22 17:33:43'),
(67, 4, 36, NULL, 11.6483855, 104.9074502, 19.38, 0.00, '2026-05-22 17:33:58', 'check_out', '2026-05-22 17:33:58', '2026-05-22 17:33:58'),
(68, 9, 28, NULL, 11.6485350, 104.9074729, 20.05, 0.00, '2026-05-22 18:14:33', 'check_out', '2026-05-22 18:14:33', '2026-05-22 18:14:33'),
(69, 13, 33, NULL, 11.6484345, 104.9074598, 10.90, 0.00, '2026-05-22 20:11:37', 'check_out', '2026-05-22 20:11:37', '2026-05-22 20:11:37'),
(70, 12, 34, NULL, 11.6482151, 104.9075296, 11.00, 0.00, '2026-05-22 20:12:20', 'check_out', '2026-05-22 20:12:20', '2026-05-22 20:12:20'),
(71, 16, 37, NULL, 11.6484442, 104.9074577, 8.31, 0.00, '2026-05-23 08:03:20', 'check_in', '2026-05-23 08:03:20', '2026-05-23 08:03:20'),
(72, 14, 38, NULL, 11.6484201, 104.9074960, 19.84, 0.00, '2026-05-23 08:15:29', 'check_in', '2026-05-23 08:15:29', '2026-05-23 08:15:29'),
(73, 9, 39, NULL, 11.6485173, 104.9074672, 19.88, 0.00, '2026-05-23 08:21:58', 'check_in', '2026-05-23 08:21:58', '2026-05-23 08:21:58'),
(74, 10, 40, NULL, 11.6483710, 104.9074535, 19.71, 0.00, '2026-05-23 08:38:01', 'check_in', '2026-05-23 08:38:01', '2026-05-23 08:38:01'),
(75, 6, 41, NULL, 11.6483932, 104.9074310, 22.77, 0.00, '2026-05-23 08:41:58', 'check_in', '2026-05-23 08:41:58', '2026-05-23 08:41:58'),
(76, 15, 42, NULL, 11.6483381, 104.9074358, 35.00, 0.00, '2026-05-23 08:49:04', 'check_in', '2026-05-23 08:49:04', '2026-05-23 08:49:04'),
(77, 13, 43, NULL, 11.6484414, 104.9074193, 3.48, 0.00, '2026-05-23 08:51:04', 'check_in', '2026-05-23 08:51:04', '2026-05-23 08:51:04'),
(78, 12, 44, NULL, 11.6482473, 104.9075084, 35.00, 0.00, '2026-05-23 08:51:42', 'check_in', '2026-05-23 08:51:42', '2026-05-23 08:51:42'),
(79, 5, 45, NULL, 11.6484132, 104.9074458, 14.00, 0.55, '2026-05-23 09:00:46', 'check_in', '2026-05-23 09:00:46', '2026-05-23 09:00:46'),
(80, 3, 46, NULL, 11.6483849, 104.9074599, 18.83, 0.00, '2026-05-23 09:12:30', 'check_in', '2026-05-23 09:12:30', '2026-05-23 09:12:30'),
(81, 4, 47, NULL, 11.6483845, 104.9074384, 14.08, 2.81, '2026-05-23 10:03:33', 'check_in', '2026-05-23 10:03:33', '2026-05-23 10:03:33'),
(82, 5, 45, NULL, 11.6484145, 104.9074630, 13.17, 0.00, '2026-05-23 17:03:39', 'check_out', '2026-05-23 17:03:39', '2026-05-23 17:03:39'),
(83, 6, 41, NULL, 11.6483857, 104.9074592, 40.00, 0.00, '2026-05-23 17:04:29', 'check_out', '2026-05-23 17:04:29', '2026-05-23 17:04:29'),
(84, 16, 37, NULL, 11.6484142, 104.9074665, 17.05, 0.00, '2026-05-23 17:12:19', 'check_out', '2026-05-23 17:12:19', '2026-05-23 17:12:19'),
(85, 3, 46, NULL, 11.6483846, 104.9074548, 11.82, 0.00, '2026-05-23 17:15:38', 'check_out', '2026-05-23 17:15:38', '2026-05-23 17:15:38'),
(86, 15, 42, NULL, 11.6483426, 104.9074318, 35.00, 0.00, '2026-05-23 17:15:46', 'check_out', '2026-05-23 17:15:46', '2026-05-23 17:15:46'),
(87, 14, 38, NULL, 11.6483716, 104.9074755, 18.35, 0.00, '2026-05-23 17:30:47', 'check_out', '2026-05-23 17:30:47', '2026-05-23 17:30:47'),
(88, 4, 47, NULL, 11.6485074, 104.9073905, 10.28, 0.15, '2026-05-23 21:31:27', 'check_out', '2026-05-23 21:31:27', '2026-05-23 21:31:27'),
(89, 10, 40, NULL, 11.6483711, 104.9074535, 17.80, 0.00, '2026-05-23 23:01:26', 'check_out', '2026-05-23 23:01:26', '2026-05-23 23:01:26'),
(90, 13, 43, NULL, 11.6484302, 104.9074446, 14.15, 0.00, '2026-05-23 23:01:31', 'check_out', '2026-05-23 23:01:31', '2026-05-23 23:01:31'),
(91, 9, 39, NULL, 11.6484041, 104.9074551, 15.70, 0.00, '2026-05-23 23:02:03', 'check_out', '2026-05-23 23:02:03', '2026-05-23 23:02:03'),
(92, 12, 44, NULL, 11.6482151, 104.9075296, 11.00, 0.00, '2026-05-23 23:02:16', 'check_out', '2026-05-23 23:02:16', '2026-05-23 23:02:16'),
(93, 8, 48, NULL, 11.6484171, 104.9074189, 19.95, 0.00, '2026-05-24 08:09:40', 'check_in', '2026-05-24 08:09:40', '2026-05-24 08:09:40'),
(94, 16, 49, NULL, 11.6483596, 104.9074566, 7.83, 0.00, '2026-05-24 08:17:41', 'check_in', '2026-05-24 08:17:41', '2026-05-24 08:17:41'),
(95, 10, 50, NULL, 11.6483711, 104.9074535, 17.08, 0.00, '2026-05-24 09:26:22', 'check_in', '2026-05-24 09:26:22', '2026-05-24 09:26:22'),
(96, 12, 51, NULL, 11.6482696, 104.9074712, 35.00, 0.00, '2026-05-24 09:32:13', 'check_in', '2026-05-24 09:32:13', '2026-05-24 09:32:13'),
(97, 19, 52, NULL, 11.6483654, 104.9074812, 9.81, 0.00, '2026-05-24 09:41:34', 'check_in', '2026-05-24 09:41:34', '2026-05-24 09:41:34'),
(98, 13, 53, NULL, 11.6484455, 104.9074502, 19.76, 0.00, '2026-05-24 09:56:30', 'check_in', '2026-05-24 09:56:30', '2026-05-24 09:56:30'),
(99, 9, 54, NULL, 11.6484047, 104.9074551, 19.99, 0.00, '2026-05-24 10:41:10', 'check_in', '2026-05-24 10:41:10', '2026-05-24 10:41:10'),
(100, 16, 49, NULL, 11.6484108, 104.9074656, 18.21, 0.00, '2026-05-24 17:00:02', 'check_out', '2026-05-24 17:00:03', '2026-05-24 17:00:03'),
(101, 8, 48, NULL, 11.6484158, 104.9074253, 17.55, 0.00, '2026-05-24 17:15:57', 'check_out', '2026-05-24 17:15:57', '2026-05-24 17:15:57'),
(102, 10, 50, NULL, 11.6483190, 104.9075034, 21.29, 0.00, '2026-05-24 17:37:41', 'check_out', '2026-05-24 17:37:41', '2026-05-24 17:37:41'),
(103, 19, 52, NULL, 11.6483654, 104.9074812, 9.81, 0.00, '2026-05-24 17:38:52', 'check_out', '2026-05-24 17:38:52', '2026-05-24 17:38:52'),
(104, 13, 53, NULL, 11.6484442, 104.9074508, 17.13, 0.00, '2026-05-24 17:39:20', 'check_out', '2026-05-24 17:39:20', '2026-05-24 17:39:20'),
(105, 9, 54, NULL, 11.6484008, 104.9074536, 20.00, 0.00, '2026-05-24 17:40:18', 'check_out', '2026-05-24 17:40:18', '2026-05-24 17:40:18'),
(106, 12, 51, NULL, 11.6482151, 104.9075296, 11.00, 0.00, '2026-05-24 17:41:06', 'check_out', '2026-05-24 17:41:06', '2026-05-24 17:41:06'),
(107, 20, 55, NULL, 11.6483368, 104.9074758, 11.28, 0.00, '2026-05-24 20:31:07', 'check_in', '2026-05-24 20:31:08', '2026-05-24 20:31:08'),
(108, 20, 55, NULL, 11.6483786, 104.9074561, 13.24, 0.00, '2026-05-24 20:39:26', 'check_out', '2026-05-24 20:39:26', '2026-05-24 20:39:26'),
(109, 9, 56, NULL, 11.6483881, 104.9074819, 12.55, 0.00, '2026-05-25 08:57:08', 'check_in', '2026-05-25 08:57:09', '2026-05-25 08:57:09'),
(110, 13, 57, NULL, 11.6484439, 104.9074503, 13.88, 0.00, '2026-05-25 08:57:14', 'check_in', '2026-05-25 08:57:14', '2026-05-25 08:57:14'),
(111, 10, 58, NULL, 11.6483709, 104.9074536, 5.31, 0.00, '2026-05-25 08:58:14', 'check_in', '2026-05-25 08:58:14', '2026-05-25 08:58:14'),
(112, 16, 59, NULL, 11.6484103, 104.9074602, 16.72, 0.00, '2026-05-25 08:58:17', 'check_in', '2026-05-25 08:58:17', '2026-05-25 08:58:17'),
(113, 19, 60, NULL, 11.6483548, 104.9074912, 8.59, 0.00, '2026-05-25 08:58:58', 'check_in', '2026-05-25 08:59:00', '2026-05-25 08:59:00'),
(114, 14, 61, NULL, 11.6484408, 104.9074620, 18.62, 0.00, '2026-05-25 08:59:37', 'check_in', '2026-05-25 08:59:38', '2026-05-25 08:59:38'),
(115, 6, 62, NULL, 11.6483787, 104.9074758, 40.00, 0.00, '2026-05-25 09:16:49', 'check_in', '2026-05-25 09:16:49', '2026-05-25 09:16:49'),
(116, 12, 63, NULL, 11.6482151, 104.9075296, 11.15, 0.00, '2026-05-25 09:17:46', 'check_in', '2026-05-25 09:17:46', '2026-05-25 09:17:46'),
(117, 15, 64, NULL, 11.6483468, 104.9074308, 35.00, 0.00, '2026-05-25 09:18:03', 'check_in', '2026-05-25 09:18:03', '2026-05-25 09:18:03'),
(118, 8, 65, NULL, 11.6484193, 104.9074334, 13.45, 0.00, '2026-05-25 09:18:20', 'check_in', '2026-05-25 09:18:20', '2026-05-25 09:18:20'),
(119, 3, 66, NULL, 11.6483855, 104.9074578, 17.92, 0.00, '2026-05-25 09:20:26', 'check_in', '2026-05-25 09:20:26', '2026-05-25 09:20:26'),
(120, 5, 67, NULL, 11.6484108, 104.9075714, 84.00, 0.00, '2026-05-25 09:21:12', 'check_in', '2026-05-25 09:21:12', '2026-05-25 09:21:12'),
(121, 21, 68, NULL, 12.3135545, 105.2759499, 18.74, 0.00, '2026-05-25 10:44:37', 'check_in', '2026-05-25 10:44:38', '2026-05-25 10:44:38'),
(122, 4, 69, NULL, 11.6483958, 104.9074432, 14.30, 0.00, '2026-05-25 11:28:56', 'check_in', '2026-05-25 11:28:56', '2026-05-25 11:28:56'),
(123, 6, 62, NULL, 11.6483725, 104.9074656, 40.00, 0.00, '2026-05-25 17:05:57', 'check_out', '2026-05-25 17:05:57', '2026-05-25 17:05:57'),
(124, 8, 65, NULL, 11.6484145, 104.9074155, 20.08, 0.00, '2026-05-25 17:06:33', 'check_out', '2026-05-25 17:06:33', '2026-05-25 17:06:33'),
(125, 19, 60, NULL, 11.6483548, 104.9074912, 8.59, 0.00, '2026-05-25 17:06:52', 'check_out', '2026-05-25 17:06:52', '2026-05-25 17:06:52'),
(126, 5, 67, NULL, 11.6484145, 104.9074630, 13.17, 0.00, '2026-05-25 17:13:37', 'check_out', '2026-05-25 17:13:37', '2026-05-25 17:13:37'),
(127, 3, 66, NULL, 11.6483736, 104.9074402, 22.00, 0.00, '2026-05-25 17:16:08', 'check_out', '2026-05-25 17:16:08', '2026-05-25 17:16:08'),
(128, 4, 69, NULL, 11.6484133, 104.9074527, 15.21, 0.00, '2026-05-25 17:24:53', 'check_out', '2026-05-25 17:24:54', '2026-05-25 17:24:54'),
(129, 15, 64, NULL, 11.6483476, 104.9074400, 35.00, 0.00, '2026-05-25 17:28:27', 'check_out', '2026-05-25 17:28:27', '2026-05-25 17:28:27'),
(130, 14, 61, NULL, 11.6483778, 104.9074698, 19.59, 0.00, '2026-05-25 17:29:53', 'check_out', '2026-05-25 17:29:53', '2026-05-25 17:29:53'),
(131, 21, 68, NULL, 11.8924971, 105.7673939, 4.85, 0.05, '2026-05-25 18:39:26', 'check_out', '2026-05-25 18:39:27', '2026-05-25 18:39:27'),
(132, 10, 58, NULL, 11.6482963, 104.9074886, 23.61, 0.00, '2026-05-25 18:56:38', 'check_out', '2026-05-25 18:56:38', '2026-05-25 18:56:38'),
(133, 12, 63, NULL, 11.6482151, 104.9075296, 11.15, 0.00, '2026-05-25 18:57:51', 'check_out', '2026-05-25 18:57:51', '2026-05-25 18:57:51'),
(134, 9, 56, NULL, 11.6483881, 104.9074819, 12.55, 0.00, '2026-05-25 19:02:43', 'check_out', '2026-05-25 19:02:43', '2026-05-25 19:02:43'),
(135, 13, 57, NULL, 11.6484463, 104.9074491, 17.06, 0.00, '2026-05-25 19:05:09', 'check_out', '2026-05-25 19:05:09', '2026-05-25 19:05:09'),
(136, 17, 70, NULL, 11.8928433, 105.7672000, 5.70, 0.76, '2026-05-25 19:52:01', 'check_in', '2026-05-25 19:52:02', '2026-05-25 19:52:02'),
(137, 16, 71, NULL, 11.6484723, 104.9074599, 5.90, 0.02, '2026-05-26 08:06:55', 'check_in', '2026-05-26 08:06:56', '2026-05-26 08:06:56'),
(138, 8, 72, NULL, 11.6483566, 104.9074282, 14.00, 0.24, '2026-05-26 08:21:36', 'check_in', '2026-05-26 08:21:37', '2026-05-26 08:21:37'),
(139, 10, 73, NULL, 11.6483711, 104.9074535, 17.47, 0.00, '2026-05-26 08:22:42', 'check_in', '2026-05-26 08:22:43', '2026-05-26 08:22:43'),
(140, 9, 74, NULL, 11.6483961, 104.9074532, 19.97, 0.00, '2026-05-26 08:23:09', 'check_in', '2026-05-26 08:23:10', '2026-05-26 08:23:10'),
(141, 14, 75, NULL, 11.6484407, 104.9074621, 20.05, 0.00, '2026-05-26 08:25:19', 'check_in', '2026-05-26 08:25:20', '2026-05-26 08:25:20'),
(142, 13, 76, NULL, 11.6484468, 104.9074476, 16.58, 0.00, '2026-05-26 08:30:01', 'check_in', '2026-05-26 08:30:02', '2026-05-26 08:30:02'),
(143, 15, 77, NULL, 11.6483874, 104.9074549, 35.00, 0.00, '2026-05-26 08:30:17', 'check_in', '2026-05-26 08:30:18', '2026-05-26 08:30:18'),
(144, 19, 78, NULL, 11.6483737, 104.9074914, 14.25, 0.00, '2026-05-26 08:47:44', 'check_in', '2026-05-26 08:47:45', '2026-05-26 08:47:45'),
(145, 11, 79, NULL, 11.6483508, 104.9074716, 18.28, 0.00, '2026-05-26 08:58:21', 'check_in', '2026-05-26 08:58:22', '2026-05-26 08:58:22'),
(146, 3, 80, NULL, 11.6484049, 104.9074644, 14.48, 0.23, '2026-05-26 09:12:49', 'check_in', '2026-05-26 09:12:50', '2026-05-26 09:12:50'),
(147, 6, 81, NULL, 11.6483397, 104.9075394, 40.00, 0.00, '2026-05-26 09:13:47', 'check_in', '2026-05-26 09:13:48', '2026-05-26 09:13:48'),
(148, 5, 82, NULL, 11.6484138, 104.9074675, 15.40, 0.35, '2026-05-26 09:36:11', 'check_in', '2026-05-26 09:36:12', '2026-05-26 09:36:12'),
(149, 12, 83, NULL, 11.6483566, 104.9074595, 12.82, 0.00, '2026-05-26 11:12:01', 'check_in', '2026-05-26 11:12:02', '2026-05-26 11:12:02'),
(150, 4, 84, NULL, 11.6484122, 104.9074504, 19.83, 0.00, '2026-05-26 11:24:10', 'check_in', '2026-05-26 11:24:10', '2026-05-26 11:24:10'),
(151, 17, 85, NULL, 11.9230894, 105.5757378, 24.56, 0.00, '2026-05-26 12:17:45', 'check_in', '2026-05-26 12:17:46', '2026-05-26 12:17:46'),
(152, 6, 81, NULL, 11.6484022, 104.9074310, 40.00, 0.00, '2026-05-26 17:03:29', 'check_out', '2026-05-26 17:03:30', '2026-05-26 17:03:30'),
(153, 19, 78, NULL, 11.6483710, 104.9074794, 8.74, 0.00, '2026-05-26 17:10:17', 'check_out', '2026-05-26 17:10:18', '2026-05-26 17:10:18'),
(154, 8, 72, NULL, 11.6484034, 104.9074220, 18.28, 0.00, '2026-05-26 17:13:06', 'check_out', '2026-05-26 17:13:07', '2026-05-26 17:13:07'),
(155, 4, 84, NULL, 11.6484039, 104.9074499, 14.63, 0.00, '2026-05-26 17:19:39', 'check_out', '2026-05-26 17:19:40', '2026-05-26 17:19:40'),
(156, 5, 82, NULL, 11.6483966, 104.9074652, 15.18, 0.00, '2026-05-26 17:20:18', 'check_out', '2026-05-26 17:20:18', '2026-05-26 17:20:18'),
(157, 3, 80, NULL, 11.6483739, 104.9074700, 19.98, 0.00, '2026-05-26 17:21:40', 'check_out', '2026-05-26 17:21:40', '2026-05-26 17:21:40'),
(158, 14, 75, NULL, 11.6483786, 104.9074691, 17.78, 0.00, '2026-05-26 17:59:47', 'check_out', '2026-05-26 17:59:47', '2026-05-26 17:59:47'),
(159, 13, 76, NULL, 11.6484471, 104.9074475, 8.23, 0.00, '2026-05-26 18:59:15', 'check_out', '2026-05-26 18:59:15', '2026-05-26 18:59:15'),
(160, 10, 73, NULL, 11.6483711, 104.9074535, 18.24, 0.00, '2026-05-26 18:59:57', 'check_out', '2026-05-26 18:59:57', '2026-05-26 18:59:57'),
(161, 15, 77, NULL, 11.6483480, 104.9074488, 35.00, 0.00, '2026-05-26 19:41:51', 'check_out', '2026-05-26 19:41:52', '2026-05-26 19:41:52'),
(162, 9, 74, NULL, 11.6483885, 104.9074812, 12.46, 0.00, '2026-05-26 19:45:57', 'check_out', '2026-05-26 19:45:58', '2026-05-26 19:45:58'),
(163, 12, 83, NULL, 11.6483561, 104.9074540, 8.60, 0.00, '2026-05-26 19:46:47', 'check_out', '2026-05-26 19:46:48', '2026-05-26 19:46:48'),
(164, 21, 86, NULL, 11.8910571, 105.7832787, 16.01, 0.00, '2026-05-26 19:51:24', 'check_in', '2026-05-26 19:51:25', '2026-05-26 19:51:25'),
(165, 16, 87, NULL, 11.6484247, 104.9074637, 4.45, 0.18, '2026-05-27 08:01:59', 'check_in', '2026-05-27 08:02:00', '2026-05-27 08:02:00'),
(166, 9, 88, NULL, 11.6483889, 104.9074810, 12.45, 0.00, '2026-05-27 08:09:37', 'check_in', '2026-05-27 08:09:38', '2026-05-27 08:09:38'),
(167, 8, 89, NULL, 11.6483976, 104.9074003, 19.94, 0.00, '2026-05-27 08:11:03', 'check_in', '2026-05-27 08:11:03', '2026-05-27 08:11:03'),
(168, 14, 90, NULL, 11.6484471, 104.9074577, 19.92, 0.00, '2026-05-27 08:28:43', 'check_in', '2026-05-27 08:28:44', '2026-05-27 08:28:44'),
(169, 13, 91, NULL, 11.6484442, 104.9074484, 19.98, 0.00, '2026-05-27 08:38:10', 'check_in', '2026-05-27 08:38:10', '2026-05-27 08:38:10'),
(170, 10, 92, NULL, 11.6483305, 104.9074762, 25.02, 0.00, '2026-05-27 08:40:08', 'check_in', '2026-05-27 08:40:09', '2026-05-27 08:40:09'),
(171, 5, 93, NULL, 11.6483964, 104.9074650, 15.92, 0.00, '2026-05-27 08:40:51', 'check_in', '2026-05-27 08:40:52', '2026-05-27 08:40:52'),
(172, 19, 94, NULL, 11.6483718, 104.9074914, 19.98, 0.00, '2026-05-27 08:58:57', 'check_in', '2026-05-27 08:58:57', '2026-05-27 08:58:57'),
(173, 6, 95, NULL, 11.6483635, 104.9074908, 40.00, 0.00, '2026-05-27 09:00:29', 'check_in', '2026-05-27 09:00:30', '2026-05-27 09:00:30'),
(174, 12, 96, NULL, 11.6483563, 104.9074600, 17.54, 0.00, '2026-05-27 09:13:22', 'check_in', '2026-05-27 09:13:22', '2026-05-27 09:13:22'),
(175, 11, 97, NULL, 11.5736054, 104.9264673, 23.95, 0.00, '2026-05-27 09:17:11', 'check_in', '2026-05-27 09:17:11', '2026-05-27 09:17:11'),
(176, 3, 98, NULL, 11.6483958, 104.9074626, 19.97, 0.00, '2026-05-27 09:21:18', 'check_in', '2026-05-27 09:21:18', '2026-05-27 09:21:18'),
(177, 17, 99, NULL, 11.9910820, 105.4651118, 19.53, 0.00, '2026-05-27 10:49:58', 'check_in', '2026-05-27 10:49:59', '2026-05-27 10:49:59'),
(178, 21, 100, NULL, 11.9970802, 105.4623733, 3.57, 0.25, '2026-05-27 11:04:24', 'check_in', '2026-05-27 11:04:24', '2026-05-27 11:04:24'),
(179, 4, 101, NULL, 11.6484334, 104.9074681, 14.00, 0.00, '2026-05-27 11:25:00', 'check_in', '2026-05-27 11:25:00', '2026-05-27 11:25:00'),
(180, 6, 95, NULL, 11.6483584, 104.9074677, 40.00, 0.00, '2026-05-27 17:04:45', 'check_out', '2026-05-27 17:04:45', '2026-05-27 17:04:45'),
(181, 19, 94, NULL, 11.6483710, 104.9074794, 8.74, 0.00, '2026-05-27 17:10:05', 'check_out', '2026-05-27 17:10:06', '2026-05-27 17:10:06'),
(182, 14, 90, NULL, 11.6483782, 104.9074706, 16.38, 0.00, '2026-05-27 17:10:11', 'check_out', '2026-05-27 17:10:12', '2026-05-27 17:10:12'),
(183, 5, 93, NULL, 11.6484093, 104.9074648, 13.75, 0.00, '2026-05-27 17:15:25', 'check_out', '2026-05-27 17:15:25', '2026-05-27 17:15:25'),
(184, 16, 87, NULL, 11.6484209, 104.9074552, 18.34, 0.00, '2026-05-27 17:20:06', 'check_out', '2026-05-27 17:20:07', '2026-05-27 17:20:07'),
(185, 3, 98, NULL, 11.6483981, 104.9074621, 12.03, 0.00, '2026-05-27 17:20:42', 'check_out', '2026-05-27 17:20:44', '2026-05-27 17:20:44'),
(186, 8, 89, NULL, 11.6484148, 104.9074199, 14.30, 0.00, '2026-05-27 17:31:04', 'check_out', '2026-05-27 17:31:05', '2026-05-27 17:31:05'),
(187, 17, 99, NULL, 12.5669150, 105.0544683, 11.70, 0.60, '2026-05-27 17:39:29', 'check_out', '2026-05-27 17:39:29', '2026-05-27 17:39:29'),
(188, 21, 100, NULL, 12.5669952, 105.0545406, 4.75, 0.00, '2026-05-27 17:39:48', 'check_out', '2026-05-27 17:39:49', '2026-05-27 17:39:49'),
(189, 4, 101, NULL, 11.6484091, 104.9074517, 19.62, 0.00, '2026-05-27 17:44:39', 'check_out', '2026-05-27 17:44:40', '2026-05-27 17:44:40'),
(190, 10, 92, NULL, 11.6483711, 104.9074535, 17.67, 0.00, '2026-05-27 20:10:23', 'check_out', '2026-05-27 20:10:24', '2026-05-27 20:10:24'),
(191, 13, 91, NULL, 11.6484472, 104.9074479, 6.41, 0.00, '2026-05-27 21:50:21', 'check_out', '2026-05-27 21:50:21', '2026-05-27 21:50:21'),
(192, 9, 88, NULL, 11.6483889, 104.9074810, 12.45, 0.00, '2026-05-27 21:58:19', 'check_out', '2026-05-27 21:58:20', '2026-05-27 21:58:20'),
(193, 12, 96, NULL, 11.6483494, 104.9074500, 7.87, 0.00, '2026-05-27 21:59:07', 'check_out', '2026-05-27 21:59:08', '2026-05-27 21:59:08'),
(194, 16, 102, NULL, 11.6484289, 104.9074794, 3.09, 0.07, '2026-05-28 08:09:26', 'check_in', '2026-05-28 08:09:26', '2026-05-28 08:09:26'),
(195, 14, 103, NULL, 11.6484490, 104.9074565, 19.66, 0.00, '2026-05-28 08:18:23', 'check_in', '2026-05-28 08:18:23', '2026-05-28 08:18:23'),
(196, 9, 104, NULL, 11.6483961, 104.9074532, 20.00, 0.00, '2026-05-28 08:27:20', 'check_in', '2026-05-28 08:27:20', '2026-05-28 08:27:20'),
(197, 8, 105, NULL, 11.6483841, 104.9073896, 19.98, 0.00, '2026-05-28 08:37:47', 'check_in', '2026-05-28 08:37:47', '2026-05-28 08:37:47'),
(198, 5, 106, NULL, 11.6484093, 104.9074648, 13.75, 0.00, '2026-05-28 08:39:45', 'check_in', '2026-05-28 08:39:46', '2026-05-28 08:39:46'),
(199, 6, 107, NULL, 11.6484030, 104.9074580, 40.00, 0.00, '2026-05-28 08:50:06', 'check_in', '2026-05-28 08:50:06', '2026-05-28 08:50:06'),
(200, 15, 108, NULL, 11.6484179, 104.9074399, 35.00, 0.00, '2026-05-28 08:50:40', 'check_in', '2026-05-28 08:50:41', '2026-05-28 08:50:41'),
(201, 19, 109, NULL, 11.6483712, 104.9074894, 17.68, 0.00, '2026-05-28 08:51:04', 'check_in', '2026-05-28 08:51:05', '2026-05-28 08:51:05'),
(202, 10, 110, NULL, 11.6483128, 104.9074820, 24.28, 0.00, '2026-05-28 08:51:47', 'check_in', '2026-05-28 08:51:48', '2026-05-28 08:51:48'),
(203, 13, 111, NULL, 11.6484474, 104.9074492, 19.94, 0.00, '2026-05-28 08:52:42', 'check_in', '2026-05-28 08:52:42', '2026-05-28 08:52:42'),
(204, 12, 112, NULL, 11.6483494, 104.9074500, 7.87, 0.00, '2026-05-28 08:53:18', 'check_in', '2026-05-28 08:53:19', '2026-05-28 08:53:19'),
(205, 3, 113, NULL, 11.6484141, 104.9074718, 13.81, 0.00, '2026-05-28 09:15:27', 'check_in', '2026-05-28 09:15:27', '2026-05-28 09:15:27'),
(206, 4, 114, NULL, 11.6484080, 104.9074474, 19.89, 0.00, '2026-05-28 11:36:01', 'check_in', '2026-05-28 11:36:02', '2026-05-28 11:36:02'),
(207, 17, 115, NULL, 12.2524914, 105.9766080, 17.89, 0.00, '2026-05-28 12:15:06', 'check_in', '2026-05-28 12:15:06', '2026-05-28 12:15:06'),
(208, 6, 107, NULL, 11.6483559, 104.9075089, 40.00, 0.00, '2026-05-28 17:04:09', 'check_out', '2026-05-28 17:04:10', '2026-05-28 17:04:10'),
(209, 5, 106, NULL, 11.6484084, 104.9074654, 13.12, 0.00, '2026-05-28 17:04:44', 'check_out', '2026-05-28 17:04:45', '2026-05-28 17:04:45'),
(210, 16, 102, NULL, 11.6484179, 104.9074493, 9.53, 0.00, '2026-05-28 17:05:43', 'check_out', '2026-05-28 17:05:44', '2026-05-28 17:05:44'),
(211, 3, 113, NULL, 11.6484061, 104.9074681, 10.11, 0.00, '2026-05-28 17:10:02', 'check_out', '2026-05-28 17:10:03', '2026-05-28 17:10:03'),
(212, 19, 109, NULL, 11.6483698, 104.9074802, 8.59, 0.00, '2026-05-28 17:10:30', 'check_out', '2026-05-28 17:10:31', '2026-05-28 17:10:31'),
(213, 14, 103, NULL, 11.6483755, 104.9074739, 8.55, 0.00, '2026-05-28 17:11:59', 'check_out', '2026-05-28 17:11:59', '2026-05-28 17:11:59'),
(214, 4, 114, NULL, 11.6484017, 104.9074421, 19.22, 0.00, '2026-05-28 17:27:01', 'check_out', '2026-05-28 17:27:02', '2026-05-28 17:27:02'),
(215, 17, 115, NULL, 12.4911683, 106.0157800, 14.45, 0.00, '2026-05-28 17:49:22', 'check_out', '2026-05-28 17:49:23', '2026-05-28 17:49:23'),
(216, 8, 105, NULL, 11.6483867, 104.9073913, 11.91, 0.00, '2026-05-28 17:58:44', 'check_out', '2026-05-28 17:58:45', '2026-05-28 17:58:45'),
(217, 13, 111, NULL, 11.6484468, 104.9074492, 7.05, 0.00, '2026-05-28 21:03:52', 'check_out', '2026-05-28 21:03:53', '2026-05-28 21:03:53'),
(218, 12, 112, NULL, 11.6483494, 104.9074500, 7.87, 0.00, '2026-05-28 22:08:28', 'check_out', '2026-05-28 22:08:28', '2026-05-28 22:08:28'),
(219, 9, 104, NULL, 11.6483970, 104.9074754, 9.95, 0.00, '2026-05-28 22:09:12', 'check_out', '2026-05-28 22:09:13', '2026-05-28 22:09:13'),
(220, 16, 116, NULL, 11.6484255, 104.9074706, 10.56, 0.04, '2026-05-29 08:13:50', 'check_in', '2026-05-29 08:13:51', '2026-05-29 08:13:51'),
(221, 8, 117, NULL, 11.6484107, 104.9074067, 19.16, 0.00, '2026-05-29 08:14:01', 'check_in', '2026-05-29 08:14:02', '2026-05-29 08:14:02'),
(222, 14, 118, NULL, 11.6483755, 104.9074739, 15.30, 0.00, '2026-05-29 08:25:53', 'check_in', '2026-05-29 08:25:54', '2026-05-29 08:25:54'),
(223, 5, 119, NULL, 11.6484080, 104.9074654, 13.10, 0.00, '2026-05-29 08:32:48', 'check_in', '2026-05-29 08:32:48', '2026-05-29 08:32:48'),
(224, 9, 120, NULL, 11.6483907, 104.9074531, 13.05, 0.00, '2026-05-29 08:44:41', 'check_in', '2026-05-29 08:44:42', '2026-05-29 08:44:42'),
(225, 15, 121, NULL, 11.6483651, 104.9074486, 35.00, 0.00, '2026-05-29 08:51:07', 'check_in', '2026-05-29 08:51:07', '2026-05-29 08:51:07'),
(226, 10, 122, NULL, 11.6485681, 104.9074844, 17.98, 0.00, '2026-05-29 08:56:48', 'check_in', '2026-05-29 08:56:49', '2026-05-29 08:56:49'),
(227, 19, 123, NULL, 11.6483717, 104.9074894, 19.91, 0.00, '2026-05-29 09:04:31', 'check_in', '2026-05-29 09:04:32', '2026-05-29 09:04:32'),
(228, 6, 124, NULL, 11.6484478, 104.9074949, 40.00, 0.00, '2026-05-29 09:07:59', 'check_in', '2026-05-29 09:07:59', '2026-05-29 09:07:59'),
(229, 3, 125, NULL, 11.6484130, 104.9074761, 6.44, 0.54, '2026-05-29 09:26:29', 'check_in', '2026-05-29 09:26:30', '2026-05-29 09:26:30'),
(230, 13, 126, NULL, 11.6484283, 104.9074652, 17.14, 0.00, '2026-05-29 09:28:54', 'check_in', '2026-05-29 09:28:55', '2026-05-29 09:28:55'),
(231, 12, 127, NULL, 11.6483501, 104.9074512, 7.69, 0.00, '2026-05-29 09:30:17', 'check_in', '2026-05-29 09:30:17', '2026-05-29 09:30:17'),
(232, 17, 128, NULL, 12.4908077, 106.0170391, 16.33, 0.00, '2026-05-29 10:24:48', 'check_in', '2026-05-29 10:24:49', '2026-05-29 10:24:49'),
(233, 4, 129, NULL, 11.6483834, 104.9074621, 9.01, 0.00, '2026-05-29 11:40:30', 'check_in', '2026-05-29 11:40:30', '2026-05-29 11:40:30'),
(234, 6, 124, NULL, 11.6483776, 104.9074761, 10.25, 0.00, '2026-05-29 17:00:38', 'check_out', '2026-05-29 17:00:39', '2026-05-29 17:00:39'),
(235, 16, 116, NULL, 11.6484194, 104.9074496, 19.86, 0.00, '2026-05-29 17:06:02', 'check_out', '2026-05-29 17:06:02', '2026-05-29 17:06:02'),
(236, 19, 123, NULL, 11.6483699, 104.9074803, 8.44, 0.00, '2026-05-29 17:07:44', 'check_out', '2026-05-29 17:07:45', '2026-05-29 17:07:45'),
(237, 5, 119, NULL, 11.6484080, 104.9074654, 13.10, 0.00, '2026-05-29 17:21:56', 'check_out', '2026-05-29 17:21:57', '2026-05-29 17:21:57'),
(238, 15, 121, NULL, 11.6483519, 104.9074549, 35.00, 0.00, '2026-05-29 17:22:43', 'check_out', '2026-05-29 17:22:43', '2026-05-29 17:22:43'),
(239, 3, 125, NULL, 11.6484056, 104.9074675, 7.60, 0.00, '2026-05-29 17:24:20', 'check_out', '2026-05-29 17:24:21', '2026-05-29 17:24:21'),
(240, 14, 118, NULL, 11.6483766, 104.9074732, 12.17, 0.00, '2026-05-29 17:24:45', 'check_out', '2026-05-29 17:24:45', '2026-05-29 17:24:45'),
(241, 8, 117, NULL, 11.6483923, 104.9074114, 18.39, 0.00, '2026-05-29 17:26:23', 'check_out', '2026-05-29 17:26:23', '2026-05-29 17:26:23'),
(242, 10, 122, NULL, 11.6485678, 104.9074845, 18.45, 0.00, '2026-05-29 17:43:40', 'check_out', '2026-05-29 17:43:40', '2026-05-29 17:43:40'),
(243, 13, 126, NULL, 11.6484466, 104.9074494, 9.17, 0.00, '2026-05-29 17:44:10', 'check_out', '2026-05-29 17:44:10', '2026-05-29 17:44:10'),
(244, 12, 127, NULL, 11.6483501, 104.9074512, 7.69, 0.00, '2026-05-29 17:45:51', 'check_out', '2026-05-29 17:45:52', '2026-05-29 17:45:52'),
(245, 17, 128, NULL, 13.5262780, 105.9708525, 16.91, 0.00, '2026-05-29 18:02:13', 'check_out', '2026-05-29 18:02:14', '2026-05-29 18:02:14'),
(246, 4, 129, NULL, 11.6484024, 104.9074448, 11.59, 0.00, '2026-05-29 22:23:43', 'check_out', '2026-05-29 22:23:44', '2026-05-29 22:23:44'),
(247, 16, 130, NULL, 11.6483837, 104.9074507, 4.80, 0.33, '2026-05-30 08:14:32', 'check_in', '2026-05-30 08:14:33', '2026-05-30 08:14:33'),
(248, 9, 131, NULL, 11.6483970, 104.9074754, 9.95, 0.00, '2026-05-30 08:26:29', 'check_in', '2026-05-30 08:26:30', '2026-05-30 08:26:30'),
(249, 14, 132, NULL, 11.6483780, 104.9074728, 16.36, 0.00, '2026-05-30 08:27:14', 'check_in', '2026-05-30 08:27:14', '2026-05-30 08:27:14'),
(250, 15, 133, NULL, 11.6483519, 104.9074549, 35.00, 0.00, '2026-05-30 08:37:40', 'check_in', '2026-05-30 08:37:40', '2026-05-30 08:37:40'),
(251, 5, 134, NULL, 11.6484080, 104.9074654, 12.82, 0.00, '2026-05-30 08:37:41', 'check_in', '2026-05-30 08:37:41', '2026-05-30 08:37:41'),
(252, 12, 135, NULL, 11.6483501, 104.9074512, 7.69, 0.00, '2026-05-30 08:40:54', 'check_in', '2026-05-30 08:40:54', '2026-05-30 08:40:54'),
(253, 13, 136, NULL, 11.6484425, 104.9074518, 19.96, 0.00, '2026-05-30 08:51:58', 'check_in', '2026-05-30 08:51:58', '2026-05-30 08:51:58'),
(254, 10, 137, NULL, 11.6483331, 104.9074751, 15.82, 0.00, '2026-05-30 08:54:31', 'check_in', '2026-05-30 08:54:32', '2026-05-30 08:54:32'),
(255, 6, 138, NULL, 11.6483776, 104.9074761, 10.25, 0.00, '2026-05-30 08:56:04', 'check_in', '2026-05-30 08:56:05', '2026-05-30 08:56:05'),
(256, 3, 139, NULL, 11.6483955, 104.9074935, 4.75, 0.17, '2026-05-30 09:24:16', 'check_in', '2026-05-30 09:24:16', '2026-05-30 09:24:16'),
(257, 4, 140, NULL, 11.6484375, 104.9074412, 14.00, 0.67, '2026-05-30 10:21:25', 'check_in', '2026-05-30 10:21:26', '2026-05-30 10:21:26'),
(258, 21, 141, NULL, 13.5301403, 105.9722400, 39.71, 0.00, '2026-05-30 10:52:57', 'check_in', '2026-05-30 10:52:58', '2026-05-30 10:52:58'),
(259, 17, 142, NULL, 13.5300276, 105.9724107, 13.26, 0.00, '2026-05-30 10:53:03', 'check_in', '2026-05-30 10:53:04', '2026-05-30 10:53:04'),
(260, 16, 130, NULL, 11.6484184, 104.9074490, 7.07, 0.00, '2026-05-30 17:00:33', 'check_out', '2026-05-30 17:00:34', '2026-05-30 17:00:34'),
(261, 6, 138, NULL, 11.6483934, 104.9074190, 40.00, 0.00, '2026-05-30 17:11:54', 'check_out', '2026-05-30 17:11:55', '2026-05-30 17:11:55'),
(262, 3, 139, NULL, 11.6484056, 104.9074703, 12.57, 0.00, '2026-05-30 17:13:10', 'check_out', '2026-05-30 17:13:11', '2026-05-30 17:13:11'),
(263, 10, 137, NULL, 11.6485348, 104.9074693, 19.20, 0.00, '2026-05-30 17:19:21', 'check_out', '2026-05-30 17:19:21', '2026-05-30 17:19:21'),
(264, 17, 142, NULL, 11.8238504, 106.1867146, 52.40, 0.00, '2026-05-30 17:30:06', 'check_out', '2026-05-30 17:30:06', '2026-05-30 17:30:06'),
(265, 5, 134, NULL, 11.6484080, 104.9074654, 12.91, 0.00, '2026-05-30 17:30:33', 'check_out', '2026-05-30 17:30:33', '2026-05-30 17:30:33'),
(266, 15, 133, NULL, 11.6483341, 104.9074621, 35.00, 0.00, '2026-05-30 17:32:18', 'check_out', '2026-05-30 17:32:19', '2026-05-30 17:32:19'),
(267, 14, 132, NULL, 11.6483908, 104.9074819, 18.37, 0.00, '2026-05-30 17:35:15', 'check_out', '2026-05-30 17:35:15', '2026-05-30 17:35:15'),
(268, 9, 131, NULL, 11.6483970, 104.9074754, 9.95, 0.00, '2026-05-30 18:32:06', 'check_out', '2026-05-30 18:32:07', '2026-05-30 18:32:07'),
(269, 13, 136, NULL, 11.6484424, 104.9074518, 11.55, 0.00, '2026-05-30 19:43:58', 'check_out', '2026-05-30 19:43:59', '2026-05-30 19:43:59'),
(270, 12, 135, NULL, 11.6483501, 104.9074512, 7.69, 0.00, '2026-05-30 19:47:39', 'check_out', '2026-05-30 19:47:39', '2026-05-30 19:47:39'),
(271, 16, 143, NULL, 11.6484048, 104.9072326, 12.69, 0.00, '2026-05-31 08:14:27', 'check_in', '2026-05-31 08:14:27', '2026-05-31 08:14:27'),
(272, 8, 144, NULL, 11.6484022, 104.9074088, 19.99, 0.00, '2026-05-31 08:21:54', 'check_in', '2026-05-31 08:21:54', '2026-05-31 08:21:54'),
(273, 10, 145, NULL, 11.6483361, 104.9074739, 16.25, 0.00, '2026-05-31 09:01:00', 'check_in', '2026-05-31 09:01:01', '2026-05-31 09:01:01'),
(274, 19, 146, NULL, 11.6483930, 104.9074812, 16.74, 1.14, '2026-05-31 09:28:54', 'check_in', '2026-05-31 09:28:55', '2026-05-31 09:28:55'),
(275, 21, 147, NULL, 11.8276688, 106.1809447, 46.54, 0.00, '2026-05-31 09:33:15', 'check_in', '2026-05-31 09:33:15', '2026-05-31 09:33:15'),
(276, 17, 148, NULL, 11.8275872, 106.1810685, 25.28, 0.00, '2026-05-31 09:33:40', 'check_in', '2026-05-31 09:33:40', '2026-05-31 09:33:40'),
(277, 12, 149, NULL, 11.6483513, 104.9074515, 7.61, 0.00, '2026-05-31 10:16:31', 'check_in', '2026-05-31 10:16:31', '2026-05-31 10:16:31'),
(278, 13, 150, NULL, 11.6485068, 104.9074807, 3.54, 0.33, '2026-05-31 10:45:14', 'check_in', '2026-05-31 10:45:14', '2026-05-31 10:45:14'),
(279, 9, 151, NULL, 11.6483987, 104.9074742, 9.75, 0.00, '2026-05-31 11:33:02', 'check_in', '2026-05-31 11:33:03', '2026-05-31 11:33:03'),
(280, 19, 146, NULL, 11.6483699, 104.9074803, 8.26, 0.00, '2026-05-31 17:19:02', 'check_out', '2026-05-31 17:19:03', '2026-05-31 17:19:03'),
(281, 8, 144, NULL, 11.6484035, 104.9074216, 19.38, 0.00, '2026-05-31 17:29:56', 'check_out', '2026-05-31 17:29:57', '2026-05-31 17:29:57'),
(282, 16, 143, NULL, 11.6484046, 104.9074497, 16.72, 0.00, '2026-05-31 17:37:29', 'check_out', '2026-05-31 17:37:30', '2026-05-31 17:37:30'),
(283, 10, 145, NULL, 11.6483387, 104.9074719, 18.97, 0.00, '2026-05-31 19:04:19', 'check_out', '2026-05-31 19:04:20', '2026-05-31 19:04:20'),
(284, 13, 150, NULL, 11.6484390, 104.9074591, 9.88, 0.00, '2026-05-31 19:04:30', 'check_out', '2026-05-31 19:04:31', '2026-05-31 19:04:31'),
(285, 9, 151, NULL, 11.6483987, 104.9074742, 9.75, 0.00, '2026-05-31 19:06:48', 'check_out', '2026-05-31 19:06:48', '2026-05-31 19:06:48'),
(286, 12, 149, NULL, 11.6483513, 104.9074515, 7.61, 0.00, '2026-05-31 19:06:48', 'check_out', '2026-05-31 19:06:49', '2026-05-31 19:06:49'),
(287, 8, 152, NULL, 11.6484015, 104.9074273, 19.27, 0.00, '2026-06-01 08:10:33', 'check_in', '2026-06-01 08:10:33', '2026-06-01 08:10:33'),
(288, 9, 153, NULL, 11.6484327, 104.9074370, 19.99, 0.00, '2026-06-01 08:15:25', 'check_in', '2026-06-01 08:15:25', '2026-06-01 08:15:25'),
(289, 16, 154, NULL, 11.6484426, 104.9074631, 6.62, 0.46, '2026-06-01 08:16:31', 'check_in', '2026-06-01 08:16:31', '2026-06-01 08:16:31'),
(290, 14, 155, NULL, 11.6483914, 104.9074821, 17.44, 0.00, '2026-06-01 08:22:17', 'check_in', '2026-06-01 08:22:18', '2026-06-01 08:22:18'),
(291, 10, 156, NULL, 11.6483397, 104.9074716, 18.92, 0.00, '2026-06-01 08:39:56', 'check_in', '2026-06-01 08:39:56', '2026-06-01 08:39:56'),
(292, 15, 157, NULL, 11.6483341, 104.9074621, 35.00, 0.00, '2026-06-01 08:45:35', 'check_in', '2026-06-01 08:45:36', '2026-06-01 08:45:36'),
(293, 6, 158, NULL, 11.6484241, 104.9074379, 19.67, 0.00, '2026-06-01 08:55:14', 'check_in', '2026-06-01 08:55:15', '2026-06-01 08:55:15'),
(294, 5, 159, NULL, 11.6484067, 104.9074663, 13.01, 0.00, '2026-06-01 08:57:18', 'check_in', '2026-06-01 08:57:18', '2026-06-01 08:57:18'),
(295, 12, 160, NULL, 11.6484063, 104.9074253, 19.92, 0.00, '2026-06-01 09:03:40', 'check_in', '2026-06-01 09:03:41', '2026-06-01 09:03:41'),
(296, 19, 161, NULL, 11.6483886, 104.9074745, 19.95, 0.00, '2026-06-01 09:08:58', 'check_in', '2026-06-01 09:08:58', '2026-06-01 09:08:58'),
(297, 3, 162, NULL, 11.6484062, 104.9074709, 20.00, 0.00, '2026-06-01 09:29:49', 'check_in', '2026-06-01 09:29:49', '2026-06-01 09:29:49'),
(298, 13, 163, NULL, 11.6484157, 104.9074555, 11.55, 0.00, '2026-06-01 10:46:46', 'check_in', '2026-06-01 10:46:46', '2026-06-01 10:46:46'),
(299, 4, 164, NULL, 11.6484281, 104.9074368, 14.00, 0.22, '2026-06-01 11:59:38', 'check_in', '2026-06-01 11:59:39', '2026-06-01 11:59:39'),
(300, 17, 165, NULL, 11.6483495, 104.9074710, 13.82, 0.00, '2026-06-01 12:23:52', 'check_in', '2026-06-01 12:23:53', '2026-06-01 12:23:53'),
(301, 21, 166, NULL, 11.6483846, 104.9074355, 18.18, 0.00, '2026-06-01 12:23:57', 'check_in', '2026-06-01 12:23:58', '2026-06-01 12:23:58'),
(302, 16, 154, NULL, 11.6484108, 104.9074527, 6.79, 0.00, '2026-06-01 17:00:54', 'check_out', '2026-06-01 17:00:54', '2026-06-01 17:00:54'),
(303, 17, 165, NULL, 11.6191093, 104.8871987, 13.93, 0.00, '2026-06-01 17:13:22', 'check_out', '2026-06-01 17:13:23', '2026-06-01 17:13:23'),
(304, 6, 158, NULL, 11.6484165, 104.9074173, 40.00, 0.00, '2026-06-01 17:16:27', 'check_out', '2026-06-01 17:16:28', '2026-06-01 17:16:28'),
(305, 8, 152, NULL, 11.6483899, 104.9074294, 14.59, 0.00, '2026-06-01 17:23:05', 'check_out', '2026-06-01 17:23:05', '2026-06-01 17:23:05'),
(306, 5, 159, NULL, 11.6484067, 104.9074663, 13.01, 0.00, '2026-06-01 17:27:47', 'check_out', '2026-06-01 17:27:48', '2026-06-01 17:27:48'),
(307, 14, 155, NULL, 11.6483914, 104.9074821, 18.36, 0.00, '2026-06-01 17:37:35', 'check_out', '2026-06-01 17:37:37', '2026-06-01 17:37:37'),
(308, 3, 162, NULL, 11.6484074, 104.9074732, 11.30, 0.00, '2026-06-01 17:40:52', 'check_out', '2026-06-01 17:40:52', '2026-06-01 17:40:52'),
(309, 4, 164, NULL, 11.6484003, 104.9074616, 10.67, 0.00, '2026-06-01 17:54:43', 'check_out', '2026-06-01 17:54:44', '2026-06-01 17:54:44'),
(310, 13, 163, NULL, 11.6484157, 104.9074555, 11.55, 0.00, '2026-06-01 19:19:05', 'check_out', '2026-06-01 19:19:06', '2026-06-01 19:19:06'),
(311, 10, 156, NULL, 11.6483463, 104.9074686, 18.30, 0.00, '2026-06-01 19:21:53', 'check_out', '2026-06-01 19:21:54', '2026-06-01 19:21:54'),
(312, 12, 160, NULL, 11.6483513, 104.9074515, 7.61, 0.00, '2026-06-01 20:03:08', 'check_out', '2026-06-01 20:03:09', '2026-06-01 20:03:09'),
(313, 9, 153, NULL, 11.6483987, 104.9074742, 9.75, 0.00, '2026-06-01 20:06:19', 'check_out', '2026-06-01 20:06:19', '2026-06-01 20:06:19'),
(314, 8, 167, NULL, 11.6484082, 104.9074218, 19.98, 0.00, '2026-06-02 08:07:48', 'check_in', '2026-06-02 08:07:49', '2026-06-02 08:07:49'),
(315, 9, 168, NULL, 11.6483987, 104.9074742, 9.75, 0.00, '2026-06-02 08:17:32', 'check_in', '2026-06-02 08:17:32', '2026-06-02 08:17:32'),
(316, 10, 169, NULL, 11.6483483, 104.9074674, 18.26, 0.00, '2026-06-02 08:32:33', 'check_in', '2026-06-02 08:32:34', '2026-06-02 08:32:34'),
(317, 14, 170, NULL, 11.6484471, 104.9074529, 17.53, 0.00, '2026-06-02 08:33:06', 'check_in', '2026-06-02 08:33:07', '2026-06-02 08:33:07'),
(318, 16, 171, NULL, 11.6483990, 104.9074687, 4.75, 0.00, '2026-06-02 08:35:57', 'check_in', '2026-06-02 08:35:57', '2026-06-02 08:35:57'),
(319, 15, 172, NULL, 11.6483562, 104.9074542, 35.00, 0.00, '2026-06-02 08:42:20', 'check_in', '2026-06-02 08:42:21', '2026-06-02 08:42:21'),
(320, 13, 173, NULL, 11.6484157, 104.9074555, 11.55, 0.00, '2026-06-02 08:52:33', 'check_in', '2026-06-02 08:52:34', '2026-06-02 08:52:34'),
(321, 19, 174, NULL, 11.6484184, 104.9074263, 12.91, 1.44, '2026-06-02 08:52:38', 'check_in', '2026-06-02 08:52:39', '2026-06-02 08:52:39'),
(322, 5, 175, NULL, 11.6484083, 104.9074573, 19.28, 0.00, '2026-06-02 08:55:17', 'check_in', '2026-06-02 08:55:18', '2026-06-02 08:55:18'),
(323, 6, 176, NULL, 11.6483792, 104.9074786, 11.54, 0.00, '2026-06-02 09:07:09', 'check_in', '2026-06-02 09:07:10', '2026-06-02 09:07:10'),
(324, 3, 177, NULL, 11.6484227, 104.9074367, 14.00, 0.31, '2026-06-02 09:29:03', 'check_in', '2026-06-02 09:29:04', '2026-06-02 09:29:04'),
(325, 17, 178, NULL, 11.9381894, 104.7147259, 100.00, 0.00, '2026-06-02 11:23:13', 'check_in', '2026-06-02 11:23:13', '2026-06-02 11:23:13'),
(326, 4, 179, NULL, 11.6484003, 104.9074616, 10.67, 0.00, '2026-06-02 12:10:15', 'check_in', '2026-06-02 12:10:16', '2026-06-02 12:10:16'),
(327, 16, 171, NULL, 11.6484092, 104.9074422, 11.97, 0.00, '2026-06-02 17:01:42', 'check_out', '2026-06-02 17:01:43', '2026-06-02 17:01:43'),
(328, 17, 178, NULL, 12.5296300, 104.2201585, 34.02, 0.00, '2026-06-02 17:01:52', 'check_out', '2026-06-02 17:01:53', '2026-06-02 17:01:53'),
(329, 5, 175, NULL, 11.6484012, 104.9074679, 13.01, 0.00, '2026-06-02 17:09:04', 'check_out', '2026-06-02 17:09:04', '2026-06-02 17:09:04'),
(330, 6, 176, NULL, 11.6483987, 104.9074771, 40.00, 0.00, '2026-06-02 17:10:54', 'check_out', '2026-06-02 17:10:55', '2026-06-02 17:10:55'),
(331, 14, 170, NULL, 11.6483802, 104.9074323, 18.19, 0.00, '2026-06-02 17:21:26', 'check_out', '2026-06-02 17:21:27', '2026-06-02 17:21:27'),
(332, 3, 177, NULL, 11.6483894, 104.9074281, 41.35, 0.00, '2026-06-02 17:36:39', 'check_out', '2026-06-02 17:36:39', '2026-06-02 17:36:39'),
(333, 8, 167, NULL, 11.6484100, 104.9074173, 14.21, 0.00, '2026-06-02 17:57:19', 'check_out', '2026-06-02 17:57:20', '2026-06-02 17:57:20'),
(334, 21, 180, NULL, 12.5299635, 104.2202755, 4.63, 0.00, '2026-06-02 18:09:06', 'check_in', '2026-06-02 18:09:06', '2026-06-02 18:09:06'),
(335, 21, 180, NULL, 12.5299635, 104.2202755, 4.63, 0.00, '2026-06-02 18:09:36', 'check_out', '2026-06-02 18:09:36', '2026-06-02 18:09:36'),
(336, 12, 181, NULL, 11.6483513, 104.9074515, 7.61, 0.00, '2026-06-02 18:16:13', 'check_in', '2026-06-02 18:16:13', '2026-06-02 18:16:13'),
(337, 9, 168, NULL, 11.6483987, 104.9074742, 9.75, 0.00, '2026-06-02 18:17:43', 'check_out', '2026-06-02 18:17:43', '2026-06-02 18:17:43'),
(338, 10, 169, NULL, 11.6483520, 104.9074649, 17.72, 0.00, '2026-06-02 18:21:38', 'check_out', '2026-06-02 18:21:39', '2026-06-02 18:21:39'),
(339, 15, 172, NULL, 11.6483474, 104.9074399, 35.00, 0.00, '2026-06-02 18:30:53', 'check_out', '2026-06-02 18:30:53', '2026-06-02 18:30:53'),
(340, 13, 173, NULL, 11.6484157, 104.9074555, 11.55, 0.00, '2026-06-02 20:19:51', 'check_out', '2026-06-02 20:19:52', '2026-06-02 20:19:52'),
(341, 10, 182, NULL, 11.6483546, 104.9074632, 18.48, 0.00, '2026-06-03 08:16:50', 'check_in', '2026-06-03 08:16:50', '2026-06-03 08:16:50'),
(342, 8, 183, NULL, 11.6484195, 104.9074338, 19.99, 0.00, '2026-06-03 08:20:43', 'check_in', '2026-06-03 08:20:43', '2026-06-03 08:20:43'),
(343, 9, 184, NULL, 11.6484021, 104.9074708, 8.97, 0.00, '2026-06-03 08:21:54', 'check_in', '2026-06-03 08:21:55', '2026-06-03 08:21:55'),
(344, 16, 185, NULL, 11.6484213, 104.9074385, 15.84, 0.00, '2026-06-03 08:27:31', 'check_in', '2026-06-03 08:27:31', '2026-06-03 08:27:31'),
(345, 13, 186, NULL, 11.6483742, 104.9074471, 9.74, 0.00, '2026-06-03 08:42:04', 'check_in', '2026-06-03 08:42:04', '2026-06-03 08:42:04'),
(346, 15, 187, NULL, 11.6483474, 104.9074399, 35.00, 0.00, '2026-06-03 08:43:07', 'check_in', '2026-06-03 08:43:07', '2026-06-03 08:43:07'),
(347, 14, 188, NULL, 11.6483964, 104.9074830, 18.81, 0.00, '2026-06-03 08:50:47', 'check_in', '2026-06-03 08:50:47', '2026-06-03 08:50:47'),
(348, 5, 189, NULL, 11.6484012, 104.9074679, 13.01, 0.00, '2026-06-03 08:57:22', 'check_in', '2026-06-03 08:57:23', '2026-06-03 08:57:23'),
(349, 19, 190, NULL, 11.6483946, 104.9074638, 19.88, 0.00, '2026-06-03 08:59:24', 'check_in', '2026-06-03 08:59:25', '2026-06-03 08:59:25'),
(350, 12, 191, NULL, 11.6483513, 104.9074515, 7.61, 0.00, '2026-06-03 09:02:37', 'check_in', '2026-06-03 09:02:38', '2026-06-03 09:02:38'),
(351, 6, 192, NULL, 11.6483792, 104.9074786, 11.54, 0.00, '2026-06-03 09:22:37', 'check_in', '2026-06-03 09:22:37', '2026-06-03 09:22:37'),
(352, 3, 193, NULL, 11.6483832, 104.9074725, 56.13, 0.00, '2026-06-03 09:27:14', 'check_in', '2026-06-03 09:27:14', '2026-06-03 09:27:14'),
(353, 4, 194, NULL, 11.6484119, 104.9074471, 19.85, 0.00, '2026-06-03 11:26:38', 'check_in', '2026-06-03 11:26:38', '2026-06-03 11:26:38'),
(354, 17, 195, NULL, 12.5004799, 104.4546260, 18.98, 0.00, '2026-06-03 11:30:50', 'check_in', '2026-06-03 11:30:50', '2026-06-03 11:30:50'),
(355, 21, 196, NULL, 12.5004067, 104.4545877, 3.10, 2.26, '2026-06-03 11:38:44', 'check_in', '2026-06-03 11:38:45', '2026-06-03 11:38:45'),
(356, 16, 185, NULL, 11.6484112, 104.9074398, 10.14, 0.00, '2026-06-03 17:02:51', 'check_out', '2026-06-03 17:02:52', '2026-06-03 17:02:52'),
(357, 6, 192, NULL, 11.6484287, 104.9074524, 40.00, 0.00, '2026-06-03 17:04:33', 'check_out', '2026-06-03 17:04:33', '2026-06-03 17:04:33'),
(358, 8, 183, NULL, 11.6484182, 104.9074370, 20.14, 0.00, '2026-06-03 17:05:47', 'check_out', '2026-06-03 17:05:48', '2026-06-03 17:05:48'),
(359, 5, 189, NULL, 11.6484068, 104.9074699, 12.87, 0.00, '2026-06-03 17:06:25', 'check_out', '2026-06-03 17:06:26', '2026-06-03 17:06:26'),
(360, 10, 182, NULL, 11.6483694, 104.9074532, 18.72, 0.00, '2026-06-03 17:09:28', 'check_out', '2026-06-03 17:09:29', '2026-06-03 17:09:29');
INSERT INTO `gps_locations` (`id`, `employee_id`, `attendance_id`, `customer_visit_id`, `latitude`, `longitude`, `accuracy`, `speed`, `recorded_at`, `source`, `created_at`, `updated_at`) VALUES
(361, 19, 190, NULL, 11.6483959, 104.9074659, 3.66, 0.00, '2026-06-03 17:13:25', 'check_out', '2026-06-03 17:13:26', '2026-06-03 17:13:26'),
(362, 3, 193, NULL, 11.6484072, 104.9074706, 19.98, 0.00, '2026-06-03 17:24:27', 'check_out', '2026-06-03 17:24:28', '2026-06-03 17:24:28'),
(363, 14, 188, NULL, 11.6483886, 104.9074887, 18.10, 0.00, '2026-06-03 17:59:56', 'check_out', '2026-06-03 17:59:57', '2026-06-03 17:59:57'),
(364, 15, 187, NULL, 11.6483453, 104.9074412, 35.00, 0.00, '2026-06-03 17:59:57', 'check_out', '2026-06-03 17:59:57', '2026-06-03 17:59:57'),
(365, 9, 184, NULL, 11.6484021, 104.9074708, 8.97, 0.00, '2026-06-03 18:45:09', 'check_out', '2026-06-03 18:45:10', '2026-06-03 18:45:10'),
(366, 13, 186, NULL, 11.6484378, 104.9074557, 6.53, 0.00, '2026-06-03 18:45:50', 'check_out', '2026-06-03 18:45:51', '2026-06-03 18:45:51'),
(367, 12, 191, NULL, 11.6483513, 104.9074515, 7.61, 0.00, '2026-06-03 18:47:22', 'check_out', '2026-06-03 18:47:23', '2026-06-03 18:47:23'),
(368, 21, 196, NULL, 12.2893854, 104.1747159, 17.50, 0.00, '2026-06-03 21:36:29', 'check_out', '2026-06-03 21:36:30', '2026-06-03 21:36:30'),
(369, 9, 197, NULL, 11.6484418, 104.9074448, 19.99, 0.00, '2026-06-04 08:19:59', 'check_in', '2026-06-04 08:20:00', '2026-06-04 08:20:00'),
(370, 16, 198, NULL, 11.6484192, 104.9074357, 16.70, 0.00, '2026-06-04 08:20:10', 'check_in', '2026-06-04 08:20:10', '2026-06-04 08:20:10'),
(371, 8, 199, NULL, 11.6483727, 104.9074561, 12.49, 0.00, '2026-06-04 08:22:34', 'check_in', '2026-06-04 08:22:35', '2026-06-04 08:22:35'),
(372, 10, 200, NULL, 11.6485292, 104.9074674, 18.64, 0.00, '2026-06-04 08:27:06', 'check_in', '2026-06-04 08:27:06', '2026-06-04 08:27:06'),
(373, 14, 201, NULL, 11.6484449, 104.9074537, 17.69, 0.00, '2026-06-04 08:41:49', 'check_in', '2026-06-04 08:41:50', '2026-06-04 08:41:50'),
(374, 19, 202, NULL, 11.6484011, 104.9074492, 5.04, 0.02, '2026-06-04 08:54:52', 'check_in', '2026-06-04 08:54:53', '2026-06-04 08:54:53'),
(375, 5, 203, NULL, 11.6484060, 104.9074702, 13.64, 0.00, '2026-06-04 08:55:19', 'check_in', '2026-06-04 08:55:20', '2026-06-04 08:55:20'),
(376, 6, 204, NULL, 11.6483786, 104.9075079, 19.84, 0.00, '2026-06-04 08:55:45', 'check_in', '2026-06-04 08:55:46', '2026-06-04 08:55:46'),
(377, 13, 205, NULL, 11.6484352, 104.9074627, 6.35, 0.00, '2026-06-04 08:56:03', 'check_in', '2026-06-04 08:56:03', '2026-06-04 08:56:03'),
(378, 15, 206, NULL, 11.6483416, 104.9074413, 35.00, 0.00, '2026-06-04 09:00:27', 'check_in', '2026-06-04 09:00:28', '2026-06-04 09:00:28'),
(379, 12, 207, NULL, 11.6483507, 104.9074493, 7.20, 0.00, '2026-06-04 09:17:36', 'check_in', '2026-06-04 09:17:36', '2026-06-04 09:17:36'),
(380, 3, 208, NULL, 11.6484115, 104.9074824, 17.65, 0.00, '2026-06-04 09:27:32', 'check_in', '2026-06-04 09:27:33', '2026-06-04 09:27:33'),
(381, 21, 209, NULL, 12.5296441, 104.2203815, 10.45, 0.00, '2026-06-04 09:35:30', 'check_in', '2026-06-04 09:35:30', '2026-06-04 09:35:30'),
(382, 17, 210, NULL, 12.5291233, 104.1718500, 2.20, 0.05, '2026-06-04 10:46:50', 'check_in', '2026-06-04 10:46:50', '2026-06-04 10:46:50'),
(383, 19, 202, NULL, 11.6483738, 104.9074789, 7.61, 0.00, '2026-06-04 17:12:51', 'check_out', '2026-06-04 17:12:51', '2026-06-04 17:12:51'),
(384, 8, 199, NULL, 11.6484049, 104.9074440, 17.83, 0.00, '2026-06-04 17:23:44', 'check_out', '2026-06-04 17:23:44', '2026-06-04 17:23:44'),
(385, 6, 204, NULL, 11.6483792, 104.9074786, 11.54, 0.00, '2026-06-04 17:40:09', 'check_out', '2026-06-04 17:40:10', '2026-06-04 17:40:10'),
(386, 5, 203, NULL, 11.6484060, 104.9074702, 13.64, 0.00, '2026-06-04 17:44:01', 'check_out', '2026-06-04 17:44:01', '2026-06-04 17:44:01'),
(387, 3, 208, NULL, 11.6484053, 104.9074719, 11.94, 0.00, '2026-06-04 17:44:41', 'check_out', '2026-06-04 17:44:42', '2026-06-04 17:44:42'),
(388, 14, 201, NULL, 11.6483893, 104.9074895, 18.67, 0.00, '2026-06-04 17:55:17', 'check_out', '2026-06-04 17:55:18', '2026-06-04 17:55:18'),
(389, 21, 209, NULL, 12.3260818, 104.1723231, 74.49, 0.00, '2026-06-04 18:38:20', 'check_out', '2026-06-04 18:38:21', '2026-06-04 18:38:21'),
(390, 10, 200, NULL, 11.6485288, 104.9074676, 18.64, 0.00, '2026-06-04 18:48:57', 'check_out', '2026-06-04 18:48:57', '2026-06-04 18:48:57'),
(391, 12, 207, NULL, 11.6483507, 104.9074493, 7.20, 0.00, '2026-06-04 18:49:25', 'check_out', '2026-06-04 18:49:25', '2026-06-04 18:49:25'),
(392, 9, 197, NULL, 11.6484021, 104.9074708, 8.97, 0.00, '2026-06-04 18:51:15', 'check_out', '2026-06-04 18:51:17', '2026-06-04 18:51:17'),
(393, 13, 205, NULL, 11.6484157, 104.9074555, 11.55, 0.00, '2026-06-04 18:51:48', 'check_out', '2026-06-04 18:51:48', '2026-06-04 18:51:48'),
(394, 8, 211, NULL, 11.6483651, 104.9074207, 14.00, 0.00, '2026-06-05 08:17:51', 'check_in', '2026-06-05 08:17:51', '2026-06-05 08:17:51'),
(395, 9, 212, NULL, 11.6483817, 104.9074189, 14.00, 0.35, '2026-06-05 08:19:54', 'check_in', '2026-06-05 08:19:55', '2026-06-05 08:19:55'),
(396, 10, 213, NULL, 11.6483738, 104.9074497, 19.70, 0.00, '2026-06-05 08:25:55', 'check_in', '2026-06-05 08:25:56', '2026-06-05 08:25:56'),
(397, 14, 214, NULL, 11.6483897, 104.9074897, 16.78, 0.00, '2026-06-05 08:33:20', 'check_in', '2026-06-05 08:33:20', '2026-06-05 08:33:20'),
(398, 16, 215, NULL, 11.6484277, 104.9074850, 7.44, 0.14, '2026-06-05 08:36:26', 'check_in', '2026-06-05 08:36:26', '2026-06-05 08:36:26'),
(399, 6, 216, NULL, 11.6484129, 104.9074692, 40.00, 0.00, '2026-06-05 08:40:08', 'check_in', '2026-06-05 08:40:09', '2026-06-05 08:40:09'),
(400, 17, 217, NULL, 12.5338700, 104.2035367, 2.90, 0.39, '2026-06-05 08:40:41', 'check_in', '2026-06-05 08:40:42', '2026-06-05 08:40:42'),
(401, 15, 218, NULL, 11.6483510, 104.9074313, 35.00, 0.00, '2026-06-05 08:44:26', 'check_in', '2026-06-05 08:44:26', '2026-06-05 08:44:26'),
(402, 12, 219, NULL, 11.6483507, 104.9074493, 7.20, 0.00, '2026-06-05 08:45:13', 'check_in', '2026-06-05 08:45:13', '2026-06-05 08:45:13'),
(403, 5, 220, NULL, 11.6484070, 104.9074598, 16.80, 0.00, '2026-06-05 08:53:53', 'check_in', '2026-06-05 08:53:54', '2026-06-05 08:53:54'),
(404, 13, 221, NULL, 11.6484157, 104.9074555, 11.55, 0.00, '2026-06-05 08:59:03', 'check_in', '2026-06-05 08:59:03', '2026-06-05 08:59:03'),
(405, 21, 222, NULL, 12.5292039, 104.1718917, 11.24, 0.00, '2026-06-05 09:04:41', 'check_in', '2026-06-05 09:04:42', '2026-06-05 09:04:42'),
(406, 3, 223, NULL, 11.6484565, 104.9074440, 11.71, 0.24, '2026-06-05 09:27:58', 'check_in', '2026-06-05 09:27:58', '2026-06-05 09:27:58'),
(407, 4, 224, NULL, 11.6484057, 104.9074465, 9.43, 0.00, '2026-06-05 11:46:59', 'check_in', '2026-06-05 11:47:00', '2026-06-05 11:47:00'),
(408, 16, 215, NULL, 11.6484118, 104.9074251, 7.53, 0.00, '2026-06-05 17:04:57', 'check_out', '2026-06-05 17:04:58', '2026-06-05 17:04:58'),
(409, 5, 220, NULL, 11.6484057, 104.9074697, 13.42, 0.00, '2026-06-05 17:13:43', 'check_out', '2026-06-05 17:13:44', '2026-06-05 17:13:44'),
(410, 6, 216, NULL, 11.6483985, 104.9074996, 35.00, 0.00, '2026-06-05 17:21:16', 'check_out', '2026-06-05 17:21:17', '2026-06-05 17:21:17'),
(411, 3, 223, NULL, 11.6484017, 104.9074681, 19.85, 0.00, '2026-06-05 17:29:52', 'check_out', '2026-06-05 17:29:52', '2026-06-05 17:29:52'),
(412, 14, 214, NULL, 11.6483897, 104.9074897, 17.38, 0.00, '2026-06-05 17:38:16', 'check_out', '2026-06-05 17:38:17', '2026-06-05 17:38:17'),
(413, 9, 212, NULL, 11.6484021, 104.9074708, 8.97, 0.00, '2026-06-05 17:52:22', 'check_out', '2026-06-05 17:52:22', '2026-06-05 17:52:22'),
(414, 10, 213, NULL, 11.6483751, 104.9074499, 19.71, 0.00, '2026-06-05 17:55:31', 'check_out', '2026-06-05 17:55:31', '2026-06-05 17:55:31'),
(415, 12, 219, NULL, 11.6483507, 104.9074493, 7.20, 0.00, '2026-06-05 18:08:09', 'check_out', '2026-06-05 18:08:10', '2026-06-05 18:08:10'),
(416, 8, 211, NULL, 11.6484097, 104.9074268, 19.92, 0.00, '2026-06-05 18:08:33', 'check_out', '2026-06-05 18:08:33', '2026-06-05 18:08:33'),
(417, 15, 218, NULL, 11.6482958, 104.9074343, 35.00, 0.00, '2026-06-05 18:18:49', 'check_out', '2026-06-05 18:18:50', '2026-06-05 18:18:50'),
(418, 21, 222, NULL, 12.4917501, 104.1830902, 6.79, 18.12, '2026-06-05 19:47:33', 'check_out', '2026-06-05 19:47:34', '2026-06-05 19:47:34'),
(419, 8, 225, NULL, 11.6484105, 104.9074324, 19.75, 0.00, '2026-06-06 08:19:45', 'check_in', '2026-06-06 08:19:46', '2026-06-06 08:19:46'),
(420, 16, 226, NULL, 11.6484179, 104.9074253, 25.31, 0.00, '2026-06-06 08:22:12', 'check_in', '2026-06-06 08:22:13', '2026-06-06 08:22:13'),
(421, 9, 227, NULL, 11.6484030, 104.9074687, 8.74, 0.00, '2026-06-06 08:23:35', 'check_in', '2026-06-06 08:23:35', '2026-06-06 08:23:35'),
(422, 14, 228, NULL, 11.6483907, 104.9074887, 19.94, 0.00, '2026-06-06 08:30:45', 'check_in', '2026-06-06 08:30:46', '2026-06-06 08:30:46'),
(423, 5, 229, NULL, 11.6484057, 104.9074697, 13.42, 0.00, '2026-06-06 08:31:09', 'check_in', '2026-06-06 08:31:09', '2026-06-06 08:31:09'),
(424, 10, 230, NULL, 11.6483848, 104.9074295, 20.91, 0.00, '2026-06-06 08:48:32', 'check_in', '2026-06-06 08:48:32', '2026-06-06 08:48:32'),
(425, 15, 231, NULL, 11.6482958, 104.9074343, 35.00, 0.00, '2026-06-06 09:00:22', 'check_in', '2026-06-06 09:00:23', '2026-06-06 09:00:23'),
(426, 4, 232, NULL, 11.6484780, 104.9074336, 5.68, 0.00, '2026-06-06 09:03:56', 'check_in', '2026-06-06 09:03:57', '2026-06-06 09:03:57'),
(427, 13, 233, NULL, 11.6484268, 104.9074177, 14.00, 0.00, '2026-06-06 09:09:02', 'check_in', '2026-06-06 09:09:02', '2026-06-06 09:09:02'),
(428, 12, 234, NULL, 11.6483902, 104.9074835, 19.90, 0.00, '2026-06-06 09:09:54', 'check_in', '2026-06-06 09:09:55', '2026-06-06 09:09:55'),
(429, 3, 235, NULL, 11.6484009, 104.9074712, 19.98, 0.00, '2026-06-06 09:34:39', 'check_in', '2026-06-06 09:34:40', '2026-06-06 09:34:40'),
(430, 21, 236, NULL, 12.5331199, 104.2067231, 40.00, 0.00, '2026-06-06 10:04:42', 'check_in', '2026-06-06 10:04:43', '2026-06-06 10:04:43'),
(431, 17, 237, NULL, 12.5848703, 103.9566674, 31.85, 0.00, '2026-06-06 11:04:54', 'check_in', '2026-06-06 11:04:55', '2026-06-06 11:04:55'),
(432, 16, 226, NULL, 11.6483860, 104.9074456, 7.11, 0.00, '2026-06-06 17:00:31', 'check_out', '2026-06-06 17:00:32', '2026-06-06 17:00:32'),
(433, 5, 229, NULL, 11.6483964, 104.9074579, 7.92, 0.00, '2026-06-06 17:08:44', 'check_out', '2026-06-06 17:08:45', '2026-06-06 17:08:45'),
(434, 3, 235, NULL, 11.6483999, 104.9074692, 13.09, 0.00, '2026-06-06 17:14:49', 'check_out', '2026-06-06 17:14:49', '2026-06-06 17:14:49'),
(435, 8, 225, NULL, 11.6484037, 104.9074367, 14.66, 0.00, '2026-06-06 17:19:21', 'check_out', '2026-06-06 17:19:22', '2026-06-06 17:19:22'),
(436, 14, 228, NULL, 11.6483762, 104.9074863, 18.41, 0.00, '2026-06-06 17:55:17', 'check_out', '2026-06-06 17:55:17', '2026-06-06 17:55:17'),
(437, 10, 230, NULL, 11.6484097, 104.9074618, 18.03, 0.00, '2026-06-06 18:33:43', 'check_out', '2026-06-06 18:33:44', '2026-06-06 18:33:44'),
(438, 13, 233, NULL, 11.6484157, 104.9074555, 11.55, 0.00, '2026-06-06 18:52:55', 'check_out', '2026-06-06 18:52:56', '2026-06-06 18:52:56'),
(439, 9, 227, NULL, 11.6484038, 104.9074681, 8.64, 0.00, '2026-06-06 18:54:46', 'check_out', '2026-06-06 18:54:46', '2026-06-06 18:54:46'),
(440, 12, 234, NULL, 11.6483507, 104.9074493, 7.20, 0.00, '2026-06-06 18:54:49', 'check_out', '2026-06-06 18:54:49', '2026-06-06 18:54:49'),
(441, 15, 231, NULL, 11.6482978, 104.9074304, 35.00, 0.00, '2026-06-06 18:55:13', 'check_out', '2026-06-06 18:55:13', '2026-06-06 18:55:13'),
(442, 21, 236, NULL, 12.5309792, 104.2210464, 28.60, 0.00, '2026-06-06 19:19:03', 'check_out', '2026-06-06 19:19:03', '2026-06-06 19:19:03'),
(443, 17, 238, NULL, 12.5296045, 104.2201251, 43.63, 0.89, '2026-06-07 07:39:09', 'check_in', '2026-06-07 07:39:09', '2026-06-07 07:39:09'),
(444, 8, 239, NULL, 11.6484715, 104.9074524, 4.75, 0.17, '2026-06-07 08:21:42', 'check_in', '2026-06-07 08:21:43', '2026-06-07 08:21:43'),
(445, 16, 240, NULL, 11.6484420, 104.9072688, 10.52, 4.89, '2026-06-07 08:31:56', 'check_in', '2026-06-07 08:31:57', '2026-06-07 08:31:57'),
(446, 9, 241, NULL, 11.6484258, 104.9074449, 6.71, 0.00, '2026-06-07 09:20:29', 'check_in', '2026-06-07 09:20:30', '2026-06-07 09:20:30'),
(447, 21, 242, NULL, 12.5290124, 104.1682775, 5.95, 15.43, '2026-06-07 09:48:46', 'check_in', '2026-06-07 09:48:47', '2026-06-07 09:48:47'),
(448, 19, 243, NULL, 11.6484197, 104.9074511, 14.00, 0.76, '2026-06-07 10:59:23', 'check_in', '2026-06-07 10:59:24', '2026-06-07 10:59:24'),
(449, 13, 244, NULL, 11.6484157, 104.9074555, 11.55, 0.00, '2026-06-07 11:05:43', 'check_in', '2026-06-07 11:05:43', '2026-06-07 11:05:43'),
(450, 16, 240, NULL, 11.6484043, 104.9074357, 5.81, 0.00, '2026-06-07 17:00:35', 'check_out', '2026-06-07 17:00:35', '2026-06-07 17:00:35'),
(451, 19, 243, NULL, 11.6483726, 104.9074783, 7.63, 0.00, '2026-06-07 17:01:21', 'check_out', '2026-06-07 17:01:22', '2026-06-07 17:01:22'),
(452, 8, 239, NULL, 11.6484230, 104.9074401, 12.45, 1.60, '2026-06-07 17:03:11', 'check_out', '2026-06-07 17:03:12', '2026-06-07 17:03:12'),
(453, 13, 244, NULL, 11.6484157, 104.9074555, 11.55, 0.00, '2026-06-07 17:17:53', 'check_out', '2026-06-07 17:17:54', '2026-06-07 17:17:54'),
(454, 9, 241, NULL, 11.6484038, 104.9074681, 8.64, 0.00, '2026-06-07 17:18:18', 'check_out', '2026-06-07 17:18:19', '2026-06-07 17:18:19'),
(455, 21, 242, NULL, 12.9003598, 103.3692781, 18.97, 0.00, '2026-06-07 18:39:26', 'check_out', '2026-06-07 18:39:26', '2026-06-07 18:39:26'),
(456, 16, 245, NULL, 11.6484416, 104.9074802, 6.00, 0.81, '2026-06-08 08:00:41', 'check_in', '2026-06-08 08:00:42', '2026-06-08 08:00:42'),
(457, 8, 246, NULL, 11.6484296, 104.9074503, 14.63, 0.00, '2026-06-08 08:28:00', 'check_in', '2026-06-08 08:28:00', '2026-06-08 08:28:00'),
(458, 21, 247, NULL, 12.9124019, 103.3646921, 53.12, 0.00, '2026-06-08 08:29:49', 'check_in', '2026-06-08 08:29:49', '2026-06-08 08:29:49'),
(459, 9, 248, NULL, 11.6484038, 104.9074681, 8.64, 0.00, '2026-06-08 08:35:15', 'check_in', '2026-06-08 08:35:16', '2026-06-08 08:35:16'),
(460, 5, 249, NULL, 11.6483960, 104.9074600, 17.70, 0.00, '2026-06-08 08:39:12', 'check_in', '2026-06-08 08:39:12', '2026-06-08 08:39:12'),
(461, 14, 250, NULL, 11.6483762, 104.9074862, 19.09, 0.00, '2026-06-08 08:41:01', 'check_in', '2026-06-08 08:41:02', '2026-06-08 08:41:02'),
(462, 12, 251, NULL, 11.6483484, 104.9074483, 7.03, 0.00, '2026-06-08 08:51:42', 'check_in', '2026-06-08 08:51:42', '2026-06-08 08:51:42'),
(463, 15, 252, NULL, 11.6483662, 104.9074134, 35.00, 0.00, '2026-06-08 08:57:01', 'check_in', '2026-06-08 08:57:01', '2026-06-08 08:57:01'),
(464, 13, 253, NULL, 11.6484175, 104.9074186, 3.54, 0.00, '2026-06-08 09:02:08', 'check_in', '2026-06-08 09:02:09', '2026-06-08 09:02:09'),
(465, 19, 254, NULL, 11.6484044, 104.9074528, 19.83, 0.00, '2026-06-08 09:07:52', 'check_in', '2026-06-08 09:07:53', '2026-06-08 09:07:53'),
(466, 6, 255, NULL, 11.6483696, 104.9075509, 19.88, 0.00, '2026-06-08 09:14:30', 'check_in', '2026-06-08 09:14:30', '2026-06-08 09:14:30'),
(467, 3, 256, NULL, 11.6483999, 104.9074685, 11.85, 0.00, '2026-06-08 09:33:05', 'check_in', '2026-06-08 09:33:05', '2026-06-08 09:33:05'),
(468, 4, 257, NULL, 11.6484343, 104.9074408, 15.89, 0.00, '2026-06-08 11:31:53', 'check_in', '2026-06-08 11:31:54', '2026-06-08 11:31:54'),
(469, 17, 258, NULL, 13.1013801, 103.1628435, 92.90, 0.00, '2026-06-08 14:22:52', 'check_in', '2026-06-08 14:22:52', '2026-06-08 14:22:52'),
(470, 16, 245, NULL, 11.6483916, 104.9074411, 10.30, 0.00, '2026-06-08 17:06:43', 'check_out', '2026-06-08 17:06:44', '2026-06-08 17:06:44'),
(471, 9, 248, NULL, 11.6484038, 104.9074681, 8.64, 0.00, '2026-06-08 17:08:27', 'check_out', '2026-06-08 17:08:28', '2026-06-08 17:08:28'),
(472, 8, 246, NULL, 11.6484167, 104.9074350, 16.38, 0.00, '2026-06-08 17:09:08', 'check_out', '2026-06-08 17:09:09', '2026-06-08 17:09:09'),
(473, 5, 249, NULL, 11.6484020, 104.9074580, 8.12, 0.00, '2026-06-08 17:13:24', 'check_out', '2026-06-08 17:13:24', '2026-06-08 17:13:24'),
(474, 6, 255, NULL, 11.6483792, 104.9074786, 11.54, 0.00, '2026-06-08 17:19:07', 'check_out', '2026-06-08 17:19:08', '2026-06-08 17:19:08'),
(475, 3, 256, NULL, 11.6483978, 104.9074668, 21.43, 0.00, '2026-06-08 17:27:21', 'check_out', '2026-06-08 17:27:21', '2026-06-08 17:27:21'),
(476, 4, 257, NULL, 11.6484014, 104.9074589, 9.79, 0.00, '2026-06-08 17:27:39', 'check_out', '2026-06-08 17:27:39', '2026-06-08 17:27:39'),
(477, 21, 247, NULL, 13.1014045, 103.1629001, 45.14, 0.00, '2026-06-08 17:32:43', 'check_out', '2026-06-08 17:32:44', '2026-06-08 17:32:44'),
(478, 15, 252, NULL, 11.6483100, 104.9074173, 35.00, 0.00, '2026-06-08 17:42:48', 'check_out', '2026-06-08 17:42:48', '2026-06-08 17:42:48'),
(479, 14, 250, NULL, 11.6483760, 104.9074865, 18.42, 0.00, '2026-06-08 17:43:53', 'check_out', '2026-06-08 17:43:53', '2026-06-08 17:43:53'),
(480, 13, 253, NULL, 11.6484157, 104.9074555, 11.55, 0.00, '2026-06-08 19:26:16', 'check_out', '2026-06-08 19:26:17', '2026-06-08 19:26:17'),
(481, 12, 251, NULL, 11.6483484, 104.9074483, 7.03, 0.00, '2026-06-08 19:27:28', 'check_out', '2026-06-08 19:27:29', '2026-06-08 19:27:29'),
(482, 8, 259, NULL, 11.6484242, 104.9074491, 4.75, 0.05, '2026-06-09 08:20:58', 'check_in', '2026-06-09 08:20:58', '2026-06-09 08:20:58'),
(483, 9, 260, NULL, 11.6484056, 104.9074416, 19.99, 0.00, '2026-06-09 08:29:48', 'check_in', '2026-06-09 08:29:49', '2026-06-09 08:29:49'),
(484, 16, 261, NULL, 11.6484178, 104.9074329, 13.43, 0.00, '2026-06-09 08:32:17', 'check_in', '2026-06-09 08:32:18', '2026-06-09 08:32:18'),
(485, 15, 262, NULL, 11.6483980, 104.9074494, 35.00, 0.00, '2026-06-09 08:44:34', 'check_in', '2026-06-09 08:44:34', '2026-06-09 08:44:34'),
(486, 19, 263, NULL, 11.6483782, 104.9075181, 5.60, 0.83, '2026-06-09 08:53:12', 'check_in', '2026-06-09 08:53:12', '2026-06-09 08:53:12'),
(487, 13, 264, NULL, 11.6484517, 104.9074953, 3.54, 1.42, '2026-06-09 08:55:44', 'check_in', '2026-06-09 08:55:45', '2026-06-09 08:55:45'),
(488, 5, 265, NULL, 11.6484018, 104.9074581, 19.92, 0.00, '2026-06-09 08:59:18', 'check_in', '2026-06-09 08:59:19', '2026-06-09 08:59:19'),
(489, 6, 266, NULL, 11.6483968, 104.9074808, 11.53, 0.00, '2026-06-09 08:59:25', 'check_in', '2026-06-09 08:59:26', '2026-06-09 08:59:26'),
(490, 12, 267, NULL, 11.6483749, 104.9074483, 19.97, 0.00, '2026-06-09 09:00:58', 'check_in', '2026-06-09 09:00:59', '2026-06-09 09:00:59'),
(491, 14, 268, NULL, 11.6483761, 104.9074866, 11.10, 0.00, '2026-06-09 09:14:00', 'check_in', '2026-06-09 09:14:01', '2026-06-09 09:14:01'),
(492, 3, 269, NULL, 11.6484071, 104.9074549, 2.90, 0.00, '2026-06-09 09:19:39', 'check_in', '2026-06-09 09:19:40', '2026-06-09 09:19:40'),
(493, 21, 270, NULL, 13.1014087, 103.1629031, 74.76, 0.00, '2026-06-09 10:02:24', 'check_in', '2026-06-09 10:02:24', '2026-06-09 10:02:24'),
(494, 17, 271, NULL, 13.1005766, 103.1625855, 6.30, 0.07, '2026-06-09 10:39:10', 'check_in', '2026-06-09 10:39:10', '2026-06-09 10:39:10'),
(495, 4, 272, NULL, 11.6484649, 104.9075363, 30.30, 0.00, '2026-06-09 11:22:53', 'check_in', '2026-06-09 11:22:53', '2026-06-09 11:22:53'),
(496, 16, 261, NULL, 11.6484015, 104.9074427, 5.88, 0.00, '2026-06-09 17:01:19', 'check_out', '2026-06-09 17:01:19', '2026-06-09 17:01:19'),
(497, 19, 263, NULL, 11.6483726, 104.9074783, 7.63, 0.00, '2026-06-09 17:06:42', 'check_out', '2026-06-09 17:06:42', '2026-06-09 17:06:42'),
(498, 8, 259, NULL, 11.6483999, 104.9074235, 15.86, 0.00, '2026-06-09 17:07:29', 'check_out', '2026-06-09 17:07:30', '2026-06-09 17:07:30'),
(499, 4, 272, NULL, 11.6484014, 104.9074589, 9.79, 0.00, '2026-06-09 17:25:18', 'check_out', '2026-06-09 17:25:19', '2026-06-09 17:25:19'),
(500, 6, 266, NULL, 11.6483968, 104.9074808, 11.53, 0.00, '2026-06-09 17:27:56', 'check_out', '2026-06-09 17:27:56', '2026-06-09 17:27:56'),
(501, 5, 265, NULL, 11.6484041, 104.9074697, 13.82, 0.00, '2026-06-09 17:43:08', 'check_out', '2026-06-09 17:43:08', '2026-06-09 17:43:08'),
(502, 3, 269, NULL, 11.6484037, 104.9074634, 16.67, 0.00, '2026-06-09 17:46:26', 'check_out', '2026-06-09 17:46:27', '2026-06-09 17:46:27'),
(503, 14, 268, NULL, 11.6483759, 104.9074867, 19.13, 0.00, '2026-06-09 18:24:30', 'check_out', '2026-06-09 18:24:30', '2026-06-09 18:24:30'),
(504, 15, 262, NULL, 11.6483542, 104.9074238, 35.00, 0.00, '2026-06-09 18:25:00', 'check_out', '2026-06-09 18:25:00', '2026-06-09 18:25:00'),
(505, 9, 260, NULL, 11.6484038, 104.9074681, 8.64, 0.00, '2026-06-09 19:32:30', 'check_out', '2026-06-09 19:32:31', '2026-06-09 19:32:31'),
(506, 13, 264, NULL, 11.6484157, 104.9074555, 11.55, 0.00, '2026-06-09 19:35:36', 'check_out', '2026-06-09 19:35:37', '2026-06-09 19:35:37'),
(507, 12, 267, NULL, 11.6483492, 104.9074488, 7.00, 0.00, '2026-06-09 19:36:07', 'check_out', '2026-06-09 19:36:07', '2026-06-09 19:36:07'),
(508, 21, 270, NULL, 13.1014038, 103.1628991, 32.65, 0.00, '2026-06-09 19:47:57', 'check_out', '2026-06-09 19:47:58', '2026-06-09 19:47:58'),
(509, 9, 273, NULL, 11.6484036, 104.9074677, 8.51, 0.00, '2026-06-10 08:14:42', 'check_in', '2026-06-10 08:14:43', '2026-06-10 08:14:43'),
(510, 8, 274, NULL, 11.6483812, 104.9074607, 19.30, 0.00, '2026-06-10 08:23:50', 'check_in', '2026-06-10 08:23:51', '2026-06-10 08:23:51'),
(511, 15, 275, NULL, 11.6484021, 104.9074596, 35.00, 0.00, '2026-06-10 08:45:41', 'check_in', '2026-06-10 08:45:42', '2026-06-10 08:45:42'),
(512, 12, 276, NULL, 11.6482917, 104.9074894, 19.96, 0.00, '2026-06-10 08:48:29', 'check_in', '2026-06-10 08:48:30', '2026-06-10 08:48:30'),
(513, 13, 277, NULL, 11.6483696, 104.9074658, 14.00, 1.04, '2026-06-10 08:49:27', 'check_in', '2026-06-10 08:49:27', '2026-06-10 08:49:27'),
(514, 19, 278, NULL, 11.6484165, 104.9074480, 4.43, 0.23, '2026-06-10 08:55:42', 'check_in', '2026-06-10 08:55:43', '2026-06-10 08:55:43'),
(515, 5, 279, NULL, 11.6484044, 104.9074291, 19.97, 0.00, '2026-06-10 08:58:28', 'check_in', '2026-06-10 08:58:29', '2026-06-10 08:58:29'),
(516, 6, 280, NULL, 11.6484293, 104.9074225, 20.00, 0.00, '2026-06-10 08:59:29', 'check_in', '2026-06-10 08:59:30', '2026-06-10 08:59:30'),
(517, 3, 281, NULL, 11.6484090, 104.9074942, 4.73, 0.01, '2026-06-10 08:59:49', 'check_in', '2026-06-10 08:59:49', '2026-06-10 08:59:49'),
(518, 14, 282, NULL, 11.6484044, 104.9074291, 19.97, 0.00, '2026-06-10 09:00:34', 'check_in', '2026-06-10 09:00:34', '2026-06-10 09:00:34'),
(519, 17, 283, NULL, 13.1090300, 103.1451336, 28.21, 0.00, '2026-06-10 09:23:09', 'check_in', '2026-06-10 09:23:09', '2026-06-10 09:23:09'),
(520, 21, 284, NULL, 12.9315115, 103.0135219, 4.78, 15.95, '2026-06-10 09:58:37', 'check_in', '2026-06-10 09:58:38', '2026-06-10 09:58:38'),
(521, 4, 285, NULL, 11.6484014, 104.9074589, 9.79, 0.00, '2026-06-10 11:17:55', 'check_in', '2026-06-10 11:17:56', '2026-06-10 11:17:56'),
(522, 6, 280, NULL, 11.6483711, 104.9074626, 20.00, 0.00, '2026-06-10 17:02:42', 'check_out', '2026-06-10 17:02:42', '2026-06-10 17:02:42'),
(523, 19, 278, NULL, 11.6483761, 104.9074768, 7.26, 0.00, '2026-06-10 17:15:37', 'check_out', '2026-06-10 17:15:38', '2026-06-10 17:15:38'),
(524, 5, 279, NULL, 11.6484041, 104.9074697, 13.65, 0.00, '2026-06-10 17:15:52', 'check_out', '2026-06-10 17:15:53', '2026-06-10 17:15:53'),
(525, 8, 274, NULL, 11.6483806, 104.9074239, 12.13, 0.00, '2026-06-10 17:16:56', 'check_out', '2026-06-10 17:16:57', '2026-06-10 17:16:57'),
(526, 3, 281, NULL, 11.6483927, 104.9074671, 18.36, 0.00, '2026-06-10 17:20:28', 'check_out', '2026-06-10 17:20:29', '2026-06-10 17:20:29'),
(527, 14, 282, NULL, 11.6483921, 104.9074226, 12.19, 0.00, '2026-06-10 17:20:49', 'check_out', '2026-06-10 17:20:50', '2026-06-10 17:20:50'),
(528, 12, 276, NULL, 11.6483492, 104.9074488, 7.00, 0.00, '2026-06-10 17:28:47', 'check_out', '2026-06-10 17:28:47', '2026-06-10 17:28:47'),
(529, 15, 275, NULL, 11.6483084, 104.9074234, 35.00, 0.00, '2026-06-10 17:50:54', 'check_out', '2026-06-10 17:50:55', '2026-06-10 17:50:55'),
(530, 4, 285, NULL, 11.6483894, 104.9074573, 6.72, 0.00, '2026-06-10 18:22:59', 'check_out', '2026-06-10 18:23:00', '2026-06-10 18:23:00'),
(531, 13, 277, NULL, 11.6484157, 104.9074555, 11.55, 0.00, '2026-06-10 18:31:29', 'check_out', '2026-06-10 18:31:30', '2026-06-10 18:31:30'),
(532, 9, 273, NULL, 11.6484037, 104.9074675, 8.42, 0.00, '2026-06-10 18:32:44', 'check_out', '2026-06-10 18:32:45', '2026-06-10 18:32:45'),
(533, 17, 283, NULL, 13.5966763, 102.9684328, 45.60, 0.00, '2026-06-10 18:40:56', 'check_out', '2026-06-10 18:40:57', '2026-06-10 18:40:57'),
(534, 8, 286, NULL, 11.6484139, 104.9074233, 19.30, 0.00, '2026-06-11 08:21:47', 'check_in', '2026-06-11 08:21:48', '2026-06-11 08:21:48'),
(535, 9, 287, NULL, 11.6484056, 104.9074416, 19.99, 0.00, '2026-06-11 08:22:41', 'check_in', '2026-06-11 08:22:41', '2026-06-11 08:22:41'),
(536, 16, 288, NULL, 11.6484254, 104.9074161, 10.21, 0.00, '2026-06-11 08:33:05', 'check_in', '2026-06-11 08:33:05', '2026-06-11 08:33:05'),
(537, 13, 289, NULL, 11.6484157, 104.9074555, 11.55, 0.00, '2026-06-11 08:48:43', 'check_in', '2026-06-11 08:48:43', '2026-06-11 08:48:43'),
(538, 14, 290, NULL, 11.6484235, 104.9074496, 13.73, 0.00, '2026-06-11 08:52:25', 'check_in', '2026-06-11 08:52:25', '2026-06-11 08:52:25'),
(539, 5, 291, NULL, 11.6484041, 104.9074697, 13.86, 0.00, '2026-06-11 08:57:27', 'check_in', '2026-06-11 08:57:28', '2026-06-11 08:57:28'),
(540, 19, 292, NULL, 11.6483360, 104.9074928, 14.00, 2.35, '2026-06-11 08:58:02', 'check_in', '2026-06-11 08:58:02', '2026-06-11 08:58:02'),
(541, 15, 293, NULL, 11.6484154, 104.9074465, 35.00, 0.00, '2026-06-11 08:59:23', 'check_in', '2026-06-11 08:59:23', '2026-06-11 08:59:23'),
(542, 12, 294, NULL, 11.6483492, 104.9074488, 7.00, 0.00, '2026-06-11 09:15:26', 'check_in', '2026-06-11 09:15:27', '2026-06-11 09:15:27'),
(543, 3, 295, NULL, 11.6483924, 104.9074671, 14.94, 0.00, '2026-06-11 09:34:17', 'check_in', '2026-06-11 09:34:18', '2026-06-11 09:34:18'),
(544, 17, 296, NULL, 13.5513570, 102.9876259, 39.60, 0.49, '2026-06-11 10:10:35', 'check_in', '2026-06-11 10:10:36', '2026-06-11 10:10:36'),
(545, 6, 297, NULL, 11.6484494, 104.9075319, 14.00, 0.73, '2026-06-11 10:19:38', 'check_in', '2026-06-11 10:19:38', '2026-06-11 10:19:38'),
(546, 21, 298, NULL, 13.5080649, 102.9889775, 14.00, 7.89, '2026-06-11 10:41:32', 'check_in', '2026-06-11 10:41:33', '2026-06-11 10:41:33'),
(547, 4, 299, NULL, 11.6484515, 104.9074391, 15.62, 0.00, '2026-06-11 11:29:13', 'check_in', '2026-06-11 11:29:13', '2026-06-11 11:29:13'),
(548, 16, 288, NULL, 11.6483994, 104.9074142, 19.37, 0.00, '2026-06-11 17:01:57', 'check_out', '2026-06-11 17:01:57', '2026-06-11 17:01:57'),
(549, 6, 297, NULL, 11.6483968, 104.9074808, 11.53, 0.00, '2026-06-11 17:09:33', 'check_out', '2026-06-11 17:09:34', '2026-06-11 17:09:34'),
(550, 5, 291, NULL, 11.6484057, 104.9074583, 9.94, 0.00, '2026-06-11 17:11:59', 'check_out', '2026-06-11 17:11:59', '2026-06-11 17:11:59'),
(551, 8, 286, NULL, 11.6484048, 104.9074198, 20.75, 0.00, '2026-06-11 17:22:01', 'check_out', '2026-06-11 17:22:01', '2026-06-11 17:22:01'),
(552, 3, 295, NULL, 11.6483890, 104.9074665, 16.34, 0.00, '2026-06-11 17:32:01', 'check_out', '2026-06-11 17:32:02', '2026-06-11 17:32:02'),
(553, 21, 298, NULL, 13.5968400, 102.9699368, 20.65, 0.00, '2026-06-11 17:33:58', 'check_out', '2026-06-11 17:33:59', '2026-06-11 17:33:59'),
(554, 14, 290, NULL, 11.6484027, 104.9074321, 18.44, 0.00, '2026-06-11 17:41:40', 'check_out', '2026-06-11 17:41:41', '2026-06-11 17:41:41'),
(555, 15, 293, NULL, 11.6483181, 104.9074159, 35.00, 0.00, '2026-06-11 17:44:09', 'check_out', '2026-06-11 17:44:10', '2026-06-11 17:44:10'),
(556, 9, 287, NULL, 11.6484037, 104.9074675, 8.42, 0.00, '2026-06-11 17:52:29', 'check_out', '2026-06-11 17:52:30', '2026-06-11 17:52:30'),
(557, 4, 299, NULL, 11.6484014, 104.9074589, 9.79, 0.00, '2026-06-11 20:03:15', 'check_out', '2026-06-11 20:03:16', '2026-06-11 20:03:16'),
(558, 13, 289, NULL, 11.6484157, 104.9074555, 11.55, 0.00, '2026-06-11 20:09:08', 'check_out', '2026-06-11 20:09:09', '2026-06-11 20:09:09'),
(559, 19, 292, NULL, 11.6483762, 104.9074767, 7.37, 0.00, '2026-06-11 20:10:59', 'check_out', '2026-06-11 20:11:00', '2026-06-11 20:11:00'),
(560, 12, 294, NULL, 11.6483492, 104.9074488, 7.00, 0.00, '2026-06-11 20:11:48', 'check_out', '2026-06-11 20:11:48', '2026-06-11 20:11:48'),
(561, 8, 300, NULL, 11.6484092, 104.9074310, 19.97, 0.00, '2026-06-12 08:17:50', 'check_in', '2026-06-12 08:17:50', '2026-06-12 08:17:50'),
(562, 9, 301, NULL, 11.6484035, 104.9074672, 8.40, 0.00, '2026-06-12 08:26:14', 'check_in', '2026-06-12 08:26:15', '2026-06-12 08:26:15'),
(563, 16, 302, NULL, 11.6484155, 104.9074512, 10.93, 0.23, '2026-06-12 08:32:37', 'check_in', '2026-06-12 08:32:38', '2026-06-12 08:32:38'),
(564, 14, 303, NULL, 11.6484034, 104.9074315, 19.97, 0.00, '2026-06-12 08:47:07', 'check_in', '2026-06-12 08:47:08', '2026-06-12 08:47:08'),
(565, 6, 304, NULL, 11.6483968, 104.9074808, 11.53, 0.00, '2026-06-12 09:02:44', 'check_in', '2026-06-12 09:02:45', '2026-06-12 09:02:45'),
(566, 5, 305, NULL, 11.6484041, 104.9074697, 13.86, 0.00, '2026-06-12 09:10:50', 'check_in', '2026-06-12 09:10:50', '2026-06-12 09:10:50'),
(567, 13, 306, NULL, 11.6484157, 104.9074555, 11.55, 0.00, '2026-06-12 09:13:15', 'check_in', '2026-06-12 09:13:16', '2026-06-12 09:13:16'),
(568, 3, 307, NULL, 11.6483947, 104.9074682, 15.60, 0.00, '2026-06-12 09:19:31', 'check_in', '2026-06-12 09:19:31', '2026-06-12 09:19:31'),
(569, 21, 308, NULL, 14.1854282, 103.5263572, 65.36, 0.00, '2026-06-12 11:15:27', 'check_in', '2026-06-12 11:15:28', '2026-06-12 11:15:28'),
(570, 4, 309, NULL, 11.6484014, 104.9074589, 9.79, 0.00, '2026-06-12 11:24:13', 'check_in', '2026-06-12 11:24:14', '2026-06-12 11:24:14'),
(571, 17, 310, NULL, 13.8277023, 103.5156253, 19.10, 0.00, '2026-06-12 14:01:49', 'check_in', '2026-06-12 14:01:50', '2026-06-12 14:01:50'),
(572, 6, 304, NULL, 11.6483968, 104.9074808, 11.53, 0.00, '2026-06-12 17:02:36', 'check_out', '2026-06-12 17:02:37', '2026-06-12 17:02:37'),
(573, 5, 305, NULL, 11.6484041, 104.9074697, 13.86, 0.00, '2026-06-12 17:04:03', 'check_out', '2026-06-12 17:04:04', '2026-06-12 17:04:04'),
(574, 16, 302, NULL, 11.6484087, 104.9074347, 19.83, 0.00, '2026-06-12 17:06:14', 'check_out', '2026-06-12 17:06:15', '2026-06-12 17:06:15'),
(575, 3, 307, NULL, 11.6483871, 104.9074684, 19.99, 0.00, '2026-06-12 17:08:09', 'check_out', '2026-06-12 17:08:10', '2026-06-12 17:08:10'),
(576, 8, 300, NULL, 11.6484111, 104.9074307, 19.76, 0.00, '2026-06-12 17:17:17', 'check_out', '2026-06-12 17:17:17', '2026-06-12 17:17:17'),
(577, 14, 303, NULL, 11.6484031, 104.9074310, 19.82, 0.00, '2026-06-12 18:09:54', 'check_out', '2026-06-12 18:09:54', '2026-06-12 18:09:54'),
(578, 21, 308, NULL, 14.1880632, 103.5262169, 59.67, 0.00, '2026-06-12 18:13:02', 'check_out', '2026-06-12 18:13:03', '2026-06-12 18:13:03'),
(579, 9, 301, NULL, 11.6484035, 104.9074672, 8.40, 0.00, '2026-06-12 18:44:29', 'check_out', '2026-06-12 18:44:30', '2026-06-12 18:44:30'),
(580, 13, 306, NULL, 11.6484157, 104.9074555, 11.55, 0.00, '2026-06-12 18:47:56', 'check_out', '2026-06-12 18:47:56', '2026-06-12 18:47:56'),
(581, 16, 311, NULL, 11.6484093, 104.9074344, 16.45, 0.00, '2026-06-13 08:20:11', 'check_in', '2026-06-13 08:20:12', '2026-06-13 08:20:12'),
(582, 8, 312, NULL, 11.6484893, 104.9073522, 36.34, 0.00, '2026-06-13 08:22:08', 'check_in', '2026-06-13 08:22:08', '2026-06-13 08:22:08'),
(583, 9, 313, NULL, 11.6484042, 104.9074664, 8.37, 0.00, '2026-06-13 08:34:26', 'check_in', '2026-06-13 08:34:26', '2026-06-13 08:34:26'),
(584, 3, 314, NULL, 11.6483816, 104.9074686, 19.29, 0.00, '2026-06-13 08:45:32', 'check_in', '2026-06-13 08:45:32', '2026-06-13 08:45:32'),
(585, 14, 315, NULL, 11.6483729, 104.9074861, 18.55, 0.00, '2026-06-13 08:45:42', 'check_in', '2026-06-13 08:45:43', '2026-06-13 08:45:43'),
(586, 5, 316, NULL, 11.6484039, 104.9074693, 13.79, 0.00, '2026-06-13 08:54:00', 'check_in', '2026-06-13 08:54:00', '2026-06-13 08:54:00'),
(587, 15, 317, NULL, 11.6483185, 104.9074102, 35.00, 0.00, '2026-06-13 09:05:19', 'check_in', '2026-06-13 09:05:20', '2026-06-13 09:05:20'),
(588, 4, 318, NULL, 11.6484680, 104.9074642, 11.27, 0.00, '2026-06-13 09:22:37', 'check_in', '2026-06-13 09:22:37', '2026-06-13 09:22:37'),
(589, 21, 319, NULL, 14.1729388, 103.5049222, 6.40, 0.00, '2026-06-13 09:25:29', 'check_in', '2026-06-13 09:25:29', '2026-06-13 09:25:29'),
(590, 13, 320, NULL, 11.6484157, 104.9074555, 11.55, 0.00, '2026-06-13 09:28:52', 'check_in', '2026-06-13 09:28:53', '2026-06-13 09:28:53'),
(591, 6, 321, NULL, 11.6483970, 104.9074310, 19.77, 0.00, '2026-06-13 09:41:34', 'check_in', '2026-06-13 09:41:34', '2026-06-13 09:41:34'),
(592, 17, 322, NULL, 14.1623530, 103.2864206, 18.16, 0.00, '2026-06-13 10:25:41', 'check_in', '2026-06-13 10:25:41', '2026-06-13 10:25:41'),
(593, 3, 314, NULL, 11.6483780, 104.9074677, 9.50, 0.00, '2026-06-13 17:01:38', 'check_out', '2026-06-13 17:01:38', '2026-06-13 17:01:38'),
(594, 16, 311, NULL, 11.6483978, 104.9074464, 14.37, 0.00, '2026-06-13 17:05:15', 'check_out', '2026-06-13 17:05:16', '2026-06-13 17:05:16'),
(595, 5, 316, NULL, 11.6484056, 104.9074692, 13.86, 0.00, '2026-06-13 17:05:31', 'check_out', '2026-06-13 17:05:32', '2026-06-13 17:05:32'),
(596, 6, 321, NULL, 11.6483968, 104.9074808, 11.53, 0.00, '2026-06-13 17:07:15', 'check_out', '2026-06-13 17:07:16', '2026-06-13 17:07:16'),
(597, 8, 312, NULL, 11.6484210, 104.9074287, 19.64, 0.00, '2026-06-13 17:11:49', 'check_out', '2026-06-13 17:11:50', '2026-06-13 17:11:50'),
(598, 14, 315, NULL, 11.6484017, 104.9074306, 18.54, 0.00, '2026-06-13 18:17:51', 'check_out', '2026-06-13 18:17:51', '2026-06-13 18:17:51'),
(599, 15, 317, NULL, 11.6483070, 104.9074016, 35.00, 0.00, '2026-06-13 18:30:54', 'check_out', '2026-06-13 18:30:55', '2026-06-13 18:30:55'),
(600, 13, 320, NULL, 11.6484094, 104.9074493, 8.20, 0.00, '2026-06-13 19:44:24', 'check_out', '2026-06-13 19:44:25', '2026-06-13 19:44:25'),
(601, 9, 313, NULL, 11.6484042, 104.9074664, 8.37, 0.00, '2026-06-13 20:27:47', 'check_out', '2026-06-13 20:27:48', '2026-06-13 20:27:48'),
(602, 16, 323, NULL, 11.6483960, 104.9074114, 19.97, 0.00, '2026-06-14 08:20:32', 'check_in', '2026-06-14 08:20:33', '2026-06-14 08:20:33'),
(603, 8, 324, NULL, 11.6484770, 104.9073751, 19.98, 0.00, '2026-06-14 08:36:28', 'check_in', '2026-06-14 08:36:29', '2026-06-14 08:36:29'),
(604, 21, 325, NULL, 14.1972732, 103.5316793, 2.40, 0.00, '2026-06-14 08:47:23', 'check_in', '2026-06-14 08:47:23', '2026-06-14 08:47:23'),
(605, 17, 326, NULL, 14.1558462, 103.2584789, 42.50, 0.00, '2026-06-14 10:29:39', 'check_in', '2026-06-14 10:29:40', '2026-06-14 10:29:40'),
(606, 9, 327, NULL, 11.6484042, 104.9074664, 8.37, 0.00, '2026-06-14 10:49:43', 'check_in', '2026-06-14 10:49:43', '2026-06-14 10:49:43'),
(607, 16, 323, NULL, 11.6484103, 104.9074379, 15.80, 0.00, '2026-06-14 17:23:32', 'check_out', '2026-06-14 17:23:33', '2026-06-14 17:23:33'),
(608, 9, 327, NULL, 11.6484042, 104.9074664, 8.37, 0.00, '2026-06-14 18:29:37', 'check_out', '2026-06-14 18:29:37', '2026-06-14 18:29:37'),
(609, 8, 324, NULL, 11.6484202, 104.9074220, 11.85, 0.00, '2026-06-14 18:30:15', 'check_out', '2026-06-14 18:30:15', '2026-06-14 18:30:15'),
(610, 8, 328, NULL, 11.6484225, 104.9074202, 19.77, 0.00, '2026-06-15 08:26:43', 'check_in', '2026-06-15 08:26:43', '2026-06-15 08:26:43'),
(611, 9, 329, NULL, 11.6484053, 104.9074656, 8.23, 0.00, '2026-06-15 08:34:35', 'check_in', '2026-06-15 08:34:36', '2026-06-15 08:34:36'),
(612, 14, 330, NULL, 11.6483652, 104.9074797, 12.95, 0.61, '2026-06-15 08:50:48', 'check_in', '2026-06-15 08:50:50', '2026-06-15 08:50:50'),
(613, 5, 331, NULL, 11.6484061, 104.9074588, 19.97, 0.00, '2026-06-15 08:53:24', 'check_in', '2026-06-15 08:53:24', '2026-06-15 08:53:24'),
(614, 13, 332, NULL, 11.6484094, 104.9074418, 9.30, 0.00, '2026-06-15 09:04:05', 'check_in', '2026-06-15 09:04:06', '2026-06-15 09:04:06'),
(615, 21, 333, NULL, 14.1904805, 103.5294575, 1414.00, 0.00, '2026-06-15 09:08:33', 'check_in', '2026-06-15 09:08:33', '2026-06-15 09:08:33'),
(616, 6, 334, NULL, 11.6483950, 104.9074413, 22.00, 0.00, '2026-06-15 09:19:02', 'check_in', '2026-06-15 09:19:03', '2026-06-15 09:19:03'),
(617, 3, 335, NULL, 11.6483695, 104.9074895, 3.34, 0.77, '2026-06-15 09:23:58', 'check_in', '2026-06-15 09:23:58', '2026-06-15 09:23:58'),
(618, 17, 336, NULL, 14.1745504, 103.5055976, 28.23, 0.00, '2026-06-15 09:31:41', 'check_in', '2026-06-15 09:31:41', '2026-06-15 09:31:41'),
(619, 4, 337, NULL, 11.6484484, 104.9074503, 20.02, 0.00, '2026-06-15 11:27:06', 'check_in', '2026-06-15 11:27:07', '2026-06-15 11:27:07'),
(620, 5, 331, NULL, 11.6484056, 104.9074692, 13.93, 0.00, '2026-06-15 17:01:42', 'check_out', '2026-06-15 17:01:43', '2026-06-15 17:01:43'),
(621, 6, 334, NULL, 11.6483968, 104.9074808, 11.53, 0.00, '2026-06-15 17:01:46', 'check_out', '2026-06-15 17:01:47', '2026-06-15 17:01:47'),
(622, 3, 335, NULL, 11.6483835, 104.9074693, 19.93, 0.00, '2026-06-15 17:14:48', 'check_out', '2026-06-15 17:14:49', '2026-06-15 17:14:49'),
(623, 13, 332, NULL, 11.6484157, 104.9074555, 11.55, 0.00, '2026-06-15 17:39:57', 'check_out', '2026-06-15 17:39:57', '2026-06-15 17:39:57'),
(624, 14, 330, NULL, 11.6484017, 104.9074306, 17.30, 0.00, '2026-06-15 18:22:44', 'check_out', '2026-06-15 18:22:45', '2026-06-15 18:22:45'),
(625, 8, 328, NULL, 11.6484147, 104.9074249, 14.18, 0.00, '2026-06-15 18:31:35', 'check_out', '2026-06-15 18:31:35', '2026-06-15 18:31:35'),
(626, 9, 329, NULL, 11.6484059, 104.9074655, 8.18, 0.00, '2026-06-15 20:35:57', 'check_out', '2026-06-15 20:35:58', '2026-06-15 20:35:58'),
(627, 4, 337, NULL, 11.6484014, 104.9074589, 9.79, 0.00, '2026-06-15 20:40:52', 'check_out', '2026-06-15 20:40:52', '2026-06-15 20:40:52'),
(628, 16, 338, NULL, 11.6484119, 104.9074300, 14.15, 0.00, '2026-06-16 08:21:30', 'check_in', '2026-06-16 08:21:30', '2026-06-16 08:21:30'),
(629, 8, 339, NULL, 11.6484326, 104.9074279, 19.83, 0.00, '2026-06-16 08:25:22', 'check_in', '2026-06-16 08:25:23', '2026-06-16 08:25:23'),
(630, 9, 340, NULL, 11.6484058, 104.9074654, 8.16, 0.00, '2026-06-16 08:37:05', 'check_in', '2026-06-16 08:37:06', '2026-06-16 08:37:06'),
(631, 14, 341, NULL, 11.6484012, 104.9074289, 19.73, 0.00, '2026-06-16 08:51:11', 'check_in', '2026-06-16 08:51:12', '2026-06-16 08:51:12'),
(632, 6, 342, NULL, 11.6484291, 104.9074256, 19.53, 0.00, '2026-06-16 09:00:50', 'check_in', '2026-06-16 09:00:51', '2026-06-16 09:00:51'),
(633, 5, 343, NULL, 11.6484070, 104.9074666, 17.51, 0.00, '2026-06-16 09:18:44', 'check_in', '2026-06-16 09:18:44', '2026-06-16 09:18:44'),
(634, 3, 344, NULL, 11.6483810, 104.9074707, 19.97, 0.00, '2026-06-16 09:34:59', 'check_in', '2026-06-16 09:34:59', '2026-06-16 09:34:59'),
(635, 17, 345, NULL, 14.1872683, 103.5376967, 3.40, 0.14, '2026-06-16 09:38:17', 'check_in', '2026-06-16 09:38:18', '2026-06-16 09:38:18'),
(636, 21, 346, NULL, 14.1874489, 103.5377061, 53.80, 0.00, '2026-06-16 09:44:33', 'check_in', '2026-06-16 09:44:34', '2026-06-16 09:44:34'),
(637, 12, 347, NULL, 11.6483490, 104.9074494, 6.95, 0.00, '2026-06-16 09:48:17', 'check_in', '2026-06-16 09:48:18', '2026-06-16 09:48:18'),
(638, 13, 348, NULL, 11.6484054, 104.9074382, 11.33, 0.00, '2026-06-16 09:48:57', 'check_in', '2026-06-16 09:48:59', '2026-06-16 09:48:59'),
(639, 4, 349, NULL, 11.6484420, 104.9074332, 19.11, 0.00, '2026-06-16 11:30:26', 'check_in', '2026-06-16 11:30:26', '2026-06-16 11:30:26'),
(640, 4, 349, NULL, 11.6484014, 104.9074589, 9.79, 0.00, '2026-06-16 17:34:18', 'check_out', '2026-06-16 17:34:19', '2026-06-16 17:34:19'),
(641, 16, 338, NULL, 11.6483715, 104.9074649, 14.49, 0.00, '2026-06-16 17:48:28', 'check_out', '2026-06-16 17:48:29', '2026-06-16 17:48:29'),
(642, 8, 339, NULL, 11.6484278, 104.9074292, 19.90, 0.00, '2026-06-16 17:50:23', 'check_out', '2026-06-16 17:50:24', '2026-06-16 17:50:24'),
(643, 5, 343, NULL, 11.6484070, 104.9074666, 14.06, 0.00, '2026-06-16 17:52:36', 'check_out', '2026-06-16 17:52:37', '2026-06-16 17:52:37'),
(644, 21, 346, NULL, 14.2406934, 104.1156843, 48.07, 0.00, '2026-06-16 18:08:14', 'check_out', '2026-06-16 18:08:15', '2026-06-16 18:08:15'),
(645, 14, 341, NULL, 11.6484001, 104.9074279, 17.97, 0.00, '2026-06-16 18:11:36', 'check_out', '2026-06-16 18:11:36', '2026-06-16 18:11:36'),
(646, 3, 344, NULL, 11.6483797, 104.9074709, 16.91, 0.00, '2026-06-16 18:12:05', 'check_out', '2026-06-16 18:12:06', '2026-06-16 18:12:06'),
(647, 13, 348, NULL, 11.6484157, 104.9074555, 11.55, 0.00, '2026-06-16 20:38:14', 'check_out', '2026-06-16 20:38:15', '2026-06-16 20:38:15'),
(648, 12, 347, NULL, 11.6483478, 104.9074518, 6.84, 0.00, '2026-06-16 20:39:29', 'check_out', '2026-06-16 20:39:29', '2026-06-16 20:39:29'),
(649, 9, 340, NULL, 11.6484057, 104.9074654, 8.16, 0.00, '2026-06-16 20:42:40', 'check_out', '2026-06-16 20:42:41', '2026-06-16 20:42:41'),
(650, 8, 350, NULL, 11.6484357, 104.9074268, 32.10, 0.00, '2026-06-17 08:26:33', 'check_in', '2026-06-17 08:26:33', '2026-06-17 08:26:33'),
(651, 16, 351, NULL, 11.6484010, 104.9074605, 20.07, 0.00, '2026-06-17 08:31:39', 'check_in', '2026-06-17 08:31:40', '2026-06-17 08:31:40'),
(652, 9, 352, NULL, 11.6484057, 104.9074654, 8.16, 0.00, '2026-06-17 08:33:16', 'check_in', '2026-06-17 08:33:17', '2026-06-17 08:33:17'),
(653, 14, 353, NULL, 11.6484002, 104.9074278, 13.36, 0.00, '2026-06-17 08:47:26', 'check_in', '2026-06-17 08:47:26', '2026-06-17 08:47:26'),
(654, 15, 354, NULL, 11.6483092, 104.9074027, 35.00, 0.00, '2026-06-17 08:56:01', 'check_in', '2026-06-17 08:56:01', '2026-06-17 08:56:01'),
(655, 17, 355, NULL, 14.2416064, 104.1157035, 4.90, 0.43, '2026-06-17 09:13:39', 'check_in', '2026-06-17 09:13:40', '2026-06-17 09:13:40'),
(656, 5, 356, NULL, 11.6484087, 104.9074427, 18.94, 0.00, '2026-06-17 09:13:57', 'check_in', '2026-06-17 09:13:58', '2026-06-17 09:13:58'),
(657, 21, 357, NULL, 14.2433786, 104.1205366, 45.87, 0.00, '2026-06-17 09:16:51', 'check_in', '2026-06-17 09:16:51', '2026-06-17 09:16:51'),
(658, 6, 358, NULL, 11.6484260, 104.9075006, 19.37, 0.00, '2026-06-17 09:26:43', 'check_in', '2026-06-17 09:26:43', '2026-06-17 09:26:43'),
(659, 3, 359, NULL, 11.6483846, 104.9074689, 16.04, 0.00, '2026-06-17 09:27:31', 'check_in', '2026-06-17 09:27:31', '2026-06-17 09:27:31'),
(660, 13, 360, NULL, 11.6487340, 104.9074114, 13.88, 0.54, '2026-06-17 09:35:56', 'check_in', '2026-06-17 09:35:57', '2026-06-17 09:35:57'),
(661, 12, 361, NULL, 11.6483478, 104.9074518, 6.84, 0.00, '2026-06-17 09:42:20', 'check_in', '2026-06-17 09:42:21', '2026-06-17 09:42:21'),
(662, 6, 358, NULL, 11.6483968, 104.9074808, 11.53, 0.00, '2026-06-17 17:00:28', 'check_out', '2026-06-17 17:00:28', '2026-06-17 17:00:28'),
(663, 5, 356, NULL, 11.6484072, 104.9074687, 14.18, 0.00, '2026-06-17 17:00:29', 'check_out', '2026-06-17 17:00:29', '2026-06-17 17:00:29'),
(664, 16, 351, NULL, 11.6484081, 104.9074589, 19.86, 0.00, '2026-06-17 17:01:49', 'check_out', '2026-06-17 17:01:49', '2026-06-17 17:01:49'),
(665, 3, 359, NULL, 11.6483794, 104.9074684, 19.92, 0.00, '2026-06-17 17:11:25', 'check_out', '2026-06-17 17:11:27', '2026-06-17 17:11:27'),
(666, 15, 354, NULL, 11.6483570, 104.9073989, 35.00, 0.00, '2026-06-17 18:11:40', 'check_out', '2026-06-17 18:11:40', '2026-06-17 18:11:40'),
(667, 14, 353, NULL, 11.6483999, 104.9074272, 17.53, 0.00, '2026-06-17 18:12:04', 'check_out', '2026-06-17 18:12:04', '2026-06-17 18:12:04'),
(668, 8, 350, NULL, 11.6484282, 104.9074308, 18.50, 0.00, '2026-06-17 18:38:11', 'check_out', '2026-06-17 18:38:11', '2026-06-17 18:38:11'),
(669, 9, 352, NULL, 11.6484057, 104.9074654, 8.16, 0.00, '2026-06-17 18:57:33', 'check_out', '2026-06-17 18:57:33', '2026-06-17 18:57:33'),
(670, 13, 360, NULL, 11.6484406, 104.9074294, 6.68, 0.00, '2026-06-17 19:00:45', 'check_out', '2026-06-17 19:00:46', '2026-06-17 19:00:46'),
(671, 12, 361, NULL, 11.6483478, 104.9074518, 6.84, 0.00, '2026-06-17 19:02:22', 'check_out', '2026-06-17 19:02:23', '2026-06-17 19:02:23'),
(672, 9, 362, NULL, 11.6484055, 104.9074655, 8.15, 0.00, '2026-06-18 08:18:39', 'check_in', '2026-06-18 08:18:40', '2026-06-18 08:18:40'),
(673, 16, 363, NULL, 11.6484086, 104.9074604, 6.28, 0.00, '2026-06-18 08:33:38', 'check_in', '2026-06-18 08:33:38', '2026-06-18 08:33:38'),
(674, 15, 364, NULL, 11.6483537, 104.9073962, 35.00, 0.00, '2026-06-18 08:56:10', 'check_in', '2026-06-18 08:56:11', '2026-06-18 08:56:11'),
(675, 13, 365, NULL, 11.6484404, 104.9074294, 15.03, 0.00, '2026-06-18 09:04:51', 'check_in', '2026-06-18 09:04:51', '2026-06-18 09:04:51'),
(676, 12, 366, NULL, 11.6483444, 104.9074744, 13.64, 0.00, '2026-06-18 09:05:04', 'check_in', '2026-06-18 09:05:05', '2026-06-18 09:05:05'),
(677, 14, 367, NULL, 11.6483999, 104.9074296, 18.08, 0.00, '2026-06-18 09:09:37', 'check_in', '2026-06-18 09:09:38', '2026-06-18 09:09:38'),
(678, 6, 368, NULL, 11.6484860, 104.9074317, 13.64, 0.15, '2026-06-18 09:16:20', 'check_in', '2026-06-18 09:16:20', '2026-06-18 09:16:20'),
(679, 3, 369, NULL, 11.6483649, 104.9074694, 8.97, 0.08, '2026-06-18 09:27:25', 'check_in', '2026-06-18 09:27:25', '2026-06-18 09:27:25'),
(680, 17, 370, NULL, 14.0795482, 104.0956564, 17.59, 0.00, '2026-06-18 10:29:53', 'check_in', '2026-06-18 10:29:54', '2026-06-18 10:29:54'),
(681, 21, 371, NULL, 14.0743649, 104.0982534, 80.27, 0.00, '2026-06-18 10:47:31', 'check_in', '2026-06-18 10:47:32', '2026-06-18 10:47:32'),
(682, 6, 368, NULL, 11.6483836, 104.9074772, 11.40, 0.00, '2026-06-18 17:02:27', 'check_out', '2026-06-18 17:02:27', '2026-06-18 17:02:27'),
(683, 16, 363, NULL, 11.6484078, 104.9074607, 19.61, 0.00, '2026-06-18 17:03:06', 'check_out', '2026-06-18 17:03:07', '2026-06-18 17:03:07'),
(684, 3, 369, NULL, 11.6483676, 104.9074622, 24.70, 0.00, '2026-06-18 17:13:51', 'check_out', '2026-06-18 17:13:52', '2026-06-18 17:13:52'),
(685, 15, 364, NULL, 11.6483594, 104.9074034, 35.00, 0.00, '2026-06-18 17:16:46', 'check_out', '2026-06-18 17:16:47', '2026-06-18 17:16:47'),
(686, 14, 367, NULL, 11.6483835, 104.9074350, 18.66, 0.00, '2026-06-18 18:22:03', 'check_out', '2026-06-18 18:22:04', '2026-06-18 18:22:04'),
(687, 9, 362, NULL, 11.6484055, 104.9074655, 8.15, 0.00, '2026-06-18 18:44:33', 'check_out', '2026-06-18 18:44:34', '2026-06-18 18:44:34'),
(688, 13, 365, NULL, 11.6484157, 104.9074555, 11.55, 0.00, '2026-06-18 18:46:20', 'check_out', '2026-06-18 18:46:21', '2026-06-18 18:46:21'),
(689, 12, 366, NULL, 11.6483526, 104.9074683, 15.30, 0.00, '2026-06-18 18:50:43', 'check_out', '2026-06-18 18:50:43', '2026-06-18 18:50:43'),
(690, 21, 371, NULL, 13.5978235, 103.5167523, 2.00, 0.00, '2026-06-18 19:05:10', 'check_out', '2026-06-18 19:05:10', '2026-06-18 19:05:10'),
(691, 16, 372, NULL, 11.6484108, 104.9074800, 4.75, 0.01, '2026-06-19 08:15:51', 'check_in', '2026-06-19 08:15:51', '2026-06-19 08:15:51'),
(692, 8, 373, NULL, 11.6484411, 104.9074303, 19.81, 0.25, '2026-06-19 08:20:07', 'check_in', '2026-06-19 08:20:07', '2026-06-19 08:20:07'),
(693, 9, 374, NULL, 11.6484055, 104.9074655, 8.15, 0.00, '2026-06-19 08:24:32', 'check_in', '2026-06-19 08:24:33', '2026-06-19 08:24:33'),
(694, 15, 375, NULL, 11.6483587, 104.9074009, 35.00, 0.00, '2026-06-19 08:54:18', 'check_in', '2026-06-19 08:54:18', '2026-06-19 08:54:18'),
(695, 12, 376, NULL, 11.6484309, 104.9075093, 19.50, 0.00, '2026-06-19 08:54:38', 'check_in', '2026-06-19 08:54:39', '2026-06-19 08:54:39'),
(696, 14, 377, NULL, 11.6483840, 104.9074347, 19.83, 0.00, '2026-06-19 08:59:34', 'check_in', '2026-06-19 08:59:35', '2026-06-19 08:59:35'),
(697, 13, 378, NULL, 11.6484157, 104.9074555, 11.55, 0.00, '2026-06-19 09:08:16', 'check_in', '2026-06-19 09:08:17', '2026-06-19 09:08:17'),
(698, 21, 379, NULL, 13.5875410, 103.4163755, 19.21, 0.00, '2026-06-19 09:11:58', 'check_in', '2026-06-19 09:11:58', '2026-06-19 09:11:58'),
(699, 5, 380, NULL, 11.6484124, 104.9074402, 19.98, 0.00, '2026-06-19 09:16:51', 'check_in', '2026-06-19 09:16:51', '2026-06-19 09:16:51'),
(700, 6, 381, NULL, 11.6483874, 104.9074283, 16.38, 0.00, '2026-06-19 09:33:44', 'check_in', '2026-06-19 09:33:44', '2026-06-19 09:33:44'),
(701, 3, 382, NULL, 11.6483807, 104.9074632, 19.97, 0.00, '2026-06-19 09:37:37', 'check_in', '2026-06-19 09:37:38', '2026-06-19 09:37:38'),
(702, 4, 383, NULL, 11.6484482, 104.9074599, 16.43, 0.00, '2026-06-19 11:28:34', 'check_in', '2026-06-19 11:28:35', '2026-06-19 11:28:35'),
(703, 6, 381, NULL, 11.6483836, 104.9074772, 11.40, 0.00, '2026-06-19 17:01:32', 'check_out', '2026-06-19 17:01:33', '2026-06-19 17:01:33'),
(704, 5, 380, NULL, 11.6484127, 104.9074400, 8.38, 0.00, '2026-06-19 17:07:06', 'check_out', '2026-06-19 17:07:07', '2026-06-19 17:07:07'),
(705, 16, 372, NULL, 11.6483992, 104.9074602, 5.31, 0.00, '2026-06-19 17:07:34', 'check_out', '2026-06-19 17:07:35', '2026-06-19 17:07:35'),
(706, 3, 382, NULL, 11.6483749, 104.9074649, 7.08, 0.00, '2026-06-19 17:25:51', 'check_out', '2026-06-19 17:25:52', '2026-06-19 17:25:52'),
(707, 14, 377, NULL, 11.6483763, 104.9074947, 17.55, 0.00, '2026-06-19 17:26:16', 'check_out', '2026-06-19 17:26:17', '2026-06-19 17:26:17'),
(708, 15, 375, NULL, 11.6483872, 104.9074357, 35.00, 0.00, '2026-06-19 17:26:38', 'check_out', '2026-06-19 17:26:38', '2026-06-19 17:26:38'),
(709, 8, 373, NULL, 11.6484432, 104.9074288, 19.88, 0.00, '2026-06-19 17:36:41', 'check_out', '2026-06-19 17:36:41', '2026-06-19 17:36:41'),
(710, 12, 376, NULL, 11.6484302, 104.9075092, 19.64, 0.00, '2026-06-19 18:38:30', 'check_out', '2026-06-19 18:38:31', '2026-06-19 18:38:31'),
(711, 9, 374, NULL, 11.6484055, 104.9074655, 8.15, 0.00, '2026-06-19 18:38:37', 'check_out', '2026-06-19 18:38:37', '2026-06-19 18:38:37'),
(712, 13, 378, NULL, 11.6484157, 104.9074555, 11.55, 0.00, '2026-06-19 18:39:03', 'check_out', '2026-06-19 18:39:04', '2026-06-19 18:39:04'),
(713, 16, 384, NULL, 11.6484100, 104.9074641, 19.93, 0.00, '2026-06-20 08:09:12', 'check_in', '2026-06-20 08:09:12', '2026-06-20 08:09:12'),
(714, 8, 385, NULL, 11.6484380, 104.9074365, 14.94, 0.60, '2026-06-20 08:21:09', 'check_in', '2026-06-20 08:21:10', '2026-06-20 08:21:10'),
(715, 14, 386, NULL, 11.6483837, 104.9074348, 17.08, 0.00, '2026-06-20 08:51:26', 'check_in', '2026-06-20 08:51:27', '2026-06-20 08:51:27'),
(716, 4, 387, NULL, 11.6484511, 104.9074675, 19.96, 0.00, '2026-06-20 09:04:28', 'check_in', '2026-06-20 09:04:28', '2026-06-20 09:04:28'),
(717, 5, 388, NULL, 11.6484075, 104.9074666, 14.68, 0.00, '2026-06-20 09:20:21', 'check_in', '2026-06-20 09:20:22', '2026-06-20 09:20:22'),
(718, 6, 389, NULL, 11.6483506, 104.9073741, 16.45, 0.00, '2026-06-20 09:22:27', 'check_in', '2026-06-20 09:22:28', '2026-06-20 09:22:28'),
(719, 3, 390, NULL, 11.6483934, 104.9073969, 3.70, 0.19, '2026-06-20 09:31:21', 'check_in', '2026-06-20 09:31:21', '2026-06-20 09:31:21');
INSERT INTO `gps_locations` (`id`, `employee_id`, `attendance_id`, `customer_visit_id`, `latitude`, `longitude`, `accuracy`, `speed`, `recorded_at`, `source`, `created_at`, `updated_at`) VALUES
(720, 21, 391, NULL, 13.3902332, 103.8661692, 4.77, 8.01, '2026-06-20 10:08:04', 'check_in', '2026-06-20 10:08:05', '2026-06-20 10:08:05'),
(721, 17, 392, NULL, 13.3702557, 103.8528765, 22.77, 0.00, '2026-06-20 10:19:02', 'check_in', '2026-06-20 10:19:02', '2026-06-20 10:19:02'),
(722, 6, 389, NULL, 11.6483836, 104.9074772, 11.40, 0.00, '2026-06-20 17:00:32', 'check_out', '2026-06-20 17:00:32', '2026-06-20 17:00:32'),
(723, 16, 384, NULL, 11.6484134, 104.9074619, 19.38, 0.00, '2026-06-20 17:01:06', 'check_out', '2026-06-20 17:01:06', '2026-06-20 17:01:06'),
(724, 5, 388, NULL, 11.6484075, 104.9074666, 14.68, 0.00, '2026-06-20 17:01:24', 'check_out', '2026-06-20 17:01:25', '2026-06-20 17:01:25'),
(725, 3, 390, NULL, 11.6483826, 104.9074645, 10.23, 0.00, '2026-06-20 17:02:36', 'check_out', '2026-06-20 17:02:37', '2026-06-20 17:02:37'),
(726, 14, 386, NULL, 11.6483723, 104.9075020, 18.22, 0.00, '2026-06-20 17:27:52', 'check_out', '2026-06-20 17:27:52', '2026-06-20 17:27:52'),
(727, 4, 387, NULL, 11.6484594, 104.9074697, 15.21, 0.27, '2026-06-20 17:32:28', 'check_out', '2026-06-20 17:32:28', '2026-06-20 17:32:28'),
(728, 8, 385, NULL, 11.6484404, 104.9074310, 19.70, 0.00, '2026-06-20 17:47:17', 'check_out', '2026-06-20 17:47:18', '2026-06-20 17:47:18'),
(729, 8, 393, NULL, 11.6484233, 104.9074611, 19.97, 0.00, '2026-06-21 08:25:24', 'check_in', '2026-06-21 08:25:24', '2026-06-21 08:25:24'),
(730, 16, 394, NULL, 11.6483464, 104.9074347, 6.78, 0.09, '2026-06-21 08:30:45', 'check_in', '2026-06-21 08:30:45', '2026-06-21 08:30:45'),
(731, 17, 395, NULL, 13.3703029, 103.8530388, 36.39, 0.05, '2026-06-21 10:31:28', 'check_in', '2026-06-21 10:31:28', '2026-06-21 10:31:28'),
(732, 21, 396, NULL, 13.3710207, 103.8502470, 17.28, 10.08, '2026-06-21 10:42:11', 'check_in', '2026-06-21 10:42:11', '2026-06-21 10:42:11'),
(733, 8, 393, NULL, 11.6484193, 104.9074755, 19.85, 0.00, '2026-06-21 17:47:28', 'check_out', '2026-06-21 17:47:29', '2026-06-21 17:47:29'),
(734, 21, 396, NULL, 13.3837444, 103.8754646, 1414.00, 0.00, '2026-06-21 18:35:30', 'check_out', '2026-06-21 18:35:30', '2026-06-21 18:35:30'),
(735, 8, 397, NULL, 11.6484465, 104.9074625, 14.00, 0.11, '2026-06-22 08:13:57', 'check_in', '2026-06-22 08:13:58', '2026-06-22 08:13:58'),
(736, 16, 398, NULL, 11.6483904, 104.9074713, 20.00, 0.00, '2026-06-22 08:33:44', 'check_in', '2026-06-22 08:33:45', '2026-06-22 08:33:45'),
(737, 13, 399, NULL, 11.6484759, 104.9075129, 14.00, 0.00, '2026-06-22 08:41:34', 'check_in', '2026-06-22 08:41:34', '2026-06-22 08:41:34'),
(738, 15, 400, NULL, 11.6483784, 104.9074032, 35.00, 0.00, '2026-06-22 08:45:02', 'check_in', '2026-06-22 08:45:03', '2026-06-22 08:45:03'),
(739, 21, 401, NULL, 14.1818732, 103.5236621, 3.31, 11.32, '2026-06-22 08:47:48', 'check_in', '2026-06-22 08:47:49', '2026-06-22 08:47:49'),
(740, 12, 402, NULL, 11.6483255, 104.9074806, 10.10, 0.00, '2026-06-22 08:48:37', 'check_in', '2026-06-22 08:48:38', '2026-06-22 08:48:38'),
(741, 14, 403, NULL, 11.6483990, 104.9074560, 19.41, 0.00, '2026-06-22 08:59:53', 'check_in', '2026-06-22 08:59:53', '2026-06-22 08:59:53'),
(742, 6, 404, NULL, 11.6483690, 104.9074524, 18.46, 0.00, '2026-06-22 09:12:08', 'check_in', '2026-06-22 09:12:08', '2026-06-22 09:12:08'),
(743, 5, 405, NULL, 11.6484075, 104.9074666, 14.62, 0.00, '2026-06-22 09:20:19', 'check_in', '2026-06-22 09:20:20', '2026-06-22 09:20:20'),
(744, 3, 406, NULL, 11.6483813, 104.9074647, 10.00, 0.00, '2026-06-22 09:20:54', 'check_in', '2026-06-22 09:20:54', '2026-06-22 09:20:54'),
(745, 9, 407, NULL, 11.6484968, 104.9075284, 25.09, 0.00, '2026-06-22 09:58:41', 'check_in', '2026-06-22 09:58:42', '2026-06-22 09:58:42'),
(746, 17, 408, NULL, 13.6016395, 103.4162897, 19.55, 0.30, '2026-06-22 10:08:59', 'check_in', '2026-06-22 10:09:01', '2026-06-22 10:09:01'),
(747, 4, 409, NULL, 11.6484579, 104.9074522, 20.00, 0.00, '2026-06-22 11:20:19', 'check_in', '2026-06-22 11:20:19', '2026-06-22 11:20:19'),
(748, 16, 398, NULL, 11.6483836, 104.9074715, 11.78, 0.00, '2026-06-22 17:00:37', 'check_out', '2026-06-22 17:00:38', '2026-06-22 17:00:38'),
(749, 5, 405, NULL, 11.6484075, 104.9074666, 14.68, 0.00, '2026-06-22 17:04:57', 'check_out', '2026-06-22 17:04:58', '2026-06-22 17:04:58'),
(750, 6, 404, NULL, 11.6483836, 104.9074772, 11.40, 0.00, '2026-06-22 17:06:19', 'check_out', '2026-06-22 17:06:20', '2026-06-22 17:06:20'),
(751, 4, 409, NULL, 11.6484156, 104.9074553, 8.57, 0.00, '2026-06-22 17:08:44', 'check_out', '2026-06-22 17:08:44', '2026-06-22 17:08:44'),
(752, 8, 397, NULL, 11.6484344, 104.9074061, 18.92, 0.00, '2026-06-22 17:19:51', 'check_out', '2026-06-22 17:19:52', '2026-06-22 17:19:52'),
(753, 3, 406, NULL, 11.6483757, 104.9074604, 15.26, 0.00, '2026-06-22 18:07:21', 'check_out', '2026-06-22 18:07:21', '2026-06-22 18:07:21'),
(754, 9, 407, NULL, 11.6484050, 104.9074676, 8.12, 0.00, '2026-06-22 18:14:18', 'check_out', '2026-06-22 18:14:18', '2026-06-22 18:14:18'),
(755, 12, 402, NULL, 11.6483478, 104.9074518, 6.84, 0.00, '2026-06-22 18:14:49', 'check_out', '2026-06-22 18:14:50', '2026-06-22 18:14:50'),
(756, 13, 399, NULL, 11.6484157, 104.9074555, 11.55, 0.00, '2026-06-22 18:15:04', 'check_out', '2026-06-22 18:15:05', '2026-06-22 18:15:05'),
(757, 15, 400, NULL, 11.6483688, 104.9074162, 35.00, 0.00, '2026-06-22 18:54:30', 'check_out', '2026-06-22 18:54:31', '2026-06-22 18:54:31'),
(758, 14, 403, NULL, 11.6483703, 104.9075086, 17.78, 0.00, '2026-06-22 18:56:59', 'check_out', '2026-06-22 18:56:59', '2026-06-22 18:56:59'),
(759, 21, 401, NULL, 14.1914029, 103.5268337, 11.10, 0.00, '2026-06-22 19:53:57', 'check_out', '2026-06-22 19:53:58', '2026-06-22 19:53:58'),
(760, 8, 410, NULL, 11.6484221, 104.9074738, 19.95, 0.00, '2026-06-23 08:23:28', 'check_in', '2026-06-23 08:23:29', '2026-06-23 08:23:29'),
(761, 9, 411, NULL, 11.6484057, 104.9074673, 8.28, 0.00, '2026-06-23 08:35:48', 'check_in', '2026-06-23 08:35:49', '2026-06-23 08:35:49'),
(762, 14, 412, NULL, 11.6483703, 104.9075084, 16.16, 0.00, '2026-06-23 08:45:59', 'check_in', '2026-06-23 08:46:00', '2026-06-23 08:46:00'),
(763, 15, 413, NULL, 11.6484199, 104.9074403, 35.00, 0.00, '2026-06-23 09:09:16', 'check_in', '2026-06-23 09:09:16', '2026-06-23 09:09:16'),
(764, 4, 414, NULL, 11.6484156, 104.9074553, 8.57, 0.00, '2026-06-23 09:12:08', 'check_in', '2026-06-23 09:12:09', '2026-06-23 09:12:09'),
(765, 19, 415, NULL, 11.6483727, 104.9074797, 7.32, 0.00, '2026-06-23 09:14:53', 'check_in', '2026-06-23 09:14:53', '2026-06-23 09:14:53'),
(766, 6, 416, NULL, 11.6484093, 104.9075071, 14.00, 0.32, '2026-06-23 09:17:41', 'check_in', '2026-06-23 09:17:41', '2026-06-23 09:17:41'),
(767, 13, 417, NULL, 11.6484554, 104.9074484, 17.45, 0.00, '2026-06-23 09:19:57', 'check_in', '2026-06-23 09:19:57', '2026-06-23 09:19:57'),
(768, 12, 418, NULL, 11.6483478, 104.9074518, 6.84, 0.00, '2026-06-23 09:19:58', 'check_in', '2026-06-23 09:19:59', '2026-06-23 09:19:59'),
(769, 5, 419, NULL, 11.6483904, 104.9074574, 14.00, 0.13, '2026-06-23 09:23:00', 'check_in', '2026-06-23 09:23:00', '2026-06-23 09:23:00'),
(770, 3, 420, NULL, 11.6483747, 104.9074595, 13.51, 0.00, '2026-06-23 09:51:00', 'check_in', '2026-06-23 09:51:00', '2026-06-23 09:51:00'),
(771, 19, 415, NULL, 11.6483727, 104.9074797, 7.32, 0.00, '2026-06-23 17:13:31', 'check_out', '2026-06-23 17:13:31', '2026-06-23 17:13:31'),
(772, 5, 419, NULL, 11.6483976, 104.9074443, 5.30, 0.00, '2026-06-23 17:17:48', 'check_out', '2026-06-23 17:17:48', '2026-06-23 17:17:48'),
(773, 8, 410, NULL, 11.6484291, 104.9074687, 15.09, 0.00, '2026-06-23 17:22:29', 'check_out', '2026-06-23 17:22:30', '2026-06-23 17:22:30'),
(774, 6, 416, NULL, 11.6483836, 104.9074772, 11.40, 0.00, '2026-06-23 17:23:18', 'check_out', '2026-06-23 17:23:19', '2026-06-23 17:23:19'),
(775, 3, 420, NULL, 11.6483390, 104.9075000, 19.97, 0.00, '2026-06-23 18:04:42', 'check_out', '2026-06-23 18:04:42', '2026-06-23 18:04:42'),
(776, 15, 413, NULL, 11.6483692, 104.9074174, 35.00, 0.00, '2026-06-23 18:05:44', 'check_out', '2026-06-23 18:05:44', '2026-06-23 18:05:44'),
(777, 14, 412, NULL, 11.6483703, 104.9075086, 17.58, 0.00, '2026-06-23 18:13:52', 'check_out', '2026-06-23 18:13:52', '2026-06-23 18:13:52'),
(778, 4, 414, NULL, 11.6484156, 104.9074553, 8.57, 0.00, '2026-06-23 18:14:01', 'check_out', '2026-06-23 18:14:02', '2026-06-23 18:14:02'),
(779, 13, 417, NULL, 11.6484622, 104.9074500, 10.84, 0.00, '2026-06-23 19:54:34', 'check_out', '2026-06-23 19:54:35', '2026-06-23 19:54:35'),
(780, 12, 418, NULL, 11.6483478, 104.9074518, 6.84, 0.00, '2026-06-23 19:54:50', 'check_out', '2026-06-23 19:54:51', '2026-06-23 19:54:51'),
(781, 9, 411, NULL, 11.6484057, 104.9074673, 8.28, 0.00, '2026-06-23 19:55:55', 'check_out', '2026-06-23 19:55:56', '2026-06-23 19:55:56'),
(782, 8, 421, NULL, 11.6484335, 104.9074710, 19.62, 0.00, '2026-06-24 08:17:43', 'check_in', '2026-06-24 08:17:43', '2026-06-24 08:17:43'),
(783, 16, 422, NULL, 11.6483878, 104.9074594, 19.98, 0.00, '2026-06-24 08:19:20', 'check_in', '2026-06-24 08:19:21', '2026-06-24 08:19:21'),
(784, 17, 423, NULL, 14.1884365, 103.5218983, 24.79, 0.00, '2026-06-24 08:21:46', 'check_in', '2026-06-24 08:21:48', '2026-06-24 08:21:48'),
(785, 15, 424, NULL, 11.6483687, 104.9074165, 35.00, 0.00, '2026-06-24 08:54:06', 'check_in', '2026-06-24 08:54:07', '2026-06-24 08:54:07'),
(786, 14, 425, NULL, 11.6484203, 104.9074672, 13.92, 0.00, '2026-06-24 08:58:33', 'check_in', '2026-06-24 08:58:34', '2026-06-24 08:58:34'),
(787, 12, 426, NULL, 11.6483972, 104.9074177, 14.00, 0.00, '2026-06-24 09:13:33', 'check_in', '2026-06-24 09:13:34', '2026-06-24 09:13:34'),
(788, 13, 427, NULL, 11.6484356, 104.9073996, 14.00, 0.00, '2026-06-24 09:13:33', 'check_in', '2026-06-24 09:13:34', '2026-06-24 09:13:34'),
(789, 9, 428, NULL, 11.6484058, 104.9074674, 8.30, 0.00, '2026-06-24 09:14:27', 'check_in', '2026-06-24 09:14:28', '2026-06-24 09:14:28'),
(790, 5, 429, NULL, 11.6484420, 104.9075268, 11.71, 2.00, '2026-06-24 09:18:59', 'check_in', '2026-06-24 09:19:00', '2026-06-24 09:19:00'),
(791, 21, 430, NULL, 14.1758169, 103.5174961, 4.57, 15.43, '2026-06-24 09:24:34', 'check_in', '2026-06-24 09:24:35', '2026-06-24 09:24:35'),
(792, 6, 431, NULL, 11.6483836, 104.9074772, 11.40, 0.00, '2026-06-24 09:28:23', 'check_in', '2026-06-24 09:28:24', '2026-06-24 09:28:24'),
(793, 3, 432, NULL, 11.6483763, 104.9074583, 20.00, 0.00, '2026-06-24 09:30:34', 'check_in', '2026-06-24 09:30:35', '2026-06-24 09:30:35'),
(794, 21, 430, NULL, 13.3970137, 103.8640671, 1414.00, 0.00, '2026-06-24 21:31:43', 'check_out', '2026-06-24 21:31:44', '2026-06-24 21:31:44'),
(795, 16, 433, NULL, 11.6483858, 104.9074582, 19.99, 0.00, '2026-06-25 08:28:24', 'check_in', '2026-06-25 08:28:24', '2026-06-25 08:28:24'),
(796, 8, 434, NULL, 11.6483701, 104.9074860, 12.34, 0.00, '2026-06-25 08:29:45', 'check_in', '2026-06-25 08:29:46', '2026-06-25 08:29:46'),
(797, 9, 435, NULL, 11.6484099, 104.9074669, 8.88, 0.00, '2026-06-25 08:30:03', 'check_in', '2026-06-25 08:30:03', '2026-06-25 08:30:03'),
(798, 14, 436, NULL, 11.6482889, 104.9075324, 36.61, 3.47, '2026-06-25 08:56:23', 'check_in', '2026-06-25 08:56:23', '2026-06-25 08:56:23'),
(799, 15, 437, NULL, 11.6484210, 104.9073946, 35.00, 0.00, '2026-06-25 09:10:17', 'check_in', '2026-06-25 09:10:18', '2026-06-25 09:10:18'),
(800, 13, 438, NULL, 11.6484319, 104.9074448, 12.52, 0.00, '2026-06-25 09:11:45', 'check_in', '2026-06-25 09:11:46', '2026-06-25 09:11:46'),
(801, 12, 439, NULL, 11.6484123, 104.9074235, 14.40, 0.00, '2026-06-25 09:12:16', 'check_in', '2026-06-25 09:12:17', '2026-06-25 09:12:17'),
(802, 6, 440, NULL, 11.6483836, 104.9074772, 11.40, 0.00, '2026-06-25 09:19:38', 'check_in', '2026-06-25 09:19:38', '2026-06-25 09:19:38'),
(803, 5, 441, NULL, 11.6484062, 104.9074610, 14.77, 0.00, '2026-06-25 09:23:53', 'check_in', '2026-06-25 09:23:54', '2026-06-25 09:23:54'),
(804, 3, 442, NULL, 11.6483814, 104.9074624, 8.88, 0.00, '2026-06-25 09:26:17', 'check_in', '2026-06-25 09:26:18', '2026-06-25 09:26:18'),
(805, 21, 443, NULL, 13.3894972, 103.8687385, 80.46, 0.00, '2026-06-25 09:51:47', 'check_in', '2026-06-25 09:51:47', '2026-06-25 09:51:47'),
(806, 17, 444, NULL, 13.2880550, 103.8121250, 6.50, 0.00, '2026-06-25 10:58:55', 'check_in', '2026-06-25 10:58:56', '2026-06-25 10:58:56'),
(807, 4, 445, NULL, 11.6484156, 104.9074553, 8.57, 0.00, '2026-06-25 12:18:59', 'check_in', '2026-06-25 12:19:00', '2026-06-25 12:19:00'),
(808, 16, 433, NULL, 11.6483475, 104.9074660, 12.96, 0.00, '2026-06-25 17:01:16', 'check_out', '2026-06-25 17:01:17', '2026-06-25 17:01:17'),
(809, 5, 441, NULL, 11.6484006, 104.9074554, 14.63, 0.00, '2026-06-25 17:12:49', 'check_out', '2026-06-25 17:12:50', '2026-06-25 17:12:50'),
(810, 6, 440, NULL, 11.6483836, 104.9074772, 12.01, 0.00, '2026-06-25 17:13:19', 'check_out', '2026-06-25 17:13:20', '2026-06-25 17:13:20'),
(811, 13, 438, NULL, 11.6484319, 104.9074448, 12.52, 0.00, '2026-06-25 17:14:25', 'check_out', '2026-06-25 17:14:26', '2026-06-25 17:14:26'),
(812, 4, 445, NULL, 11.6484156, 104.9074553, 8.57, 0.00, '2026-06-25 17:21:22', 'check_out', '2026-06-25 17:21:23', '2026-06-25 17:21:23'),
(813, 15, 437, NULL, 11.6484091, 104.9074487, 35.00, 0.00, '2026-06-25 17:21:30', 'check_out', '2026-06-25 17:21:30', '2026-06-25 17:21:30'),
(814, 3, 442, NULL, 11.6483815, 104.9074617, 12.07, 0.00, '2026-06-25 17:23:49', 'check_out', '2026-06-25 17:23:49', '2026-06-25 17:23:49'),
(815, 8, 434, NULL, 11.6484344, 104.9074061, 18.92, 0.00, '2026-06-25 17:26:51', 'check_out', '2026-06-25 17:26:51', '2026-06-25 17:26:51'),
(816, 14, 436, NULL, 11.6484010, 104.9074561, 19.47, 0.00, '2026-06-25 18:00:36', 'check_out', '2026-06-25 18:00:36', '2026-06-25 18:00:36'),
(817, 12, 439, NULL, 11.6483497, 104.9074545, 6.60, 0.00, '2026-06-25 18:27:31', 'check_out', '2026-06-25 18:27:31', '2026-06-25 18:27:31'),
(818, 9, 435, NULL, 11.6484099, 104.9074669, 8.88, 0.00, '2026-06-25 18:39:57', 'check_out', '2026-06-25 18:39:57', '2026-06-25 18:39:57'),
(819, 16, 446, NULL, 11.6483886, 104.9074602, 19.85, 0.00, '2026-06-26 08:03:35', 'check_in', '2026-06-26 08:03:37', '2026-06-26 08:03:37'),
(820, 8, 447, NULL, 11.6484344, 104.9074061, 18.92, 0.00, '2026-06-26 08:19:54', 'check_in', '2026-06-26 08:19:55', '2026-06-26 08:19:55'),
(821, 9, 448, NULL, 11.6484099, 104.9074669, 8.88, 0.00, '2026-06-26 08:30:53', 'check_in', '2026-06-26 08:30:54', '2026-06-26 08:30:54'),
(822, 15, 449, NULL, 11.6483346, 104.9074466, 35.00, 0.00, '2026-06-26 08:49:35', 'check_in', '2026-06-26 08:49:35', '2026-06-26 08:49:35'),
(823, 12, 450, NULL, 11.6483497, 104.9074545, 6.60, 0.00, '2026-06-26 09:06:21', 'check_in', '2026-06-26 09:06:23', '2026-06-26 09:06:23'),
(824, 14, 451, NULL, 11.6483708, 104.9075101, 17.61, 0.00, '2026-06-26 09:07:34', 'check_in', '2026-06-26 09:07:35', '2026-06-26 09:07:35'),
(825, 13, 452, NULL, 11.6484508, 104.9074436, 9.77, 0.00, '2026-06-26 09:07:35', 'check_in', '2026-06-26 09:07:36', '2026-06-26 09:07:36'),
(826, 17, 453, NULL, 13.3585426, 103.8852193, 21.98, 0.91, '2026-06-26 09:16:29', 'check_in', '2026-06-26 09:16:30', '2026-06-26 09:16:30'),
(827, 5, 454, NULL, 11.6484062, 104.9074610, 15.36, 0.00, '2026-06-26 09:18:07', 'check_in', '2026-06-26 09:18:08', '2026-06-26 09:18:08'),
(828, 19, 455, NULL, 11.6483955, 104.9074308, 19.99, 0.00, '2026-06-26 09:21:52', 'check_in', '2026-06-26 09:21:52', '2026-06-26 09:21:52'),
(829, 6, 456, NULL, 11.6483836, 104.9074772, 12.01, 0.00, '2026-06-26 09:35:43', 'check_in', '2026-06-26 09:35:44', '2026-06-26 09:35:44'),
(830, 3, 457, NULL, 11.6483852, 104.9074631, 14.58, 0.00, '2026-06-26 09:42:02', 'check_in', '2026-06-26 09:42:03', '2026-06-26 09:42:03'),
(831, 21, 458, NULL, 13.3512202, 103.9361516, 12.06, 15.71, '2026-06-26 10:11:49', 'check_in', '2026-06-26 10:11:50', '2026-06-26 10:11:50'),
(832, 16, 446, NULL, 11.6483811, 104.9074567, 18.39, 0.00, '2026-06-26 17:03:54', 'check_out', '2026-06-26 17:03:55', '2026-06-26 17:03:55'),
(833, 6, 456, NULL, 11.6483836, 104.9074772, 12.01, 0.00, '2026-06-26 17:07:19', 'check_out', '2026-06-26 17:07:20', '2026-06-26 17:07:20'),
(834, 8, 447, NULL, 11.6484344, 104.9074061, 18.92, 0.00, '2026-06-26 17:12:23', 'check_out', '2026-06-26 17:12:24', '2026-06-26 17:12:24'),
(835, 5, 454, NULL, 11.6484062, 104.9074610, 15.36, 0.00, '2026-06-26 17:34:44', 'check_out', '2026-06-26 17:34:45', '2026-06-26 17:34:45'),
(836, 15, 449, NULL, 11.6483897, 104.9074386, 29.78, 0.00, '2026-06-26 17:42:32', 'check_out', '2026-06-26 17:42:33', '2026-06-26 17:42:33'),
(837, 3, 457, NULL, 11.6483818, 104.9074768, 19.99, 0.00, '2026-06-26 17:45:20', 'check_out', '2026-06-26 17:45:20', '2026-06-26 17:45:20'),
(838, 14, 451, NULL, 11.6483706, 104.9075105, 19.08, 0.00, '2026-06-26 18:05:41', 'check_out', '2026-06-26 18:05:42', '2026-06-26 18:05:42'),
(839, 13, 452, NULL, 11.6484319, 104.9074448, 12.52, 0.00, '2026-06-26 18:11:35', 'check_out', '2026-06-26 18:11:36', '2026-06-26 18:11:36'),
(840, 12, 450, NULL, 11.6483497, 104.9074545, 6.60, 0.00, '2026-06-26 18:12:17', 'check_out', '2026-06-26 18:12:18', '2026-06-26 18:12:18'),
(841, 19, 455, NULL, 11.6483727, 104.9074793, 7.24, 0.00, '2026-06-26 18:12:45', 'check_out', '2026-06-26 18:12:46', '2026-06-26 18:12:46'),
(842, 9, 448, NULL, 11.6484099, 104.9074669, 8.88, 0.00, '2026-06-26 18:13:08', 'check_out', '2026-06-26 18:13:09', '2026-06-26 18:13:09'),
(843, 16, 459, NULL, 11.6483935, 104.9074730, 5.00, 0.59, '2026-06-27 08:32:03', 'check_in', '2026-06-27 08:32:04', '2026-06-27 08:32:04'),
(844, 9, 460, NULL, 11.6484099, 104.9074669, 8.88, 0.00, '2026-06-27 08:41:37', 'check_in', '2026-06-27 08:41:37', '2026-06-27 08:41:37'),
(845, 8, 461, NULL, 11.6484085, 104.9074657, 10.14, 0.00, '2026-06-27 09:01:07', 'check_in', '2026-06-27 09:01:08', '2026-06-27 09:01:08'),
(846, 14, 462, NULL, 11.6484086, 104.9074208, 14.85, 0.26, '2026-06-27 09:16:37', 'check_in', '2026-06-27 09:16:38', '2026-06-27 09:16:38'),
(847, 5, 463, NULL, 11.6483871, 104.9074993, 14.00, 0.07, '2026-06-27 09:23:21', 'check_in', '2026-06-27 09:23:21', '2026-06-27 09:23:21'),
(848, 4, 464, NULL, 11.6484534, 104.9074464, 16.19, 0.00, '2026-06-27 09:24:40', 'check_in', '2026-06-27 09:24:41', '2026-06-27 09:24:41'),
(849, 3, 465, NULL, 11.6483809, 104.9074688, 27.40, 0.00, '2026-06-27 09:29:37', 'check_in', '2026-06-27 09:29:38', '2026-06-27 09:29:38'),
(850, 12, 466, NULL, 11.6484059, 104.9074090, 18.03, 0.00, '2026-06-27 09:33:18', 'check_in', '2026-06-27 09:33:18', '2026-06-27 09:33:18'),
(851, 13, 467, NULL, 11.6483762, 104.9074405, 12.14, 0.00, '2026-06-27 09:33:56', 'check_in', '2026-06-27 09:33:57', '2026-06-27 09:33:57'),
(852, 15, 468, NULL, 11.6483833, 104.9074355, 29.78, 0.00, '2026-06-27 09:35:00', 'check_in', '2026-06-27 09:35:00', '2026-06-27 09:35:00'),
(853, 21, 469, NULL, 13.3895481, 103.8715598, 58.24, 0.00, '2026-06-27 09:39:44', 'check_in', '2026-06-27 09:39:45', '2026-06-27 09:39:45'),
(854, 17, 470, NULL, 13.3895317, 103.8709783, 6.20, 2.39, '2026-06-27 11:11:09', 'check_in', '2026-06-27 11:11:09', '2026-06-27 11:11:09');

-- --------------------------------------------------------

--
-- Table structure for table `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` tinyint(3) UNSIGNED NOT NULL,
  `reserved_at` int(10) UNSIGNED DEFAULT NULL,
  `available_at` int(10) UNSIGNED NOT NULL,
  `created_at` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `job_batches`
--

CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `late_deduction_rules`
--

CREATE TABLE `late_deduction_rules` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `rule_name` varchar(100) NOT NULL,
  `grace_minutes` int(11) NOT NULL DEFAULT 0,
  `from_minutes` int(11) NOT NULL,
  `to_minutes` int(11) DEFAULT NULL,
  `deduction_type` enum('none','fixed','percentage','half_day','full_day') NOT NULL DEFAULT 'fixed',
  `deduction_amount` decimal(10,2) DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT 1,
  `telegram_chat_id` varchar(120) DEFAULT NULL,
  `telegram_topic_id` int(10) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `late_deduction_rules`
--

INSERT INTO `late_deduction_rules` (`id`, `rule_name`, `grace_minutes`, `from_minutes`, `to_minutes`, `deduction_type`, `deduction_amount`, `status`, `telegram_chat_id`, `telegram_topic_id`, `created_at`, `updated_at`) VALUES
(1, 'Late 1–15 Minutes', 0, 1, 15, 'none', NULL, 0, NULL, NULL, '2026-05-18 18:36:54', '2026-05-21 10:44:48'),
(2, 'Late 30min', 0, 31, 60, 'fixed', 1.50, 0, '-1002364635031', 1627, '2026-05-18 18:36:54', '2026-05-26 16:37:23'),
(3, 'Late 1hours', 0, 61, NULL, 'fixed', 3.00, 0, '-1002364635031', 1627, '2026-05-18 18:36:54', '2026-05-26 16:37:26'),
(5, '30 min', 0, 31, 60, 'fixed', 1.50, 1, '-1002364635031', 1627, '2026-05-24 20:28:27', '2026-05-24 20:30:00'),
(6, '1 h 30', 0, 61, NULL, 'none', NULL, 1, '-1002364635031', 1627, '2026-05-24 20:29:44', '2026-05-24 20:30:10');

-- --------------------------------------------------------

--
-- Table structure for table `late_deduction_rule_work_schedule`
--

CREATE TABLE `late_deduction_rule_work_schedule` (
  `late_deduction_rule_id` bigint(20) UNSIGNED NOT NULL,
  `work_schedule_id` bigint(20) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `late_deduction_rule_work_schedule`
--

INSERT INTO `late_deduction_rule_work_schedule` (`late_deduction_rule_id`, `work_schedule_id`) VALUES
(5, 1),
(6, 1),
(2, 2),
(3, 2),
(5, 2),
(6, 2),
(5, 3),
(6, 3);

-- --------------------------------------------------------

--
-- Table structure for table `late_rules`
--

CREATE TABLE `late_rules` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `work_start_time` time NOT NULL DEFAULT '08:00:00',
  `grace_minutes` smallint(5) UNSIGNED NOT NULL DEFAULT 15,
  `auto_mark_late` tinyint(1) NOT NULL DEFAULT 1,
  `notify_admin` tinyint(1) NOT NULL DEFAULT 1,
  `auto_apply_deduction` tinyint(1) NOT NULL DEFAULT 1,
  `include_in_payroll` tinyint(1) NOT NULL DEFAULT 1,
  `notify_employee` tinyint(1) NOT NULL DEFAULT 0,
  `exclude_on_holidays` tinyint(1) NOT NULL DEFAULT 0,
  `preview_check_in` time NOT NULL DEFAULT '08:35:00',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `late_rules`
--

INSERT INTO `late_rules` (`id`, `work_start_time`, `grace_minutes`, `auto_mark_late`, `notify_admin`, `auto_apply_deduction`, `include_in_payroll`, `notify_employee`, `exclude_on_holidays`, `preview_check_in`, `created_at`, `updated_at`) VALUES
(1, '08:00:00', 60, 1, 1, 1, 1, 1, 0, '09:33:00', '2026-05-18 18:36:56', '2026-05-21 21:29:37');

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000000_create_users_table', 1),
(2, '0001_01_01_000001_create_cache_table', 1),
(3, '0001_01_01_000002_create_jobs_table', 1),
(4, '2026_05_15_114828_create_personal_access_tokens_table', 1),
(5, '2026_05_15_120000_create_attendance_domain_tables', 1),
(6, '2026_05_16_000001_add_address_to_employees_table', 1),
(7, '2026_05_16_000002_make_employee_last_name_nullable', 1),
(8, '2026_05_16_000003_seed_role_permission_system', 1),
(9, '2026_05_16_000004_map_legacy_roles_to_permissions', 1),
(10, '2026_05_16_000005_create_default_super_admin_user', 1),
(11, '2026_05_16_000007_create_role_ip_addresses_table', 1),
(12, '2026_05_17_000001_add_permission_request_permissions', 1),
(13, '2026_05_17_000002_add_address_to_attendance_table', 1),
(14, '2026_05_17_000003_create_permission_requests_table', 1),
(15, '2026_05_17_000004_add_profile_update_permissions', 1),
(16, '2026_05_17_000005_remove_demo_accounts', 1),
(17, '2026_05_17_000006_create_telegram_destinations_table', 1),
(18, '2026_05_17_000007_add_access_flags_to_employees_table', 1),
(19, '2026_05_17_000008_create_system_settings_table', 1),
(20, '2026_05_18_000001_sync_menu_permissions', 1),
(21, '2026_05_18_000002_migrate_to_dot_notation_permissions', 1),
(22, '2026_05_18_000003_create_attendance_rules_table', 1),
(23, '2026_05_18_000004_create_work_schedules_table', 1),
(24, '2026_05_18_000005_create_late_deduction_rules_table', 1),
(25, '2026_05_18_000006_add_late_columns_to_attendances_table', 1),
(26, '2026_05_18_000007_add_deduction_automation_to_attendance_rules_table', 1),
(27, '2026_05_18_000008_create_late_rules_table', 1),
(28, '2026_05_18_000009_create_telegram_notification_system_tables', 1),
(29, '2026_05_18_000010_add_request_date_end_to_permission_requests_table', 1),
(30, '2026_05_18_000011_create_bonus_system_tables', 1),
(31, '2026_05_18_000012_add_attendance_report_permissions', 1),
(32, '2026_05_18_000013_add_request_create_to_manager_roles', 1),
(33, '2026_05_18_000014_update_telegram_templates_to_khmer', 1),
(34, '2026_05_20_000001_add_telegram_chat_id_to_employees_table', 2),
(35, '2026_05_21_000001_add_telegram_fields_to_late_deduction_rules_table', 3),
(36, '2026_05_21_000002_create_branches_table', 4),
(37, '2026_05_22_000001_add_schedule_id_to_late_deduction_rules_table', 5),
(38, '2026_05_24_000001_add_send_photo_to_telegram_destinations_table', 6),
(39, '2026_05_24_000002_add_province_to_customer_visits_table', 6),
(40, '2026_05_24_000003_add_visit_log_fields_to_telegram_logs_table', 6),
(41, '2026_05_26_000001_add_automation_times_to_attendance_rules_table', 7),
(42, '2026_05_26_000001_create_late_rule_schedule_pivot_table', 7),
(43, '2026_05_27_000001_add_require_ip_restriction_to_employees_table', 8),
(44, '2026_05_27_000001_create_permission_types_table', 8),
(45, '2026_05_27_000002_add_attendance_reminder_settings_to_attendance_rules_table', 8),
(46, '2026_05_27_000003_create_payroll_module_tables', 8),
(47, '2026_05_27_000004_add_duration_and_attachment_to_permission_requests_table', 8),
(48, '2026_05_27_000005_add_replacement_employee_to_permission_requests_table', 8),
(49, '2026_05_27_000006_add_employee_report_permissions', 8),
(50, '2026_06_03_000001_add_duration_controls_to_permission_types_table', 9),
(51, '2026_06_03_000002_sync_core_permission_request_types', 9),
(52, '2026_06_03_000003_split_missing_check_in_out_labels', 9);

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `type` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `payload` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`payload`)),
  `read_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `notifications`
--

INSERT INTO `notifications` (`id`, `user_id`, `type`, `title`, `message`, `payload`, `read_at`, `created_at`, `updated_at`) VALUES
(1, NULL, 'permission_request', 'New Permission Request: PR-2026-0001', 'Super Admin submitted a Early Leave for 18 May 2026', '{\"request_id\":1,\"request_code\":\"PR-2026-0001\",\"status\":\"pending\"}', '2026-05-18 21:53:54', '2026-05-18 21:46:31', '2026-05-18 21:53:54'),
(2, 1, 'permission_request', 'Permission Request PR-2026-0001 Approved', 'Your Early Leave has been Approved by Super Admin.', '{\"request_id\":1,\"request_code\":\"PR-2026-0001\",\"status\":\"approved\"}', '2026-05-18 21:55:48', '2026-05-18 21:46:49', '2026-05-18 21:55:48'),
(3, 4, 'admin_message', 'hello', 'please check out the attendance', '{\"sent_by\":1,\"target\":\"user\"}', '2026-05-21 21:13:24', '2026-05-21 20:05:20', '2026-05-21 21:13:24'),
(4, 4, 'admin_message', 'Test', 'hi', '{\"sent_by\":1,\"target\":\"user\"}', '2026-05-21 21:19:44', '2026-05-21 21:05:23', '2026-05-21 21:19:44'),
(5, 4, 'admin_message', 'Test', 'hi', '{\"sent_by\":1,\"target\":\"user\"}', '2026-05-21 21:19:43', '2026-05-21 21:06:18', '2026-05-21 21:19:43'),
(6, NULL, 'permission_request', 'New Permission Request: PR-2026-0002', 'Tha Sopheak submitted a Missing Check Out for 19 May 2026', '{\"request_id\":2,\"request_code\":\"PR-2026-0002\",\"status\":\"pending\"}', '2026-05-22 07:49:50', '2026-05-21 21:50:02', '2026-05-22 07:49:50'),
(7, NULL, 'permission_request', 'New Permission Request: PR-2026-0003', 'Tha Sopheak submitted a Missing Check Out for 19 May 2026', '{\"request_id\":3,\"request_code\":\"PR-2026-0003\",\"status\":\"pending\"}', '2026-05-22 07:49:53', '2026-05-21 21:50:04', '2026-05-22 07:49:53'),
(8, 4, 'permission_request', 'Permission Request PR-2026-0003 Rejected', 'Your Missing Check Out has been Rejected by Super Admin.', '{\"request_id\":3,\"request_code\":\"PR-2026-0003\",\"status\":\"rejected\"}', NULL, '2026-05-21 22:02:50', '2026-05-21 22:02:50'),
(9, 4, 'permission_request', 'Permission Request PR-2026-0002 Approved', 'Your Missing Check Out has been Approved by Super Admin.', '{\"request_id\":2,\"request_code\":\"PR-2026-0002\",\"status\":\"approved\"}', NULL, '2026-05-21 22:03:02', '2026-05-21 22:03:02'),
(10, 8, 'admin_message', 'Test', 'Hello b', '{\"sent_by\":1,\"target\":\"user\"}', NULL, '2026-05-22 15:21:07', '2026-05-22 15:21:07'),
(11, 10, 'admin_message', 'Test', 'Hi', '{\"sent_by\":1,\"target\":\"user\"}', NULL, '2026-05-23 10:15:06', '2026-05-23 10:15:06'),
(12, 1, 'admin_message', 'Test', 'hi', '{\"sent_by\":1,\"target\":\"user\"}', NULL, '2026-05-25 08:46:30', '2026-05-25 08:46:30'),
(13, 1, 'admin_message', 'hello', 'hi', '{\"sent_by\":1,\"target\":\"user\"}', NULL, '2026-05-25 08:46:58', '2026-05-25 08:46:58'),
(14, 1, 'admin_message', 'hi', 'hi1234567890', '{\"sent_by\":1,\"target\":\"user\"}', NULL, '2026-05-25 08:47:57', '2026-05-25 08:47:57'),
(15, NULL, 'permission_request', 'New Permission Request: PR-2026-0004', 'Gak Vicheka submitted a Leave Request for 06 Jun 2026 – 07 Jun 2026', '{\"request_id\":4,\"request_code\":\"PR-2026-0004\",\"status\":\"pending\"}', '2026-05-26 09:14:07', '2026-05-25 16:36:55', '2026-05-26 09:14:07'),
(16, 4, 'admin_message', 'Hi', 'C bay', '{\"sent_by\":1,\"target\":\"user\"}', NULL, '2026-05-27 13:54:57', '2026-05-27 13:54:57'),
(17, 4, 'admin_message', 'fast message', 'Mk room meeting tix\nhurry up', '{\"sent_by\":1,\"target\":\"user\"}', NULL, '2026-05-27 15:42:52', '2026-05-27 15:42:52'),
(18, NULL, 'admin_message', 'lern', 'lern lern', '{\"sent_by\":1,\"target\":\"all\"}', '2026-05-31 13:21:49', '2026-05-27 15:43:04', '2026-05-31 13:21:49'),
(19, 4, 'admin_message', 'bro pheak', 'pheak', '{\"sent_by\":1,\"target\":\"user\"}', '2026-05-31 13:21:50', '2026-05-27 15:43:50', '2026-05-31 13:21:50'),
(20, 4, 'admin_message', 'Hi', 'Tv yk Evan pg', '{\"sent_by\":1,\"target\":\"user\"}', '2026-05-31 13:21:48', '2026-05-31 13:21:42', '2026-05-31 13:21:48'),
(21, NULL, 'permission_request', 'New Permission Request: PR-2026-0005', 'Chean Aleav submitted a Personal Permission for 01 Jun 2026 08:00 - 10:00 (2.00 hour(s))', '{\"request_id\":5,\"request_code\":\"PR-2026-0005\",\"status\":\"pending\"}', '2026-06-01 16:22:43', '2026-05-31 21:49:11', '2026-06-01 16:22:43'),
(22, 13, 'permission_request', 'Permission Request PR-2026-0005 Approved', 'Your Personal Permission has been Approved by Super Admin.', '{\"request_id\":5,\"request_code\":\"PR-2026-0005\",\"status\":\"approved\"}', NULL, '2026-05-31 22:00:19', '2026-05-31 22:00:19'),
(23, NULL, 'permission_request', 'New Permission Request: PR-2026-0006', 'Heng Laiheang submitted a Personal Permission for 01 Jun 2026 16:30 - 17:00 (0.50 hour(s))', '{\"request_id\":6,\"request_code\":\"PR-2026-0006\",\"status\":\"pending\"}', '2026-06-01 16:22:45', '2026-06-01 16:21:16', '2026-06-01 16:22:45'),
(24, 19, 'permission_request', 'Permission Request PR-2026-0006 Approved', 'Your Personal Permission has been Approved by Super Admin.', '{\"request_id\":6,\"request_code\":\"PR-2026-0006\",\"status\":\"approved\"}', NULL, '2026-06-01 16:32:41', '2026-06-01 16:32:41'),
(25, NULL, 'permission_request', 'New Permission Request: PR-2026-0007', 'Heng Laiheang submitted a Personal Permission for 02 Jun 2026 16:40 - 17:00 (0.33 hour(s))', '{\"request_id\":7,\"request_code\":\"PR-2026-0007\",\"status\":\"pending\"}', NULL, '2026-06-02 14:37:11', '2026-06-02 14:37:11'),
(26, 19, 'permission_request', 'Permission Request PR-2026-0007 Approved', 'Your Personal Permission has been Approved by Super Admin.', '{\"request_id\":7,\"request_code\":\"PR-2026-0007\",\"status\":\"approved\"}', NULL, '2026-06-02 15:56:34', '2026-06-02 15:56:34'),
(27, 6, 'permission_request', 'Permission Request PR-2026-0004 Approved', 'Your Day Off has been Approved by Super Admin.', '{\"request_id\":4,\"request_code\":\"PR-2026-0004\",\"status\":\"approved\"}', NULL, '2026-06-06 09:36:07', '2026-06-06 09:36:07'),
(28, NULL, 'permission_request', 'New Permission Request: PR-2026-0008', 'Heng Laiheang submitted a Late Check In for 08 Jun 2026 16:30 - 17:00 (0.50 hour(s))', '{\"request_id\":8,\"request_code\":\"PR-2026-0008\",\"status\":\"pending\"}', '2026-06-11 10:21:31', '2026-06-08 14:04:10', '2026-06-11 10:21:31'),
(29, 19, 'permission_request', 'Permission Request PR-2026-0008 Approved', 'Your Late Check In has been Approved by Super Admin.', '{\"request_id\":8,\"request_code\":\"PR-2026-0008\",\"status\":\"approved\"}', NULL, '2026-06-08 15:52:44', '2026-06-08 15:52:44'),
(30, NULL, 'permission_request', 'New Permission Request: PR-2026-0009', 'Gak Vicheka submitted a Late Check In for 16 Jun 2026 15:00 - 17:00 (2.00 hour(s))', '{\"request_id\":9,\"request_code\":\"PR-2026-0009\",\"status\":\"pending\"}', NULL, '2026-06-16 09:42:16', '2026-06-16 09:42:16'),
(31, NULL, 'permission_request', 'New Permission Request: PR-2026-0010', 'Tha Sopheak submitted a Late Check In for 17 Jun 2026 11:47 - 12:47 (1.00 hour(s))', '{\"request_id\":10,\"request_code\":\"PR-2026-0010\",\"status\":\"pending\"}', '2026-06-18 08:59:16', '2026-06-17 11:47:17', '2026-06-18 08:59:16');

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `payrolls`
--

CREATE TABLE `payrolls` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `month` date NOT NULL,
  `status` enum('draft','pending','approved','paid','locked') NOT NULL DEFAULT 'draft',
  `total_base_salary` decimal(14,2) NOT NULL DEFAULT 0.00,
  `total_bonus` decimal(14,2) NOT NULL DEFAULT 0.00,
  `total_deductions` decimal(14,2) NOT NULL DEFAULT 0.00,
  `total_overtime` decimal(14,2) NOT NULL DEFAULT 0.00,
  `total_commission` decimal(14,2) NOT NULL DEFAULT 0.00,
  `total_net_salary` decimal(14,2) NOT NULL DEFAULT 0.00,
  `generated_by` bigint(20) UNSIGNED DEFAULT NULL,
  `approved_by` bigint(20) UNSIGNED DEFAULT NULL,
  `paid_by` bigint(20) UNSIGNED DEFAULT NULL,
  `generated_at` timestamp NULL DEFAULT NULL,
  `approved_at` timestamp NULL DEFAULT NULL,
  `paid_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `payroll_items`
--

CREATE TABLE `payroll_items` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `payroll_id` bigint(20) UNSIGNED NOT NULL,
  `employee_id` bigint(20) UNSIGNED NOT NULL,
  `salary_setup_id` bigint(20) UNSIGNED DEFAULT NULL,
  `salary_type` enum('monthly','daily','commission_only') NOT NULL DEFAULT 'monthly',
  `base_salary` decimal(12,2) NOT NULL DEFAULT 0.00,
  `present_days` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `late_days` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `absent_days` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `half_days` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `missing_checkout_days` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `overtime_hours` decimal(8,2) NOT NULL DEFAULT 0.00,
  `sales_amount` decimal(14,2) NOT NULL DEFAULT 0.00,
  `bonus_amount` decimal(12,2) NOT NULL DEFAULT 0.00,
  `deduction_amount` decimal(12,2) NOT NULL DEFAULT 0.00,
  `advance_amount` decimal(12,2) NOT NULL DEFAULT 0.00,
  `overtime_amount` decimal(12,2) NOT NULL DEFAULT 0.00,
  `commission_amount` decimal(12,2) NOT NULL DEFAULT 0.00,
  `net_salary` decimal(12,2) NOT NULL DEFAULT 0.00,
  `bonus_breakdown` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`bonus_breakdown`)),
  `deduction_breakdown` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`deduction_breakdown`)),
  `commission_breakdown` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`commission_breakdown`)),
  `attendance_snapshot` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`attendance_snapshot`)),
  `status` enum('draft','pending','approved','paid') NOT NULL DEFAULT 'draft',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `payroll_logs`
--

CREATE TABLE `payroll_logs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `payroll_id` bigint(20) UNSIGNED DEFAULT NULL,
  `payroll_item_id` bigint(20) UNSIGNED DEFAULT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `action` varchar(255) NOT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `permissions`
--

CREATE TABLE `permissions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `group` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `permissions`
--

INSERT INTO `permissions` (`id`, `name`, `slug`, `group`, `created_at`, `updated_at`) VALUES
(74, 'Admin Dashboard', 'dashboard.admin', 'dashboard', '2026-05-18 18:36:43', '2026-05-18 18:36:43'),
(75, 'Employee Dashboard', 'dashboard.employee', 'dashboard', '2026-05-18 18:36:43', '2026-05-18 18:36:43'),
(76, 'View All Attendance', 'attendance.view_all', 'attendance', '2026-05-18 18:36:43', '2026-05-18 18:36:43'),
(77, 'View Own Attendance', 'attendance.view_own', 'attendance', '2026-05-18 18:36:43', '2026-05-18 18:36:43'),
(78, 'Check In', 'attendance.check_in', 'attendance', '2026-05-18 18:36:43', '2026-05-18 18:36:43'),
(79, 'Check Out', 'attendance.check_out', 'attendance', '2026-05-18 18:36:43', '2026-05-18 18:36:43'),
(80, 'Edit Attendance', 'attendance.edit', 'attendance', '2026-05-18 18:36:43', '2026-05-18 18:36:43'),
(81, 'View Visits', 'visits.view', 'visits', '2026-05-18 18:36:43', '2026-05-18 18:36:43'),
(82, 'Add Visit', 'visits.create', 'visits', '2026-05-18 18:36:43', '2026-05-18 18:36:43'),
(83, 'Edit Visit', 'visits.update', 'visits', '2026-05-18 18:36:43', '2026-05-18 18:36:43'),
(84, 'Manage Visits', 'visits.manage', 'visits', '2026-05-18 18:36:43', '2026-05-18 18:36:43'),
(85, 'View Own Reports', 'reports.view_own', 'reports', '2026-05-18 18:36:43', '2026-05-18 18:36:43'),
(86, 'View All Reports', 'reports.view_all', 'reports', '2026-05-18 18:36:43', '2026-05-18 18:36:43'),
(87, 'Submit Report', 'reports.create', 'reports', '2026-05-18 18:36:43', '2026-05-18 18:36:43'),
(88, 'Export Reports', 'reports.export', 'reports', '2026-05-18 18:36:43', '2026-05-18 18:36:43'),
(89, 'View GPS Tracking', 'gps.view', 'gps', '2026-05-18 18:36:43', '2026-05-18 18:36:43'),
(90, 'Live Locations', 'gps.live', 'gps', '2026-05-18 18:36:43', '2026-05-18 18:36:43'),
(91, 'Route History', 'gps.history', 'gps', '2026-05-18 18:36:43', '2026-05-18 18:36:43'),
(92, 'Track Own Location', 'gps.track', 'gps', '2026-05-18 18:36:43', '2026-05-18 18:36:43'),
(93, 'View All Requests', 'requests.view_all', 'requests', '2026-05-18 18:36:43', '2026-05-18 18:36:43'),
(94, 'View Own Requests', 'requests.view_own', 'requests', '2026-05-18 18:36:43', '2026-05-18 18:36:43'),
(95, 'Submit Request', 'requests.create', 'requests', '2026-05-18 18:36:43', '2026-05-18 18:36:43'),
(96, 'Approve / Reject', 'requests.approve', 'requests', '2026-05-18 18:36:43', '2026-05-18 18:36:43'),
(97, 'Update Own Profile', 'profile.update_own', 'profile', '2026-05-18 18:36:43', '2026-05-18 18:36:43'),
(98, 'Update All Profiles', 'profile.update_all', 'profile', '2026-05-18 18:36:43', '2026-05-18 18:36:43'),
(99, 'View Notifications', 'notifications.view', 'notifications', '2026-05-18 18:36:43', '2026-05-18 18:36:43'),
(100, 'Manage Notifications', 'notifications.manage', 'notifications', '2026-05-18 18:36:43', '2026-05-18 18:36:43'),
(101, 'View Employees', 'employees.view', 'employees', '2026-05-18 18:36:43', '2026-05-18 18:36:43'),
(102, 'Add Employee', 'employees.create', 'employees', '2026-05-18 18:36:43', '2026-05-18 18:36:43'),
(103, 'Edit Employee', 'employees.update', 'employees', '2026-05-18 18:36:43', '2026-05-18 18:36:43'),
(104, 'Delete Employee', 'employees.delete', 'employees', '2026-05-18 18:36:43', '2026-05-18 18:36:43'),
(105, 'View Departments', 'departments.view', 'departments', '2026-05-18 18:36:43', '2026-05-18 18:36:43'),
(106, 'Manage Departments', 'departments.manage', 'departments', '2026-05-18 18:36:43', '2026-05-18 18:36:43'),
(107, 'View Positions', 'positions.view', 'positions', '2026-05-18 18:36:43', '2026-05-18 18:36:43'),
(108, 'Manage Positions', 'positions.manage', 'positions', '2026-05-18 18:36:43', '2026-05-18 18:36:43'),
(109, 'View Sales', 'sales.view', 'sales', '2026-05-18 18:36:43', '2026-05-18 18:36:43'),
(110, 'Manage Sales', 'sales.manage', 'sales', '2026-05-18 18:36:43', '2026-05-18 18:36:43'),
(111, 'Manage Roles', 'roles.manage', 'roles', '2026-05-18 18:36:43', '2026-05-18 18:36:43'),
(112, 'Manage Permissions', 'permissions.manage', 'permissions', '2026-05-18 18:36:43', '2026-05-18 18:36:43'),
(113, 'View Settings', 'settings.view', 'settings', '2026-05-18 18:36:43', '2026-05-18 18:36:43'),
(114, 'Security Settings', 'settings.security', 'settings', '2026-05-18 18:36:43', '2026-05-18 18:36:43'),
(115, 'API Keys', 'settings.api', 'settings', '2026-05-18 18:36:43', '2026-05-18 18:36:43'),
(116, 'Manage Settings', 'settings.manage', 'settings', '2026-05-18 18:36:43', '2026-05-18 18:36:43'),
(117, 'Manage Schedules', 'settings.schedules', 'settings', '2026-05-18 18:36:43', '2026-05-18 18:36:43'),
(118, 'View All Attendance Reports', 'reports.attendance.view_all', 'reports', '2026-05-18 18:36:59', '2026-05-18 18:36:59'),
(119, 'View Own Attendance Reports', 'reports.attendance.view_own', 'reports', '2026-05-18 18:36:59', '2026-05-18 18:36:59'),
(120, 'Edit Attendance Reports', 'reports.attendance.edit', 'reports', '2026-05-18 18:36:59', '2026-05-18 18:36:59'),
(121, 'Export Attendance Reports', 'reports.attendance.export', 'reports', '2026-05-18 18:36:59', '2026-05-18 18:36:59'),
(122, 'View All Payroll', 'payroll.view_all', 'payroll', '2026-05-27 17:42:53', '2026-05-27 17:42:53'),
(123, 'View Own Payslips', 'payroll.view_own', 'payroll', '2026-05-27 17:42:53', '2026-05-27 17:42:53'),
(124, 'Generate Payroll', 'payroll.create', 'payroll', '2026-05-27 17:42:53', '2026-05-27 17:42:53'),
(125, 'Update Payroll', 'payroll.update', 'payroll', '2026-05-27 17:42:53', '2026-05-27 17:42:53'),
(126, 'Approve Payroll', 'payroll.approve', 'payroll', '2026-05-27 17:42:53', '2026-05-27 17:42:53'),
(127, 'Mark Payroll Paid', 'payroll.pay', 'payroll', '2026-05-27 17:42:53', '2026-05-27 17:42:53'),
(128, 'Export Payroll', 'payroll.export', 'payroll', '2026-05-27 17:42:53', '2026-05-27 17:42:53'),
(129, 'View All Employee Monthly Reports', 'employee_report.view_all', 'reports', '2026-05-27 17:42:54', '2026-05-27 17:42:54'),
(130, 'View Own Employee Monthly Report', 'employee_report.view_own', 'reports', '2026-05-27 17:42:54', '2026-05-27 17:42:54'),
(131, 'Export Employee Monthly Reports', 'employee_report.export', 'reports', '2026-05-27 17:42:54', '2026-05-27 17:42:54');

-- --------------------------------------------------------

--
-- Table structure for table `permission_requests`
--

CREATE TABLE `permission_requests` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `employee_id` bigint(20) UNSIGNED NOT NULL,
  `replacement_employee_id` bigint(20) UNSIGNED DEFAULT NULL,
  `request_code` varchar(32) NOT NULL,
  `type` varchar(255) NOT NULL,
  `request_date` date NOT NULL,
  `request_date_end` date DEFAULT NULL,
  `request_time` varchar(20) DEFAULT NULL,
  `start_time` varchar(20) DEFAULT NULL,
  `end_time` varchar(20) DEFAULT NULL,
  `total_hours` decimal(8,2) DEFAULT NULL,
  `total_days` int(10) UNSIGNED DEFAULT NULL,
  `day_part` varchar(20) DEFAULT NULL,
  `reason` text NOT NULL,
  `note` text DEFAULT NULL,
  `attachment_path` varchar(255) DEFAULT NULL,
  `attachment_name` varchar(255) DEFAULT NULL,
  `attachment_mime` varchar(255) DEFAULT NULL,
  `duration_type` varchar(20) NOT NULL DEFAULT 'single_day',
  `status` varchar(255) NOT NULL DEFAULT 'pending',
  `is_emergency` tinyint(1) NOT NULL DEFAULT 0,
  `gps_location` varchar(255) DEFAULT NULL,
  `admin_notes` text DEFAULT NULL,
  `reviewed_by` bigint(20) UNSIGNED DEFAULT NULL,
  `reviewed_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `permission_requests`
--

INSERT INTO `permission_requests` (`id`, `employee_id`, `replacement_employee_id`, `request_code`, `type`, `request_date`, `request_date_end`, `request_time`, `start_time`, `end_time`, `total_hours`, `total_days`, `day_part`, `reason`, `note`, `attachment_path`, `attachment_name`, `attachment_mime`, `duration_type`, `status`, `is_emergency`, `gps_location`, `admin_notes`, `reviewed_by`, `reviewed_at`, `created_at`, `updated_at`) VALUES
(1, 1, NULL, 'PR-2026-0001', 'Early Check Out', '2026-05-18', '2026-05-18', '21:46', NULL, NULL, NULL, NULL, NULL, 'jg tv gym b', NULL, NULL, NULL, NULL, 'single_day', 'approved', 1, NULL, 'Approved.', 1, '2026-05-18 21:46:49', '2026-05-18 21:46:31', '2026-05-18 21:46:49'),
(2, 4, NULL, 'PR-2026-0002', 'Missing Check Out', '2026-05-19', '2026-05-19', '21:49', NULL, NULL, NULL, NULL, NULL, 'Forgot to check out in date 19.05.205', NULL, NULL, NULL, NULL, 'single_day', 'approved', 0, NULL, 'Approved.', 1, '2026-05-21 22:03:02', '2026-05-21 21:50:02', '2026-05-21 22:03:02'),
(3, 4, NULL, 'PR-2026-0003', 'Missing Check Out', '2026-05-19', '2026-05-19', '21:49', NULL, NULL, NULL, NULL, NULL, 'Forgot to check out in date 19.05.205', NULL, NULL, NULL, NULL, 'single_day', 'rejected', 0, NULL, 'Rejected.', 1, '2026-05-21 22:02:50', '2026-05-21 21:50:04', '2026-05-21 22:02:50'),
(4, 6, NULL, 'PR-2026-0004', 'Day Off', '2026-06-06', '2026-06-07', NULL, NULL, NULL, NULL, NULL, NULL, 'go to trip at province', NULL, NULL, NULL, NULL, 'single_day', 'approved', 0, NULL, 'Approved.', 1, '2026-06-06 09:36:07', '2026-05-25 16:36:55', '2026-06-06 09:36:07'),
(5, 13, 13, 'PR-2026-0005', 'Personal Request', '2026-06-01', '2026-06-01', '08:00', '08:00', '10:00', 2.00, 1, NULL, 'សុំច្បាប់បង ទៅពេទ្យធ្មេញ2ម៉ោង', NULL, NULL, NULL, NULL, 'hours', 'approved', 0, NULL, 'Approved.', 1, '2026-05-31 22:00:19', '2026-05-31 21:49:11', '2026-05-31 22:00:19'),
(6, 19, NULL, 'PR-2026-0006', 'Personal Request', '2026-06-01', '2026-06-01', '16:30', '16:30', '17:00', 0.50, 1, NULL, 'សួស្ដីបង ដោយសារញុមជាប់ប្រឡង ដូច្នេះសុំច្បាប់ចេញមុនចំនួន30mnបង', NULL, NULL, NULL, NULL, 'hours', 'approved', 0, NULL, 'Approved.', 1, '2026-06-01 16:32:41', '2026-06-01 16:21:16', '2026-06-01 16:32:41'),
(7, 19, NULL, 'PR-2026-0007', 'Personal Request', '2026-06-02', '2026-06-02', '16:40', '16:40', '17:00', 0.33, 1, NULL, 'សួស្ដីបង ដោយសារញុមជាប់ប្រឡងនៅពេលល្ងាចនេះ ញុមសុំច្បាប់ចេញមុន20នាទីបង', NULL, NULL, NULL, NULL, 'hours', 'approved', 0, NULL, 'Approved.', 1, '2026-06-02 15:56:34', '2026-06-02 14:37:11', '2026-06-02 15:56:34'),
(9, 6, 3, 'PR-2026-0009', 'Late Check In', '2026-06-16', '2026-06-16', '15:00', '15:00', '17:00', 2.00, 1, NULL, 'មានទៅក្រៅធុរក្រៅ', NULL, NULL, NULL, NULL, 'hours', 'pending', 0, NULL, 'Submitted and waiting for approval.', NULL, NULL, '2026-06-16 09:42:16', '2026-06-16 09:42:16'),
(10, 4, NULL, 'PR-2026-0010', 'Late Check In', '2026-06-17', '2026-06-17', '11:47', '11:47', '12:47', 1.00, 1, NULL, 'Dear Boss, I would like to request a day off today due to a personal matter. Thank you for your understanding.', NULL, NULL, NULL, NULL, 'hours', 'pending', 0, NULL, 'Submitted and waiting for approval.', NULL, NULL, '2026-06-17 11:47:17', '2026-06-17 11:47:17');

-- --------------------------------------------------------

--
-- Table structure for table `permission_role`
--

CREATE TABLE `permission_role` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `role_id` bigint(20) UNSIGNED NOT NULL,
  `permission_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `permission_role`
--

INSERT INTO `permission_role` (`id`, `role_id`, `permission_id`, `created_at`, `updated_at`) VALUES
(125, 2, 80, '2026-05-18 18:36:43', '2026-05-18 18:36:43'),
(126, 2, 76, '2026-05-18 18:36:43', '2026-05-18 18:36:43'),
(127, 2, 74, '2026-05-18 18:36:43', '2026-05-18 18:36:43'),
(128, 2, 106, '2026-05-18 18:36:43', '2026-05-18 18:36:43'),
(129, 2, 105, '2026-05-18 18:36:43', '2026-05-18 18:36:43'),
(130, 2, 102, '2026-05-18 18:36:43', '2026-05-18 18:36:43'),
(131, 2, 104, '2026-05-18 18:36:43', '2026-05-18 18:36:43'),
(132, 2, 103, '2026-05-18 18:36:43', '2026-05-18 18:36:43'),
(133, 2, 101, '2026-05-18 18:36:43', '2026-05-18 18:36:43'),
(134, 2, 90, '2026-05-18 18:36:43', '2026-05-18 18:36:43'),
(135, 2, 89, '2026-05-18 18:36:43', '2026-05-18 18:36:43'),
(136, 2, 100, '2026-05-18 18:36:43', '2026-05-18 18:36:43'),
(137, 2, 112, '2026-05-18 18:36:43', '2026-05-18 18:36:43'),
(138, 2, 108, '2026-05-18 18:36:43', '2026-05-18 18:36:43'),
(139, 2, 107, '2026-05-18 18:36:43', '2026-05-18 18:36:43'),
(140, 2, 98, '2026-05-18 18:36:43', '2026-05-18 18:36:43'),
(141, 2, 97, '2026-05-18 18:36:43', '2026-05-18 18:36:43'),
(142, 2, 88, '2026-05-18 18:36:43', '2026-05-18 18:36:43'),
(143, 2, 86, '2026-05-18 18:36:43', '2026-05-18 18:36:43'),
(144, 2, 96, '2026-05-18 18:36:43', '2026-05-18 18:36:43'),
(145, 2, 95, '2026-05-18 18:36:43', '2026-05-18 18:36:43'),
(146, 2, 93, '2026-05-18 18:36:43', '2026-05-18 18:36:43'),
(147, 2, 111, '2026-05-18 18:36:43', '2026-05-18 18:36:43'),
(148, 2, 116, '2026-05-18 18:36:43', '2026-05-18 18:36:43'),
(149, 2, 114, '2026-05-18 18:36:43', '2026-05-18 18:36:43'),
(150, 2, 113, '2026-05-18 18:36:43', '2026-05-18 18:36:43'),
(151, 2, 84, '2026-05-18 18:36:43', '2026-05-18 18:36:43'),
(152, 2, 81, '2026-05-18 18:36:43', '2026-05-18 18:36:43'),
(153, 3, 80, '2026-05-18 18:36:43', '2026-05-18 18:36:43'),
(154, 3, 76, '2026-05-18 18:36:43', '2026-05-18 18:36:43'),
(155, 3, 74, '2026-05-18 18:36:43', '2026-05-18 18:36:43'),
(156, 3, 106, '2026-05-18 18:36:43', '2026-05-18 18:36:43'),
(157, 3, 105, '2026-05-18 18:36:43', '2026-05-18 18:36:43'),
(158, 3, 102, '2026-05-18 18:36:43', '2026-05-18 18:36:43'),
(159, 3, 103, '2026-05-18 18:36:43', '2026-05-18 18:36:43'),
(160, 3, 101, '2026-05-18 18:36:43', '2026-05-18 18:36:43'),
(161, 3, 108, '2026-05-18 18:36:43', '2026-05-18 18:36:43'),
(162, 3, 107, '2026-05-18 18:36:43', '2026-05-18 18:36:43'),
(163, 3, 98, '2026-05-18 18:36:43', '2026-05-18 18:36:43'),
(164, 3, 97, '2026-05-18 18:36:43', '2026-05-18 18:36:43'),
(165, 3, 86, '2026-05-18 18:36:43', '2026-05-18 18:36:43'),
(166, 3, 96, '2026-05-18 18:36:43', '2026-05-18 18:36:43'),
(167, 3, 95, '2026-05-18 18:36:43', '2026-05-18 18:36:43'),
(168, 3, 93, '2026-05-18 18:36:43', '2026-05-18 18:36:43'),
(169, 4, 74, '2026-05-18 18:36:43', '2026-05-18 18:36:43'),
(170, 4, 91, '2026-05-18 18:36:43', '2026-05-18 18:36:43'),
(171, 4, 90, '2026-05-18 18:36:43', '2026-05-18 18:36:43'),
(172, 4, 89, '2026-05-18 18:36:43', '2026-05-18 18:36:43'),
(173, 4, 97, '2026-05-18 18:36:43', '2026-05-18 18:36:43'),
(174, 4, 88, '2026-05-18 18:36:43', '2026-05-18 18:36:43'),
(175, 4, 86, '2026-05-18 18:36:43', '2026-05-18 18:36:43'),
(176, 4, 96, '2026-05-18 18:36:43', '2026-05-18 18:36:43'),
(177, 4, 95, '2026-05-18 18:36:43', '2026-05-18 18:36:43'),
(178, 4, 93, '2026-05-18 18:36:43', '2026-05-18 18:36:43'),
(179, 4, 110, '2026-05-18 18:36:43', '2026-05-18 18:36:43'),
(180, 4, 109, '2026-05-18 18:36:43', '2026-05-18 18:36:43'),
(181, 4, 84, '2026-05-18 18:36:43', '2026-05-18 18:36:43'),
(182, 4, 81, '2026-05-18 18:36:43', '2026-05-18 18:36:43'),
(183, 5, 76, '2026-05-18 18:36:43', '2026-05-18 18:36:43'),
(184, 5, 74, '2026-05-18 18:36:43', '2026-05-18 18:36:43'),
(185, 5, 97, '2026-05-18 18:36:43', '2026-05-18 18:36:43'),
(186, 5, 88, '2026-05-18 18:36:43', '2026-05-18 18:36:43'),
(187, 5, 86, '2026-05-18 18:36:43', '2026-05-18 18:36:43'),
(188, 6, 78, '2026-05-18 18:36:43', '2026-05-18 18:36:43'),
(189, 6, 79, '2026-05-18 18:36:43', '2026-05-18 18:36:43'),
(190, 6, 77, '2026-05-18 18:36:43', '2026-05-18 18:36:43'),
(191, 6, 75, '2026-05-18 18:36:43', '2026-05-18 18:36:43'),
(192, 6, 92, '2026-05-18 18:36:43', '2026-05-18 18:36:43'),
(194, 6, 99, '2026-05-18 18:36:43', '2026-05-18 18:36:43'),
(195, 6, 97, '2026-05-18 18:36:43', '2026-05-18 18:36:43'),
(196, 6, 87, '2026-05-18 18:36:43', '2026-05-18 18:36:43'),
(197, 6, 85, '2026-05-18 18:36:43', '2026-05-18 18:36:43'),
(198, 6, 95, '2026-05-18 18:36:43', '2026-05-18 18:36:43'),
(199, 6, 94, '2026-05-18 18:36:43', '2026-05-18 18:36:43'),
(200, 6, 82, '2026-05-18 18:36:43', '2026-05-18 18:36:43'),
(201, 6, 81, '2026-05-18 18:36:43', '2026-05-18 18:36:43'),
(202, 7, 78, '2026-05-18 18:36:43', '2026-05-18 18:36:43'),
(203, 7, 79, '2026-05-18 18:36:43', '2026-05-18 18:36:43'),
(204, 7, 77, '2026-05-18 18:36:43', '2026-05-18 18:36:43'),
(205, 7, 75, '2026-05-18 18:36:43', '2026-05-18 18:36:43'),
(206, 7, 99, '2026-05-18 18:36:43', '2026-05-18 18:36:43'),
(207, 7, 97, '2026-05-18 18:36:43', '2026-05-18 18:36:43'),
(208, 7, 95, '2026-05-18 18:36:43', '2026-05-18 18:36:43'),
(209, 7, 94, '2026-05-18 18:36:43', '2026-05-18 18:36:43'),
(210, 8, 78, '2026-05-18 18:36:43', '2026-05-18 18:36:43'),
(211, 8, 79, '2026-05-18 18:36:43', '2026-05-18 18:36:43'),
(212, 8, 77, '2026-05-18 18:36:43', '2026-05-18 18:36:43'),
(213, 8, 75, '2026-05-18 18:36:43', '2026-05-18 18:36:43'),
(214, 8, 99, '2026-05-18 18:36:43', '2026-05-18 18:36:43'),
(215, 8, 97, '2026-05-18 18:36:43', '2026-05-18 18:36:43'),
(216, 8, 95, '2026-05-18 18:36:43', '2026-05-18 18:36:43'),
(217, 8, 94, '2026-05-18 18:36:43', '2026-05-18 18:36:43'),
(218, 9, 78, '2026-05-18 18:36:43', '2026-05-18 18:36:43'),
(219, 9, 79, '2026-05-18 18:36:43', '2026-05-18 18:36:43'),
(220, 9, 77, '2026-05-18 18:36:43', '2026-05-18 18:36:43'),
(221, 9, 75, '2026-05-18 18:36:43', '2026-05-18 18:36:43'),
(222, 9, 91, '2026-05-18 18:36:43', '2026-05-18 18:36:43'),
(223, 9, 92, '2026-05-18 18:36:43', '2026-05-18 18:36:43'),
(224, 9, 89, '2026-05-18 18:36:43', '2026-05-18 18:36:43'),
(225, 9, 99, '2026-05-18 18:36:43', '2026-05-18 18:36:43'),
(226, 9, 97, '2026-05-18 18:36:43', '2026-05-18 18:36:43'),
(227, 9, 95, '2026-05-18 18:36:43', '2026-05-18 18:36:43'),
(228, 9, 94, '2026-05-18 18:36:43', '2026-05-18 18:36:43'),
(229, 2, 120, NULL, NULL),
(230, 2, 121, NULL, NULL),
(231, 2, 118, NULL, NULL),
(232, 3, 120, NULL, NULL),
(233, 3, 121, NULL, NULL),
(234, 3, 118, NULL, NULL),
(235, 5, 121, NULL, NULL),
(236, 5, 118, NULL, NULL),
(237, 4, 121, NULL, NULL),
(238, 4, 118, NULL, NULL),
(239, 6, 121, NULL, NULL),
(240, 6, 119, NULL, NULL),
(241, 7, 121, NULL, NULL),
(242, 7, 119, NULL, NULL),
(243, 8, 121, NULL, NULL),
(244, 8, 119, NULL, NULL),
(245, 9, 121, NULL, NULL),
(246, 9, 119, NULL, NULL),
(249, 7, 83, '2026-05-21 21:44:40', '2026-05-21 21:44:40'),
(256, 5, 126, '2026-05-27 17:42:53', '2026-05-27 17:42:53'),
(257, 5, 124, '2026-05-27 17:42:53', '2026-05-27 17:42:53'),
(258, 5, 128, '2026-05-27 17:42:53', '2026-05-27 17:42:53'),
(259, 5, 127, '2026-05-27 17:42:53', '2026-05-27 17:42:53'),
(260, 5, 125, '2026-05-27 17:42:53', '2026-05-27 17:42:53'),
(261, 5, 122, '2026-05-27 17:42:53', '2026-05-27 17:42:53'),
(262, 5, 123, '2026-05-27 17:42:53', '2026-05-27 17:42:53'),
(263, 2, 126, '2026-05-27 17:42:53', '2026-05-27 17:42:53'),
(264, 2, 124, '2026-05-27 17:42:53', '2026-05-27 17:42:53'),
(265, 2, 128, '2026-05-27 17:42:53', '2026-05-27 17:42:53'),
(266, 2, 127, '2026-05-27 17:42:53', '2026-05-27 17:42:53'),
(267, 2, 125, '2026-05-27 17:42:53', '2026-05-27 17:42:53'),
(268, 2, 122, '2026-05-27 17:42:53', '2026-05-27 17:42:53'),
(269, 2, 123, '2026-05-27 17:42:53', '2026-05-27 17:42:53'),
(270, 3, 126, '2026-05-27 17:42:53', '2026-05-27 17:42:53'),
(271, 3, 124, '2026-05-27 17:42:53', '2026-05-27 17:42:53'),
(272, 3, 128, '2026-05-27 17:42:53', '2026-05-27 17:42:53'),
(273, 3, 127, '2026-05-27 17:42:53', '2026-05-27 17:42:53'),
(274, 3, 125, '2026-05-27 17:42:53', '2026-05-27 17:42:53'),
(275, 3, 122, '2026-05-27 17:42:53', '2026-05-27 17:42:53'),
(276, 3, 123, '2026-05-27 17:42:53', '2026-05-27 17:42:53'),
(277, 1, 126, '2026-05-27 17:42:53', '2026-05-27 17:42:53'),
(278, 1, 124, '2026-05-27 17:42:53', '2026-05-27 17:42:53'),
(279, 1, 128, '2026-05-27 17:42:53', '2026-05-27 17:42:53'),
(280, 1, 127, '2026-05-27 17:42:53', '2026-05-27 17:42:53'),
(281, 1, 125, '2026-05-27 17:42:53', '2026-05-27 17:42:53'),
(282, 1, 122, '2026-05-27 17:42:53', '2026-05-27 17:42:53'),
(283, 1, 123, '2026-05-27 17:42:53', '2026-05-27 17:42:53'),
(284, 9, 123, '2026-05-27 17:42:53', '2026-05-27 17:42:53'),
(287, 8, 123, '2026-05-27 17:42:53', '2026-05-27 17:42:53'),
(288, 2, 131, NULL, NULL),
(289, 2, 129, NULL, NULL),
(290, 3, 131, NULL, NULL),
(291, 3, 129, NULL, NULL),
(292, 5, 131, NULL, NULL),
(293, 5, 129, NULL, NULL),
(294, 4, 131, NULL, NULL),
(295, 4, 129, NULL, NULL),
(296, 6, 131, NULL, NULL),
(297, 6, 130, NULL, NULL),
(298, 7, 131, NULL, NULL),
(299, 7, 130, NULL, NULL),
(300, 8, 131, NULL, NULL),
(301, 8, 130, NULL, NULL),
(302, 9, 131, NULL, NULL),
(303, 9, 130, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `permission_types`
--

CREATE TABLE `permission_types` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `allowed_times` smallint(5) UNSIGNED NOT NULL DEFAULT 1,
  `limit_type` enum('per_day','per_month') NOT NULL DEFAULT 'per_month',
  `duration_control` varchar(20) NOT NULL DEFAULT 'any',
  `max_hours` decimal(5,2) DEFAULT NULL,
  `deduction_amount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `color` varchar(20) NOT NULL DEFAULT '#f59e0b',
  `description` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `permission_types`
--

INSERT INTO `permission_types` (`id`, `name`, `allowed_times`, `limit_type`, `duration_control`, `max_hours`, `deduction_amount`, `color`, `description`, `created_at`, `updated_at`) VALUES
(3, 'Day Off', 1, 'per_month', 'any', NULL, 0.00, '#8b5cf6', 'Request approval for a day off.', '2026-06-03 17:52:57', '2026-06-03 17:52:57'),
(5, 'Late Check In', 1, 'per_month', 'hours', 2.00, 0.00, '#3b82f6', 'Request approval for late arrival.', '2026-06-03 17:52:57', '2026-06-03 17:52:57'),
(6, 'Early Check Out', 5, 'per_month', 'hours', 2.00, 0.00, '#f59e0b', 'Request approval to leave early.', '2026-06-03 17:52:57', '2026-06-08 16:36:09'),
(7, 'Missing Check In', 1, 'per_month', 'hours', NULL, 0.00, '#8b5cf6', 'Request approval for missing check-in records.', '2026-06-03 17:52:57', '2026-06-03 17:52:57'),
(8, 'Personal Request', 1, 'per_month', 'any', NULL, 0.00, '#f97316', 'Request approval for personal matters.', '2026-06-03 17:52:57', '2026-06-03 17:52:57');

-- --------------------------------------------------------

--
-- Table structure for table `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) UNSIGNED NOT NULL,
  `name` text NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `personal_access_tokens`
--

INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES
(1, 'App\\Models\\User', 1, 'attendance-api', '532bdf4450060ac211c7864fbcd823d224e6a00dd4444cc4c4fa3a37a17389fe', '[\"*\"]', NULL, NULL, '2026-05-18 20:29:18', '2026-05-18 20:29:18'),
(2, 'App\\Models\\User', 1, 'attendance-api', 'bcceedf5767cd892d1978e8b8f8a18d1bac4b268ef43984590bc3f0d2f549767', '[\"*\"]', NULL, NULL, '2026-05-18 20:30:53', '2026-05-18 20:30:53'),
(3, 'App\\Models\\User', 1, 'attendance-api', '889904077ec847749a5c33ba4b3a68e528856dabd57dee8da09470b95651272a', '[\"*\"]', NULL, NULL, '2026-05-18 20:30:59', '2026-05-18 20:30:59'),
(4, 'App\\Models\\User', 1, 'attendance-api', '79d5d293faae84995643208c8e7622bbbd17b061e1ea45312b0a87c0a2affa32', '[\"*\"]', NULL, NULL, '2026-05-18 20:31:07', '2026-05-18 20:31:07'),
(5, 'App\\Models\\User', 1, 'attendance-api', '49957580875ec6f5b5dc723ad688c21ddc360e63f4aa4c2a8297dab2e96d43fa', '[\"*\"]', NULL, NULL, '2026-05-18 20:31:57', '2026-05-18 20:31:57'),
(6, 'App\\Models\\User', 1, 'attendance-api', '5afbe61245c67c9b80667d9b5ce3a6f761e37965b56adcb222867d726953dbbe', '[\"*\"]', '2026-05-23 14:18:42', NULL, '2026-05-18 20:34:03', '2026-05-23 14:18:42'),
(7, 'App\\Models\\User', 1, 'attendance-api', 'd538fa65788d26dc8f63c950d85e42bc5233c7e871bb5957430e6ceeccb25f36', '[\"*\"]', '2026-06-03 18:02:37', NULL, '2026-05-18 20:38:17', '2026-06-03 18:02:37'),
(12, 'App\\Models\\User', 4, 'attendance-api', '9b1139c0f8a1c347de09d9f8b321bd97ae1f8b93d917a3263d3edeea7237a0c2', '[\"*\"]', '2026-05-24 09:26:08', NULL, '2026-05-18 22:07:45', '2026-05-24 09:26:08'),
(14, 'App\\Models\\User', 4, 'attendance-api', '8579442559f03c2f659805ad6cd018985252bb2ba5ed9a40d5a73e4b646fba49', '[\"*\"]', '2026-05-18 22:35:51', NULL, '2026-05-18 22:34:23', '2026-05-18 22:35:51'),
(15, 'App\\Models\\User', 4, 'attendance-api', 'cc8c33fcd3afb2599418e9c8f3a9617a2f2f0087506255f28ae25e8c86c74931', '[\"*\"]', '2026-05-26 17:19:42', NULL, '2026-05-18 22:38:34', '2026-05-26 17:19:42'),
(19, 'App\\Models\\User', 3, 'attendance-api', '5921da75d9a927b5bd7ca2542c60bb6a9e1d260dc4c006232e063abe4eb8e24b', '[\"*\"]', '2026-05-22 20:39:34', NULL, '2026-05-18 23:02:26', '2026-05-22 20:39:34'),
(20, 'App\\Models\\User', 1, 'attendance-api', '6df1afd78ed1046d6d1668687819e92b3dd01bf7fa1faf7ad7d9841f2a346d00', '[\"*\"]', '2026-05-18 23:02:52', NULL, '2026-05-18 23:02:51', '2026-05-18 23:02:52'),
(21, 'App\\Models\\User', 3, 'attendance-api', '7b47530d554b80a095ad9a30e9a59f681891685baeaeb7d3ff1dad267f00d41c', '[\"*\"]', '2026-05-18 23:11:03', NULL, '2026-05-18 23:09:08', '2026-05-18 23:11:03'),
(22, 'App\\Models\\User', 8, 'attendance-api', '56385ec5b9b8ded47f4270875447cb58840c740bfff7d730d98f99092ac8d7c4', '[\"*\"]', '2026-05-26 11:22:31', NULL, '2026-05-19 08:25:26', '2026-05-26 11:22:31'),
(23, 'App\\Models\\User', 9, 'attendance-api', '37058988af8e54e5647aa93d70882a5ccba13120aec9d32ba29d2e14cf9677f6', '[\"*\"]', '2026-06-27 08:41:38', NULL, '2026-05-19 08:26:47', '2026-06-27 08:41:38'),
(24, 'App\\Models\\User', 14, 'attendance-api', 'dca62a52ba98d4df74aa777e4924a93a01898d6a3bf10d65e2f6a936bb9d597b', '[\"*\"]', '2026-05-20 13:26:18', NULL, '2026-05-19 08:33:49', '2026-05-20 13:26:18'),
(25, 'App\\Models\\User', 6, 'attendance-api', '6aba5357a27a433888304f66e2c170e05cbcda51b3a016509796a86dee16806b', '[\"*\"]', '2026-05-20 13:24:14', NULL, '2026-05-19 08:44:07', '2026-05-20 13:24:14'),
(26, 'App\\Models\\User', 5, 'attendance-api', '6395782f36fdf1f6ed3f361c3b4c65bdc5e88253656d7f020a529edcdd12c86a', '[\"*\"]', '2026-05-20 13:23:21', NULL, '2026-05-19 08:46:39', '2026-05-20 13:23:21'),
(27, 'App\\Models\\User', 5, 'attendance-api', '8d022cf684ec67ae208cfb43fe224efeb036b52845e500b75e6e283fb9f57cc5', '[\"*\"]', '2026-05-23 17:03:42', NULL, '2026-05-19 08:48:35', '2026-05-23 17:03:42'),
(28, 'App\\Models\\User', 6, 'attendance-api', '0c97ee1a315c7f11ca773ac1c492b877c9e9a8cb1e60dacc7588e672e62ca933', '[\"*\"]', '2026-05-23 17:04:32', NULL, '2026-05-19 08:48:50', '2026-05-23 17:04:32'),
(29, 'App\\Models\\User', 16, 'attendance-api', '74cdc09ce96cecfa5aa387e330f7262a3857ef6f07e1d4a1b0356b13a27c222d', '[\"*\"]', '2026-05-27 17:20:10', NULL, '2026-05-19 08:54:07', '2026-05-27 17:20:10'),
(30, 'App\\Models\\User', 12, 'attendance-api', '0d9a6529e784eb9a2cf581e802efddea5f3c7f21a46d210b42c6e145cae05faa', '[\"*\"]', '2026-05-25 08:59:30', NULL, '2026-05-19 08:54:34', '2026-05-25 08:59:30'),
(31, 'App\\Models\\User', 3, 'attendance-api', '0c3794657967cbb24ce1072734c8377e45c5e05d04f83dd831d934f29a3b1916', '[\"*\"]', '2026-06-27 09:29:39', NULL, '2026-05-19 08:55:00', '2026-06-27 09:29:39'),
(33, 'App\\Models\\User', 3, 'attendance-api', '5b82b9e334e3f56ee5d339b521a5cf238f90f0a23b7202545458c016e4b1558a', '[\"*\"]', '2026-06-20 11:11:12', NULL, '2026-05-19 08:59:19', '2026-06-20 11:11:12'),
(34, 'App\\Models\\User', 1, 'attendance-api', 'f22378fa4514e7a8471cb45348a856cb9c3c7491b608a5fa92527971e98f8a2c', '[\"*\"]', '2026-05-19 09:01:15', NULL, '2026-05-19 09:01:14', '2026-05-19 09:01:15'),
(36, 'App\\Models\\User', 4, 'attendance-api', 'e9e7cf41f79d198e3ed5b7b47cd041b35a2bd416eca30af1205fdf4cb5ca4b10', '[\"*\"]', '2026-05-19 09:32:26', NULL, '2026-05-19 09:31:21', '2026-05-19 09:32:26'),
(39, 'App\\Models\\User', 2, 'attendance-api', '1cc6a8888c926ee0930b2a6510b10534ef81835ebeaaab1d0a5d1e4cecc44623', '[\"*\"]', '2026-05-19 11:05:03', NULL, '2026-05-19 11:05:02', '2026-05-19 11:05:03'),
(40, 'App\\Models\\User', 1, 'attendance-api', '35733897746cd9bd0a095900383cf85c417d9f21a4eb020957bffbfee8560e2d', '[\"*\"]', '2026-05-19 13:20:17', NULL, '2026-05-19 13:17:42', '2026-05-19 13:20:17'),
(41, 'App\\Models\\User', 4, 'attendance-api', 'c188b404b8768f6382fa0575245bd76d315e2a915dd8432e9960807a71316baf', '[\"*\"]', '2026-05-20 13:26:25', NULL, '2026-05-19 13:19:44', '2026-05-20 13:26:25'),
(42, 'App\\Models\\User', 4, 'attendance-api', '8947acc30050048f31118eb4ef6d74b8773d3823b8ca3bef3f854ba8f831c8b9', '[\"*\"]', '2026-05-19 21:44:25', NULL, '2026-05-19 13:22:09', '2026-05-19 21:44:25'),
(43, 'App\\Models\\User', 1, 'attendance-api', '7e320821ed11623c6bb61901f0802354639a8905bed5f7cf5b33766f6d583c6c', '[\"*\"]', '2026-05-19 13:24:50', NULL, '2026-05-19 13:24:16', '2026-05-19 13:24:50'),
(45, 'App\\Models\\User', 1, 'attendance-api', '17cd492b93ad65018916791f11a4c586b083e1c3ad037f377c748e249e689898', '[\"*\"]', '2026-05-19 13:32:41', NULL, '2026-05-19 13:27:37', '2026-05-19 13:32:41'),
(46, 'App\\Models\\User', 4, 'attendance-api', '83117205d58dd37fcfb3b2159844343b69ee611ee1ef8897cb3b7736b74d6162', '[\"*\"]', '2026-05-19 13:44:40', NULL, '2026-05-19 13:43:58', '2026-05-19 13:44:40'),
(47, 'App\\Models\\User', 12, 'attendance-api', '51403d067aa06d4c05e9c19869a1879125689131cb648eefd3e86797aa3ed536', '[\"*\"]', '2026-05-28 22:10:19', NULL, '2026-05-19 18:16:48', '2026-05-28 22:10:19'),
(50, 'App\\Models\\User', 1, 'attendance-api', '6a9d47fba0ba2289bc4f34fa4f1bbf4e6ca897671fb3606a8de24de4f1460d7b', '[\"*\"]', '2026-05-20 13:25:48', NULL, '2026-05-20 13:14:34', '2026-05-20 13:25:48'),
(51, 'App\\Models\\User', 9, 'attendance-api', '61d59244671989d7699bbe6684b7341fb62842ffe7dfc8da815e79326e7f52d2', '[\"*\"]', '2026-05-20 13:25:43', NULL, '2026-05-20 13:25:42', '2026-05-20 13:25:43'),
(52, 'App\\Models\\User', 6, 'attendance-api', '7b04c343f6fed5bb10e5164c673f1c8d9f7ad7669e97c81c7d668b03a8a41432', '[\"*\"]', '2026-05-20 13:26:19', NULL, '2026-05-20 13:26:16', '2026-05-20 13:26:19'),
(54, 'App\\Models\\User', 1, 'attendance-api', '58a3e64b8e7a07193e5206afe35251ea3ca2a403956abc0538a01af554f69dd7', '[\"*\"]', '2026-05-25 08:59:18', NULL, '2026-05-20 13:50:22', '2026-05-25 08:59:18'),
(55, 'App\\Models\\User', 13, 'attendance-api', 'eaff7d9248fc6161cc20f9dab7442ce637bac94ea7767b8860076c164656b23e', '[\"*\"]', '2026-05-28 21:03:55', NULL, '2026-05-20 14:31:36', '2026-05-28 21:03:55'),
(56, 'App\\Models\\User', 14, 'attendance-api', '020226d765de93b46c3dea94ec4ea949c1f7db3e21eddf3181f2788ae53691bb', '[\"*\"]', '2026-05-25 08:59:37', NULL, '2026-05-20 14:32:51', '2026-05-25 08:59:37'),
(57, 'App\\Models\\User', 8, 'attendance-api', '28b8d1a9b101ee9d78b4660659c7ce6208430529f2334e286ab6853b850dc53c', '[\"*\"]', '2026-05-25 08:58:44', NULL, '2026-05-20 14:33:33', '2026-05-25 08:58:44'),
(58, 'App\\Models\\User', 9, 'attendance-api', '7cb53dd2bbc70ccdbb6755d280df709312ce19d29fe2f7230846dc71f7883fdb', '[\"*\"]', '2026-05-20 14:35:28', NULL, '2026-05-20 14:35:28', '2026-05-20 14:35:28'),
(59, 'App\\Models\\User', 12, 'attendance-api', '4cf164474d62fc6bb476e347d582a1bc942e6bb83e559630f41353e8d164e694', '[\"*\"]', '2026-05-26 10:32:04', NULL, '2026-05-20 14:36:13', '2026-05-26 10:32:04'),
(60, 'App\\Models\\User', 10, 'attendance-api', '134f3ed16aa688d8a686079967a8d5bc6d316c523a0e43c97d0245d9146da636', '[\"*\"]', '2026-06-06 18:33:46', NULL, '2026-05-20 14:36:29', '2026-06-06 18:33:46'),
(61, 'App\\Models\\User', 13, 'attendance-api', '89903c91977e8126dc872c548e2f04c2aa316b7f4a486447bb838019c56fa83d', '[\"*\"]', '2026-05-25 08:57:14', NULL, '2026-05-20 14:36:53', '2026-05-25 08:57:14'),
(62, 'App\\Models\\User', 4, 'attendance-api', '598ef32176f93bb9dac0b547bcab7e58d8c70cf249c9a77de3fd3a61dff69cb2', '[\"*\"]', '2026-05-26 20:10:24', NULL, '2026-05-20 14:37:57', '2026-05-26 20:10:24'),
(63, 'App\\Models\\User', 16, 'attendance-api', '93c2727ae27a6a3e289723278bb81aee6d4a1d0df8c58e2531b1cff5a2b1c5d0', '[\"*\"]', '2026-05-27 17:19:08', NULL, '2026-05-20 14:45:58', '2026-05-27 17:19:08'),
(64, 'App\\Models\\User', 1, 'attendance-api', '54dc2a8911b32dcd6a8f939614ef54d30f165ad37966aef50889146a444671b7', '[\"*\"]', '2026-05-24 20:30:18', NULL, '2026-05-20 17:45:48', '2026-05-24 20:30:18'),
(65, 'App\\Models\\User', 1, 'attendance-api', 'b1098407ddc5862c121d5ad7d72f29cf18ae16666f61e7dd373c40a31be752a3', '[\"*\"]', '2026-05-20 18:35:36', NULL, '2026-05-20 18:15:12', '2026-05-20 18:35:36'),
(66, 'App\\Models\\User', 1, 'attendance-api', 'f93305d7fef448d1e28716f515ae7049b7489b7b95d06dcdc8eab714c00bda6d', '[\"*\"]', '2026-05-20 18:46:50', NULL, '2026-05-20 18:22:44', '2026-05-20 18:46:50'),
(67, 'App\\Models\\User', 1, 'attendance-api', '629d1d441e6bcd61092906e9690995ebd2830f26983e2354a3211c096188f217', '[\"*\"]', '2026-05-20 18:36:28', NULL, '2026-05-20 18:25:43', '2026-05-20 18:36:28'),
(68, 'App\\Models\\User', 1, 'attendance-api', '96cfb73796c4c4456805b9a2a6564561923a1721aab9c987bdf2b20aeaf3b5df', '[\"*\"]', '2026-05-20 19:38:19', NULL, '2026-05-20 19:37:53', '2026-05-20 19:38:19'),
(69, 'App\\Models\\User', 9, 'attendance-api', 'db7f712c8a3fe71918d0fcc53fbcf8278840d197d459f54a10d7ed3cec9c6252', '[\"*\"]', '2026-05-20 19:42:52', NULL, '2026-05-20 19:39:43', '2026-05-20 19:42:52'),
(70, 'App\\Models\\User', 9, 'attendance-api', '51d94c496b1144bb2bf1de780b4e304a4fc4dcf584052b711f843386984bca1f', '[\"*\"]', '2026-05-20 19:43:22', NULL, '2026-05-20 19:43:22', '2026-05-20 19:43:22'),
(71, 'App\\Models\\User', 9, 'attendance-api', 'bf3bdd337731a97f8b2dee0b1042861f5ca38955e0f719a8ca8366700305ae72', '[\"*\"]', '2026-05-20 19:44:58', NULL, '2026-05-20 19:44:58', '2026-05-20 19:44:58'),
(72, 'App\\Models\\User', 9, 'attendance-api', 'bc1dce9fcf6e6911d439e1bfaee681294b28aedb6bcb5d3fc34c8c2dc11bafe8', '[\"*\"]', '2026-05-20 19:46:25', NULL, '2026-05-20 19:46:25', '2026-05-20 19:46:25'),
(73, 'App\\Models\\User', 9, 'attendance-api', '2721b8599490d71656d0d434fb43d90411f124ff750cba00612022102f080138', '[\"*\"]', '2026-05-20 19:46:52', NULL, '2026-05-20 19:46:51', '2026-05-20 19:46:52'),
(74, 'App\\Models\\User', 4, 'attendance-api', 'bc96ba20f22f70d1b631c789271e2624c68d4b4abbdcc556d27bd9c85e216262', '[\"*\"]', '2026-05-20 20:01:03', NULL, '2026-05-20 19:58:54', '2026-05-20 20:01:03'),
(75, 'App\\Models\\User', 4, 'attendance-api', '4b4f4746b8d4fe37dae962027dbd50d83e934f290e99044f39d59ab1efffed5e', '[\"*\"]', '2026-05-20 20:04:08', NULL, '2026-05-20 20:04:08', '2026-05-20 20:04:08'),
(76, 'App\\Models\\User', 4, 'attendance-api', '45877a954cceb3b62546271fade8493e904f5628adc6cbec73ca43e1579f559e', '[\"*\"]', '2026-05-20 21:10:08', NULL, '2026-05-20 21:10:06', '2026-05-20 21:10:08'),
(77, 'App\\Models\\User', 1, 'attendance-api', '8b86188ad1713bea2637e846eb01a066a8bf56141eaa008032a600cb8458f412', '[\"*\"]', '2026-05-21 08:43:12', NULL, '2026-05-21 08:30:39', '2026-05-21 08:43:12'),
(78, 'App\\Models\\User', 6, 'attendance-api', '58c7010c53af05d37c6f7587359fe9dd922db9069d4314e5b33cbc7301014b9c', '[\"*\"]', '2026-05-23 08:42:02', NULL, '2026-05-21 08:50:32', '2026-05-23 08:42:02'),
(79, 'App\\Models\\User', 15, 'attendance-api', '55726873f87bf2c40853cc5c6750f22f7f27a69c556d26d0bc4293f88d3a6e7c', '[\"*\"]', '2026-05-21 09:05:34', NULL, '2026-05-21 09:05:23', '2026-05-21 09:05:34'),
(80, 'App\\Models\\User', 15, 'attendance-api', '70cfd5496d94f772b2f28b87f0fbafb5613aea6c0a70760d030a93901ffa8cda', '[\"*\"]', '2026-05-24 00:23:38', NULL, '2026-05-21 17:20:21', '2026-05-24 00:23:38'),
(81, 'App\\Models\\User', 1, 'attendance-api', 'ed282803df461e686039e313f4f0385fc954fa9870f6a9faed30859063166cdf', '[\"*\"]', '2026-05-21 18:55:11', NULL, '2026-05-21 18:54:45', '2026-05-21 18:55:11'),
(82, 'App\\Models\\User', 1, 'attendance-api', 'ed67c6fba2853fb967f334ee038eeccd36e4a72260bb005e19b62ac8fdfdc39c', '[\"*\"]', '2026-05-21 20:29:36', NULL, '2026-05-21 20:27:02', '2026-05-21 20:29:36'),
(83, 'App\\Models\\User', 1, 'attendance-api', '46eb02127af0d7188d237c16e862336bb03754cfb55e9d3f9996fecc4a18668d', '[\"*\"]', '2026-05-21 21:51:19', NULL, '2026-05-21 21:00:52', '2026-05-21 21:51:19'),
(85, 'App\\Models\\User', 18, 'attendance-api', '7afab1399f881bfd483a63fbb325788ff78b30a4bc2d462a62570db7706bb38a', '[\"*\"]', '2026-05-21 21:45:02', NULL, '2026-05-21 21:42:37', '2026-05-21 21:45:02'),
(86, 'App\\Models\\User', 1, 'attendance-api', '6cd8d305ff54eaee1ec2cd0a0a504e138e7a83bac098e0ce54601ac61cb914e2', '[\"*\"]', '2026-05-21 22:09:10', NULL, '2026-05-21 22:01:56', '2026-05-21 22:09:10'),
(87, 'App\\Models\\User', 1, 'attendance-api', '1f5f9928558094b4e4582728fc308a866db2fcc891b3f92abbc4dbf238fd7a7a', '[\"*\"]', '2026-05-22 07:49:54', NULL, '2026-05-22 07:49:07', '2026-05-22 07:49:54'),
(88, 'App\\Models\\User', 1, 'attendance-api', 'f00ba1703fcf1516853be5755c7449a83019f9558d14af1eccfd66e6eee12866', '[\"*\"]', '2026-05-22 13:41:32', NULL, '2026-05-22 13:40:02', '2026-05-22 13:41:32'),
(89, 'App\\Models\\User', 1, 'attendance-api', '3ec99e1a700bc92576934eb6a6fe26d1360b4b90c6e03b08ba876081a6ac607f', '[\"*\"]', '2026-05-22 15:31:44', NULL, '2026-05-22 15:20:12', '2026-05-22 15:31:44'),
(90, 'App\\Models\\User', 1, 'attendance-api', 'fc705de29bd073423be39993d9aea0879fa72945662ac4162656d3c02a443098', '[\"*\"]', '2026-05-22 20:07:30', NULL, '2026-05-22 20:06:24', '2026-05-22 20:07:30'),
(91, 'App\\Models\\User', 1, 'attendance-api', 'b69d514528b1e4d1af2b1cb662d7869cb337d77f448869aae71ebf393f89cdca', '[\"*\"]', '2026-05-22 20:22:11', NULL, '2026-05-22 20:21:23', '2026-05-22 20:22:11'),
(92, 'App\\Models\\User', 1, 'attendance-api', '5b0c2a4cb545dfbc8b0615e63ff9f145fc1c67d901edb8c96a85c30a9d184177', '[\"*\"]', '2026-06-12 22:08:01', NULL, '2026-05-23 09:18:57', '2026-06-12 22:08:01'),
(93, 'App\\Models\\User', 1, 'attendance-api', 'fa4d26c4ddc0920794f4108257cddddce6b8ca7c984dcab29273c78d3262a3a7', '[\"*\"]', '2026-05-23 10:15:08', NULL, '2026-05-23 10:01:56', '2026-05-23 10:15:08'),
(94, 'App\\Models\\User', 1, 'attendance-api', 'a7820577b6b6f7874ed004bb5279d83f66514712b3b7d1b9d77f7d0f8f6752e5', '[\"*\"]', '2026-05-23 10:26:58', NULL, '2026-05-23 10:25:56', '2026-05-23 10:26:58'),
(95, 'App\\Models\\User', 1, 'attendance-api', '59d54a2619dd6f06444408201b7df63c88f46314c2774c33f08021d331a0ce88', '[\"*\"]', '2026-05-23 10:44:31', NULL, '2026-05-23 10:44:06', '2026-05-23 10:44:31'),
(97, 'App\\Models\\User', 4, 'attendance-api', '0f4778151dc9b3da8d5bcda3301317e1aa89fba7d9168671042a7e2909a0331f', '[\"*\"]', '2026-05-23 11:24:42', NULL, '2026-05-23 11:24:32', '2026-05-23 11:24:42'),
(98, 'App\\Models\\User', 1, 'attendance-api', 'd97525c1d3e05b7c7b6290149df5221cfa0725e62279874a5dd82572dcb1f449', '[\"*\"]', '2026-05-23 12:14:51', NULL, '2026-05-23 12:14:39', '2026-05-23 12:14:51'),
(99, 'App\\Models\\User', 1, 'attendance-api', 'fa5ded09a5c2cdf6fcde07f3d57c250366b0ae4f6b04c49acb1168e45e49ae7e', '[\"*\"]', '2026-05-23 13:08:25', NULL, '2026-05-23 13:08:25', '2026-05-23 13:08:25'),
(101, 'App\\Models\\User', 4, 'attendance-api', '34bcf10fddde2729cd6107fd4eca3252aad340244e3963dc8385c3a47220465f', '[\"*\"]', '2026-05-23 14:20:40', NULL, '2026-05-23 14:19:20', '2026-05-23 14:20:40'),
(106, 'App\\Models\\User', 4, 'attendance-api', '85fb71c2eb9cc6afaeb696800d3e2fc94a59f89c75b9bf345a853ea736df5b8a', '[\"*\"]', '2026-05-23 14:32:01', NULL, '2026-05-23 14:27:21', '2026-05-23 14:32:01'),
(109, 'App\\Models\\User', 4, 'attendance-api', 'e86c741cb533ca4b5edb2cc9804412900b635ded865e93a1e39ff4d2bc796593', '[\"*\"]', '2026-05-23 14:46:50', NULL, '2026-05-23 14:45:15', '2026-05-23 14:46:50'),
(110, 'App\\Models\\User', 1, 'attendance-api', 'ad74a83a1adf291112ec0d298dc1000df389c4a20cc6f8b0114ee76a4ffc803b', '[\"*\"]', '2026-05-23 18:02:47', NULL, '2026-05-23 18:02:45', '2026-05-23 18:02:47'),
(111, 'App\\Models\\User', 1, 'attendance-api', '875d12229162ce68469f244b2fc0c26bf4627029aaa78019c8486a24926aa5aa', '[\"*\"]', '2026-05-23 23:59:11', NULL, '2026-05-23 23:53:12', '2026-05-23 23:59:11'),
(112, 'App\\Models\\User', 1, 'attendance-api', '569d36d0288b4bd4382e9e5ec9698a6a576750bef08b9082052c079a6cf0b89f', '[\"*\"]', '2026-05-24 09:37:36', NULL, '2026-05-24 09:32:13', '2026-05-24 09:37:36'),
(113, 'App\\Models\\User', 19, 'attendance-api', 'fe2b9f8f5c40e79e5dc57f5e9dacb1bfdc721bd925f3b1a5fab2e8e4f80411ca', '[\"*\"]', '2026-05-27 12:06:10', NULL, '2026-05-24 09:41:18', '2026-05-27 12:06:10'),
(114, 'App\\Models\\User', 1, 'attendance-api', 'aeefb19cb75d38ce271303f585331de4b6753ee62f903c4d630a54f312b5fe29', '[\"*\"]', '2026-05-24 15:52:56', NULL, '2026-05-24 15:52:55', '2026-05-24 15:52:56'),
(118, 'App\\Models\\User', 20, 'attendance-api', '22d5c72205c7fd35997d32353ef7b5d2eaa79767b53b8ddaeb4241f4986fe958', '[\"*\"]', '2026-05-24 20:16:27', NULL, '2026-05-24 20:12:42', '2026-05-24 20:16:27'),
(119, 'App\\Models\\User', 20, 'attendance-api', '620294739852fff5f7591d4c8bf0cfe4395d96b26b7b1f2832e6ef4aaddee0fd', '[\"*\"]', '2026-05-24 20:38:03', NULL, '2026-05-24 20:30:42', '2026-05-24 20:38:03'),
(120, 'App\\Models\\User', 17, 'attendance-api', '46ba5b1cbc7180fd7f4a52ebdaf5266a7363044491406fa2dc72f7aa64032248', '[\"*\"]', '2026-05-24 20:39:05', NULL, '2026-05-24 20:35:34', '2026-05-24 20:39:05'),
(122, 'App\\Models\\User', 20, 'attendance-api', '02033554e8f43fc08e20a5f306abed26847d5adc0740ecf661319f84cc57e16c', '[\"*\"]', '2026-05-24 20:39:32', NULL, '2026-05-24 20:38:46', '2026-05-24 20:39:32'),
(125, 'App\\Models\\User', 2, 'attendance-api', '9f0160866112763266f64097e23e56365a427d5fb8dede47a8ac92144faa9fc6', '[\"*\"]', NULL, NULL, '2026-05-24 20:57:30', '2026-05-24 20:57:30'),
(128, 'App\\Models\\User', 2, 'attendance-api', '41533731350ce22e7415d5b1e75ada8c5c78cc901644c04d4091175999c5f2e2', '[\"*\"]', NULL, NULL, '2026-05-24 21:00:12', '2026-05-24 21:00:12'),
(129, 'App\\Models\\User', 21, 'attendance-api', '2fb84b0fa7b57b16fc97f5105c60c537baca3a8df7916946b4944bfda4db4478', '[\"*\"]', '2026-06-01 12:23:59', NULL, '2026-05-24 21:00:32', '2026-06-01 12:23:59'),
(131, 'App\\Models\\User', 17, 'attendance-api', 'e4f21711292874f928d3394b9ae46da7432efd9d0b7fb6a64fd1a540b2883642', '[\"*\"]', '2026-06-27 11:11:12', NULL, '2026-05-24 21:06:27', '2026-06-27 11:11:12'),
(132, 'App\\Models\\User', 1, 'attendance-api', 'f08b3b98eae68ccecd2dc0d832ccea3561cce58423b6471b57555bb19bceb82f', '[\"*\"]', '2026-05-24 21:32:31', NULL, '2026-05-24 21:20:23', '2026-05-24 21:32:31'),
(134, 'App\\Models\\User', 20, 'attendance-api', '606be3a45d3bf3e01da1e865ca4dd3e6eea88dc0f41872f8856c871a6136002a', '[\"*\"]', '2026-05-24 22:18:12', NULL, '2026-05-24 22:18:00', '2026-05-24 22:18:12'),
(135, 'App\\Models\\User', 1, 'attendance-api', 'a01e317a888d9101c9994064b918fe261177f5aa2351841dd0bf6999e017ea8d', '[\"*\"]', '2026-05-24 22:55:37', NULL, '2026-05-24 22:54:31', '2026-05-24 22:55:37'),
(136, 'App\\Models\\User', 1, 'attendance-api', '758cadb54f88058a6a517b09aa40fcdd70b90053c9b431949c6bee952dcdcb79', '[\"*\"]', '2026-05-25 08:06:57', NULL, '2026-05-25 08:05:04', '2026-05-25 08:06:57'),
(137, 'App\\Models\\User', 1, 'attendance-api', '92b72e2dd986b9ce7f679d41effbcdd9af58ce2189e7a8508f179d8d00908fd3', '[\"*\"]', '2026-05-25 08:16:17', NULL, '2026-05-25 08:15:49', '2026-05-25 08:16:17'),
(138, 'App\\Models\\User', 6, 'attendance-api', 'daeea7d4f5af6ee097c74b311333ec2d256e3a2557a0ed940a6d02b18844e52c', '[\"*\"]', '2026-05-25 08:59:39', NULL, '2026-05-25 08:53:17', '2026-05-25 08:59:39'),
(139, 'App\\Models\\User', 15, 'attendance-api', 'ef67d2190417d60153f5ec34154a42ff31336cd8a009283b3962f672f3ecea4f', '[\"*\"]', '2026-05-25 08:59:27', NULL, '2026-05-25 08:55:36', '2026-05-25 08:59:27'),
(142, 'App\\Models\\User', 20, 'attendance-api', 'd850cfb9be8eb4a79c9656af740b8e50133bab01f0b4247a2575b750f1362e55', '[\"*\"]', '2026-05-25 09:15:54', NULL, '2026-05-25 09:13:58', '2026-05-25 09:15:54'),
(143, 'App\\Models\\User', 6, 'attendance-api', 'f4a7e7d7611ff2cc07a2b3813e1a9068716996639ddbd7ec10266fc497978c32', '[\"*\"]', '2026-05-26 09:00:45', NULL, '2026-05-25 09:16:44', '2026-05-26 09:00:45'),
(144, 'App\\Models\\User', 12, 'attendance-api', '91f1081ae79d9052e77925bce5041fb6026b702a5e3b91af7f82a1d0ae00c6a1', '[\"*\"]', '2026-05-26 09:01:56', NULL, '2026-05-25 09:17:29', '2026-05-26 09:01:56'),
(145, 'App\\Models\\User', 14, 'attendance-api', '435e45759e9cf1d2b2049a6851eb456002e84d497db1073d4bd8efb44ead8c0d', '[\"*\"]', '2026-05-25 09:17:49', NULL, '2026-05-25 09:17:49', '2026-05-25 09:17:49'),
(146, 'App\\Models\\User', 15, 'attendance-api', '0b3ace7b9adb0340687f93268040cfe9957c74eabe9645e2c9432bbd73413bf9', '[\"*\"]', '2026-05-26 08:27:30', NULL, '2026-05-25 09:17:56', '2026-05-26 08:27:30'),
(147, 'App\\Models\\User', 6, 'attendance-api', 'a4d90dc5d2b06621d6d0477015d132cd943c67ecd0fef532190c03804329b147', '[\"*\"]', '2026-05-26 09:02:04', NULL, '2026-05-25 09:18:05', '2026-05-26 09:02:04'),
(148, 'App\\Models\\User', 8, 'attendance-api', '535cea5c4d3b3c94ec2d37571fd7577e9db8fbc50407467ce62ae99358d9faf6', '[\"*\"]', '2026-06-27 09:01:10', NULL, '2026-05-25 09:18:16', '2026-06-27 09:01:10'),
(149, 'App\\Models\\User', 5, 'attendance-api', '6291ffa0473e6b7696d63124ead3e4624ce1245ddb30018930dbe226233330cb', '[\"*\"]', '2026-06-20 10:39:04', NULL, '2026-05-25 09:20:57', '2026-06-20 10:39:04'),
(152, 'App\\Models\\User', 1, 'attendance-api', '163f5c884f1d07da3b9d68b04df1f67dfbd8fd08f6f8e8b5692871f6f7af6ca6', '[\"*\"]', '2026-05-25 11:09:27', NULL, '2026-05-25 11:08:06', '2026-05-25 11:09:27'),
(153, 'App\\Models\\User', 1, 'attendance-api', '78f275381f78aba3cc0879d9c5f787d516f364729209b53adace0c6de0a35754', '[\"*\"]', '2026-05-25 15:08:28', NULL, '2026-05-25 15:07:52', '2026-05-25 15:08:28'),
(154, 'App\\Models\\User', 1, 'attendance-api', 'b8759342fb5ffb7afcf5849b7ad09f4646f3b4e23960855596866c9982bafa07', '[\"*\"]', '2026-05-25 15:18:40', NULL, '2026-05-25 15:18:11', '2026-05-25 15:18:40'),
(155, 'App\\Models\\User', 5, 'attendance-api', '0405a8d9f100c77a824ac03d14d757c19963c162ec439500fc8dfebdd136b79a', '[\"*\"]', '2026-06-10 00:12:02', NULL, '2026-05-25 17:13:29', '2026-06-10 00:12:02'),
(156, 'App\\Models\\User', 14, 'attendance-api', '83d4bf347f07a2748c7460d2a7b58fcfdd4351dd53531ad69ad6b218e1cfd8b3', '[\"*\"]', '2026-05-26 08:17:26', NULL, '2026-05-25 17:29:43', '2026-05-26 08:17:26'),
(157, 'App\\Models\\User', 13, 'attendance-api', 'fc1fed853615ff0c5fd6b2d259c1cdec7b3882beeed4abf0f39d5fa45ec918ee', '[\"*\"]', '2026-05-26 08:30:11', NULL, '2026-05-25 19:04:55', '2026-05-26 08:30:11'),
(158, 'App\\Models\\User', 17, 'attendance-api', 'e0face807c2b421182dce497495c2f5c92bd4e637b6f8a612360e5ab25e1d317', '[\"*\"]', '2026-05-25 19:29:36', NULL, '2026-05-25 19:29:15', '2026-05-25 19:29:36'),
(159, 'App\\Models\\User', 1, 'attendance-api', '106a52959daad9f6423ebe470ac63bd8e7b88ec629e6c83b633ca28ebd040501', '[\"*\"]', '2026-06-02 15:37:26', NULL, '2026-05-25 20:02:13', '2026-06-02 15:37:26'),
(161, 'App\\Models\\User', 20, 'attendance-api', '2ecc391f336923af377f91f167fad5cd8d20e554fc77264a988f17144b7d6bbf', '[\"*\"]', '2026-05-25 20:23:59', NULL, '2026-05-25 20:23:51', '2026-05-25 20:23:59'),
(162, 'App\\Models\\User', 1, 'attendance-api', '8be8672d8fc847dfee42bb72b78fb005a1c5a3b80e3f4723a7ed41bd17020e9d', '[\"*\"]', '2026-05-25 20:34:47', NULL, '2026-05-25 20:34:22', '2026-05-25 20:34:47'),
(163, 'App\\Models\\User', 1, 'attendance-api', 'b69c7877a8c265bf49b1834ad5560049c6cea1255a078efd3785c21e235c8c5a', '[\"*\"]', '2026-05-25 21:45:17', NULL, '2026-05-25 21:45:16', '2026-05-25 21:45:17'),
(164, 'App\\Models\\User', 1, 'attendance-api', 'd63c2fac368ed5694725e836ff4ce6b0d9e81d2392b74bcf808e746c9febb979', '[\"*\"]', '2026-05-25 21:54:50', NULL, '2026-05-25 21:53:53', '2026-05-25 21:54:50'),
(165, 'App\\Models\\User', 14, 'attendance-api', '7e98cfa9e10702a67c8d86678676b5ccceeb7a5655e22710837873a21d350a82', '[\"*\"]', '2026-05-26 08:25:24', NULL, '2026-05-26 08:22:37', '2026-05-26 08:25:24'),
(166, 'App\\Models\\User', 15, 'attendance-api', '082a9119b16789805d8956810c6b8a51821fe76e037e37a472634e5146ab2ee0', '[\"*\"]', '2026-05-26 08:30:22', NULL, '2026-05-26 08:28:13', '2026-05-26 08:30:22'),
(167, 'App\\Models\\User', 11, 'attendance-api', 'cf9da0266863196bba7c9bcaceed50ce07df91fbef3767a8f2a1b88270b977fb', '[\"*\"]', '2026-05-28 09:23:20', NULL, '2026-05-26 08:57:35', '2026-05-28 09:23:20'),
(168, 'App\\Models\\User', 1, 'attendance-api', 'dfa551ad10298f206c82e114935a748cfe46cb1fe20bf696daab1b7ba38999c1', '[\"*\"]', '2026-05-26 09:08:22', NULL, '2026-05-26 09:08:21', '2026-05-26 09:08:22'),
(169, 'App\\Models\\User', 6, 'attendance-api', '6fb112e17194e568570f658596b865bf0fad603c89bd061164d2f3eeca9349b0', '[\"*\"]', '2026-05-26 09:14:08', NULL, '2026-05-26 09:12:46', '2026-05-26 09:14:08'),
(170, 'App\\Models\\User', 6, 'attendance-api', '124ce2f85cc5f0b92351e10cb5c595e4462d0aad7c6ea24a3afd74da3bd454b8', '[\"*\"]', '2026-06-23 16:26:01', NULL, '2026-05-26 09:14:40', '2026-06-23 16:26:01'),
(171, 'App\\Models\\User', 12, 'attendance-api', 'c1d547db7ac8928e3ea79eabe9457494b77ccbdfc42040112a24db4810d83b73', '[\"*\"]', '2026-06-22 08:48:39', NULL, '2026-05-26 10:15:09', '2026-06-22 08:48:39'),
(172, 'App\\Models\\User', 12, 'attendance-api', 'cd168870136c28a8f20dff8ad29d834b43f121f8852a6d43bf865dd1527ad4ce', '[\"*\"]', '2026-06-11 19:00:15', NULL, '2026-05-26 10:32:37', '2026-06-11 19:00:15'),
(174, 'App\\Models\\User', 12, 'attendance-api', '3f1fac86c05c75e9439cb97fd74ab16cdc8ca216f15ce4a57815d9537633ce50', '[\"*\"]', '2026-05-27 09:13:24', NULL, '2026-05-26 11:11:16', '2026-05-27 09:13:24'),
(176, 'App\\Models\\User', 12, 'attendance-api', '1b0c16a26e633f1b7f1ec3d13a893e816dbb9c9868d3f0ed20f40c75b38cef7b', '[\"*\"]', '2026-05-26 11:21:37', NULL, '2026-05-26 11:20:18', '2026-05-26 11:21:37'),
(177, 'App\\Models\\User', 1, 'attendance-api', '196b7dda416daeb02c222c5fe78748802e651b2785273c7d24530a7502db24af', '[\"*\"]', '2026-05-26 11:28:14', NULL, '2026-05-26 11:24:07', '2026-05-26 11:28:14'),
(178, 'App\\Models\\User', 1, 'attendance-api', '0b1190190709bd47f9a0ad2d4552e8c8fb51b2eb736049f15b099c60252efc8e', '[\"*\"]', '2026-05-26 11:41:04', NULL, '2026-05-26 11:40:07', '2026-05-26 11:41:04'),
(179, 'App\\Models\\User', 1, 'attendance-api', '8d507727571006eb9bd5c8b7befeabe8e5b8d4a2315404a8b9addbade8168b89', '[\"*\"]', '2026-05-26 12:37:50', NULL, '2026-05-26 12:37:49', '2026-05-26 12:37:50'),
(181, 'App\\Models\\User', 13, 'attendance-api', 'cea906895776a16e449ee43a07125c06d0404f8949918d8a5d464cc727c4a6b4', '[\"*\"]', '2026-05-27 21:50:26', NULL, '2026-05-26 12:40:23', '2026-05-27 21:50:26'),
(182, 'App\\Models\\User', 13, 'attendance-api', 'a26855c8a771a46c13fdde7c85bee2536077a9e94f43977e51f7630674cc7878', '[\"*\"]', '2026-05-27 21:48:58', NULL, '2026-05-26 12:40:55', '2026-05-27 21:48:58'),
(183, 'App\\Models\\User', 1, 'attendance-api', '80b9145bc054bdf1c5d3b5161d236353d36c72b99c8ec1d32d3e5b0e0206471a', '[\"*\"]', '2026-06-04 15:05:42', NULL, '2026-05-26 13:48:57', '2026-06-04 15:05:42'),
(186, 'App\\Models\\User', 5, 'attendance-api', 'd06c7b424eefbc2100787685fa12a39f10460684694dfeffc2ee6e10b74ff83c', '[\"*\"]', '2026-06-27 09:23:22', NULL, '2026-05-26 17:19:24', '2026-06-27 09:23:22'),
(187, 'App\\Models\\User', 14, 'attendance-api', 'dd4c0dc7bac079ab6de17c1d8c5eca81b85bce963bf5c9aa4a5b9f05e7056da3', '[\"*\"]', '2026-06-01 17:37:39', NULL, '2026-05-26 17:59:23', '2026-06-01 17:37:39'),
(190, 'App\\Models\\User', 4, 'attendance-api', '80043eb9a3e3341da4d3e00b61284d99cc9b9506de7b635774d11a8c2be3648d', '[\"*\"]', '2026-05-26 20:10:42', NULL, '2026-05-26 20:10:42', '2026-05-26 20:10:42'),
(191, 'App\\Models\\User', 4, 'attendance-api', 'fc5966c909ee0eae39862aec417030e0c1f5b51deee5c9840b134cc1cb5ab88e', '[\"*\"]', '2026-06-27 09:24:45', NULL, '2026-05-26 20:11:48', '2026-06-27 09:24:45'),
(194, 'App\\Models\\User', 1, 'attendance-api', 'a4cabf712a50cb82e2c5500ab0ef83325dd55a2660f1b9a16e1a2677da67f087', '[\"*\"]', '2026-05-27 09:08:51', NULL, '2026-05-27 08:55:37', '2026-05-27 09:08:51'),
(195, 'App\\Models\\User', 12, 'attendance-api', '5d132620b8aa84125643a61df54d08f829ba7b0fc31740d11b3ef593a2bc26b3', '[\"*\"]', '2026-05-28 22:10:25', NULL, '2026-05-27 09:08:04', '2026-05-28 22:10:25'),
(200, 'App\\Models\\User', 19, 'attendance-api', '3905906c4b405c49f68e03aaed9658d0f18a08a49e019636d701abfc68577541', '[\"*\"]', '2026-05-27 12:07:10', NULL, '2026-05-27 12:06:26', '2026-05-27 12:07:10'),
(203, 'App\\Models\\User', 19, 'attendance-api', 'a44af26d93f65c463e321633bc200cf5ce28276dd187c18bdd8cba60edc4e0ee', '[\"*\"]', '2026-06-26 18:12:51', NULL, '2026-05-27 17:09:05', '2026-06-26 18:12:51'),
(204, 'App\\Models\\User', 1, 'attendance-api', 'a176302091ef0bfdf6ecf35665ffe26c3780a76797d14a5040ea9029ebe22188', '[\"*\"]', '2026-06-13 11:05:09', NULL, '2026-05-27 17:09:31', '2026-06-13 11:05:09'),
(205, 'App\\Models\\User', 16, 'attendance-api', 'cec3f26230ec7eff417a2b9f1714f0078bf8f621e8abcb7dbd6a47a4aa4f750b', '[\"*\"]', '2026-05-31 13:14:16', NULL, '2026-05-27 17:20:55', '2026-05-31 13:14:16'),
(206, 'App\\Models\\User', 16, 'attendance-api', 'd3c73366432a6e3767cb466ca5cb85a72b193f94124af5409754235c09587a88', '[\"*\"]', '2026-06-27 08:32:06', NULL, '2026-05-27 17:21:34', '2026-06-27 08:32:06'),
(208, 'App\\Models\\User', 4, 'attendance-api', 'c878dfa87a46b33c1a25feb4266e44f65697bdb208cf9d5d6a1fb3c315206b4b', '[\"*\"]', '2026-05-27 19:05:51', NULL, '2026-05-27 19:05:51', '2026-05-27 19:05:51'),
(209, 'App\\Models\\User', 15, 'attendance-api', '40b9486dd6edf03e776548f6458e9d67bbcf449531b142f7e7cd3ea3d3e68497', '[\"*\"]', '2026-06-09 15:44:33', NULL, '2026-05-28 08:49:56', '2026-06-09 15:44:33'),
(211, 'App\\Models\\User', 13, 'attendance-api', 'b4326dff20667fb71d14b44ce278b9d5e55c3f51fbf39335ab6735552b2103e1', '[\"*\"]', '2026-06-27 09:34:00', NULL, '2026-05-28 08:52:31', '2026-06-27 09:34:00'),
(212, 'App\\Models\\User', 12, 'attendance-api', '30537f13083c3a19e02cc866c86f339e2e7b03a1bfd853b0c3da730a65b73cc5', '[\"*\"]', '2026-06-27 10:13:35', NULL, '2026-05-29 09:29:11', '2026-06-27 10:13:35'),
(213, 'App\\Models\\User', 6, 'attendance-api', 'af38d03d1b1561881d78beecbc996474ed6f0537e11135aa02d907534338a988', '[\"*\"]', '2026-05-29 23:08:15', NULL, '2026-05-29 16:55:28', '2026-05-29 23:08:15'),
(219, 'App\\Models\\User', 1, 'attendance-api', '2d18a3d8241a7a5d58916f88be441a85573fa73fc1b32f9e38c54a2b4c56b0b1', '[\"*\"]', '2026-05-30 08:28:07', NULL, '2026-05-30 08:27:28', '2026-05-30 08:28:07'),
(220, 'App\\Models\\User', 6, 'attendance-api', '3668f533d299561e2ff581f17e4c068122573eeb7e82141b8bacfef7a53f61b0', '[\"*\"]', '2026-06-09 19:06:48', NULL, '2026-05-30 08:55:14', '2026-06-09 19:06:48'),
(222, 'App\\Models\\User', 21, 'attendance-api', '631a65b0f45c34175267898294ca0de9f77679699f3859355ea7495299695c79', '[\"*\"]', '2026-06-01 14:38:24', NULL, '2026-06-01 14:38:24', '2026-06-01 14:38:24'),
(223, 'App\\Models\\User', 21, 'attendance-api', 'f9d4aa3e99ceb9ad7faf2bc18c5facbb8175c83b28f8fab388d8966f77335bed', '[\"*\"]', '2026-06-09 19:48:00', NULL, '2026-06-01 14:43:18', '2026-06-09 19:48:00'),
(224, 'App\\Models\\User', 14, 'attendance-api', '3be6cdb84a4f381c16fe8a8b99c91a052f779b5920af49d8358e904e0edef03c', '[\"*\"]', '2026-06-20 17:27:54', NULL, '2026-06-02 08:32:32', '2026-06-20 17:27:54'),
(227, 'App\\Models\\User', 1, 'attendance-api', '8e5250a5351d54905479e11a39440dd52571c69a5be2f95cdae8b73c861e3343', '[\"*\"]', '2026-06-02 16:00:12', NULL, '2026-06-02 16:00:10', '2026-06-02 16:00:12'),
(228, 'App\\Models\\User', 10, 'attendance-api', '118558268e346cd1b4e7abde47d4d6115cc1e16bfd24a512b790d038023a5da7', '[\"*\"]', '2026-06-06 16:28:40', NULL, '2026-06-06 09:13:50', '2026-06-06 16:28:40'),
(232, 'App\\Models\\User', 1, 'attendance-api', '0679d6aca0612d6345f2b9c59e6d20be244e1f08a1ee8e5aa2fde711b24de8ec', '[\"*\"]', '2026-06-27 13:47:46', NULL, '2026-06-08 16:35:30', '2026-06-27 13:47:46'),
(234, 'App\\Models\\User', 1, 'attendance-api', 'e880acf636fa9a35bd81ba50a80e5a8f77e18a8e78487838864e52be7b71e130', '[\"*\"]', '2026-06-26 22:33:12', NULL, '2026-06-08 16:37:50', '2026-06-26 22:33:12'),
(235, 'App\\Models\\User', 1, 'attendance-api', '8008539b9f3d4fc41666eee135adf58c602ae0f859a9a94351b037d9cead7f33', '[\"*\"]', '2026-06-15 16:10:11', NULL, '2026-06-08 17:37:12', '2026-06-15 16:10:11'),
(236, 'App\\Models\\User', 15, 'attendance-api', '2760e64017e04fb3bd34d76aedcf479245bf36609fa3a1deff69aee7c986fdf3', '[\"*\"]', '2026-06-17 18:11:44', NULL, '2026-06-09 18:24:40', '2026-06-17 18:11:44'),
(237, 'App\\Models\\User', 6, 'attendance-api', '9484fb4f6b2edb4a3c5070922bf109689433e1f50bf321d4546116a0d723b019', '[\"*\"]', '2026-06-12 08:57:50', NULL, '2026-06-10 08:55:26', '2026-06-12 08:57:50'),
(238, 'App\\Models\\User', 14, 'attendance-api', '40a76c4c56ebf47973466c008f2da09af0a9d18f650948d8aa0d83660f916dfb', '[\"*\"]', '2026-06-10 17:20:51', NULL, '2026-06-10 09:00:23', '2026-06-10 17:20:51'),
(240, 'App\\Models\\User', 21, 'attendance-api', '55f455d23de5cfb6aaeefdad5d46bcfce7161052ab43a6bff98cf0d221005876', '[\"*\"]', '2026-06-12 18:13:05', NULL, '2026-06-10 09:58:09', '2026-06-12 18:13:05'),
(241, 'App\\Models\\User', 14, 'attendance-api', 'dff7e1268ab87109d7f2e3e28076de53fd881b64838bd2a99f4528ff9fee50b4', '[\"*\"]', '2026-06-10 17:17:37', NULL, '2026-06-10 17:17:37', '2026-06-10 17:17:37'),
(242, 'App\\Models\\User', 14, 'attendance-api', '1977ede4b9a95f41b6f8b68ea1bd01eb183daf7f6dcab0ee89ba91b29057bbb9', '[\"*\"]', '2026-06-10 17:19:11', NULL, '2026-06-10 17:19:09', '2026-06-10 17:19:11'),
(243, 'App\\Models\\User', 6, 'attendance-api', '659c1ce8717276ef031cbf3dc636234f4ab75dfa239826152826bb79ae6b11c4', '[\"*\"]', '2026-06-12 13:32:21', NULL, '2026-06-12 08:58:13', '2026-06-12 13:32:21'),
(244, 'App\\Models\\User', 6, 'attendance-api', '83454a10229beac799da670a832472fe617842bcda15c222ce5d0efe7a592efd', '[\"*\"]', '2026-06-14 10:36:08', NULL, '2026-06-12 17:02:03', '2026-06-14 10:36:08'),
(245, 'App\\Models\\User', 21, 'attendance-api', 'cf7f4e9a1b7ab39549070c1b5e61117e15989fafabd45dd25b27db8b2757dc8c', '[\"*\"]', '2026-06-27 09:39:46', NULL, '2026-06-13 09:24:48', '2026-06-27 09:39:46'),
(246, 'App\\Models\\User', 6, 'attendance-api', '7ffc7faf7082132a7b162eaba7f92bc166d1a497d2fbaae622f0d4b15ff67e2f', '[\"*\"]', '2026-06-26 20:28:18', NULL, '2026-06-15 09:18:30', '2026-06-26 20:28:18'),
(247, 'App\\Models\\User', 1, 'attendance-api', '3f2e19c3fa0ee93bf3d939bd7253ee3c3a6a54a80bac4b58df3ca2e77955c011', '[\"*\"]', '2026-06-25 11:42:27', NULL, '2026-06-16 10:28:08', '2026-06-25 11:42:27'),
(248, 'App\\Models\\User', 9, 'attendance-api', '36ca0a8587ee9a3407a858038aac64cb26ab3f790c9a2889b348c8958253c7f3', '[\"*\"]', '2026-06-16 20:42:14', NULL, '2026-06-16 20:38:35', '2026-06-16 20:42:14'),
(249, 'App\\Models\\User', 15, 'attendance-api', '9ddc96f2e631b10159466e919dd24b9f8901bc2602a0f9482bc0b6db781aa894', '[\"*\"]', '2026-06-20 17:51:40', NULL, '2026-06-18 08:56:00', '2026-06-20 17:51:40'),
(250, 'App\\Models\\User', 14, 'attendance-api', '22b2c7411ef557a8ff3808d4006799951769b77c0a394c071626752a3e8053c3', '[\"*\"]', '2026-06-20 10:50:38', NULL, '2026-06-20 10:41:13', '2026-06-20 10:50:38'),
(251, 'App\\Models\\User', 14, 'attendance-api', 'a3b95a42b4360bf4c884fb70c119ae1af9705b51d801e57ea51e5ab278245545', '[\"*\"]', '2026-06-20 11:56:18', NULL, '2026-06-20 11:51:22', '2026-06-20 11:56:18'),
(252, 'App\\Models\\User', 14, 'attendance-api', '165457e1e3a541774d82c33a5a700b8940bf582e56dac887400d6e06b8895dc5', '[\"*\"]', '2026-06-27 12:26:22', NULL, '2026-06-20 17:48:45', '2026-06-27 12:26:22'),
(253, 'App\\Models\\User', 14, 'attendance-api', '8bf20fadfc144db47656a3cd037dc1dbe8d51a288e8df51ff6a4f694c486f286', '[\"*\"]', '2026-06-26 18:05:44', NULL, '2026-06-20 17:49:21', '2026-06-26 18:05:44'),
(254, 'App\\Models\\User', 15, 'attendance-api', 'e456fa09aabf1303c01d608613343ae17e23ffaac28abb40f79e0ac0b11a4c98', '[\"*\"]', '2026-06-22 18:54:44', NULL, '2026-06-22 08:44:43', '2026-06-22 18:54:44'),
(255, 'App\\Models\\User', 15, 'attendance-api', '22588dc75930028c9d886d9a6ae8d46292842b582fb3a1981cad8f450ad3b7b2', '[\"*\"]', '2026-06-27 09:35:07', NULL, '2026-06-23 09:09:00', '2026-06-27 09:35:07');

-- --------------------------------------------------------

--
-- Table structure for table `positions`
--

CREATE TABLE `positions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `department_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `code` varchar(255) NOT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `positions`
--

INSERT INTO `positions` (`id`, `department_id`, `name`, `code`, `status`, `created_at`, `updated_at`) VALUES
(1, 5, 'Accountant', 'acc', 'active', '2026-05-18 21:26:17', '2026-05-18 21:26:17'),
(2, 5, 'Accountant Manager', 'acc_m', 'active', '2026-05-18 21:26:48', '2026-05-18 21:26:48'),
(3, 4, 'Financail', 'fin', 'active', '2026-05-18 21:27:00', '2026-05-18 21:27:00'),
(4, 1, 'Sale Manager', 'sa_m', 'active', '2026-05-18 21:27:25', '2026-05-18 21:27:25'),
(5, 1, 'Sale', 'sa', 'active', '2026-05-18 21:27:34', '2026-05-18 21:27:34'),
(6, 2, 'Sale Offline Manager', 'so_m', 'active', '2026-05-18 21:27:54', '2026-05-18 21:27:54'),
(7, 7, 'Marketing Manager', 'Mar_m', 'active', '2026-05-18 21:28:12', '2026-05-18 21:28:12'),
(8, 7, 'Contant Creator', 'con', 'active', '2026-05-18 21:28:31', '2026-05-18 21:28:31'),
(9, 7, 'Al ganerater', 'ai_g', 'active', '2026-05-18 21:29:13', '2026-05-18 21:29:13'),
(10, 7, 'Designer', 'de', 'active', '2026-05-18 21:29:41', '2026-05-18 21:29:41'),
(11, 7, 'Video Editor', 've', 'active', '2026-05-18 21:29:59', '2026-05-18 21:29:59'),
(12, 8, 'Stock Manager', 'st_m', 'active', '2026-05-18 21:31:12', '2026-05-18 21:31:12'),
(13, 8, 'packer', 'pac', 'active', '2026-05-18 21:32:36', '2026-05-18 21:32:36'),
(14, 7, 'Marketing', 'mar', 'active', '2026-05-18 22:00:27', '2026-05-18 22:00:27'),
(15, 6, 'Delivery', 'del', 'active', '2026-05-18 22:06:42', '2026-05-18 22:06:42'),
(16, 2, 'Sale offline', 'sa_o', 'active', '2026-05-18 22:19:43', '2026-05-18 22:19:43'),
(17, 8, 'Stock Controller', 's_c', 'active', '2026-05-23 09:24:12', '2026-05-23 09:24:12');

-- --------------------------------------------------------

--
-- Table structure for table `reports`
--

CREATE TABLE `reports` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `employee_id` bigint(20) UNSIGNED NOT NULL,
  `report_date` date NOT NULL,
  `type` varchar(255) NOT NULL DEFAULT 'daily',
  `title` varchar(255) NOT NULL,
  `content` longtext NOT NULL,
  `metrics` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`metrics`)),
  `submitted_at` timestamp NULL DEFAULT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'submitted',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id`, `name`, `slug`, `description`, `created_at`, `updated_at`) VALUES
(1, 'Super Admin', 'super_admin', 'Full system owner with unrestricted access.', '2026-05-18 18:36:16', '2026-05-18 18:36:16'),
(2, 'Admin', 'admin', 'System management access.', '2026-05-18 18:36:20', '2026-05-18 18:36:20'),
(3, 'HR Manager', 'hr_manager', 'Employee and attendance management.', '2026-05-18 18:36:22', '2026-05-18 18:36:22'),
(4, 'Sales Manager', 'sales_manager', 'Outdoor sales team management.', '2026-05-18 18:36:24', '2026-05-18 18:36:24'),
(5, 'Accountant', 'accountant', 'Financial and payroll access.', '2026-05-18 18:36:26', '2026-05-18 18:36:26'),
(6, 'Outdoor Sales', 'outdoor_sales', 'Field sales employee.', '2026-05-18 18:36:27', '2026-05-18 18:36:27'),
(7, 'Office Staff', 'office_staff', 'Office employee.', '2026-05-18 18:36:28', '2026-05-18 18:36:28'),
(8, 'Warehouse Staff', 'warehouse_staff', 'Warehouse employee.', '2026-05-18 18:36:29', '2026-05-18 18:36:29'),
(9, 'Driver', 'driver', 'Delivery employee.', '2026-05-18 18:36:30', '2026-05-18 18:36:30');

-- --------------------------------------------------------

--
-- Table structure for table `role_ip_addresses`
--

CREATE TABLE `role_ip_addresses` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `role_id` bigint(20) UNSIGNED NOT NULL,
  `ip_address` varchar(45) NOT NULL,
  `label` varchar(120) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `role_ip_addresses`
--

INSERT INTO `role_ip_addresses` (`id`, `role_id`, `ip_address`, `label`, `created_at`, `updated_at`) VALUES
(2, 2, '192.168.110.0/24', NULL, '2026-05-18 22:26:14', '2026-05-18 22:26:14'),
(4, 9, '192.168.110.0/24', NULL, '2026-05-18 22:26:30', '2026-05-18 22:26:30'),
(5, 3, '192.168.110.0/24', NULL, '2026-05-18 22:26:33', '2026-05-18 22:26:33'),
(7, 4, '192.168.110.0/24', NULL, '2026-05-18 22:26:38', '2026-05-18 22:26:38'),
(8, 8, '192.168.110.0/24', NULL, '2026-05-18 22:26:42', '2026-05-18 22:26:42'),
(10, 7, '203.144.76.9', NULL, '2026-05-20 11:35:28', '2026-05-20 11:35:28'),
(12, 7, '45.118.77.240', NULL, '2026-05-27 08:58:14', '2026-05-27 08:58:14');

-- --------------------------------------------------------

--
-- Table structure for table `salary_advances`
--

CREATE TABLE `salary_advances` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `employee_id` bigint(20) UNSIGNED NOT NULL,
  `amount` decimal(12,2) NOT NULL,
  `remaining_amount` decimal(12,2) NOT NULL DEFAULT 0.00,
  `request_date` date NOT NULL,
  `deduct_month` date DEFAULT NULL,
  `reason` text DEFAULT NULL,
  `status` enum('pending','approved','deducted','rejected') NOT NULL DEFAULT 'pending',
  `approved_by` bigint(20) UNSIGNED DEFAULT NULL,
  `approved_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `salary_setups`
--

CREATE TABLE `salary_setups` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `employee_id` bigint(20) UNSIGNED NOT NULL,
  `salary_type` enum('monthly','daily','commission_only') NOT NULL DEFAULT 'monthly',
  `base_salary` decimal(12,2) NOT NULL DEFAULT 0.00,
  `payroll_day` tinyint(3) UNSIGNED NOT NULL DEFAULT 28,
  `overtime_rate` decimal(10,2) NOT NULL DEFAULT 0.00,
  `commission_percent` decimal(5,2) NOT NULL DEFAULT 0.00,
  `status` enum('active','inactive') NOT NULL DEFAULT 'active',
  `notes` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES
('5c4aharzuaZ8Bk0BsOI5IDu0EoPOciHFs9xISfnl', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiNFlVUVdlbGlUdDFBM082UnNzd0JvbWxlRXFOdXFZa2xBQnpCOTVVbiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMCI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1779276306);

-- --------------------------------------------------------

--
-- Table structure for table `system_settings`
--

CREATE TABLE `system_settings` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `key` varchar(100) NOT NULL,
  `value` text DEFAULT NULL,
  `group` varchar(50) NOT NULL DEFAULT 'general',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `system_settings`
--

INSERT INTO `system_settings` (`id`, `key`, `value`, `group`, `created_at`, `updated_at`) VALUES
(1, 'company_name', 'Shadow Group', 'general', '2026-05-18 18:36:42', '2026-05-18 21:43:06'),
(2, 'timezone', 'Asia/Phnom_Penh', 'general', '2026-05-18 18:36:42', '2026-05-18 18:36:42'),
(3, 'language', 'English', 'general', '2026-05-18 18:36:42', '2026-05-18 18:36:42'),
(4, 'currency', 'USD', 'general', '2026-05-18 18:36:42', '2026-05-18 18:36:42'),
(5, 'date_format', 'DD/MM/YYYY', 'general', '2026-05-18 18:36:42', '2026-05-18 18:36:42'),
(6, 'theme_mode', 'System', 'general', '2026-05-18 18:36:42', '2026-05-18 18:36:42'),
(7, 'check_in_time', '08:00', 'attendance', '2026-05-18 18:36:42', '2026-05-18 18:36:42'),
(8, 'check_out_time', '17:00', 'attendance', '2026-05-18 18:36:42', '2026-05-18 18:36:42'),
(9, 'late_minutes', '15', 'attendance', '2026-05-18 18:36:42', '2026-05-18 18:36:42'),
(10, 'attendance_radius', '100', 'attendance', '2026-05-18 18:36:42', '2026-05-18 18:36:42'),
(11, 'overtime_rules', 'After checkout time', 'attendance', '2026-05-18 18:36:42', '2026-05-18 18:36:42'),
(12, 'weekend_rules', 'Allow with approval', 'attendance', '2026-05-18 18:36:42', '2026-05-18 18:36:42'),
(13, 'work_start_time', '08:00', 'schedule', '2026-05-18 18:36:42', '2026-05-18 18:36:42'),
(14, 'work_end_time', '17:00', 'schedule', '2026-05-18 18:36:42', '2026-05-18 18:36:42'),
(15, 'break_time', '12:00 - 13:00', 'schedule', '2026-05-18 18:36:42', '2026-05-18 18:36:42'),
(16, 'working_days', 'Monday - Friday', 'schedule', '2026-05-18 18:36:42', '2026-05-18 18:36:42'),
(17, 'flexible_schedule', '1', 'schedule', '2026-05-18 18:36:42', '2026-05-18 18:36:42'),
(18, 'gps_location_tracking', '1', 'gps', '2026-05-18 18:36:42', '2026-05-18 18:36:42'),
(19, 'gps_fake_detection', '1', 'gps', '2026-05-18 18:36:42', '2026-05-18 18:36:42'),
(20, 'gps_background_tracking', '0', 'gps', '2026-05-18 18:36:42', '2026-05-18 18:36:42'),
(21, 'gps_live_tracking', '1', 'gps', '2026-05-18 18:36:42', '2026-05-18 18:36:42'),
(22, 'jwt_expiration', '120', 'security', '2026-05-18 18:36:42', '2026-05-18 18:36:42'),
(23, 'login_attempt_limit', '5', 'security', '2026-05-18 18:36:42', '2026-05-18 18:36:42'),
(24, 'session_timeout', '60', 'security', '2026-05-18 18:36:42', '2026-05-18 18:36:42'),
(25, 'device_restriction', '0', 'security', '2026-05-18 18:36:42', '2026-05-18 18:36:42'),
(26, 'two_factor_auth', '0', 'security', '2026-05-18 18:36:42', '2026-05-18 22:58:23'),
(27, 'telegram_bot_enabled', '1', 'telegram', '2026-05-18 22:51:10', '2026-05-18 22:51:10'),
(28, 'telegram_bot_token', '8852050624:AAHUN09RfXfQPwZoy_HGV1pwuflGVcRZwg4', 'telegram', '2026-05-18 22:51:10', '2026-05-18 22:51:10'),
(29, 'telegram_default_chat_id', '-1003789239970', 'telegram', '2026-05-18 22:51:10', '2026-05-18 22:57:10'),
(30, 'telegram_webhook_url', 'https://lightgoldenrodyellow-mantis-338653.hostingersite.com/api/telegram/webhook', 'telegram', '2026-05-18 22:51:10', '2026-05-20 17:52:19'),
(31, 'telegram_alert_check_in_success', '1', 'telegram', '2026-05-18 22:51:11', '2026-05-18 22:51:11'),
(32, 'telegram_alert_check_out_success', '1', 'telegram', '2026-05-18 22:51:11', '2026-05-18 22:51:11'),
(33, 'telegram_alert_late_check_in', '1', 'telegram', '2026-05-18 22:51:11', '2026-05-18 22:51:11'),
(34, 'telegram_alert_missing_check_out', '1', 'telegram', '2026-05-18 22:51:11', '2026-05-18 22:51:11'),
(35, 'telegram_alert_attendance_edited', '1', 'telegram', '2026-05-18 22:51:11', '2026-05-18 22:51:11'),
(36, 'telegram_alert_permission_new', '1', 'telegram', '2026-05-18 22:51:11', '2026-05-18 22:51:11'),
(37, 'telegram_alert_permission_approved', '1', 'telegram', '2026-05-18 22:51:11', '2026-05-18 22:51:11'),
(38, 'telegram_alert_permission_rejected', '1', 'telegram', '2026-05-18 22:51:11', '2026-05-18 22:51:11'),
(39, 'telegram_alert_manual_check_in', '1', 'telegram', '2026-05-18 22:51:11', '2026-05-18 22:51:11'),
(40, 'telegram_alert_missing_check_out_request', '1', 'telegram', '2026-05-18 22:51:11', '2026-05-18 22:51:11'),
(41, 'telegram_alert_outdoor_check_in', '1', 'telegram', '2026-05-18 22:51:11', '2026-05-18 22:51:11'),
(42, 'telegram_alert_visit_started', '1', 'telegram', '2026-05-18 22:51:11', '2026-05-18 22:51:11'),
(43, 'telegram_alert_visit_completed', '1', 'telegram', '2026-05-18 22:51:11', '2026-05-18 22:51:11'),
(44, 'telegram_alert_daily_report', '1', 'telegram', '2026-05-18 22:51:11', '2026-05-18 22:51:11'),
(45, 'telegram_alert_route_tracking', '1', 'telegram', '2026-05-18 22:51:11', '2026-05-18 22:51:11'),
(46, 'telegram_late_notify_admin_group', '1', 'telegram', '2026-05-18 22:51:11', '2026-05-18 22:51:11'),
(47, 'telegram_late_notify_employee', '1', 'telegram', '2026-05-18 22:51:11', '2026-05-18 22:51:11'),
(48, 'telegram_late_include_deduction_amount', '1', 'telegram', '2026-05-18 22:51:11', '2026-05-18 22:51:11'),
(49, 'telegram_late_include_late_minutes', '1', 'telegram', '2026-05-18 22:51:11', '2026-05-18 22:51:11'),
(50, 'site_title', 'Shadow HR', 'general', '2026-05-21 20:04:28', '2026-05-23 09:20:30'),
(51, 'company_logo_url', 'https://pub-de34c1d3461e406ea04e01a3ea45ce97.r2.dev/branding/logos/4BaP5ysIkgXFYIqsU3XhTQbM4GG3y3EqKgjznEAn.jpg', 'general', '2026-05-22 19:31:36', '2026-05-23 09:19:59'),
(52, 'company_icon_url', 'https://pub-de34c1d3461e406ea04e01a3ea45ce97.r2.dev/branding/icons/vzAMGDKoBUFHGxpxVPD010g6mklVEJsoio2tSSwT.jpg', 'general', '2026-05-22 19:31:45', '2026-05-23 09:20:04');

-- --------------------------------------------------------

--
-- Table structure for table `telegram_destinations`
--

CREATE TABLE `telegram_destinations` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `event_key` varchar(255) NOT NULL,
  `chat_id` varchar(255) NOT NULL,
  `message_thread_id` bigint(20) UNSIGNED DEFAULT NULL,
  `enabled` tinyint(1) NOT NULL DEFAULT 1,
  `send_photo` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `telegram_destinations`
--

INSERT INTO `telegram_destinations` (`id`, `name`, `event_key`, `chat_id`, `message_thread_id`, `enabled`, `send_photo`, `created_at`, `updated_at`) VALUES
(1, 'Daily Attendance Group', 'daily_attendance', '-1003789239970', 2, 1, 0, '2026-05-20 18:28:39', '2026-05-20 18:28:39'),
(2, 'Permission Requests Group', 'permission_request', '-1003789239970', 3, 1, 0, '2026-05-20 18:28:40', '2026-05-20 18:28:40'),
(3, 'Late Attendance Group', 'late_attendance', '-1002364635031', 1631, 1, 0, '2026-05-20 18:28:40', '2026-05-21 20:12:07'),
(4, 'Office Staff Attendance Group', 'office_attendance', '-1003789239970', 2, 1, 1, '2026-05-24 20:26:57', '2026-05-26 18:57:33'),
(5, 'Outdoor Sales Attendance Group', 'outdoor_attendance', '-1003789239970', 156, 1, 1, '2026-05-24 20:26:57', '2026-05-24 20:26:57'),
(6, 'Office Staff Permission Request Group', 'office_permission_request', '-1003789239970', 3, 1, 0, '2026-05-24 20:26:57', '2026-05-24 20:26:57'),
(7, 'Office Staff Late Attendance Group', 'office_late_attendance', '-1002364635031', 1631, 1, 0, '2026-05-24 20:26:57', '2026-06-04 09:36:54'),
(8, 'Outdoor Sales Permission Request Group', 'outdoor_permission_request', '-1003789239970', 158, 1, 0, '2026-05-24 20:26:57', '2026-06-04 09:36:54'),
(9, 'Outdoor Sales Late Attendance Group', 'outdoor_late_attendance', '-1003789239970', 160, 1, 0, '2026-05-24 20:26:57', '2026-06-04 09:36:54'),
(10, 'Customer Visit Group', 'outdoor_visit', '-1003789239970', 185, 1, 0, '2026-05-24 20:26:57', '2026-05-24 20:26:57');

-- --------------------------------------------------------

--
-- Table structure for table `telegram_logs`
--

CREATE TABLE `telegram_logs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `employee_id` bigint(20) UNSIGNED DEFAULT NULL,
  `customer_visit_id` bigint(20) UNSIGNED DEFAULT NULL,
  `message_type` varchar(255) NOT NULL,
  `event_key` varchar(80) DEFAULT NULL,
  `telegram_message` text NOT NULL,
  `selfie_url` text DEFAULT NULL,
  `store_photo_url` text DEFAULT NULL,
  `error_message` text DEFAULT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'pending',
  `attempts` tinyint(3) UNSIGNED NOT NULL DEFAULT 0,
  `sent_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `telegram_logs`
--

INSERT INTO `telegram_logs` (`id`, `employee_id`, `customer_visit_id`, `message_type`, `event_key`, `telegram_message`, `selfie_url`, `store_photo_url`, `error_message`, `status`, `attempts`, `sent_at`, `created_at`, `updated_at`) VALUES
(1, NULL, NULL, 'check_out_success', NULL, '🚪 បានចេញពីធ្វើការ\n\n👤 បុគ្គលិក: Sokha Chan\n🆔 លេខសម្គាល់បុគ្គលិក: EMP-1042\n\n📅 កាលបរិច្ឆេទ: 18 May 2026\n🕔 ម៉ោងចេញ: 05:18 PM\n⏱ ម៉ោងធ្វើការ: 9h 06m\n\n📍 ទីតាំង: Phnom Penh Office\n\nស្ថានភាព: បានបញ្ចប់', NULL, NULL, NULL, 'sent', 0, '2026-05-18 22:55:39', '2026-05-18 22:55:39', '2026-05-18 22:55:39'),
(2, NULL, NULL, 'check_in_success', NULL, '✅ បានចូលធ្វើការ\n\n👤 បុគ្គលិក: Sokha Chan\n🆔 លេខសម្គាល់បុគ្គលិក: EMP-1042\n🏢 ផ្នែក: Outdoor Sales\n\n📅 កាលបរិច្ឆេទ: 18 May 2026\n🕘 ម៉ោងចូល: 08:12 AM\n📍 ទីតាំង: Phnom Penh Office\n\n📡 ស្ថានភាព GPS: បានផ្ទៀងផ្ទាត់\n\nស្ថានភាព: Verified', NULL, NULL, NULL, 'sent', 0, '2026-05-18 22:55:57', '2026-05-18 22:55:57', '2026-05-18 22:55:57'),
(3, NULL, NULL, 'check_in_success', NULL, '✅ បានចូលធ្វើការ\n\n👤 បុគ្គលិក: Sokha Chan\n🆔 លេខសម្គាល់បុគ្គលិក: EMP-1042\n🏢 ផ្នែក: Outdoor Sales\n\n📅 កាលបរិច្ឆេទ: 18 May 2026\n🕘 ម៉ោងចូល: 08:12 AM\n📍 ទីតាំង: Phnom Penh Office\n\n📡 ស្ថានភាព GPS: បានផ្ទៀងផ្ទាត់\n\nស្ថានភាព: Verified', NULL, NULL, NULL, 'sent', 0, '2026-05-18 22:56:28', '2026-05-18 22:56:28', '2026-05-18 22:56:28'),
(4, NULL, NULL, 'late_attendance', NULL, '⚠️ ជូនដំណឹងមកយឺត\n\n👤 បុគ្គលិក: Sokha Chan\n🆔 លេខសម្គាល់បុគ្គលិក: EMP-1042\n\n🕘 ម៉ោងចូល: 08:12 AM\n⌛ យឺតចំនួន: 17 នាទី\n💰 កាត់ប្រាក់: $2.50\n\n📍 ទីតាំង: Phnom Penh Office\n\nស្ថានភាព: មកយឺត', NULL, NULL, NULL, 'sent', 0, '2026-05-18 22:56:35', '2026-05-18 22:56:35', '2026-05-18 22:56:35'),
(5, 4, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 11:21 AM · 📅 21 May 2026\n📍 N/A\nស្ថានភាព: មកយឺត', NULL, NULL, NULL, 'sent', 0, '2026-05-21 11:22:02', '2026-05-21 11:22:02', '2026-05-21 11:22:02'),
(6, 4, NULL, 'late_private', NULL, '⚠️ <b>ជូនដំណឹងមកយឺត</b>\n\n👤 បុគ្គលិក: Tha Sopheak\n🆔 លេខសម្គាល់: AI001\n🕘 ម៉ោងចូល: 11:21 AM\n⌛ យឺតចំនួន: 202 នាទី\n💰 កាត់ប្រាក់: $3.00\n\nស្ថានភាព: មកយឺត', NULL, NULL, NULL, 'sent', 0, '2026-05-21 11:22:04', '2026-05-21 11:22:04', '2026-05-21 11:22:04'),
(7, 4, NULL, 'check_out_private', NULL, '🔔 <b>អ្នកបានចេញពីធ្វើការ</b>\n\n🕔 05:37 PM · ⏱ 06h 15m\n📍 N/A', NULL, NULL, NULL, 'sent', 0, '2026-05-21 17:37:03', '2026-05-21 17:37:03', '2026-05-21 17:37:03'),
(8, 13, NULL, 'check_out_private', NULL, '🔔 <b>អ្នកបានចេញពីធ្វើការ</b>\n\n🕔 06:53 PM · ⏱ 09h 57m\n📍 N/A', NULL, NULL, NULL, 'sent', 0, '2026-05-21 18:53:03', '2026-05-21 18:53:03', '2026-05-21 18:53:03'),
(9, 4, NULL, 'website_notification_private', NULL, '🔔 <b>hello</b>\n\nplease check out the attendance', NULL, NULL, NULL, 'sent', 0, '2026-05-21 20:05:21', '2026-05-21 20:05:21', '2026-05-21 20:05:21'),
(10, 4, NULL, 'website_notification_private', NULL, '🔔 <b>Test</b>\n\nhi', NULL, NULL, NULL, 'failed', 0, NULL, '2026-05-21 21:05:24', '2026-05-21 21:05:24'),
(11, 4, NULL, 'website_notification_private', NULL, '🔔 <b>Test</b>\n\nhi', NULL, NULL, NULL, 'sent', 0, '2026-05-21 21:06:19', '2026-05-21 21:06:19', '2026-05-21 21:06:19'),
(12, 4, NULL, 'permission_request_submitted_private', NULL, '📝 <b>សំណើរបស់អ្នកត្រូវបានដាក់រួចរាល់</b>\n\n📄 <b>លេខសំណើ:</b> PR-2026-0002\n📌 <b>ប្រភេទ:</b> Missing Check Out\n📅 <b>រយៈពេល:</b> 19 May 2026\n📝 <b>មូលហេតុ:</b> Forgot to check out in date 19.05.205\n\n⏳ <b>ស្ថានភាព:</b> កំពុងរង់ចាំអនុម័ត', NULL, NULL, NULL, 'sent', 0, '2026-05-21 21:50:05', '2026-05-21 21:50:05', '2026-05-21 21:50:05'),
(13, 4, NULL, 'permission_request_submitted_private', NULL, '📝 <b>សំណើរបស់អ្នកត្រូវបានដាក់រួចរាល់</b>\n\n📄 <b>លេខសំណើ:</b> PR-2026-0003\n📌 <b>ប្រភេទ:</b> Missing Check Out\n📅 <b>រយៈពេល:</b> 19 May 2026\n📝 <b>មូលហេតុ:</b> Forgot to check out in date 19.05.205\n\n⏳ <b>ស្ថានភាព:</b> កំពុងរង់ចាំអនុម័ត', NULL, NULL, NULL, 'sent', 0, '2026-05-21 21:50:05', '2026-05-21 21:50:05', '2026-05-21 21:50:05'),
(14, 4, NULL, 'permission_status_private', NULL, '❌ <b>សំណើរបស់អ្នកមិនត្រូវបានអនុម័ត</b>\n\n📄 <b>លេខសំណើ:</b> PR-2026-0003\n📌 <b>ប្រភេទ:</b> Missing Check Out\n📅 <b>រយៈពេល:</b> 19 May 2026\n\n👨‍💼 <b>ពិនិត្យដោយ:</b> Super Admin\n🕒 <b>បដិសេធនៅ:</b> 21 May 2026 · 10:02 PM\n📝 <b>មូលហេតុ:</b> Rejected.\n\n❌ <b>ស្ថានភាព:</b> មិនអនុម័ត', NULL, NULL, NULL, 'sent', 0, '2026-05-21 22:02:52', '2026-05-21 22:02:52', '2026-05-21 22:02:52'),
(15, 4, NULL, 'permission_status_private', NULL, '✅ <b>សំណើរបស់អ្នកត្រូវបានអនុម័ត</b>\n\n📄 <b>លេខសំណើ:</b> PR-2026-0002\n📌 <b>ប្រភេទ:</b> Missing Check Out\n📅 <b>រយៈពេល:</b> 19 May 2026\n\n👨‍💼 <b>អនុម័តដោយ:</b> Super Admin\n🕒 <b>អនុម័តនៅ:</b> 21 May 2026 · 10:03 PM\n\n✅ <b>ស្ថានភាព:</b> អនុម័តរួចរាល់', NULL, NULL, NULL, 'sent', 0, '2026-05-21 22:03:03', '2026-05-21 22:03:03', '2026-05-21 22:03:03'),
(16, 13, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 09:00 AM\n📅 ថ្ងៃទី: 22 May 2026\n\n⚠️ ស្ថានភាព: មកយឺត\n⏳ យឺតចំនួន: 51s', NULL, NULL, NULL, 'sent', 0, '2026-05-22 09:00:53', '2026-05-22 09:00:53', '2026-05-22 09:00:53'),
(17, 13, NULL, 'late_private', NULL, '⚠️ <b>ជូនដំណឹងមកយឺត</b>\n\n👤 បុគ្គលិក: Chean Aleav\n🆔 លេខសម្គាល់: ACC003\n🕘 ម៉ោងចូល: 09:00 AM\n⏳ យឺតចំនួន: 51s\n💰 កាត់ប្រាក់: $0.00\n\nស្ថានភាព: មកយឺត', NULL, NULL, NULL, 'sent', 0, '2026-05-22 09:00:56', '2026-05-22 09:00:56', '2026-05-22 09:00:56'),
(18, 12, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 09:01 AM\n📅 ថ្ងៃទី: 22 May 2026\n\n⚠️ ស្ថានភាព: មកយឺត\n⏳ យឺតចំនួន: 1m 13s', NULL, NULL, NULL, 'sent', 0, '2026-05-22 09:01:15', '2026-05-22 09:01:15', '2026-05-22 09:01:15'),
(19, 12, NULL, 'late_private', NULL, '⚠️ <b>ជូនដំណឹងមកយឺត</b>\n\n👤 បុគ្គលិក: Chu Kimhorng\n🆔 លេខសម្គាល់: ACC005\n🕘 ម៉ោងចូល: 09:01 AM\n⏳ យឺតចំនួន: 1m 13s\n💰 កាត់ប្រាក់: $0.00\n\nស្ថានភាព: មកយឺត', NULL, NULL, NULL, 'sent', 0, '2026-05-22 09:01:17', '2026-05-22 09:01:17', '2026-05-22 09:01:17'),
(20, 4, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 11:21 AM\n📅 ថ្ងៃទី: 22 May 2026\n\n⚠️ ស្ថានភាព: មកយឺត\n⏳ យឺតចំនួន: 2h 21m 14s', NULL, NULL, NULL, 'sent', 0, '2026-05-22 11:21:16', '2026-05-22 11:21:16', '2026-05-22 11:21:16'),
(21, 4, NULL, 'late_private', NULL, '⚠️ <b>ជូនដំណឹងមកយឺត</b>\n\n👤 បុគ្គលិក: Tha Sopheak\n🆔 លេខសម្គាល់: AI001\n🕘 ម៉ោងចូល: 11:21 AM\n⏳ យឺតចំនួន: 2h 21m 14s\n💰 កាត់ប្រាក់: $3.00\n\nស្ថានភាព: មកយឺត', NULL, NULL, NULL, 'sent', 0, '2026-05-22 11:21:19', '2026-05-22 11:21:19', '2026-05-22 11:21:19'),
(22, 8, NULL, 'website_notification_private', NULL, '🔔 <b>Test</b>\n\nHello b', NULL, NULL, NULL, 'sent', 0, '2026-05-22 15:21:08', '2026-05-22 15:21:08', '2026-05-22 15:21:08'),
(23, 8, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 08:14 AM\n🕘 ចេញម៉ោង: 05:22 PM\n📅 ថ្ងៃទី: 22 May 2026\n\n⏳ ម៉ោងធ្វើការ: 09h 07m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-05-22 17:22:13', '2026-05-22 17:22:13', '2026-05-22 17:22:13'),
(24, 4, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 11:21 AM\n🕘 ចេញម៉ោង: 05:33 PM\n📅 ថ្ងៃទី: 22 May 2026\n\n⏳ ម៉ោងធ្វើការ: 06h 12m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-05-22 17:34:00', '2026-05-22 17:34:00', '2026-05-22 17:34:00'),
(25, 13, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 09:00 AM\n🕘 ចេញម៉ោង: 08:11 PM\n📅 ថ្ងៃទី: 22 May 2026\n\n⏳ ម៉ោងធ្វើការ: 11h 10m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-05-22 20:11:39', '2026-05-22 20:11:39', '2026-05-22 20:11:39'),
(26, 12, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 09:01 AM\n🕘 ចេញម៉ោង: 08:12 PM\n📅 ថ្ងៃទី: 22 May 2026\n\n⏳ ម៉ោងធ្វើការ: 11h 11m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-05-22 20:12:22', '2026-05-22 20:12:22', '2026-05-22 20:12:22'),
(27, 13, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:51 AM\n📅 ថ្ងៃទី: 23 May 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-05-23 08:51:06', '2026-05-23 08:51:06', '2026-05-23 08:51:06'),
(28, 12, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:51 AM\n📅 ថ្ងៃទី: 23 May 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-05-23 08:51:44', '2026-05-23 08:51:44', '2026-05-23 08:51:44'),
(29, 4, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 10:03 AM\n📅 ថ្ងៃទី: 23 May 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-05-23 10:03:35', '2026-05-23 10:03:35', '2026-05-23 10:03:35'),
(30, 10, NULL, 'website_notification_private', NULL, '🔔 <b>Test</b>\n\nHi', NULL, NULL, NULL, 'sent', 0, '2026-05-23 10:15:06', '2026-05-23 10:15:06', '2026-05-23 10:15:06'),
(31, 4, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 10:03 AM\n🕘 ចេញម៉ោង: 09:31 PM\n📅 ថ្ងៃទី: 23 May 2026\n\n⏳ ម៉ោងធ្វើការ: 11h 27m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-05-23 21:31:30', '2026-05-23 21:31:30', '2026-05-23 21:31:30'),
(32, 10, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 08:38 AM\n🕘 ចេញម៉ោង: 11:01 PM\n📅 ថ្ងៃទី: 23 May 2026\n\n⏳ ម៉ោងធ្វើការ: 14h 23m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-05-23 23:01:29', '2026-05-23 23:01:29', '2026-05-23 23:01:29'),
(33, 13, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 08:51 AM\n🕘 ចេញម៉ោង: 11:01 PM\n📅 ថ្ងៃទី: 23 May 2026\n\n⏳ ម៉ោងធ្វើការ: 14h 10m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-05-23 23:01:33', '2026-05-23 23:01:33', '2026-05-23 23:01:33'),
(34, 12, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 08:51 AM\n🕘 ចេញម៉ោង: 11:02 PM\n📅 ថ្ងៃទី: 23 May 2026\n\n⏳ ម៉ោងធ្វើការ: 14h 10m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-05-23 23:02:18', '2026-05-23 23:02:18', '2026-05-23 23:02:18'),
(35, 8, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:09 AM\n📅 ថ្ងៃទី: 24 May 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-05-24 08:09:43', '2026-05-24 08:09:43', '2026-05-24 08:09:43'),
(36, 10, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 09:26 AM\n📅 ថ្ងៃទី: 24 May 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-05-24 09:26:24', '2026-05-24 09:26:24', '2026-05-24 09:26:24'),
(37, 12, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 09:32 AM\n📅 ថ្ងៃទី: 24 May 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-05-24 09:32:16', '2026-05-24 09:32:16', '2026-05-24 09:32:16'),
(38, 13, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 09:56 AM\n📅 ថ្ងៃទី: 24 May 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-05-24 09:56:32', '2026-05-24 09:56:32', '2026-05-24 09:56:32'),
(39, 8, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 08:09 AM\n🕘 ចេញម៉ោង: 05:15 PM\n📅 ថ្ងៃទី: 24 May 2026\n\n⏳ ម៉ោងធ្វើការ: 09h 06m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-05-24 17:15:59', '2026-05-24 17:15:59', '2026-05-24 17:15:59'),
(40, 10, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 09:26 AM\n🕘 ចេញម៉ោង: 05:37 PM\n📅 ថ្ងៃទី: 24 May 2026\n\n⏳ ម៉ោងធ្វើការ: 08h 11m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-05-24 17:37:43', '2026-05-24 17:37:43', '2026-05-24 17:37:43'),
(41, 13, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 09:56 AM\n🕘 ចេញម៉ោង: 05:39 PM\n📅 ថ្ងៃទី: 24 May 2026\n\n⏳ ម៉ោងធ្វើការ: 07h 42m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-05-24 17:39:22', '2026-05-24 17:39:22', '2026-05-24 17:39:22'),
(42, 12, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 09:32 AM\n🕘 ចេញម៉ោង: 05:41 PM\n📅 ថ្ងៃទី: 24 May 2026\n\n⏳ ម៉ោងធ្វើការ: 08h 08m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-05-24 17:41:08', '2026-05-24 17:41:08', '2026-05-24 17:41:08'),
(43, 1, NULL, 'website_notification_private', NULL, '🔔 <b>Test</b>\n\nhi', NULL, NULL, NULL, 'sent', 0, '2026-05-25 08:46:31', '2026-05-25 08:46:31', '2026-05-25 08:46:31'),
(44, 1, NULL, 'website_notification_private', NULL, '🔔 <b>hello</b>\n\nhi', NULL, NULL, NULL, 'sent', 0, '2026-05-25 08:46:58', '2026-05-25 08:46:58', '2026-05-25 08:46:58'),
(45, 1, NULL, 'website_notification_private', NULL, '🔔 <b>hi</b>\n\nhi1234567890', NULL, NULL, NULL, 'sent', 0, '2026-05-25 08:47:58', '2026-05-25 08:47:58', '2026-05-25 08:47:58'),
(46, 9, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:57 AM\n📅 ថ្ងៃទី: 25 May 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-05-25 08:57:12', '2026-05-25 08:57:12', '2026-05-25 08:57:12'),
(47, 13, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:57 AM\n📅 ថ្ងៃទី: 25 May 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-05-25 08:57:17', '2026-05-25 08:57:17', '2026-05-25 08:57:17'),
(48, 10, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:58 AM\n📅 ថ្ងៃទី: 25 May 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-05-25 08:58:17', '2026-05-25 08:58:17', '2026-05-25 08:58:17'),
(49, 14, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:59 AM\n📅 ថ្ងៃទី: 25 May 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-05-25 08:59:40', '2026-05-25 08:59:40', '2026-05-25 08:59:40'),
(50, 6, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 09:16 AM\n📅 ថ្ងៃទី: 25 May 2026\n\n⚠️ ស្ថានភាព: មកយឺត\n⏳ យឺតចំនួន: 16m 49s', NULL, NULL, NULL, 'failed', 0, NULL, '2026-05-25 09:16:51', '2026-05-25 09:16:51'),
(51, 6, NULL, 'late_private', NULL, '⚠️ <b>ជូនដំណឹងមកយឺត</b>\n\n👤 បុគ្គលិក: Gak Vicheka\n🆔 លេខសម្គាល់: DSI004\n🕘 ម៉ោងចូល: 09:16 AM\n⏳ យឺតចំនួន: 16m 49s\n💰 កាត់ប្រាក់: $0.00\n\nស្ថានភាព: មកយឺត', NULL, NULL, NULL, 'failed', 0, NULL, '2026-05-25 09:16:53', '2026-05-25 09:16:53'),
(52, 12, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 09:17 AM\n📅 ថ្ងៃទី: 25 May 2026\n\n⚠️ ស្ថានភាព: មកយឺត\n⏳ យឺតចំនួន: 17m 46s', NULL, NULL, NULL, 'sent', 0, '2026-05-25 09:17:47', '2026-05-25 09:17:47', '2026-05-25 09:17:47'),
(53, 12, NULL, 'late_private', NULL, '⚠️ <b>ជូនដំណឹងមកយឺត</b>\n\n👤 បុគ្គលិក: Chu Kimhorng\n🆔 លេខសម្គាល់: ACC005\n🕘 ម៉ោងចូល: 09:17 AM\n⏳ យឺតចំនួន: 17m 46s\n💰 កាត់ប្រាក់: $0.00\n\nស្ថានភាព: មកយឺត', NULL, NULL, NULL, 'sent', 0, '2026-05-25 09:17:49', '2026-05-25 09:17:49', '2026-05-25 09:17:49'),
(54, 15, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 09:18 AM\n📅 ថ្ងៃទី: 25 May 2026\n\n⚠️ ស្ថានភាព: មកយឺត\n⏳ យឺតចំនួន: 18m 3s', NULL, NULL, NULL, 'failed', 0, NULL, '2026-05-25 09:18:05', '2026-05-25 09:18:05'),
(55, 15, NULL, 'late_private', NULL, '⚠️ <b>ជូនដំណឹងមកយឺត</b>\n\n👤 បុគ្គលិក: Mang Leanghort\n🆔 លេខសម្គាល់: ACC006\n🕘 ម៉ោងចូល: 09:18 AM\n⏳ យឺតចំនួន: 18m 3s\n💰 កាត់ប្រាក់: $0.00\n\nស្ថានភាព: មកយឺត', NULL, NULL, NULL, 'failed', 0, NULL, '2026-05-25 09:18:07', '2026-05-25 09:18:07'),
(56, 8, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 09:18 AM\n📅 ថ្ងៃទី: 25 May 2026\n\n⚠️ ស្ថានភាព: មកយឺត\n⏳ យឺតចំនួន: 18m 20s', NULL, NULL, NULL, 'sent', 0, '2026-05-25 09:18:22', '2026-05-25 09:18:22', '2026-05-25 09:18:22'),
(57, 8, NULL, 'late_private', NULL, '⚠️ <b>ជូនដំណឹងមកយឺត</b>\n\n👤 បុគ្គលិក: Yorn Lyna\n🆔 លេខសម្គាល់: IS006\n🕘 ម៉ោងចូល: 09:18 AM\n⏳ យឺតចំនួន: 18m 20s\n💰 កាត់ប្រាក់: $0.00\n\nស្ថានភាព: មកយឺត', NULL, NULL, NULL, 'sent', 0, '2026-05-25 09:18:24', '2026-05-25 09:18:24', '2026-05-25 09:18:24'),
(58, 3, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 09:20 AM\n📅 ថ្ងៃទី: 25 May 2026\n\n⚠️ ស្ថានភាព: មកយឺត\n⏳ យឺតចំនួន: 20m 26s', NULL, NULL, NULL, 'sent', 0, '2026-05-25 09:20:28', '2026-05-25 09:20:28', '2026-05-25 09:20:28'),
(59, 3, NULL, 'late_private', NULL, '⚠️ <b>ជូនដំណឹងមកយឺត</b>\n\n👤 បុគ្គលិក: Po Tilino\n🆔 លេខសម្គាល់: DSI003\n🕘 ម៉ោងចូល: 09:20 AM\n⏳ យឺតចំនួន: 20m 26s\n💰 កាត់ប្រាក់: $0.00\n\nស្ថានភាព: មកយឺត', NULL, NULL, NULL, 'sent', 0, '2026-05-25 09:20:30', '2026-05-25 09:20:30', '2026-05-25 09:20:30'),
(60, 5, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 09:21 AM\n📅 ថ្ងៃទី: 25 May 2026\n\n⚠️ ស្ថានភាព: មកយឺត\n⏳ យឺតចំនួន: 21m 12s', NULL, NULL, NULL, 'sent', 0, '2026-05-25 09:21:14', '2026-05-25 09:21:14', '2026-05-25 09:21:14'),
(61, 5, NULL, 'late_private', NULL, '⚠️ <b>ជូនដំណឹងមកយឺត</b>\n\n👤 បុគ្គលិក: Sorn Pugnavan\n🆔 លេខសម្គាល់: MK002\n🕘 ម៉ោងចូល: 09:21 AM\n⏳ យឺតចំនួន: 21m 12s\n💰 កាត់ប្រាក់: $0.00\n\nស្ថានភាព: មកយឺត', NULL, NULL, NULL, 'sent', 0, '2026-05-25 09:21:16', '2026-05-25 09:21:16', '2026-05-25 09:21:16'),
(62, 4, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 11:28 AM\n📅 ថ្ងៃទី: 25 May 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-05-25 11:28:58', '2026-05-25 11:28:58', '2026-05-25 11:28:58'),
(63, 1, NULL, 'permission_request_admin_private', NULL, '✅ <b>បានដាក់សំណើសុំអនុញ្ញាត</b>\n\n📄 <b>លេខសំណើ:</b> PR-2026-0004\n<b>👤 បុគ្គលិក:</b> Gak Vicheka\n📌 <b>ប្រភេទ:</b> Leave Request\n📅 <b>រយៈពេល:</b> 06 Jun 2026 – 07 Jun 2026\n📝 <b>មូលហេតុ:</b> go to trip at province\n\n⏳ <b>ស្ថានភាព:</b> កំពុងរង់ចាំអនុម័ត', NULL, NULL, NULL, 'sent', 0, '2026-05-25 16:36:58', '2026-05-25 16:36:58', '2026-05-25 16:36:58'),
(64, 6, NULL, 'permission_request_submitted_private', NULL, '📝 <b>សំណើរបស់អ្នកត្រូវបានដាក់រួចរាល់</b>\n\n📄 <b>លេខសំណើ:</b> PR-2026-0004\n📌 <b>ប្រភេទ:</b> Leave Request\n📅 <b>រយៈពេល:</b> 06 Jun 2026 – 07 Jun 2026\n📝 <b>មូលហេតុ:</b> go to trip at province\n\n⏳ <b>ស្ថានភាព:</b> កំពុងរង់ចាំអនុម័ត', NULL, NULL, NULL, 'failed', 0, NULL, '2026-05-25 16:36:59', '2026-05-25 16:36:59'),
(65, 6, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 09:16 AM\n🕘 ចេញម៉ោង: 05:05 PM\n📅 ថ្ងៃទី: 25 May 2026\n\n⏳ ម៉ោងធ្វើការ: 07h 49m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'failed', 0, NULL, '2026-05-25 17:06:00', '2026-05-25 17:06:00'),
(66, 8, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 09:18 AM\n🕘 ចេញម៉ោង: 05:06 PM\n📅 ថ្ងៃទី: 25 May 2026\n\n⏳ ម៉ោងធ្វើការ: 07h 48m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-05-25 17:06:35', '2026-05-25 17:06:35', '2026-05-25 17:06:35'),
(67, 5, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 09:21 AM\n🕘 ចេញម៉ោង: 05:13 PM\n📅 ថ្ងៃទី: 25 May 2026\n\n⏳ ម៉ោងធ្វើការ: 07h 52m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-05-25 17:13:39', '2026-05-25 17:13:39', '2026-05-25 17:13:39'),
(68, 3, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 09:20 AM\n🕘 ចេញម៉ោង: 05:16 PM\n📅 ថ្ងៃទី: 25 May 2026\n\n⏳ ម៉ោងធ្វើការ: 07h 55m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-05-25 17:16:11', '2026-05-25 17:16:11', '2026-05-25 17:16:11'),
(69, 4, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 11:28 AM\n🕘 ចេញម៉ោង: 05:24 PM\n📅 ថ្ងៃទី: 25 May 2026\n\n⏳ ម៉ោងធ្វើការ: 05h 55m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-05-25 17:24:56', '2026-05-25 17:24:56', '2026-05-25 17:24:56'),
(70, 15, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 09:18 AM\n🕘 ចេញម៉ោង: 05:28 PM\n📅 ថ្ងៃទី: 25 May 2026\n\n⏳ ម៉ោងធ្វើការ: 08h 10m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'failed', 0, NULL, '2026-05-25 17:28:29', '2026-05-25 17:28:29'),
(71, 14, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 08:59 AM\n🕘 ចេញម៉ោង: 05:29 PM\n📅 ថ្ងៃទី: 25 May 2026\n\n⏳ ម៉ោងធ្វើការ: 08h 30m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-05-25 17:29:55', '2026-05-25 17:29:55', '2026-05-25 17:29:55'),
(72, 10, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 08:58 AM\n🕘 ចេញម៉ោង: 06:56 PM\n📅 ថ្ងៃទី: 25 May 2026\n\n⏳ ម៉ោងធ្វើការ: 09h 58m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-05-25 18:56:40', '2026-05-25 18:56:40', '2026-05-25 18:56:40'),
(73, 12, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 09:17 AM\n🕘 ចេញម៉ោង: 06:57 PM\n📅 ថ្ងៃទី: 25 May 2026\n\n⏳ ម៉ោងធ្វើការ: 09h 40m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-05-25 18:57:53', '2026-05-25 18:57:53', '2026-05-25 18:57:53'),
(74, 9, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 08:57 AM\n🕘 ចេញម៉ោង: 07:02 PM\n📅 ថ្ងៃទី: 25 May 2026\n\n⏳ ម៉ោងធ្វើការ: 10h 05m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-05-25 19:02:45', '2026-05-25 19:02:45', '2026-05-25 19:02:45'),
(75, 13, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 08:57 AM\n🕘 ចេញម៉ោង: 07:05 PM\n📅 ថ្ងៃទី: 25 May 2026\n\n⏳ ម៉ោងធ្វើការ: 10h 07m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-05-25 19:05:11', '2026-05-25 19:05:11', '2026-05-25 19:05:11'),
(76, 8, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:21 AM\n📅 ថ្ងៃទី: 26 May 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-05-26 08:21:39', '2026-05-26 08:21:39', '2026-05-26 08:21:39'),
(77, 10, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:22 AM\n📅 ថ្ងៃទី: 26 May 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-05-26 08:22:46', '2026-05-26 08:22:46', '2026-05-26 08:22:46'),
(78, 9, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:23 AM\n📅 ថ្ងៃទី: 26 May 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-05-26 08:23:12', '2026-05-26 08:23:12', '2026-05-26 08:23:12'),
(79, 14, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:25 AM\n📅 ថ្ងៃទី: 26 May 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-05-26 08:25:22', '2026-05-26 08:25:22', '2026-05-26 08:25:22'),
(80, 13, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:30 AM\n📅 ថ្ងៃទី: 26 May 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-05-26 08:30:04', '2026-05-26 08:30:04', '2026-05-26 08:30:04'),
(81, 15, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:30 AM\n📅 ថ្ងៃទី: 26 May 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'failed', 0, NULL, '2026-05-26 08:30:20', '2026-05-26 08:30:20'),
(82, 3, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 09:12 AM\n📅 ថ្ងៃទី: 26 May 2026\n\n⚠️ ស្ថានភាព: មកយឺត\n⏳ យឺតចំនួន: 12m 49s', NULL, NULL, NULL, 'sent', 0, '2026-05-26 09:12:52', '2026-05-26 09:12:52', '2026-05-26 09:12:52'),
(83, 3, NULL, 'late_private', NULL, '⚠️ <b>ជូនដំណឹងមកយឺត</b>\n\n👤 បុគ្គលិក: Po Tilino\n🆔 លេខសម្គាល់: DSI003\n🕘 ម៉ោងចូល: 09:12 AM\n⏳ យឺតចំនួន: 12m 49s\n💰 កាត់ប្រាក់: $0.00\n\nស្ថានភាព: មកយឺត', NULL, NULL, NULL, 'sent', 0, '2026-05-26 09:12:54', '2026-05-26 09:12:54', '2026-05-26 09:12:54'),
(84, 6, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 09:13 AM\n📅 ថ្ងៃទី: 26 May 2026\n\n⚠️ ស្ថានភាព: មកយឺត\n⏳ យឺតចំនួន: 13m 47s', NULL, NULL, NULL, 'failed', 0, NULL, '2026-05-26 09:13:50', '2026-05-26 09:13:50'),
(85, 6, NULL, 'late_private', NULL, '⚠️ <b>ជូនដំណឹងមកយឺត</b>\n\n👤 បុគ្គលិក: Gak Vicheka\n🆔 លេខសម្គាល់: DSI004\n🕘 ម៉ោងចូល: 09:13 AM\n⏳ យឺតចំនួន: 13m 47s\n💰 កាត់ប្រាក់: $0.00\n\nស្ថានភាព: មកយឺត', NULL, NULL, NULL, 'failed', 0, NULL, '2026-05-26 09:13:52', '2026-05-26 09:13:52'),
(86, 5, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 09:36 AM\n📅 ថ្ងៃទី: 26 May 2026\n\n⚠️ ស្ថានភាព: មកយឺត\n⏳ យឺតចំនួន: 36m 11s', NULL, NULL, NULL, 'sent', 0, '2026-05-26 09:36:14', '2026-05-26 09:36:14', '2026-05-26 09:36:14'),
(87, 5, NULL, 'late_private', NULL, '⚠️ <b>ជូនដំណឹងមកយឺត</b>\n\n👤 បុគ្គលិក: Sorn Pugnavan\n🆔 លេខសម្គាល់: MK002\n🕘 ម៉ោងចូល: 09:36 AM\n⏳ យឺតចំនួន: 36m 11s\n💰 កាត់ប្រាក់: $1.50\n\nស្ថានភាព: មកយឺត', NULL, NULL, NULL, 'sent', 0, '2026-05-26 09:36:17', '2026-05-26 09:36:17', '2026-05-26 09:36:17'),
(88, 12, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 11:12 AM\n📅 ថ្ងៃទី: 26 May 2026\n\n⚠️ ស្ថានភាព: មកយឺត\n⏳ យឺតចំនួន: 2h 12m 1s', NULL, NULL, NULL, 'sent', 0, '2026-05-26 11:12:05', '2026-05-26 11:12:05', '2026-05-26 11:12:05'),
(89, 12, NULL, 'late_private', NULL, '⚠️ <b>ជូនដំណឹងមកយឺត</b>\n\n👤 បុគ្គលិក: Chu Kimhorng\n🆔 លេខសម្គាល់: ACC005\n🕘 ម៉ោងចូល: 11:12 AM\n⏳ យឺតចំនួន: 2h 12m 1s\n💰 កាត់ប្រាក់: $0.00\n\nស្ថានភាព: មកយឺត', NULL, NULL, NULL, 'sent', 0, '2026-05-26 11:12:08', '2026-05-26 11:12:08', '2026-05-26 11:12:08'),
(90, 4, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 11:24 AM\n📅 ថ្ងៃទី: 26 May 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-05-26 11:24:12', '2026-05-26 11:24:12', '2026-05-26 11:24:12'),
(91, 6, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 09:13 AM\n🕘 ចេញម៉ោង: 05:03 PM\n📅 ថ្ងៃទី: 26 May 2026\n\n⏳ ម៉ោងធ្វើការ: 07h 49m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'failed', 0, NULL, '2026-05-26 17:03:32', '2026-05-26 17:03:32'),
(92, 8, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 08:21 AM\n🕘 ចេញម៉ោង: 05:13 PM\n📅 ថ្ងៃទី: 26 May 2026\n\n⏳ ម៉ោងធ្វើការ: 08h 51m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-05-26 17:13:09', '2026-05-26 17:13:09', '2026-05-26 17:13:09'),
(93, 4, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 11:24 AM\n🕘 ចេញម៉ោង: 05:19 PM\n📅 ថ្ងៃទី: 26 May 2026\n\n⏳ ម៉ោងធ្វើការ: 05h 55m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-05-26 17:19:42', '2026-05-26 17:19:42', '2026-05-26 17:19:42'),
(94, 5, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 09:36 AM\n🕘 ចេញម៉ោង: 05:20 PM\n📅 ថ្ងៃទី: 26 May 2026\n\n⏳ ម៉ោងធ្វើការ: 07h 44m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-05-26 17:20:20', '2026-05-26 17:20:20', '2026-05-26 17:20:20'),
(95, 3, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 09:12 AM\n🕘 ចេញម៉ោង: 05:21 PM\n📅 ថ្ងៃទី: 26 May 2026\n\n⏳ ម៉ោងធ្វើការ: 08h 08m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-05-26 17:21:42', '2026-05-26 17:21:42', '2026-05-26 17:21:42'),
(96, 14, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 08:25 AM\n🕘 ចេញម៉ោង: 05:59 PM\n📅 ថ្ងៃទី: 26 May 2026\n\n⏳ ម៉ោងធ្វើការ: 09h 34m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-05-26 17:59:49', '2026-05-26 17:59:49', '2026-05-26 17:59:49'),
(97, 13, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 08:30 AM\n🕘 ចេញម៉ោង: 06:59 PM\n📅 ថ្ងៃទី: 26 May 2026\n\n⏳ ម៉ោងធ្វើការ: 10h 29m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-05-26 18:59:17', '2026-05-26 18:59:17', '2026-05-26 18:59:17'),
(98, 10, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 08:22 AM\n🕘 ចេញម៉ោង: 06:59 PM\n📅 ថ្ងៃទី: 26 May 2026\n\n⏳ ម៉ោងធ្វើការ: 10h 37m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-05-26 18:59:59', '2026-05-26 18:59:59', '2026-05-26 18:59:59'),
(99, 15, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 08:30 AM\n🕘 ចេញម៉ោង: 07:41 PM\n📅 ថ្ងៃទី: 26 May 2026\n\n⏳ ម៉ោងធ្វើការ: 11h 11m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'failed', 0, NULL, '2026-05-26 19:41:54', '2026-05-26 19:41:54'),
(100, 9, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 08:23 AM\n🕘 ចេញម៉ោង: 07:45 PM\n📅 ថ្ងៃទី: 26 May 2026\n\n⏳ ម៉ោងធ្វើការ: 11h 22m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-05-26 19:46:00', '2026-05-26 19:46:00', '2026-05-26 19:46:00'),
(101, 12, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 11:12 AM\n🕘 ចេញម៉ោង: 07:46 PM\n📅 ថ្ងៃទី: 26 May 2026\n\n⏳ ម៉ោងធ្វើការ: 08h 34m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-05-26 19:46:50', '2026-05-26 19:46:50', '2026-05-26 19:46:50'),
(102, 16, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:01 AM\n📅 ថ្ងៃទី: 27 May 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-05-27 08:02:02', '2026-05-27 08:02:02', '2026-05-27 08:02:02'),
(103, 9, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:09 AM\n📅 ថ្ងៃទី: 27 May 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-05-27 08:09:40', '2026-05-27 08:09:40', '2026-05-27 08:09:40'),
(104, 8, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:11 AM\n📅 ថ្ងៃទី: 27 May 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-05-27 08:11:05', '2026-05-27 08:11:05', '2026-05-27 08:11:05'),
(105, 14, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:28 AM\n📅 ថ្ងៃទី: 27 May 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-05-27 08:28:46', '2026-05-27 08:28:46', '2026-05-27 08:28:46'),
(106, 13, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:38 AM\n📅 ថ្ងៃទី: 27 May 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-05-27 08:38:12', '2026-05-27 08:38:12', '2026-05-27 08:38:12'),
(107, 10, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:40 AM\n📅 ថ្ងៃទី: 27 May 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-05-27 08:40:11', '2026-05-27 08:40:11', '2026-05-27 08:40:11'),
(108, 5, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:40 AM\n📅 ថ្ងៃទី: 27 May 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-05-27 08:40:54', '2026-05-27 08:40:54', '2026-05-27 08:40:54'),
(109, 6, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 09:00 AM\n📅 ថ្ងៃទី: 27 May 2026\n\n⚠️ ស្ថានភាព: មកយឺត\n⏳ យឺតចំនួន: 29s', NULL, NULL, NULL, 'failed', 0, NULL, '2026-05-27 09:00:32', '2026-05-27 09:00:32'),
(110, 6, NULL, 'late_private', NULL, '⚠️ <b>ជូនដំណឹងមកយឺត</b>\n\n👤 បុគ្គលិក: Gak Vicheka\n🆔 លេខសម្គាល់: DSI004\n🕘 ម៉ោងចូល: 09:00 AM\n⏳ យឺតចំនួន: 29s\n💰 កាត់ប្រាក់: $0.00\n\nស្ថានភាព: មកយឺត', NULL, NULL, NULL, 'failed', 0, NULL, '2026-05-27 09:00:34', '2026-05-27 09:00:34'),
(111, 12, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 09:13 AM\n📅 ថ្ងៃទី: 27 May 2026\n\n⚠️ ស្ថានភាព: មកយឺត\n⏳ យឺតចំនួន: 13m 22s', NULL, NULL, NULL, 'sent', 0, '2026-05-27 09:13:24', '2026-05-27 09:13:24', '2026-05-27 09:13:24'),
(112, 12, NULL, 'late_private', NULL, '⚠️ <b>ជូនដំណឹងមកយឺត</b>\n\n👤 បុគ្គលិក: Chu Kimhorng\n🆔 លេខសម្គាល់: ACC005\n🕘 ម៉ោងចូល: 09:13 AM\n⏳ យឺតចំនួន: 13m 22s\n💰 កាត់ប្រាក់: $0.00\n\nស្ថានភាព: មកយឺត', NULL, NULL, NULL, 'sent', 0, '2026-05-27 09:13:26', '2026-05-27 09:13:26', '2026-05-27 09:13:26'),
(113, 3, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 09:21 AM\n📅 ថ្ងៃទី: 27 May 2026\n\n⚠️ ស្ថានភាព: មកយឺត\n⏳ យឺតចំនួន: 21m 18s', NULL, NULL, NULL, 'sent', 0, '2026-05-27 09:21:20', '2026-05-27 09:21:20', '2026-05-27 09:21:20'),
(114, 3, NULL, 'late_private', NULL, '⚠️ <b>ជូនដំណឹងមកយឺត</b>\n\n👤 បុគ្គលិក: Po Tilino\n🆔 លេខសម្គាល់: DSI003\n🕘 ម៉ោងចូល: 09:21 AM\n⏳ យឺតចំនួន: 21m 18s\n💰 កាត់ប្រាក់: $0.00\n\nស្ថានភាព: មកយឺត', NULL, NULL, NULL, 'sent', 0, '2026-05-27 09:21:22', '2026-05-27 09:21:22', '2026-05-27 09:21:22'),
(115, 4, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 11:25 AM\n📅 ថ្ងៃទី: 27 May 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-05-27 11:25:02', '2026-05-27 11:25:02', '2026-05-27 11:25:02'),
(116, 4, NULL, 'website_notification_private', NULL, '🔔 <b>Hi</b>\n\nC bay', NULL, NULL, NULL, 'sent', 0, '2026-05-27 13:54:58', '2026-05-27 13:54:58', '2026-05-27 13:54:58'),
(117, 4, NULL, 'website_notification_private', NULL, '🔔 <b>fast message</b>\n\nMk room meeting tix\nhurry up', NULL, NULL, NULL, 'sent', 0, '2026-05-27 15:42:53', '2026-05-27 15:42:53', '2026-05-27 15:42:53'),
(118, 1, NULL, 'website_notification_private', NULL, '🔔 <b>lern</b>\n\nlern lern', NULL, NULL, NULL, 'sent', 0, '2026-05-27 15:43:05', '2026-05-27 15:43:05', '2026-05-27 15:43:05'),
(119, 3, NULL, 'website_notification_private', NULL, '🔔 <b>lern</b>\n\nlern lern', NULL, NULL, NULL, 'sent', 0, '2026-05-27 15:43:06', '2026-05-27 15:43:06', '2026-05-27 15:43:06'),
(120, 4, NULL, 'website_notification_private', NULL, '🔔 <b>lern</b>\n\nlern lern', NULL, NULL, NULL, 'sent', 0, '2026-05-27 15:43:06', '2026-05-27 15:43:06', '2026-05-27 15:43:06'),
(121, 5, NULL, 'website_notification_private', NULL, '🔔 <b>lern</b>\n\nlern lern', NULL, NULL, NULL, 'sent', 0, '2026-05-27 15:43:07', '2026-05-27 15:43:07', '2026-05-27 15:43:07'),
(122, 6, NULL, 'website_notification_private', NULL, '🔔 <b>lern</b>\n\nlern lern', NULL, NULL, NULL, 'failed', 0, NULL, '2026-05-27 15:43:08', '2026-05-27 15:43:08'),
(123, 8, NULL, 'website_notification_private', NULL, '🔔 <b>lern</b>\n\nlern lern', NULL, NULL, NULL, 'sent', 0, '2026-05-27 15:43:09', '2026-05-27 15:43:09', '2026-05-27 15:43:09'),
(124, 9, NULL, 'website_notification_private', NULL, '🔔 <b>lern</b>\n\nlern lern', NULL, NULL, NULL, 'sent', 0, '2026-05-27 15:43:10', '2026-05-27 15:43:10', '2026-05-27 15:43:10'),
(125, 10, NULL, 'website_notification_private', NULL, '🔔 <b>lern</b>\n\nlern lern', NULL, NULL, NULL, 'sent', 0, '2026-05-27 15:43:11', '2026-05-27 15:43:11', '2026-05-27 15:43:11'),
(126, 12, NULL, 'website_notification_private', NULL, '🔔 <b>lern</b>\n\nlern lern', NULL, NULL, NULL, 'sent', 0, '2026-05-27 15:43:12', '2026-05-27 15:43:12', '2026-05-27 15:43:12'),
(127, 13, NULL, 'website_notification_private', NULL, '🔔 <b>lern</b>\n\nlern lern', NULL, NULL, NULL, 'sent', 0, '2026-05-27 15:43:13', '2026-05-27 15:43:13', '2026-05-27 15:43:13'),
(128, 14, NULL, 'website_notification_private', NULL, '🔔 <b>lern</b>\n\nlern lern', NULL, NULL, NULL, 'sent', 0, '2026-05-27 15:43:14', '2026-05-27 15:43:14', '2026-05-27 15:43:14'),
(129, 15, NULL, 'website_notification_private', NULL, '🔔 <b>lern</b>\n\nlern lern', NULL, NULL, NULL, 'failed', 0, NULL, '2026-05-27 15:43:15', '2026-05-27 15:43:15'),
(130, 16, NULL, 'website_notification_private', NULL, '🔔 <b>lern</b>\n\nlern lern', NULL, NULL, NULL, 'sent', 0, '2026-05-27 15:43:15', '2026-05-27 15:43:15', '2026-05-27 15:43:15'),
(131, 19, NULL, 'website_notification_private', NULL, '🔔 <b>lern</b>\n\nlern lern', NULL, NULL, NULL, 'sent', 0, '2026-05-27 15:43:16', '2026-05-27 15:43:16', '2026-05-27 15:43:16'),
(132, 4, NULL, 'website_notification_private', NULL, '🔔 <b>bro pheak</b>\n\npheak', NULL, NULL, NULL, 'sent', 0, '2026-05-27 15:43:51', '2026-05-27 15:43:51', '2026-05-27 15:43:51'),
(133, 6, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 09:00 AM\n🕘 ចេញម៉ោង: 05:04 PM\n📅 ថ្ងៃទី: 27 May 2026\n\n⏳ ម៉ោងធ្វើការ: 08h 04m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'failed', 0, NULL, '2026-05-27 17:04:47', '2026-05-27 17:04:47'),
(134, 19, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 08:58 AM\n🕘 ចេញម៉ោង: 05:10 PM\n📅 ថ្ងៃទី: 27 May 2026\n\n⏳ ម៉ោងធ្វើការ: 08h 11m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-05-27 17:10:08', '2026-05-27 17:10:08', '2026-05-27 17:10:08'),
(135, 14, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 08:28 AM\n🕘 ចេញម៉ោង: 05:10 PM\n📅 ថ្ងៃទី: 27 May 2026\n\n⏳ ម៉ោងធ្វើការ: 08h 41m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-05-27 17:10:13', '2026-05-27 17:10:13', '2026-05-27 17:10:13'),
(136, 5, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 08:40 AM\n🕘 ចេញម៉ោង: 05:15 PM\n📅 ថ្ងៃទី: 27 May 2026\n\n⏳ ម៉ោងធ្វើការ: 08h 34m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-05-27 17:15:27', '2026-05-27 17:15:27', '2026-05-27 17:15:27'),
(137, 16, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 08:01 AM\n🕘 ចេញម៉ោង: 05:20 PM\n📅 ថ្ងៃទី: 27 May 2026\n\n⏳ ម៉ោងធ្វើការ: 09h 18m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-05-27 17:20:08', '2026-05-27 17:20:08', '2026-05-27 17:20:08'),
(138, 3, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 09:21 AM\n🕘 ចេញម៉ោង: 05:20 PM\n📅 ថ្ងៃទី: 27 May 2026\n\n⏳ ម៉ោងធ្វើការ: 07h 59m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-05-27 17:20:46', '2026-05-27 17:20:46', '2026-05-27 17:20:46'),
(139, 8, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 08:11 AM\n🕘 ចេញម៉ោង: 05:31 PM\n📅 ថ្ងៃទី: 27 May 2026\n\n⏳ ម៉ោងធ្វើការ: 09h 20m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-05-27 17:31:07', '2026-05-27 17:31:07', '2026-05-27 17:31:07'),
(140, 4, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 11:25 AM\n🕘 ចេញម៉ោង: 05:44 PM\n📅 ថ្ងៃទី: 27 May 2026\n\n⏳ ម៉ោងធ្វើការ: 06h 19m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-05-27 17:44:43', '2026-05-27 17:44:43', '2026-05-27 17:44:43'),
(141, 10, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 08:40 AM\n🕘 ចេញម៉ោង: 08:10 PM\n📅 ថ្ងៃទី: 27 May 2026\n\n⏳ ម៉ោងធ្វើការ: 11h 30m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-05-27 20:10:27', '2026-05-27 20:10:27', '2026-05-27 20:10:27'),
(142, 13, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 08:38 AM\n🕘 ចេញម៉ោង: 09:50 PM\n📅 ថ្ងៃទី: 27 May 2026\n\n⏳ ម៉ោងធ្វើការ: 13h 12m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-05-27 21:50:25', '2026-05-27 21:50:25', '2026-05-27 21:50:25'),
(143, 9, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 08:09 AM\n🕘 ចេញម៉ោង: 09:58 PM\n📅 ថ្ងៃទី: 27 May 2026\n\n⏳ ម៉ោងធ្វើការ: 13h 48m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-05-27 21:58:23', '2026-05-27 21:58:23', '2026-05-27 21:58:23'),
(144, 12, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 09:13 AM\n🕘 ចេញម៉ោង: 09:59 PM\n📅 ថ្ងៃទី: 27 May 2026\n\n⏳ ម៉ោងធ្វើការ: 12h 45m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-05-27 21:59:12', '2026-05-27 21:59:12', '2026-05-27 21:59:12'),
(145, 16, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:09 AM\n📅 ថ្ងៃទី: 28 May 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-05-28 08:09:30', '2026-05-28 08:09:30', '2026-05-28 08:09:30'),
(146, 14, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:18 AM\n📅 ថ្ងៃទី: 28 May 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-05-28 08:18:27', '2026-05-28 08:18:27', '2026-05-28 08:18:27'),
(147, 9, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:27 AM\n📅 ថ្ងៃទី: 28 May 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-05-28 08:27:23', '2026-05-28 08:27:23', '2026-05-28 08:27:23'),
(148, 8, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:37 AM\n📅 ថ្ងៃទី: 28 May 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-05-28 08:37:50', '2026-05-28 08:37:50', '2026-05-28 08:37:50'),
(149, 5, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:39 AM\n📅 ថ្ងៃទី: 28 May 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-05-28 08:39:48', '2026-05-28 08:39:48', '2026-05-28 08:39:48'),
(150, 6, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:50 AM\n📅 ថ្ងៃទី: 28 May 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'failed', 0, NULL, '2026-05-28 08:50:10', '2026-05-28 08:50:10'),
(151, 15, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:50 AM\n📅 ថ្ងៃទី: 28 May 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'failed', 0, NULL, '2026-05-28 08:50:44', '2026-05-28 08:50:44'),
(152, 19, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:51 AM\n📅 ថ្ងៃទី: 28 May 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-05-28 08:51:08', '2026-05-28 08:51:08', '2026-05-28 08:51:08'),
(153, 10, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:51 AM\n📅 ថ្ងៃទី: 28 May 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-05-28 08:51:50', '2026-05-28 08:51:50', '2026-05-28 08:51:50'),
(154, 13, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:52 AM\n📅 ថ្ងៃទី: 28 May 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-05-28 08:52:45', '2026-05-28 08:52:45', '2026-05-28 08:52:45'),
(155, 12, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:53 AM\n📅 ថ្ងៃទី: 28 May 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-05-28 08:53:21', '2026-05-28 08:53:21', '2026-05-28 08:53:21'),
(156, 3, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 09:15 AM\n📅 ថ្ងៃទី: 28 May 2026\n\n⚠️ ស្ថានភាព: មកយឺត\n⏳ យឺតចំនួន: 15m 27s', NULL, NULL, NULL, 'sent', 0, '2026-05-28 09:15:30', '2026-05-28 09:15:30', '2026-05-28 09:15:30'),
(157, 3, NULL, 'late_private', NULL, '⚠️ <b>ជូនដំណឹងមកយឺត</b>\n\n👤 បុគ្គលិក: Po Tilino\n🆔 លេខសម្គាល់: DSI003\n🕘 ម៉ោងចូល: 09:15 AM\n⏳ យឺតចំនួន: 15m 27s\n💰 កាត់ប្រាក់: $0.00\n\nស្ថានភាព: មកយឺត', NULL, NULL, NULL, 'sent', 0, '2026-05-28 09:15:32', '2026-05-28 09:15:32', '2026-05-28 09:15:32'),
(158, 4, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 11:36 AM\n📅 ថ្ងៃទី: 28 May 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-05-28 11:36:05', '2026-05-28 11:36:05', '2026-05-28 11:36:05'),
(159, 6, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 08:50 AM\n🕘 ចេញម៉ោង: 05:04 PM\n📅 ថ្ងៃទី: 28 May 2026\n\n⏳ ម៉ោងធ្វើការ: 08h 14m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'failed', 0, NULL, '2026-05-28 17:04:13', '2026-05-28 17:04:13'),
(160, 5, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 08:39 AM\n🕘 ចេញម៉ោង: 05:04 PM\n📅 ថ្ងៃទី: 28 May 2026\n\n⏳ ម៉ោងធ្វើការ: 08h 24m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-05-28 17:04:48', '2026-05-28 17:04:48', '2026-05-28 17:04:48'),
(161, 16, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 08:09 AM\n🕘 ចេញម៉ោង: 05:05 PM\n📅 ថ្ងៃទី: 28 May 2026\n\n⏳ ម៉ោងធ្វើការ: 08h 56m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-05-28 17:05:46', '2026-05-28 17:05:46', '2026-05-28 17:05:46'),
(162, 3, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 09:15 AM\n🕘 ចេញម៉ោង: 05:10 PM\n📅 ថ្ងៃទី: 28 May 2026\n\n⏳ ម៉ោងធ្វើការ: 07h 54m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-05-28 17:10:05', '2026-05-28 17:10:05', '2026-05-28 17:10:05'),
(163, 19, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 08:51 AM\n🕘 ចេញម៉ោង: 05:10 PM\n📅 ថ្ងៃទី: 28 May 2026\n\n⏳ ម៉ោងធ្វើការ: 08h 19m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-05-28 17:10:34', '2026-05-28 17:10:34', '2026-05-28 17:10:34'),
(164, 14, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 08:18 AM\n🕘 ចេញម៉ោង: 05:11 PM\n📅 ថ្ងៃទី: 28 May 2026\n\n⏳ ម៉ោងធ្វើការ: 08h 53m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-05-28 17:12:02', '2026-05-28 17:12:02', '2026-05-28 17:12:02'),
(165, 4, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 11:36 AM\n🕘 ចេញម៉ោង: 05:27 PM\n📅 ថ្ងៃទី: 28 May 2026\n\n⏳ ម៉ោងធ្វើការ: 05h 51m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-05-28 17:27:05', '2026-05-28 17:27:05', '2026-05-28 17:27:05'),
(166, 8, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 08:37 AM\n🕘 ចេញម៉ោង: 05:58 PM\n📅 ថ្ងៃទី: 28 May 2026\n\n⏳ ម៉ោងធ្វើការ: 09h 20m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-05-28 17:58:48', '2026-05-28 17:58:48', '2026-05-28 17:58:48'),
(167, 13, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 08:52 AM\n🕘 ចេញម៉ោង: 09:03 PM\n📅 ថ្ងៃទី: 28 May 2026\n\n⏳ ម៉ោងធ្វើការ: 12h 11m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-05-28 21:03:56', '2026-05-28 21:03:56', '2026-05-28 21:03:56'),
(168, 12, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 08:53 AM\n🕘 ចេញម៉ោង: 10:08 PM\n📅 ថ្ងៃទី: 28 May 2026\n\n⏳ ម៉ោងធ្វើការ: 13h 15m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-05-28 22:08:31', '2026-05-28 22:08:31', '2026-05-28 22:08:31'),
(169, 9, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 08:27 AM\n🕘 ចេញម៉ោង: 10:09 PM\n📅 ថ្ងៃទី: 28 May 2026\n\n⏳ ម៉ោងធ្វើការ: 13h 41m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-05-28 22:09:15', '2026-05-28 22:09:15', '2026-05-28 22:09:15'),
(170, 16, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:13 AM\n📅 ថ្ងៃទី: 29 May 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-05-29 08:13:54', '2026-05-29 08:13:54', '2026-05-29 08:13:54'),
(171, 8, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:14 AM\n📅 ថ្ងៃទី: 29 May 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-05-29 08:14:04', '2026-05-29 08:14:04', '2026-05-29 08:14:04'),
(172, 14, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:25 AM\n📅 ថ្ងៃទី: 29 May 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-05-29 08:25:57', '2026-05-29 08:25:57', '2026-05-29 08:25:57'),
(173, 5, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:32 AM\n📅 ថ្ងៃទី: 29 May 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-05-29 08:32:52', '2026-05-29 08:32:52', '2026-05-29 08:32:52'),
(174, 9, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:44 AM\n📅 ថ្ងៃទី: 29 May 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-05-29 08:44:45', '2026-05-29 08:44:45', '2026-05-29 08:44:45'),
(175, 15, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:51 AM\n📅 ថ្ងៃទី: 29 May 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'failed', 0, NULL, '2026-05-29 08:51:10', '2026-05-29 08:51:10'),
(176, 10, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:56 AM\n📅 ថ្ងៃទី: 29 May 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-05-29 08:56:52', '2026-05-29 08:56:52', '2026-05-29 08:56:52'),
(177, 19, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 09:04 AM\n📅 ថ្ងៃទី: 29 May 2026\n\n⚠️ ស្ថានភាព: មកយឺត\n⏳ យឺតចំនួន: 4m 31s', NULL, NULL, NULL, 'sent', 0, '2026-05-29 09:04:35', '2026-05-29 09:04:35', '2026-05-29 09:04:35'),
(178, 19, NULL, 'late_private', NULL, '⚠️ <b>ជូនដំណឹងមកយឺត</b>\n\n👤 បុគ្គលិក: Heng Laiheang\n🆔 លេខសម្គាល់: acc008\n🕘 ម៉ោងចូល: 09:04 AM\n⏳ យឺតចំនួន: 4m 31s\n💰 កាត់ប្រាក់: $0.00\n\nស្ថានភាព: មកយឺត', NULL, NULL, NULL, 'sent', 0, '2026-05-29 09:04:37', '2026-05-29 09:04:37', '2026-05-29 09:04:37'),
(179, 6, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 09:07 AM\n📅 ថ្ងៃទី: 29 May 2026\n\n⚠️ ស្ថានភាព: មកយឺត\n⏳ យឺតចំនួន: 7m 59s', NULL, NULL, NULL, 'failed', 0, NULL, '2026-05-29 09:08:02', '2026-05-29 09:08:02'),
(180, 6, NULL, 'late_private', NULL, '⚠️ <b>ជូនដំណឹងមកយឺត</b>\n\n👤 បុគ្គលិក: Gak Vicheka\n🆔 លេខសម្គាល់: DSI004\n🕘 ម៉ោងចូល: 09:07 AM\n⏳ យឺតចំនួន: 7m 59s\n💰 កាត់ប្រាក់: $0.00\n\nស្ថានភាព: មកយឺត', NULL, NULL, NULL, 'failed', 0, NULL, '2026-05-29 09:08:04', '2026-05-29 09:08:04'),
(181, 3, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 09:26 AM\n📅 ថ្ងៃទី: 29 May 2026\n\n⚠️ ស្ថានភាព: មកយឺត\n⏳ យឺតចំនួន: 26m 29s', NULL, NULL, NULL, 'sent', 0, '2026-05-29 09:26:33', '2026-05-29 09:26:33', '2026-05-29 09:26:33'),
(182, 3, NULL, 'late_private', NULL, '⚠️ <b>ជូនដំណឹងមកយឺត</b>\n\n👤 បុគ្គលិក: Po Tilino\n🆔 លេខសម្គាល់: DSI003\n🕘 ម៉ោងចូល: 09:26 AM\n⏳ យឺតចំនួន: 26m 29s\n💰 កាត់ប្រាក់: $0.00\n\nស្ថានភាព: មកយឺត', NULL, NULL, NULL, 'sent', 0, '2026-05-29 09:26:35', '2026-05-29 09:26:35', '2026-05-29 09:26:35'),
(183, 13, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 09:28 AM\n📅 ថ្ងៃទី: 29 May 2026\n\n⚠️ ស្ថានភាព: មកយឺត\n⏳ យឺតចំនួន: 28m 54s', NULL, NULL, NULL, 'sent', 0, '2026-05-29 09:28:57', '2026-05-29 09:28:57', '2026-05-29 09:28:57'),
(184, 13, NULL, 'late_private', NULL, '⚠️ <b>ជូនដំណឹងមកយឺត</b>\n\n👤 បុគ្គលិក: Chean Aleav\n🆔 លេខសម្គាល់: ACC003\n🕘 ម៉ោងចូល: 09:28 AM\n⏳ យឺតចំនួន: 28m 54s\n💰 កាត់ប្រាក់: $0.00\n\nស្ថានភាព: មកយឺត', NULL, NULL, NULL, 'sent', 0, '2026-05-29 09:28:59', '2026-05-29 09:28:59', '2026-05-29 09:28:59'),
(185, 12, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 09:30 AM\n📅 ថ្ងៃទី: 29 May 2026\n\n⚠️ ស្ថានភាព: មកយឺត\n⏳ យឺតចំនួន: 30m 17s', NULL, NULL, NULL, 'sent', 0, '2026-05-29 09:30:20', '2026-05-29 09:30:20', '2026-05-29 09:30:20'),
(186, 12, NULL, 'late_private', NULL, '⚠️ <b>ជូនដំណឹងមកយឺត</b>\n\n👤 បុគ្គលិក: Chu Kimhorng\n🆔 លេខសម្គាល់: ACC005\n🕘 ម៉ោងចូល: 09:30 AM\n⏳ យឺតចំនួន: 30m 17s\n💰 កាត់ប្រាក់: $1.50\n\nស្ថានភាព: មកយឺត', NULL, NULL, NULL, 'sent', 0, '2026-05-29 09:30:23', '2026-05-29 09:30:23', '2026-05-29 09:30:23'),
(187, 4, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 11:40 AM\n📅 ថ្ងៃទី: 29 May 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-05-29 11:40:33', '2026-05-29 11:40:33', '2026-05-29 11:40:33'),
(188, 6, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 09:07 AM\n🕘 ចេញម៉ោង: 05:00 PM\n📅 ថ្ងៃទី: 29 May 2026\n\n⏳ ម៉ោងធ្វើការ: 07h 52m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'failed', 0, NULL, '2026-05-29 17:00:43', '2026-05-29 17:00:43'),
(189, 16, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 08:13 AM\n🕘 ចេញម៉ោង: 05:06 PM\n📅 ថ្ងៃទី: 29 May 2026\n\n⏳ ម៉ោងធ្វើការ: 08h 52m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-05-29 17:06:05', '2026-05-29 17:06:05', '2026-05-29 17:06:05'),
(190, 19, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 09:04 AM\n🕘 ចេញម៉ោង: 05:07 PM\n📅 ថ្ងៃទី: 29 May 2026\n\n⏳ ម៉ោងធ្វើការ: 08h 03m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-05-29 17:07:48', '2026-05-29 17:07:48', '2026-05-29 17:07:48'),
(191, 5, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 08:32 AM\n🕘 ចេញម៉ោង: 05:21 PM\n📅 ថ្ងៃទី: 29 May 2026\n\n⏳ ម៉ោងធ្វើការ: 08h 49m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-05-29 17:22:00', '2026-05-29 17:22:00', '2026-05-29 17:22:00');
INSERT INTO `telegram_logs` (`id`, `employee_id`, `customer_visit_id`, `message_type`, `event_key`, `telegram_message`, `selfie_url`, `store_photo_url`, `error_message`, `status`, `attempts`, `sent_at`, `created_at`, `updated_at`) VALUES
(192, 15, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 08:51 AM\n🕘 ចេញម៉ោង: 05:22 PM\n📅 ថ្ងៃទី: 29 May 2026\n\n⏳ ម៉ោងធ្វើការ: 08h 31m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'failed', 0, NULL, '2026-05-29 17:22:46', '2026-05-29 17:22:46'),
(193, 3, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 09:26 AM\n🕘 ចេញម៉ោង: 05:24 PM\n📅 ថ្ងៃទី: 29 May 2026\n\n⏳ ម៉ោងធ្វើការ: 07h 57m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-05-29 17:24:24', '2026-05-29 17:24:24', '2026-05-29 17:24:24'),
(194, 14, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 08:25 AM\n🕘 ចេញម៉ោង: 05:24 PM\n📅 ថ្ងៃទី: 29 May 2026\n\n⏳ ម៉ោងធ្វើការ: 08h 58m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-05-29 17:24:49', '2026-05-29 17:24:49', '2026-05-29 17:24:49'),
(195, 8, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 08:14 AM\n🕘 ចេញម៉ោង: 05:26 PM\n📅 ថ្ងៃទី: 29 May 2026\n\n⏳ ម៉ោងធ្វើការ: 09h 12m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-05-29 17:26:26', '2026-05-29 17:26:26', '2026-05-29 17:26:26'),
(196, 10, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 08:56 AM\n🕘 ចេញម៉ោង: 05:43 PM\n📅 ថ្ងៃទី: 29 May 2026\n\n⏳ ម៉ោងធ្វើការ: 08h 46m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-05-29 17:43:44', '2026-05-29 17:43:44', '2026-05-29 17:43:44'),
(197, 13, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 09:28 AM\n🕘 ចេញម៉ោង: 05:44 PM\n📅 ថ្ងៃទី: 29 May 2026\n\n⏳ ម៉ោងធ្វើការ: 08h 15m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-05-29 17:44:14', '2026-05-29 17:44:14', '2026-05-29 17:44:14'),
(198, 12, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 09:30 AM\n🕘 ចេញម៉ោង: 05:45 PM\n📅 ថ្ងៃទី: 29 May 2026\n\n⏳ ម៉ោងធ្វើការ: 08h 15m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-05-29 17:45:54', '2026-05-29 17:45:54', '2026-05-29 17:45:54'),
(199, 4, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 11:40 AM\n🕘 ចេញម៉ោង: 10:23 PM\n📅 ថ្ងៃទី: 29 May 2026\n\n⏳ ម៉ោងធ្វើការ: 10h 43m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-05-29 22:23:47', '2026-05-29 22:23:47', '2026-05-29 22:23:47'),
(200, 16, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:14 AM\n📅 ថ្ងៃទី: 30 May 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'failed', 0, NULL, '2026-05-30 08:15:08', '2026-05-30 08:15:08'),
(201, 9, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:26 AM\n📅 ថ្ងៃទី: 30 May 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-05-30 08:26:33', '2026-05-30 08:26:33', '2026-05-30 08:26:33'),
(202, 14, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:27 AM\n📅 ថ្ងៃទី: 30 May 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-05-30 08:27:17', '2026-05-30 08:27:17', '2026-05-30 08:27:17'),
(203, 15, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:37 AM\n📅 ថ្ងៃទី: 30 May 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'failed', 0, NULL, '2026-05-30 08:37:43', '2026-05-30 08:37:43'),
(204, 5, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:37 AM\n📅 ថ្ងៃទី: 30 May 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-05-30 08:37:45', '2026-05-30 08:37:45', '2026-05-30 08:37:45'),
(205, 12, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:40 AM\n📅 ថ្ងៃទី: 30 May 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-05-30 08:40:58', '2026-05-30 08:40:58', '2026-05-30 08:40:58'),
(206, 13, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:51 AM\n📅 ថ្ងៃទី: 30 May 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-05-30 08:52:02', '2026-05-30 08:52:02', '2026-05-30 08:52:02'),
(207, 10, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:54 AM\n📅 ថ្ងៃទី: 30 May 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-05-30 08:54:34', '2026-05-30 08:54:34', '2026-05-30 08:54:34'),
(208, 6, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:56 AM\n📅 ថ្ងៃទី: 30 May 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'failed', 0, NULL, '2026-05-30 08:56:08', '2026-05-30 08:56:08'),
(209, 3, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 09:24 AM\n📅 ថ្ងៃទី: 30 May 2026\n\n⚠️ ស្ថានភាព: មកយឺត\n⏳ យឺតចំនួន: 24m 16s', NULL, NULL, NULL, 'sent', 0, '2026-05-30 09:24:19', '2026-05-30 09:24:19', '2026-05-30 09:24:19'),
(210, 3, NULL, 'late_private', NULL, '⚠️ <b>ជូនដំណឹងមកយឺត</b>\n\n👤 បុគ្គលិក: Po Tilino\n🆔 លេខសម្គាល់: DSI003\n🕘 ម៉ោងចូល: 09:24 AM\n⏳ យឺតចំនួន: 24m 16s\n💰 កាត់ប្រាក់: $0.00\n\nស្ថានភាព: មកយឺត', NULL, NULL, NULL, 'sent', 0, '2026-05-30 09:24:21', '2026-05-30 09:24:21', '2026-05-30 09:24:21'),
(211, 4, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 10:21 AM\n📅 ថ្ងៃទី: 30 May 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-05-30 10:21:29', '2026-05-30 10:21:29', '2026-05-30 10:21:29'),
(212, 16, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 08:14 AM\n🕘 ចេញម៉ោង: 05:00 PM\n📅 ថ្ងៃទី: 30 May 2026\n\n⏳ ម៉ោងធ្វើការ: 08h 46m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-05-30 17:00:37', '2026-05-30 17:00:37', '2026-05-30 17:00:37'),
(213, 6, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 08:56 AM\n🕘 ចេញម៉ោង: 05:11 PM\n📅 ថ្ងៃទី: 30 May 2026\n\n⏳ ម៉ោងធ្វើការ: 08h 15m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'failed', 0, NULL, '2026-05-30 17:11:58', '2026-05-30 17:11:58'),
(214, 3, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 09:24 AM\n🕘 ចេញម៉ោង: 05:13 PM\n📅 ថ្ងៃទី: 30 May 2026\n\n⏳ ម៉ោងធ្វើការ: 07h 48m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-05-30 17:13:14', '2026-05-30 17:13:14', '2026-05-30 17:13:14'),
(215, 10, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 08:54 AM\n🕘 ចេញម៉ោង: 05:19 PM\n📅 ថ្ងៃទី: 30 May 2026\n\n⏳ ម៉ោងធ្វើការ: 08h 24m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-05-30 17:19:24', '2026-05-30 17:19:24', '2026-05-30 17:19:24'),
(216, 5, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 08:37 AM\n🕘 ចេញម៉ោង: 05:30 PM\n📅 ថ្ងៃទី: 30 May 2026\n\n⏳ ម៉ោងធ្វើការ: 08h 52m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-05-30 17:30:36', '2026-05-30 17:30:36', '2026-05-30 17:30:36'),
(217, 15, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 08:37 AM\n🕘 ចេញម៉ោង: 05:32 PM\n📅 ថ្ងៃទី: 30 May 2026\n\n⏳ ម៉ោងធ្វើការ: 08h 54m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'failed', 0, NULL, '2026-05-30 17:32:22', '2026-05-30 17:32:22'),
(218, 14, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 08:27 AM\n🕘 ចេញម៉ោង: 05:35 PM\n📅 ថ្ងៃទី: 30 May 2026\n\n⏳ ម៉ោងធ្វើការ: 09h 08m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-05-30 17:35:18', '2026-05-30 17:35:18', '2026-05-30 17:35:18'),
(219, 9, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 08:26 AM\n🕘 ចេញម៉ោង: 06:32 PM\n📅 ថ្ងៃទី: 30 May 2026\n\n⏳ ម៉ោងធ្វើការ: 10h 05m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-05-30 18:32:10', '2026-05-30 18:32:10', '2026-05-30 18:32:10'),
(220, 13, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 08:51 AM\n🕘 ចេញម៉ោង: 07:43 PM\n📅 ថ្ងៃទី: 30 May 2026\n\n⏳ ម៉ោងធ្វើការ: 10h 52m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-05-30 19:44:03', '2026-05-30 19:44:03', '2026-05-30 19:44:03'),
(221, 12, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 08:40 AM\n🕘 ចេញម៉ោង: 07:47 PM\n📅 ថ្ងៃទី: 30 May 2026\n\n⏳ ម៉ោងធ្វើការ: 11h 06m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-05-30 19:47:42', '2026-05-30 19:47:42', '2026-05-30 19:47:42'),
(222, 16, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:14 AM\n📅 ថ្ងៃទី: 31 May 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-05-31 08:14:30', '2026-05-31 08:14:30', '2026-05-31 08:14:30'),
(223, 8, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:21 AM\n📅 ថ្ងៃទី: 31 May 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-05-31 08:21:58', '2026-05-31 08:21:58', '2026-05-31 08:21:58'),
(224, 10, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 09:01 AM\n📅 ថ្ងៃទី: 31 May 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-05-31 09:01:05', '2026-05-31 09:01:05', '2026-05-31 09:01:05'),
(225, 19, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 09:28 AM\n📅 ថ្ងៃទី: 31 May 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-05-31 09:28:58', '2026-05-31 09:28:58', '2026-05-31 09:28:58'),
(226, 12, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 10:16 AM\n📅 ថ្ងៃទី: 31 May 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-05-31 10:16:35', '2026-05-31 10:16:35', '2026-05-31 10:16:35'),
(227, 13, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 10:45 AM\n📅 ថ្ងៃទី: 31 May 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-05-31 10:45:17', '2026-05-31 10:45:17', '2026-05-31 10:45:17'),
(228, 9, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 11:33 AM\n📅 ថ្ងៃទី: 31 May 2026\n\n⚠️ ស្ថានភាព: មកយឺត\n⏳ យឺតចំនួន: 3m 2s', NULL, NULL, NULL, 'sent', 0, '2026-05-31 11:33:07', '2026-05-31 11:33:07', '2026-05-31 11:33:07'),
(229, 9, NULL, 'late_private', NULL, '⚠️ <b>ជូនដំណឹងមកយឺត</b>\n\n👤 បុគ្គលិក: Phol Sokkhe\n🆔 លេខសម្គាល់: IS001\n🕘 ម៉ោងចូល: 11:33 AM\n⏳ យឺតចំនួន: 3m 2s\n💰 កាត់ប្រាក់: $0.00\n\nស្ថានភាព: មកយឺត', NULL, NULL, NULL, 'sent', 0, '2026-05-31 11:33:09', '2026-05-31 11:33:09', '2026-05-31 11:33:09'),
(230, 4, NULL, 'website_notification_private', NULL, '🔔 <b>Hi</b>\n\nTv yk Evan pg', NULL, NULL, NULL, 'sent', 0, '2026-05-31 13:21:43', '2026-05-31 13:21:43', '2026-05-31 13:21:43'),
(231, 19, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 09:28 AM\n🕘 ចេញម៉ោង: 05:19 PM\n📅 ថ្ងៃទី: 31 May 2026\n\n⏳ ម៉ោងធ្វើការ: 07h 50m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-05-31 17:19:06', '2026-05-31 17:19:06', '2026-05-31 17:19:06'),
(232, 8, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 08:21 AM\n🕘 ចេញម៉ោង: 05:29 PM\n📅 ថ្ងៃទី: 31 May 2026\n\n⏳ ម៉ោងធ្វើការ: 09h 08m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-05-31 17:30:00', '2026-05-31 17:30:00', '2026-05-31 17:30:00'),
(233, 16, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 08:14 AM\n🕘 ចេញម៉ោង: 05:37 PM\n📅 ថ្ងៃទី: 31 May 2026\n\n⏳ ម៉ោងធ្វើការ: 09h 23m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-05-31 17:37:33', '2026-05-31 17:37:33', '2026-05-31 17:37:33'),
(234, 10, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 09:01 AM\n🕘 ចេញម៉ោង: 07:04 PM\n📅 ថ្ងៃទី: 31 May 2026\n\n⏳ ម៉ោងធ្វើការ: 10h 03m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-05-31 19:04:23', '2026-05-31 19:04:23', '2026-05-31 19:04:23'),
(235, 13, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 10:45 AM\n🕘 ចេញម៉ោង: 07:04 PM\n📅 ថ្ងៃទី: 31 May 2026\n\n⏳ ម៉ោងធ្វើការ: 08h 19m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-05-31 19:04:34', '2026-05-31 19:04:34', '2026-05-31 19:04:34'),
(236, 9, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 11:33 AM\n🕘 ចេញម៉ោង: 07:06 PM\n📅 ថ្ងៃទី: 31 May 2026\n\n⏳ ម៉ោងធ្វើការ: 07h 33m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-05-31 19:06:51', '2026-05-31 19:06:51', '2026-05-31 19:06:51'),
(237, 12, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 10:16 AM\n🕘 ចេញម៉ោង: 07:06 PM\n📅 ថ្ងៃទី: 31 May 2026\n\n⏳ ម៉ោងធ្វើការ: 08h 50m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-05-31 19:06:52', '2026-05-31 19:06:52', '2026-05-31 19:06:52'),
(238, 1, NULL, 'permission_request_admin_private', NULL, '📄 <b>NEW PERMISSION REQUEST</b>\n\n👤 <b>Employee:</b> Chean Aleav\n📌 <b>Type:</b> Personal Permission\n📅 <b>Duration:</b> 01 Jun 2026 08:00 - 10:00 (2.00 hour(s))\n📝 <b>Reason:</b> សុំច្បាប់បង ទៅពេទ្យធ្មេញ2ម៉ោង\n\n⏳ <b>Status:</b> Pending Approval', NULL, NULL, NULL, 'sent', 0, '2026-05-31 21:49:13', '2026-05-31 21:49:13', '2026-05-31 21:49:13'),
(239, 13, NULL, 'permission_request_submitted_private', NULL, '📄 <b>Your permission request was submitted</b>\n\n<b>Request:</b> PR-2026-0005\n<b>Type:</b> Personal Permission\n<b>Duration:</b> 01 Jun 2026 08:00 - 10:00 (2.00 hour(s))\n<b>Reason:</b> សុំច្បាប់បង ទៅពេទ្យធ្មេញ2ម៉ោង\n\n⏳ <b>Status:</b> Pending Approval', NULL, NULL, NULL, 'sent', 0, '2026-05-31 21:49:13', '2026-05-31 21:49:13', '2026-05-31 21:49:13'),
(240, 13, NULL, 'permission_status_private', NULL, '📄 <b>PERMISSION REQUEST Approved</b>\n\n👤 <b>Employee:</b> Chean Aleav\n📌 <b>Type:</b> Personal Permission\n📅 <b>Duration:</b> 01 Jun 2026 08:00 - 10:00 (2.00 hour(s))\n👨‍💼 <b>Reviewed by:</b> Super Admin\n📝 <b>Note:</b> Approved.', NULL, NULL, NULL, 'sent', 0, '2026-05-31 22:00:21', '2026-05-31 22:00:21', '2026-05-31 22:00:21'),
(241, 8, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:10 AM\n📅 ថ្ងៃទី: 01 Jun 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-06-01 08:10:36', '2026-06-01 08:10:36', '2026-06-01 08:10:36'),
(242, 9, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:15 AM\n📅 ថ្ងៃទី: 01 Jun 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-06-01 08:15:28', '2026-06-01 08:15:28', '2026-06-01 08:15:28'),
(243, 16, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:16 AM\n📅 ថ្ងៃទី: 01 Jun 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-06-01 08:16:34', '2026-06-01 08:16:34', '2026-06-01 08:16:34'),
(244, 14, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:22 AM\n📅 ថ្ងៃទី: 01 Jun 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-06-01 08:22:21', '2026-06-01 08:22:21', '2026-06-01 08:22:21'),
(245, 10, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:39 AM\n📅 ថ្ងៃទី: 01 Jun 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-06-01 08:39:59', '2026-06-01 08:39:59', '2026-06-01 08:39:59'),
(246, 15, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:45 AM\n📅 ថ្ងៃទី: 01 Jun 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'failed', 0, NULL, '2026-06-01 08:45:39', '2026-06-01 08:45:39'),
(247, 6, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:55 AM\n📅 ថ្ងៃទី: 01 Jun 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'failed', 0, NULL, '2026-06-01 08:55:18', '2026-06-01 08:55:18'),
(248, 5, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:57 AM\n📅 ថ្ងៃទី: 01 Jun 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-06-01 08:57:21', '2026-06-01 08:57:21', '2026-06-01 08:57:21'),
(249, 12, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 09:03 AM\n📅 ថ្ងៃទី: 01 Jun 2026\n\n⚠️ ស្ថានភាព: មកយឺត\n⏳ យឺតចំនួន: 3m 40s', NULL, NULL, NULL, 'sent', 0, '2026-06-01 09:03:45', '2026-06-01 09:03:45', '2026-06-01 09:03:45'),
(250, 12, NULL, 'late_private', NULL, '⚠️ <b>ជូនដំណឹងមកយឺត</b>\n\n👤 បុគ្គលិក: Chu Kimhorng\n🆔 លេខសម្គាល់: ACC005\n🕘 ម៉ោងចូល: 09:03 AM\n⏳ យឺតចំនួន: 3m 40s\n💰 កាត់ប្រាក់: $0.00\n\nស្ថានភាព: មកយឺត', NULL, NULL, NULL, 'sent', 0, '2026-06-01 09:03:46', '2026-06-01 09:03:46', '2026-06-01 09:03:46'),
(251, 19, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 09:08 AM\n📅 ថ្ងៃទី: 01 Jun 2026\n\n⚠️ ស្ថានភាព: មកយឺត\n⏳ យឺតចំនួន: 8m 58s', NULL, NULL, NULL, 'sent', 0, '2026-06-01 09:09:01', '2026-06-01 09:09:01', '2026-06-01 09:09:01'),
(252, 19, NULL, 'late_private', NULL, '⚠️ <b>ជូនដំណឹងមកយឺត</b>\n\n👤 បុគ្គលិក: Heng Laiheang\n🆔 លេខសម្គាល់: acc008\n🕘 ម៉ោងចូល: 09:08 AM\n⏳ យឺតចំនួន: 8m 58s\n💰 កាត់ប្រាក់: $0.00\n\nស្ថានភាព: មកយឺត', NULL, NULL, NULL, 'sent', 0, '2026-06-01 09:09:02', '2026-06-01 09:09:02', '2026-06-01 09:09:02'),
(253, 3, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 09:29 AM\n📅 ថ្ងៃទី: 01 Jun 2026\n\n⚠️ ស្ថានភាព: មកយឺត\n⏳ យឺតចំនួន: 29m 49s', NULL, NULL, NULL, 'sent', 0, '2026-06-01 09:29:52', '2026-06-01 09:29:52', '2026-06-01 09:29:52'),
(254, 3, NULL, 'late_private', NULL, '⚠️ <b>ជូនដំណឹងមកយឺត</b>\n\n👤 បុគ្គលិក: Po Tilino\n🆔 លេខសម្គាល់: DSI003\n🕘 ម៉ោងចូល: 09:29 AM\n⏳ យឺតចំនួន: 29m 49s\n💰 កាត់ប្រាក់: $0.00\n\nស្ថានភាព: មកយឺត', NULL, NULL, NULL, 'sent', 0, '2026-06-01 09:29:54', '2026-06-01 09:29:54', '2026-06-01 09:29:54'),
(255, 13, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 10:46 AM\n📅 ថ្ងៃទី: 01 Jun 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-06-01 10:46:50', '2026-06-01 10:46:50', '2026-06-01 10:46:50'),
(256, 4, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 11:59 AM\n📅 ថ្ងៃទី: 01 Jun 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-06-01 11:59:42', '2026-06-01 11:59:42', '2026-06-01 11:59:42'),
(257, 1, NULL, 'permission_request_admin_private', NULL, '📄 <b>NEW PERMISSION REQUEST</b>\n\n👤 <b>Employee:</b> Heng Laiheang\n📌 <b>Type:</b> Personal Permission\n📅 <b>Duration:</b> 01 Jun 2026 16:30 - 17:00 (0.50 hour(s))\n📝 <b>Reason:</b> សួស្ដីបង ដោយសារញុមជាប់ប្រឡង ដូច្នេះសុំច្បាប់ចេញមុនចំនួន30mnបង\n\n⏳ <b>Status:</b> Pending Approval', NULL, NULL, NULL, 'sent', 0, '2026-06-01 16:21:18', '2026-06-01 16:21:18', '2026-06-01 16:21:18'),
(258, 19, NULL, 'permission_request_submitted_private', NULL, '📄 <b>Your permission request was submitted</b>\n\n<b>Request:</b> PR-2026-0006\n<b>Type:</b> Personal Permission\n<b>Duration:</b> 01 Jun 2026 16:30 - 17:00 (0.50 hour(s))\n<b>Reason:</b> សួស្ដីបង ដោយសារញុមជាប់ប្រឡង ដូច្នេះសុំច្បាប់ចេញមុនចំនួន30mnបង\n\n⏳ <b>Status:</b> Pending Approval', NULL, NULL, NULL, 'sent', 0, '2026-06-01 16:21:19', '2026-06-01 16:21:19', '2026-06-01 16:21:19'),
(259, 19, NULL, 'permission_status_private', NULL, '📄 <b>PERMISSION REQUEST Approved</b>\n\n👤 <b>Employee:</b> Heng Laiheang\n📌 <b>Type:</b> Personal Permission\n📅 <b>Duration:</b> 01 Jun 2026 16:30 - 17:00 (0.50 hour(s))\n👨‍💼 <b>Reviewed by:</b> Super Admin\n📝 <b>Note:</b> Approved.', NULL, NULL, NULL, 'sent', 0, '2026-06-01 16:32:43', '2026-06-01 16:32:43', '2026-06-01 16:32:43'),
(260, 16, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 08:16 AM\n🕘 ចេញម៉ោង: 05:00 PM\n📅 ថ្ងៃទី: 01 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 08h 44m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-01 17:00:58', '2026-06-01 17:00:58', '2026-06-01 17:00:58'),
(261, 17, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 12:23 PM\n🕘 ចេញម៉ោង: 05:13 PM\n📅 ថ្ងៃទី: 01 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 04h 49m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-01 17:13:25', '2026-06-01 17:13:25', '2026-06-01 17:13:25'),
(262, 6, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 08:55 AM\n🕘 ចេញម៉ោង: 05:16 PM\n📅 ថ្ងៃទី: 01 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 08h 21m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'failed', 0, NULL, '2026-06-01 17:16:31', '2026-06-01 17:16:31'),
(263, 8, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 08:10 AM\n🕘 ចេញម៉ោង: 05:23 PM\n📅 ថ្ងៃទី: 01 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 09h 12m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-01 17:23:08', '2026-06-01 17:23:08', '2026-06-01 17:23:08'),
(264, 5, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 08:57 AM\n🕘 ចេញម៉ោង: 05:27 PM\n📅 ថ្ងៃទី: 01 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 08h 30m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-01 17:27:51', '2026-06-01 17:27:51', '2026-06-01 17:27:51'),
(265, 14, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 08:22 AM\n🕘 ចេញម៉ោង: 05:37 PM\n📅 ថ្ងៃទី: 01 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 09h 15m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-01 17:37:40', '2026-06-01 17:37:40', '2026-06-01 17:37:40'),
(266, 3, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 09:29 AM\n🕘 ចេញម៉ោង: 05:40 PM\n📅 ថ្ងៃទី: 01 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 08h 11m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-01 17:40:55', '2026-06-01 17:40:55', '2026-06-01 17:40:55'),
(267, 4, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 11:59 AM\n🕘 ចេញម៉ោង: 05:54 PM\n📅 ថ្ងៃទី: 01 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 05h 55m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-01 17:54:48', '2026-06-01 17:54:48', '2026-06-01 17:54:48'),
(268, 13, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 10:46 AM\n🕘 ចេញម៉ោង: 07:19 PM\n📅 ថ្ងៃទី: 01 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 08h 32m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-01 19:19:09', '2026-06-01 19:19:09', '2026-06-01 19:19:09'),
(269, 10, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 08:39 AM\n🕘 ចេញម៉ោង: 07:21 PM\n📅 ថ្ងៃទី: 01 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 10h 41m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-01 19:21:56', '2026-06-01 19:21:56', '2026-06-01 19:21:56'),
(270, 12, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 09:03 AM\n🕘 ចេញម៉ោង: 08:03 PM\n📅 ថ្ងៃទី: 01 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 10h 59m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-01 20:03:12', '2026-06-01 20:03:12', '2026-06-01 20:03:12'),
(271, 9, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 08:15 AM\n🕘 ចេញម៉ោង: 08:06 PM\n📅 ថ្ងៃទី: 01 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 11h 50m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-01 20:06:23', '2026-06-01 20:06:23', '2026-06-01 20:06:23'),
(272, 8, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:07 AM\n📅 ថ្ងៃទី: 02 Jun 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-06-02 08:07:52', '2026-06-02 08:07:52', '2026-06-02 08:07:52'),
(273, 9, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:17 AM\n📅 ថ្ងៃទី: 02 Jun 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-06-02 08:17:35', '2026-06-02 08:17:35', '2026-06-02 08:17:35'),
(274, 10, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:32 AM\n📅 ថ្ងៃទី: 02 Jun 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-06-02 08:32:37', '2026-06-02 08:32:37', '2026-06-02 08:32:37'),
(275, 14, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:33 AM\n📅 ថ្ងៃទី: 02 Jun 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-06-02 08:33:11', '2026-06-02 08:33:11', '2026-06-02 08:33:11'),
(276, 16, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:35 AM\n📅 ថ្ងៃទី: 02 Jun 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-06-02 08:36:00', '2026-06-02 08:36:00', '2026-06-02 08:36:00'),
(277, 15, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:42 AM\n📅 ថ្ងៃទី: 02 Jun 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'failed', 0, NULL, '2026-06-02 08:42:24', '2026-06-02 08:42:24'),
(278, 13, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:52 AM\n📅 ថ្ងៃទី: 02 Jun 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-06-02 08:52:36', '2026-06-02 08:52:36', '2026-06-02 08:52:36'),
(279, 19, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:52 AM\n📅 ថ្ងៃទី: 02 Jun 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-06-02 08:52:42', '2026-06-02 08:52:42', '2026-06-02 08:52:42'),
(280, 5, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:55 AM\n📅 ថ្ងៃទី: 02 Jun 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-06-02 08:55:21', '2026-06-02 08:55:21', '2026-06-02 08:55:21'),
(281, 6, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 09:07 AM\n📅 ថ្ងៃទី: 02 Jun 2026\n\n⚠️ ស្ថានភាព: មកយឺត\n⏳ យឺតចំនួន: 7m 9s', NULL, NULL, NULL, 'failed', 0, NULL, '2026-06-02 09:07:13', '2026-06-02 09:07:13'),
(282, 6, NULL, 'late_private', NULL, '⚠️ <b>ជូនដំណឹងមកយឺត</b>\n\n👤 បុគ្គលិក: Gak Vicheka\n🆔 លេខសម្គាល់: DSI004\n🕘 ម៉ោងចូល: 09:07 AM\n⏳ យឺតចំនួន: 7m 9s\n💰 កាត់ប្រាក់: $0.00\n\nស្ថានភាព: មកយឺត', NULL, NULL, NULL, 'failed', 0, NULL, '2026-06-02 09:07:16', '2026-06-02 09:07:16'),
(283, 3, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 09:29 AM\n📅 ថ្ងៃទី: 02 Jun 2026\n\n⚠️ ស្ថានភាព: មកយឺត\n⏳ យឺតចំនួន: 29m 3s', NULL, NULL, NULL, 'sent', 0, '2026-06-02 09:29:08', '2026-06-02 09:29:08', '2026-06-02 09:29:08'),
(284, 3, NULL, 'late_private', NULL, '⚠️ <b>ជូនដំណឹងមកយឺត</b>\n\n👤 បុគ្គលិក: Po Tilino\n🆔 លេខសម្គាល់: DSI003\n🕘 ម៉ោងចូល: 09:29 AM\n⏳ យឺតចំនួន: 29m 3s\n💰 កាត់ប្រាក់: $0.00\n\nស្ថានភាព: មកយឺត', NULL, NULL, NULL, 'sent', 0, '2026-06-02 09:29:10', '2026-06-02 09:29:10', '2026-06-02 09:29:10'),
(285, 17, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 11:23 AM\n📅 ថ្ងៃទី: 02 Jun 2026\n\n⚠️ ស្ថានភាព: មកយឺត\n⏳ យឺតចំនួន: 2h 23m 13s', NULL, NULL, NULL, 'sent', 0, '2026-06-02 11:23:16', '2026-06-02 11:23:16', '2026-06-02 11:23:16'),
(286, 17, NULL, 'late_private', NULL, '⚠️ <b>ជូនដំណឹងមកយឺត</b>\n\n👤 បុគ្គលិក: Phal Panha\n🆔 លេខសម្គាល់: DL002\n🕘 ម៉ោងចូល: 11:23 AM\n⏳ យឺតចំនួន: 2h 23m 13s\n💰 កាត់ប្រាក់: $0.00\n\nស្ថានភាព: មកយឺត', NULL, NULL, NULL, 'sent', 0, '2026-06-02 11:23:18', '2026-06-02 11:23:18', '2026-06-02 11:23:18'),
(287, 4, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 12:10 PM\n📅 ថ្ងៃទី: 02 Jun 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-06-02 12:10:19', '2026-06-02 12:10:19', '2026-06-02 12:10:19'),
(288, 1, NULL, 'permission_request_admin_private', NULL, '📄 <b>NEW PERMISSION REQUEST</b>\n\n👤 <b>Employee:</b> Heng Laiheang\n📌 <b>Type:</b> Personal Permission\n📅 <b>Duration:</b> 02 Jun 2026 16:40 - 17:00 (0.33 hour(s))\n📝 <b>Reason:</b> សួស្ដីបង ដោយសារញុមជាប់ប្រឡងនៅពេលល្ងាចនេះ ញុមសុំច្បាប់ចេញមុន20នាទីបង\n\n⏳ <b>Status:</b> Pending Approval', NULL, NULL, NULL, 'sent', 0, '2026-06-02 14:37:14', '2026-06-02 14:37:14', '2026-06-02 14:37:14'),
(289, 19, NULL, 'permission_request_submitted_private', NULL, '📄 <b>Your permission request was submitted</b>\n\n<b>Request:</b> PR-2026-0007\n<b>Type:</b> Personal Permission\n<b>Duration:</b> 02 Jun 2026 16:40 - 17:00 (0.33 hour(s))\n<b>Reason:</b> សួស្ដីបង ដោយសារញុមជាប់ប្រឡងនៅពេលល្ងាចនេះ ញុមសុំច្បាប់ចេញមុន20នាទីបង\n\n⏳ <b>Status:</b> Pending Approval', NULL, NULL, NULL, 'sent', 0, '2026-06-02 14:37:14', '2026-06-02 14:37:14', '2026-06-02 14:37:14'),
(290, 19, NULL, 'permission_status_private', NULL, '📄 <b>PERMISSION REQUEST Approved</b>\n\n👤 <b>Employee:</b> Heng Laiheang\n📌 <b>Type:</b> Personal Permission\n📅 <b>Duration:</b> 02 Jun 2026 16:40 - 17:00 (0.33 hour(s))\n👨‍💼 <b>Reviewed by:</b> Super Admin\n📝 <b>Note:</b> Approved.', NULL, NULL, NULL, 'sent', 0, '2026-06-02 15:56:37', '2026-06-02 15:56:37', '2026-06-02 15:56:37'),
(291, 16, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 08:35 AM\n🕘 ចេញម៉ោង: 05:01 PM\n📅 ថ្ងៃទី: 02 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 08h 25m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-02 17:01:47', '2026-06-02 17:01:47', '2026-06-02 17:01:47'),
(292, 17, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 11:23 AM\n🕘 ចេញម៉ោង: 05:01 PM\n📅 ថ្ងៃទី: 02 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 05h 38m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-02 17:01:56', '2026-06-02 17:01:56', '2026-06-02 17:01:56'),
(293, 5, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 08:55 AM\n🕘 ចេញម៉ោង: 05:09 PM\n📅 ថ្ងៃទី: 02 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 08h 13m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-02 17:09:07', '2026-06-02 17:09:07', '2026-06-02 17:09:07'),
(294, 6, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 09:07 AM\n🕘 ចេញម៉ោង: 05:10 PM\n📅 ថ្ងៃទី: 02 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 08h 03m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'failed', 0, NULL, '2026-06-02 17:10:58', '2026-06-02 17:10:58'),
(295, 14, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 08:33 AM\n🕘 ចេញម៉ោង: 05:21 PM\n📅 ថ្ងៃទី: 02 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 08h 48m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-02 17:21:30', '2026-06-02 17:21:30', '2026-06-02 17:21:30'),
(296, 3, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 09:29 AM\n🕘 ចេញម៉ោង: 05:36 PM\n📅 ថ្ងៃទី: 02 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 08h 07m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-02 17:36:42', '2026-06-02 17:36:42', '2026-06-02 17:36:42'),
(297, 8, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 08:07 AM\n🕘 ចេញម៉ោង: 05:57 PM\n📅 ថ្ងៃទី: 02 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 09h 49m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-02 17:57:23', '2026-06-02 17:57:23', '2026-06-02 17:57:23'),
(298, 21, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 06:09 PM\n📅 ថ្ងៃទី: 02 Jun 2026\n\n⚠️ ស្ថានភាព: មកយឺត\n⏳ យឺតចំនួន: 9h 9m 6s', NULL, NULL, NULL, 'sent', 0, '2026-06-02 18:09:10', '2026-06-02 18:09:10', '2026-06-02 18:09:10'),
(299, 21, NULL, 'late_private', NULL, '⚠️ <b>ជូនដំណឹងមកយឺត</b>\n\n👤 បុគ្គលិក: Van\n🆔 លេខសម្គាល់: DL003\n🕘 ម៉ោងចូល: 06:09 PM\n⏳ យឺតចំនួន: 9h 9m 6s\n💰 កាត់ប្រាក់: $0.00\n\nស្ថានភាព: មកយឺត', NULL, NULL, NULL, 'sent', 0, '2026-06-02 18:09:12', '2026-06-02 18:09:12', '2026-06-02 18:09:12'),
(300, 21, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 06:09 PM\n🕘 ចេញម៉ោង: 06:09 PM\n📅 ថ្ងៃទី: 02 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 00h 00m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-02 18:09:39', '2026-06-02 18:09:39', '2026-06-02 18:09:39'),
(301, 12, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 06:16 PM\n📅 ថ្ងៃទី: 02 Jun 2026\n\n⚠️ ស្ថានភាព: មកយឺត\n⏳ យឺតចំនួន: 9h 16m 13s', NULL, NULL, NULL, 'sent', 0, '2026-06-02 18:16:17', '2026-06-02 18:16:17', '2026-06-02 18:16:17'),
(302, 12, NULL, 'late_private', NULL, '⚠️ <b>ជូនដំណឹងមកយឺត</b>\n\n👤 បុគ្គលិក: Chu Kimhorng\n🆔 លេខសម្គាល់: ACC005\n🕘 ម៉ោងចូល: 06:16 PM\n⏳ យឺតចំនួន: 9h 16m 13s\n💰 កាត់ប្រាក់: $0.00\n\nស្ថានភាព: មកយឺត', NULL, NULL, NULL, 'sent', 0, '2026-06-02 18:16:21', '2026-06-02 18:16:21', '2026-06-02 18:16:21'),
(303, 9, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 08:17 AM\n🕘 ចេញម៉ោង: 06:17 PM\n📅 ថ្ងៃទី: 02 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 10h 00m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-02 18:17:46', '2026-06-02 18:17:46', '2026-06-02 18:17:46'),
(304, 10, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 08:32 AM\n🕘 ចេញម៉ោង: 06:21 PM\n📅 ថ្ងៃទី: 02 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 09h 49m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-02 18:21:42', '2026-06-02 18:21:42', '2026-06-02 18:21:42'),
(305, 15, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 08:42 AM\n🕘 ចេញម៉ោង: 06:30 PM\n📅 ថ្ងៃទី: 02 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 09h 48m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'failed', 0, NULL, '2026-06-02 18:30:57', '2026-06-02 18:30:57'),
(306, 13, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 08:52 AM\n🕘 ចេញម៉ោង: 08:19 PM\n📅 ថ្ងៃទី: 02 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 11h 27m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-02 20:19:55', '2026-06-02 20:19:55', '2026-06-02 20:19:55'),
(307, 10, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:16 AM\n📅 ថ្ងៃទី: 03 Jun 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-06-03 08:16:53', '2026-06-03 08:16:53', '2026-06-03 08:16:53'),
(308, 8, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:20 AM\n📅 ថ្ងៃទី: 03 Jun 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-06-03 08:20:46', '2026-06-03 08:20:46', '2026-06-03 08:20:46'),
(309, 9, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:21 AM\n📅 ថ្ងៃទី: 03 Jun 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-06-03 08:21:58', '2026-06-03 08:21:58', '2026-06-03 08:21:58'),
(310, 16, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:27 AM\n📅 ថ្ងៃទី: 03 Jun 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-06-03 08:27:34', '2026-06-03 08:27:34', '2026-06-03 08:27:34'),
(311, 13, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:42 AM\n📅 ថ្ងៃទី: 03 Jun 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-06-03 08:42:07', '2026-06-03 08:42:07', '2026-06-03 08:42:07'),
(312, 15, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:43 AM\n📅 ថ្ងៃទី: 03 Jun 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'failed', 0, NULL, '2026-06-03 08:43:11', '2026-06-03 08:43:11'),
(313, 14, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:50 AM\n📅 ថ្ងៃទី: 03 Jun 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-06-03 08:50:50', '2026-06-03 08:50:50', '2026-06-03 08:50:50'),
(314, 5, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:57 AM\n📅 ថ្ងៃទី: 03 Jun 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-06-03 08:57:25', '2026-06-03 08:57:25', '2026-06-03 08:57:25'),
(315, 19, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:59 AM\n📅 ថ្ងៃទី: 03 Jun 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-06-03 08:59:28', '2026-06-03 08:59:28', '2026-06-03 08:59:28'),
(316, 12, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 09:02 AM\n📅 ថ្ងៃទី: 03 Jun 2026\n\n⚠️ ស្ថានភាព: មកយឺត\n⏳ យឺតចំនួន: 2m 37s', NULL, NULL, NULL, 'sent', 0, '2026-06-03 09:02:42', '2026-06-03 09:02:42', '2026-06-03 09:02:42'),
(317, 12, NULL, 'late_private', NULL, '⚠️ <b>ជូនដំណឹងមកយឺត</b>\n\n👤 បុគ្គលិក: Chu Kimhorng\n🆔 លេខសម្គាល់: ACC005\n🕘 ម៉ោងចូល: 09:02 AM\n⏳ យឺតចំនួន: 2m 37s\n💰 កាត់ប្រាក់: $0.00\n\nស្ថានភាព: មកយឺត', NULL, NULL, NULL, 'sent', 0, '2026-06-03 09:02:46', '2026-06-03 09:02:46', '2026-06-03 09:02:46'),
(318, 6, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 09:22 AM\n📅 ថ្ងៃទី: 03 Jun 2026\n\n⚠️ ស្ថានភាព: មកយឺត\n⏳ យឺតចំនួន: 22m 37s', NULL, NULL, NULL, 'failed', 0, NULL, '2026-06-03 09:22:41', '2026-06-03 09:22:41'),
(319, 6, NULL, 'late_private', NULL, '⚠️ <b>ជូនដំណឹងមកយឺត</b>\n\n👤 បុគ្គលិក: Gak Vicheka\n🆔 លេខសម្គាល់: DSI004\n🕘 ម៉ោងចូល: 09:22 AM\n⏳ យឺតចំនួន: 22m 37s\n💰 កាត់ប្រាក់: $0.00\n\nស្ថានភាព: មកយឺត', NULL, NULL, NULL, 'failed', 0, NULL, '2026-06-03 09:22:43', '2026-06-03 09:22:43'),
(320, 3, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 09:27 AM\n📅 ថ្ងៃទី: 03 Jun 2026\n\n⚠️ ស្ថានភាព: មកយឺត\n⏳ យឺតចំនួន: 27m 14s', NULL, NULL, NULL, 'sent', 0, '2026-06-03 09:27:17', '2026-06-03 09:27:17', '2026-06-03 09:27:17'),
(321, 3, NULL, 'late_private', NULL, '⚠️ <b>ជូនដំណឹងមកយឺត</b>\n\n👤 បុគ្គលិក: Po Tilino\n🆔 លេខសម្គាល់: DSI003\n🕘 ម៉ោងចូល: 09:27 AM\n⏳ យឺតចំនួន: 27m 14s\n💰 កាត់ប្រាក់: $0.00\n\nស្ថានភាព: មកយឺត', NULL, NULL, NULL, 'sent', 0, '2026-06-03 09:27:19', '2026-06-03 09:27:19', '2026-06-03 09:27:19'),
(322, 4, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 11:26 AM\n📅 ថ្ងៃទី: 03 Jun 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-06-03 11:26:41', '2026-06-03 11:26:41', '2026-06-03 11:26:41'),
(323, 17, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 11:30 AM\n📅 ថ្ងៃទី: 03 Jun 2026\n\n⚠️ ស្ថានភាព: មកយឺត\n⏳ យឺតចំនួន: 2h 30m 50s', NULL, NULL, NULL, 'sent', 0, '2026-06-03 11:30:53', '2026-06-03 11:30:53', '2026-06-03 11:30:53'),
(324, 17, NULL, 'late_private', NULL, '⚠️ <b>ជូនដំណឹងមកយឺត</b>\n\n👤 បុគ្គលិក: Phal Panha\n🆔 លេខសម្គាល់: DL002\n🕘 ម៉ោងចូល: 11:30 AM\n⏳ យឺតចំនួន: 2h 30m 50s\n💰 កាត់ប្រាក់: $0.00\n\nស្ថានភាព: មកយឺត', NULL, NULL, NULL, 'sent', 0, '2026-06-03 11:30:55', '2026-06-03 11:30:55', '2026-06-03 11:30:55'),
(325, 21, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 11:38 AM\n📅 ថ្ងៃទី: 03 Jun 2026\n\n⚠️ ស្ថានភាព: មកយឺត\n⏳ យឺតចំនួន: 2h 38m 44s', NULL, NULL, NULL, 'sent', 0, '2026-06-03 11:38:47', '2026-06-03 11:38:47', '2026-06-03 11:38:47'),
(326, 21, NULL, 'late_private', NULL, '⚠️ <b>ជូនដំណឹងមកយឺត</b>\n\n👤 បុគ្គលិក: Van\n🆔 លេខសម្គាល់: DL003\n🕘 ម៉ោងចូល: 11:38 AM\n⏳ យឺតចំនួន: 2h 38m 44s\n💰 កាត់ប្រាក់: $0.00\n\nស្ថានភាព: មកយឺត', NULL, NULL, NULL, 'sent', 0, '2026-06-03 11:38:49', '2026-06-03 11:38:49', '2026-06-03 11:38:49'),
(327, 16, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 08:27 AM\n🕘 ចេញម៉ោង: 05:02 PM\n📅 ថ្ងៃទី: 03 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 08h 35m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-03 17:02:55', '2026-06-03 17:02:55', '2026-06-03 17:02:55'),
(328, 6, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 09:22 AM\n🕘 ចេញម៉ោង: 05:04 PM\n📅 ថ្ងៃទី: 03 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 07h 41m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'failed', 0, NULL, '2026-06-03 17:04:36', '2026-06-03 17:04:36'),
(329, 8, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 08:20 AM\n🕘 ចេញម៉ោង: 05:05 PM\n📅 ថ្ងៃទី: 03 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 08h 45m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-03 17:05:51', '2026-06-03 17:05:51', '2026-06-03 17:05:51'),
(330, 5, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 08:57 AM\n🕘 ចេញម៉ោង: 05:06 PM\n📅 ថ្ងៃទី: 03 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 08h 09m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-03 17:06:28', '2026-06-03 17:06:28', '2026-06-03 17:06:28'),
(331, 10, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 08:16 AM\n🕘 ចេញម៉ោង: 05:09 PM\n📅 ថ្ងៃទី: 03 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 08h 52m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-03 17:09:32', '2026-06-03 17:09:32', '2026-06-03 17:09:32'),
(332, 19, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 08:59 AM\n🕘 ចេញម៉ោង: 05:13 PM\n📅 ថ្ងៃទី: 03 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 08h 14m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-03 17:13:28', '2026-06-03 17:13:28', '2026-06-03 17:13:28'),
(333, 3, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 09:27 AM\n🕘 ចេញម៉ោង: 05:24 PM\n📅 ថ្ងៃទី: 03 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 07h 57m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-03 17:24:31', '2026-06-03 17:24:31', '2026-06-03 17:24:31'),
(334, 14, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 08:50 AM\n🕘 ចេញម៉ោង: 05:59 PM\n📅 ថ្ងៃទី: 03 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 09h 09m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-03 18:00:00', '2026-06-03 18:00:00', '2026-06-03 18:00:00'),
(335, 15, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 08:43 AM\n🕘 ចេញម៉ោង: 05:59 PM\n📅 ថ្ងៃទី: 03 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 09h 16m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'failed', 0, NULL, '2026-06-03 18:00:01', '2026-06-03 18:00:01'),
(336, 9, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 08:21 AM\n🕘 ចេញម៉ោង: 06:45 PM\n📅 ថ្ងៃទី: 03 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 10h 23m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-03 18:45:13', '2026-06-03 18:45:13', '2026-06-03 18:45:13'),
(337, 13, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 08:42 AM\n🕘 ចេញម៉ោង: 06:45 PM\n📅 ថ្ងៃទី: 03 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 10h 03m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-03 18:45:54', '2026-06-03 18:45:54', '2026-06-03 18:45:54'),
(338, 12, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 09:02 AM\n🕘 ចេញម៉ោង: 06:47 PM\n📅 ថ្ងៃទី: 03 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 09h 44m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-03 18:47:26', '2026-06-03 18:47:26', '2026-06-03 18:47:26'),
(339, 21, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 11:38 AM\n🕘 ចេញម៉ោង: 09:36 PM\n📅 ថ្ងៃទី: 03 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 09h 57m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-03 21:36:33', '2026-06-03 21:36:33', '2026-06-03 21:36:33'),
(340, 9, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:19 AM\n📅 ថ្ងៃទី: 04 Jun 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-06-04 08:20:04', '2026-06-04 08:20:04', '2026-06-04 08:20:04'),
(341, 16, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:20 AM\n📅 ថ្ងៃទី: 04 Jun 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-06-04 08:20:13', '2026-06-04 08:20:13', '2026-06-04 08:20:13'),
(342, 8, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:22 AM\n📅 ថ្ងៃទី: 04 Jun 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-06-04 08:22:38', '2026-06-04 08:22:38', '2026-06-04 08:22:38'),
(343, 10, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:27 AM\n📅 ថ្ងៃទី: 04 Jun 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-06-04 08:27:09', '2026-06-04 08:27:09', '2026-06-04 08:27:09'),
(344, 14, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:41 AM\n📅 ថ្ងៃទី: 04 Jun 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-06-04 08:41:53', '2026-06-04 08:41:53', '2026-06-04 08:41:53'),
(345, 19, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:54 AM\n📅 ថ្ងៃទី: 04 Jun 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-06-04 08:54:56', '2026-06-04 08:54:56', '2026-06-04 08:54:56'),
(346, 5, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:55 AM\n📅 ថ្ងៃទី: 04 Jun 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-06-04 08:55:23', '2026-06-04 08:55:23', '2026-06-04 08:55:23'),
(347, 6, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:55 AM\n📅 ថ្ងៃទី: 04 Jun 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'failed', 0, NULL, '2026-06-04 08:55:49', '2026-06-04 08:55:49'),
(348, 13, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:56 AM\n📅 ថ្ងៃទី: 04 Jun 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-06-04 08:56:06', '2026-06-04 08:56:06', '2026-06-04 08:56:06'),
(349, 15, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 09:00 AM\n📅 ថ្ងៃទី: 04 Jun 2026\n\n⚠️ ស្ថានភាព: មកយឺត\n⏳ យឺតចំនួន: 27s', NULL, NULL, NULL, 'failed', 0, NULL, '2026-06-04 09:00:32', '2026-06-04 09:00:32'),
(350, 15, NULL, 'late_private', NULL, '⚠️ <b>ជូនដំណឹងមកយឺត</b>\n\n👤 បុគ្គលិក: Mang Leanghort\n🆔 លេខសម្គាល់: ACC006\n🕘 ម៉ោងចូល: 09:00 AM\n⏳ យឺតចំនួន: 27s\n💰 កាត់ប្រាក់: $0.00\n\nស្ថានភាព: មកយឺត', NULL, NULL, NULL, 'failed', 0, NULL, '2026-06-04 09:00:34', '2026-06-04 09:00:34'),
(351, 12, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 09:17 AM\n📅 ថ្ងៃទី: 04 Jun 2026\n\n⚠️ ស្ថានភាព: មកយឺត\n⏳ យឺតចំនួន: 17m 36s', NULL, NULL, NULL, 'sent', 0, '2026-06-04 09:17:39', '2026-06-04 09:17:39', '2026-06-04 09:17:39'),
(352, 12, NULL, 'late_private', NULL, '⚠️ <b>ជូនដំណឹងមកយឺត</b>\n\n👤 បុគ្គលិក: Chu Kimhorng\n🆔 លេខសម្គាល់: ACC005\n🕘 ម៉ោងចូល: 09:17 AM\n⏳ យឺតចំនួន: 17m 36s\n💰 កាត់ប្រាក់: $0.00\n\nស្ថានភាព: មកយឺត', NULL, NULL, NULL, 'sent', 0, '2026-06-04 09:17:42', '2026-06-04 09:17:42', '2026-06-04 09:17:42'),
(353, 3, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 09:27 AM\n📅 ថ្ងៃទី: 04 Jun 2026\n\n⚠️ ស្ថានភាព: មកយឺត\n⏳ យឺតចំនួន: 27m 32s', NULL, NULL, NULL, 'sent', 0, '2026-06-04 09:27:36', '2026-06-04 09:27:36', '2026-06-04 09:27:36'),
(354, 3, NULL, 'late_private', NULL, '⚠️ <b>ជូនដំណឹងមកយឺត</b>\n\n👤 បុគ្គលិក: Po Tilino\n🆔 លេខសម្គាល់: DSI003\n🕘 ម៉ោងចូល: 09:27 AM\n⏳ យឺតចំនួន: 27m 32s\n💰 កាត់ប្រាក់: $0.00\n\nស្ថានភាព: មកយឺត', NULL, NULL, NULL, 'sent', 0, '2026-06-04 09:27:38', '2026-06-04 09:27:38', '2026-06-04 09:27:38'),
(355, 21, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 09:35 AM\n📅 ថ្ងៃទី: 04 Jun 2026\n\n⚠️ ស្ថានភាព: មកយឺត\n⏳ យឺតចំនួន: 35m 30s', NULL, NULL, NULL, 'sent', 0, '2026-06-04 09:35:33', '2026-06-04 09:35:33', '2026-06-04 09:35:33'),
(356, 21, NULL, 'late_private', NULL, '⚠️ <b>ជូនដំណឹងមកយឺត</b>\n\n👤 បុគ្គលិក: Van\n🆔 លេខសម្គាល់: DL003\n🕘 ម៉ោងចូល: 09:35 AM\n⏳ យឺតចំនួន: 35m 30s\n💰 កាត់ប្រាក់: $0.00\n\nស្ថានភាព: មកយឺត', NULL, NULL, NULL, 'sent', 0, '2026-06-04 09:35:36', '2026-06-04 09:35:36', '2026-06-04 09:35:36'),
(357, 17, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 10:46 AM\n📅 ថ្ងៃទី: 04 Jun 2026\n\n⚠️ ស្ថានភាព: មកយឺត\n⏳ យឺតចំនួន: 1h 46m 50s', NULL, NULL, NULL, 'sent', 0, '2026-06-04 10:46:53', '2026-06-04 10:46:53', '2026-06-04 10:46:53'),
(358, 17, NULL, 'late_private', NULL, '⚠️ <b>ជូនដំណឹងមកយឺត</b>\n\n👤 បុគ្គលិក: Phal Panha\n🆔 លេខសម្គាល់: DL002\n🕘 ម៉ោងចូល: 10:46 AM\n⏳ យឺតចំនួន: 1h 46m 50s\n💰 កាត់ប្រាក់: $0.00\n\nស្ថានភាព: មកយឺត', NULL, NULL, NULL, 'sent', 0, '2026-06-04 10:46:56', '2026-06-04 10:46:56', '2026-06-04 10:46:56'),
(359, 19, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 08:54 AM\n🕘 ចេញម៉ោង: 05:12 PM\n📅 ថ្ងៃទី: 04 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 08h 17m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-04 17:12:54', '2026-06-04 17:12:54', '2026-06-04 17:12:54'),
(360, 8, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 08:22 AM\n🕘 ចេញម៉ោង: 05:23 PM\n📅 ថ្ងៃទី: 04 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 09h 01m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-04 17:23:47', '2026-06-04 17:23:47', '2026-06-04 17:23:47'),
(361, 6, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 08:55 AM\n🕘 ចេញម៉ោង: 05:40 PM\n📅 ថ្ងៃទី: 04 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 08h 44m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'failed', 0, NULL, '2026-06-04 17:40:14', '2026-06-04 17:40:14'),
(362, 5, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 08:55 AM\n🕘 ចេញម៉ោង: 05:44 PM\n📅 ថ្ងៃទី: 04 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 08h 48m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-04 17:44:04', '2026-06-04 17:44:04', '2026-06-04 17:44:04'),
(363, 3, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 09:27 AM\n🕘 ចេញម៉ោង: 05:44 PM\n📅 ថ្ងៃទី: 04 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 08h 17m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-04 17:44:45', '2026-06-04 17:44:45', '2026-06-04 17:44:45'),
(364, 14, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 08:41 AM\n🕘 ចេញម៉ោង: 05:55 PM\n📅 ថ្ងៃទី: 04 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 09h 13m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-04 17:55:21', '2026-06-04 17:55:21', '2026-06-04 17:55:21'),
(365, 21, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 09:35 AM\n🕘 ចេញម៉ោង: 06:38 PM\n📅 ថ្ងៃទី: 04 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 09h 02m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-04 18:38:24', '2026-06-04 18:38:24', '2026-06-04 18:38:24'),
(366, 10, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 08:27 AM\n🕘 ចេញម៉ោង: 06:48 PM\n📅 ថ្ងៃទី: 04 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 10h 21m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-04 18:49:00', '2026-06-04 18:49:00', '2026-06-04 18:49:00'),
(367, 12, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 09:17 AM\n🕘 ចេញម៉ោង: 06:49 PM\n📅 ថ្ងៃទី: 04 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 09h 31m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-04 18:49:28', '2026-06-04 18:49:28', '2026-06-04 18:49:28'),
(368, 9, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 08:19 AM\n🕘 ចេញម៉ោង: 06:51 PM\n📅 ថ្ងៃទី: 04 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 10h 31m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-04 18:51:19', '2026-06-04 18:51:19', '2026-06-04 18:51:19'),
(369, 13, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 08:56 AM\n🕘 ចេញម៉ោង: 06:51 PM\n📅 ថ្ងៃទី: 04 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 09h 55m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-04 18:51:51', '2026-06-04 18:51:51', '2026-06-04 18:51:51'),
(370, 8, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:17 AM\n📅 ថ្ងៃទី: 05 Jun 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-06-05 08:17:55', '2026-06-05 08:17:55', '2026-06-05 08:17:55'),
(371, 9, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:19 AM\n📅 ថ្ងៃទី: 05 Jun 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-06-05 08:19:58', '2026-06-05 08:19:58', '2026-06-05 08:19:58'),
(372, 10, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:25 AM\n📅 ថ្ងៃទី: 05 Jun 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-06-05 08:25:59', '2026-06-05 08:25:59', '2026-06-05 08:25:59'),
(373, 14, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:33 AM\n📅 ថ្ងៃទី: 05 Jun 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-06-05 08:33:23', '2026-06-05 08:33:23', '2026-06-05 08:33:23'),
(374, 16, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:36 AM\n📅 ថ្ងៃទី: 05 Jun 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-06-05 08:36:29', '2026-06-05 08:36:29', '2026-06-05 08:36:29');
INSERT INTO `telegram_logs` (`id`, `employee_id`, `customer_visit_id`, `message_type`, `event_key`, `telegram_message`, `selfie_url`, `store_photo_url`, `error_message`, `status`, `attempts`, `sent_at`, `created_at`, `updated_at`) VALUES
(375, 6, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:40 AM\n📅 ថ្ងៃទី: 05 Jun 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'failed', 0, NULL, '2026-06-05 08:40:12', '2026-06-05 08:40:12'),
(376, 17, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:40 AM\n📅 ថ្ងៃទី: 05 Jun 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-06-05 08:40:45', '2026-06-05 08:40:45', '2026-06-05 08:40:45'),
(377, 15, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:44 AM\n📅 ថ្ងៃទី: 05 Jun 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'failed', 0, NULL, '2026-06-05 08:44:29', '2026-06-05 08:44:29'),
(378, 12, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:45 AM\n📅 ថ្ងៃទី: 05 Jun 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-06-05 08:45:16', '2026-06-05 08:45:16', '2026-06-05 08:45:16'),
(379, 5, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:53 AM\n📅 ថ្ងៃទី: 05 Jun 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-06-05 08:53:57', '2026-06-05 08:53:57', '2026-06-05 08:53:57'),
(380, 13, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:59 AM\n📅 ថ្ងៃទី: 05 Jun 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-06-05 08:59:07', '2026-06-05 08:59:07', '2026-06-05 08:59:07'),
(381, 21, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 09:04 AM\n📅 ថ្ងៃទី: 05 Jun 2026\n\n⚠️ ស្ថានភាព: មកយឺត\n⏳ យឺតចំនួន: 4m 41s', NULL, NULL, NULL, 'sent', 0, '2026-06-05 09:04:45', '2026-06-05 09:04:45', '2026-06-05 09:04:45'),
(382, 21, NULL, 'late_private', NULL, '⚠️ <b>ជូនដំណឹងមកយឺត</b>\n\n👤 បុគ្គលិក: Van\n🆔 លេខសម្គាល់: DL003\n🕘 ម៉ោងចូល: 09:04 AM\n⏳ យឺតចំនួន: 4m 41s\n💰 កាត់ប្រាក់: $0.00\n\nស្ថានភាព: មកយឺត', NULL, NULL, NULL, 'sent', 0, '2026-06-05 09:04:47', '2026-06-05 09:04:47', '2026-06-05 09:04:47'),
(383, 3, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 09:27 AM\n📅 ថ្ងៃទី: 05 Jun 2026\n\n⚠️ ស្ថានភាព: មកយឺត\n⏳ យឺតចំនួន: 27m 58s', NULL, NULL, NULL, 'sent', 0, '2026-06-05 09:28:01', '2026-06-05 09:28:01', '2026-06-05 09:28:01'),
(384, 3, NULL, 'late_private', NULL, '⚠️ <b>ជូនដំណឹងមកយឺត</b>\n\n👤 បុគ្គលិក: Po Tilino\n🆔 លេខសម្គាល់: DSI003\n🕘 ម៉ោងចូល: 09:27 AM\n⏳ យឺតចំនួន: 27m 58s\n💰 កាត់ប្រាក់: $0.00\n\nស្ថានភាព: មកយឺត', NULL, NULL, NULL, 'sent', 0, '2026-06-05 09:28:04', '2026-06-05 09:28:04', '2026-06-05 09:28:04'),
(385, 4, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 11:46 AM\n📅 ថ្ងៃទី: 05 Jun 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-06-05 11:47:03', '2026-06-05 11:47:03', '2026-06-05 11:47:03'),
(386, 16, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 08:36 AM\n🕘 ចេញម៉ោង: 05:04 PM\n📅 ថ្ងៃទី: 05 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 08h 28m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-05 17:05:01', '2026-06-05 17:05:01', '2026-06-05 17:05:01'),
(387, 5, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 08:53 AM\n🕘 ចេញម៉ោង: 05:13 PM\n📅 ថ្ងៃទី: 05 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 08h 19m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-05 17:13:47', '2026-06-05 17:13:47', '2026-06-05 17:13:47'),
(388, 6, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 08:40 AM\n🕘 ចេញម៉ោង: 05:21 PM\n📅 ថ្ងៃទី: 05 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 08h 41m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'failed', 0, NULL, '2026-06-05 17:21:20', '2026-06-05 17:21:20'),
(389, 3, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 09:27 AM\n🕘 ចេញម៉ោង: 05:29 PM\n📅 ថ្ងៃទី: 05 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 08h 01m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-05 17:29:55', '2026-06-05 17:29:55', '2026-06-05 17:29:55'),
(390, 14, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 08:33 AM\n🕘 ចេញម៉ោង: 05:38 PM\n📅 ថ្ងៃទី: 05 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 09h 04m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-05 17:38:20', '2026-06-05 17:38:20', '2026-06-05 17:38:20'),
(391, 9, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 08:19 AM\n🕘 ចេញម៉ោង: 05:52 PM\n📅 ថ្ងៃទី: 05 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 09h 32m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-05 17:52:25', '2026-06-05 17:52:25', '2026-06-05 17:52:25'),
(392, 10, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 08:25 AM\n🕘 ចេញម៉ោង: 05:55 PM\n📅 ថ្ងៃទី: 05 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 09h 29m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-05 17:55:34', '2026-06-05 17:55:34', '2026-06-05 17:55:34'),
(393, 12, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 08:45 AM\n🕘 ចេញម៉ោង: 06:08 PM\n📅 ថ្ងៃទី: 05 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 09h 22m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-05 18:08:13', '2026-06-05 18:08:13', '2026-06-05 18:08:13'),
(394, 8, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 08:17 AM\n🕘 ចេញម៉ោង: 06:08 PM\n📅 ថ្ងៃទី: 05 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 09h 50m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-05 18:08:36', '2026-06-05 18:08:36', '2026-06-05 18:08:36'),
(395, 15, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 08:44 AM\n🕘 ចេញម៉ោង: 06:18 PM\n📅 ថ្ងៃទី: 05 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 09h 34m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'failed', 0, NULL, '2026-06-05 18:18:53', '2026-06-05 18:18:53'),
(396, 21, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 09:04 AM\n🕘 ចេញម៉ោង: 07:47 PM\n📅 ថ្ងៃទី: 05 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 10h 42m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-05 19:47:37', '2026-06-05 19:47:37', '2026-06-05 19:47:37'),
(397, 8, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:19 AM\n📅 ថ្ងៃទី: 06 Jun 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-06-06 08:19:49', '2026-06-06 08:19:49', '2026-06-06 08:19:49'),
(398, 16, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:22 AM\n📅 ថ្ងៃទី: 06 Jun 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-06-06 08:22:15', '2026-06-06 08:22:15', '2026-06-06 08:22:15'),
(399, 9, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:23 AM\n📅 ថ្ងៃទី: 06 Jun 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-06-06 08:23:38', '2026-06-06 08:23:38', '2026-06-06 08:23:38'),
(400, 14, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:30 AM\n📅 ថ្ងៃទី: 06 Jun 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-06-06 08:30:49', '2026-06-06 08:30:49', '2026-06-06 08:30:49'),
(401, 5, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:31 AM\n📅 ថ្ងៃទី: 06 Jun 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-06-06 08:31:11', '2026-06-06 08:31:11', '2026-06-06 08:31:11'),
(402, 10, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:48 AM\n📅 ថ្ងៃទី: 06 Jun 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-06-06 08:48:35', '2026-06-06 08:48:35', '2026-06-06 08:48:35'),
(403, 15, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 09:00 AM\n📅 ថ្ងៃទី: 06 Jun 2026\n\n⚠️ ស្ថានភាព: មកយឺត\n⏳ យឺតចំនួន: 22s', NULL, NULL, NULL, 'failed', 0, NULL, '2026-06-06 09:00:26', '2026-06-06 09:00:26'),
(404, 15, NULL, 'late_private', NULL, '⚠️ <b>ជូនដំណឹងមកយឺត</b>\n\n👤 បុគ្គលិក: Mang Leanghort\n🆔 លេខសម្គាល់: ACC006\n🕘 ម៉ោងចូល: 09:00 AM\n⏳ យឺតចំនួន: 22s\n💰 កាត់ប្រាក់: $0.00\n\nស្ថានភាព: មកយឺត', NULL, NULL, NULL, 'failed', 0, NULL, '2026-06-06 09:00:29', '2026-06-06 09:00:29'),
(405, 4, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 09:03 AM\n📅 ថ្ងៃទី: 06 Jun 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-06-06 09:04:00', '2026-06-06 09:04:00', '2026-06-06 09:04:00'),
(406, 13, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 09:09 AM\n📅 ថ្ងៃទី: 06 Jun 2026\n\n⚠️ ស្ថានភាព: មកយឺត\n⏳ យឺតចំនួន: 9m 2s', NULL, NULL, NULL, 'sent', 0, '2026-06-06 09:09:05', '2026-06-06 09:09:05', '2026-06-06 09:09:05'),
(407, 13, NULL, 'late_private', NULL, '⚠️ <b>ជូនដំណឹងមកយឺត</b>\n\n👤 បុគ្គលិក: Chean Aleav\n🆔 លេខសម្គាល់: ACC003\n🕘 ម៉ោងចូល: 09:09 AM\n⏳ យឺតចំនួន: 9m 2s\n💰 កាត់ប្រាក់: $0.00\n\nស្ថានភាព: មកយឺត', NULL, NULL, NULL, 'sent', 0, '2026-06-06 09:09:07', '2026-06-06 09:09:07', '2026-06-06 09:09:07'),
(408, 12, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 09:09 AM\n📅 ថ្ងៃទី: 06 Jun 2026\n\n⚠️ ស្ថានភាព: មកយឺត\n⏳ យឺតចំនួន: 9m 54s', NULL, NULL, NULL, 'sent', 0, '2026-06-06 09:09:58', '2026-06-06 09:09:58', '2026-06-06 09:09:58'),
(409, 12, NULL, 'late_private', NULL, '⚠️ <b>ជូនដំណឹងមកយឺត</b>\n\n👤 បុគ្គលិក: Chu Kimhorng\n🆔 លេខសម្គាល់: ACC005\n🕘 ម៉ោងចូល: 09:09 AM\n⏳ យឺតចំនួន: 9m 54s\n💰 កាត់ប្រាក់: $0.00\n\nស្ថានភាព: មកយឺត', NULL, NULL, NULL, 'sent', 0, '2026-06-06 09:10:00', '2026-06-06 09:10:00', '2026-06-06 09:10:00'),
(410, 3, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 09:34 AM\n📅 ថ្ងៃទី: 06 Jun 2026\n\n⚠️ ស្ថានភាព: មកយឺត\n⏳ យឺតចំនួន: 34m 39s', NULL, NULL, NULL, 'sent', 0, '2026-06-06 09:34:44', '2026-06-06 09:34:44', '2026-06-06 09:34:44'),
(411, 3, NULL, 'late_private', NULL, '⚠️ <b>ជូនដំណឹងមកយឺត</b>\n\n👤 បុគ្គលិក: Po Tilino\n🆔 លេខសម្គាល់: DSI003\n🕘 ម៉ោងចូល: 09:34 AM\n⏳ យឺតចំនួន: 34m 39s\n💰 កាត់ប្រាក់: $1.50\n\nស្ថានភាព: មកយឺត', NULL, NULL, NULL, 'sent', 0, '2026-06-06 09:34:46', '2026-06-06 09:34:46', '2026-06-06 09:34:46'),
(412, 6, NULL, 'permission_status_private', NULL, '📄 <b>PERMISSION REQUEST Approved</b>\n\n👤 <b>Employee:</b> Gak Vicheka\n📌 <b>Type:</b> Day Off\n📅 <b>Duration:</b> 06 Jun 2026 Full Day\n👨‍💼 <b>Reviewed by:</b> Super Admin\n📝 <b>Note:</b> Approved.', NULL, NULL, NULL, 'failed', 0, NULL, '2026-06-06 09:36:09', '2026-06-06 09:36:09'),
(413, 21, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 10:04 AM\n📅 ថ្ងៃទី: 06 Jun 2026\n\n⚠️ ស្ថានភាព: មកយឺត\n⏳ យឺតចំនួន: 1h 4m 42s', NULL, NULL, NULL, 'sent', 0, '2026-06-06 10:04:46', '2026-06-06 10:04:46', '2026-06-06 10:04:46'),
(414, 21, NULL, 'late_private', NULL, '⚠️ <b>ជូនដំណឹងមកយឺត</b>\n\n👤 បុគ្គលិក: Van\n🆔 លេខសម្គាល់: DL003\n🕘 ម៉ោងចូល: 10:04 AM\n⏳ យឺតចំនួន: 1h 4m 42s\n💰 កាត់ប្រាក់: $0.00\n\nស្ថានភាព: មកយឺត', NULL, NULL, NULL, 'sent', 0, '2026-06-06 10:04:48', '2026-06-06 10:04:48', '2026-06-06 10:04:48'),
(415, 17, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 11:04 AM\n📅 ថ្ងៃទី: 06 Jun 2026\n\n⚠️ ស្ថានភាព: មកយឺត\n⏳ យឺតចំនួន: 2h 4m 54s', NULL, NULL, NULL, 'sent', 0, '2026-06-06 11:04:58', '2026-06-06 11:04:58', '2026-06-06 11:04:58'),
(416, 17, NULL, 'late_private', NULL, '⚠️ <b>ជូនដំណឹងមកយឺត</b>\n\n👤 បុគ្គលិក: Phal Panha\n🆔 លេខសម្គាល់: DL002\n🕘 ម៉ោងចូល: 11:04 AM\n⏳ យឺតចំនួន: 2h 4m 54s\n💰 កាត់ប្រាក់: $0.00\n\nស្ថានភាព: មកយឺត', NULL, NULL, NULL, 'sent', 0, '2026-06-06 11:05:00', '2026-06-06 11:05:00', '2026-06-06 11:05:00'),
(417, 16, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 08:22 AM\n🕘 ចេញម៉ោង: 05:00 PM\n📅 ថ្ងៃទី: 06 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 08h 38m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-06 17:00:36', '2026-06-06 17:00:36', '2026-06-06 17:00:36'),
(418, 5, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 08:31 AM\n🕘 ចេញម៉ោង: 05:08 PM\n📅 ថ្ងៃទី: 06 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 08h 37m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-06 17:08:48', '2026-06-06 17:08:48', '2026-06-06 17:08:48'),
(419, 3, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 09:34 AM\n🕘 ចេញម៉ោង: 05:14 PM\n📅 ថ្ងៃទី: 06 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 07h 40m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-06 17:14:52', '2026-06-06 17:14:52', '2026-06-06 17:14:52'),
(420, 8, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 08:19 AM\n🕘 ចេញម៉ោង: 05:19 PM\n📅 ថ្ងៃទី: 06 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 08h 59m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-06 17:19:25', '2026-06-06 17:19:25', '2026-06-06 17:19:25'),
(421, 14, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 08:30 AM\n🕘 ចេញម៉ោង: 05:55 PM\n📅 ថ្ងៃទី: 06 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 09h 24m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-06 17:55:21', '2026-06-06 17:55:21', '2026-06-06 17:55:21'),
(422, 10, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 08:48 AM\n🕘 ចេញម៉ោង: 06:33 PM\n📅 ថ្ងៃទី: 06 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 09h 45m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-06 18:33:47', '2026-06-06 18:33:47', '2026-06-06 18:33:47'),
(423, 13, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 09:09 AM\n🕘 ចេញម៉ោង: 06:52 PM\n📅 ថ្ងៃទី: 06 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 09h 43m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-06 18:52:59', '2026-06-06 18:52:59', '2026-06-06 18:52:59'),
(424, 9, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 08:23 AM\n🕘 ចេញម៉ោង: 06:54 PM\n📅 ថ្ងៃទី: 06 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 10h 31m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-06 18:54:49', '2026-06-06 18:54:49', '2026-06-06 18:54:49'),
(425, 12, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 09:09 AM\n🕘 ចេញម៉ោង: 06:54 PM\n📅 ថ្ងៃទី: 06 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 09h 44m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-06 18:54:52', '2026-06-06 18:54:52', '2026-06-06 18:54:52'),
(426, 15, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 09:00 AM\n🕘 ចេញម៉ោង: 06:55 PM\n📅 ថ្ងៃទី: 06 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 09h 54m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'failed', 0, NULL, '2026-06-06 18:55:17', '2026-06-06 18:55:17'),
(427, 21, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 10:04 AM\n🕘 ចេញម៉ោង: 07:19 PM\n📅 ថ្ងៃទី: 06 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 09h 14m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-06 19:19:06', '2026-06-06 19:19:06', '2026-06-06 19:19:06'),
(428, 17, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 07:39 AM\n📅 ថ្ងៃទី: 07 Jun 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-06-07 07:39:13', '2026-06-07 07:39:13', '2026-06-07 07:39:13'),
(429, 8, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:21 AM\n📅 ថ្ងៃទី: 07 Jun 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-06-07 08:21:46', '2026-06-07 08:21:46', '2026-06-07 08:21:46'),
(430, 16, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:31 AM\n📅 ថ្ងៃទី: 07 Jun 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-06-07 08:32:00', '2026-06-07 08:32:00', '2026-06-07 08:32:00'),
(431, 9, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 09:20 AM\n📅 ថ្ងៃទី: 07 Jun 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-06-07 09:20:34', '2026-06-07 09:20:34', '2026-06-07 09:20:34'),
(432, 21, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 09:48 AM\n📅 ថ្ងៃទី: 07 Jun 2026\n\n⚠️ ស្ថានភាព: មកយឺត\n⏳ យឺតចំនួន: 48m 46s', NULL, NULL, NULL, 'sent', 0, '2026-06-07 09:48:51', '2026-06-07 09:48:51', '2026-06-07 09:48:51'),
(433, 21, NULL, 'late_private', NULL, '⚠️ <b>ជូនដំណឹងមកយឺត</b>\n\n👤 បុគ្គលិក: Van\n🆔 លេខសម្គាល់: DL003\n🕘 ម៉ោងចូល: 09:48 AM\n⏳ យឺតចំនួន: 48m 46s\n💰 កាត់ប្រាក់: $0.00\n\nស្ថានភាព: មកយឺត', NULL, NULL, NULL, 'sent', 0, '2026-06-07 09:48:53', '2026-06-07 09:48:53', '2026-06-07 09:48:53'),
(434, 19, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 10:59 AM\n📅 ថ្ងៃទី: 07 Jun 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-06-07 10:59:27', '2026-06-07 10:59:27', '2026-06-07 10:59:27'),
(435, 13, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 11:05 AM\n📅 ថ្ងៃទី: 07 Jun 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-06-07 11:05:46', '2026-06-07 11:05:46', '2026-06-07 11:05:46'),
(436, 16, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 08:31 AM\n🕘 ចេញម៉ោង: 05:00 PM\n📅 ថ្ងៃទី: 07 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 08h 28m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-07 17:00:38', '2026-06-07 17:00:38', '2026-06-07 17:00:38'),
(437, 19, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 10:59 AM\n🕘 ចេញម៉ោង: 05:01 PM\n📅 ថ្ងៃទី: 07 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 06h 01m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-07 17:01:25', '2026-06-07 17:01:25', '2026-06-07 17:01:25'),
(438, 8, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 08:21 AM\n🕘 ចេញម៉ោង: 05:03 PM\n📅 ថ្ងៃទី: 07 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 08h 41m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-07 17:03:16', '2026-06-07 17:03:16', '2026-06-07 17:03:16'),
(439, 13, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 11:05 AM\n🕘 ចេញម៉ោង: 05:17 PM\n📅 ថ្ងៃទី: 07 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 06h 12m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-07 17:17:57', '2026-06-07 17:17:57', '2026-06-07 17:17:57'),
(440, 9, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 09:20 AM\n🕘 ចេញម៉ោង: 05:18 PM\n📅 ថ្ងៃទី: 07 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 07h 57m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-07 17:18:21', '2026-06-07 17:18:21', '2026-06-07 17:18:21'),
(441, 21, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 09:48 AM\n🕘 ចេញម៉ោង: 06:39 PM\n📅 ថ្ងៃទី: 07 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 08h 50m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-07 18:39:30', '2026-06-07 18:39:30', '2026-06-07 18:39:30'),
(442, 16, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:00 AM\n📅 ថ្ងៃទី: 08 Jun 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-06-08 08:00:46', '2026-06-08 08:00:46', '2026-06-08 08:00:46'),
(443, 8, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:28 AM\n📅 ថ្ងៃទី: 08 Jun 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-06-08 08:28:03', '2026-06-08 08:28:03', '2026-06-08 08:28:03'),
(444, 21, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:29 AM\n📅 ថ្ងៃទី: 08 Jun 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-06-08 08:29:52', '2026-06-08 08:29:52', '2026-06-08 08:29:52'),
(445, 9, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:35 AM\n📅 ថ្ងៃទី: 08 Jun 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-06-08 08:35:20', '2026-06-08 08:35:20', '2026-06-08 08:35:20'),
(446, 5, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:39 AM\n📅 ថ្ងៃទី: 08 Jun 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-06-08 08:39:15', '2026-06-08 08:39:15', '2026-06-08 08:39:15'),
(447, 14, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:41 AM\n📅 ថ្ងៃទី: 08 Jun 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-06-08 08:41:05', '2026-06-08 08:41:05', '2026-06-08 08:41:05'),
(448, 12, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:51 AM\n📅 ថ្ងៃទី: 08 Jun 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-06-08 08:51:46', '2026-06-08 08:51:46', '2026-06-08 08:51:46'),
(449, 15, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:57 AM\n📅 ថ្ងៃទី: 08 Jun 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'failed', 0, NULL, '2026-06-08 08:57:05', '2026-06-08 08:57:05'),
(450, 13, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 09:02 AM\n📅 ថ្ងៃទី: 08 Jun 2026\n\n⚠️ ស្ថានភាព: មកយឺត\n⏳ យឺតចំនួន: 2m 8s', NULL, NULL, NULL, 'sent', 0, '2026-06-08 09:02:12', '2026-06-08 09:02:12', '2026-06-08 09:02:12'),
(451, 13, NULL, 'late_private', NULL, '⚠️ <b>ជូនដំណឹងមកយឺត</b>\n\n👤 បុគ្គលិក: Chean Aleav\n🆔 លេខសម្គាល់: ACC003\n🕘 ម៉ោងចូល: 09:02 AM\n⏳ យឺតចំនួន: 2m 8s\n💰 កាត់ប្រាក់: $0.00\n\nស្ថានភាព: មកយឺត', NULL, NULL, NULL, 'sent', 0, '2026-06-08 09:02:14', '2026-06-08 09:02:14', '2026-06-08 09:02:14'),
(452, 19, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 09:07 AM\n📅 ថ្ងៃទី: 08 Jun 2026\n\n⚠️ ស្ថានភាព: មកយឺត\n⏳ យឺតចំនួន: 7m 52s', NULL, NULL, NULL, 'sent', 0, '2026-06-08 09:07:56', '2026-06-08 09:07:56', '2026-06-08 09:07:56'),
(453, 19, NULL, 'late_private', NULL, '⚠️ <b>ជូនដំណឹងមកយឺត</b>\n\n👤 បុគ្គលិក: Heng Laiheang\n🆔 លេខសម្គាល់: acc008\n🕘 ម៉ោងចូល: 09:07 AM\n⏳ យឺតចំនួន: 7m 52s\n💰 កាត់ប្រាក់: $0.00\n\nស្ថានភាព: មកយឺត', NULL, NULL, NULL, 'sent', 0, '2026-06-08 09:07:58', '2026-06-08 09:07:58', '2026-06-08 09:07:58'),
(454, 6, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 09:14 AM\n📅 ថ្ងៃទី: 08 Jun 2026\n\n⚠️ ស្ថានភាព: មកយឺត\n⏳ យឺតចំនួន: 14m 30s', NULL, NULL, NULL, 'failed', 0, NULL, '2026-06-08 09:14:33', '2026-06-08 09:14:33'),
(455, 6, NULL, 'late_private', NULL, '⚠️ <b>ជូនដំណឹងមកយឺត</b>\n\n👤 បុគ្គលិក: Gak Vicheka\n🆔 លេខសម្គាល់: DSI004\n🕘 ម៉ោងចូល: 09:14 AM\n⏳ យឺតចំនួន: 14m 30s\n💰 កាត់ប្រាក់: $0.00\n\nស្ថានភាព: មកយឺត', NULL, NULL, NULL, 'failed', 0, NULL, '2026-06-08 09:14:35', '2026-06-08 09:14:35'),
(456, 3, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 09:33 AM\n📅 ថ្ងៃទី: 08 Jun 2026\n\n⚠️ ស្ថានភាព: មកយឺត\n⏳ យឺតចំនួន: 33m 5s', NULL, NULL, NULL, 'sent', 0, '2026-06-08 09:33:08', '2026-06-08 09:33:08', '2026-06-08 09:33:08'),
(457, 3, NULL, 'late_private', NULL, '⚠️ <b>ជូនដំណឹងមកយឺត</b>\n\n👤 បុគ្គលិក: Po Tilino\n🆔 លេខសម្គាល់: DSI003\n🕘 ម៉ោងចូល: 09:33 AM\n⏳ យឺតចំនួន: 33m 5s\n💰 កាត់ប្រាក់: $1.50\n\nស្ថានភាព: មកយឺត', NULL, NULL, NULL, 'sent', 0, '2026-06-08 09:33:14', '2026-06-08 09:33:14', '2026-06-08 09:33:14'),
(458, 4, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 11:31 AM\n📅 ថ្ងៃទី: 08 Jun 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-06-08 11:31:57', '2026-06-08 11:31:57', '2026-06-08 11:31:57'),
(459, 1, NULL, 'permission_request_admin_private', NULL, '📄 <b>NEW PERMISSION REQUEST</b>\n\n👤 <b>Employee:</b> Heng Laiheang\n📌 <b>Type:</b> Late Check In\n📅 <b>Duration:</b> 08 Jun 2026 16:30 - 17:00 (0.50 hour(s))\n📝 <b>Reason:</b> សួស្ដីបង ដោយសារញុមជាប់ប្រឡង ដូច្នេះសុំច្បាប់ចេញមុនចំនួន30mnបង\n\n⏳ <b>Status:</b> Pending Approval', NULL, NULL, NULL, 'sent', 0, '2026-06-08 14:04:12', '2026-06-08 14:04:12', '2026-06-08 14:04:12'),
(460, 19, NULL, 'permission_request_submitted_private', NULL, '📄 <b>Your permission request was submitted</b>\n\n<b>Request:</b> PR-2026-0008\n<b>Type:</b> Late Check In\n<b>Duration:</b> 08 Jun 2026 16:30 - 17:00 (0.50 hour(s))\n<b>Reason:</b> សួស្ដីបង ដោយសារញុមជាប់ប្រឡង ដូច្នេះសុំច្បាប់ចេញមុនចំនួន30mnបង\n\n⏳ <b>Status:</b> Pending Approval', NULL, NULL, NULL, 'sent', 0, '2026-06-08 14:04:13', '2026-06-08 14:04:13', '2026-06-08 14:04:13'),
(461, 17, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 02:22 PM\n📅 ថ្ងៃទី: 08 Jun 2026\n\n⚠️ ស្ថានភាព: មកយឺត\n⏳ យឺតចំនួន: 5h 22m 52s', NULL, NULL, NULL, 'sent', 0, '2026-06-08 14:22:56', '2026-06-08 14:22:56', '2026-06-08 14:22:56'),
(462, 17, NULL, 'late_private', NULL, '⚠️ <b>ជូនដំណឹងមកយឺត</b>\n\n👤 បុគ្គលិក: Phal Panha\n🆔 លេខសម្គាល់: DL002\n🕘 ម៉ោងចូល: 02:22 PM\n⏳ យឺតចំនួន: 5h 22m 52s\n💰 កាត់ប្រាក់: $0.00\n\nស្ថានភាព: មកយឺត', NULL, NULL, NULL, 'sent', 0, '2026-06-08 14:22:58', '2026-06-08 14:22:58', '2026-06-08 14:22:58'),
(463, 19, NULL, 'permission_status_private', NULL, '📄 <b>PERMISSION REQUEST Approved</b>\n\n👤 <b>Employee:</b> Heng Laiheang\n📌 <b>Type:</b> Late Check In\n📅 <b>Duration:</b> 08 Jun 2026 16:30 - 17:00 (0.50 hour(s))\n👨‍💼 <b>Reviewed by:</b> Super Admin\n📝 <b>Note:</b> Approved.', NULL, NULL, NULL, 'sent', 0, '2026-06-08 15:52:47', '2026-06-08 15:52:47', '2026-06-08 15:52:47'),
(464, 16, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 08:00 AM\n🕘 ចេញម៉ោង: 05:06 PM\n📅 ថ្ងៃទី: 08 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 09h 06m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-08 17:06:47', '2026-06-08 17:06:47', '2026-06-08 17:06:47'),
(465, 9, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 08:35 AM\n🕘 ចេញម៉ោង: 05:08 PM\n📅 ថ្ងៃទី: 08 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 08h 33m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-08 17:08:30', '2026-06-08 17:08:30', '2026-06-08 17:08:30'),
(466, 8, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 08:28 AM\n🕘 ចេញម៉ោង: 05:09 PM\n📅 ថ្ងៃទី: 08 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 08h 41m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-08 17:09:11', '2026-06-08 17:09:11', '2026-06-08 17:09:11'),
(467, 5, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 08:39 AM\n🕘 ចេញម៉ោង: 05:13 PM\n📅 ថ្ងៃទី: 08 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 08h 34m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-08 17:13:27', '2026-06-08 17:13:27', '2026-06-08 17:13:27'),
(468, 6, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 09:14 AM\n🕘 ចេញម៉ោង: 05:19 PM\n📅 ថ្ងៃទី: 08 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 08h 04m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'failed', 0, NULL, '2026-06-08 17:19:11', '2026-06-08 17:19:11'),
(469, 3, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 09:33 AM\n🕘 ចេញម៉ោង: 05:27 PM\n📅 ថ្ងៃទី: 08 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 07h 54m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-08 17:27:24', '2026-06-08 17:27:24', '2026-06-08 17:27:24'),
(470, 4, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 11:31 AM\n🕘 ចេញម៉ោង: 05:27 PM\n📅 ថ្ងៃទី: 08 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 05h 55m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-08 17:27:42', '2026-06-08 17:27:42', '2026-06-08 17:27:42'),
(471, 21, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 08:29 AM\n🕘 ចេញម៉ោង: 05:32 PM\n📅 ថ្ងៃទី: 08 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 09h 02m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-08 17:32:47', '2026-06-08 17:32:47', '2026-06-08 17:32:47'),
(472, 15, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 08:57 AM\n🕘 ចេញម៉ោង: 05:42 PM\n📅 ថ្ងៃទី: 08 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 08h 45m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'failed', 0, NULL, '2026-06-08 17:42:52', '2026-06-08 17:42:52'),
(473, 14, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 08:41 AM\n🕘 ចេញម៉ោង: 05:43 PM\n📅 ថ្ងៃទី: 08 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 09h 02m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-08 17:43:56', '2026-06-08 17:43:56', '2026-06-08 17:43:56'),
(474, 13, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 09:02 AM\n🕘 ចេញម៉ោង: 07:26 PM\n📅 ថ្ងៃទី: 08 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 10h 24m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-08 19:26:20', '2026-06-08 19:26:20', '2026-06-08 19:26:20'),
(475, 12, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 08:51 AM\n🕘 ចេញម៉ោង: 07:27 PM\n📅 ថ្ងៃទី: 08 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 10h 35m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-08 19:27:31', '2026-06-08 19:27:31', '2026-06-08 19:27:31'),
(476, 8, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:20 AM\n📅 ថ្ងៃទី: 09 Jun 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-06-09 08:21:03', '2026-06-09 08:21:03', '2026-06-09 08:21:03'),
(477, 9, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:29 AM\n📅 ថ្ងៃទី: 09 Jun 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-06-09 08:29:52', '2026-06-09 08:29:52', '2026-06-09 08:29:52'),
(478, 16, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:32 AM\n📅 ថ្ងៃទី: 09 Jun 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-06-09 08:32:20', '2026-06-09 08:32:20', '2026-06-09 08:32:20'),
(479, 15, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:44 AM\n📅 ថ្ងៃទី: 09 Jun 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'failed', 0, NULL, '2026-06-09 08:44:38', '2026-06-09 08:44:38'),
(480, 19, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:53 AM\n📅 ថ្ងៃទី: 09 Jun 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-06-09 08:53:15', '2026-06-09 08:53:15', '2026-06-09 08:53:15'),
(481, 13, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:55 AM\n📅 ថ្ងៃទី: 09 Jun 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-06-09 08:55:48', '2026-06-09 08:55:48', '2026-06-09 08:55:48'),
(482, 5, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:59 AM\n📅 ថ្ងៃទី: 09 Jun 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-06-09 08:59:22', '2026-06-09 08:59:22', '2026-06-09 08:59:22'),
(483, 6, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:59 AM\n📅 ថ្ងៃទី: 09 Jun 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'failed', 0, NULL, '2026-06-09 08:59:29', '2026-06-09 08:59:29'),
(484, 12, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 09:00 AM\n📅 ថ្ងៃទី: 09 Jun 2026\n\n⚠️ ស្ថានភាព: មកយឺត\n⏳ យឺតចំនួន: 58s', NULL, NULL, NULL, 'sent', 0, '2026-06-09 09:01:02', '2026-06-09 09:01:02', '2026-06-09 09:01:02'),
(485, 12, NULL, 'late_private', NULL, '⚠️ <b>ជូនដំណឹងមកយឺត</b>\n\n👤 បុគ្គលិក: Chu Kimhorng\n🆔 លេខសម្គាល់: ACC005\n🕘 ម៉ោងចូល: 09:00 AM\n⏳ យឺតចំនួន: 58s\n💰 កាត់ប្រាក់: $0.00\n\nស្ថានភាព: មកយឺត', NULL, NULL, NULL, 'sent', 0, '2026-06-09 09:01:04', '2026-06-09 09:01:04', '2026-06-09 09:01:04'),
(486, 14, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 09:14 AM\n📅 ថ្ងៃទី: 09 Jun 2026\n\n⚠️ ស្ថានភាព: មកយឺត\n⏳ យឺតចំនួន: 14m 0s', NULL, NULL, NULL, 'sent', 0, '2026-06-09 09:14:03', '2026-06-09 09:14:03', '2026-06-09 09:14:03'),
(487, 14, NULL, 'late_private', NULL, '⚠️ <b>ជូនដំណឹងមកយឺត</b>\n\n👤 បុគ្គលិក: Outh Kimnai\n🆔 លេខសម្គាល់: MK001\n🕘 ម៉ោងចូល: 09:14 AM\n⏳ យឺតចំនួន: 14m 0s\n💰 កាត់ប្រាក់: $0.00\n\nស្ថានភាព: មកយឺត', NULL, NULL, NULL, 'sent', 0, '2026-06-09 09:14:05', '2026-06-09 09:14:05', '2026-06-09 09:14:05'),
(488, 3, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 09:19 AM\n📅 ថ្ងៃទី: 09 Jun 2026\n\n⚠️ ស្ថានភាព: មកយឺត\n⏳ យឺតចំនួន: 19m 39s', NULL, NULL, NULL, 'sent', 0, '2026-06-09 09:19:43', '2026-06-09 09:19:43', '2026-06-09 09:19:43'),
(489, 3, NULL, 'late_private', NULL, '⚠️ <b>ជូនដំណឹងមកយឺត</b>\n\n👤 បុគ្គលិក: Po Tilino\n🆔 លេខសម្គាល់: DSI003\n🕘 ម៉ោងចូល: 09:19 AM\n⏳ យឺតចំនួន: 19m 39s\n💰 កាត់ប្រាក់: $0.00\n\nស្ថានភាព: មកយឺត', NULL, NULL, NULL, 'sent', 0, '2026-06-09 09:19:45', '2026-06-09 09:19:45', '2026-06-09 09:19:45'),
(490, 21, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 10:02 AM\n📅 ថ្ងៃទី: 09 Jun 2026\n\n⚠️ ស្ថានភាព: មកយឺត\n⏳ យឺតចំនួន: 1h 2m 24s', NULL, NULL, NULL, 'sent', 0, '2026-06-09 10:02:27', '2026-06-09 10:02:27', '2026-06-09 10:02:27'),
(491, 21, NULL, 'late_private', NULL, '⚠️ <b>ជូនដំណឹងមកយឺត</b>\n\n👤 បុគ្គលិក: Van\n🆔 លេខសម្គាល់: DL003\n🕘 ម៉ោងចូល: 10:02 AM\n⏳ យឺតចំនួន: 1h 2m 24s\n💰 កាត់ប្រាក់: $0.00\n\nស្ថានភាព: មកយឺត', NULL, NULL, NULL, 'sent', 0, '2026-06-09 10:02:29', '2026-06-09 10:02:29', '2026-06-09 10:02:29'),
(492, 17, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 10:39 AM\n📅 ថ្ងៃទី: 09 Jun 2026\n\n⚠️ ស្ថានភាព: មកយឺត\n⏳ យឺតចំនួន: 1h 39m 10s', NULL, NULL, NULL, 'sent', 0, '2026-06-09 10:39:14', '2026-06-09 10:39:14', '2026-06-09 10:39:14'),
(493, 17, NULL, 'late_private', NULL, '⚠️ <b>ជូនដំណឹងមកយឺត</b>\n\n👤 បុគ្គលិក: Phal Panha\n🆔 លេខសម្គាល់: DL002\n🕘 ម៉ោងចូល: 10:39 AM\n⏳ យឺតចំនួន: 1h 39m 10s\n💰 កាត់ប្រាក់: $0.00\n\nស្ថានភាព: មកយឺត', NULL, NULL, NULL, 'sent', 0, '2026-06-09 10:39:16', '2026-06-09 10:39:16', '2026-06-09 10:39:16'),
(494, 4, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 11:22 AM\n📅 ថ្ងៃទី: 09 Jun 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-06-09 11:22:57', '2026-06-09 11:22:57', '2026-06-09 11:22:57'),
(495, 16, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 08:32 AM\n🕘 ចេញម៉ោង: 05:01 PM\n📅 ថ្ងៃទី: 09 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 08h 29m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-09 17:01:23', '2026-06-09 17:01:23', '2026-06-09 17:01:23'),
(496, 19, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 08:53 AM\n🕘 ចេញម៉ោង: 05:06 PM\n📅 ថ្ងៃទី: 09 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 08h 13m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-09 17:06:46', '2026-06-09 17:06:46', '2026-06-09 17:06:46'),
(497, 8, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 08:20 AM\n🕘 ចេញម៉ោង: 05:07 PM\n📅 ថ្ងៃទី: 09 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 08h 46m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-09 17:07:33', '2026-06-09 17:07:33', '2026-06-09 17:07:33'),
(498, 4, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 11:22 AM\n🕘 ចេញម៉ោង: 05:25 PM\n📅 ថ្ងៃទី: 09 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 06h 02m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-09 17:25:22', '2026-06-09 17:25:22', '2026-06-09 17:25:22'),
(499, 6, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 08:59 AM\n🕘 ចេញម៉ោង: 05:27 PM\n📅 ថ្ងៃទី: 09 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 08h 28m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'failed', 0, NULL, '2026-06-09 17:27:59', '2026-06-09 17:27:59'),
(500, 5, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 08:59 AM\n🕘 ចេញម៉ោង: 05:43 PM\n📅 ថ្ងៃទី: 09 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 08h 43m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-09 17:43:12', '2026-06-09 17:43:12', '2026-06-09 17:43:12'),
(501, 3, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 09:19 AM\n🕘 ចេញម៉ោង: 05:46 PM\n📅 ថ្ងៃទី: 09 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 08h 26m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-09 17:46:31', '2026-06-09 17:46:31', '2026-06-09 17:46:31'),
(502, 14, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 09:14 AM\n🕘 ចេញម៉ោង: 06:24 PM\n📅 ថ្ងៃទី: 09 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 09h 10m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-09 18:24:33', '2026-06-09 18:24:33', '2026-06-09 18:24:33'),
(503, 15, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 08:44 AM\n🕘 ចេញម៉ោង: 06:25 PM\n📅 ថ្ងៃទី: 09 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 09h 40m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'failed', 0, NULL, '2026-06-09 18:25:04', '2026-06-09 18:25:04'),
(504, 9, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 08:29 AM\n🕘 ចេញម៉ោង: 07:32 PM\n📅 ថ្ងៃទី: 09 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 11h 02m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-09 19:32:34', '2026-06-09 19:32:34', '2026-06-09 19:32:34'),
(505, 13, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 08:55 AM\n🕘 ចេញម៉ោង: 07:35 PM\n📅 ថ្ងៃទី: 09 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 10h 39m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-09 19:35:40', '2026-06-09 19:35:40', '2026-06-09 19:35:40'),
(506, 12, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 09:00 AM\n🕘 ចេញម៉ោង: 07:36 PM\n📅 ថ្ងៃទី: 09 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 10h 35m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-09 19:36:10', '2026-06-09 19:36:10', '2026-06-09 19:36:10'),
(507, 21, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 10:02 AM\n🕘 ចេញម៉ោង: 07:47 PM\n📅 ថ្ងៃទី: 09 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 09h 45m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-09 19:48:01', '2026-06-09 19:48:01', '2026-06-09 19:48:01'),
(508, 9, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:14 AM\n📅 ថ្ងៃទី: 10 Jun 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-06-10 08:14:49', '2026-06-10 08:14:49', '2026-06-10 08:14:49'),
(509, 8, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:23 AM\n📅 ថ្ងៃទី: 10 Jun 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-06-10 08:23:54', '2026-06-10 08:23:54', '2026-06-10 08:23:54'),
(510, 15, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:45 AM\n📅 ថ្ងៃទី: 10 Jun 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'failed', 0, NULL, '2026-06-10 08:45:46', '2026-06-10 08:45:46'),
(511, 12, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:48 AM\n📅 ថ្ងៃទី: 10 Jun 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-06-10 08:48:33', '2026-06-10 08:48:33', '2026-06-10 08:48:33'),
(512, 13, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:49 AM\n📅 ថ្ងៃទី: 10 Jun 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-06-10 08:49:30', '2026-06-10 08:49:30', '2026-06-10 08:49:30'),
(513, 19, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:55 AM\n📅 ថ្ងៃទី: 10 Jun 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-06-10 08:55:46', '2026-06-10 08:55:46', '2026-06-10 08:55:46'),
(514, 5, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:58 AM\n📅 ថ្ងៃទី: 10 Jun 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-06-10 08:58:33', '2026-06-10 08:58:33', '2026-06-10 08:58:33'),
(515, 6, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:59 AM\n📅 ថ្ងៃទី: 10 Jun 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'failed', 0, NULL, '2026-06-10 08:59:36', '2026-06-10 08:59:36'),
(516, 3, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:59 AM\n📅 ថ្ងៃទី: 10 Jun 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-06-10 08:59:52', '2026-06-10 08:59:52', '2026-06-10 08:59:52'),
(517, 14, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 09:00 AM\n📅 ថ្ងៃទី: 10 Jun 2026\n\n⚠️ ស្ថានភាព: មកយឺត\n⏳ យឺតចំនួន: 34s', NULL, NULL, NULL, 'sent', 0, '2026-06-10 09:00:37', '2026-06-10 09:00:37', '2026-06-10 09:00:37'),
(518, 14, NULL, 'late_private', NULL, '⚠️ <b>ជូនដំណឹងមកយឺត</b>\n\n👤 បុគ្គលិក: Outh Kimnai\n🆔 លេខសម្គាល់: MK001\n🕘 ម៉ោងចូល: 09:00 AM\n⏳ យឺតចំនួន: 34s\n💰 កាត់ប្រាក់: $0.00\n\nស្ថានភាព: មកយឺត', NULL, NULL, NULL, 'sent', 0, '2026-06-10 09:00:39', '2026-06-10 09:00:39', '2026-06-10 09:00:39'),
(519, 17, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 09:23 AM\n📅 ថ្ងៃទី: 10 Jun 2026\n\n⚠️ ស្ថានភាព: មកយឺត\n⏳ យឺតចំនួន: 23m 9s', NULL, NULL, NULL, 'sent', 0, '2026-06-10 09:23:13', '2026-06-10 09:23:13', '2026-06-10 09:23:13'),
(520, 17, NULL, 'late_private', NULL, '⚠️ <b>ជូនដំណឹងមកយឺត</b>\n\n👤 បុគ្គលិក: Phal Panha\n🆔 លេខសម្គាល់: DL002\n🕘 ម៉ោងចូល: 09:23 AM\n⏳ យឺតចំនួន: 23m 9s\n💰 កាត់ប្រាក់: $0.00\n\nស្ថានភាព: មកយឺត', NULL, NULL, NULL, 'sent', 0, '2026-06-10 09:23:15', '2026-06-10 09:23:15', '2026-06-10 09:23:15'),
(521, 21, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 09:58 AM\n📅 ថ្ងៃទី: 10 Jun 2026\n\n⚠️ ស្ថានភាព: មកយឺត\n⏳ យឺតចំនួន: 58m 37s', NULL, NULL, NULL, 'sent', 0, '2026-06-10 09:58:41', '2026-06-10 09:58:41', '2026-06-10 09:58:41'),
(522, 21, NULL, 'late_private', NULL, '⚠️ <b>ជូនដំណឹងមកយឺត</b>\n\n👤 បុគ្គលិក: Van\n🆔 លេខសម្គាល់: DL003\n🕘 ម៉ោងចូល: 09:58 AM\n⏳ យឺតចំនួន: 58m 37s\n💰 កាត់ប្រាក់: $0.00\n\nស្ថានភាព: មកយឺត', NULL, NULL, NULL, 'sent', 0, '2026-06-10 09:58:43', '2026-06-10 09:58:43', '2026-06-10 09:58:43'),
(523, 4, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 11:17 AM\n📅 ថ្ងៃទី: 10 Jun 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-06-10 11:17:59', '2026-06-10 11:17:59', '2026-06-10 11:17:59'),
(524, 6, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 08:59 AM\n🕘 ចេញម៉ោង: 05:02 PM\n📅 ថ្ងៃទី: 10 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 08h 03m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'failed', 0, NULL, '2026-06-10 17:02:46', '2026-06-10 17:02:46'),
(525, 19, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 08:55 AM\n🕘 ចេញម៉ោង: 05:15 PM\n📅 ថ្ងៃទី: 10 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 08h 19m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-10 17:15:41', '2026-06-10 17:15:41', '2026-06-10 17:15:41'),
(526, 5, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 08:58 AM\n🕘 ចេញម៉ោង: 05:15 PM\n📅 ថ្ងៃទី: 10 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 08h 17m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-10 17:15:55', '2026-06-10 17:15:55', '2026-06-10 17:15:55'),
(527, 8, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 08:23 AM\n🕘 ចេញម៉ោង: 05:16 PM\n📅 ថ្ងៃទី: 10 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 08h 53m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-10 17:16:59', '2026-06-10 17:16:59', '2026-06-10 17:16:59'),
(528, 3, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 08:59 AM\n🕘 ចេញម៉ោង: 05:20 PM\n📅 ថ្ងៃទី: 10 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 08h 20m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-10 17:20:32', '2026-06-10 17:20:32', '2026-06-10 17:20:32'),
(529, 14, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 09:00 AM\n🕘 ចេញម៉ោង: 05:20 PM\n📅 ថ្ងៃទី: 10 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 08h 20m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-10 17:20:52', '2026-06-10 17:20:52', '2026-06-10 17:20:52'),
(530, 12, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 08:48 AM\n🕘 ចេញម៉ោង: 05:28 PM\n📅 ថ្ងៃទី: 10 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 08h 40m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-10 17:28:50', '2026-06-10 17:28:50', '2026-06-10 17:28:50'),
(531, 15, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 08:45 AM\n🕘 ចេញម៉ោង: 05:50 PM\n📅 ថ្ងៃទី: 10 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 09h 05m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'failed', 0, NULL, '2026-06-10 17:51:00', '2026-06-10 17:51:00'),
(532, 4, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 11:17 AM\n🕘 ចេញម៉ោង: 06:22 PM\n📅 ថ្ងៃទី: 10 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 07h 05m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-10 18:23:03', '2026-06-10 18:23:03', '2026-06-10 18:23:03'),
(533, 13, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 08:49 AM\n🕘 ចេញម៉ោង: 06:31 PM\n📅 ថ្ងៃទី: 10 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 09h 42m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-10 18:31:33', '2026-06-10 18:31:33', '2026-06-10 18:31:33'),
(534, 9, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 08:14 AM\n🕘 ចេញម៉ោង: 06:32 PM\n📅 ថ្ងៃទី: 10 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 10h 18m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-10 18:32:48', '2026-06-10 18:32:48', '2026-06-10 18:32:48'),
(535, 17, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 09:23 AM\n🕘 ចេញម៉ោង: 06:40 PM\n📅 ថ្ងៃទី: 10 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 09h 17m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-10 18:41:00', '2026-06-10 18:41:00', '2026-06-10 18:41:00'),
(536, 8, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:21 AM\n📅 ថ្ងៃទី: 11 Jun 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-06-11 08:21:53', '2026-06-11 08:21:53', '2026-06-11 08:21:53'),
(537, 9, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:22 AM\n📅 ថ្ងៃទី: 11 Jun 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-06-11 08:22:44', '2026-06-11 08:22:44', '2026-06-11 08:22:44'),
(538, 16, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:33 AM\n📅 ថ្ងៃទី: 11 Jun 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-06-11 08:33:10', '2026-06-11 08:33:10', '2026-06-11 08:33:10'),
(539, 13, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:48 AM\n📅 ថ្ងៃទី: 11 Jun 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-06-11 08:48:46', '2026-06-11 08:48:46', '2026-06-11 08:48:46'),
(540, 14, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:52 AM\n📅 ថ្ងៃទី: 11 Jun 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-06-11 08:52:28', '2026-06-11 08:52:28', '2026-06-11 08:52:28'),
(541, 5, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:57 AM\n📅 ថ្ងៃទី: 11 Jun 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-06-11 08:57:32', '2026-06-11 08:57:32', '2026-06-11 08:57:32'),
(542, 19, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:58 AM\n📅 ថ្ងៃទី: 11 Jun 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-06-11 08:58:05', '2026-06-11 08:58:05', '2026-06-11 08:58:05'),
(543, 15, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:59 AM\n📅 ថ្ងៃទី: 11 Jun 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'failed', 0, NULL, '2026-06-11 08:59:27', '2026-06-11 08:59:27'),
(544, 12, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 09:15 AM\n📅 ថ្ងៃទី: 11 Jun 2026\n\n⚠️ ស្ថានភាព: មកយឺត\n⏳ យឺតចំនួន: 15m 26s', NULL, NULL, NULL, 'sent', 0, '2026-06-11 09:15:30', '2026-06-11 09:15:30', '2026-06-11 09:15:30'),
(545, 12, NULL, 'late_private', NULL, '⚠️ <b>ជូនដំណឹងមកយឺត</b>\n\n👤 បុគ្គលិក: Chu Kimhorng\n🆔 លេខសម្គាល់: ACC005\n🕘 ម៉ោងចូល: 09:15 AM\n⏳ យឺតចំនួន: 15m 26s\n💰 កាត់ប្រាក់: $0.00\n\nស្ថានភាព: មកយឺត', NULL, NULL, NULL, 'sent', 0, '2026-06-11 09:15:32', '2026-06-11 09:15:32', '2026-06-11 09:15:32'),
(546, 3, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 09:34 AM\n📅 ថ្ងៃទី: 11 Jun 2026\n\n⚠️ ស្ថានភាព: មកយឺត\n⏳ យឺតចំនួន: 34m 17s', NULL, NULL, NULL, 'sent', 0, '2026-06-11 09:34:21', '2026-06-11 09:34:21', '2026-06-11 09:34:21'),
(547, 3, NULL, 'late_private', NULL, '⚠️ <b>ជូនដំណឹងមកយឺត</b>\n\n👤 បុគ្គលិក: Po Tilino\n🆔 លេខសម្គាល់: DSI003\n🕘 ម៉ោងចូល: 09:34 AM\n⏳ យឺតចំនួន: 34m 17s\n💰 កាត់ប្រាក់: $1.50\n\nស្ថានភាព: មកយឺត', NULL, NULL, NULL, 'sent', 0, '2026-06-11 09:34:24', '2026-06-11 09:34:24', '2026-06-11 09:34:24'),
(548, 17, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 10:10 AM\n📅 ថ្ងៃទី: 11 Jun 2026\n\n⚠️ ស្ថានភាព: មកយឺត\n⏳ យឺតចំនួន: 1h 10m 35s', NULL, NULL, NULL, 'sent', 0, '2026-06-11 10:10:40', '2026-06-11 10:10:40', '2026-06-11 10:10:40'),
(549, 17, NULL, 'late_private', NULL, '⚠️ <b>ជូនដំណឹងមកយឺត</b>\n\n👤 បុគ្គលិក: Phal Panha\n🆔 លេខសម្គាល់: DL002\n🕘 ម៉ោងចូល: 10:10 AM\n⏳ យឺតចំនួន: 1h 10m 35s\n💰 កាត់ប្រាក់: $0.00\n\nស្ថានភាព: មកយឺត', NULL, NULL, NULL, 'sent', 0, '2026-06-11 10:10:42', '2026-06-11 10:10:42', '2026-06-11 10:10:42'),
(550, 6, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 10:19 AM\n📅 ថ្ងៃទី: 11 Jun 2026\n\n⚠️ ស្ថានភាព: មកយឺត\n⏳ យឺតចំនួន: 1h 19m 38s', NULL, NULL, NULL, 'failed', 0, NULL, '2026-06-11 10:19:42', '2026-06-11 10:19:42'),
(551, 6, NULL, 'late_private', NULL, '⚠️ <b>ជូនដំណឹងមកយឺត</b>\n\n👤 បុគ្គលិក: Gak Vicheka\n🆔 លេខសម្គាល់: DSI004\n🕘 ម៉ោងចូល: 10:19 AM\n⏳ យឺតចំនួន: 1h 19m 38s\n💰 កាត់ប្រាក់: $0.00\n\nស្ថានភាព: មកយឺត', NULL, NULL, NULL, 'failed', 0, NULL, '2026-06-11 10:19:46', '2026-06-11 10:19:46'),
(552, 21, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 10:41 AM\n📅 ថ្ងៃទី: 11 Jun 2026\n\n⚠️ ស្ថានភាព: មកយឺត\n⏳ យឺតចំនួន: 1h 41m 32s', NULL, NULL, NULL, 'sent', 0, '2026-06-11 10:41:36', '2026-06-11 10:41:36', '2026-06-11 10:41:36'),
(553, 21, NULL, 'late_private', NULL, '⚠️ <b>ជូនដំណឹងមកយឺត</b>\n\n👤 បុគ្គលិក: Van\n🆔 លេខសម្គាល់: DL003\n🕘 ម៉ោងចូល: 10:41 AM\n⏳ យឺតចំនួន: 1h 41m 32s\n💰 កាត់ប្រាក់: $0.00\n\nស្ថានភាព: មកយឺត', NULL, NULL, NULL, 'sent', 0, '2026-06-11 10:41:39', '2026-06-11 10:41:39', '2026-06-11 10:41:39'),
(554, 4, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 11:29 AM\n📅 ថ្ងៃទី: 11 Jun 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-06-11 11:29:16', '2026-06-11 11:29:16', '2026-06-11 11:29:16'),
(555, 16, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 08:33 AM\n🕘 ចេញម៉ោង: 05:01 PM\n📅 ថ្ងៃទី: 11 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 08h 28m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-11 17:02:01', '2026-06-11 17:02:01', '2026-06-11 17:02:01'),
(556, 6, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 10:19 AM\n🕘 ចេញម៉ោង: 05:09 PM\n📅 ថ្ងៃទី: 11 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 06h 49m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'failed', 0, NULL, '2026-06-11 17:09:37', '2026-06-11 17:09:37'),
(557, 5, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 08:57 AM\n🕘 ចេញម៉ោង: 05:11 PM\n📅 ថ្ងៃទី: 11 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 08h 14m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-11 17:12:02', '2026-06-11 17:12:02', '2026-06-11 17:12:02'),
(558, 8, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 08:21 AM\n🕘 ចេញម៉ោង: 05:22 PM\n📅 ថ្ងៃទី: 11 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 09h 00m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-11 17:22:04', '2026-06-11 17:22:04', '2026-06-11 17:22:04'),
(559, 3, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 09:34 AM\n🕘 ចេញម៉ោង: 05:32 PM\n📅 ថ្ងៃទី: 11 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 07h 57m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-11 17:32:05', '2026-06-11 17:32:05', '2026-06-11 17:32:05');
INSERT INTO `telegram_logs` (`id`, `employee_id`, `customer_visit_id`, `message_type`, `event_key`, `telegram_message`, `selfie_url`, `store_photo_url`, `error_message`, `status`, `attempts`, `sent_at`, `created_at`, `updated_at`) VALUES
(560, 21, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 10:41 AM\n🕘 ចេញម៉ោង: 05:33 PM\n📅 ថ្ងៃទី: 11 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 06h 52m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-11 17:34:03', '2026-06-11 17:34:03', '2026-06-11 17:34:03'),
(561, 14, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 08:52 AM\n🕘 ចេញម៉ោង: 05:41 PM\n📅 ថ្ងៃទី: 11 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 08h 49m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-11 17:41:48', '2026-06-11 17:41:48', '2026-06-11 17:41:48'),
(562, 15, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 08:59 AM\n🕘 ចេញម៉ោង: 05:44 PM\n📅 ថ្ងៃទី: 11 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 08h 44m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'failed', 0, NULL, '2026-06-11 17:44:13', '2026-06-11 17:44:13'),
(563, 9, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 08:22 AM\n🕘 ចេញម៉ោង: 05:52 PM\n📅 ថ្ងៃទី: 11 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 09h 29m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-11 17:52:33', '2026-06-11 17:52:33', '2026-06-11 17:52:33'),
(564, 4, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 11:29 AM\n🕘 ចេញម៉ោង: 08:03 PM\n📅 ថ្ងៃទី: 11 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 08h 34m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-11 20:03:19', '2026-06-11 20:03:19', '2026-06-11 20:03:19'),
(565, 13, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 08:48 AM\n🕘 ចេញម៉ោង: 08:09 PM\n📅 ថ្ងៃទី: 11 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 11h 20m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-11 20:09:12', '2026-06-11 20:09:12', '2026-06-11 20:09:12'),
(566, 19, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 08:58 AM\n🕘 ចេញម៉ោង: 08:10 PM\n📅 ថ្ងៃទី: 11 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 11h 12m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-11 20:11:04', '2026-06-11 20:11:04', '2026-06-11 20:11:04'),
(567, 12, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 09:15 AM\n🕘 ចេញម៉ោង: 08:11 PM\n📅 ថ្ងៃទី: 11 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 10h 56m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-11 20:11:51', '2026-06-11 20:11:51', '2026-06-11 20:11:51'),
(568, 8, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:17 AM\n📅 ថ្ងៃទី: 12 Jun 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-06-12 08:17:54', '2026-06-12 08:17:54', '2026-06-12 08:17:54'),
(569, 9, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:26 AM\n📅 ថ្ងៃទី: 12 Jun 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-06-12 08:26:18', '2026-06-12 08:26:18', '2026-06-12 08:26:18'),
(570, 16, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:32 AM\n📅 ថ្ងៃទី: 12 Jun 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-06-12 08:32:41', '2026-06-12 08:32:41', '2026-06-12 08:32:41'),
(571, 14, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:47 AM\n📅 ថ្ងៃទី: 12 Jun 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-06-12 08:47:11', '2026-06-12 08:47:11', '2026-06-12 08:47:11'),
(572, 6, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 09:02 AM\n📅 ថ្ងៃទី: 12 Jun 2026\n\n⚠️ ស្ថានភាព: មកយឺត\n⏳ យឺតចំនួន: 2m 44s', NULL, NULL, NULL, 'failed', 0, NULL, '2026-06-12 09:02:48', '2026-06-12 09:02:48'),
(573, 6, NULL, 'late_private', NULL, '⚠️ <b>ជូនដំណឹងមកយឺត</b>\n\n👤 បុគ្គលិក: Gak Vicheka\n🆔 លេខសម្គាល់: DSI004\n🕘 ម៉ោងចូល: 09:02 AM\n⏳ យឺតចំនួន: 2m 44s\n💰 កាត់ប្រាក់: $0.00\n\nស្ថានភាព: មកយឺត', NULL, NULL, NULL, 'failed', 0, NULL, '2026-06-12 09:02:50', '2026-06-12 09:02:50'),
(574, 5, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 09:10 AM\n📅 ថ្ងៃទី: 12 Jun 2026\n\n⚠️ ស្ថានភាព: មកយឺត\n⏳ យឺតចំនួន: 10m 50s', NULL, NULL, NULL, 'sent', 0, '2026-06-12 09:10:53', '2026-06-12 09:10:53', '2026-06-12 09:10:53'),
(575, 5, NULL, 'late_private', NULL, '⚠️ <b>ជូនដំណឹងមកយឺត</b>\n\n👤 បុគ្គលិក: Sorn Pugnavan\n🆔 លេខសម្គាល់: MK002\n🕘 ម៉ោងចូល: 09:10 AM\n⏳ យឺតចំនួន: 10m 50s\n💰 កាត់ប្រាក់: $0.00\n\nស្ថានភាព: មកយឺត', NULL, NULL, NULL, 'sent', 0, '2026-06-12 09:10:55', '2026-06-12 09:10:55', '2026-06-12 09:10:55'),
(576, 13, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 09:13 AM\n📅 ថ្ងៃទី: 12 Jun 2026\n\n⚠️ ស្ថានភាព: មកយឺត\n⏳ យឺតចំនួន: 13m 15s', NULL, NULL, NULL, 'sent', 0, '2026-06-12 09:13:19', '2026-06-12 09:13:19', '2026-06-12 09:13:19'),
(577, 13, NULL, 'late_private', NULL, '⚠️ <b>ជូនដំណឹងមកយឺត</b>\n\n👤 បុគ្គលិក: Chean Aleav\n🆔 លេខសម្គាល់: ACC003\n🕘 ម៉ោងចូល: 09:13 AM\n⏳ យឺតចំនួន: 13m 15s\n💰 កាត់ប្រាក់: $0.00\n\nស្ថានភាព: មកយឺត', NULL, NULL, NULL, 'sent', 0, '2026-06-12 09:13:21', '2026-06-12 09:13:21', '2026-06-12 09:13:21'),
(578, 3, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 09:19 AM\n📅 ថ្ងៃទី: 12 Jun 2026\n\n⚠️ ស្ថានភាព: មកយឺត\n⏳ យឺតចំនួន: 19m 31s', NULL, NULL, NULL, 'sent', 0, '2026-06-12 09:19:34', '2026-06-12 09:19:34', '2026-06-12 09:19:34'),
(579, 3, NULL, 'late_private', NULL, '⚠️ <b>ជូនដំណឹងមកយឺត</b>\n\n👤 បុគ្គលិក: Po Tilino\n🆔 លេខសម្គាល់: DSI003\n🕘 ម៉ោងចូល: 09:19 AM\n⏳ យឺតចំនួន: 19m 31s\n💰 កាត់ប្រាក់: $0.00\n\nស្ថានភាព: មកយឺត', NULL, NULL, NULL, 'sent', 0, '2026-06-12 09:19:36', '2026-06-12 09:19:36', '2026-06-12 09:19:36'),
(580, 21, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 11:15 AM\n📅 ថ្ងៃទី: 12 Jun 2026\n\n⚠️ ស្ថានភាព: មកយឺត\n⏳ យឺតចំនួន: 2h 15m 27s', NULL, NULL, NULL, 'sent', 0, '2026-06-12 11:15:32', '2026-06-12 11:15:32', '2026-06-12 11:15:32'),
(581, 21, NULL, 'late_private', NULL, '⚠️ <b>ជូនដំណឹងមកយឺត</b>\n\n👤 បុគ្គលិក: Van\n🆔 លេខសម្គាល់: DL003\n🕘 ម៉ោងចូល: 11:15 AM\n⏳ យឺតចំនួន: 2h 15m 27s\n💰 កាត់ប្រាក់: $0.00\n\nស្ថានភាព: មកយឺត', NULL, NULL, NULL, 'sent', 0, '2026-06-12 11:15:34', '2026-06-12 11:15:34', '2026-06-12 11:15:34'),
(582, 4, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 11:24 AM\n📅 ថ្ងៃទី: 12 Jun 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-06-12 11:24:17', '2026-06-12 11:24:17', '2026-06-12 11:24:17'),
(583, 17, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 02:01 PM\n📅 ថ្ងៃទី: 12 Jun 2026\n\n⚠️ ស្ថានភាព: មកយឺត\n⏳ យឺតចំនួន: 5h 1m 49s', NULL, NULL, NULL, 'sent', 0, '2026-06-12 14:01:54', '2026-06-12 14:01:54', '2026-06-12 14:01:54'),
(584, 17, NULL, 'late_private', NULL, '⚠️ <b>ជូនដំណឹងមកយឺត</b>\n\n👤 បុគ្គលិក: Phal Panha\n🆔 លេខសម្គាល់: DL002\n🕘 ម៉ោងចូល: 02:01 PM\n⏳ យឺតចំនួន: 5h 1m 49s\n💰 កាត់ប្រាក់: $0.00\n\nស្ថានភាព: មកយឺត', NULL, NULL, NULL, 'sent', 0, '2026-06-12 14:01:56', '2026-06-12 14:01:56', '2026-06-12 14:01:56'),
(585, 6, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 09:02 AM\n🕘 ចេញម៉ោង: 05:02 PM\n📅 ថ្ងៃទី: 12 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 07h 59m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'failed', 0, NULL, '2026-06-12 17:02:40', '2026-06-12 17:02:40'),
(586, 5, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 09:10 AM\n🕘 ចេញម៉ោង: 05:04 PM\n📅 ថ្ងៃទី: 12 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 07h 53m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-12 17:04:07', '2026-06-12 17:04:07', '2026-06-12 17:04:07'),
(587, 16, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 08:32 AM\n🕘 ចេញម៉ោង: 05:06 PM\n📅 ថ្ងៃទី: 12 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 08h 33m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-12 17:06:18', '2026-06-12 17:06:18', '2026-06-12 17:06:18'),
(588, 3, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 09:19 AM\n🕘 ចេញម៉ោង: 05:08 PM\n📅 ថ្ងៃទី: 12 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 07h 48m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-12 17:08:13', '2026-06-12 17:08:13', '2026-06-12 17:08:13'),
(589, 8, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 08:17 AM\n🕘 ចេញម៉ោង: 05:17 PM\n📅 ថ្ងៃទី: 12 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 08h 59m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-12 17:17:20', '2026-06-12 17:17:20', '2026-06-12 17:17:20'),
(590, 14, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 08:47 AM\n🕘 ចេញម៉ោង: 06:09 PM\n📅 ថ្ងៃទី: 12 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 09h 22m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-12 18:09:58', '2026-06-12 18:09:58', '2026-06-12 18:09:58'),
(591, 21, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 11:15 AM\n🕘 ចេញម៉ោង: 06:13 PM\n📅 ថ្ងៃទី: 12 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 06h 57m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-12 18:13:06', '2026-06-12 18:13:06', '2026-06-12 18:13:06'),
(592, 9, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 08:26 AM\n🕘 ចេញម៉ោង: 06:44 PM\n📅 ថ្ងៃទី: 12 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 10h 18m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-12 18:44:34', '2026-06-12 18:44:34', '2026-06-12 18:44:34'),
(593, 13, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 09:13 AM\n🕘 ចេញម៉ោង: 06:47 PM\n📅 ថ្ងៃទី: 12 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 09h 34m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-12 18:48:00', '2026-06-12 18:48:00', '2026-06-12 18:48:00'),
(594, 16, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:20 AM\n📅 ថ្ងៃទី: 13 Jun 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-06-13 08:20:15', '2026-06-13 08:20:15', '2026-06-13 08:20:15'),
(595, 8, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:22 AM\n📅 ថ្ងៃទី: 13 Jun 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-06-13 08:22:11', '2026-06-13 08:22:11', '2026-06-13 08:22:11'),
(596, 9, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:34 AM\n📅 ថ្ងៃទី: 13 Jun 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-06-13 08:34:29', '2026-06-13 08:34:29', '2026-06-13 08:34:29'),
(597, 3, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:45 AM\n📅 ថ្ងៃទី: 13 Jun 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-06-13 08:45:35', '2026-06-13 08:45:35', '2026-06-13 08:45:35'),
(598, 14, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:45 AM\n📅 ថ្ងៃទី: 13 Jun 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-06-13 08:45:45', '2026-06-13 08:45:45', '2026-06-13 08:45:45'),
(599, 5, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:54 AM\n📅 ថ្ងៃទី: 13 Jun 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-06-13 08:54:04', '2026-06-13 08:54:04', '2026-06-13 08:54:04'),
(600, 15, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 09:05 AM\n📅 ថ្ងៃទី: 13 Jun 2026\n\n⚠️ ស្ថានភាព: មកយឺត\n⏳ យឺតចំនួន: 5m 19s', NULL, NULL, NULL, 'failed', 0, NULL, '2026-06-13 09:05:24', '2026-06-13 09:05:24'),
(601, 15, NULL, 'late_private', NULL, '⚠️ <b>ជូនដំណឹងមកយឺត</b>\n\n👤 បុគ្គលិក: Mang Leanghort\n🆔 លេខសម្គាល់: ACC006\n🕘 ម៉ោងចូល: 09:05 AM\n⏳ យឺតចំនួន: 5m 19s\n💰 កាត់ប្រាក់: $0.00\n\nស្ថានភាព: មកយឺត', NULL, NULL, NULL, 'failed', 0, NULL, '2026-06-13 09:05:26', '2026-06-13 09:05:26'),
(602, 4, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 09:22 AM\n📅 ថ្ងៃទី: 13 Jun 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-06-13 09:22:40', '2026-06-13 09:22:40', '2026-06-13 09:22:40'),
(603, 21, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 09:25 AM\n📅 ថ្ងៃទី: 13 Jun 2026\n\n⚠️ ស្ថានភាព: មកយឺត\n⏳ យឺតចំនួន: 25m 29s', NULL, NULL, NULL, 'sent', 0, '2026-06-13 09:25:33', '2026-06-13 09:25:33', '2026-06-13 09:25:33'),
(604, 21, NULL, 'late_private', NULL, '⚠️ <b>ជូនដំណឹងមកយឺត</b>\n\n👤 បុគ្គលិក: Van\n🆔 លេខសម្គាល់: DL003\n🕘 ម៉ោងចូល: 09:25 AM\n⏳ យឺតចំនួន: 25m 29s\n💰 កាត់ប្រាក់: $0.00\n\nស្ថានភាព: មកយឺត', NULL, NULL, NULL, 'sent', 0, '2026-06-13 09:25:34', '2026-06-13 09:25:34', '2026-06-13 09:25:34'),
(605, 13, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 09:28 AM\n📅 ថ្ងៃទី: 13 Jun 2026\n\n⚠️ ស្ថានភាព: មកយឺត\n⏳ យឺតចំនួន: 28m 52s', NULL, NULL, NULL, 'sent', 0, '2026-06-13 09:28:55', '2026-06-13 09:28:55', '2026-06-13 09:28:55'),
(606, 13, NULL, 'late_private', NULL, '⚠️ <b>ជូនដំណឹងមកយឺត</b>\n\n👤 បុគ្គលិក: Chean Aleav\n🆔 លេខសម្គាល់: ACC003\n🕘 ម៉ោងចូល: 09:28 AM\n⏳ យឺតចំនួន: 28m 52s\n💰 កាត់ប្រាក់: $0.00\n\nស្ថានភាព: មកយឺត', NULL, NULL, NULL, 'sent', 0, '2026-06-13 09:28:57', '2026-06-13 09:28:57', '2026-06-13 09:28:57'),
(607, 6, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 09:41 AM\n📅 ថ្ងៃទី: 13 Jun 2026\n\n⚠️ ស្ថានភាព: មកយឺត\n⏳ យឺតចំនួន: 41m 34s', NULL, NULL, NULL, 'failed', 0, NULL, '2026-06-13 09:41:37', '2026-06-13 09:41:37'),
(608, 6, NULL, 'late_private', NULL, '⚠️ <b>ជូនដំណឹងមកយឺត</b>\n\n👤 បុគ្គលិក: Gak Vicheka\n🆔 លេខសម្គាល់: DSI004\n🕘 ម៉ោងចូល: 09:41 AM\n⏳ យឺតចំនួន: 41m 34s\n💰 កាត់ប្រាក់: $1.50\n\nស្ថានភាព: មកយឺត', NULL, NULL, NULL, 'failed', 0, NULL, '2026-06-13 09:41:41', '2026-06-13 09:41:41'),
(609, 17, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 10:25 AM\n📅 ថ្ងៃទី: 13 Jun 2026\n\n⚠️ ស្ថានភាព: មកយឺត\n⏳ យឺតចំនួន: 1h 25m 41s', NULL, NULL, NULL, 'sent', 0, '2026-06-13 10:25:44', '2026-06-13 10:25:44', '2026-06-13 10:25:44'),
(610, 17, NULL, 'late_private', NULL, '⚠️ <b>ជូនដំណឹងមកយឺត</b>\n\n👤 បុគ្គលិក: Phal Panha\n🆔 លេខសម្គាល់: DL002\n🕘 ម៉ោងចូល: 10:25 AM\n⏳ យឺតចំនួន: 1h 25m 41s\n💰 កាត់ប្រាក់: $0.00\n\nស្ថានភាព: មកយឺត', NULL, NULL, NULL, 'sent', 0, '2026-06-13 10:25:46', '2026-06-13 10:25:46', '2026-06-13 10:25:46'),
(611, 3, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 08:45 AM\n🕘 ចេញម៉ោង: 05:01 PM\n📅 ថ្ងៃទី: 13 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 08h 16m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-13 17:01:42', '2026-06-13 17:01:42', '2026-06-13 17:01:42'),
(612, 16, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 08:20 AM\n🕘 ចេញម៉ោង: 05:05 PM\n📅 ថ្ងៃទី: 13 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 08h 45m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-13 17:05:19', '2026-06-13 17:05:19', '2026-06-13 17:05:19'),
(613, 5, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 08:54 AM\n🕘 ចេញម៉ោង: 05:05 PM\n📅 ថ្ងៃទី: 13 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 08h 11m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-13 17:05:34', '2026-06-13 17:05:34', '2026-06-13 17:05:34'),
(614, 6, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 09:41 AM\n🕘 ចេញម៉ោង: 05:07 PM\n📅 ថ្ងៃទី: 13 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 07h 25m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'failed', 0, NULL, '2026-06-13 17:07:19', '2026-06-13 17:07:19'),
(615, 8, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 08:22 AM\n🕘 ចេញម៉ោង: 05:11 PM\n📅 ថ្ងៃទី: 13 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 08h 49m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-13 17:11:52', '2026-06-13 17:11:52', '2026-06-13 17:11:52'),
(616, 14, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 08:45 AM\n🕘 ចេញម៉ោង: 06:17 PM\n📅 ថ្ងៃទី: 13 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 09h 32m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-13 18:17:54', '2026-06-13 18:17:54', '2026-06-13 18:17:54'),
(617, 15, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 09:05 AM\n🕘 ចេញម៉ោង: 06:30 PM\n📅 ថ្ងៃទី: 13 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 09h 25m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'failed', 0, NULL, '2026-06-13 18:30:58', '2026-06-13 18:30:58'),
(618, 13, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 09:28 AM\n🕘 ចេញម៉ោង: 07:44 PM\n📅 ថ្ងៃទី: 13 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 10h 15m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-13 19:44:28', '2026-06-13 19:44:28', '2026-06-13 19:44:28'),
(619, 9, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 08:34 AM\n🕘 ចេញម៉ោង: 08:27 PM\n📅 ថ្ងៃទី: 13 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 11h 53m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-13 20:27:51', '2026-06-13 20:27:51', '2026-06-13 20:27:51'),
(620, 16, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:20 AM\n📅 ថ្ងៃទី: 14 Jun 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-06-14 08:20:36', '2026-06-14 08:20:36', '2026-06-14 08:20:36'),
(621, 8, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:36 AM\n📅 ថ្ងៃទី: 14 Jun 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-06-14 08:36:32', '2026-06-14 08:36:32', '2026-06-14 08:36:32'),
(622, 21, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:47 AM\n📅 ថ្ងៃទី: 14 Jun 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-06-14 08:47:27', '2026-06-14 08:47:27', '2026-06-14 08:47:27'),
(623, 17, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 10:29 AM\n📅 ថ្ងៃទី: 14 Jun 2026\n\n⚠️ ស្ថានភាព: មកយឺត\n⏳ យឺតចំនួន: 1h 29m 39s', NULL, NULL, NULL, 'sent', 0, '2026-06-14 10:29:43', '2026-06-14 10:29:43', '2026-06-14 10:29:43'),
(624, 17, NULL, 'late_private', NULL, '⚠️ <b>ជូនដំណឹងមកយឺត</b>\n\n👤 បុគ្គលិក: Phal Panha\n🆔 លេខសម្គាល់: DL002\n🕘 ម៉ោងចូល: 10:29 AM\n⏳ យឺតចំនួន: 1h 29m 39s\n💰 កាត់ប្រាក់: $0.00\n\nស្ថានភាព: មកយឺត', NULL, NULL, NULL, 'sent', 0, '2026-06-14 10:29:45', '2026-06-14 10:29:45', '2026-06-14 10:29:45'),
(625, 9, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 10:49 AM\n📅 ថ្ងៃទី: 14 Jun 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-06-14 10:49:46', '2026-06-14 10:49:46', '2026-06-14 10:49:46'),
(626, 16, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 08:20 AM\n🕘 ចេញម៉ោង: 05:23 PM\n📅 ថ្ងៃទី: 14 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 09h 03m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-14 17:23:36', '2026-06-14 17:23:36', '2026-06-14 17:23:36'),
(627, 9, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 10:49 AM\n🕘 ចេញម៉ោង: 06:29 PM\n📅 ថ្ងៃទី: 14 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 07h 39m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-14 18:29:41', '2026-06-14 18:29:41', '2026-06-14 18:29:41'),
(628, 8, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 08:36 AM\n🕘 ចេញម៉ោង: 06:30 PM\n📅 ថ្ងៃទី: 14 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 09h 53m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-14 18:30:18', '2026-06-14 18:30:18', '2026-06-14 18:30:18'),
(629, 8, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:26 AM\n📅 ថ្ងៃទី: 15 Jun 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-06-15 08:26:46', '2026-06-15 08:26:46', '2026-06-15 08:26:46'),
(630, 9, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:34 AM\n📅 ថ្ងៃទី: 15 Jun 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-06-15 08:34:39', '2026-06-15 08:34:39', '2026-06-15 08:34:39'),
(631, 14, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:50 AM\n📅 ថ្ងៃទី: 15 Jun 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-06-15 08:50:53', '2026-06-15 08:50:53', '2026-06-15 08:50:53'),
(632, 5, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:53 AM\n📅 ថ្ងៃទី: 15 Jun 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-06-15 08:53:27', '2026-06-15 08:53:27', '2026-06-15 08:53:27'),
(633, 13, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 09:04 AM\n📅 ថ្ងៃទី: 15 Jun 2026\n\n⚠️ ស្ថានភាព: មកយឺត\n⏳ យឺតចំនួន: 4m 5s', NULL, NULL, NULL, 'sent', 0, '2026-06-15 09:04:09', '2026-06-15 09:04:09', '2026-06-15 09:04:09'),
(634, 13, NULL, 'late_private', NULL, '⚠️ <b>ជូនដំណឹងមកយឺត</b>\n\n👤 បុគ្គលិក: Chean Aleav\n🆔 លេខសម្គាល់: ACC003\n🕘 ម៉ោងចូល: 09:04 AM\n⏳ យឺតចំនួន: 4m 5s\n💰 កាត់ប្រាក់: $0.00\n\nស្ថានភាព: មកយឺត', NULL, NULL, NULL, 'sent', 0, '2026-06-15 09:04:11', '2026-06-15 09:04:11', '2026-06-15 09:04:11'),
(635, 21, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 09:08 AM\n📅 ថ្ងៃទី: 15 Jun 2026\n\n⚠️ ស្ថានភាព: មកយឺត\n⏳ យឺតចំនួន: 8m 33s', NULL, NULL, NULL, 'sent', 0, '2026-06-15 09:08:38', '2026-06-15 09:08:38', '2026-06-15 09:08:38'),
(636, 21, NULL, 'late_private', NULL, '⚠️ <b>ជូនដំណឹងមកយឺត</b>\n\n👤 បុគ្គលិក: Van\n🆔 លេខសម្គាល់: DL003\n🕘 ម៉ោងចូល: 09:08 AM\n⏳ យឺតចំនួន: 8m 33s\n💰 កាត់ប្រាក់: $0.00\n\nស្ថានភាព: មកយឺត', NULL, NULL, NULL, 'sent', 0, '2026-06-15 09:08:40', '2026-06-15 09:08:40', '2026-06-15 09:08:40'),
(637, 6, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 09:19 AM\n📅 ថ្ងៃទី: 15 Jun 2026\n\n⚠️ ស្ថានភាព: មកយឺត\n⏳ យឺតចំនួន: 19m 2s', NULL, NULL, NULL, 'failed', 0, NULL, '2026-06-15 09:19:06', '2026-06-15 09:19:06'),
(638, 6, NULL, 'late_private', NULL, '⚠️ <b>ជូនដំណឹងមកយឺត</b>\n\n👤 បុគ្គលិក: Gak Vicheka\n🆔 លេខសម្គាល់: DSI004\n🕘 ម៉ោងចូល: 09:19 AM\n⏳ យឺតចំនួន: 19m 2s\n💰 កាត់ប្រាក់: $0.00\n\nស្ថានភាព: មកយឺត', NULL, NULL, NULL, 'failed', 0, NULL, '2026-06-15 09:19:08', '2026-06-15 09:19:08'),
(639, 3, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 09:23 AM\n📅 ថ្ងៃទី: 15 Jun 2026\n\n⚠️ ស្ថានភាព: មកយឺត\n⏳ យឺតចំនួន: 23m 58s', NULL, NULL, NULL, 'sent', 0, '2026-06-15 09:24:01', '2026-06-15 09:24:01', '2026-06-15 09:24:01'),
(640, 3, NULL, 'late_private', NULL, '⚠️ <b>ជូនដំណឹងមកយឺត</b>\n\n👤 បុគ្គលិក: Po Tilino\n🆔 លេខសម្គាល់: DSI003\n🕘 ម៉ោងចូល: 09:23 AM\n⏳ យឺតចំនួន: 23m 58s\n💰 កាត់ប្រាក់: $0.00\n\nស្ថានភាព: មកយឺត', NULL, NULL, NULL, 'sent', 0, '2026-06-15 09:24:03', '2026-06-15 09:24:03', '2026-06-15 09:24:03'),
(641, 17, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 09:31 AM\n📅 ថ្ងៃទី: 15 Jun 2026\n\n⚠️ ស្ថានភាព: មកយឺត\n⏳ យឺតចំនួន: 31m 41s', NULL, NULL, NULL, 'sent', 0, '2026-06-15 09:31:44', '2026-06-15 09:31:44', '2026-06-15 09:31:44'),
(642, 17, NULL, 'late_private', NULL, '⚠️ <b>ជូនដំណឹងមកយឺត</b>\n\n👤 បុគ្គលិក: Phal Panha\n🆔 លេខសម្គាល់: DL002\n🕘 ម៉ោងចូល: 09:31 AM\n⏳ យឺតចំនួន: 31m 41s\n💰 កាត់ប្រាក់: $0.00\n\nស្ថានភាព: មកយឺត', NULL, NULL, NULL, 'sent', 0, '2026-06-15 09:31:46', '2026-06-15 09:31:46', '2026-06-15 09:31:46'),
(643, 4, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 11:27 AM\n📅 ថ្ងៃទី: 15 Jun 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-06-15 11:27:10', '2026-06-15 11:27:10', '2026-06-15 11:27:10'),
(644, 5, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 08:53 AM\n🕘 ចេញម៉ោង: 05:01 PM\n📅 ថ្ងៃទី: 15 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 08h 08m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-15 17:01:46', '2026-06-15 17:01:46', '2026-06-15 17:01:46'),
(645, 6, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 09:19 AM\n🕘 ចេញម៉ោង: 05:01 PM\n📅 ថ្ងៃទី: 15 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 07h 42m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'failed', 0, NULL, '2026-06-15 17:01:50', '2026-06-15 17:01:50'),
(646, 3, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 09:23 AM\n🕘 ចេញម៉ោង: 05:14 PM\n📅 ថ្ងៃទី: 15 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 07h 50m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-15 17:14:52', '2026-06-15 17:14:52', '2026-06-15 17:14:52'),
(647, 13, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 09:04 AM\n🕘 ចេញម៉ោង: 05:39 PM\n📅 ថ្ងៃទី: 15 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 08h 35m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-15 17:40:00', '2026-06-15 17:40:00', '2026-06-15 17:40:00'),
(648, 14, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 08:50 AM\n🕘 ចេញម៉ោង: 06:22 PM\n📅 ថ្ងៃទី: 15 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 09h 31m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-15 18:22:48', '2026-06-15 18:22:48', '2026-06-15 18:22:48'),
(649, 8, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 08:26 AM\n🕘 ចេញម៉ោង: 06:31 PM\n📅 ថ្ងៃទី: 15 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 10h 04m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-15 18:31:39', '2026-06-15 18:31:39', '2026-06-15 18:31:39'),
(650, 9, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 08:34 AM\n🕘 ចេញម៉ោង: 08:35 PM\n📅 ថ្ងៃទី: 15 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 12h 01m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-15 20:36:01', '2026-06-15 20:36:01', '2026-06-15 20:36:01'),
(651, 4, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 11:27 AM\n🕘 ចេញម៉ោង: 08:40 PM\n📅 ថ្ងៃទី: 15 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 09h 13m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-15 20:40:55', '2026-06-15 20:40:55', '2026-06-15 20:40:55'),
(652, 16, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:21 AM\n📅 ថ្ងៃទី: 16 Jun 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-06-16 08:21:34', '2026-06-16 08:21:34', '2026-06-16 08:21:34'),
(653, 8, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:25 AM\n📅 ថ្ងៃទី: 16 Jun 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-06-16 08:25:26', '2026-06-16 08:25:26', '2026-06-16 08:25:26'),
(654, 9, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:37 AM\n📅 ថ្ងៃទី: 16 Jun 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-06-16 08:37:09', '2026-06-16 08:37:09', '2026-06-16 08:37:09'),
(655, 14, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:51 AM\n📅 ថ្ងៃទី: 16 Jun 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-06-16 08:51:15', '2026-06-16 08:51:15', '2026-06-16 08:51:15'),
(656, 6, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 09:00 AM\n📅 ថ្ងៃទី: 16 Jun 2026\n\n⚠️ ស្ថានភាព: មកយឺត\n⏳ យឺតចំនួន: 50s', NULL, NULL, NULL, 'failed', 0, NULL, '2026-06-16 09:00:54', '2026-06-16 09:00:54'),
(657, 6, NULL, 'late_private', NULL, '⚠️ <b>ជូនដំណឹងមកយឺត</b>\n\n👤 បុគ្គលិក: Gak Vicheka\n🆔 លេខសម្គាល់: DSI004\n🕘 ម៉ោងចូល: 09:00 AM\n⏳ យឺតចំនួន: 50s\n💰 កាត់ប្រាក់: $0.00\n\nស្ថានភាព: មកយឺត', NULL, NULL, NULL, 'failed', 0, NULL, '2026-06-16 09:00:57', '2026-06-16 09:00:57'),
(658, 5, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 09:18 AM\n📅 ថ្ងៃទី: 16 Jun 2026\n\n⚠️ ស្ថានភាព: មកយឺត\n⏳ យឺតចំនួន: 18m 44s', NULL, NULL, NULL, 'sent', 0, '2026-06-16 09:18:47', '2026-06-16 09:18:47', '2026-06-16 09:18:47'),
(659, 5, NULL, 'late_private', NULL, '⚠️ <b>ជូនដំណឹងមកយឺត</b>\n\n👤 បុគ្គលិក: Sorn Pugnavan\n🆔 លេខសម្គាល់: MK002\n🕘 ម៉ោងចូល: 09:18 AM\n⏳ យឺតចំនួន: 18m 44s\n💰 កាត់ប្រាក់: $0.00\n\nស្ថានភាព: មកយឺត', NULL, NULL, NULL, 'sent', 0, '2026-06-16 09:18:49', '2026-06-16 09:18:49', '2026-06-16 09:18:49'),
(660, 3, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 09:34 AM\n📅 ថ្ងៃទី: 16 Jun 2026\n\n⚠️ ស្ថានភាព: មកយឺត\n⏳ យឺតចំនួន: 34m 59s', NULL, NULL, NULL, 'sent', 0, '2026-06-16 09:35:02', '2026-06-16 09:35:02', '2026-06-16 09:35:02'),
(661, 3, NULL, 'late_private', NULL, '⚠️ <b>ជូនដំណឹងមកយឺត</b>\n\n👤 បុគ្គលិក: Po Tilino\n🆔 លេខសម្គាល់: DSI003\n🕘 ម៉ោងចូល: 09:34 AM\n⏳ យឺតចំនួន: 34m 59s\n💰 កាត់ប្រាក់: $1.50\n\nស្ថានភាព: មកយឺត', NULL, NULL, NULL, 'sent', 0, '2026-06-16 09:35:05', '2026-06-16 09:35:05', '2026-06-16 09:35:05'),
(662, 17, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 09:38 AM\n📅 ថ្ងៃទី: 16 Jun 2026\n\n⚠️ ស្ថានភាព: មកយឺត\n⏳ យឺតចំនួន: 38m 17s', NULL, NULL, NULL, 'sent', 0, '2026-06-16 09:38:21', '2026-06-16 09:38:21', '2026-06-16 09:38:21'),
(663, 17, NULL, 'late_private', NULL, '⚠️ <b>ជូនដំណឹងមកយឺត</b>\n\n👤 បុគ្គលិក: Phal Panha\n🆔 លេខសម្គាល់: DL002\n🕘 ម៉ោងចូល: 09:38 AM\n⏳ យឺតចំនួន: 38m 17s\n💰 កាត់ប្រាក់: $0.00\n\nស្ថានភាព: មកយឺត', NULL, NULL, NULL, 'sent', 0, '2026-06-16 09:38:23', '2026-06-16 09:38:23', '2026-06-16 09:38:23'),
(664, 1, NULL, 'permission_request_admin_private', NULL, '📄 <b>NEW PERMISSION REQUEST</b>\n\n👤 <b>Employee:</b> Gak Vicheka\n📌 <b>Type:</b> Late Check In\n📅 <b>Duration:</b> 16 Jun 2026 15:00 - 17:00 (2.00 hour(s))\n📝 <b>Reason:</b> មានទៅក្រៅធុរក្រៅ\n\n⏳ <b>Status:</b> Pending Approval', NULL, NULL, NULL, 'sent', 0, '2026-06-16 09:42:18', '2026-06-16 09:42:18', '2026-06-16 09:42:18'),
(665, 6, NULL, 'permission_request_submitted_private', NULL, '📄 <b>Your permission request was submitted</b>\n\n<b>Request:</b> PR-2026-0009\n<b>Type:</b> Late Check In\n<b>Duration:</b> 16 Jun 2026 15:00 - 17:00 (2.00 hour(s))\n<b>Reason:</b> មានទៅក្រៅធុរក្រៅ\n\n⏳ <b>Status:</b> Pending Approval', NULL, NULL, NULL, 'failed', 0, NULL, '2026-06-16 09:42:19', '2026-06-16 09:42:19'),
(666, 21, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 09:44 AM\n📅 ថ្ងៃទី: 16 Jun 2026\n\n⚠️ ស្ថានភាព: មកយឺត\n⏳ យឺតចំនួន: 44m 33s', NULL, NULL, NULL, 'sent', 0, '2026-06-16 09:44:36', '2026-06-16 09:44:36', '2026-06-16 09:44:36'),
(667, 21, NULL, 'late_private', NULL, '⚠️ <b>ជូនដំណឹងមកយឺត</b>\n\n👤 បុគ្គលិក: Van\n🆔 លេខសម្គាល់: DL003\n🕘 ម៉ោងចូល: 09:44 AM\n⏳ យឺតចំនួន: 44m 33s\n💰 កាត់ប្រាក់: $0.00\n\nស្ថានភាព: មកយឺត', NULL, NULL, NULL, 'sent', 0, '2026-06-16 09:44:38', '2026-06-16 09:44:38', '2026-06-16 09:44:38'),
(668, 12, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 09:48 AM\n📅 ថ្ងៃទី: 16 Jun 2026\n\n⚠️ ស្ថានភាព: មកយឺត\n⏳ យឺតចំនួន: 48m 17s', NULL, NULL, NULL, 'sent', 0, '2026-06-16 09:48:21', '2026-06-16 09:48:21', '2026-06-16 09:48:21'),
(669, 12, NULL, 'late_private', NULL, '⚠️ <b>ជូនដំណឹងមកយឺត</b>\n\n👤 បុគ្គលិក: Chu Kimhorng\n🆔 លេខសម្គាល់: ACC005\n🕘 ម៉ោងចូល: 09:48 AM\n⏳ យឺតចំនួន: 48m 17s\n💰 កាត់ប្រាក់: $1.50\n\nស្ថានភាព: មកយឺត', NULL, NULL, NULL, 'sent', 0, '2026-06-16 09:48:24', '2026-06-16 09:48:24', '2026-06-16 09:48:24'),
(670, 13, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 09:48 AM\n📅 ថ្ងៃទី: 16 Jun 2026\n\n⚠️ ស្ថានភាព: មកយឺត\n⏳ យឺតចំនួន: 48m 57s', NULL, NULL, NULL, 'sent', 0, '2026-06-16 09:49:01', '2026-06-16 09:49:01', '2026-06-16 09:49:01'),
(671, 13, NULL, 'late_private', NULL, '⚠️ <b>ជូនដំណឹងមកយឺត</b>\n\n👤 បុគ្គលិក: Chean Aleav\n🆔 លេខសម្គាល់: ACC003\n🕘 ម៉ោងចូល: 09:48 AM\n⏳ យឺតចំនួន: 48m 57s\n💰 កាត់ប្រាក់: $1.50\n\nស្ថានភាព: មកយឺត', NULL, NULL, NULL, 'sent', 0, '2026-06-16 09:49:05', '2026-06-16 09:49:05', '2026-06-16 09:49:05'),
(672, 4, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 11:30 AM\n📅 ថ្ងៃទី: 16 Jun 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-06-16 11:30:30', '2026-06-16 11:30:30', '2026-06-16 11:30:30'),
(673, 4, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 11:30 AM\n🕘 ចេញម៉ោង: 05:34 PM\n📅 ថ្ងៃទី: 16 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 06h 03m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-16 17:34:22', '2026-06-16 17:34:22', '2026-06-16 17:34:22'),
(674, 16, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 08:21 AM\n🕘 ចេញម៉ោង: 05:48 PM\n📅 ថ្ងៃទី: 16 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 09h 26m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-16 17:48:32', '2026-06-16 17:48:32', '2026-06-16 17:48:32'),
(675, 8, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 08:25 AM\n🕘 ចេញម៉ោង: 05:50 PM\n📅 ថ្ងៃទី: 16 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 09h 25m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-16 17:50:27', '2026-06-16 17:50:27', '2026-06-16 17:50:27'),
(676, 5, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 09:18 AM\n🕘 ចេញម៉ោង: 05:52 PM\n📅 ថ្ងៃទី: 16 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 08h 33m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-16 17:52:39', '2026-06-16 17:52:39', '2026-06-16 17:52:39'),
(677, 21, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 09:44 AM\n🕘 ចេញម៉ោង: 06:08 PM\n📅 ថ្ងៃទី: 16 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 08h 23m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-16 18:08:18', '2026-06-16 18:08:18', '2026-06-16 18:08:18'),
(678, 14, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 08:51 AM\n🕘 ចេញម៉ោង: 06:11 PM\n📅 ថ្ងៃទី: 16 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 09h 20m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-16 18:11:39', '2026-06-16 18:11:39', '2026-06-16 18:11:39'),
(679, 3, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 09:34 AM\n🕘 ចេញម៉ោង: 06:12 PM\n📅 ថ្ងៃទី: 16 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 08h 37m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-16 18:12:08', '2026-06-16 18:12:08', '2026-06-16 18:12:08'),
(680, 13, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 09:48 AM\n🕘 ចេញម៉ោង: 08:38 PM\n📅 ថ្ងៃទី: 16 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 10h 49m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-16 20:38:32', '2026-06-16 20:38:32', '2026-06-16 20:38:32'),
(681, 12, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 09:48 AM\n🕘 ចេញម៉ោង: 08:39 PM\n📅 ថ្ងៃទី: 16 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 10h 51m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-16 20:39:32', '2026-06-16 20:39:32', '2026-06-16 20:39:32'),
(682, 9, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 08:37 AM\n🕘 ចេញម៉ោង: 08:42 PM\n📅 ថ្ងៃទី: 16 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 12h 05m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-16 20:42:44', '2026-06-16 20:42:44', '2026-06-16 20:42:44'),
(683, 8, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:26 AM\n📅 ថ្ងៃទី: 17 Jun 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-06-17 08:26:36', '2026-06-17 08:26:36', '2026-06-17 08:26:36'),
(684, 16, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:31 AM\n📅 ថ្ងៃទី: 17 Jun 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-06-17 08:31:42', '2026-06-17 08:31:42', '2026-06-17 08:31:42'),
(685, 9, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:33 AM\n📅 ថ្ងៃទី: 17 Jun 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-06-17 08:33:19', '2026-06-17 08:33:19', '2026-06-17 08:33:19'),
(686, 14, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:47 AM\n📅 ថ្ងៃទី: 17 Jun 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-06-17 08:47:29', '2026-06-17 08:47:29', '2026-06-17 08:47:29'),
(687, 15, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:56 AM\n📅 ថ្ងៃទី: 17 Jun 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'failed', 0, NULL, '2026-06-17 08:56:04', '2026-06-17 08:56:04'),
(688, 17, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 09:13 AM\n📅 ថ្ងៃទី: 17 Jun 2026\n\n⚠️ ស្ថានភាព: មកយឺត\n⏳ យឺតចំនួន: 13m 39s', NULL, NULL, NULL, 'sent', 0, '2026-06-17 09:13:43', '2026-06-17 09:13:43', '2026-06-17 09:13:43'),
(689, 17, NULL, 'late_private', NULL, '⚠️ <b>ជូនដំណឹងមកយឺត</b>\n\n👤 បុគ្គលិក: Phal Panha\n🆔 លេខសម្គាល់: DL002\n🕘 ម៉ោងចូល: 09:13 AM\n⏳ យឺតចំនួន: 13m 39s\n💰 កាត់ប្រាក់: $0.00\n\nស្ថានភាព: មកយឺត', NULL, NULL, NULL, 'sent', 0, '2026-06-17 09:13:45', '2026-06-17 09:13:45', '2026-06-17 09:13:45'),
(690, 5, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 09:13 AM\n📅 ថ្ងៃទី: 17 Jun 2026\n\n⚠️ ស្ថានភាព: មកយឺត\n⏳ យឺតចំនួន: 13m 57s', NULL, NULL, NULL, 'sent', 0, '2026-06-17 09:14:00', '2026-06-17 09:14:00', '2026-06-17 09:14:00'),
(691, 5, NULL, 'late_private', NULL, '⚠️ <b>ជូនដំណឹងមកយឺត</b>\n\n👤 បុគ្គលិក: Sorn Pugnavan\n🆔 លេខសម្គាល់: MK002\n🕘 ម៉ោងចូល: 09:13 AM\n⏳ យឺតចំនួន: 13m 57s\n💰 កាត់ប្រាក់: $0.00\n\nស្ថានភាព: មកយឺត', NULL, NULL, NULL, 'sent', 0, '2026-06-17 09:14:04', '2026-06-17 09:14:04', '2026-06-17 09:14:04'),
(692, 21, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 09:16 AM\n📅 ថ្ងៃទី: 17 Jun 2026\n\n⚠️ ស្ថានភាព: មកយឺត\n⏳ យឺតចំនួន: 16m 51s', NULL, NULL, NULL, 'sent', 0, '2026-06-17 09:16:54', '2026-06-17 09:16:54', '2026-06-17 09:16:54'),
(693, 21, NULL, 'late_private', NULL, '⚠️ <b>ជូនដំណឹងមកយឺត</b>\n\n👤 បុគ្គលិក: Van\n🆔 លេខសម្គាល់: DL003\n🕘 ម៉ោងចូល: 09:16 AM\n⏳ យឺតចំនួន: 16m 51s\n💰 កាត់ប្រាក់: $0.00\n\nស្ថានភាព: មកយឺត', NULL, NULL, NULL, 'sent', 0, '2026-06-17 09:16:56', '2026-06-17 09:16:56', '2026-06-17 09:16:56'),
(694, 6, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 09:26 AM\n📅 ថ្ងៃទី: 17 Jun 2026\n\n⚠️ ស្ថានភាព: មកយឺត\n⏳ យឺតចំនួន: 26m 43s', NULL, NULL, NULL, 'failed', 0, NULL, '2026-06-17 09:26:47', '2026-06-17 09:26:47'),
(695, 6, NULL, 'late_private', NULL, '⚠️ <b>ជូនដំណឹងមកយឺត</b>\n\n👤 បុគ្គលិក: Gak Vicheka\n🆔 លេខសម្គាល់: DSI004\n🕘 ម៉ោងចូល: 09:26 AM\n⏳ យឺតចំនួន: 26m 43s\n💰 កាត់ប្រាក់: $0.00\n\nស្ថានភាព: មកយឺត', NULL, NULL, NULL, 'failed', 0, NULL, '2026-06-17 09:26:49', '2026-06-17 09:26:49'),
(696, 3, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 09:27 AM\n📅 ថ្ងៃទី: 17 Jun 2026\n\n⚠️ ស្ថានភាព: មកយឺត\n⏳ យឺតចំនួន: 27m 31s', NULL, NULL, NULL, 'sent', 0, '2026-06-17 09:27:34', '2026-06-17 09:27:34', '2026-06-17 09:27:34'),
(697, 3, NULL, 'late_private', NULL, '⚠️ <b>ជូនដំណឹងមកយឺត</b>\n\n👤 បុគ្គលិក: Po Tilino\n🆔 លេខសម្គាល់: DSI003\n🕘 ម៉ោងចូល: 09:27 AM\n⏳ យឺតចំនួន: 27m 31s\n💰 កាត់ប្រាក់: $0.00\n\nស្ថានភាព: មកយឺត', NULL, NULL, NULL, 'sent', 0, '2026-06-17 09:27:36', '2026-06-17 09:27:36', '2026-06-17 09:27:36'),
(698, 13, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 09:35 AM\n📅 ថ្ងៃទី: 17 Jun 2026\n\n⚠️ ស្ថានភាព: មកយឺត\n⏳ យឺតចំនួន: 35m 56s', NULL, NULL, NULL, 'sent', 0, '2026-06-17 09:36:00', '2026-06-17 09:36:00', '2026-06-17 09:36:00'),
(699, 13, NULL, 'late_private', NULL, '⚠️ <b>ជូនដំណឹងមកយឺត</b>\n\n👤 បុគ្គលិក: Chean Aleav\n🆔 លេខសម្គាល់: ACC003\n🕘 ម៉ោងចូល: 09:35 AM\n⏳ យឺតចំនួន: 35m 56s\n💰 កាត់ប្រាក់: $1.50\n\nស្ថានភាព: មកយឺត', NULL, NULL, NULL, 'sent', 0, '2026-06-17 09:36:02', '2026-06-17 09:36:02', '2026-06-17 09:36:02'),
(700, 12, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 09:42 AM\n📅 ថ្ងៃទី: 17 Jun 2026\n\n⚠️ ស្ថានភាព: មកយឺត\n⏳ យឺតចំនួន: 42m 20s', NULL, NULL, NULL, 'sent', 0, '2026-06-17 09:42:24', '2026-06-17 09:42:24', '2026-06-17 09:42:24'),
(701, 12, NULL, 'late_private', NULL, '⚠️ <b>ជូនដំណឹងមកយឺត</b>\n\n👤 បុគ្គលិក: Chu Kimhorng\n🆔 លេខសម្គាល់: ACC005\n🕘 ម៉ោងចូល: 09:42 AM\n⏳ យឺតចំនួន: 42m 20s\n💰 កាត់ប្រាក់: $1.50\n\nស្ថានភាព: មកយឺត', NULL, NULL, NULL, 'sent', 0, '2026-06-17 09:42:26', '2026-06-17 09:42:26', '2026-06-17 09:42:26'),
(702, 1, NULL, 'permission_request_admin_private', NULL, '📄 <b>NEW PERMISSION REQUEST</b>\n\n👤 <b>Employee:</b> Tha Sopheak\n📌 <b>Type:</b> Late Check In\n📅 <b>Duration:</b> 17 Jun 2026 11:47 - 12:47 (1.00 hour(s))\n📝 <b>Reason:</b> Dear Boss, I would like to request a day off today due to a personal matter. Thank you for your understanding.\n\n⏳ <b>Status:</b> Pending Approval', NULL, NULL, NULL, 'sent', 0, '2026-06-17 11:47:19', '2026-06-17 11:47:19', '2026-06-17 11:47:19'),
(703, 4, NULL, 'permission_request_submitted_private', NULL, '📄 <b>Your permission request was submitted</b>\n\n<b>Request:</b> PR-2026-0010\n<b>Type:</b> Late Check In\n<b>Duration:</b> 17 Jun 2026 11:47 - 12:47 (1.00 hour(s))\n<b>Reason:</b> Dear Boss, I would like to request a day off today due to a personal matter. Thank you for your understanding.\n\n⏳ <b>Status:</b> Pending Approval', NULL, NULL, NULL, 'sent', 0, '2026-06-17 11:47:20', '2026-06-17 11:47:20', '2026-06-17 11:47:20'),
(704, 6, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 09:26 AM\n🕘 ចេញម៉ោង: 05:00 PM\n📅 ថ្ងៃទី: 17 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 07h 33m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'failed', 0, NULL, '2026-06-17 17:00:32', '2026-06-17 17:00:32'),
(705, 5, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 09:13 AM\n🕘 ចេញម៉ោង: 05:00 PM\n📅 ថ្ងៃទី: 17 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 07h 46m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-17 17:00:32', '2026-06-17 17:00:32', '2026-06-17 17:00:32'),
(706, 16, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 08:31 AM\n🕘 ចេញម៉ោង: 05:01 PM\n📅 ថ្ងៃទី: 17 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 08h 30m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-17 17:01:53', '2026-06-17 17:01:53', '2026-06-17 17:01:53'),
(707, 3, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 09:27 AM\n🕘 ចេញម៉ោង: 05:11 PM\n📅 ថ្ងៃទី: 17 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 07h 43m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-17 17:11:29', '2026-06-17 17:11:29', '2026-06-17 17:11:29'),
(708, 15, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 08:56 AM\n🕘 ចេញម៉ោង: 06:11 PM\n📅 ថ្ងៃទី: 17 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 09h 15m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'failed', 0, NULL, '2026-06-17 18:11:44', '2026-06-17 18:11:44'),
(709, 14, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 08:47 AM\n🕘 ចេញម៉ោង: 06:12 PM\n📅 ថ្ងៃទី: 17 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 09h 24m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-17 18:12:07', '2026-06-17 18:12:07', '2026-06-17 18:12:07'),
(710, 8, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 08:26 AM\n🕘 ចេញម៉ោង: 06:38 PM\n📅 ថ្ងៃទី: 17 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 10h 11m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-17 18:38:15', '2026-06-17 18:38:15', '2026-06-17 18:38:15'),
(711, 9, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 08:33 AM\n🕘 ចេញម៉ោង: 06:57 PM\n📅 ថ្ងៃទី: 17 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 10h 24m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-17 18:57:36', '2026-06-17 18:57:36', '2026-06-17 18:57:36'),
(712, 13, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 09:35 AM\n🕘 ចេញម៉ោង: 07:00 PM\n📅 ថ្ងៃទី: 17 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 09h 24m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-17 19:00:49', '2026-06-17 19:00:49', '2026-06-17 19:00:49'),
(713, 12, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 09:42 AM\n🕘 ចេញម៉ោង: 07:02 PM\n📅 ថ្ងៃទី: 17 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 09h 20m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-17 19:02:26', '2026-06-17 19:02:26', '2026-06-17 19:02:26'),
(714, 9, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:18 AM\n📅 ថ្ងៃទី: 18 Jun 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-06-18 08:18:44', '2026-06-18 08:18:44', '2026-06-18 08:18:44'),
(715, 16, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:33 AM\n📅 ថ្ងៃទី: 18 Jun 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-06-18 08:33:41', '2026-06-18 08:33:41', '2026-06-18 08:33:41'),
(716, 15, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:56 AM\n📅 ថ្ងៃទី: 18 Jun 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'failed', 0, NULL, '2026-06-18 08:56:15', '2026-06-18 08:56:15'),
(717, 13, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 09:04 AM\n📅 ថ្ងៃទី: 18 Jun 2026\n\n⚠️ ស្ថានភាព: មកយឺត\n⏳ យឺតចំនួន: 4m 51s', NULL, NULL, NULL, 'sent', 0, '2026-06-18 09:04:55', '2026-06-18 09:04:55', '2026-06-18 09:04:55'),
(718, 13, NULL, 'late_private', NULL, '⚠️ <b>ជូនដំណឹងមកយឺត</b>\n\n👤 បុគ្គលិក: Chean Aleav\n🆔 លេខសម្គាល់: ACC003\n🕘 ម៉ោងចូល: 09:04 AM\n⏳ យឺតចំនួន: 4m 51s\n💰 កាត់ប្រាក់: $0.00\n\nស្ថានភាព: មកយឺត', NULL, NULL, NULL, 'sent', 0, '2026-06-18 09:04:57', '2026-06-18 09:04:57', '2026-06-18 09:04:57'),
(719, 12, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 09:05 AM\n📅 ថ្ងៃទី: 18 Jun 2026\n\n⚠️ ស្ថានភាព: មកយឺត\n⏳ យឺតចំនួន: 5m 4s', NULL, NULL, NULL, 'sent', 0, '2026-06-18 09:05:08', '2026-06-18 09:05:08', '2026-06-18 09:05:08'),
(720, 12, NULL, 'late_private', NULL, '⚠️ <b>ជូនដំណឹងមកយឺត</b>\n\n👤 បុគ្គលិក: Chu Kimhorng\n🆔 លេខសម្គាល់: ACC005\n🕘 ម៉ោងចូល: 09:05 AM\n⏳ យឺតចំនួន: 5m 4s\n💰 កាត់ប្រាក់: $0.00\n\nស្ថានភាព: មកយឺត', NULL, NULL, NULL, 'sent', 0, '2026-06-18 09:05:10', '2026-06-18 09:05:10', '2026-06-18 09:05:10'),
(721, 14, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 09:09 AM\n📅 ថ្ងៃទី: 18 Jun 2026\n\n⚠️ ស្ថានភាព: មកយឺត\n⏳ យឺតចំនួន: 9m 37s', NULL, NULL, NULL, 'sent', 0, '2026-06-18 09:09:41', '2026-06-18 09:09:41', '2026-06-18 09:09:41'),
(722, 14, NULL, 'late_private', NULL, '⚠️ <b>ជូនដំណឹងមកយឺត</b>\n\n👤 បុគ្គលិក: Outh Kimnai\n🆔 លេខសម្គាល់: MK001\n🕘 ម៉ោងចូល: 09:09 AM\n⏳ យឺតចំនួន: 9m 37s\n💰 កាត់ប្រាក់: $0.00\n\nស្ថានភាព: មកយឺត', NULL, NULL, NULL, 'sent', 0, '2026-06-18 09:09:44', '2026-06-18 09:09:44', '2026-06-18 09:09:44'),
(723, 6, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 09:16 AM\n📅 ថ្ងៃទី: 18 Jun 2026\n\n⚠️ ស្ថានភាព: មកយឺត\n⏳ យឺតចំនួន: 16m 20s', NULL, NULL, NULL, 'failed', 0, NULL, '2026-06-18 09:16:23', '2026-06-18 09:16:23'),
(724, 6, NULL, 'late_private', NULL, '⚠️ <b>ជូនដំណឹងមកយឺត</b>\n\n👤 បុគ្គលិក: Gak Vicheka\n🆔 លេខសម្គាល់: DSI004\n🕘 ម៉ោងចូល: 09:16 AM\n⏳ យឺតចំនួន: 16m 20s\n💰 កាត់ប្រាក់: $0.00\n\nស្ថានភាព: មកយឺត', NULL, NULL, NULL, 'failed', 0, NULL, '2026-06-18 09:16:25', '2026-06-18 09:16:25'),
(725, 3, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 09:27 AM\n📅 ថ្ងៃទី: 18 Jun 2026\n\n⚠️ ស្ថានភាព: មកយឺត\n⏳ យឺតចំនួន: 27m 25s', NULL, NULL, NULL, 'sent', 0, '2026-06-18 09:27:29', '2026-06-18 09:27:29', '2026-06-18 09:27:29'),
(726, 3, NULL, 'late_private', NULL, '⚠️ <b>ជូនដំណឹងមកយឺត</b>\n\n👤 បុគ្គលិក: Po Tilino\n🆔 លេខសម្គាល់: DSI003\n🕘 ម៉ោងចូល: 09:27 AM\n⏳ យឺតចំនួន: 27m 25s\n💰 កាត់ប្រាក់: $0.00\n\nស្ថានភាព: មកយឺត', NULL, NULL, NULL, 'sent', 0, '2026-06-18 09:27:30', '2026-06-18 09:27:30', '2026-06-18 09:27:30'),
(727, 17, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 10:29 AM\n📅 ថ្ងៃទី: 18 Jun 2026\n\n⚠️ ស្ថានភាព: មកយឺត\n⏳ យឺតចំនួន: 1h 29m 53s', NULL, NULL, NULL, 'sent', 0, '2026-06-18 10:29:57', '2026-06-18 10:29:57', '2026-06-18 10:29:57'),
(728, 17, NULL, 'late_private', NULL, '⚠️ <b>ជូនដំណឹងមកយឺត</b>\n\n👤 បុគ្គលិក: Phal Panha\n🆔 លេខសម្គាល់: DL002\n🕘 ម៉ោងចូល: 10:29 AM\n⏳ យឺតចំនួន: 1h 29m 53s\n💰 កាត់ប្រាក់: $0.00\n\nស្ថានភាព: មកយឺត', NULL, NULL, NULL, 'sent', 0, '2026-06-18 10:29:59', '2026-06-18 10:29:59', '2026-06-18 10:29:59'),
(729, 21, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 10:47 AM\n📅 ថ្ងៃទី: 18 Jun 2026\n\n⚠️ ស្ថានភាព: មកយឺត\n⏳ យឺតចំនួន: 1h 47m 31s', NULL, NULL, NULL, 'sent', 0, '2026-06-18 10:47:35', '2026-06-18 10:47:35', '2026-06-18 10:47:35'),
(730, 21, NULL, 'late_private', NULL, '⚠️ <b>ជូនដំណឹងមកយឺត</b>\n\n👤 បុគ្គលិក: Van\n🆔 លេខសម្គាល់: DL003\n🕘 ម៉ោងចូល: 10:47 AM\n⏳ យឺតចំនួន: 1h 47m 31s\n💰 កាត់ប្រាក់: $0.00\n\nស្ថានភាព: មកយឺត', NULL, NULL, NULL, 'sent', 0, '2026-06-18 10:47:37', '2026-06-18 10:47:37', '2026-06-18 10:47:37'),
(731, 6, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 09:16 AM\n🕘 ចេញម៉ោង: 05:02 PM\n📅 ថ្ងៃទី: 18 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 07h 46m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'failed', 0, NULL, '2026-06-18 17:02:31', '2026-06-18 17:02:31'),
(732, 16, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 08:33 AM\n🕘 ចេញម៉ោង: 05:03 PM\n📅 ថ្ងៃទី: 18 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 08h 29m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-18 17:03:10', '2026-06-18 17:03:10', '2026-06-18 17:03:10'),
(733, 3, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 09:27 AM\n🕘 ចេញម៉ោង: 05:13 PM\n📅 ថ្ងៃទី: 18 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 07h 46m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-18 17:13:54', '2026-06-18 17:13:54', '2026-06-18 17:13:54'),
(734, 15, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 08:56 AM\n🕘 ចេញម៉ោង: 05:16 PM\n📅 ថ្ងៃទី: 18 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 08h 20m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'failed', 0, NULL, '2026-06-18 17:16:51', '2026-06-18 17:16:51'),
(735, 14, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 09:09 AM\n🕘 ចេញម៉ោង: 06:22 PM\n📅 ថ្ងៃទី: 18 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 09h 12m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-18 18:22:07', '2026-06-18 18:22:07', '2026-06-18 18:22:07'),
(736, 9, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 08:18 AM\n🕘 ចេញម៉ោង: 06:44 PM\n📅 ថ្ងៃទី: 18 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 10h 25m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-18 18:44:37', '2026-06-18 18:44:37', '2026-06-18 18:44:37'),
(737, 13, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 09:04 AM\n🕘 ចេញម៉ោង: 06:46 PM\n📅 ថ្ងៃទី: 18 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 09h 41m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-18 18:46:24', '2026-06-18 18:46:24', '2026-06-18 18:46:24'),
(738, 12, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 09:05 AM\n🕘 ចេញម៉ោង: 06:50 PM\n📅 ថ្ងៃទី: 18 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 09h 45m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-18 18:50:46', '2026-06-18 18:50:46', '2026-06-18 18:50:46'),
(739, 21, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 10:47 AM\n🕘 ចេញម៉ោង: 07:05 PM\n📅 ថ្ងៃទី: 18 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 08h 17m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-18 19:05:13', '2026-06-18 19:05:13', '2026-06-18 19:05:13'),
(740, 16, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:15 AM\n📅 ថ្ងៃទី: 19 Jun 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-06-19 08:15:54', '2026-06-19 08:15:54', '2026-06-19 08:15:54'),
(741, 8, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:20 AM\n📅 ថ្ងៃទី: 19 Jun 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-06-19 08:20:10', '2026-06-19 08:20:10', '2026-06-19 08:20:10');
INSERT INTO `telegram_logs` (`id`, `employee_id`, `customer_visit_id`, `message_type`, `event_key`, `telegram_message`, `selfie_url`, `store_photo_url`, `error_message`, `status`, `attempts`, `sent_at`, `created_at`, `updated_at`) VALUES
(742, 9, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:24 AM\n📅 ថ្ងៃទី: 19 Jun 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-06-19 08:24:35', '2026-06-19 08:24:35', '2026-06-19 08:24:35'),
(743, 15, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:54 AM\n📅 ថ្ងៃទី: 19 Jun 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'failed', 0, NULL, '2026-06-19 08:54:21', '2026-06-19 08:54:21'),
(744, 12, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:54 AM\n📅 ថ្ងៃទី: 19 Jun 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-06-19 08:54:41', '2026-06-19 08:54:41', '2026-06-19 08:54:41'),
(745, 14, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:59 AM\n📅 ថ្ងៃទី: 19 Jun 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-06-19 08:59:38', '2026-06-19 08:59:38', '2026-06-19 08:59:38'),
(746, 13, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 09:08 AM\n📅 ថ្ងៃទី: 19 Jun 2026\n\n⚠️ ស្ថានភាព: មកយឺត\n⏳ យឺតចំនួន: 8m 16s', NULL, NULL, NULL, 'sent', 0, '2026-06-19 09:08:20', '2026-06-19 09:08:20', '2026-06-19 09:08:20'),
(747, 13, NULL, 'late_private', NULL, '⚠️ <b>ជូនដំណឹងមកយឺត</b>\n\n👤 បុគ្គលិក: Chean Aleav\n🆔 លេខសម្គាល់: ACC003\n🕘 ម៉ោងចូល: 09:08 AM\n⏳ យឺតចំនួន: 8m 16s\n💰 កាត់ប្រាក់: $0.00\n\nស្ថានភាព: មកយឺត', NULL, NULL, NULL, 'sent', 0, '2026-06-19 09:08:22', '2026-06-19 09:08:22', '2026-06-19 09:08:22'),
(748, 21, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 09:11 AM\n📅 ថ្ងៃទី: 19 Jun 2026\n\n⚠️ ស្ថានភាព: មកយឺត\n⏳ យឺតចំនួន: 11m 58s', NULL, NULL, NULL, 'sent', 0, '2026-06-19 09:12:01', '2026-06-19 09:12:01', '2026-06-19 09:12:01'),
(749, 21, NULL, 'late_private', NULL, '⚠️ <b>ជូនដំណឹងមកយឺត</b>\n\n👤 បុគ្គលិក: Van\n🆔 លេខសម្គាល់: DL003\n🕘 ម៉ោងចូល: 09:11 AM\n⏳ យឺតចំនួន: 11m 58s\n💰 កាត់ប្រាក់: $0.00\n\nស្ថានភាព: មកយឺត', NULL, NULL, NULL, 'sent', 0, '2026-06-19 09:12:03', '2026-06-19 09:12:03', '2026-06-19 09:12:03'),
(750, 5, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 09:16 AM\n📅 ថ្ងៃទី: 19 Jun 2026\n\n⚠️ ស្ថានភាព: មកយឺត\n⏳ យឺតចំនួន: 16m 51s', NULL, NULL, NULL, 'sent', 0, '2026-06-19 09:16:55', '2026-06-19 09:16:55', '2026-06-19 09:16:55'),
(751, 5, NULL, 'late_private', NULL, '⚠️ <b>ជូនដំណឹងមកយឺត</b>\n\n👤 បុគ្គលិក: Sorn Pugnavan\n🆔 លេខសម្គាល់: MK002\n🕘 ម៉ោងចូល: 09:16 AM\n⏳ យឺតចំនួន: 16m 51s\n💰 កាត់ប្រាក់: $0.00\n\nស្ថានភាព: មកយឺត', NULL, NULL, NULL, 'sent', 0, '2026-06-19 09:16:56', '2026-06-19 09:16:56', '2026-06-19 09:16:56'),
(752, 6, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 09:33 AM\n📅 ថ្ងៃទី: 19 Jun 2026\n\n⚠️ ស្ថានភាព: មកយឺត\n⏳ យឺតចំនួន: 33m 44s', NULL, NULL, NULL, 'failed', 0, NULL, '2026-06-19 09:33:47', '2026-06-19 09:33:47'),
(753, 6, NULL, 'late_private', NULL, '⚠️ <b>ជូនដំណឹងមកយឺត</b>\n\n👤 បុគ្គលិក: Gak Vicheka\n🆔 លេខសម្គាល់: DSI004\n🕘 ម៉ោងចូល: 09:33 AM\n⏳ យឺតចំនួន: 33m 44s\n💰 កាត់ប្រាក់: $1.50\n\nស្ថានភាព: មកយឺត', NULL, NULL, NULL, 'failed', 0, NULL, '2026-06-19 09:33:50', '2026-06-19 09:33:50'),
(754, 3, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 09:37 AM\n📅 ថ្ងៃទី: 19 Jun 2026\n\n⚠️ ស្ថានភាព: មកយឺត\n⏳ យឺតចំនួន: 37m 37s', NULL, NULL, NULL, 'sent', 0, '2026-06-19 09:37:41', '2026-06-19 09:37:41', '2026-06-19 09:37:41'),
(755, 3, NULL, 'late_private', NULL, '⚠️ <b>ជូនដំណឹងមកយឺត</b>\n\n👤 បុគ្គលិក: Po Tilino\n🆔 លេខសម្គាល់: DSI003\n🕘 ម៉ោងចូល: 09:37 AM\n⏳ យឺតចំនួន: 37m 37s\n💰 កាត់ប្រាក់: $1.50\n\nស្ថានភាព: មកយឺត', NULL, NULL, NULL, 'sent', 0, '2026-06-19 09:37:45', '2026-06-19 09:37:45', '2026-06-19 09:37:45'),
(756, 4, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 11:28 AM\n📅 ថ្ងៃទី: 19 Jun 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-06-19 11:28:39', '2026-06-19 11:28:39', '2026-06-19 11:28:39'),
(757, 6, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 09:33 AM\n🕘 ចេញម៉ោង: 05:01 PM\n📅 ថ្ងៃទី: 19 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 07h 27m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'failed', 0, NULL, '2026-06-19 17:01:36', '2026-06-19 17:01:36'),
(758, 5, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 09:16 AM\n🕘 ចេញម៉ោង: 05:07 PM\n📅 ថ្ងៃទី: 19 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 07h 50m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-19 17:07:10', '2026-06-19 17:07:10', '2026-06-19 17:07:10'),
(759, 16, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 08:15 AM\n🕘 ចេញម៉ោង: 05:07 PM\n📅 ថ្ងៃទី: 19 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 08h 51m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-19 17:07:37', '2026-06-19 17:07:37', '2026-06-19 17:07:37'),
(760, 3, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 09:37 AM\n🕘 ចេញម៉ោង: 05:25 PM\n📅 ថ្ងៃទី: 19 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 07h 48m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-19 17:25:55', '2026-06-19 17:25:55', '2026-06-19 17:25:55'),
(761, 14, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 08:59 AM\n🕘 ចេញម៉ោង: 05:26 PM\n📅 ថ្ងៃទី: 19 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 08h 26m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-19 17:26:20', '2026-06-19 17:26:20', '2026-06-19 17:26:20'),
(762, 15, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 08:54 AM\n🕘 ចេញម៉ោង: 05:26 PM\n📅 ថ្ងៃទី: 19 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 08h 32m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'failed', 0, NULL, '2026-06-19 17:26:41', '2026-06-19 17:26:41'),
(763, 8, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 08:20 AM\n🕘 ចេញម៉ោង: 05:36 PM\n📅 ថ្ងៃទី: 19 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 09h 16m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-19 17:36:44', '2026-06-19 17:36:44', '2026-06-19 17:36:44'),
(764, 12, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 08:54 AM\n🕘 ចេញម៉ោង: 06:38 PM\n📅 ថ្ងៃទី: 19 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 09h 43m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-19 18:38:34', '2026-06-19 18:38:34', '2026-06-19 18:38:34'),
(765, 9, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 08:24 AM\n🕘 ចេញម៉ោង: 06:38 PM\n📅 ថ្ងៃទី: 19 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 10h 14m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-19 18:38:40', '2026-06-19 18:38:40', '2026-06-19 18:38:40'),
(766, 13, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 09:08 AM\n🕘 ចេញម៉ោង: 06:39 PM\n📅 ថ្ងៃទី: 19 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 09h 30m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-19 18:39:07', '2026-06-19 18:39:07', '2026-06-19 18:39:07'),
(767, 16, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:09 AM\n📅 ថ្ងៃទី: 20 Jun 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-06-20 08:09:15', '2026-06-20 08:09:15', '2026-06-20 08:09:15'),
(768, 8, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:21 AM\n📅 ថ្ងៃទី: 20 Jun 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-06-20 08:21:13', '2026-06-20 08:21:13', '2026-06-20 08:21:13'),
(769, 14, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:51 AM\n📅 ថ្ងៃទី: 20 Jun 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-06-20 08:51:30', '2026-06-20 08:51:30', '2026-06-20 08:51:30'),
(770, 4, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 09:04 AM\n📅 ថ្ងៃទី: 20 Jun 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-06-20 09:04:31', '2026-06-20 09:04:31', '2026-06-20 09:04:31'),
(771, 5, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 09:20 AM\n📅 ថ្ងៃទី: 20 Jun 2026\n\n⚠️ ស្ថានភាព: មកយឺត\n⏳ យឺតចំនួន: 20m 21s', NULL, NULL, NULL, 'sent', 0, '2026-06-20 09:20:25', '2026-06-20 09:20:25', '2026-06-20 09:20:25'),
(772, 5, NULL, 'late_private', NULL, '⚠️ <b>ជូនដំណឹងមកយឺត</b>\n\n👤 បុគ្គលិក: Sorn Pugnavan\n🆔 លេខសម្គាល់: MK002\n🕘 ម៉ោងចូល: 09:20 AM\n⏳ យឺតចំនួន: 20m 21s\n💰 កាត់ប្រាក់: $0.00\n\nស្ថានភាព: មកយឺត', NULL, NULL, NULL, 'sent', 0, '2026-06-20 09:20:27', '2026-06-20 09:20:27', '2026-06-20 09:20:27'),
(773, 6, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 09:22 AM\n📅 ថ្ងៃទី: 20 Jun 2026\n\n⚠️ ស្ថានភាព: មកយឺត\n⏳ យឺតចំនួន: 22m 27s', NULL, NULL, NULL, 'failed', 0, NULL, '2026-06-20 09:22:31', '2026-06-20 09:22:31'),
(774, 6, NULL, 'late_private', NULL, '⚠️ <b>ជូនដំណឹងមកយឺត</b>\n\n👤 បុគ្គលិក: Gak Vicheka\n🆔 លេខសម្គាល់: DSI004\n🕘 ម៉ោងចូល: 09:22 AM\n⏳ យឺតចំនួន: 22m 27s\n💰 កាត់ប្រាក់: $0.00\n\nស្ថានភាព: មកយឺត', NULL, NULL, NULL, 'failed', 0, NULL, '2026-06-20 09:22:33', '2026-06-20 09:22:33'),
(775, 3, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 09:31 AM\n📅 ថ្ងៃទី: 20 Jun 2026\n\n⚠️ ស្ថានភាព: មកយឺត\n⏳ យឺតចំនួន: 31m 21s', NULL, NULL, NULL, 'sent', 0, '2026-06-20 09:31:24', '2026-06-20 09:31:24', '2026-06-20 09:31:24'),
(776, 3, NULL, 'late_private', NULL, '⚠️ <b>ជូនដំណឹងមកយឺត</b>\n\n👤 បុគ្គលិក: Po Tilino\n🆔 លេខសម្គាល់: DSI003\n🕘 ម៉ោងចូល: 09:31 AM\n⏳ យឺតចំនួន: 31m 21s\n💰 កាត់ប្រាក់: $1.50\n\nស្ថានភាព: មកយឺត', NULL, NULL, NULL, 'sent', 0, '2026-06-20 09:31:27', '2026-06-20 09:31:27', '2026-06-20 09:31:27'),
(777, 21, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 10:08 AM\n📅 ថ្ងៃទី: 20 Jun 2026\n\n⚠️ ស្ថានភាព: មកយឺត\n⏳ យឺតចំនួន: 1h 8m 4s', NULL, NULL, NULL, 'sent', 0, '2026-06-20 10:08:08', '2026-06-20 10:08:08', '2026-06-20 10:08:08'),
(778, 21, NULL, 'late_private', NULL, '⚠️ <b>ជូនដំណឹងមកយឺត</b>\n\n👤 បុគ្គលិក: Van\n🆔 លេខសម្គាល់: DL003\n🕘 ម៉ោងចូល: 10:08 AM\n⏳ យឺតចំនួន: 1h 8m 4s\n💰 កាត់ប្រាក់: $0.00\n\nស្ថានភាព: មកយឺត', NULL, NULL, NULL, 'sent', 0, '2026-06-20 10:08:10', '2026-06-20 10:08:10', '2026-06-20 10:08:10'),
(779, 17, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 10:19 AM\n📅 ថ្ងៃទី: 20 Jun 2026\n\n⚠️ ស្ថានភាព: មកយឺត\n⏳ យឺតចំនួន: 1h 19m 2s', NULL, NULL, NULL, 'sent', 0, '2026-06-20 10:19:05', '2026-06-20 10:19:05', '2026-06-20 10:19:05'),
(780, 17, NULL, 'late_private', NULL, '⚠️ <b>ជូនដំណឹងមកយឺត</b>\n\n👤 បុគ្គលិក: Phal Panha\n🆔 លេខសម្គាល់: DL002\n🕘 ម៉ោងចូល: 10:19 AM\n⏳ យឺតចំនួន: 1h 19m 2s\n💰 កាត់ប្រាក់: $0.00\n\nស្ថានភាព: មកយឺត', NULL, NULL, NULL, 'sent', 0, '2026-06-20 10:19:07', '2026-06-20 10:19:07', '2026-06-20 10:19:07'),
(781, 6, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 09:22 AM\n🕘 ចេញម៉ោង: 05:00 PM\n📅 ថ្ងៃទី: 20 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 07h 38m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'failed', 0, NULL, '2026-06-20 17:00:37', '2026-06-20 17:00:37'),
(782, 16, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 08:09 AM\n🕘 ចេញម៉ោង: 05:01 PM\n📅 ថ្ងៃទី: 20 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 08h 51m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-20 17:01:09', '2026-06-20 17:01:09', '2026-06-20 17:01:09'),
(783, 5, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 09:20 AM\n🕘 ចេញម៉ោង: 05:01 PM\n📅 ថ្ងៃទី: 20 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 07h 41m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-20 17:01:28', '2026-06-20 17:01:28', '2026-06-20 17:01:28'),
(784, 3, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 09:31 AM\n🕘 ចេញម៉ោង: 05:02 PM\n📅 ថ្ងៃទី: 20 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 07h 31m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-20 17:02:40', '2026-06-20 17:02:40', '2026-06-20 17:02:40'),
(785, 14, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 08:51 AM\n🕘 ចេញម៉ោង: 05:27 PM\n📅 ថ្ងៃទី: 20 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 08h 36m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-20 17:27:56', '2026-06-20 17:27:56', '2026-06-20 17:27:56'),
(786, 4, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 09:04 AM\n🕘 ចេញម៉ោង: 05:32 PM\n📅 ថ្ងៃទី: 20 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 08h 28m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-20 17:32:32', '2026-06-20 17:32:32', '2026-06-20 17:32:32'),
(787, 8, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 08:21 AM\n🕘 ចេញម៉ោង: 05:47 PM\n📅 ថ្ងៃទី: 20 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 09h 26m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-20 17:47:21', '2026-06-20 17:47:21', '2026-06-20 17:47:21'),
(788, 8, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:25 AM\n📅 ថ្ងៃទី: 21 Jun 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-06-21 08:25:28', '2026-06-21 08:25:28', '2026-06-21 08:25:28'),
(789, 16, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:30 AM\n📅 ថ្ងៃទី: 21 Jun 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-06-21 08:30:48', '2026-06-21 08:30:48', '2026-06-21 08:30:48'),
(790, 17, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 10:31 AM\n📅 ថ្ងៃទី: 21 Jun 2026\n\n⚠️ ស្ថានភាព: មកយឺត\n⏳ យឺតចំនួន: 1h 31m 28s', NULL, NULL, NULL, 'sent', 0, '2026-06-21 10:31:32', '2026-06-21 10:31:32', '2026-06-21 10:31:32'),
(791, 17, NULL, 'late_private', NULL, '⚠️ <b>ជូនដំណឹងមកយឺត</b>\n\n👤 បុគ្គលិក: Phal Panha\n🆔 លេខសម្គាល់: DL002\n🕘 ម៉ោងចូល: 10:31 AM\n⏳ យឺតចំនួន: 1h 31m 28s\n💰 កាត់ប្រាក់: $0.00\n\nស្ថានភាព: មកយឺត', NULL, NULL, NULL, 'sent', 0, '2026-06-21 10:31:35', '2026-06-21 10:31:35', '2026-06-21 10:31:35'),
(792, 21, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 10:42 AM\n📅 ថ្ងៃទី: 21 Jun 2026\n\n⚠️ ស្ថានភាព: មកយឺត\n⏳ យឺតចំនួន: 1h 42m 11s', NULL, NULL, NULL, 'sent', 0, '2026-06-21 10:42:15', '2026-06-21 10:42:15', '2026-06-21 10:42:15'),
(793, 21, NULL, 'late_private', NULL, '⚠️ <b>ជូនដំណឹងមកយឺត</b>\n\n👤 បុគ្គលិក: Van\n🆔 លេខសម្គាល់: DL003\n🕘 ម៉ោងចូល: 10:42 AM\n⏳ យឺតចំនួន: 1h 42m 11s\n💰 កាត់ប្រាក់: $0.00\n\nស្ថានភាព: មកយឺត', NULL, NULL, NULL, 'sent', 0, '2026-06-21 10:42:17', '2026-06-21 10:42:17', '2026-06-21 10:42:17'),
(794, 8, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 08:25 AM\n🕘 ចេញម៉ោង: 05:47 PM\n📅 ថ្ងៃទី: 21 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 09h 22m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-21 17:47:33', '2026-06-21 17:47:33', '2026-06-21 17:47:33'),
(795, 21, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 10:42 AM\n🕘 ចេញម៉ោង: 06:35 PM\n📅 ថ្ងៃទី: 21 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 07h 53m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-21 18:35:34', '2026-06-21 18:35:34', '2026-06-21 18:35:34'),
(796, 8, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:13 AM\n📅 ថ្ងៃទី: 22 Jun 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-06-22 08:14:02', '2026-06-22 08:14:02', '2026-06-22 08:14:02'),
(797, 16, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:33 AM\n📅 ថ្ងៃទី: 22 Jun 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-06-22 08:33:48', '2026-06-22 08:33:48', '2026-06-22 08:33:48'),
(798, 13, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:41 AM\n📅 ថ្ងៃទី: 22 Jun 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-06-22 08:41:37', '2026-06-22 08:41:37', '2026-06-22 08:41:37'),
(799, 15, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:45 AM\n📅 ថ្ងៃទី: 22 Jun 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'failed', 0, NULL, '2026-06-22 08:45:07', '2026-06-22 08:45:07'),
(800, 21, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:47 AM\n📅 ថ្ងៃទី: 22 Jun 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-06-22 08:47:52', '2026-06-22 08:47:52', '2026-06-22 08:47:52'),
(801, 12, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:48 AM\n📅 ថ្ងៃទី: 22 Jun 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-06-22 08:48:42', '2026-06-22 08:48:42', '2026-06-22 08:48:42'),
(802, 14, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:59 AM\n📅 ថ្ងៃទី: 22 Jun 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-06-22 08:59:57', '2026-06-22 08:59:57', '2026-06-22 08:59:57'),
(803, 6, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 09:12 AM\n📅 ថ្ងៃទី: 22 Jun 2026\n\n⚠️ ស្ថានភាព: មកយឺត\n⏳ យឺតចំនួន: 12m 8s', NULL, NULL, NULL, 'failed', 0, NULL, '2026-06-22 09:12:12', '2026-06-22 09:12:12'),
(804, 6, NULL, 'late_private', NULL, '⚠️ <b>ជូនដំណឹងមកយឺត</b>\n\n👤 បុគ្គលិក: Gak Vicheka\n🆔 លេខសម្គាល់: DSI004\n🕘 ម៉ោងចូល: 09:12 AM\n⏳ យឺតចំនួន: 12m 8s\n💰 កាត់ប្រាក់: $0.00\n\nស្ថានភាព: មកយឺត', NULL, NULL, NULL, 'failed', 0, NULL, '2026-06-22 09:12:15', '2026-06-22 09:12:15'),
(805, 5, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 09:20 AM\n📅 ថ្ងៃទី: 22 Jun 2026\n\n⚠️ ស្ថានភាព: មកយឺត\n⏳ យឺតចំនួន: 20m 19s', NULL, NULL, NULL, 'sent', 0, '2026-06-22 09:20:23', '2026-06-22 09:20:23', '2026-06-22 09:20:23'),
(806, 5, NULL, 'late_private', NULL, '⚠️ <b>ជូនដំណឹងមកយឺត</b>\n\n👤 បុគ្គលិក: Sorn Pugnavan\n🆔 លេខសម្គាល់: MK002\n🕘 ម៉ោងចូល: 09:20 AM\n⏳ យឺតចំនួន: 20m 19s\n💰 កាត់ប្រាក់: $0.00\n\nស្ថានភាព: មកយឺត', NULL, NULL, NULL, 'sent', 0, '2026-06-22 09:20:25', '2026-06-22 09:20:25', '2026-06-22 09:20:25'),
(807, 3, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 09:20 AM\n📅 ថ្ងៃទី: 22 Jun 2026\n\n⚠️ ស្ថានភាព: មកយឺត\n⏳ យឺតចំនួន: 20m 54s', NULL, NULL, NULL, 'sent', 0, '2026-06-22 09:20:57', '2026-06-22 09:20:57', '2026-06-22 09:20:57'),
(808, 3, NULL, 'late_private', NULL, '⚠️ <b>ជូនដំណឹងមកយឺត</b>\n\n👤 បុគ្គលិក: Po Tilino\n🆔 លេខសម្គាល់: DSI003\n🕘 ម៉ោងចូល: 09:20 AM\n⏳ យឺតចំនួន: 20m 54s\n💰 កាត់ប្រាក់: $0.00\n\nស្ថានភាព: មកយឺត', NULL, NULL, NULL, 'sent', 0, '2026-06-22 09:20:59', '2026-06-22 09:20:59', '2026-06-22 09:20:59'),
(809, 9, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 09:58 AM\n📅 ថ្ងៃទី: 22 Jun 2026\n\n⚠️ ស្ថានភាព: មកយឺត\n⏳ យឺតចំនួន: 58m 41s', NULL, NULL, NULL, 'sent', 0, '2026-06-22 09:58:46', '2026-06-22 09:58:46', '2026-06-22 09:58:46'),
(810, 9, NULL, 'late_private', NULL, '⚠️ <b>ជូនដំណឹងមកយឺត</b>\n\n👤 បុគ្គលិក: Phol Sokkhe\n🆔 លេខសម្គាល់: IS001\n🕘 ម៉ោងចូល: 09:58 AM\n⏳ យឺតចំនួន: 58m 41s\n💰 កាត់ប្រាក់: $1.50\n\nស្ថានភាព: មកយឺត', NULL, NULL, NULL, 'sent', 0, '2026-06-22 09:58:50', '2026-06-22 09:58:50', '2026-06-22 09:58:50'),
(811, 17, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 10:08 AM\n📅 ថ្ងៃទី: 22 Jun 2026\n\n⚠️ ស្ថានភាព: មកយឺត\n⏳ យឺតចំនួន: 1h 8m 59s', NULL, NULL, NULL, 'sent', 0, '2026-06-22 10:09:05', '2026-06-22 10:09:05', '2026-06-22 10:09:05'),
(812, 17, NULL, 'late_private', NULL, '⚠️ <b>ជូនដំណឹងមកយឺត</b>\n\n👤 បុគ្គលិក: Phal Panha\n🆔 លេខសម្គាល់: DL002\n🕘 ម៉ោងចូល: 10:08 AM\n⏳ យឺតចំនួន: 1h 8m 59s\n💰 កាត់ប្រាក់: $0.00\n\nស្ថានភាព: មកយឺត', NULL, NULL, NULL, 'sent', 0, '2026-06-22 10:09:07', '2026-06-22 10:09:07', '2026-06-22 10:09:07'),
(813, 4, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 11:20 AM\n📅 ថ្ងៃទី: 22 Jun 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-06-22 11:20:23', '2026-06-22 11:20:23', '2026-06-22 11:20:23'),
(814, 16, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 08:33 AM\n🕘 ចេញម៉ោង: 05:00 PM\n📅 ថ្ងៃទី: 22 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 08h 26m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-22 17:00:41', '2026-06-22 17:00:41', '2026-06-22 17:00:41'),
(815, 5, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 09:20 AM\n🕘 ចេញម៉ោង: 05:04 PM\n📅 ថ្ងៃទី: 22 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 07h 44m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-22 17:05:01', '2026-06-22 17:05:01', '2026-06-22 17:05:01'),
(816, 6, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 09:12 AM\n🕘 ចេញម៉ោង: 05:06 PM\n📅 ថ្ងៃទី: 22 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 07h 54m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'failed', 0, NULL, '2026-06-22 17:06:24', '2026-06-22 17:06:24'),
(817, 4, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 11:20 AM\n🕘 ចេញម៉ោង: 05:08 PM\n📅 ថ្ងៃទី: 22 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 05h 48m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-22 17:08:47', '2026-06-22 17:08:47', '2026-06-22 17:08:47'),
(818, 8, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 08:13 AM\n🕘 ចេញម៉ោង: 05:19 PM\n📅 ថ្ងៃទី: 22 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 09h 05m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-22 17:19:56', '2026-06-22 17:19:56', '2026-06-22 17:19:56'),
(819, 3, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 09:20 AM\n🕘 ចេញម៉ោង: 06:07 PM\n📅 ថ្ងៃទី: 22 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 08h 46m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-22 18:07:28', '2026-06-22 18:07:28', '2026-06-22 18:07:28'),
(820, 9, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 09:58 AM\n🕘 ចេញម៉ោង: 06:14 PM\n📅 ថ្ងៃទី: 22 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 08h 15m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-22 18:14:22', '2026-06-22 18:14:22', '2026-06-22 18:14:22'),
(821, 12, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 08:48 AM\n🕘 ចេញម៉ោង: 06:14 PM\n📅 ថ្ងៃទី: 22 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 09h 26m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-22 18:14:53', '2026-06-22 18:14:53', '2026-06-22 18:14:53'),
(822, 13, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 08:41 AM\n🕘 ចេញម៉ោង: 06:15 PM\n📅 ថ្ងៃទី: 22 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 09h 33m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-22 18:15:09', '2026-06-22 18:15:09', '2026-06-22 18:15:09'),
(823, 15, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 08:45 AM\n🕘 ចេញម៉ោង: 06:54 PM\n📅 ថ្ងៃទី: 22 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 10h 09m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'failed', 0, NULL, '2026-06-22 18:54:35', '2026-06-22 18:54:35'),
(824, 14, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 08:59 AM\n🕘 ចេញម៉ោង: 06:56 PM\n📅 ថ្ងៃទី: 22 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 09h 57m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-22 18:57:02', '2026-06-22 18:57:02', '2026-06-22 18:57:02'),
(825, 21, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 08:47 AM\n🕘 ចេញម៉ោង: 07:53 PM\n📅 ថ្ងៃទី: 22 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 11h 06m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-22 19:54:02', '2026-06-22 19:54:02', '2026-06-22 19:54:02'),
(826, 8, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:23 AM\n📅 ថ្ងៃទី: 23 Jun 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-06-23 08:23:32', '2026-06-23 08:23:32', '2026-06-23 08:23:32'),
(827, 9, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:35 AM\n📅 ថ្ងៃទី: 23 Jun 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-06-23 08:35:53', '2026-06-23 08:35:53', '2026-06-23 08:35:53'),
(828, 14, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:45 AM\n📅 ថ្ងៃទី: 23 Jun 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-06-23 08:46:03', '2026-06-23 08:46:03', '2026-06-23 08:46:03'),
(829, 15, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 09:09 AM\n📅 ថ្ងៃទី: 23 Jun 2026\n\n⚠️ ស្ថានភាព: មកយឺត\n⏳ យឺតចំនួន: 9m 16s', NULL, NULL, NULL, 'failed', 0, NULL, '2026-06-23 09:09:20', '2026-06-23 09:09:20'),
(830, 15, NULL, 'late_private', NULL, '⚠️ <b>ជូនដំណឹងមកយឺត</b>\n\n👤 បុគ្គលិក: Mang Leanghort\n🆔 លេខសម្គាល់: ACC006\n🕘 ម៉ោងចូល: 09:09 AM\n⏳ យឺតចំនួន: 9m 16s\n💰 កាត់ប្រាក់: $0.00\n\nស្ថានភាព: មកយឺត', NULL, NULL, NULL, 'failed', 0, NULL, '2026-06-23 09:09:22', '2026-06-23 09:09:22'),
(831, 4, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 09:12 AM\n📅 ថ្ងៃទី: 23 Jun 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-06-23 09:12:12', '2026-06-23 09:12:12', '2026-06-23 09:12:12'),
(832, 19, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 09:14 AM\n📅 ថ្ងៃទី: 23 Jun 2026\n\n⚠️ ស្ថានភាព: មកយឺត\n⏳ យឺតចំនួន: 14m 53s', NULL, NULL, NULL, 'sent', 0, '2026-06-23 09:14:57', '2026-06-23 09:14:57', '2026-06-23 09:14:57'),
(833, 19, NULL, 'late_private', NULL, '⚠️ <b>ជូនដំណឹងមកយឺត</b>\n\n👤 បុគ្គលិក: Heng Laiheang\n🆔 លេខសម្គាល់: acc008\n🕘 ម៉ោងចូល: 09:14 AM\n⏳ យឺតចំនួន: 14m 53s\n💰 កាត់ប្រាក់: $0.00\n\nស្ថានភាព: មកយឺត', NULL, NULL, NULL, 'sent', 0, '2026-06-23 09:14:59', '2026-06-23 09:14:59', '2026-06-23 09:14:59'),
(834, 6, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 09:17 AM\n📅 ថ្ងៃទី: 23 Jun 2026\n\n⚠️ ស្ថានភាព: មកយឺត\n⏳ យឺតចំនួន: 17m 41s', NULL, NULL, NULL, 'failed', 0, NULL, '2026-06-23 09:17:44', '2026-06-23 09:17:44'),
(835, 6, NULL, 'late_private', NULL, '⚠️ <b>ជូនដំណឹងមកយឺត</b>\n\n👤 បុគ្គលិក: Gak Vicheka\n🆔 លេខសម្គាល់: DSI004\n🕘 ម៉ោងចូល: 09:17 AM\n⏳ យឺតចំនួន: 17m 41s\n💰 កាត់ប្រាក់: $0.00\n\nស្ថានភាព: មកយឺត', NULL, NULL, NULL, 'failed', 0, NULL, '2026-06-23 09:17:46', '2026-06-23 09:17:46'),
(836, 13, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 09:19 AM\n📅 ថ្ងៃទី: 23 Jun 2026\n\n⚠️ ស្ថានភាព: មកយឺត\n⏳ យឺតចំនួន: 19m 57s', NULL, NULL, NULL, 'sent', 0, '2026-06-23 09:20:00', '2026-06-23 09:20:00', '2026-06-23 09:20:00'),
(837, 13, NULL, 'late_private', NULL, '⚠️ <b>ជូនដំណឹងមកយឺត</b>\n\n👤 បុគ្គលិក: Chean Aleav\n🆔 លេខសម្គាល់: ACC003\n🕘 ម៉ោងចូល: 09:19 AM\n⏳ យឺតចំនួន: 19m 57s\n💰 កាត់ប្រាក់: $0.00\n\nស្ថានភាព: មកយឺត', NULL, NULL, NULL, 'sent', 0, '2026-06-23 09:20:02', '2026-06-23 09:20:02', '2026-06-23 09:20:02'),
(838, 12, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 09:19 AM\n📅 ថ្ងៃទី: 23 Jun 2026\n\n⚠️ ស្ថានភាព: មកយឺត\n⏳ យឺតចំនួន: 19m 58s', NULL, NULL, NULL, 'sent', 0, '2026-06-23 09:20:03', '2026-06-23 09:20:03', '2026-06-23 09:20:03'),
(839, 12, NULL, 'late_private', NULL, '⚠️ <b>ជូនដំណឹងមកយឺត</b>\n\n👤 បុគ្គលិក: Chu Kimhorng\n🆔 លេខសម្គាល់: ACC005\n🕘 ម៉ោងចូល: 09:19 AM\n⏳ យឺតចំនួន: 19m 58s\n💰 កាត់ប្រាក់: $0.00\n\nស្ថានភាព: មកយឺត', NULL, NULL, NULL, 'sent', 0, '2026-06-23 09:20:05', '2026-06-23 09:20:05', '2026-06-23 09:20:05'),
(840, 5, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 09:23 AM\n📅 ថ្ងៃទី: 23 Jun 2026\n\n⚠️ ស្ថានភាព: មកយឺត\n⏳ យឺតចំនួន: 23m 0s', NULL, NULL, NULL, 'sent', 0, '2026-06-23 09:23:04', '2026-06-23 09:23:04', '2026-06-23 09:23:04'),
(841, 5, NULL, 'late_private', NULL, '⚠️ <b>ជូនដំណឹងមកយឺត</b>\n\n👤 បុគ្គលិក: Sorn Pugnavan\n🆔 លេខសម្គាល់: MK002\n🕘 ម៉ោងចូល: 09:23 AM\n⏳ យឺតចំនួន: 23m 0s\n💰 កាត់ប្រាក់: $0.00\n\nស្ថានភាព: មកយឺត', NULL, NULL, NULL, 'sent', 0, '2026-06-23 09:23:06', '2026-06-23 09:23:06', '2026-06-23 09:23:06'),
(842, 3, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 09:51 AM\n📅 ថ្ងៃទី: 23 Jun 2026\n\n⚠️ ស្ថានភាព: មកយឺត\n⏳ យឺតចំនួន: 51m 0s', NULL, NULL, NULL, 'sent', 0, '2026-06-23 09:51:03', '2026-06-23 09:51:03', '2026-06-23 09:51:03'),
(843, 3, NULL, 'late_private', NULL, '⚠️ <b>ជូនដំណឹងមកយឺត</b>\n\n👤 បុគ្គលិក: Po Tilino\n🆔 លេខសម្គាល់: DSI003\n🕘 ម៉ោងចូល: 09:51 AM\n⏳ យឺតចំនួន: 51m 0s\n💰 កាត់ប្រាក់: $1.50\n\nស្ថានភាព: មកយឺត', NULL, NULL, NULL, 'sent', 0, '2026-06-23 09:51:08', '2026-06-23 09:51:08', '2026-06-23 09:51:08'),
(844, 19, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 09:14 AM\n🕘 ចេញម៉ោង: 05:13 PM\n📅 ថ្ងៃទី: 23 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 07h 58m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-23 17:13:35', '2026-06-23 17:13:35', '2026-06-23 17:13:35'),
(845, 5, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 09:23 AM\n🕘 ចេញម៉ោង: 05:17 PM\n📅 ថ្ងៃទី: 23 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 07h 54m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-23 17:17:52', '2026-06-23 17:17:52', '2026-06-23 17:17:52'),
(846, 8, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 08:23 AM\n🕘 ចេញម៉ោង: 05:22 PM\n📅 ថ្ងៃទី: 23 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 08h 59m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-23 17:22:33', '2026-06-23 17:22:33', '2026-06-23 17:22:33'),
(847, 6, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 09:17 AM\n🕘 ចេញម៉ោង: 05:23 PM\n📅 ថ្ងៃទី: 23 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 08h 05m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'failed', 0, NULL, '2026-06-23 17:23:23', '2026-06-23 17:23:23'),
(848, 3, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 09:51 AM\n🕘 ចេញម៉ោង: 06:04 PM\n📅 ថ្ងៃទី: 23 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 08h 13m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-23 18:04:46', '2026-06-23 18:04:46', '2026-06-23 18:04:46'),
(849, 15, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 09:09 AM\n🕘 ចេញម៉ោង: 06:05 PM\n📅 ថ្ងៃទី: 23 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 08h 56m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'failed', 0, NULL, '2026-06-23 18:05:48', '2026-06-23 18:05:48'),
(850, 14, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 08:45 AM\n🕘 ចេញម៉ោង: 06:13 PM\n📅 ថ្ងៃទី: 23 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 09h 27m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-23 18:13:57', '2026-06-23 18:13:57', '2026-06-23 18:13:57'),
(851, 4, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 09:12 AM\n🕘 ចេញម៉ោង: 06:14 PM\n📅 ថ្ងៃទី: 23 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 09h 01m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-23 18:14:05', '2026-06-23 18:14:05', '2026-06-23 18:14:05'),
(852, 13, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 09:19 AM\n🕘 ចេញម៉ោង: 07:54 PM\n📅 ថ្ងៃទី: 23 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 10h 34m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-23 19:54:38', '2026-06-23 19:54:38', '2026-06-23 19:54:38'),
(853, 12, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 09:19 AM\n🕘 ចេញម៉ោង: 07:54 PM\n📅 ថ្ងៃទី: 23 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 10h 34m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-23 19:54:55', '2026-06-23 19:54:55', '2026-06-23 19:54:55'),
(854, 9, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 08:35 AM\n🕘 ចេញម៉ោង: 07:55 PM\n📅 ថ្ងៃទី: 23 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 11h 20m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-23 19:55:59', '2026-06-23 19:55:59', '2026-06-23 19:55:59'),
(855, 8, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:17 AM\n📅 ថ្ងៃទី: 24 Jun 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-06-24 08:17:47', '2026-06-24 08:17:47', '2026-06-24 08:17:47'),
(856, 16, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:19 AM\n📅 ថ្ងៃទី: 24 Jun 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-06-24 08:19:24', '2026-06-24 08:19:24', '2026-06-24 08:19:24'),
(857, 17, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:21 AM\n📅 ថ្ងៃទី: 24 Jun 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-06-24 08:21:52', '2026-06-24 08:21:52', '2026-06-24 08:21:52'),
(858, 15, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:54 AM\n📅 ថ្ងៃទី: 24 Jun 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'failed', 0, NULL, '2026-06-24 08:54:11', '2026-06-24 08:54:11'),
(859, 14, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:58 AM\n📅 ថ្ងៃទី: 24 Jun 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-06-24 08:58:37', '2026-06-24 08:58:37', '2026-06-24 08:58:37'),
(860, 13, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 09:13 AM\n📅 ថ្ងៃទី: 24 Jun 2026\n\n⚠️ ស្ថានភាព: មកយឺត\n⏳ យឺតចំនួន: 13m 33s', NULL, NULL, NULL, 'sent', 0, '2026-06-24 09:13:37', '2026-06-24 09:13:37', '2026-06-24 09:13:37'),
(861, 12, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 09:13 AM\n📅 ថ្ងៃទី: 24 Jun 2026\n\n⚠️ ស្ថានភាព: មកយឺត\n⏳ យឺតចំនួន: 13m 33s', NULL, NULL, NULL, 'sent', 0, '2026-06-24 09:13:38', '2026-06-24 09:13:38', '2026-06-24 09:13:38'),
(862, 13, NULL, 'late_private', NULL, '⚠️ <b>ជូនដំណឹងមកយឺត</b>\n\n👤 បុគ្គលិក: Chean Aleav\n🆔 លេខសម្គាល់: ACC003\n🕘 ម៉ោងចូល: 09:13 AM\n⏳ យឺតចំនួន: 13m 33s\n💰 កាត់ប្រាក់: $0.00\n\nស្ថានភាព: មកយឺត', NULL, NULL, NULL, 'sent', 0, '2026-06-24 09:13:38', '2026-06-24 09:13:38', '2026-06-24 09:13:38'),
(863, 12, NULL, 'late_private', NULL, '⚠️ <b>ជូនដំណឹងមកយឺត</b>\n\n👤 បុគ្គលិក: Chu Kimhorng\n🆔 លេខសម្គាល់: ACC005\n🕘 ម៉ោងចូល: 09:13 AM\n⏳ យឺតចំនួន: 13m 33s\n💰 កាត់ប្រាក់: $0.00\n\nស្ថានភាព: មកយឺត', NULL, NULL, NULL, 'sent', 0, '2026-06-24 09:13:40', '2026-06-24 09:13:40', '2026-06-24 09:13:40'),
(864, 9, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 09:14 AM\n📅 ថ្ងៃទី: 24 Jun 2026\n\n⚠️ ស្ថានភាព: មកយឺត\n⏳ យឺតចំនួន: 14m 27s', NULL, NULL, NULL, 'sent', 0, '2026-06-24 09:14:31', '2026-06-24 09:14:31', '2026-06-24 09:14:31'),
(865, 9, NULL, 'late_private', NULL, '⚠️ <b>ជូនដំណឹងមកយឺត</b>\n\n👤 បុគ្គលិក: Phol Sokkhe\n🆔 លេខសម្គាល់: IS001\n🕘 ម៉ោងចូល: 09:14 AM\n⏳ យឺតចំនួន: 14m 27s\n💰 កាត់ប្រាក់: $0.00\n\nស្ថានភាព: មកយឺត', NULL, NULL, NULL, 'sent', 0, '2026-06-24 09:14:33', '2026-06-24 09:14:33', '2026-06-24 09:14:33'),
(866, 5, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 09:18 AM\n📅 ថ្ងៃទី: 24 Jun 2026\n\n⚠️ ស្ថានភាព: មកយឺត\n⏳ យឺតចំនួន: 18m 59s', NULL, NULL, NULL, 'sent', 0, '2026-06-24 09:19:04', '2026-06-24 09:19:04', '2026-06-24 09:19:04'),
(867, 5, NULL, 'late_private', NULL, '⚠️ <b>ជូនដំណឹងមកយឺត</b>\n\n👤 បុគ្គលិក: Sorn Pugnavan\n🆔 លេខសម្គាល់: MK002\n🕘 ម៉ោងចូល: 09:18 AM\n⏳ យឺតចំនួន: 18m 59s\n💰 កាត់ប្រាក់: $0.00\n\nស្ថានភាព: មកយឺត', NULL, NULL, NULL, 'sent', 0, '2026-06-24 09:19:06', '2026-06-24 09:19:06', '2026-06-24 09:19:06'),
(868, 21, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 09:24 AM\n📅 ថ្ងៃទី: 24 Jun 2026\n\n⚠️ ស្ថានភាព: មកយឺត\n⏳ យឺតចំនួន: 24m 34s', NULL, NULL, NULL, 'sent', 0, '2026-06-24 09:24:39', '2026-06-24 09:24:39', '2026-06-24 09:24:39'),
(869, 21, NULL, 'late_private', NULL, '⚠️ <b>ជូនដំណឹងមកយឺត</b>\n\n👤 បុគ្គលិក: Van\n🆔 លេខសម្គាល់: DL003\n🕘 ម៉ោងចូល: 09:24 AM\n⏳ យឺតចំនួន: 24m 34s\n💰 កាត់ប្រាក់: $0.00\n\nស្ថានភាព: មកយឺត', NULL, NULL, NULL, 'sent', 0, '2026-06-24 09:24:41', '2026-06-24 09:24:41', '2026-06-24 09:24:41'),
(870, 6, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 09:28 AM\n📅 ថ្ងៃទី: 24 Jun 2026\n\n⚠️ ស្ថានភាព: មកយឺត\n⏳ យឺតចំនួន: 28m 23s', NULL, NULL, NULL, 'failed', 0, NULL, '2026-06-24 09:28:28', '2026-06-24 09:28:28'),
(871, 6, NULL, 'late_private', NULL, '⚠️ <b>ជូនដំណឹងមកយឺត</b>\n\n👤 បុគ្គលិក: Gak Vicheka\n🆔 លេខសម្គាល់: DSI004\n🕘 ម៉ោងចូល: 09:28 AM\n⏳ យឺតចំនួន: 28m 23s\n💰 កាត់ប្រាក់: $0.00\n\nស្ថានភាព: មកយឺត', NULL, NULL, NULL, 'failed', 0, NULL, '2026-06-24 09:28:30', '2026-06-24 09:28:30'),
(872, 3, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 09:30 AM\n📅 ថ្ងៃទី: 24 Jun 2026\n\n⚠️ ស្ថានភាព: មកយឺត\n⏳ យឺតចំនួន: 30m 34s', NULL, NULL, NULL, 'sent', 0, '2026-06-24 09:30:38', '2026-06-24 09:30:38', '2026-06-24 09:30:38'),
(873, 3, NULL, 'late_private', NULL, '⚠️ <b>ជូនដំណឹងមកយឺត</b>\n\n👤 បុគ្គលិក: Po Tilino\n🆔 លេខសម្គាល់: DSI003\n🕘 ម៉ោងចូល: 09:30 AM\n⏳ យឺតចំនួន: 30m 34s\n💰 កាត់ប្រាក់: $1.50\n\nស្ថានភាព: មកយឺត', NULL, NULL, NULL, 'sent', 0, '2026-06-24 09:30:41', '2026-06-24 09:30:41', '2026-06-24 09:30:41'),
(874, 21, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 09:24 AM\n🕘 ចេញម៉ោង: 09:31 PM\n📅 ថ្ងៃទី: 24 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 12h 07m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-24 21:31:49', '2026-06-24 21:31:49', '2026-06-24 21:31:49'),
(875, 16, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:28 AM\n📅 ថ្ងៃទី: 25 Jun 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-06-25 08:28:29', '2026-06-25 08:28:29', '2026-06-25 08:28:29'),
(876, 8, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:29 AM\n📅 ថ្ងៃទី: 25 Jun 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-06-25 08:29:50', '2026-06-25 08:29:50', '2026-06-25 08:29:50'),
(877, 9, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:30 AM\n📅 ថ្ងៃទី: 25 Jun 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-06-25 08:30:07', '2026-06-25 08:30:07', '2026-06-25 08:30:07'),
(878, 14, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:56 AM\n📅 ថ្ងៃទី: 25 Jun 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-06-25 08:56:27', '2026-06-25 08:56:27', '2026-06-25 08:56:27'),
(879, 15, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 09:10 AM\n📅 ថ្ងៃទី: 25 Jun 2026\n\n⚠️ ស្ថានភាព: មកយឺត\n⏳ យឺតចំនួន: 10m 17s', NULL, NULL, NULL, 'failed', 0, NULL, '2026-06-25 09:10:21', '2026-06-25 09:10:21'),
(880, 15, NULL, 'late_private', NULL, '⚠️ <b>ជូនដំណឹងមកយឺត</b>\n\n👤 បុគ្គលិក: Mang Leanghort\n🆔 លេខសម្គាល់: ACC006\n🕘 ម៉ោងចូល: 09:10 AM\n⏳ យឺតចំនួន: 10m 17s\n💰 កាត់ប្រាក់: $0.00\n\nស្ថានភាព: មកយឺត', NULL, NULL, NULL, 'failed', 0, NULL, '2026-06-25 09:10:24', '2026-06-25 09:10:24'),
(881, 13, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 09:11 AM\n📅 ថ្ងៃទី: 25 Jun 2026\n\n⚠️ ស្ថានភាព: មកយឺត\n⏳ យឺតចំនួន: 11m 45s', NULL, NULL, NULL, 'sent', 0, '2026-06-25 09:11:49', '2026-06-25 09:11:49', '2026-06-25 09:11:49'),
(882, 13, NULL, 'late_private', NULL, '⚠️ <b>ជូនដំណឹងមកយឺត</b>\n\n👤 បុគ្គលិក: Chean Aleav\n🆔 លេខសម្គាល់: ACC003\n🕘 ម៉ោងចូល: 09:11 AM\n⏳ យឺតចំនួន: 11m 45s\n💰 កាត់ប្រាក់: $0.00\n\nស្ថានភាព: មកយឺត', NULL, NULL, NULL, 'sent', 0, '2026-06-25 09:11:51', '2026-06-25 09:11:51', '2026-06-25 09:11:51'),
(883, 12, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 09:12 AM\n📅 ថ្ងៃទី: 25 Jun 2026\n\n⚠️ ស្ថានភាព: មកយឺត\n⏳ យឺតចំនួន: 12m 16s', NULL, NULL, NULL, 'sent', 0, '2026-06-25 09:12:20', '2026-06-25 09:12:20', '2026-06-25 09:12:20'),
(884, 12, NULL, 'late_private', NULL, '⚠️ <b>ជូនដំណឹងមកយឺត</b>\n\n👤 បុគ្គលិក: Chu Kimhorng\n🆔 លេខសម្គាល់: ACC005\n🕘 ម៉ោងចូល: 09:12 AM\n⏳ យឺតចំនួន: 12m 16s\n💰 កាត់ប្រាក់: $0.00\n\nស្ថានភាព: មកយឺត', NULL, NULL, NULL, 'sent', 0, '2026-06-25 09:12:22', '2026-06-25 09:12:22', '2026-06-25 09:12:22'),
(885, 6, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 09:19 AM\n📅 ថ្ងៃទី: 25 Jun 2026\n\n⚠️ ស្ថានភាព: មកយឺត\n⏳ យឺតចំនួន: 19m 38s', NULL, NULL, NULL, 'failed', 0, NULL, '2026-06-25 09:19:42', '2026-06-25 09:19:42'),
(886, 6, NULL, 'late_private', NULL, '⚠️ <b>ជូនដំណឹងមកយឺត</b>\n\n👤 បុគ្គលិក: Gak Vicheka\n🆔 លេខសម្គាល់: DSI004\n🕘 ម៉ោងចូល: 09:19 AM\n⏳ យឺតចំនួន: 19m 38s\n💰 កាត់ប្រាក់: $0.00\n\nស្ថានភាព: មកយឺត', NULL, NULL, NULL, 'failed', 0, NULL, '2026-06-25 09:19:44', '2026-06-25 09:19:44'),
(887, 5, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 09:23 AM\n📅 ថ្ងៃទី: 25 Jun 2026\n\n⚠️ ស្ថានភាព: មកយឺត\n⏳ យឺតចំនួន: 23m 53s', NULL, NULL, NULL, 'sent', 0, '2026-06-25 09:23:58', '2026-06-25 09:23:58', '2026-06-25 09:23:58'),
(888, 5, NULL, 'late_private', NULL, '⚠️ <b>ជូនដំណឹងមកយឺត</b>\n\n👤 បុគ្គលិក: Sorn Pugnavan\n🆔 លេខសម្គាល់: MK002\n🕘 ម៉ោងចូល: 09:23 AM\n⏳ យឺតចំនួន: 23m 53s\n💰 កាត់ប្រាក់: $0.00\n\nស្ថានភាព: មកយឺត', NULL, NULL, NULL, 'sent', 0, '2026-06-25 09:24:00', '2026-06-25 09:24:00', '2026-06-25 09:24:00'),
(889, 3, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 09:26 AM\n📅 ថ្ងៃទី: 25 Jun 2026\n\n⚠️ ស្ថានភាព: មកយឺត\n⏳ យឺតចំនួន: 26m 17s', NULL, NULL, NULL, 'sent', 0, '2026-06-25 09:26:21', '2026-06-25 09:26:21', '2026-06-25 09:26:21'),
(890, 3, NULL, 'late_private', NULL, '⚠️ <b>ជូនដំណឹងមកយឺត</b>\n\n👤 បុគ្គលិក: Po Tilino\n🆔 លេខសម្គាល់: DSI003\n🕘 ម៉ោងចូល: 09:26 AM\n⏳ យឺតចំនួន: 26m 17s\n💰 កាត់ប្រាក់: $0.00\n\nស្ថានភាព: មកយឺត', NULL, NULL, NULL, 'sent', 0, '2026-06-25 09:26:23', '2026-06-25 09:26:23', '2026-06-25 09:26:23'),
(891, 21, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 09:51 AM\n📅 ថ្ងៃទី: 25 Jun 2026\n\n⚠️ ស្ថានភាព: មកយឺត\n⏳ យឺតចំនួន: 51m 47s', NULL, NULL, NULL, 'sent', 0, '2026-06-25 09:51:51', '2026-06-25 09:51:51', '2026-06-25 09:51:51'),
(892, 21, NULL, 'late_private', NULL, '⚠️ <b>ជូនដំណឹងមកយឺត</b>\n\n👤 បុគ្គលិក: Van\n🆔 លេខសម្គាល់: DL003\n🕘 ម៉ោងចូល: 09:51 AM\n⏳ យឺតចំនួន: 51m 47s\n💰 កាត់ប្រាក់: $0.00\n\nស្ថានភាព: មកយឺត', NULL, NULL, NULL, 'sent', 0, '2026-06-25 09:51:53', '2026-06-25 09:51:53', '2026-06-25 09:51:53'),
(893, 17, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 10:58 AM\n📅 ថ្ងៃទី: 25 Jun 2026\n\n⚠️ ស្ថានភាព: មកយឺត\n⏳ យឺតចំនួន: 1h 58m 55s', NULL, NULL, NULL, 'sent', 0, '2026-06-25 10:59:00', '2026-06-25 10:59:00', '2026-06-25 10:59:00'),
(894, 17, NULL, 'late_private', NULL, '⚠️ <b>ជូនដំណឹងមកយឺត</b>\n\n👤 បុគ្គលិក: Phal Panha\n🆔 លេខសម្គាល់: DL002\n🕘 ម៉ោងចូល: 10:58 AM\n⏳ យឺតចំនួន: 1h 58m 55s\n💰 កាត់ប្រាក់: $0.00\n\nស្ថានភាព: មកយឺត', NULL, NULL, NULL, 'sent', 0, '2026-06-25 10:59:02', '2026-06-25 10:59:02', '2026-06-25 10:59:02'),
(895, 4, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 12:18 PM\n📅 ថ្ងៃទី: 25 Jun 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-06-25 12:19:04', '2026-06-25 12:19:04', '2026-06-25 12:19:04'),
(896, 16, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 08:28 AM\n🕘 ចេញម៉ោង: 05:01 PM\n📅 ថ្ងៃទី: 25 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 08h 32m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-25 17:01:20', '2026-06-25 17:01:20', '2026-06-25 17:01:20'),
(897, 5, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 09:23 AM\n🕘 ចេញម៉ោង: 05:12 PM\n📅 ថ្ងៃទី: 25 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 07h 48m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-25 17:12:53', '2026-06-25 17:12:53', '2026-06-25 17:12:53'),
(898, 6, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 09:19 AM\n🕘 ចេញម៉ោង: 05:13 PM\n📅 ថ្ងៃទី: 25 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 07h 53m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'failed', 0, NULL, '2026-06-25 17:13:24', '2026-06-25 17:13:24'),
(899, 13, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 09:11 AM\n🕘 ចេញម៉ោង: 05:14 PM\n📅 ថ្ងៃទី: 25 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 08h 02m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-25 17:14:30', '2026-06-25 17:14:30', '2026-06-25 17:14:30'),
(900, 4, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 12:18 PM\n🕘 ចេញម៉ោង: 05:21 PM\n📅 ថ្ងៃទី: 25 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 05h 02m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-25 17:21:26', '2026-06-25 17:21:26', '2026-06-25 17:21:26'),
(901, 15, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 09:10 AM\n🕘 ចេញម៉ោង: 05:21 PM\n📅 ថ្ងៃទី: 25 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 08h 11m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'failed', 0, NULL, '2026-06-25 17:21:34', '2026-06-25 17:21:34'),
(902, 3, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 09:26 AM\n🕘 ចេញម៉ោង: 05:23 PM\n📅 ថ្ងៃទី: 25 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 07h 57m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-25 17:23:52', '2026-06-25 17:23:52', '2026-06-25 17:23:52'),
(903, 8, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 08:29 AM\n🕘 ចេញម៉ោង: 05:26 PM\n📅 ថ្ងៃទី: 25 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 08h 57m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-25 17:26:55', '2026-06-25 17:26:55', '2026-06-25 17:26:55'),
(904, 14, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 08:56 AM\n🕘 ចេញម៉ោង: 06:00 PM\n📅 ថ្ងៃទី: 25 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 09h 04m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-25 18:00:40', '2026-06-25 18:00:40', '2026-06-25 18:00:40'),
(905, 12, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 09:12 AM\n🕘 ចេញម៉ោង: 06:27 PM\n📅 ថ្ងៃទី: 25 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 09h 15m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-25 18:27:35', '2026-06-25 18:27:35', '2026-06-25 18:27:35'),
(906, 9, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 08:30 AM\n🕘 ចេញម៉ោង: 06:39 PM\n📅 ថ្ងៃទី: 25 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 10h 09m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-25 18:40:00', '2026-06-25 18:40:00', '2026-06-25 18:40:00'),
(907, 16, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:03 AM\n📅 ថ្ងៃទី: 26 Jun 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-06-26 08:03:41', '2026-06-26 08:03:41', '2026-06-26 08:03:41'),
(908, 8, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:19 AM\n📅 ថ្ងៃទី: 26 Jun 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-06-26 08:19:59', '2026-06-26 08:19:59', '2026-06-26 08:19:59'),
(909, 9, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:30 AM\n📅 ថ្ងៃទី: 26 Jun 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-06-26 08:30:57', '2026-06-26 08:30:57', '2026-06-26 08:30:57'),
(910, 15, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:49 AM\n📅 ថ្ងៃទី: 26 Jun 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'failed', 0, NULL, '2026-06-26 08:49:39', '2026-06-26 08:49:39'),
(911, 12, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 09:06 AM\n📅 ថ្ងៃទី: 26 Jun 2026\n\n⚠️ ស្ថានភាព: មកយឺត\n⏳ យឺតចំនួន: 6m 21s', NULL, NULL, NULL, 'sent', 0, '2026-06-26 09:06:26', '2026-06-26 09:06:26', '2026-06-26 09:06:26'),
(912, 12, NULL, 'late_private', NULL, '⚠️ <b>ជូនដំណឹងមកយឺត</b>\n\n👤 បុគ្គលិក: Chu Kimhorng\n🆔 លេខសម្គាល់: ACC005\n🕘 ម៉ោងចូល: 09:06 AM\n⏳ យឺតចំនួន: 6m 21s\n💰 កាត់ប្រាក់: $0.00\n\nស្ថានភាព: មកយឺត', NULL, NULL, NULL, 'sent', 0, '2026-06-26 09:06:28', '2026-06-26 09:06:28', '2026-06-26 09:06:28'),
(913, 14, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 09:07 AM\n📅 ថ្ងៃទី: 26 Jun 2026\n\n⚠️ ស្ថានភាព: មកយឺត\n⏳ យឺតចំនួន: 7m 34s', NULL, NULL, NULL, 'sent', 0, '2026-06-26 09:07:39', '2026-06-26 09:07:39', '2026-06-26 09:07:39'),
(914, 14, NULL, 'late_private', NULL, '⚠️ <b>ជូនដំណឹងមកយឺត</b>\n\n👤 បុគ្គលិក: Outh Kimnai\n🆔 លេខសម្គាល់: MK001\n🕘 ម៉ោងចូល: 09:07 AM\n⏳ យឺតចំនួន: 7m 34s\n💰 កាត់ប្រាក់: $0.00\n\nស្ថានភាព: មកយឺត', NULL, NULL, NULL, 'sent', 0, '2026-06-26 09:07:41', '2026-06-26 09:07:41', '2026-06-26 09:07:41'),
(915, 13, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 09:07 AM\n📅 ថ្ងៃទី: 26 Jun 2026\n\n⚠️ ស្ថានភាព: មកយឺត\n⏳ យឺតចំនួន: 7m 35s', NULL, NULL, NULL, 'sent', 0, '2026-06-26 09:07:41', '2026-06-26 09:07:41', '2026-06-26 09:07:41'),
(916, 13, NULL, 'late_private', NULL, '⚠️ <b>ជូនដំណឹងមកយឺត</b>\n\n👤 បុគ្គលិក: Chean Aleav\n🆔 លេខសម្គាល់: ACC003\n🕘 ម៉ោងចូល: 09:07 AM\n⏳ យឺតចំនួន: 7m 35s\n💰 កាត់ប្រាក់: $0.00\n\nស្ថានភាព: មកយឺត', NULL, NULL, NULL, 'sent', 0, '2026-06-26 09:07:42', '2026-06-26 09:07:42', '2026-06-26 09:07:42'),
(917, 17, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 09:16 AM\n📅 ថ្ងៃទី: 26 Jun 2026\n\n⚠️ ស្ថានភាព: មកយឺត\n⏳ យឺតចំនួន: 16m 29s', NULL, NULL, NULL, 'sent', 0, '2026-06-26 09:16:34', '2026-06-26 09:16:34', '2026-06-26 09:16:34'),
(918, 17, NULL, 'late_private', NULL, '⚠️ <b>ជូនដំណឹងមកយឺត</b>\n\n👤 បុគ្គលិក: Phal Panha\n🆔 លេខសម្គាល់: DL002\n🕘 ម៉ោងចូល: 09:16 AM\n⏳ យឺតចំនួន: 16m 29s\n💰 កាត់ប្រាក់: $0.00\n\nស្ថានភាព: មកយឺត', NULL, NULL, NULL, 'sent', 0, '2026-06-26 09:16:36', '2026-06-26 09:16:36', '2026-06-26 09:16:36'),
(919, 5, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 09:18 AM\n📅 ថ្ងៃទី: 26 Jun 2026\n\n⚠️ ស្ថានភាព: មកយឺត\n⏳ យឺតចំនួន: 18m 7s', NULL, NULL, NULL, 'sent', 0, '2026-06-26 09:18:11', '2026-06-26 09:18:11', '2026-06-26 09:18:11'),
(920, 5, NULL, 'late_private', NULL, '⚠️ <b>ជូនដំណឹងមកយឺត</b>\n\n👤 បុគ្គលិក: Sorn Pugnavan\n🆔 លេខសម្គាល់: MK002\n🕘 ម៉ោងចូល: 09:18 AM\n⏳ យឺតចំនួន: 18m 7s\n💰 កាត់ប្រាក់: $0.00\n\nស្ថានភាព: មកយឺត', NULL, NULL, NULL, 'sent', 0, '2026-06-26 09:18:13', '2026-06-26 09:18:13', '2026-06-26 09:18:13'),
(921, 19, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 09:21 AM\n📅 ថ្ងៃទី: 26 Jun 2026\n\n⚠️ ស្ថានភាព: មកយឺត\n⏳ យឺតចំនួន: 21m 52s', NULL, NULL, NULL, 'sent', 0, '2026-06-26 09:21:56', '2026-06-26 09:21:56', '2026-06-26 09:21:56'),
(922, 19, NULL, 'late_private', NULL, '⚠️ <b>ជូនដំណឹងមកយឺត</b>\n\n👤 បុគ្គលិក: Heng Laiheang\n🆔 លេខសម្គាល់: acc008\n🕘 ម៉ោងចូល: 09:21 AM\n⏳ យឺតចំនួន: 21m 52s\n💰 កាត់ប្រាក់: $0.00\n\nស្ថានភាព: មកយឺត', NULL, NULL, NULL, 'sent', 0, '2026-06-26 09:21:58', '2026-06-26 09:21:58', '2026-06-26 09:21:58'),
(923, 6, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 09:35 AM\n📅 ថ្ងៃទី: 26 Jun 2026\n\n⚠️ ស្ថានភាព: មកយឺត\n⏳ យឺតចំនួន: 35m 43s', NULL, NULL, NULL, 'failed', 0, NULL, '2026-06-26 09:35:47', '2026-06-26 09:35:47'),
(924, 6, NULL, 'late_private', NULL, '⚠️ <b>ជូនដំណឹងមកយឺត</b>\n\n👤 បុគ្គលិក: Gak Vicheka\n🆔 លេខសម្គាល់: DSI004\n🕘 ម៉ោងចូល: 09:35 AM\n⏳ យឺតចំនួន: 35m 43s\n💰 កាត់ប្រាក់: $1.50\n\nស្ថានភាព: មកយឺត', NULL, NULL, NULL, 'failed', 0, NULL, '2026-06-26 09:35:52', '2026-06-26 09:35:52'),
(925, 3, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 09:42 AM\n📅 ថ្ងៃទី: 26 Jun 2026\n\n⚠️ ស្ថានភាព: មកយឺត\n⏳ យឺតចំនួន: 42m 2s', NULL, NULL, NULL, 'sent', 0, '2026-06-26 09:42:06', '2026-06-26 09:42:06', '2026-06-26 09:42:06'),
(926, 3, NULL, 'late_private', NULL, '⚠️ <b>ជូនដំណឹងមកយឺត</b>\n\n👤 បុគ្គលិក: Po Tilino\n🆔 លេខសម្គាល់: DSI003\n🕘 ម៉ោងចូល: 09:42 AM\n⏳ យឺតចំនួន: 42m 2s\n💰 កាត់ប្រាក់: $1.50\n\nស្ថានភាព: មកយឺត', NULL, NULL, NULL, 'sent', 0, '2026-06-26 09:42:09', '2026-06-26 09:42:09', '2026-06-26 09:42:09');
INSERT INTO `telegram_logs` (`id`, `employee_id`, `customer_visit_id`, `message_type`, `event_key`, `telegram_message`, `selfie_url`, `store_photo_url`, `error_message`, `status`, `attempts`, `sent_at`, `created_at`, `updated_at`) VALUES
(927, 21, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 10:11 AM\n📅 ថ្ងៃទី: 26 Jun 2026\n\n⚠️ ស្ថានភាព: មកយឺត\n⏳ យឺតចំនួន: 1h 11m 49s', NULL, NULL, NULL, 'sent', 0, '2026-06-26 10:11:53', '2026-06-26 10:11:53', '2026-06-26 10:11:53'),
(928, 21, NULL, 'late_private', NULL, '⚠️ <b>ជូនដំណឹងមកយឺត</b>\n\n👤 បុគ្គលិក: Van\n🆔 លេខសម្គាល់: DL003\n🕘 ម៉ោងចូល: 10:11 AM\n⏳ យឺតចំនួន: 1h 11m 49s\n💰 កាត់ប្រាក់: $0.00\n\nស្ថានភាព: មកយឺត', NULL, NULL, NULL, 'sent', 0, '2026-06-26 10:11:56', '2026-06-26 10:11:56', '2026-06-26 10:11:56'),
(929, 16, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 08:03 AM\n🕘 ចេញម៉ោង: 05:03 PM\n📅 ថ្ងៃទី: 26 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 09h 00m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-26 17:03:59', '2026-06-26 17:03:59', '2026-06-26 17:03:59'),
(930, 6, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 09:35 AM\n🕘 ចេញម៉ោង: 05:07 PM\n📅 ថ្ងៃទី: 26 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 07h 31m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'failed', 0, NULL, '2026-06-26 17:07:24', '2026-06-26 17:07:24'),
(931, 8, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 08:19 AM\n🕘 ចេញម៉ោង: 05:12 PM\n📅 ថ្ងៃទី: 26 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 08h 52m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-26 17:12:28', '2026-06-26 17:12:28', '2026-06-26 17:12:28'),
(932, 5, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 09:18 AM\n🕘 ចេញម៉ោង: 05:34 PM\n📅 ថ្ងៃទី: 26 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 08h 16m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-26 17:34:49', '2026-06-26 17:34:49', '2026-06-26 17:34:49'),
(933, 15, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 08:49 AM\n🕘 ចេញម៉ោង: 05:42 PM\n📅 ថ្ងៃទី: 26 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 08h 52m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'failed', 0, NULL, '2026-06-26 17:42:37', '2026-06-26 17:42:37'),
(934, 3, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 09:42 AM\n🕘 ចេញម៉ោង: 05:45 PM\n📅 ថ្ងៃទី: 26 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 08h 03m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-26 17:45:24', '2026-06-26 17:45:24', '2026-06-26 17:45:24'),
(935, 14, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 09:07 AM\n🕘 ចេញម៉ោង: 06:05 PM\n📅 ថ្ងៃទី: 26 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 08h 58m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-26 18:05:46', '2026-06-26 18:05:46', '2026-06-26 18:05:46'),
(936, 13, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 09:07 AM\n🕘 ចេញម៉ោង: 06:11 PM\n📅 ថ្ងៃទី: 26 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 09h 04m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-26 18:11:40', '2026-06-26 18:11:40', '2026-06-26 18:11:40'),
(937, 12, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 09:06 AM\n🕘 ចេញម៉ោង: 06:12 PM\n📅 ថ្ងៃទី: 26 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 09h 05m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-26 18:12:22', '2026-06-26 18:12:22', '2026-06-26 18:12:22'),
(938, 19, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 09:21 AM\n🕘 ចេញម៉ោង: 06:12 PM\n📅 ថ្ងៃទី: 26 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 08h 50m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-26 18:12:50', '2026-06-26 18:12:50', '2026-06-26 18:12:50'),
(939, 9, NULL, 'check_out_private', NULL, '🚪 <b>អ្នកបានចេញពីការងារ</b>\n\n🕘 ចូលម៉ោង: 08:30 AM\n🕘 ចេញម៉ោង: 06:13 PM\n📅 ថ្ងៃទី: 26 Jun 2026\n\n⏳ ម៉ោងធ្វើការ: 09h 42m\n📌 ស្ថានភាព: បញ្ចប់ការងារ', NULL, NULL, NULL, 'sent', 0, '2026-06-26 18:13:12', '2026-06-26 18:13:12', '2026-06-26 18:13:12'),
(940, 16, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:32 AM\n📅 ថ្ងៃទី: 27 Jun 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-06-27 08:32:08', '2026-06-27 08:32:08', '2026-06-27 08:32:08'),
(941, 9, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 08:41 AM\n📅 ថ្ងៃទី: 27 Jun 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-06-27 08:41:41', '2026-06-27 08:41:41', '2026-06-27 08:41:41'),
(942, 8, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 09:01 AM\n📅 ថ្ងៃទី: 27 Jun 2026\n\n⚠️ ស្ថានភាព: មកយឺត\n⏳ យឺតចំនួន: 1m 7s', NULL, NULL, NULL, 'sent', 0, '2026-06-27 09:01:12', '2026-06-27 09:01:12', '2026-06-27 09:01:12'),
(943, 8, NULL, 'late_private', NULL, '⚠️ <b>ជូនដំណឹងមកយឺត</b>\n\n👤 បុគ្គលិក: Yorn Lyna\n🆔 លេខសម្គាល់: IS006\n🕘 ម៉ោងចូល: 09:01 AM\n⏳ យឺតចំនួន: 1m 7s\n💰 កាត់ប្រាក់: $0.00\n\nស្ថានភាព: មកយឺត', NULL, NULL, NULL, 'sent', 0, '2026-06-27 09:01:13', '2026-06-27 09:01:13', '2026-06-27 09:01:13'),
(944, 14, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 09:16 AM\n📅 ថ្ងៃទី: 27 Jun 2026\n\n⚠️ ស្ថានភាព: មកយឺត\n⏳ យឺតចំនួន: 16m 37s', NULL, NULL, NULL, 'sent', 0, '2026-06-27 09:16:41', '2026-06-27 09:16:41', '2026-06-27 09:16:41'),
(945, 14, NULL, 'late_private', NULL, '⚠️ <b>ជូនដំណឹងមកយឺត</b>\n\n👤 បុគ្គលិក: Outh Kimnai\n🆔 លេខសម្គាល់: MK001\n🕘 ម៉ោងចូល: 09:16 AM\n⏳ យឺតចំនួន: 16m 37s\n💰 កាត់ប្រាក់: $0.00\n\nស្ថានភាព: មកយឺត', NULL, NULL, NULL, 'sent', 0, '2026-06-27 09:16:43', '2026-06-27 09:16:43', '2026-06-27 09:16:43'),
(946, 5, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 09:23 AM\n📅 ថ្ងៃទី: 27 Jun 2026\n\n⚠️ ស្ថានភាព: មកយឺត\n⏳ យឺតចំនួន: 23m 21s', NULL, NULL, NULL, 'sent', 0, '2026-06-27 09:23:24', '2026-06-27 09:23:24', '2026-06-27 09:23:24'),
(947, 5, NULL, 'late_private', NULL, '⚠️ <b>ជូនដំណឹងមកយឺត</b>\n\n👤 បុគ្គលិក: Sorn Pugnavan\n🆔 លេខសម្គាល់: MK002\n🕘 ម៉ោងចូល: 09:23 AM\n⏳ យឺតចំនួន: 23m 21s\n💰 កាត់ប្រាក់: $0.00\n\nស្ថានភាព: មកយឺត', NULL, NULL, NULL, 'sent', 0, '2026-06-27 09:23:26', '2026-06-27 09:23:26', '2026-06-27 09:23:26'),
(948, 4, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 09:24 AM\n📅 ថ្ងៃទី: 27 Jun 2026\n\n✅ ស្ថានភាព: វត្តមាន', NULL, NULL, NULL, 'sent', 0, '2026-06-27 09:24:44', '2026-06-27 09:24:44', '2026-06-27 09:24:44'),
(949, 3, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 09:29 AM\n📅 ថ្ងៃទី: 27 Jun 2026\n\n⚠️ ស្ថានភាព: មកយឺត\n⏳ យឺតចំនួន: 29m 37s', NULL, NULL, NULL, 'sent', 0, '2026-06-27 09:29:41', '2026-06-27 09:29:41', '2026-06-27 09:29:41'),
(950, 3, NULL, 'late_private', NULL, '⚠️ <b>ជូនដំណឹងមកយឺត</b>\n\n👤 បុគ្គលិក: Po Tilino\n🆔 លេខសម្គាល់: DSI003\n🕘 ម៉ោងចូល: 09:29 AM\n⏳ យឺតចំនួន: 29m 37s\n💰 កាត់ប្រាក់: $0.00\n\nស្ថានភាព: មកយឺត', NULL, NULL, NULL, 'sent', 0, '2026-06-27 09:29:43', '2026-06-27 09:29:43', '2026-06-27 09:29:43'),
(951, 12, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 09:33 AM\n📅 ថ្ងៃទី: 27 Jun 2026\n\n⚠️ ស្ថានភាព: មកយឺត\n⏳ យឺតចំនួន: 33m 18s', NULL, NULL, NULL, 'sent', 0, '2026-06-27 09:33:21', '2026-06-27 09:33:21', '2026-06-27 09:33:21'),
(952, 12, NULL, 'late_private', NULL, '⚠️ <b>ជូនដំណឹងមកយឺត</b>\n\n👤 បុគ្គលិក: Chu Kimhorng\n🆔 លេខសម្គាល់: ACC005\n🕘 ម៉ោងចូល: 09:33 AM\n⏳ យឺតចំនួន: 33m 18s\n💰 កាត់ប្រាក់: $1.50\n\nស្ថានភាព: មកយឺត', NULL, NULL, NULL, 'sent', 0, '2026-06-27 09:33:24', '2026-06-27 09:33:24', '2026-06-27 09:33:24'),
(953, 13, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 09:33 AM\n📅 ថ្ងៃទី: 27 Jun 2026\n\n⚠️ ស្ថានភាព: មកយឺត\n⏳ យឺតចំនួន: 33m 56s', NULL, NULL, NULL, 'sent', 0, '2026-06-27 09:34:00', '2026-06-27 09:34:00', '2026-06-27 09:34:00'),
(954, 13, NULL, 'late_private', NULL, '⚠️ <b>ជូនដំណឹងមកយឺត</b>\n\n👤 បុគ្គលិក: Chean Aleav\n🆔 លេខសម្គាល់: ACC003\n🕘 ម៉ោងចូល: 09:33 AM\n⏳ យឺតចំនួន: 33m 56s\n💰 កាត់ប្រាក់: $1.50\n\nស្ថានភាព: មកយឺត', NULL, NULL, NULL, 'sent', 0, '2026-06-27 09:34:02', '2026-06-27 09:34:02', '2026-06-27 09:34:02'),
(955, 15, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 09:35 AM\n📅 ថ្ងៃទី: 27 Jun 2026\n\n⚠️ ស្ថានភាព: មកយឺត\n⏳ យឺតចំនួន: 35m 0s', NULL, NULL, NULL, 'failed', 0, NULL, '2026-06-27 09:35:04', '2026-06-27 09:35:04'),
(956, 15, NULL, 'late_private', NULL, '⚠️ <b>ជូនដំណឹងមកយឺត</b>\n\n👤 បុគ្គលិក: Mang Leanghort\n🆔 លេខសម្គាល់: ACC006\n🕘 ម៉ោងចូល: 09:35 AM\n⏳ យឺតចំនួន: 35m 0s\n💰 កាត់ប្រាក់: $1.50\n\nស្ថានភាព: មកយឺត', NULL, NULL, NULL, 'failed', 0, NULL, '2026-06-27 09:35:07', '2026-06-27 09:35:07'),
(957, 21, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 09:39 AM\n📅 ថ្ងៃទី: 27 Jun 2026\n\n⚠️ ស្ថានភាព: មកយឺត\n⏳ យឺតចំនួន: 39m 44s', NULL, NULL, NULL, 'sent', 0, '2026-06-27 09:39:48', '2026-06-27 09:39:48', '2026-06-27 09:39:48'),
(958, 21, NULL, 'late_private', NULL, '⚠️ <b>ជូនដំណឹងមកយឺត</b>\n\n👤 បុគ្គលិក: Van\n🆔 លេខសម្គាល់: DL003\n🕘 ម៉ោងចូល: 09:39 AM\n⏳ យឺតចំនួន: 39m 44s\n💰 កាត់ប្រាក់: $0.00\n\nស្ថានភាព: មកយឺត', NULL, NULL, NULL, 'sent', 0, '2026-06-27 09:39:50', '2026-06-27 09:39:50', '2026-06-27 09:39:50'),
(959, 17, NULL, 'check_in_private', NULL, '✅ <b>អ្នកបានចូលធ្វើការ</b>\n\n🕘 ម៉ោង: 11:11 AM\n📅 ថ្ងៃទី: 27 Jun 2026\n\n⚠️ ស្ថានភាព: មកយឺត\n⏳ យឺតចំនួន: 2h 11m 9s', NULL, NULL, NULL, 'sent', 0, '2026-06-27 11:11:13', '2026-06-27 11:11:13', '2026-06-27 11:11:13'),
(960, 17, NULL, 'late_private', NULL, '⚠️ <b>ជូនដំណឹងមកយឺត</b>\n\n👤 បុគ្គលិក: Phal Panha\n🆔 លេខសម្គាល់: DL002\n🕘 ម៉ោងចូល: 11:11 AM\n⏳ យឺតចំនួន: 2h 11m 9s\n💰 កាត់ប្រាក់: $0.00\n\nស្ថានភាព: មកយឺត', NULL, NULL, NULL, 'sent', 0, '2026-06-27 11:11:16', '2026-06-27 11:11:16', '2026-06-27 11:11:16');

-- --------------------------------------------------------

--
-- Table structure for table `telegram_settings`
--

CREATE TABLE `telegram_settings` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `bot_token` text DEFAULT NULL,
  `chat_id` varchar(255) DEFAULT NULL,
  `webhook_url` varchar(255) DEFAULT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'disconnected',
  `last_notification_sent_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `telegram_settings`
--

INSERT INTO `telegram_settings` (`id`, `bot_token`, `chat_id`, `webhook_url`, `status`, `last_notification_sent_at`, `created_at`, `updated_at`) VALUES
(1, '8852050624:AAHUN09RfXfQPwZoy_HGV1pwuflGVcRZwg4', '-1003789239970', 'https://lightgoldenrodyellow-mantis-338653.hostingersite.com/api/telegram/webhook', 'connected', '2026-05-18 22:56:35', '2026-05-18 18:36:57', '2026-05-20 17:52:19');

-- --------------------------------------------------------

--
-- Table structure for table `telegram_templates`
--

CREATE TABLE `telegram_templates` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `type` varchar(255) NOT NULL,
  `message_template` text NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `telegram_templates`
--

INSERT INTO `telegram_templates` (`id`, `type`, `message_template`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'check_in_success', '✅ បានចូលធ្វើការ\n\n👤 បុគ្គលិក: {name}\n🆔 លេខសម្គាល់បុគ្គលិក: {employee_id}\n🏢 ផ្នែក: {department}\n\n📅 កាលបរិច្ឆេទ: {date}\n🕘 ម៉ោងចូល: {check_in}\n📍 ទីតាំង: {location}\n\n📡 ស្ថានភាព GPS: បានផ្ទៀងផ្ទាត់\n\nស្ថានភាព: {status}', 1, '2026-05-18 18:36:57', '2026-05-18 18:37:03'),
(2, 'check_out_success', '🚪 បានចេញពីធ្វើការ\n\n👤 បុគ្គលិក: {name}\n🆔 លេខសម្គាល់បុគ្គលិក: {employee_id}\n\n📅 កាលបរិច្ឆេទ: {date}\n🕔 ម៉ោងចេញ: {check_out}\n⏱ ម៉ោងធ្វើការ: {working_hours}\n\n📍 ទីតាំង: {location}\n\nស្ថានភាព: បានបញ្ចប់', 1, '2026-05-18 18:36:57', '2026-05-18 18:37:03'),
(3, 'late_attendance', '⚠️ ជូនដំណឹងមកយឺត\n\n👤 បុគ្គលិក: {name}\n🆔 លេខសម្គាល់បុគ្គលិក: {employee_id}\n\n🕘 ម៉ោងចូល: {check_in}\n⌛ យឺតចំនួន: {late_minutes} នាទី\n💰 កាត់ប្រាក់: ${deduction_amount}\n\n📍 ទីតាំង: {location}\n\nស្ថានភាព: មកយឺត', 1, '2026-05-18 18:36:57', '2026-05-18 18:37:04'),
(4, 'permission_request', '📝 សំណើសុំអនុញ្ញាតថ្មី\n\n👤 បុគ្គលិក: {name}\n🆔 លេខសម្គាល់បុគ្គលិក: {employee_id}\n\n📌 ប្រភេទសំណើ: {request_type}\n📅 កាលបរិច្ឆេទ: {date}\n\n📝 មូលហេតុ:\n{reason}\n\n⏳ ស្ថានភាព: រង់ចាំអនុម័ត', 1, '2026-05-18 18:36:57', '2026-05-18 18:37:04');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `role_id` bigint(20) UNSIGNED DEFAULT NULL,
  `employee_id` bigint(20) UNSIGNED DEFAULT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'active',
  `last_login_at` timestamp NULL DEFAULT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `email_verified_at`, `password`, `role_id`, `employee_id`, `status`, `last_login_at`, `remember_token`, `created_at`, `updated_at`) VALUES
(1, 'Super Admin', 'superadmin@shadow.com', NULL, '$2y$12$9RC20aQ1aZZCWa1DyYeQAuQfCCBKLjdbWPRzaniwQU6Wpby8PhvEy', 1, 1, 'active', '2026-06-16 10:28:08', NULL, '2026-05-18 18:36:32', '2026-06-16 10:28:08'),
(2, 'Admin User', 'admin@shadow.com', NULL, '$2y$12$azyayFHnfmFNcbDUQ0yAM.j/rCl8CUKAUUAZQ4auXa0I8NB9FWvFO', 2, 2, 'active', '2026-05-24 21:00:12', NULL, '2026-05-18 18:36:33', '2026-05-24 21:00:12'),
(3, 'DSI003', 'employee-3@no-email.attendance.local', NULL, '$2y$12$KWTPhMY15jIEJfDzzEPGbugeaAhLSj10ZDqgjekwGDYVBL1FfuWA6', 7, 3, 'active', '2026-05-19 08:59:19', NULL, '2026-05-18 21:51:56', '2026-05-19 08:59:19'),
(4, 'AI001', 'employee-4@no-email.attendance.local', NULL, '$2y$12$.p2MIE5qg1B.SKMHDbFuKeSYVJLDe5gAZV2AjiIK8wcourbU9w8b.', 7, 4, 'active', '2026-05-29 22:43:59', NULL, '2026-05-18 21:57:09', '2026-05-29 22:43:59'),
(5, 'MK002', 'employee-5@no-email.attendance.local', NULL, '$2y$12$ccmaHjot4Qe3MbCNyR59v.vTvjnlQlQ8G44DQ1SdlSkVS5t5F5oIu', 7, 5, 'active', '2026-05-28 08:50:23', NULL, '2026-05-18 22:00:49', '2026-05-28 08:50:23'),
(6, 'DSI004', 'employee-6@no-email.attendance.local', NULL, '$2y$12$RJ65EPgLTinVXeRHdFk1V.sateQLLptdUg3SVrLRyLbyuqCyQBCIa', 7, 6, 'active', '2026-06-15 09:18:30', NULL, '2026-05-18 22:02:14', '2026-06-15 09:18:30'),
(7, 'GM002', 'employee-7@no-email.attendance.local', NULL, '$2y$12$tUTQk5Uzf0cIxF2d7MB48u2D7hICblmLfVk3G/eLUps0edRKePg.O', 7, 7, 'active', NULL, NULL, '2026-05-18 22:03:14', '2026-05-18 22:03:14'),
(8, 'IS006', 'employee-8@no-email.attendance.local', NULL, '$2y$12$18e7T9WaPOJDwfPKJvvWSegVcDh/CkAJ/pRvteGziP.lJ2dYnce6.', 7, 8, 'active', '2026-05-25 09:18:16', NULL, '2026-05-18 22:04:20', '2026-05-25 09:18:16'),
(9, 'IS001', 'employee-9@no-email.attendance.local', NULL, '$2y$12$4zsYCBewa8Ay5f4bSRcKTuzM1bui3SS15nos51kjidw0yTprnllOS', 7, 9, 'active', '2026-06-16 20:38:35', NULL, '2026-05-18 22:05:04', '2026-06-16 20:38:35'),
(10, 'PS002', 'employee-10@no-email.attendance.local', NULL, '$2y$12$yguglV9JCkab6SxpWHZA6eWGt8cii3M0JCff9.TRvLklyI/KP8SBe', 6, 10, 'active', '2026-06-06 09:13:50', NULL, '2026-05-18 22:06:00', '2026-06-08 17:07:42'),
(11, 'DL001', 'employee-11@no-email.attendance.local', NULL, '$2y$12$5QefnWYNCi7fXD2aHMhs3u9PtihepnjcdqS0wuEoDpbIS5znsk.W6', 6, 11, 'active', '2026-05-26 08:57:35', NULL, '2026-05-18 22:09:55', '2026-05-26 08:57:35'),
(12, 'ACC005', 'employee-12@no-email.attendance.local', NULL, '$2y$12$ftZFB5fyi0Cis08BFKM7qeysWpOMGATHRP.R.ddbYCap/L1/yQhMq', 7, 12, 'active', '2026-05-29 09:29:11', NULL, '2026-05-18 22:11:54', '2026-05-29 09:29:11'),
(13, 'ACC003', 'employee-13@no-email.attendance.local', NULL, '$2y$12$5iNYy967uluM9gPwJIXlpuqxW6xWE6MQu2brcb/pLISbr2vnF6w62', 7, 13, 'active', '2026-05-28 08:52:31', NULL, '2026-05-18 22:14:16', '2026-05-28 08:52:31'),
(14, 'MK001', 'employee-14@no-email.attendance.local', NULL, '$2y$12$gc65YgiCNz14JSFGtG3X7eef3bizu7MUCGBsGQxoK/5ON418YYtom', 7, 14, 'active', '2026-06-20 17:49:21', NULL, '2026-05-18 22:15:14', '2026-06-20 17:49:21'),
(15, 'ACC006', 'employee-15@no-email.attendance.local', NULL, '$2y$12$ELoqYAe1/Hs.0kdpGCcqbur4QpOAieBpfx8Md4xOAgnvQU2EYy2.G', 7, 15, 'active', '2026-06-23 09:09:00', NULL, '2026-05-18 22:16:28', '2026-06-23 09:09:00'),
(16, 'ACC007', 'employee-16@no-email.attendance.local', NULL, '$2y$12$9mJFv2.2Mc7c9CaY/i92AeiJVSWiZ/7Sx5OS3OLRoLtrx1GRpkro.', 7, 16, 'active', '2026-05-27 17:21:34', NULL, '2026-05-18 22:17:38', '2026-05-27 17:21:34'),
(17, 'DL002', 'employee-17@no-email.attendance.local', NULL, '$2y$12$KWt/EFXL3WTpL/ro4UBUguB5el//pB/XJBRHoFLUlTBv1klPiMFRu', 6, 17, 'active', '2026-06-02 15:56:43', NULL, '2026-05-18 22:23:36', '2026-06-02 15:56:43'),
(18, 'PG002', 'employee-18@no-email.attendance.local', NULL, '$2y$12$UJraOsv/9rp7ncazyySid.tzx5hH/yNisKzjnTDOUsgo1np.sI2Aa', 6, 18, 'active', '2026-05-21 21:42:37', NULL, '2026-05-21 21:38:48', '2026-05-21 21:42:37'),
(19, 'acc008', 'employee-19@no-email.attendance.local', NULL, '$2y$12$fki7Jpkh3f12NDRT49h.vuP6JlhxERXwkDWgcQsq2Kq6bufcZ0JBC', 7, 19, 'active', '2026-06-08 16:37:10', NULL, '2026-05-24 09:35:24', '2026-06-08 16:37:10'),
(20, 'test123', 'employee-20@no-email.attendance.local', NULL, '$2y$12$vHjCTBcrRJI67A5jtUByqen.Su6700c2DOqeZoOA0VKw1o1w35rie', 7, 20, 'active', '2026-05-29 22:45:55', NULL, '2026-05-24 20:10:15', '2026-05-29 22:45:55'),
(21, 'DL003', 'employee-21@no-email.attendance.local', NULL, '$2y$12$oj7w3cZ.DKFU.4abGIaPB.5ODXhXj1QH8P4n8Z.6B0XvqUwRmOckq', 6, 21, 'active', '2026-06-13 09:24:48', NULL, '2026-05-24 20:21:45', '2026-06-13 09:24:48');

-- --------------------------------------------------------

--
-- Table structure for table `work_schedules`
--

CREATE TABLE `work_schedules` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `schedule_name` varchar(255) NOT NULL,
  `monday_start` time DEFAULT NULL,
  `monday_end` time DEFAULT NULL,
  `tuesday_start` time DEFAULT NULL,
  `tuesday_end` time DEFAULT NULL,
  `wednesday_start` time DEFAULT NULL,
  `wednesday_end` time DEFAULT NULL,
  `thursday_start` time DEFAULT NULL,
  `thursday_end` time DEFAULT NULL,
  `friday_start` time DEFAULT NULL,
  `friday_end` time DEFAULT NULL,
  `saturday_start` time DEFAULT NULL,
  `saturday_end` time DEFAULT NULL,
  `sunday_start` time DEFAULT NULL,
  `sunday_end` time DEFAULT NULL,
  `break_time_minutes` int(11) NOT NULL DEFAULT 60,
  `is_default` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `work_schedules`
--

INSERT INTO `work_schedules` (`id`, `schedule_name`, `monday_start`, `monday_end`, `tuesday_start`, `tuesday_end`, `wednesday_start`, `wednesday_end`, `thursday_start`, `thursday_end`, `friday_start`, `friday_end`, `saturday_start`, `saturday_end`, `sunday_start`, `sunday_end`, `break_time_minutes`, `is_default`, `created_at`, `updated_at`) VALUES
(1, 'Shadow Group', '08:00:00', '17:00:00', '08:00:00', '17:00:00', '08:00:00', '17:00:00', '08:00:00', '17:00:00', '08:00:00', '17:00:00', '08:00:00', '17:00:00', '11:30:00', '17:00:00', 60, 1, '2026-05-18 18:36:54', '2026-05-31 13:20:32'),
(2, 'Mon-Sat', '08:00:00', '17:00:00', '08:00:00', '17:00:00', '08:00:00', '17:00:00', '08:00:00', '17:00:00', '08:00:00', '17:00:00', '08:00:00', '17:00:00', NULL, NULL, 60, 0, '2026-05-18 21:45:21', '2026-05-18 21:45:21'),
(3, 'Part Time', '12:00:00', '17:00:00', '12:00:00', '17:00:00', '12:00:00', '17:00:00', '20:00:00', '17:00:00', '12:00:00', '17:00:00', '12:00:00', '17:00:00', NULL, NULL, 60, 0, '2026-05-21 21:02:52', '2026-05-23 10:03:00'),
(4, 'Sale offline', '08:00:00', '17:00:00', '08:00:00', '17:00:00', '08:00:00', '17:00:00', '08:00:00', '17:00:00', '08:00:00', '17:00:00', '08:00:00', '17:00:00', '08:00:00', '17:00:00', 60, 0, '2026-05-24 20:33:16', '2026-05-24 20:33:16');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `attendance`
--
ALTER TABLE `attendance`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `attendance_employee_id_attendance_date_unique` (`employee_id`,`attendance_date`),
  ADD UNIQUE KEY `attendance_offline_sync_uuid_unique` (`offline_sync_uuid`),
  ADD KEY `attendance_branch_id_foreign` (`branch_id`),
  ADD KEY `attendance_employee_id_attendance_date_status_index` (`employee_id`,`attendance_date`,`status`),
  ADD KEY `attendance_attendance_date_index` (`attendance_date`),
  ADD KEY `attendance_type_index` (`type`),
  ADD KEY `attendance_status_index` (`status`),
  ADD KEY `attendance_qr_code_index` (`qr_code`);

--
-- Indexes for table `attendance_logs`
--
ALTER TABLE `attendance_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `attendance_logs_edited_by_foreign` (`edited_by`),
  ADD KEY `attendance_logs_attendance_id_edited_by_index` (`attendance_id`,`edited_by`);

--
-- Indexes for table `attendance_rules`
--
ALTER TABLE `attendance_rules`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `bonus_rules`
--
ALTER TABLE `bonus_rules`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `bonus_settings`
--
ALTER TABLE `bonus_settings`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `branches`
--
ALTER TABLE `branches`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `branches_code_unique` (`code`),
  ADD KEY `branches_status_index` (`status`);

--
-- Indexes for table `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`),
  ADD KEY `cache_expiration_index` (`expiration`);

--
-- Indexes for table `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`),
  ADD KEY `cache_locks_expiration_index` (`expiration`);

--
-- Indexes for table `customer_visits`
--
ALTER TABLE `customer_visits`
  ADD PRIMARY KEY (`id`),
  ADD KEY `customer_visits_employee_id_check_in_at_index` (`employee_id`,`check_in_at`),
  ADD KEY `customer_visits_status_index` (`status`),
  ADD KEY `customer_visits_province_index` (`province`);

--
-- Indexes for table `deduction_rules`
--
ALTER TABLE `deduction_rules`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `departments`
--
ALTER TABLE `departments`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `departments_code_unique` (`code`),
  ADD KEY `departments_status_index` (`status`);

--
-- Indexes for table `employees`
--
ALTER TABLE `employees`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `employees_employee_code_unique` (`employee_code`),
  ADD KEY `employees_position_id_foreign` (`position_id`),
  ADD KEY `employees_branch_id_foreign` (`branch_id`),
  ADD KEY `employees_department_id_position_id_branch_id_index` (`department_id`,`position_id`,`branch_id`),
  ADD KEY `employees_status_index` (`status`);

--
-- Indexes for table `employee_bonuses`
--
ALTER TABLE `employee_bonuses`
  ADD PRIMARY KEY (`id`),
  ADD KEY `employee_bonuses_bonus_rule_id_foreign` (`bonus_rule_id`),
  ADD KEY `employee_bonuses_approved_by_foreign` (`approved_by`),
  ADD KEY `employee_bonuses_employee_id_month_index` (`employee_id`,`month`),
  ADD KEY `employee_bonuses_status_index` (`status`);

--
-- Indexes for table `employee_schedules`
--
ALTER TABLE `employee_schedules`
  ADD PRIMARY KEY (`id`),
  ADD KEY `employee_schedules_employee_id_foreign` (`employee_id`),
  ADD KEY `employee_schedules_schedule_id_foreign` (`schedule_id`);

--
-- Indexes for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Indexes for table `gps_locations`
--
ALTER TABLE `gps_locations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `gps_locations_attendance_id_foreign` (`attendance_id`),
  ADD KEY `gps_locations_customer_visit_id_foreign` (`customer_visit_id`),
  ADD KEY `gps_locations_employee_id_recorded_at_index` (`employee_id`,`recorded_at`),
  ADD KEY `gps_locations_recorded_at_index` (`recorded_at`),
  ADD KEY `gps_locations_source_index` (`source`);

--
-- Indexes for table `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Indexes for table `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `late_deduction_rules`
--
ALTER TABLE `late_deduction_rules`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `late_deduction_rule_work_schedule`
--
ALTER TABLE `late_deduction_rule_work_schedule`
  ADD PRIMARY KEY (`late_deduction_rule_id`,`work_schedule_id`),
  ADD KEY `late_deduction_rule_work_schedule_work_schedule_id_foreign` (`work_schedule_id`);

--
-- Indexes for table `late_rules`
--
ALTER TABLE `late_rules`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `notifications_user_id_foreign` (`user_id`),
  ADD KEY `notifications_type_index` (`type`),
  ADD KEY `notifications_read_at_index` (`read_at`);

--
-- Indexes for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `payrolls`
--
ALTER TABLE `payrolls`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `payrolls_month_unique` (`month`),
  ADD KEY `payrolls_generated_by_foreign` (`generated_by`),
  ADD KEY `payrolls_approved_by_foreign` (`approved_by`),
  ADD KEY `payrolls_paid_by_foreign` (`paid_by`);

--
-- Indexes for table `payroll_items`
--
ALTER TABLE `payroll_items`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `payroll_items_payroll_id_employee_id_unique` (`payroll_id`,`employee_id`),
  ADD KEY `payroll_items_employee_id_foreign` (`employee_id`),
  ADD KEY `payroll_items_salary_setup_id_foreign` (`salary_setup_id`);

--
-- Indexes for table `payroll_logs`
--
ALTER TABLE `payroll_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `payroll_logs_payroll_id_foreign` (`payroll_id`),
  ADD KEY `payroll_logs_payroll_item_id_foreign` (`payroll_item_id`),
  ADD KEY `payroll_logs_user_id_foreign` (`user_id`);

--
-- Indexes for table `permissions`
--
ALTER TABLE `permissions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `permissions_slug_unique` (`slug`),
  ADD KEY `permissions_group_index` (`group`);

--
-- Indexes for table `permission_requests`
--
ALTER TABLE `permission_requests`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `permission_requests_request_code_unique` (`request_code`),
  ADD KEY `permission_requests_reviewed_by_foreign` (`reviewed_by`),
  ADD KEY `permission_requests_employee_id_request_date_index` (`employee_id`,`request_date`),
  ADD KEY `permission_requests_status_index` (`status`),
  ADD KEY `permission_requests_replacement_employee_id_foreign` (`replacement_employee_id`);

--
-- Indexes for table `permission_role`
--
ALTER TABLE `permission_role`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `permission_role_role_id_permission_id_unique` (`role_id`,`permission_id`),
  ADD KEY `permission_role_permission_id_foreign` (`permission_id`);

--
-- Indexes for table `permission_types`
--
ALTER TABLE `permission_types`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`),
  ADD KEY `personal_access_tokens_expires_at_index` (`expires_at`);

--
-- Indexes for table `positions`
--
ALTER TABLE `positions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `positions_code_unique` (`code`),
  ADD KEY `positions_department_id_foreign` (`department_id`),
  ADD KEY `positions_status_index` (`status`);

--
-- Indexes for table `reports`
--
ALTER TABLE `reports`
  ADD PRIMARY KEY (`id`),
  ADD KEY `reports_employee_id_report_date_index` (`employee_id`,`report_date`),
  ADD KEY `reports_report_date_index` (`report_date`),
  ADD KEY `reports_type_index` (`type`),
  ADD KEY `reports_status_index` (`status`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `roles_slug_unique` (`slug`);

--
-- Indexes for table `role_ip_addresses`
--
ALTER TABLE `role_ip_addresses`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `role_ip_addresses_role_id_ip_address_unique` (`role_id`,`ip_address`);

--
-- Indexes for table `salary_advances`
--
ALTER TABLE `salary_advances`
  ADD PRIMARY KEY (`id`),
  ADD KEY `salary_advances_employee_id_foreign` (`employee_id`),
  ADD KEY `salary_advances_approved_by_foreign` (`approved_by`);

--
-- Indexes for table `salary_setups`
--
ALTER TABLE `salary_setups`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `salary_setups_employee_id_unique` (`employee_id`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Indexes for table `system_settings`
--
ALTER TABLE `system_settings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `system_settings_key_unique` (`key`);

--
-- Indexes for table `telegram_destinations`
--
ALTER TABLE `telegram_destinations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `telegram_destinations_event_key_index` (`event_key`),
  ADD KEY `telegram_destinations_enabled_index` (`enabled`);

--
-- Indexes for table `telegram_logs`
--
ALTER TABLE `telegram_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `telegram_logs_employee_id_foreign` (`employee_id`),
  ADD KEY `telegram_logs_customer_visit_id_foreign` (`customer_visit_id`);

--
-- Indexes for table `telegram_settings`
--
ALTER TABLE `telegram_settings`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `telegram_templates`
--
ALTER TABLE `telegram_templates`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `telegram_templates_type_unique` (`type`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`),
  ADD KEY `users_role_id_index` (`role_id`),
  ADD KEY `users_employee_id_index` (`employee_id`),
  ADD KEY `users_status_index` (`status`);

--
-- Indexes for table `work_schedules`
--
ALTER TABLE `work_schedules`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `attendance`
--
ALTER TABLE `attendance`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=471;

--
-- AUTO_INCREMENT for table `attendance_logs`
--
ALTER TABLE `attendance_logs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=56;

--
-- AUTO_INCREMENT for table `attendance_rules`
--
ALTER TABLE `attendance_rules`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `bonus_rules`
--
ALTER TABLE `bonus_rules`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `bonus_settings`
--
ALTER TABLE `bonus_settings`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `branches`
--
ALTER TABLE `branches`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `customer_visits`
--
ALTER TABLE `customer_visits`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `deduction_rules`
--
ALTER TABLE `deduction_rules`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `departments`
--
ALTER TABLE `departments`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `employees`
--
ALTER TABLE `employees`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `employee_bonuses`
--
ALTER TABLE `employee_bonuses`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `employee_schedules`
--
ALTER TABLE `employee_schedules`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `gps_locations`
--
ALTER TABLE `gps_locations`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=855;

--
-- AUTO_INCREMENT for table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `late_deduction_rules`
--
ALTER TABLE `late_deduction_rules`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `late_rules`
--
ALTER TABLE `late_rules`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=53;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT for table `payrolls`
--
ALTER TABLE `payrolls`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `payroll_items`
--
ALTER TABLE `payroll_items`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `payroll_logs`
--
ALTER TABLE `payroll_logs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `permissions`
--
ALTER TABLE `permissions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=132;

--
-- AUTO_INCREMENT for table `permission_requests`
--
ALTER TABLE `permission_requests`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `permission_role`
--
ALTER TABLE `permission_role`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=304;

--
-- AUTO_INCREMENT for table `permission_types`
--
ALTER TABLE `permission_types`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=256;

--
-- AUTO_INCREMENT for table `positions`
--
ALTER TABLE `positions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `reports`
--
ALTER TABLE `reports`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `role_ip_addresses`
--
ALTER TABLE `role_ip_addresses`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `salary_advances`
--
ALTER TABLE `salary_advances`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `salary_setups`
--
ALTER TABLE `salary_setups`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `system_settings`
--
ALTER TABLE `system_settings`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=53;

--
-- AUTO_INCREMENT for table `telegram_destinations`
--
ALTER TABLE `telegram_destinations`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `telegram_logs`
--
ALTER TABLE `telegram_logs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=961;

--
-- AUTO_INCREMENT for table `telegram_settings`
--
ALTER TABLE `telegram_settings`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `telegram_templates`
--
ALTER TABLE `telegram_templates`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `work_schedules`
--
ALTER TABLE `work_schedules`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `attendance`
--
ALTER TABLE `attendance`
  ADD CONSTRAINT `attendance_branch_id_foreign` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `attendance_employee_id_foreign` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `attendance_logs`
--
ALTER TABLE `attendance_logs`
  ADD CONSTRAINT `attendance_logs_attendance_id_foreign` FOREIGN KEY (`attendance_id`) REFERENCES `attendance` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `attendance_logs_edited_by_foreign` FOREIGN KEY (`edited_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `customer_visits`
--
ALTER TABLE `customer_visits`
  ADD CONSTRAINT `customer_visits_employee_id_foreign` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `employees`
--
ALTER TABLE `employees`
  ADD CONSTRAINT `employees_branch_id_foreign` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `employees_department_id_foreign` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `employees_position_id_foreign` FOREIGN KEY (`position_id`) REFERENCES `positions` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `employee_bonuses`
--
ALTER TABLE `employee_bonuses`
  ADD CONSTRAINT `employee_bonuses_approved_by_foreign` FOREIGN KEY (`approved_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `employee_bonuses_bonus_rule_id_foreign` FOREIGN KEY (`bonus_rule_id`) REFERENCES `bonus_rules` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `employee_bonuses_employee_id_foreign` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `employee_schedules`
--
ALTER TABLE `employee_schedules`
  ADD CONSTRAINT `employee_schedules_employee_id_foreign` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `employee_schedules_schedule_id_foreign` FOREIGN KEY (`schedule_id`) REFERENCES `work_schedules` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `gps_locations`
--
ALTER TABLE `gps_locations`
  ADD CONSTRAINT `gps_locations_attendance_id_foreign` FOREIGN KEY (`attendance_id`) REFERENCES `attendance` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `gps_locations_customer_visit_id_foreign` FOREIGN KEY (`customer_visit_id`) REFERENCES `customer_visits` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `gps_locations_employee_id_foreign` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `late_deduction_rule_work_schedule`
--
ALTER TABLE `late_deduction_rule_work_schedule`
  ADD CONSTRAINT `late_deduction_rule_work_schedule_late_deduction_rule_id_foreign` FOREIGN KEY (`late_deduction_rule_id`) REFERENCES `late_deduction_rules` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `late_deduction_rule_work_schedule_work_schedule_id_foreign` FOREIGN KEY (`work_schedule_id`) REFERENCES `work_schedules` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `notifications_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `payrolls`
--
ALTER TABLE `payrolls`
  ADD CONSTRAINT `payrolls_approved_by_foreign` FOREIGN KEY (`approved_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `payrolls_generated_by_foreign` FOREIGN KEY (`generated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `payrolls_paid_by_foreign` FOREIGN KEY (`paid_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `payroll_items`
--
ALTER TABLE `payroll_items`
  ADD CONSTRAINT `payroll_items_employee_id_foreign` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `payroll_items_payroll_id_foreign` FOREIGN KEY (`payroll_id`) REFERENCES `payrolls` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `payroll_items_salary_setup_id_foreign` FOREIGN KEY (`salary_setup_id`) REFERENCES `salary_setups` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `payroll_logs`
--
ALTER TABLE `payroll_logs`
  ADD CONSTRAINT `payroll_logs_payroll_id_foreign` FOREIGN KEY (`payroll_id`) REFERENCES `payrolls` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `payroll_logs_payroll_item_id_foreign` FOREIGN KEY (`payroll_item_id`) REFERENCES `payroll_items` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `payroll_logs_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `permission_requests`
--
ALTER TABLE `permission_requests`
  ADD CONSTRAINT `permission_requests_employee_id_foreign` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `permission_requests_replacement_employee_id_foreign` FOREIGN KEY (`replacement_employee_id`) REFERENCES `employees` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `permission_requests_reviewed_by_foreign` FOREIGN KEY (`reviewed_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `permission_role`
--
ALTER TABLE `permission_role`
  ADD CONSTRAINT `permission_role_permission_id_foreign` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `permission_role_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `positions`
--
ALTER TABLE `positions`
  ADD CONSTRAINT `positions_department_id_foreign` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `reports`
--
ALTER TABLE `reports`
  ADD CONSTRAINT `reports_employee_id_foreign` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `role_ip_addresses`
--
ALTER TABLE `role_ip_addresses`
  ADD CONSTRAINT `role_ip_addresses_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `salary_advances`
--
ALTER TABLE `salary_advances`
  ADD CONSTRAINT `salary_advances_approved_by_foreign` FOREIGN KEY (`approved_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `salary_advances_employee_id_foreign` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `salary_setups`
--
ALTER TABLE `salary_setups`
  ADD CONSTRAINT `salary_setups_employee_id_foreign` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `telegram_logs`
--
ALTER TABLE `telegram_logs`
  ADD CONSTRAINT `telegram_logs_customer_visit_id_foreign` FOREIGN KEY (`customer_visit_id`) REFERENCES `customer_visits` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `telegram_logs_employee_id_foreign` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_employee_id_foreign` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `users_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
