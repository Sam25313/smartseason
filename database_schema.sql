-- SmartSeason Database Schema
-- Run this script to create the database and tables

CREATE DATABASE IF NOT EXISTS smartseason;
USE smartseason;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'agent') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Fields table
CREATE TABLE IF NOT EXISTS fields (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    crop_type VARCHAR(100) NOT NULL,
    planting_date DATE NOT NULL,
    current_stage VARCHAR(50) NOT NULL,
    assigned_agent_id INT,
    location VARCHAR(255) NOT NULL,
    area_ha DECIMAL(5,2) NOT NULL,
    last_update TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (assigned_agent_id) REFERENCES users(id)
);

-- Updates table
CREATE TABLE IF NOT EXISTS updates (
    id INT PRIMARY KEY AUTO_INCREMENT,
    field_id INT NOT NULL,
    agent_id INT NOT NULL,
    stage VARCHAR(50) NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (field_id) REFERENCES fields(id) ON DELETE CASCADE,
    FOREIGN KEY (agent_id) REFERENCES users(id)
);

-- Insert sample data
INSERT INTO users (name, email, password, role) VALUES
('Amara Osei', 'admin@smartseason.com', '$2b$10$FJuRKIyIvOe0f7S5m6PeKeuS4aLyfZve24RobjyTf2XcZWTaIbW/i', 'admin'),
('Kofi Mensah', 'kofi@smartseason.com', '$2b$10$/32NibpsXTHTmEJ909DqROm1fLMtlXkMG.od.pr9tLa3sPpCiR0tW', 'agent'),
('Nia Adeyemi', 'nia@smartseason.com', '$2b$10$ZAZjQzKtb2oZEsil01Mfeukbz9SWaJmznyJegKzlgd52wRdEttlhe', 'agent'),
('Kwame Asante', 'kwame@smartseason.com', '$2b$10$eQmkucaU0HzN.f4/48Fe4u0pCSVcoziZJ2AFmVta4VyOUOQytYIpe', 'agent');

INSERT INTO fields (name, crop_type, planting_date, current_stage, assigned_agent_id, location, area_ha) VALUES
('Aboabo North Plot', 'Maize', '2026-01-15', 'Growing', 2, 'Kumasi Region', 3.5),
('Tamale East Farm', 'Sorghum', '2026-01-30', 'Growing', 3, 'Northern Region', 5.0),
('Volta Basin Field', 'Rice', '2025-10-15', 'Harvested', 2, 'Volta Region', 2.2),
('Brong-Ahafo Plot A', 'Yam', '2026-02-15', 'Planted', 4, 'Bono Region', 4.0);