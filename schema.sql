CREATE DATABASE IF NOT EXISTS farmadvisor CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE farmadvisor;

CREATE TABLE users (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(190) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('admin','farmer') NOT NULL DEFAULT 'farmer',
  farm_name VARCHAR(150) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE crops (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  season VARCHAR(80) NOT NULL,
  soil_type VARCHAR(100) NOT NULL,
  water_requirement VARCHAR(120) NOT NULL,
  application_instruction TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE fertilizers (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  type VARCHAR(100) NOT NULL,
  quantity VARCHAR(100) NOT NULL,
  application_instruction TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO crops (name, season, soil_type, water_requirement, application_instruction) VALUES
('Maize', 'Kharif (Summer)', 'Loamy', '500-800 mm', 'Apply nitrogen in two split doses after planting.'),
('Rice', 'Kharif (Summer)', 'Clay', '1000-1500 mm', 'Maintain shallow standing water during active growth.'),
('Tomato', 'Rabi (Winter)', 'Sandy loam', '400-600 mm', 'Water at the base and avoid wetting leaves.');
INSERT INTO fertilizers (name, type, quantity, application_instruction) VALUES
('Urea', 'Nitrogen', '50 kg / acre', 'Apply before rainfall and incorporate lightly into soil.'),
('DAP', 'Phosphorus', '45 kg / acre', 'Place near the root zone during sowing.'),
('Potash', 'Potassium', '25 kg / acre', 'Apply during flowering for stronger fruit development.');
