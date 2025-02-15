CREATE DATABASE  IF NOT EXISTS `report` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `report`;
-- MySQL dump 10.13  Distrib 8.0.41, for Linux (x86_64)
--
-- Host: 127.0.0.1    Database: report
-- ------------------------------------------------------
-- Server version	8.0.41-0ubuntu0.24.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `Department`
--

DROP TABLE IF EXISTS `Department`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Department` (
  `DepartmentID` int NOT NULL AUTO_INCREMENT,
  `Name` varchar(100) NOT NULL,
  `ManagerID` int DEFAULT NULL,
  PRIMARY KEY (`DepartmentID`),
  KEY `fk_Department_1_idx` (`ManagerID`),
  CONSTRAINT `fk_Department_1` FOREIGN KEY (`ManagerID`) REFERENCES `Employee` (`EmployeeID`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Department`
--

LOCK TABLES `Department` WRITE;
/*!40000 ALTER TABLE `Department` DISABLE KEYS */;
INSERT INTO `Department` VALUES (1,'IT',10122352),(2,'PR',10122353),(3,'Academic',10122354),(4,'Administration',10122355),(5,'HR',10122356),(6,'SocialMedia',10122362);
/*!40000 ALTER TABLE `Department` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Employee`
--

DROP TABLE IF EXISTS `Employee`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Employee` (
  `EmployeeID` int NOT NULL,
  `Name` varchar(100) NOT NULL,
  `Email` varchar(50) DEFAULT NULL,
  `contractType` varchar(20) NOT NULL,
  `BankAccountInfo` varchar(150) DEFAULT NULL,
  `DepartmentID` int DEFAULT NULL,
  `UserID` int NOT NULL,
  PRIMARY KEY (`EmployeeID`),
  UNIQUE KEY `Email_UNIQUE` (`Email`),
  KEY `fk_Employee_UserAccount_idx` (`UserID`),
  KEY `fk_Employee_Department_idx` (`DepartmentID`),
  CONSTRAINT `fk_Employee_Department` FOREIGN KEY (`DepartmentID`) REFERENCES `Department` (`DepartmentID`),
  CONSTRAINT `fk_Employee_UserAccount` FOREIGN KEY (`UserID`) REFERENCES `UserAccount` (`UserID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Employee`
--

LOCK TABLES `Employee` WRITE;
/*!40000 ALTER TABLE `Employee` DISABLE KEYS */;
INSERT INTO `Employee` VALUES (10122352,'Muhammad Insani Imam Utomo','imamutomo69@gmail.com','tetap','1239081093812',1,3),(10122353,'Alice Johnson','alice.johnson@example.com','permanent','Bank A, Acc: 111222333',NULL,4),(10122354,'Bob Smith','bob.smith@example.com','contract','Bank B, Acc: 444555666',NULL,5),(10122355,'Charlie Davis','charlie.davis@example.com','permanent','Bank C, Acc: 777888999',NULL,6),(10122356,'Diana Moore','diana.moore@example.com','permanent',NULL,NULL,7),(10122357,'Edward Clark','edward.clark@example.com','contract','Bank E, Acc: 141516171',NULL,8),(10122358,'Fiona Lee','fiona.lee@example.com','permanent','Bank F, Acc: 181920212',NULL,9),(10122359,'George Hall','george.hall@example.com','contract','Bank G, Acc: 222324252',NULL,10),(10122360,'Hannah Adams','hannah.adams@example.com','permanent','Bank H, Acc: 262728293',NULL,11),(10122361,'Ian Baker','ian.baker@example.com','contract','Bank I, Acc: 303132333',NULL,12),(10122362,'Julia Roberts','julia.roberts@example.com','permanent','Bank J, Acc: 343536373',NULL,13);
/*!40000 ALTER TABLE `Employee` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `IncentivePayment`
--

DROP TABLE IF EXISTS `IncentivePayment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `IncentivePayment` (
  `IncentivePaymentID` int NOT NULL AUTO_INCREMENT,
  `EmployeeID` int NOT NULL,
  `PaymentMonth` char(7) NOT NULL,
  `PaymentDate` date NOT NULL,
  `IncentiveType` varchar(20) NOT NULL,
  `Amount` decimal(10,2) NOT NULL,
  `ApprovalStatus` varchar(20) NOT NULL,
  PRIMARY KEY (`IncentivePaymentID`),
  KEY `fk_IncentivePayment_Employee_idx` (`EmployeeID`),
  CONSTRAINT `fk_IncentivePayment_Employee` FOREIGN KEY (`EmployeeID`) REFERENCES `Employee` (`EmployeeID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `IncentivePayment`
--

LOCK TABLES `IncentivePayment` WRITE;
/*!40000 ALTER TABLE `IncentivePayment` DISABLE KEYS */;
/*!40000 ALTER TABLE `IncentivePayment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `PerformanceRating`
--

DROP TABLE IF EXISTS `PerformanceRating`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `PerformanceRating` (
  `PerformanceRatingID` int NOT NULL AUTO_INCREMENT,
  `EmployeeID` int NOT NULL,
  `ManagerID` int NOT NULL,
  `Month` char(7) NOT NULL,
  `Rating` decimal(3,2) NOT NULL,
  `Comments` text,
  PRIMARY KEY (`PerformanceRatingID`),
  KEY `fk_PerformanceRating_Employee_idx` (`EmployeeID`),
  KEY `fk_PerformanceRating_Manager_idx` (`ManagerID`),
  CONSTRAINT `fk_PerformanceRating_Employee` FOREIGN KEY (`EmployeeID`) REFERENCES `Employee` (`EmployeeID`),
  CONSTRAINT `fk_PerformanceRating_Manager` FOREIGN KEY (`ManagerID`) REFERENCES `Employee` (`EmployeeID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `PerformanceRating`
--

LOCK TABLES `PerformanceRating` WRITE;
/*!40000 ALTER TABLE `PerformanceRating` DISABLE KEYS */;
/*!40000 ALTER TABLE `PerformanceRating` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `TaskRecord`
--

DROP TABLE IF EXISTS `TaskRecord`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `TaskRecord` (
  `TaskRecordID` int NOT NULL AUTO_INCREMENT,
  `EmployeeID` int NOT NULL,
  `TaskTypeID` int NOT NULL,
  `TaskDate` date NOT NULL,
  `Duration` decimal(4,2) NOT NULL,
  `Quantity` int DEFAULT NULL,
  `Details` text,
  PRIMARY KEY (`TaskRecordID`),
  KEY `fk_TaskRecord_Employee_idx` (`EmployeeID`),
  KEY `fk_TaskRecord_TaskType_idx` (`TaskTypeID`),
  CONSTRAINT `fk_TaskRecord_Employee` FOREIGN KEY (`EmployeeID`) REFERENCES `Employee` (`EmployeeID`),
  CONSTRAINT `fk_TaskRecord_TaskType` FOREIGN KEY (`TaskTypeID`) REFERENCES `TaskType` (`TaskTypeID`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `TaskRecord`
--

LOCK TABLES `TaskRecord` WRITE;
/*!40000 ALTER TABLE `TaskRecord` DISABLE KEYS */;
INSERT INTO `TaskRecord` VALUES (2,10122352,1,'2025-02-13',1.00,1,'meeting dengan vendor');
/*!40000 ALTER TABLE `TaskRecord` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `TaskReport`
--

DROP TABLE IF EXISTS `TaskReport`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `TaskReport` (
  `TaskReportID` int NOT NULL AUTO_INCREMENT,
  `EmployeeID` int NOT NULL,
  `ReportMonth` char(7) NOT NULL,
  `SubmissionDate` datetime NOT NULL,
  `TotalHours` decimal(5,2) DEFAULT NULL,
  `TotalTask` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`TaskReportID`),
  KEY `fk_TaskReport_Employee_idx` (`EmployeeID`),
  CONSTRAINT `fk_TaskReport_Employee` FOREIGN KEY (`EmployeeID`) REFERENCES `Employee` (`EmployeeID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `TaskReport`
--

LOCK TABLES `TaskReport` WRITE;
/*!40000 ALTER TABLE `TaskReport` DISABLE KEYS */;
/*!40000 ALTER TABLE `TaskReport` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `TaskType`
--

DROP TABLE IF EXISTS `TaskType`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `TaskType` (
  `TaskTypeID` int NOT NULL AUTO_INCREMENT,
  `Name` varchar(50) NOT NULL,
  `IncentiveStaff` int NOT NULL,
  `IncentiveTrial` int NOT NULL,
  PRIMARY KEY (`TaskTypeID`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `TaskType`
--

LOCK TABLES `TaskType` WRITE;
/*!40000 ALTER TABLE `TaskType` DISABLE KEYS */;
INSERT INTO `TaskType` VALUES (1,'Managerial',50000,0),(2,'Clerical',35000,30000),(3,'Expertise',40000,35000),(4,'komunikatif',5000,3000),(5,'Visit (under 4 hr)',40000,35000),(6,'Visit (over 4 hr)',150000,120000),(7,'Rapat',15000,15000),(8,'Proctor',40000,35000);
/*!40000 ALTER TABLE `TaskType` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `UserAccount`
--

DROP TABLE IF EXISTS `UserAccount`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `UserAccount` (
  `UserID` int NOT NULL AUTO_INCREMENT,
  `Username` varchar(50) NOT NULL,
  `PasswordHash` varchar(255) NOT NULL,
  `Role` enum('employee','manager','admin') NOT NULL DEFAULT 'employee',
  `LastLogin` datetime DEFAULT NULL,
  `CreatedAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `UpdatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`UserID`),
  UNIQUE KEY `Username` (`Username`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `UserAccount`
--

LOCK TABLES `UserAccount` WRITE;
/*!40000 ALTER TABLE `UserAccount` DISABLE KEYS */;
INSERT INTO `UserAccount` VALUES (2,'testuser','$2b$10$plTipWlckiJUz.KstP9vNe3nO8imR1eEkVmatsbIb7d.KlAQU6QSC','admin',NULL,'2025-02-11 06:22:42','2025-02-11 06:22:42'),(3,'Imamutomo12','$2b$10$tW6wPfcam2FyXl6YJ8jfEegQxBWBmUJY2t1GKCBMMOgN3SfH49a3u','employee',NULL,'2025-02-14 17:52:44','2025-02-14 17:52:44'),(4,'alice.johnson','$2b$10$dummyhashforalice','employee',NULL,'2025-02-15 09:35:46','2025-02-15 09:35:46'),(5,'bob.smith','$2b$10$dummyhashforbob','employee',NULL,'2025-02-15 09:35:46','2025-02-15 09:35:46'),(6,'charlie.davis','$2b$10$dummyhashforcharlie','employee',NULL,'2025-02-15 09:35:46','2025-02-15 09:35:46'),(7,'diana.moore','$2b$10$dummyhashfordiana','employee',NULL,'2025-02-15 09:35:46','2025-02-15 09:35:46'),(8,'edward.clark','$2b$10$dummyhashforedward','employee',NULL,'2025-02-15 09:35:46','2025-02-15 09:35:46'),(9,'fiona.lee','$2b$10$dummyhashforfiona','employee',NULL,'2025-02-15 09:35:46','2025-02-15 09:35:46'),(10,'george.hall','$2b$10$dummyhashforgeorge','employee',NULL,'2025-02-15 09:35:46','2025-02-15 09:35:46'),(11,'hannah.adams','$2b$10$dummyhashforhannah','employee',NULL,'2025-02-15 09:35:46','2025-02-15 09:35:46'),(12,'ian.baker','$2b$10$dummyhashforian','employee',NULL,'2025-02-15 09:35:46','2025-02-15 09:35:46'),(13,'julia.roberts','$2b$10$dummyhashforjulia','employee',NULL,'2025-02-15 09:35:46','2025-02-15 09:35:46');
/*!40000 ALTER TABLE `UserAccount` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'report'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-02-15 18:59:56
