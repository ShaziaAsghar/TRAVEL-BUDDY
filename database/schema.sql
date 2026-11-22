CREATE DATABASE IF NOT EXISTS travel_buddy CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE travel_buddy;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(190) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('user','admin') NOT NULL DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE user_preferences (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL UNIQUE,
  travel_style VARCHAR(60),
  budget_range DECIMAL(12,2),
  preferred_region VARCHAR(120),
  interests TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE TABLE destinations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  region VARCHAR(120),
  description TEXT,
  estimated_daily_cost DECIMAL(12,2),
  best_season VARCHAR(120),
  safety_notes TEXT
);
CREATE TABLE activities (
  id INT AUTO_INCREMENT PRIMARY KEY,
  destination_id INT NOT NULL,
  name VARCHAR(150) NOT NULL,
  category VARCHAR(80),
  estimated_cost DECIMAL(12,2) DEFAULT 0,
  FOREIGN KEY (destination_id) REFERENCES destinations(id) ON DELETE CASCADE
);
CREATE TABLE hotels (
  id INT AUTO_INCREMENT PRIMARY KEY,
  destination_id INT NOT NULL,
  name VARCHAR(150) NOT NULL,
  estimated_nightly_cost DECIMAL(12,2),
  FOREIGN KEY (destination_id) REFERENCES destinations(id) ON DELETE CASCADE
);
CREATE TABLE restaurants (
  id INT AUTO_INCREMENT PRIMARY KEY,
  destination_id INT NOT NULL,
  name VARCHAR(150) NOT NULL,
  cuisine VARCHAR(100),
  estimated_meal_cost DECIMAL(12,2),
  FOREIGN KEY (destination_id) REFERENCES destinations(id) ON DELETE CASCADE
);
CREATE TABLE trips (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  destination_id INT,
  title VARCHAR(180),
  start_date DATE,
  duration_days INT NOT NULL,
  budget DECIMAL(12,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (destination_id) REFERENCES destinations(id) ON DELETE SET NULL
);
CREATE TABLE itineraries (
  id INT AUTO_INCREMENT PRIMARY KEY,
  trip_id INT NOT NULL,
  day_number INT NOT NULL,
  title VARCHAR(180),
  description TEXT,
  FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE
);
CREATE TABLE itinerary_activities (
  id INT AUTO_INCREMENT PRIMARY KEY,
  itinerary_id INT NOT NULL,
  activity_id INT,
  activity_name VARCHAR(180),
  planned_time VARCHAR(50),
  FOREIGN KEY (itinerary_id) REFERENCES itineraries(id) ON DELETE CASCADE,
  FOREIGN KEY (activity_id) REFERENCES activities(id) ON DELETE SET NULL
);
CREATE TABLE reviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  destination_id INT NOT NULL,
  rating TINYINT NOT NULL,
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (destination_id) REFERENCES destinations(id) ON DELETE CASCADE,
  CHECK (rating BETWEEN 1 AND 5)
);
CREATE TABLE saved_destinations (
  user_id INT NOT NULL,
  destination_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, destination_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (destination_id) REFERENCES destinations(id) ON DELETE CASCADE
);
