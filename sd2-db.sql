-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: db
-- Generation Time: Oct 30, 2022 at 09:54 AM
-- Server version: 8.0.24
-- PHP Version: 7.4.20

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `sd2-db`
--

-- --------------------------------------------------------

--
-- Table structure for table `test_table`
--
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

-- Create user table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('GUEST_USER', 'REGISTERED_USER', 'MODERATOR') DEFAULT 'GUEST_USER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- Insert Sample Users
INSERT INTO users (name, email, password_hash, role) VALUES
('John Doe', 'john@example.com', 'hashed_password1', 'REGISTERED_USER'),
('Jane Smith', 'jane@example.com', 'hashed_password2', 'MODERATOR'),
('Alice Johnson', 'alice@example.com', 'hashed_password3', 'REGISTERED_USER'),
('Bob Williams', 'bob@example.com', 'hashed_password4', 'GUEST_USER');


-- Create Meal Catergories 
CREATE TABLE meal_Categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL
);


-- Insert Sample Meal_Catorigies
INSERT INTO meal_Categories (name) VALUES
('Italian'),
('Mexican'),
('Vegan'),
('Desserts'),
('Asian Cuisine');


-- Create Skill-levels
CREATE TABLE skill_levels (
    id INT AUTO_INCREMENT PRIMARY KEY,
    level ENUM('Toaster', 'Sizzler', 'Flambe') NOT NULL UNIQUE
);


-- Insert Sample Skill Levels
INSERT INTO skill_levels (level) VALUES
('Toaster'),
('Sizzler'),
('Flambe');


CREATE TABLE recipes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    instructions TEXT NOT NULL,
    meal_Categories_id INT NOT NULL,
    skill_level_id INT NOT NULL,
    image_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (meal_Categories_id) REFERENCES meal_Categories(id) ON DELETE CASCADE,
    FOREIGN KEY (skill_level_id) REFERENCES skill_levels(id) ON DELETE CASCADE
);


-- Insert Sample Recipes
INSERT INTO recipes (user_id, title, description, instructions, meal_Categories_id, skill_level_id, image_url) VALUES
(1, 'Spaghetti Bolognese', 'Classic Italian pasta dish', 'Cook pasta, prepare sauce, mix together', 1, 2, 'spaghetti.jpg'),
(2, 'Vegan Tacos', 'Delicious Mexican vegan tacos', 'Prepare tortillas, add veggies, add salsa', 2, 1, 'tacos.jpg'),
(3, 'Chocolate Cake', 'Decadent chocolate cake', 'Mix ingredients, bake, decorate with frosting', 4, 3, 'cake.jpg');



CREATE TABLE ingredients (
    id INT AUTO_INCREMENT PRIMARY KEY,
    recipe_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    quantity VARCHAR(100) NOT NULL,
    unit VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE
);


-- Insert Sample Ingredients for Recipe ID 1 (Spaghetti Bolognese)
INSERT INTO ingredients (recipe_id, name, quantity, unit) VALUES
(1, 'Spaghetti', '200', 'grams'),
(1, 'Minced Beef', '300', 'grams'),
(1, 'Tomato Sauce', '2', 'cups'),
(1, 'Onions', '1', 'large'),
(1, 'Garlic', '2', 'cloves');



-- Ingredients for Recipe ID 2 (Vegan Tacos)
INSERT INTO ingredients (recipe_id, name, quantity, unit) VALUES
(2, 'Tortillas', '5', 'pieces'),
(2, 'Avocado', '2', 'pieces'),
(2, 'Black Beans', '1', 'cup'),
(2, 'Tomatoes', '3', 'pieces');


