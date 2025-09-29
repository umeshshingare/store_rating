CREATE DATABASE stores;

USE stores;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(60) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  address VARCHAR(400),
  password VARCHAR(255) NOT NULL,
  role ENUM('admin','user','store_owner') DEFAULT 'user'
);

CREATE TABLE stores (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  address VARCHAR(400),
  owner_id INT,
  FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE ratings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  store_id INT,
  rating INT CHECK(rating BETWEEN 1 AND 5),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE
);
