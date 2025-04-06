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

-- Create Users table
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


-- Create meal_Categories table
CREATE TABLE meal_Categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL
);

-- Insert Sample Meal Categories
INSERT INTO meal_Categories (name) VALUES
('Italian'),
('Mexican'),
('Vegan'),
('Desserts'),
('Asian Cuisine');


-- Create skill_levels table 
CREATE TABLE skill_levels (
    id INT AUTO_INCREMENT PRIMARY KEY,
    level ENUM('Toaster', 'Sizzler', 'Flambe') NOT NULL UNIQUE
);

-- Insert Sample Skill Levels
INSERT INTO skill_levels (level) VALUES
('Toaster'),
('Sizzler'),
('Flambe');


-- Create recipes table (
CREATE TABLE recipes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    country_origin VARCHAR(255) NOT NULL,
    description TEXT,
    ingredients TEXT NOT NULL,
    instructions TEXT NOT NULL,
    prep_duration VARCHAR(50) NOT NULL,
    cook_duration VARCHAR(50) NOT NULL,
    meal_Categories_id INT NOT NULL,
    skill_level_id INT NOT NULL,
    image_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (meal_Categories_id) REFERENCES meal_Categories(id) ON DELETE CASCADE,
    FOREIGN KEY (skill_level_id) REFERENCES skill_levels(id) ON DELETE CASCADE
);

-- Insert Sample Recipes
INSERT INTO recipes (user_id, title, country_origin, description, ingredients, instructions, prep_duration, cook_duration, meal_Categories_id, skill_level_id, image_url) VALUES
(1, 'Spaghetti Carbonara', 'Italy', 'Classic creamy pasta dish', 'Pasta, Eggs, Bacon, Cheese', 'Cook pasta and mix with sauce', '10 min', '15 min', 1, 3, '/images/spaghetti.jpg'),
(2, 'Vegan Burrito', 'Mexico', 'Delicious vegan burrito', 'Tortilla, Black Beans, Rice, Avocado, Salsa', 'Assemble the ingredients in tortilla and roll', '5 min', '10 min', 2, 1, '/images/burrito.jpg'),
(3, 'Chocolate Cake', 'United States', 'Decadent chocolate cake', 'Flour, Sugar, Cocoa, Butter, Eggs', 'Mix ingredients, bake, frost with chocolate icing', '15 min', '40 min', 4, 2, '/images/cake.jpg'),
(1, 'Sushi Rolls', 'Japan', 'Fresh sushi rolls with fish and veggies', 'Rice, Nori, Salmon, Cucumber, Avocado', 'Prepare sushi rice and roll with ingredients', '30 min', '10 min', 5, 3, '/images/sushi.jpg'),
(4, 'Tacos', 'Mexico', 'Tasty beef tacos', 'Tortillas, Ground Beef, Cheese, Lettuce, Salsa', 'Cook beef and assemble with toppings', '10 min', '15 min', 2, 1, '/images/tacos.jpg');



-- Create ringredients table (
CREATE TABLE ingredients (
    id INT AUTO_INCREMENT PRIMARY KEY,
    recipe_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    quantity VARCHAR(100) NOT NULL,
    unit VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE
);

-- Insert Sample Ingredients for Recipe ID 1 (Spaghetti Carbonara)
INSERT INTO ingredients (recipe_id, name, quantity, unit) VALUES
(1, 'Spaghetti', '200', 'grams'),
(1, 'Eggs', '2', 'pieces'),
(1, 'Bacon', '100', 'grams'),
(1, 'Cheese', '50', 'grams');

-- Insert Sample Ingredients for Recipe ID 2 (Vegan Burrito)
INSERT INTO ingredients (recipe_id, name, quantity, unit) VALUES
(2, 'Tortilla', '1', 'piece'),
(2, 'Black Beans', '1', 'cup'),
(2, 'Rice', '1', 'cup'),
(2, 'Avocado', '1', 'piece'),
(2, 'Salsa', '2', 'tablespoons');

-- Insert Sample Ingredients for Recipe ID 3 (Chocolate Cake)
INSERT INTO ingredients (recipe_id, name, quantity, unit) VALUES
(3, 'Flour', '200', 'grams'),
(3, 'Sugar', '150', 'grams'),
(3, 'Cocoa', '50', 'grams'),
(3, 'Butter', '100', 'grams'),
(3, 'Eggs', '2', 'pieces');

-- Insert Sample Ingredients for Recipe ID 4 (Sushi Rolls)
INSERT INTO ingredients (recipe_id, name, quantity, unit) VALUES
(4, 'Rice', '300', 'grams'),
(4, 'Nori', '4', 'sheets'),
(4, 'Salmon', '150', 'grams'),
(4, 'Cucumber', '1', 'piece'),
(4, 'Avocado', '1', 'piece');

-- Insert Sample Ingredients for Recipe ID 5 (Tacos)
INSERT INTO ingredients (recipe_id, name, quantity, unit) VALUES
(5, 'Tortillas', '2', 'pieces'),
(5, 'Ground Beef', '300', 'grams'),
(5, 'Cheese', '50', 'grams'),
(5, 'Lettuce', '1', 'cup'),
(5, 'Salsa', '2', 'tablespoons');

CREATE TABLE shopping_list (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  item_name VARCHAR(255) NOT NULL,
  quantity VARCHAR(100),
  category VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
