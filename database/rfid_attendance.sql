-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 03, 2024 at 06:03 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 7.4.33

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `rfid_attendance`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `id` int(11) NOT NULL,
  `username` varchar(60) NOT NULL,
  `password` varchar(60) NOT NULL,
  `phoneNumber` varchar(60) NOT NULL,
  `joinDate` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`id`, `username`, `password`, `phoneNumber`, `joinDate`) VALUES
(1, 'admin', '$2a$12$/8U.U7tvawLLfi8wkK2/cOhRKYAfbaQ37/3t06WEdSymQ0hVIa3qK', '0912341223', '2024-04-21 17:49:45');

-- --------------------------------------------------------

--
-- Table structure for table `attendance`
--

CREATE TABLE `attendance` (
  `id` int(11) NOT NULL,
  `user_uuid` varchar(255) NOT NULL,
  `rfid_code` varchar(20) NOT NULL,
  `time_in` varchar(25) DEFAULT NULL,
  `time_out` varchar(25) DEFAULT NULL,
  `total_hours` varchar(25) DEFAULT NULL,
  `status_timein` varchar(25) DEFAULT NULL,
  `status_timeout` varchar(25) DEFAULT NULL,
  `comment` varchar(200) DEFAULT NULL,
  `holidayId` int(11) DEFAULT NULL,
  `log_date` date NOT NULL DEFAULT current_timestamp(),
  `modified_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `attendance`
--

INSERT INTO `attendance` (`id`, `user_uuid`, `rfid_code`, `time_in`, `time_out`, `total_hours`, `status_timein`, `status_timeout`, `comment`, `holidayId`, `log_date`, `modified_at`) VALUES
(81, 'ztthDM', '0005405499', '9:11:00 AM', '5:11:00 PM', '8.00', 'late', 'ontime', NULL, NULL, '2024-09-02', '2024-09-02 09:20:33'),
(82, '38BrzK', '0005336721', NULL, NULL, NULL, 'absent', 'absent', NULL, NULL, '2024-09-02', '2024-09-02 09:20:33'),
(83, 'Hihi4v', '0005333695', NULL, NULL, NULL, 'absent', 'absent', NULL, NULL, '2024-09-02', '2024-09-02 09:20:33'),
(84, '47ZXAH', '0004690436', NULL, NULL, NULL, 'absent', 'absent', NULL, NULL, '2024-09-02', '2024-09-02 09:20:33'),
(85, 'A1B2C3', '', NULL, NULL, NULL, 'absent', 'absent', NULL, NULL, '2024-09-02', '2024-09-02 09:20:33'),
(86, 'D4E5F6', '', NULL, NULL, NULL, 'absent', 'absent', NULL, NULL, '2024-09-02', '2024-09-02 09:20:33'),
(87, 'G7H8I9', '', NULL, NULL, NULL, 'absent', 'absent', NULL, NULL, '2024-09-02', '2024-09-02 09:20:33'),
(88, 'J0K1L2', '', NULL, NULL, NULL, 'absent', 'absent', NULL, NULL, '2024-09-02', '2024-09-02 09:20:33'),
(89, 'M3N4O5', '', NULL, NULL, NULL, 'absent', 'absent', NULL, NULL, '2024-09-02', '2024-09-02 09:20:33'),
(90, 'P6Q7R8', '', NULL, NULL, NULL, 'absent', 'absent', NULL, NULL, '2024-09-02', '2024-09-02 09:20:33'),
(91, 'ztthDM', '0005405499', '7:25:00 AM', '5:26:00 PM', '10.02', 'early', 'ontime', NULL, NULL, '2024-09-01', '2024-09-02 09:26:57'),
(92, '38BrzK', '0005336721', '7:28:00 AM', '5:21:00 PM', '9.88', 'early', 'ontime', NULL, NULL, '2024-09-01', '2024-09-02 09:26:57'),
(93, 'Hihi4v', '0005333695', '7:34:00 AM', '5:08:00 PM', '9.57', 'early', 'ontime', NULL, NULL, '2024-09-01', '2024-09-02 09:26:57'),
(94, '47ZXAH', '0004690436', '7:12:00 AM', '4:57:00 PM', '9.75', 'early', 'early', NULL, NULL, '2024-09-01', '2024-09-02 09:26:57'),
(95, 'A1B2C3', '', NULL, NULL, NULL, 'absent', 'absent', NULL, NULL, '2024-09-01', '2024-09-02 09:26:57'),
(96, 'D4E5F6', '', NULL, NULL, NULL, 'absent', 'absent', NULL, NULL, '2024-09-01', '2024-09-02 09:26:57'),
(97, 'G7H8I9', '', NULL, NULL, NULL, 'absent', 'absent', NULL, NULL, '2024-09-01', '2024-09-02 09:26:57'),
(98, 'J0K1L2', '', NULL, NULL, NULL, 'absent', 'absent', NULL, NULL, '2024-09-01', '2024-09-02 09:26:57'),
(99, 'M3N4O5', '', NULL, NULL, NULL, 'absent', 'absent', NULL, NULL, '2024-09-01', '2024-09-02 09:26:57'),
(100, 'P6Q7R8', '', NULL, NULL, NULL, 'absent', 'absent', NULL, NULL, '2024-09-01', '2024-09-02 09:26:57');

-- --------------------------------------------------------

--
-- Table structure for table `department`
--

CREATE TABLE `department` (
  `id` int(11) NOT NULL,
  `department` varchar(255) NOT NULL,
  `contact_number` varchar(100) NOT NULL,
  `room_location` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `modified_at` datetime DEFAULT NULL ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `department`
--

INSERT INTO `department` (`id`, `department`, `contact_number`, `room_location`, `created_at`, `modified_at`) VALUES
(1, 'Engineering', '09171234567', 'Room 101', '2024-08-29 10:00:00', '2024-08-30 01:47:40'),
(2, 'Marketing', '09181234567', 'Room 102', '2024-08-29 10:05:00', '2024-08-30 01:47:42'),
(3, 'Sales', '09191234567', 'Room 103', '2024-08-29 10:10:00', '2024-08-30 01:47:44'),
(4, 'Human Resources', '09201234567', 'Room 104', '2024-08-29 10:15:00', '2024-08-30 01:47:47'),
(5, 'Finance', '09211234567', 'Room 105', '2024-08-29 10:20:00', '2024-08-30 01:47:49'),
(6, 'Customer Support', '09221234567', 'Room 106', '2024-08-29 10:25:00', '2024-08-30 01:47:52');

-- --------------------------------------------------------

--
-- Table structure for table `designation`
--

CREATE TABLE `designation` (
  `id` int(11) NOT NULL,
  `department_id` int(11) NOT NULL,
  `designation` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `modified_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `designation`
--

INSERT INTO `designation` (`id`, `department_id`, `designation`, `created_at`, `modified_at`) VALUES
(3, 1, 'Software Engineer', '2024-08-29 10:30:00', NULL),
(4, 1, 'Lead Developer', '2024-08-29 10:35:00', NULL),
(5, 2, 'Marketing Specialist', '2024-08-29 10:40:00', NULL),
(6, 2, 'Content Creator', '2024-08-29 10:45:00', NULL),
(7, 3, 'Sales Executive', '2024-08-29 10:50:00', NULL),
(8, 3, 'Sales Associate', '2024-08-29 10:55:00', NULL),
(9, 4, 'HR Manager', '2024-08-29 11:00:00', NULL),
(10, 4, 'Recruiter', '2024-08-29 11:05:00', NULL),
(11, 5, 'Accountant', '2024-08-29 11:10:00', NULL),
(12, 5, 'Financial Analyst', '2024-08-29 11:15:00', NULL),
(13, 6, 'Support Specialist', '2024-08-29 11:20:00', NULL),
(14, 6, 'Customer Service Representative', '2024-08-29 11:25:00', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `employment`
--

CREATE TABLE `employment` (
  `id` int(11) NOT NULL,
  `user_uuid` varchar(200) NOT NULL,
  `department` int(200) DEFAULT NULL,
  `designation` int(200) DEFAULT NULL,
  `joined_date` date NOT NULL,
  `exit_date` date DEFAULT NULL,
  `status` tinyint(1) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `modified_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `employment`
--

INSERT INTO `employment` (`id`, `user_uuid`, `department`, `designation`, `joined_date`, `exit_date`, `status`, `created_at`, `modified_at`) VALUES
(1, '38BrzK', 1, 3, '2024-08-31', NULL, 0, '2024-08-30 01:38:30', '2024-08-30 01:52:30'),
(2, '47ZXAH', 3, 8, '2024-08-31', NULL, 0, '2024-08-30 01:38:44', '2024-09-01 22:10:05'),
(3, 'Hihi4v', 1, 4, '2024-08-31', NULL, 0, '2024-08-30 01:38:55', '2024-08-30 01:53:13'),
(4, 'ztthDM', 1, 4, '2024-08-31', NULL, 0, '2024-08-30 01:39:07', '2024-09-01 22:20:39'),
(5, 'A1B2C3', 5, 12, '2024-08-31', NULL, 0, '2024-08-30 01:52:47', '2024-08-30 01:52:47'),
(6, 'D4E5F6', 3, 8, '2024-08-31', NULL, 0, '2024-08-30 01:52:57', '2024-08-30 01:52:57'),
(7, 'G7H8I9', 6, 14, '2024-08-31', NULL, 0, '2024-08-30 01:53:06', '2024-08-30 01:53:06'),
(8, 'J0K1L2', 5, 12, '2024-08-31', NULL, 0, '2024-08-30 01:53:29', '2024-08-30 01:53:29'),
(9, 'M3N4O5', 4, 9, '2024-08-31', NULL, 0, '2024-08-30 01:53:39', '2024-08-30 01:53:39'),
(10, 'P6Q7R8', 3, 8, '2024-08-31', NULL, 0, '2024-08-30 01:53:55', '2024-08-30 01:53:55');

-- --------------------------------------------------------

--
-- Table structure for table `holidays`
--

CREATE TABLE `holidays` (
  `id` int(11) NOT NULL,
  `holiday_date` date NOT NULL,
  `description` varchar(255) NOT NULL,
  `status` int(11) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `modified_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `holidays`
--

INSERT INTO `holidays` (`id`, `holiday_date`, `description`, `status`, `created_at`, `modified_at`) VALUES
(1, '2024-01-01', 'New Year\'s Day', 0, '2024-08-30 01:43:57', '2024-08-30 01:43:57'),
(2, '2024-03-28', 'Maundy Thursday', 0, '2024-08-30 01:43:57', '2024-08-30 01:43:57'),
(3, '2024-03-29', 'Good Friday', 0, '2024-08-30 01:43:57', '2024-08-30 01:43:57'),
(4, '2024-04-09', 'Araw ng Kagitingan', 0, '2024-08-30 01:43:57', '2024-08-30 01:43:57'),
(5, '2024-05-01', 'Labor Day', 0, '2024-08-30 01:43:57', '2024-08-30 01:43:57'),
(6, '2024-06-12', 'Independence Day', 0, '2024-08-30 01:43:57', '2024-08-30 01:43:57'),
(7, '2024-08-26', 'National Heroes Day', 0, '2024-08-30 01:43:57', '2024-08-30 01:43:57'),
(8, '2024-11-30', 'Bonifacio Day', 0, '2024-08-30 01:43:57', '2024-08-30 01:43:57'),
(9, '2024-12-25', 'Christmas Day', 0, '2024-08-30 01:43:57', '2024-08-30 01:43:57'),
(10, '2024-12-30', 'Rizal Day', 0, '2024-08-30 01:43:57', '2024-08-30 01:43:57'),
(11, '2024-02-10', 'Chinese New Year', 0, '2024-08-30 01:44:30', '2024-08-30 01:44:30'),
(12, '2024-04-10', 'Eid al-Fitr', 0, '2024-08-30 01:44:30', '2024-08-30 01:44:30'),
(13, '2024-06-17', 'Eid al-Adha', 0, '2024-08-30 01:44:30', '2024-08-30 01:44:30'),
(14, '2024-08-21', 'Ninoy Aquino Day', 0, '2024-08-30 01:44:30', '2024-08-30 01:44:30'),
(15, '2024-11-01', 'All Saints\' Day', 0, '2024-08-30 01:44:30', '2024-08-30 01:44:30'),
(16, '2024-11-02', 'All Souls\' Day', 0, '2024-08-30 01:44:30', '2024-08-30 01:44:30'),
(17, '2024-12-24', 'Christmas Eve', 0, '2024-08-30 01:44:30', '2024-08-30 01:44:30'),
(18, '2024-12-31', 'New Year\'s Eve', 0, '2024-08-30 01:44:30', '2024-08-30 01:44:30');

-- --------------------------------------------------------

--
-- Table structure for table `rfidcards`
--

CREATE TABLE `rfidcards` (
  `id` int(11) NOT NULL,
  `cardnumber` varchar(45) NOT NULL,
  `userUuid` varchar(45) NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `modified_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `rfidcards`
--

INSERT INTO `rfidcards` (`id`, `cardnumber`, `userUuid`, `is_active`, `created_at`, `modified_at`) VALUES
(1, '0005405499', 'ztthDM', 1, '2024-08-27 23:19:33', '2024-09-01 22:20:58'),
(2, '0005336721', '38BrzK', 1, '2024-08-28 01:21:53', '2024-08-31 18:29:18'),
(3, '0005333695', 'Hihi4v', 1, '2024-08-28 17:22:34', NULL),
(4, '0004690436', '47ZXAH', 0, '2024-08-28 17:23:42', '2024-09-01 22:13:13');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `uuid` varchar(50) NOT NULL,
  `firstname` varchar(255) NOT NULL,
  `lastname` varchar(255) NOT NULL,
  `middlename` varchar(255) DEFAULT NULL,
  `address` text NOT NULL,
  `phonenumber` varchar(200) NOT NULL,
  `email` varchar(255) NOT NULL,
  `birthday` varchar(255) NOT NULL,
  `gender` varchar(255) NOT NULL,
  `username` varchar(45) NOT NULL,
  `password` varchar(60) NOT NULL,
  `profile_url` varchar(60) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `modified_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `resetPasswordToken` varchar(255) DEFAULT NULL,
  `resetPasswordExpires` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `uuid`, `firstname`, `lastname`, `middlename`, `address`, `phonenumber`, `email`, `birthday`, `gender`, `username`, `password`, `profile_url`, `created_at`, `modified_at`, `resetPasswordToken`, `resetPasswordExpires`) VALUES
(1, 'ztthDM', 'Noel Michael', 'Talub', 'Tayamen', 'Brgy. 16 Abadilla St., Laoag City, Ilocos Norte', '09166838843', 'noelmichaelttalub@gmail.com', '2001-03-26', 'male', 'noeltalub', '$2b$10$fVEfvL2TO0PZyN7quO9FIeMXzaGhfJW1dlCvCrwH1pdg9isCSxn2.', '1725119849200-5671ffe1484f968f0f2b31c67e2322fd.jpg', '2024-08-27 23:19:33', '2024-09-02 08:59:16', '785cab696947689e90082aa9a4f2f6294320230e', 1725209016535),
(2, '38BrzK', 'Eren', 'Yeager', 'Doe', 'Brgy. 15 Laoag City', '093212213123', 'mejol34637@amxyy.com', '2005-02-12', 'female', 'eren', '$2b$10$ap6U/noCp3p1QJi5FKFZvOUa7GxcVQFmZZasfTpB0Wlfbtar4mIey', 'default.jpg', '2024-08-28 01:21:53', '2024-09-02 09:08:09', 'b6ad3d38b362577071b14b2772b25669fec1f4d2', 1725242889430),
(3, 'Hihi4v', 'Victor', 'Magtangol', 'Sal', 'Manila', '09323131232', 'victor@gmail.com', '1999-02-09', 'male', 'victor', '$2b$10$37lUNJBG4NZ3c71WDcyhVu9DtGk/TErIY9nrHnxELzZuZ2OnNGdb.', 'default.jpg', '2024-08-28 17:22:34', NULL, NULL, NULL),
(4, '47ZXAH', 'Jabiru', 'Binans', 'Mok', 'Pampanga', '093231231232', 'jabiru@gmail.com', '1992-05-29', 'female', 'jabiru', '$2b$10$71xmTylO4fWVHo6ZnO9/U.AfHg/s24IBK8nNIBrDIII3Hr/4QUhde', 'default.jpg', '2024-08-28 17:23:42', NULL, NULL, NULL),
(5, 'A1B2C3', 'Juan', 'Dela Cruz', 'Santos', 'Quezon City', '09171234567', 'juan.delacruz@gmail.com', '1990-01-15', 'male', 'juandelacruz', '$2b$10$abcdefg1234567', 'default.jpg', '2024-08-29 10:00:00', NULL, NULL, NULL),
(6, 'D4E5F6', 'Maria', 'Clara', 'Reyes', 'Makati City', '09181234567', 'maria.clara@gmail.com', '1992-07-20', 'female', 'mariaclara', '$2b$10$hijklmn8901234', 'default.jpg', '2024-08-29 10:05:00', NULL, NULL, NULL),
(7, 'G7H8I9', 'Jose', 'Rizal', 'Mercado', 'Cebu City', '09191234567', 'jose.rizal@gmail.com', '1985-06-19', 'male', 'joserizal', '$2b$10$opqrst5678901', 'default.jpg', '2024-08-29 10:10:00', NULL, NULL, NULL),
(8, 'J0K1L2', 'Andres', 'Bonifacio', 'Luna', 'Davao City', '09201234567', 'andres.bonifacio@gmail.com', '1980-11-30', 'male', 'andresbonifacio', '$2b$10$uvwxyz2345678', 'default.jpg', '2024-08-29 10:15:00', NULL, NULL, NULL),
(9, 'M3N4O5', 'Gabriela', 'Silang', 'Carino', 'Baguio City', '09211234567', 'gabriela.silang@gmail.com', '1988-03-19', 'female', 'gabrielasilang', '$2b$10$abcdefg5678901', 'default.jpg', '2024-08-29 10:20:00', NULL, NULL, NULL),
(10, 'P6Q7R8', 'Emilio', 'Aguinaldo', 'Famy', 'Taguig City', '09221234567', 'emilio.aguinaldo@gmail.com', '1975-03-22', 'male', 'emilioaguinaldo', '$2b$10$hijklmn2345678', 'default.jpg', '2024-08-29 10:25:00', NULL, NULL, NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `attendance`
--
ALTER TABLE `attendance`
  ADD PRIMARY KEY (`id`),
  ADD KEY `attendance_ibfk_1` (`user_uuid`),
  ADD KEY `attendance_ibfk_2` (`holidayId`);

--
-- Indexes for table `department`
--
ALTER TABLE `department`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `designation`
--
ALTER TABLE `designation`
  ADD PRIMARY KEY (`id`),
  ADD KEY `designation_ibfk_1` (`department_id`);

--
-- Indexes for table `employment`
--
ALTER TABLE `employment`
  ADD PRIMARY KEY (`id`),
  ADD KEY `employment_ibfk_3` (`user_uuid`),
  ADD KEY `employment_ibfk_1` (`department`),
  ADD KEY `designation` (`designation`);

--
-- Indexes for table `holidays`
--
ALTER TABLE `holidays`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `rfidcards`
--
ALTER TABLE `rfidcards`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `cardnumber` (`cardnumber`),
  ADD KEY `rfidcards_ibfk_1` (`userUuid`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `phonenumber` (`phonenumber`),
  ADD UNIQUE KEY `uuid` (`uuid`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin`
--
ALTER TABLE `admin`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `attendance`
--
ALTER TABLE `attendance`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=101;

--
-- AUTO_INCREMENT for table `department`
--
ALTER TABLE `department`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `designation`
--
ALTER TABLE `designation`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `employment`
--
ALTER TABLE `employment`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `holidays`
--
ALTER TABLE `holidays`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `rfidcards`
--
ALTER TABLE `rfidcards`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `attendance`
--
ALTER TABLE `attendance`
  ADD CONSTRAINT `attendance_ibfk_1` FOREIGN KEY (`user_uuid`) REFERENCES `users` (`uuid`) ON DELETE CASCADE,
  ADD CONSTRAINT `attendance_ibfk_2` FOREIGN KEY (`holidayId`) REFERENCES `holidays` (`id`) ON DELETE SET NULL ON UPDATE SET NULL;

--
-- Constraints for table `designation`
--
ALTER TABLE `designation`
  ADD CONSTRAINT `designation_ibfk_1` FOREIGN KEY (`department_id`) REFERENCES `department` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `employment`
--
ALTER TABLE `employment`
  ADD CONSTRAINT `employment_ibfk_1` FOREIGN KEY (`department`) REFERENCES `department` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `employment_ibfk_3` FOREIGN KEY (`user_uuid`) REFERENCES `users` (`uuid`) ON DELETE CASCADE ON UPDATE NO ACTION,
  ADD CONSTRAINT `employment_ibfk_4` FOREIGN KEY (`designation`) REFERENCES `designation` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `rfidcards`
--
ALTER TABLE `rfidcards`
  ADD CONSTRAINT `rfidcards_ibfk_1` FOREIGN KEY (`userUuid`) REFERENCES `users` (`uuid`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
