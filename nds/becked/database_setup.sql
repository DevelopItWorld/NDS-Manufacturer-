-- Database setup script for NDS Manufacturer
-- Run this in MySQL before using the PHP backend

CREATE DATABASE IF NOT EXISTS nds_manufacturer;
USE nds_manufacturer;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  firstName VARCHAR(100) NOT NULL,
  lastName VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE KEY,
  company VARCHAR(150),
  password VARCHAR(255) NOT NULL,
  auth_token VARCHAR(255),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create index on email for faster lookups
CREATE INDEX idx_email ON users(email);

-- Create bookings table (for storing booking data)
CREATE TABLE IF NOT EXISTS bookings (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  machineType VARCHAR(100),
  machineModel VARCHAR(100),
  machineCapacity VARCHAR(100),
  quantity INT,
  deliveryAddress TEXT,
  phoneNumber VARCHAR(20),
  whatsappMessage TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
