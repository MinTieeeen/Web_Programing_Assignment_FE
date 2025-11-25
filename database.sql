-- Database for Game Store Project
-- Created based on erd-ltw (1).drawio

DROP DATABASE IF EXISTS game_store;
CREATE DATABASE game_store CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE game_store;

-- --------------------------------------------------------
-- Users Table (Combines Customer and Admin)
-- --------------------------------------------------------
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    dob DATE,
    avatar VARCHAR(255),
    balance DECIMAL(10, 2) DEFAULT 0.00,
    start_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    role ENUM('customer', 'admin') DEFAULT 'customer',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- --------------------------------------------------------
-- Publishers Table
-- --------------------------------------------------------
CREATE TABLE publishers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    location VARCHAR(255),
    tax_code VARCHAR(50),
    description TEXT
);

-- --------------------------------------------------------
-- Categories Table
-- --------------------------------------------------------
CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT
);

-- --------------------------------------------------------
-- Games Table
-- --------------------------------------------------------
CREATE TABLE games (
    id INT AUTO_INCREMENT PRIMARY KEY,
    publisher_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    cost DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    description TEXT,
    version VARCHAR(20),
    download_num INT DEFAULT 0,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending', -- For Admin approval
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (publisher_id) REFERENCES publishers(id) ON DELETE CASCADE
);

-- --------------------------------------------------------
-- Game Categories Junction Table
-- --------------------------------------------------------
CREATE TABLE game_categories (
    game_id INT NOT NULL,
    category_id INT NOT NULL,
    PRIMARY KEY (game_id, category_id),
    FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

-- --------------------------------------------------------
-- Libraries Table (User's owned games collection)
-- --------------------------------------------------------
CREATE TABLE libraries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    name VARCHAR(100) DEFAULT 'My Library',
    download_num INT DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- --------------------------------------------------------
-- Library Games Junction Table
-- --------------------------------------------------------
CREATE TABLE library_games (
    library_id INT NOT NULL,
    game_id INT NOT NULL,
    added_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (library_id, game_id),
    FOREIGN KEY (library_id) REFERENCES libraries(id) ON DELETE CASCADE,
    FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE
);

-- --------------------------------------------------------
-- Wishlists Table
-- --------------------------------------------------------
CREATE TABLE wishlists (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    name VARCHAR(100) DEFAULT 'My Wishlist',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- --------------------------------------------------------
-- Wishlist Games Junction Table
-- --------------------------------------------------------
CREATE TABLE wishlist_games (
    wishlist_id INT NOT NULL,
    game_id INT NOT NULL,
    added_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (wishlist_id, game_id),
    FOREIGN KEY (wishlist_id) REFERENCES wishlists(id) ON DELETE CASCADE,
    FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE
);

-- --------------------------------------------------------
-- Carts Table (Functions as Orders)
-- --------------------------------------------------------
CREATE TABLE carts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    status ENUM('active', 'completed', 'cancelled') DEFAULT 'active',
    payment_method VARCHAR(50),
    total_amount DECIMAL(10, 2) DEFAULT 0.00,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- --------------------------------------------------------
-- Cart Games Junction Table
-- --------------------------------------------------------
CREATE TABLE cart_games (
    cart_id INT NOT NULL,
    game_id INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL, -- Snapshot of price at purchase
    PRIMARY KEY (cart_id, game_id),
    FOREIGN KEY (cart_id) REFERENCES carts(id) ON DELETE CASCADE,
    FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE
);

-- --------------------------------------------------------
-- Reviews Table
-- --------------------------------------------------------
CREATE TABLE reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    game_id INT NOT NULL,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE
);

-- --------------------------------------------------------
-- Sample Data (Optional - Uncomment to use)
-- --------------------------------------------------------

-- INSERT INTO users (username, password, first_name, last_name, email, role) VALUES 
-- ('admin', 'hashed_password', 'Admin', 'User', 'admin@example.com', 'admin'),
-- ('user1', 'hashed_password', 'John', 'Doe', 'john@example.com', 'customer');

-- INSERT INTO categories (name, description) VALUES 
-- ('Action', 'Action-packed games'),
-- ('RPG', 'Role-playing games');

-- INSERT INTO publishers (name, location) VALUES 
-- ('Nintendo', 'Japan'),
-- ('Ubisoft', 'France');
